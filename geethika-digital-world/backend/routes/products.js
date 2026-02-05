import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { logAdminAction, getChanges } from '../middleware/auditLog.js';

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, valentine, search, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;
    const params = [];
    let paramCount = 1;

    if (category) {
      query += ` AND c.slug = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (valentine === 'true') {
      query += ` AND p.valentine_special = true`;
    }

    if (search) {
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      products: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1 AND p.is_active = true
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin only)
router.post('/',
  authenticate,
  isAdmin,
  upload.single('image'),
  [
    body('name').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('category_id').isInt()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        name,
        slug,
        description,
        category_id,
        price,
        discount = 0,
        customizable = false,
        customization_options,
        valentine_special = false,
        stock_quantity = 0
      } = req.body;

      let imageUrl = null;
      let imagePublicId = null;

      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file, 'products');
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.publicId;
      }

      const result = await pool.query(`
        INSERT INTO products (
          name, slug, description, category_id, price, discount,
          image_url, image_public_id, customizable, customization_options,
          valentine_special, stock_quantity
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `, [
        name,
        slug || name.toLowerCase().replace(/\s+/g, '-'),
        description,
        category_id,
        price,
        discount,
        imageUrl,
        imagePublicId,
        customizable,
        customization_options ? JSON.parse(customization_options) : null,
        valentine_special,
        stock_quantity
      ]);

      // Log the action
      await logAdminAction(
        req,
        'CREATE',
        'product',
        result.rows[0].id,
        result.rows[0].name,
        { created: result.rows[0] }
      );

      res.status(201).json({
        message: 'Product created successfully',
        product: result.rows[0]
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
);

// Update product (admin only)
router.put('/:id',
  authenticate,
  isAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        category_id,
        price,
        discount,
        customizable,
        customization_options,
        valentine_special,
        stock_quantity,
        is_active
      } = req.body;

      // Get existing product
      const existing = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      let imageUrl = existing.rows[0].image_url;
      let imagePublicId = existing.rows[0].image_public_id;

      if (req.file) {
        // Delete old image
        if (imagePublicId) {
          await deleteFromCloudinary(imagePublicId);
        }
        // Upload new image
        const uploadResult = await uploadToCloudinary(req.file, 'products');
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.publicId;
      }

      const result = await pool.query(`
        UPDATE products SET
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          category_id = COALESCE($3, category_id),
          price = COALESCE($4, price),
          discount = COALESCE($5, discount),
          image_url = $6,
          image_public_id = $7,
          customizable = COALESCE($8, customizable),
          customization_options = COALESCE($9, customization_options),
          valentine_special = COALESCE($10, valentine_special),
          stock_quantity = COALESCE($11, stock_quantity),
          is_active = COALESCE($12, is_active),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $13
        RETURNING *
      `, [
        name,
        description,
        category_id,
        price,
        discount,
        imageUrl,
        imagePublicId,
        customizable,
        customization_options ? JSON.parse(customization_options) : null,
        valentine_special,
        stock_quantity,
        is_active,
        id
      ]);

      res.json({
        message: 'Product updated successfully',
        product: result.rows[0]
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }
);

// Delete product (admin only) - Actually deactivates if referenced in orders
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (product.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if product is referenced in orders
    const orderItems = await pool.query(
      'SELECT COUNT(*) FROM order_items WHERE product_id = $1',
      [id]
    );

    const isReferenced = parseInt(orderItems.rows[0].count) > 0;

    if (isReferenced) {
      // Product is in orders, so deactivate instead of delete
      await pool.query(
        'UPDATE products SET is_active = false WHERE id = $1',
        [id]
      );
      
      res.json({ 
        message: 'Product deactivated successfully (cannot delete as it exists in orders)',
        deactivated: true
      });
    } else {
      // Product not in orders, safe to delete
      
      // Try to delete image from Cloudinary (don't fail if it doesn't exist)
      if (product.rows[0].image_public_id) {
        try {
          await deleteFromCloudinary(product.rows[0].image_public_id);
        } catch (cloudinaryError) {
          console.warn('Failed to delete image from Cloudinary:', cloudinaryError.message);
        }
      }

      await pool.query('DELETE FROM products WHERE id = $1', [id]);

      res.json({ 
        message: 'Product deleted successfully',
        deleted: true
      });
    }
  } catch (error) {
    console.error('Delete product error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to delete product', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

export default router;
