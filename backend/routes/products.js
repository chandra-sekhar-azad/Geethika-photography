import express from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { logAdminAction, getChanges } from '../middleware/auditLog.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';

const router = express.Router();

// Get all products (public)
router.get('/', cacheMiddleware(30), async (req, res) => {
  try {
    const { category, valentine, search } = req.query;
    const rawLimit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
    const rawOffset = Math.max(Number(req.query.offset) || 0, 0);

    const filter = { is_active: true };

    if (valentine === 'true') filter.valentine_special = true;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let query = Product.find(filter)
      .populate({ path: 'category_id', select: 'name slug' })
      .sort({ createdAt: -1 })
      .skip(rawOffset)
      .limit(rawLimit);

    if (category) {
      // Need to filter by category slug - use aggregate or lookup
      const Category = (await import('../models/Category.js')).default;
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        filter.category_id = cat._id;
      } else {
        return res.json({ products: [], count: 0 });
      }
      query = Product.find(filter)
        .populate({ path: 'category_id', select: 'name slug' })
        .sort({ createdAt: -1 })
        .skip(rawOffset)
        .limit(rawLimit);
    }

    const products = await query.lean();

    const formatted = products.map((p) => ({
      ...p,
      id: p._id,
      category_name: p.category_id?.name || null,
      category_slug: p.category_id?.slug || null,
    }));

    res.json({ products: formatted, count: formatted.length });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product (public)
router.get('/:id', cacheMiddleware(60), async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, is_active: true })
      .populate({ path: 'category_id', select: 'name slug' })
      .lean();

    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json({
      ...product,
      id: product._id,
      category_name: product.category_id?.name || null,
      category_slug: product.category_id?.slug || null,
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin only)
router.post('/', authenticate, isAdmin, upload.single('image'),
  [
    body('name').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const {
        name, slug, description, category_id, price,
        discount = 0, customizable = false, customization_options,
        valentine_special = false, special_offer = false, stock_quantity = 0
      } = req.body;

      let image_url = null;
      let image_public_id = null;

      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file, 'products');
        image_url = uploadResult.url;
        image_public_id = uploadResult.publicId;
      }

      const toBoolean = (val) => val === true || val === 'true';

      const product = await Product.create({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description,
        category_id: category_id || null,
        price,
        discount,
        image_url,
        image_public_id,
        customizable: toBoolean(customizable),
        customization_options: customization_options
          ? (typeof customization_options === 'string' ? JSON.parse(customization_options) : customization_options)
          : null,
        valentine_special: toBoolean(valentine_special),
        special_offer: toBoolean(special_offer),
        stock_quantity,
      });

      await logAdminAction(req, 'CREATE', 'product', product._id, product.name, { created: product });
      invalidateCache((key) => key.startsWith('/api/products'));

      res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
);

// Update product (admin only)
router.put('/:id', authenticate, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Product.findById(id);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    let image_url = existing.image_url;
    let image_public_id = existing.image_public_id;

    if (req.file) {
      if (image_public_id) await deleteFromCloudinary(image_public_id);
      const uploadResult = await uploadToCloudinary(req.file, 'products');
      image_url = uploadResult.url;
      image_public_id = uploadResult.publicId;
    }

    const toBoolean = (val, fallback) => {
      if (val === undefined || val === null || val === '') return fallback;
      if (typeof val === 'boolean') return val;
      return val === 'true';
    };
    const toNumber = (val) => {
      if (val === undefined || val === null || val === '') return null;
      const n = Number(val);
      return isNaN(n) ? null : n;
    };

    const {
      name, description, category_id, price, discount,
      customizable, customization_options, valentine_special,
      special_offer, stock_quantity, is_active
    } = req.body;

    let parsedCustomizationOptions = existing.customization_options;
    if (customization_options !== undefined && customization_options !== null && customization_options !== '') {
      try {
        parsedCustomizationOptions = typeof customization_options === 'string'
          ? JSON.parse(customization_options)
          : customization_options;
      } catch { parsedCustomizationOptions = null; }
    }

    const updates = {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(category_id && { category_id }),
      ...(toNumber(price) !== null && { price: toNumber(price) }),
      ...(toNumber(discount) !== null && { discount: toNumber(discount) }),
      image_url,
      image_public_id,
      ...(customizable !== undefined && customizable !== '' && { customizable: toBoolean(customizable, existing.customizable) }),
      customization_options: parsedCustomizationOptions,
      ...(valentine_special !== undefined && valentine_special !== '' && { valentine_special: toBoolean(valentine_special, existing.valentine_special) }),
      ...(special_offer !== undefined && special_offer !== '' && { special_offer: toBoolean(special_offer, existing.special_offer) }),
      ...(toNumber(stock_quantity) !== null && { stock_quantity: toNumber(stock_quantity) }),
      ...(is_active !== undefined && is_active !== '' && { is_active: toBoolean(is_active, existing.is_active) }),
    };

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    invalidateCache((key) => key.startsWith('/api/products'));

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Update product error:', error.message);
    res.status(500).json({ error: 'Failed to update product', details: process.env.NODE_ENV !== 'production' ? error.message : undefined });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Check if product is referenced in orders
    const Order = (await import('../models/Order.js')).default;
    const orderCount = await Order.countDocuments({ 'items.product_id': id });

    if (orderCount > 0) {
      await Product.findByIdAndUpdate(id, { is_active: false });
      res.json({ message: 'Product deactivated (exists in orders)', deactivated: true });
    } else {
      if (product.image_public_id) {
        try { await deleteFromCloudinary(product.image_public_id); } catch (e) {}
      }
      await Product.findByIdAndDelete(id);
      invalidateCache((key) => key.startsWith('/api/products'));
      res.json({ message: 'Product deleted successfully', deleted: true });
    }
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
