import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import razorpay from '../config/razorpay.js';
import crypto from 'crypto';
import { authenticate, isAdmin } from '../middleware/auth.js';

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
        city,
        state,
        pincode,
        items,
        subtotal,
        discount = 0,
        total,
        payment_method = 'razorpay',
        razorpay_order_id,
        razorpay_payment_id,
        order_type = 'online',
        notes
      } = req.body;

      const orderNumber = generateOrderNumber();

      // Create order
      const orderResult = await client.query(`
        INSERT INTO orders (
          order_number, customer_name, customer_email, customer_phone,
          shipping_address, city, state, pincode, subtotal, discount, total,
          payment_method, razorpay_order_id, razorpay_payment_id,
          payment_status, order_status, order_type, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *
      `, [
        orderNumber,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        city,
        state,
        pincode,
        subtotal,
        discount,
        total,
        payment_method,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_payment_id ? 'paid' : 'pending',
        'pending',
        order_type,
        notes
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
          item.image,
          item.quantity,
          item.finalPrice || item.price,
          item.customization ? JSON.stringify(item.customization) : null
        ]);

        // Update product stock
        if (item.product_id || item.id) {
          await client.query(`
            UPDATE products
            SET stock_quantity = stock_quantity - $1
            WHERE id = $2 AND stock_quantity >= $1
          `, [item.quantity, item.product_id || item.id]);
        }
      }

      await client.query('COMMIT');

      res.status(201).json({
        message: 'Order created successfully',
        order: {
          id: order.id,
          orderNumber: order.order_number,
          total: order.total,
          status: order.order_status
        }
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Create order error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    } finally {
      client.release();
    }
  }
);

// Get all orders (admin only)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

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
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const itemsResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [id]
    );

    res.json({
      order: orderResult.rows[0],
      items: itemsResult.rows
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status } = req.body;

    const result = await pool.query(`
      UPDATE orders SET
        order_status = COALESCE($1, order_status),
        payment_status = COALESCE($2, payment_status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [order_status, payment_status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

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
