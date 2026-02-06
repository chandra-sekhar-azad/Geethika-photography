import express from 'express';
import pool from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Get all gallery images (public)
router.get('/', async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    
    let query = 'SELECT * FROM gallery WHERE 1=1';
    const params = [];
    
    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }
    
    query += ' ORDER BY created_at DESC';
    
    if (limit) {
      params.push(limit);
      query += ` LIMIT $${params.length}`;
    }
    
    const result = await pool.query(query, params);
    res.json({ images: result.rows });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
});

// Upload gallery image (admin only)
router.post('/', authenticate, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category = 'general' } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    const result = await pool.query(
      `INSERT INTO gallery (title, description, image_url, category, uploaded_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, imageUrl, category, req.user.id]
    );
    
    // Log admin action
    try {
      const adminId = req.user?.id;
      const adminEmail = req.user?.email;
      const adminName = req.user?.name;
      const ipAddress = req.ip || req.connection?.remoteAddress || 'unknown';
      const userAgent = req.get('user-agent');

      await pool.query(
        `INSERT INTO audit_logs 
         (admin_id, admin_email, admin_name, action, entity_type, entity_id, entity_name, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [adminId, adminEmail, adminName, 'create', 'gallery', result.rows[0].id, title, ipAddress, userAgent]
      );
    } catch (auditError) {
      console.error('Error logging admin action:', auditError);
    }
    
    res.status(201).json({ 
      message: 'Image uploaded successfully',
      image: result.rows[0]
    });
  } catch (error) {
    console.error('Upload gallery image error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Update gallery image (admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;
    
    const result = await pool.query(
      `UPDATE gallery 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category = COALESCE($3, category),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [title, description, category, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    // Log admin action
    try {
      const adminId = req.user?.id;
      const adminEmail = req.user?.email;
      const adminName = req.user?.name;
      const ipAddress = req.ip || req.connection?.remoteAddress || 'unknown';
      const userAgent = req.get('user-agent');

      await pool.query(
        `INSERT INTO audit_logs 
         (admin_id, admin_email, admin_name, action, entity_type, entity_id, entity_name, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [adminId, adminEmail, adminName, 'update', 'gallery', id, title, ipAddress, userAgent]
      );
    } catch (auditError) {
      console.error('Error logging admin action:', auditError);
    }
    
    res.json({ 
      message: 'Image updated successfully',
      image: result.rows[0]
    });
  } catch (error) {
    console.error('Update gallery image error:', error);
    res.status(500).json({ error: 'Failed to update image' });
  }
});

// Delete gallery image (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM gallery WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    // Log admin action
    try {
      const adminId = req.user?.id;
      const adminEmail = req.user?.email;
      const adminName = req.user?.name;
      const ipAddress = req.ip || req.connection?.remoteAddress || 'unknown';
      const userAgent = req.get('user-agent');

      await pool.query(
        `INSERT INTO audit_logs 
         (admin_id, admin_email, admin_name, action, entity_type, entity_id, entity_name, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [adminId, adminEmail, adminName, 'delete', 'gallery', id, result.rows[0].title, ipAddress, userAgent]
      );
    } catch (auditError) {
      console.error('Error logging admin action:', auditError);
    }
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete gallery image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
