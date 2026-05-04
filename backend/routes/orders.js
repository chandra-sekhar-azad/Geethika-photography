import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import razorpay from '../config/razorpay.js';
import crypto from 'crypto';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { logAdminAction, getChanges } from '../middleware/auditLog.js';

const router = express.Router();

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
      amount: amount * 100,
      currency: 'INR',
      receipt: generateOrderNumber(),
    };
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
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
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const {
        customer_name, customer_email, customer_phone,
        shipping_address, items, subtotal, shipping_cost = 0,
        service_charge = 0, total, payment_method = 'razorpay', shipping_info
      } = req.body;

      const orderNumber = generateOrderNumber();

      const shippingAddressText = shipping_address ||
        (shipping_info ? `${shipping_info.address}, ${shipping_info.city}, ${shipping_info.state} - ${shipping_info.pincode}` : null);

      let razorpayOrderId = null;
      try {
        if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_demo') {
          const rpOrder = await razorpay.orders.create({
            amount: Math.round(total * 100),
            currency: 'INR',
            receipt: orderNumber,
          });
          razorpayOrderId = rpOrder.id;
        }
      } catch (rpError) {
        console.error('Razorpay order creation failed (continuing):', rpError.message);
      }

      // Build order items and update stock
      const orderItems = items.map((item) => ({
        product_id: item.product_id || item.id || null,
        product_name: item.name,
        product_image: item.image || item.image_url || null,
        quantity: item.quantity,
        price: item.price || item.finalPrice,
        customization: item.customization || null,
      }));

      // Update stock for each product
      for (const item of items) {
        const pid = item.product_id || item.id;
        if (pid) {
          await Product.findByIdAndUpdate(pid, {
            $inc: { stock_quantity: -item.quantity },
          });
        }
      }

      const order = await Order.create({
        order_number: orderNumber,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address: shippingAddressText,
        shipping_info,
        items: orderItems,
        subtotal,
        shipping_cost,
        service_charge,
        total,
        payment_method,
        razorpay_order_id: razorpayOrderId,
        payment_status: 'pending',
        order_status: 'pending',
      });

      res.status(201).json({
        message: 'Order created successfully',
        order: {
          id: order._id,
          order_number: order.order_number,
          total: order.total,
          status: order.order_status,
        },
        razorpay_order_id: razorpayOrderId,
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({
        error: 'Failed to create order',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

// Get user's orders (authenticated)
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const rawLimit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
    const rawOffset = Math.max(Number(req.query.offset) || 0, 0);
    const userEmail = req.user.email;

    const orders = await Order.find({ customer_email: userEmail, payment_status: 'paid' })
      .sort({ createdAt: -1 })
      .skip(rawOffset)
      .limit(rawLimit)
      .lean();

    res.json({ orders: orders.map(o => ({ ...o, id: o._id })), count: orders.length });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get all orders (admin only)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const rawLimit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
    const rawOffset = Math.max(Number(req.query.offset) || 0, 0);
    const { status } = req.query;

    const filter = {};
    if (status) filter.order_status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(rawOffset)
      .limit(rawLimit)
      .lean();

    res.json({ orders: orders.map(o => ({ ...o, id: o._id })), count: orders.length });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ ...order, id: order._id });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update payment status
router.patch('/:id/payment', async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_signature } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { razorpay_payment_id, razorpay_signature, payment_status: 'paid' },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Payment updated successfully', order });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const { order_status, payment_status } = req.body;
    const oldOrder = await Order.findById(req.params.id);
    if (!oldOrder) return res.status(404).json({ error: 'Order not found' });

    const updates = {};
    if (order_status) updates.order_status = order_status;
    if (payment_status) updates.payment_status = payment_status;

    const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });

    const changes = getChanges(oldOrder, order);
    await logAdminAction(req, 'UPDATE', 'order', order._id, order.order_number, changes);

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
