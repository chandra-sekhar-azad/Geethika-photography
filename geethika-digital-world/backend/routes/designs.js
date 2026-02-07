import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate, isAdmin } from '../middleware/auth.js';
import pkg from 'pg';

const { Pool } = pkg;
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Configure multer for design uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/designs/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'design-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image and PDF files are allowed'));
  }
});

// Get design approval details for an order item
router.get('/order-item/:orderItemId', authenticate, async (req, res) => {
  try {
    const { orderItemId } = req.params;

    const result = await pool.query(`
      SELECT da.*, oi.product_name, oi.customization_images, o.customer_id
      FROM design_approvals da
      JOIN order_items oi ON da.order_item_id = oi.id
      JOIN orders o ON oi.order_id = o.id
      WHERE da.order_item_id = $1
    `, [orderItemId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Design approval not found' });
    }

    const design = result.rows[0];

    // Check if user has access (customer or admin)
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin' && req.user.id !== design.customer_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ design });
  } catch (error) {
    console.error('Error fetching design approval:', error);
    res.status(500).json({ error: 'Failed to fetch design approval' });
  }
});

// Admin: Upload designed image
router.post('/upload/:orderItemId', authenticate, isAdmin, upload.single('design'), async (req, res) => {
  try {
    const { orderItemId } = req.params;
    const designImageUrl = `/uploads/designs/${req.file.filename}`;

    // Check if design approval exists
    const existing = await pool.query(
      'SELECT id FROM design_approvals WHERE order_item_id = $1',
      [orderItemId]
    );

    let result;
    if (existing.rows.length > 0) {
      // Update existing
      result = await pool.query(`
        UPDATE design_approvals 
        SET admin_designed_image = $1, 
            status = 'pending_approval',
            updated_at = CURRENT_TIMESTAMP
        WHERE order_item_id = $2
        RETURNING *
      `, [designImageUrl, orderItemId]);
    } else {
      // Create new
      result = await pool.query(`
        INSERT INTO design_approvals (order_item_id, admin_designed_image, status)
        VALUES ($1, $2, 'pending_approval')
        RETURNING *
      `, [orderItemId, designImageUrl]);
    }

    res.json({ 
      success: true, 
      design: result.rows[0],
      message: 'Design uploaded successfully' 
    });
  } catch (error) {
    console.error('Error uploading design:', error);
    res.status(500).json({ error: 'Failed to upload design' });
  }
});

// Customer: Approve design
router.post('/approve/:orderItemId', authenticate, async (req, res) => {
  try {
    const { orderItemId } = req.params;

    // Verify customer owns this order
    const orderCheck = await pool.query(`
      SELECT o.customer_id 
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE oi.id = $1
    `, [orderItemId]);

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }

    if (orderCheck.rows[0].customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(`
      UPDATE design_approvals 
      SET status = 'approved',
          approved_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE order_item_id = $1
      RETURNING *
    `, [orderItemId]);

    res.json({ 
      success: true, 
      design: result.rows[0],
      message: 'Design approved successfully' 
    });
  } catch (error) {
    console.error('Error approving design:', error);
    res.status(500).json({ error: 'Failed to approve design' });
  }
});

// Customer: Request redesign
router.post('/request-revision/:orderItemId', authenticate, async (req, res) => {
  try {
    const { orderItemId } = req.params;
    const { feedback } = req.body;

    // Verify customer owns this order
    const orderCheck = await pool.query(`
      SELECT o.customer_id 
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE oi.id = $1
    `, [orderItemId]);

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }

    if (orderCheck.rows[0].customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(`
      UPDATE design_approvals 
      SET status = 'revision_requested',
          customer_feedback = $1,
          revision_count = revision_count + 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE order_item_id = $2
      RETURNING *
    `, [feedback, orderItemId]);

    res.json({ 
      success: true, 
      design: result.rows[0],
      message: 'Revision requested successfully' 
    });
  } catch (error) {
    console.error('Error requesting revision:', error);
    res.status(500).json({ error: 'Failed to request revision' });
  }
});

// Get all designs pending approval (Admin)
router.get('/pending', authenticate, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        da.*,
        oi.product_name,
        oi.customization_images,
        o.order_number,
        o.customer_name,
        o.customer_phone
      FROM design_approvals da
      JOIN order_items oi ON da.order_item_id = oi.id
      JOIN orders o ON oi.order_id = o.id
      WHERE da.status IN ('pending_design', 'revision_requested')
      ORDER BY da.created_at DESC
    `);

    res.json({ designs: result.rows });
  } catch (error) {
    console.error('Error fetching pending designs:', error);
    res.status(500).json({ error: 'Failed to fetch pending designs' });
  }
});

export default router;
