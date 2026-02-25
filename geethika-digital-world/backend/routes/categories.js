import express from 'express';
import pool from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';

const router = express.Router();

// Get all categories (public)
router.get('/', cacheMiddleware(300), async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, name, slug, icon, image_url
      FROM categories
      ORDER BY name ASC
      `
    );
    res.json({ categories: result.rows });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create category (admin only)
router.post('/', authenticate, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, slug, icon } = req.body;
    let image_url = null;

    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const result = await pool.query(
      'INSERT INTO categories (name, slug, icon, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, slug || name.toLowerCase().replace(/\s+/g, '-'), icon, image_url]
    );

    invalidateCache((key) => key.startsWith('/api/categories'));

    res.status(201).json({
      message: 'Category created successfully',
      category: result.rows[0]
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category (admin only)
router.put('/:id', authenticate, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, icon } = req.body;

    let updateQuery = 'UPDATE categories SET name = $1, slug = $2, icon = $3';
    let updateValues = [name, slug, icon];
    let paramCount = 4;

    if (req.file) {
      updateQuery += `, image_url = $${paramCount}`;
      updateValues.push(`/uploads/${req.file.filename}`);
      paramCount++;
    }

    updateQuery += ` WHERE id = $${paramCount} RETURNING *`;
    updateValues.push(id);

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    invalidateCache((key) => key.startsWith('/api/categories'));

    res.json({
      message: 'Category updated successfully',
      category: result.rows[0]
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    invalidateCache((key) => key.startsWith('/api/categories'));
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
