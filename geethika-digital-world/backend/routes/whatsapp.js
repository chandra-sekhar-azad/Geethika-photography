import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { logAdminAction } from '../middleware/auditLog.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate, isAdmin);

// Get all templates
router.get('/templates', async (req, res) => {
  try {
    const { category, occasion, active } = req.query;
    
    let query = 'SELECT * FROM whatsapp_templates WHERE 1=1';
    const params = [];
    let paramCount = 1;
    
    if (category) {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }
    
    if (occasion) {
      query += ` AND occasion = $${paramCount}`;
      params.push(occasion);
      paramCount++;
    }
    
    if (active !== undefined) {
      query += ` AND is_active = $${paramCount}`;
      params.push(active === 'true');
      paramCount++;
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    
    res.json({
      templates: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Get single template
router.get('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM whatsapp_templates WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// Create template
router.post('/templates',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('category').isIn(['promotional', 'transactional', 'notification']).withMessage('Invalid category'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { name, category, occasion, subject, message, variables } = req.body;
      
      const result = await pool.query(`
        INSERT INTO whatsapp_templates 
        (name, category, occasion, subject, message, variables, created_by, created_by_name)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        name,
        category,
        occasion || null,
        subject,
        message,
        variables ? JSON.stringify(variables) : null,
        req.user.id,
        req.user.name
      ]);
      
      // Log the action
      await logAdminAction(
        req,
        'CREATE',
        'whatsapp_template',
        result.rows[0].id,
        result.rows[0].name,
        { created: result.rows[0] }
      );
      
      res.status(201).json({
        message: 'Template created successfully',
        template: result.rows[0]
      });
    } catch (error) {
      console.error('Create template error:', error);
      res.status(500).json({ error: 'Failed to create template' });
    }
  }
);

// Update template
router.put('/templates/:id',
  [
    body('name').optional().trim().notEmpty(),
    body('category').optional().isIn(['promotional', 'transactional', 'notification']),
    body('subject').optional().trim().notEmpty(),
    body('message').optional().trim().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { id } = req.params;
      const { name, category, occasion, subject, message, variables, is_active } = req.body;
      
      // Get old data
      const oldData = await pool.query('SELECT * FROM whatsapp_templates WHERE id = $1', [id]);
      
      if (oldData.rows.length === 0) {
        return res.status(404).json({ error: 'Template not found' });
      }
      
      const result = await pool.query(`
        UPDATE whatsapp_templates SET
          name = COALESCE($1, name),
          category = COALESCE($2, category),
          occasion = COALESCE($3, occasion),
          subject = COALESCE($4, subject),
          message = COALESCE($5, message),
          variables = COALESCE($6, variables),
          is_active = COALESCE($7, is_active),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *
      `, [name, category, occasion, subject, message, variables ? JSON.stringify(variables) : null, is_active, id]);
      
      // Log the action
      const { getChanges } = await import('../middleware/auditLog.js');
      const changes = getChanges(oldData.rows[0], result.rows[0]);
      await logAdminAction(
        req,
        'UPDATE',
        'whatsapp_template',
        result.rows[0].id,
        result.rows[0].name,
        changes
      );
      
      res.json({
        message: 'Template updated successfully',
        template: result.rows[0]
      });
    } catch (error) {
      console.error('Update template error:', error);
      res.status(500).json({ error: 'Failed to update template' });
    }
  }
);

// Delete template
router.delete('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const template = await pool.query('SELECT * FROM whatsapp_templates WHERE id = $1', [id]);
    
    if (template.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    await pool.query('DELETE FROM whatsapp_templates WHERE id = $1', [id]);
    
    // Log the action
    await logAdminAction(
      req,
      'DELETE',
      'whatsapp_template',
      id,
      template.rows[0].name,
      { deleted: template.rows[0] }
    );
    
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

// Get customers for campaign
router.get('/customers', async (req, res) => {
  try {
    const { filter } = req.query;
    
    let query = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        COUNT(DISTINCT o.id) as order_count,
        COALESCE(SUM(CASE WHEN o.payment_status = 'paid' THEN o.total ELSE 0 END), 0) as total_spent,
        MAX(o.created_at) as last_order_date
      FROM users u
      LEFT JOIN orders o ON u.email = o.customer_email OR u.phone = o.customer_phone
      WHERE u.role = 'customer' AND u.phone IS NOT NULL AND u.phone != ''
    `;
    
    const params = [];
    
    if (filter === 'active') {
      query += ` AND EXISTS (SELECT 1 FROM orders WHERE (customer_email = u.email OR customer_phone = u.phone) AND created_at >= NOW() - INTERVAL '90 days')`;
    } else if (filter === 'inactive') {
      query += ` AND NOT EXISTS (SELECT 1 FROM orders WHERE (customer_email = u.email OR customer_phone = u.phone) AND created_at >= NOW() - INTERVAL '90 days')`;
    } else if (filter === 'high_value') {
      query += ` HAVING COALESCE(SUM(CASE WHEN o.payment_status = 'paid' THEN o.total ELSE 0 END), 0) > 5000`;
    }
    
    query += ' GROUP BY u.id, u.name, u.email, u.phone ORDER BY total_spent DESC';
    
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

// Create campaign
router.post('/campaigns',
  [
    body('template_id').isInt().withMessage('Template ID is required'),
    body('campaign_name').trim().notEmpty().withMessage('Campaign name is required'),
    body('target_audience').isIn(['all', 'active', 'inactive', 'high_value', 'custom']).withMessage('Invalid target audience')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { template_id, campaign_name, target_audience, customer_filter, scheduled_at } = req.body;
      
      // Get customer count
      let customerQuery = `
        SELECT COUNT(DISTINCT u.id) as count
        FROM users u
        LEFT JOIN orders o ON u.email = o.customer_email OR u.phone = o.customer_phone
        WHERE u.role = 'customer' AND u.phone IS NOT NULL AND u.phone != ''
      `;
      
      if (target_audience === 'active') {
        customerQuery += ` AND EXISTS (SELECT 1 FROM orders WHERE (customer_email = u.email OR customer_phone = u.phone) AND created_at >= NOW() - INTERVAL '90 days')`;
      } else if (target_audience === 'inactive') {
        customerQuery += ` AND NOT EXISTS (SELECT 1 FROM orders WHERE (customer_email = u.email OR customer_phone = u.phone) AND created_at >= NOW() - INTERVAL '90 days')`;
      }
      
      const customerCount = await pool.query(customerQuery);
      
      const result = await pool.query(`
        INSERT INTO whatsapp_campaigns 
        (template_id, campaign_name, target_audience, customer_filter, total_recipients, status, scheduled_at, created_by, created_by_name)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        template_id,
        campaign_name,
        target_audience,
        customer_filter ? JSON.stringify(customer_filter) : null,
        parseInt(customerCount.rows[0].count),
        scheduled_at ? 'scheduled' : 'draft',
        scheduled_at || null,
        req.user.id,
        req.user.name
      ]);
      
      // Log the action
      await logAdminAction(
        req,
        'CREATE',
        'whatsapp_campaign',
        result.rows[0].id,
        result.rows[0].campaign_name,
        { created: result.rows[0] }
      );
      
      res.status(201).json({
        message: 'Campaign created successfully',
        campaign: result.rows[0]
      });
    } catch (error) {
      console.error('Create campaign error:', error);
      res.status(500).json({ error: 'Failed to create campaign' });
    }
  }
);

// Get all campaigns
router.get('/campaigns', async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `
      SELECT 
        c.*,
        t.name as template_name,
        t.subject as template_subject
      FROM whatsapp_campaigns c
      LEFT JOIN whatsapp_templates t ON c.template_id = t.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;
    
    if (status) {
      query += ` AND c.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }
    
    query += ' ORDER BY c.created_at DESC';
    
    const result = await pool.query(query, params);
    
    res.json({
      campaigns: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// Send test message
router.post('/test-message',
  [
    body('template_id').isInt().withMessage('Template ID is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('variables').optional().isObject()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { template_id, phone, variables } = req.body;
      
      // Get template
      const template = await pool.query('SELECT * FROM whatsapp_templates WHERE id = $1', [template_id]);
      
      if (template.rows.length === 0) {
        return res.status(404).json({ error: 'Template not found' });
      }
      
      // Replace variables in message
      let message = template.rows[0].message;
      if (variables) {
        Object.keys(variables).forEach(key => {
          message = message.replace(new RegExp(`{{${key}}}`, 'g'), variables[key]);
        });
      }
      
      // In production, integrate with WhatsApp Business API
      // For now, just return the formatted message
      
      res.json({
        message: 'Test message prepared',
        phone,
        content: message,
        note: 'In production, this would be sent via WhatsApp Business API'
      });
    } catch (error) {
      console.error('Test message error:', error);
      res.status(500).json({ error: 'Failed to send test message' });
    }
  }
);

// Get template statistics
router.get('/templates/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    
    const stats = await pool.query(`
      SELECT 
        t.usage_count,
        t.last_used_at,
        COUNT(DISTINCT c.id) as campaign_count,
        COALESCE(SUM(c.sent_count), 0) as total_sent,
        COALESCE(SUM(c.failed_count), 0) as total_failed
      FROM whatsapp_templates t
      LEFT JOIN whatsapp_campaigns c ON t.id = c.template_id
      WHERE t.id = $1
      GROUP BY t.id, t.usage_count, t.last_used_at
    `, [id]);
    
    if (stats.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Get template stats error:', error);
    res.status(500).json({ error: 'Failed to fetch template statistics' });
  }
});

export default router;
