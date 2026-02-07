import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireSuperAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { logAudit } from '../middleware/auditLog.js';

const router = express.Router();

// Get all homepage content (public)
router.get('/content', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM homepage_content WHERE is_active = true ORDER BY content_type, display_order'
    );

    // Group by content type
    const grouped = {
      hero_banner: result.rows.find(c => c.content_type === 'banner'),
      offers: result.rows.filter(c => c.content_type === 'offer_card'),
      testimonials: result.rows.filter(c => c.content_type === 'testimonial')
    };

    res.json({
      success: true,
      content: grouped
    });
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch homepage content'
    });
  }
});

// Get all homepage content for admin (includes inactive)
router.get('/admin/content', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM homepage_content ORDER BY content_type, display_order'
    );

    res.json({
      success: true,
      content: result.rows
    });
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch homepage content'
    });
  }
});

// Get single content item
router.get('/admin/content/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM homepage_content WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    res.json({
      success: true,
      content: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content'
    });
  }
});

// Update homepage content
router.put('/admin/content/:id', authenticateToken, requireSuperAdmin, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, link_url, display_order, is_active } = req.body;

    // Check if content exists
    const existing = await pool.query(
      'SELECT * FROM homepage_content WHERE id = $1',
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Build update query
    let updateFields = [];
    let updateValues = [];
    let paramCount = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramCount++}`);
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramCount++}`);
      updateValues.push(description);
    }
    if (link_url !== undefined) {
      updateFields.push(`link_url = $${paramCount++}`);
      updateValues.push(link_url);
    }
    if (display_order !== undefined) {
      updateFields.push(`display_order = $${paramCount++}`);
      updateValues.push(display_order);
    }
    if (is_active !== undefined) {
      updateFields.push(`is_active = $${paramCount++}`);
      updateValues.push(is_active === 'true' || is_active === true);
    }
    if (req.file) {
      updateFields.push(`image_url = $${paramCount++}`);
      updateValues.push(`/uploads/${req.file.filename}`);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    updateValues.push(id);

    await pool.query(
      `UPDATE homepage_content SET ${updateFields.join(', ')} WHERE id = $${paramCount}`,
      updateValues
    );

    // Get updated content
    const updated = await pool.query(
      'SELECT * FROM homepage_content WHERE id = $1',
      [id]
    );

    // Log audit
    await logAudit(
      req.user.id,
      'UPDATE',
      'homepage_content',
      id,
      `Updated homepage content: ${existing.rows[0].section}`
    );

    res.json({
      success: true,
      message: 'Content updated successfully',
      content: updated.rows[0]
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update content'
    });
  }
});

// Create new homepage content
router.post('/admin/content', authenticateToken, requireSuperAdmin, upload.single('image'), async (req, res) => {
  try {
    const { section, content_type, title, description, link_url, display_order } = req.body;

    if (!section || !content_type) {
      return res.status(400).json({
        success: false,
        message: 'Section and content type are required'
      });
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO homepage_content (section, content_type, title, description, image_url, link_url, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [section, content_type, title, description, image_url, link_url, display_order || 0]
    );

    // Log audit
    await logAudit(
      req.user.id,
      'CREATE',
      'homepage_content',
      result.rows[0].id,
      `Created homepage content: ${section}`
    );

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      content: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create content'
    });
  }
});

// Delete homepage content
router.delete('/admin/content/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if content exists
    const existing = await pool.query(
      'SELECT * FROM homepage_content WHERE id = $1',
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    await pool.query('DELETE FROM homepage_content WHERE id = $1', [id]);

    // Log audit
    await logAudit(
      req.user.id,
      'DELETE',
      'homepage_content',
      id,
      `Deleted homepage content: ${existing.rows[0].section}`
    );

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete content'
    });
  }
});

export default router;
