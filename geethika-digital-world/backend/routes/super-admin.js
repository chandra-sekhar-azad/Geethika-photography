import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { authenticate, isSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all admins (super admin only)
router.get('/admins', authenticate, isSuperAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, email, role, phone, created_at, updated_at
      FROM users 
      WHERE role IN ('admin', 'super_admin')
      ORDER BY 
        CASE 
          WHEN role = 'super_admin' THEN 1
          WHEN role = 'admin' THEN 2
          ELSE 3
        END,
        created_at DESC
    `);

    res.json({
      admins: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

// Create new admin (super admin only)
router.post('/admins',
  authenticate,
  isSuperAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['admin', 'super_admin']).withMessage('Invalid role')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, role, phone } = req.body;

      // Check if email already exists
      const existing = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create admin
      const result = await pool.query(`
        INSERT INTO users (name, email, password, role, phone)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, email, role, phone, created_at
      `, [name, email, hashedPassword, role, phone || null]);

      res.status(201).json({
        message: 'Admin created successfully',
        admin: result.rows[0]
      });
    } catch (error) {
      console.error('Create admin error:', error);
      res.status(500).json({ error: 'Failed to create admin' });
    }
  }
);

// Update admin (super admin only)
router.put('/admins/:id',
  authenticate,
  isSuperAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, role, phone, password } = req.body;

      // Prevent super admin from demoting themselves
      if (parseInt(id) === req.user.userId && role !== 'super_admin') {
        return res.status(400).json({ error: 'Cannot change your own role' });
      }

      // Check if admin exists
      const existing = await pool.query(
        'SELECT * FROM users WHERE id = $1 AND role IN ($2, $3)',
        [id, 'admin', 'super_admin']
      );

      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      // Build update query
      let query = 'UPDATE users SET ';
      const params = [];
      let paramCount = 1;

      if (name) {
        query += `name = $${paramCount}, `;
        params.push(name);
        paramCount++;
      }

      if (email) {
        query += `email = $${paramCount}, `;
        params.push(email);
        paramCount++;
      }

      if (role) {
        query += `role = $${paramCount}, `;
        params.push(role);
        paramCount++;
      }

      if (phone !== undefined) {
        query += `phone = $${paramCount}, `;
        params.push(phone);
        paramCount++;
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query += `password = $${paramCount}, `;
        params.push(hashedPassword);
        paramCount++;
      }

      query += `updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING id, name, email, role, phone, updated_at`;
      params.push(id);

      const result = await pool.query(query, params);

      res.json({
        message: 'Admin updated successfully',
        admin: result.rows[0]
      });
    } catch (error) {
      console.error('Update admin error:', error);
      res.status(500).json({ error: 'Failed to update admin' });
    }
  }
);

// Delete admin (super admin only)
router.delete('/admins/:id',
  authenticate,
  isSuperAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Prevent super admin from deleting themselves
      if (parseInt(id) === req.user.userId) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      // Check if admin exists
      const existing = await pool.query(
        'SELECT * FROM users WHERE id = $1 AND role IN ($2, $3)',
        [id, 'admin', 'super_admin']
      );

      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      // Delete admin
      await pool.query('DELETE FROM users WHERE id = $1', [id]);

      res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
      console.error('Delete admin error:', error);
      res.status(500).json({ error: 'Failed to delete admin' });
    }
  }
);

// Get system statistics (super admin only)
router.get('/stats', authenticate, isSuperAdmin, async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE role = 'customer') as total_customers,
        (SELECT COUNT(*) FROM users WHERE role = 'admin') as total_admins,
        (SELECT COUNT(*) FROM users WHERE role = 'super_admin') as total_super_admins,
        (SELECT COUNT(*) FROM products) as total_products,
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT COUNT(*) FROM categories) as total_categories,
        (SELECT COALESCE(SUM(total), 0) FROM orders WHERE payment_status = 'paid') as total_revenue
    `);

    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all users (super admin only)
router.get('/users', authenticate, isSuperAdmin, async (req, res) => {
  try {
    const { role, search, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT id, name, email, role, phone, created_at FROM users WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (role) {
      query += ` AND role = $${paramCount}`;
      params.push(role);
      paramCount++;
    }

    if (search) {
      query += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      users: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
