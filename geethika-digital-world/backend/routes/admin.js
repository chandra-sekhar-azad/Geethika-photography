import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { logAdminAction, getChanges } from '../middleware/auditLog.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate, isAdmin);

// Dashboard Statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT COUNT(*) FROM orders WHERE order_status = 'pending') as pending_orders,
        (SELECT COUNT(*) FROM orders WHERE order_status = 'completed') as completed_orders,
        (SELECT COUNT(*) FROM products) as total_products,
        (SELECT COUNT(*) FROM users WHERE role = 'customer') as total_customers,
        (SELECT COALESCE(SUM(total), 0) FROM orders WHERE payment_status = 'paid') as total_revenue,
        (SELECT COALESCE(SUM(total), 0) FROM orders WHERE payment_status = 'paid' AND created_at >= CURRENT_DATE - INTERVAL '30 days') as monthly_revenue,
        (SELECT COALESCE(SUM(total), 0) FROM orders WHERE payment_status = 'paid' AND created_at >= CURRENT_DATE) as daily_revenue
    `);

    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Sales Report
router.get('/sales-report', async (req, res) => {
  try {
    const { start_date, end_date, group_by = 'day' } = req.query;

    let dateFormat;
    switch (group_by) {
      case 'month':
        dateFormat = 'YYYY-MM';
        break;
      case 'week':
        dateFormat = 'YYYY-IW';
        break;
      default:
        dateFormat = 'YYYY-MM-DD';
    }

    let query = `
      SELECT
        TO_CHAR(created_at, $1) as period,
        COUNT(*) as order_count,
        SUM(total) as total_sales,
        AVG(total) as average_order_value
      FROM orders
      WHERE payment_status = 'paid'
    `;

    const params = [dateFormat];
    let paramCount = 2;

    if (start_date) {
      query += ` AND created_at >= $${paramCount}`;
      params.push(start_date);
      paramCount++;
    }

    if (end_date) {
      query += ` AND created_at <= $${paramCount}`;
      params.push(end_date);
      paramCount++;
    }

    query += ` GROUP BY period ORDER BY period DESC`;

    const result = await pool.query(query, params);

    res.json({
      report: result.rows,
      summary: {
        total_orders: result.rows.reduce((sum, row) => sum + parseInt(row.order_count), 0),
        total_sales: result.rows.reduce((sum, row) => sum + parseFloat(row.total_sales), 0)
      }
    });
  } catch (error) {
    console.error('Sales report error:', error);
    res.status(500).json({ error: 'Failed to generate sales report' });
  }
});

// Top Products
router.get('/top-products', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.image_url,
        p.price,
        COUNT(oi.id) as order_count,
        SUM(oi.quantity) as total_quantity_sold,
        SUM(oi.quantity * oi.price) as total_revenue
      FROM products p
      INNER JOIN order_items oi ON p.id = oi.product_id
      INNER JOIN orders o ON oi.order_id = o.id
      WHERE o.payment_status = 'paid'
      GROUP BY p.id, p.name, p.image_url, p.price
      ORDER BY total_revenue DESC
      LIMIT $1
    `, [limit]);

    res.json(result.rows);
  } catch (error) {
    console.error('Top products error:', error);
    res.status(500).json({ error: 'Failed to fetch top products' });
  }
});

// Customer Database
router.get('/customers', async (req, res) => {
  try {
    const { search, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.phone,
        u.created_at,
        COUNT(DISTINCT CASE WHEN o.payment_status = 'paid' THEN o.id END) as total_orders,
        COALESCE(SUM(CASE WHEN o.payment_status = 'paid' THEN o.total ELSE 0 END), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.email = o.customer_email OR u.phone = o.customer_phone
      WHERE u.role = 'customer'
    `;

    const params = [];
    let paramCount = 1;

    if (search) {
      query += ` AND (u.name ILIKE $${paramCount} OR u.email ILIKE $${paramCount} OR u.phone ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ` GROUP BY u.id, u.name, u.email, u.phone, u.created_at`;
    query += ` ORDER BY total_spent DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      customers: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Create customer manually (admin only)
router.post('/customers',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').optional().isMobilePhone(),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone, password } = req.body;

      // Check if email already exists
      const existing = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Hash password (use default if not provided)
      const defaultPassword = password || 'Customer@123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // Create customer
      const result = await pool.query(`
        INSERT INTO users (name, email, password, phone, role)
        VALUES ($1, $2, $3, $4, 'customer')
        RETURNING id, name, email, phone, role, created_at
      `, [name, email, hashedPassword, phone || null]);

      // Log the action
      await logAdminAction(
        req,
        'CREATE',
        'customer',
        result.rows[0].id,
        result.rows[0].name,
        { created: result.rows[0] }
      );

      res.status(201).json({
        message: 'Customer created successfully',
        customer: result.rows[0],
        defaultPassword: password ? undefined : defaultPassword
      });
    } catch (error) {
      console.error('Create customer error:', error);
      res.status(500).json({ error: 'Failed to create customer' });
    }
  }
);

// Recent Activities
router.get('/recent-activities', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const result = await pool.query(`
      SELECT
        'order' as type,
        o.id,
        o.order_number as reference,
        o.customer_name as description,
        o.total as amount,
        o.order_status as status,
        o.created_at
      FROM orders o
      ORDER BY o.created_at DESC
      LIMIT $1
    `, [limit]);

    res.json(result.rows);
  } catch (error) {
    console.error('Recent activities error:', error);
    res.status(500).json({ error: 'Failed to fetch recent activities' });
  }
});

export default router;
