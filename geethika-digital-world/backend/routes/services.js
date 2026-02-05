import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

const router = express.Router();

// Get all services (public)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM services ORDER BY created_at DESC
    `);

    res.json({ services: result.rows });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get single service (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM services WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// Create service (admin/superadmin only)
router.post('/',
  authenticate,
  isAdmin,
  upload.single('image'),
  [
    body('name').trim().notEmpty(),
    body('description').optional()
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
        price_range,
        features,
        is_active = true
      } = req.body;

      let imageUrl = null;
      let imagePublicId = null;

      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file, 'services');
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.publicId;
      }

      // Parse features if it's a JSON string
      const featuresArray = typeof features === 'string' ? JSON.parse(features) : (Array.isArray(features) ? features : []);

      const result = await pool.query(`
        INSERT INTO services (
          name, slug, description, price_range, image_url, image_public_id, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [
        name,
        slug || name.toLowerCase().replace(/\s+/g, '-'),
        description,
        price_range,
        imageUrl,
        imagePublicId,
        is_active
      ]);

      res.status(201).json({
        message: 'Service created successfully',
        service: result.rows[0]
      });
    } catch (error) {
      console.error('Create service error:', error);
      res.status(500).json({ error: 'Failed to create service' });
    }
  }
);

// Update service (admin/superadmin only)
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
        price_range,
        features,
        is_active
      } = req.body;

      // Get existing service
      const existing = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }

      let imageUrl = existing.rows[0].image_url;
      let imagePublicId = existing.rows[0].image_public_id;

      if (req.file) {
        // Delete old image
        if (imagePublicId) {
          await deleteFromCloudinary(imagePublicId);
        }
        // Upload new image
        const uploadResult = await uploadToCloudinary(req.file, 'services');
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.publicId;
      }

      const result = await pool.query(`
        UPDATE services SET
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          price_range = COALESCE($3, price_range),
          image_url = $4,
          image_public_id = $5,
          is_active = COALESCE($6, is_active),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *
      `, [name, description, price_range, imageUrl, imagePublicId, is_active, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }

      res.json({
        message: 'Service updated successfully',
        service: result.rows[0]
      });
    } catch (error) {
      console.error('Update service error:', error);
      res.status(500).json({ error: 'Failed to update service' });
    }
  }
);

// Delete service (admin/superadmin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const service = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
    if (service.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Delete image from Cloudinary
    if (service.rows[0].image_public_id) {
      await deleteFromCloudinary(service.rows[0].image_public_id);
    }

    const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Create service booking
router.post('/bookings',
  [
    body('service_id').isInt(),
    body('package_id').isInt(),
    body('customer_name').trim().notEmpty(),
    body('customer_phone').trim().notEmpty(),
    body('booking_date').isDate(),
    body('location').trim().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        service_id,
        package_id,
        customer_name,
        customer_phone,
        customer_email,
        booking_date,
        location,
        requirements,
        total_amount,
        advance_paid = 0,
        razorpay_order_id,
        razorpay_payment_id
      } = req.body;

      const bookingNumber = `BKG-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase();

      const result = await pool.query(`
        INSERT INTO service_bookings (
          booking_number, service_id, package_id, customer_name,
          customer_phone, customer_email, booking_date, location,
          requirements, total_amount, advance_paid, razorpay_order_id,
          razorpay_payment_id, payment_status, booking_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `, [
        bookingNumber,
        service_id,
        package_id,
        customer_name,
        customer_phone,
        customer_email,
        booking_date,
        location,
        requirements,
        total_amount,
        advance_paid,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_payment_id ? 'paid' : 'pending',
        'pending'
      ]);

      res.status(201).json({
        message: 'Booking created successfully',
        booking: result.rows[0]
      });
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  }
);

// Get all bookings (admin only)
router.get('/bookings/all', authenticate, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sb.*, s.name as service_name, sp.name as package_name
      FROM service_bookings sb
      LEFT JOIN services s ON sb.service_id = s.id
      LEFT JOIN service_packages sp ON sb.package_id = sp.id
      ORDER BY sb.created_at DESC
    `);

    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Update booking status (admin only)
router.patch('/bookings/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { booking_status, payment_status } = req.body;

    const result = await pool.query(`
      UPDATE service_bookings SET
        booking_status = COALESCE($1, booking_status),
        payment_status = COALESCE($2, payment_status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [booking_status, payment_status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      message: 'Booking status updated successfully',
      booking: result.rows[0]
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

export default router;
