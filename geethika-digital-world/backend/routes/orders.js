import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import razorpay from '../config/razorpay.js';
import crypto from 'crypto';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { logAdminAction, getChanges } from '../middleware/auditLog.js';

const router = express.Router();

// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

// Create Razorpay order
router.post('/create-razorpay-order', async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: generateOrderNumber(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// Verify Razorpay payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Create order
router.post('/',
  [
    body('customer_name').trim().notEmpty(),
    body('customer_phone').trim().notEmpty(),
    body('shipping_address').trim().notEmpty(),
    body('items').isArray({ min: 1 }),
    body('total').isFloat({ min: 0 })
  ],
  async (req, res) => {
    const client = await pool.connect();
    
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      await client.query('BEGIN');

      const {
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        items,
        subtotal,
        shipping_cost = 0,
        service_charge = 0,
        total,
        payment_method = 'razorpay',
        shipping_info // New: accept shipping_info object
      } = req.body;

      const orderNumber = generateOrderNumber();

      // Store shipping address as JSON if shipping_info is provided
      const shippingAddressJson = shipping_info ? JSON.stringify(shipping_info) : null;
      const shippingAddressText = shipping_address || 
        (shipping_info ? `${shipping_info.address}, ${shipping_info.city}, ${shipping_info.state} - ${shipping_info.pincode}` : null);

      // Create Razorpay order (optional - continue even if it fails)
      let razorpayOrderId = null;
      try {
        if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_demo') {
          const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(total * 100), // Convert to paise
            currency: 'INR',
            receipt: orderNumber,
          });
          razorpayOrderId = razorpayOrder.id;
        } else {
          if (process.env.NODE_ENV !== 'production') {
            console.log('Skipping Razorpay order creation (demo keys)');
          }
        }
      } catch (razorpayError) {
        console.error('Razorpay order creation failed (continuing anyway):', razorpayError.message);
        // Continue without Razorpay order ID - order will still be created
      }

      // Create order
      const orderResult = await client.query(`
        INSERT INTO orders (
          order_number, customer_name, customer_email, customer_phone,
          shipping_address, shipping_info, subtotal, shipping_cost, service_charge, total,
          payment_method, razorpay_order_id,
          payment_status, order_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `, [
        orderNumber,
        customer_name,
        customer_email,
        customer_phone,
        shippingAddressText,
        shippingAddressJson,
        subtotal,
        shipping_cost,
        service_charge || 0,
        total,
        payment_method,
        razorpayOrderId,
        'pending',
        'pending'
      ]);

      const order = orderResult.rows[0];

      // Create order items
      for (const item of items) {
        await client.query(`
          INSERT INTO order_items (
            order_id, product_id, product_name, product_image,
            quantity, price, customization
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          order.id,
          item.product_id || item.id,
          item.name,
          item.image || item.image_url,
          item.quantity,
          item.price || item.finalPrice,
          item.customization ? JSON.stringify(item.customization) : null
        ]);

        // Update product stock if product_id exists
        if (item.product_id || item.id) {
          await client.query(`
            UPDATE products
            SET stock_quantity = GREATEST(0, stock_quantity - $1)
            WHERE id = $2
          `, [item.quantity, item.product_id || item.id]);
        }
      }

      await client.query('COMMIT');

      res.status(201).json({
        message: 'Order created successfully',
        order: {
          id: order.id,
          order_number: order.order_number,
          total: order.total,
          status: order.order_status
        },
        razorpay_order_id: razorpayOrderId
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Create order error:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      res.status(500).json({ 
        error: 'Failed to create order', 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      });
    } finally {
      client.release();
    }
  }
);

// Get user's orders (authenticated user)
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const rawLimit = Number(req.query.limit) || 50;
    const rawOffset = Number(req.query.offset) || 0;
    const limit = Math.min(Math.max(rawLimit, 1), 100);
    const offset = Math.max(rawOffset, 0);
    const userEmail = req.user.email;

    // Avoid N+1: get orders + items in a single query
    const { rows } = await pool.query(
      `
      SELECT
        o.id,
        o.order_number,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.shipping_address,
        o.subtotal,
        o.shipping_cost,
        o.service_charge,
        o.total,
        o.payment_method,
        o.payment_status,
        o.order_status,
        o.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'product_name', oi.product_name,
              'product_image', oi.product_image,
              'quantity', oi.quantity,
              'price', oi.price,
              'customization', oi.customization
            )
            ORDER BY oi.id
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.customer_email = $1
        AND o.payment_status = 'paid'
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $2 OFFSET $3
      `,
      [userEmail, limit, offset]
    );

    res.json({
      orders: rows,
      count: rows.length,
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get all orders (admin only)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const rawLimit = Number(req.query.limit) || 50;
    const rawOffset = Number(req.query.offset) || 0;
    const limit = Math.min(Math.max(rawLimit, 1), 100);
    const offset = Math.max(rawOffset, 0);

    const { status } = req.query;

    let query = 'SELECT * FROM orders';
    const params = [];
    
    if (status) {
      query += ' WHERE order_status = $1';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      orders: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order with items
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      `
      SELECT
        o.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'product_name', oi.product_name,
              'product_image', oi.product_image,
              'quantity', oi.quantity,
              'price', oi.price,
              'customization', oi.customization
            )
            ORDER BY oi.id
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.id = $1
      GROUP BY o.id
      `,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update payment status
router.patch('/:id/payment', async (req, res) => {
  try {
    const { id } = req.params;
    const { razorpay_payment_id, razorpay_signature } = req.body;

    const result = await pool.query(`
      UPDATE orders SET
        razorpay_payment_id = $1,
        razorpay_signature = $2,
        payment_status = 'paid',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [razorpay_payment_id, razorpay_signature, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      message: 'Payment updated successfully',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status } = req.body;

    // Get old data for audit log
    const oldData = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    
    if (oldData.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const result = await pool.query(`
      UPDATE orders SET
        order_status = COALESCE($1, order_status),
        payment_status = COALESCE($2, payment_status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [order_status, payment_status, id]);

    // Log the action
    const changes = getChanges(oldData.rows[0], result.rows[0]);
    await logAdminAction(
      req,
      'UPDATE',
      'order',
      result.rows[0].id,
      result.rows[0].order_number,
      changes
    );

    res.json({
      message: 'Order status updated successfully',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
