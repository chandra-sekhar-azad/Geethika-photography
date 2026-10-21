import express from 'express';
import {
  sendWhatsAppMessage,
  sendWhatsAppTemplate,
  sendWhatsAppMedia,
  sendTextMessage,
  sendImage,
  sendDocument,
  sendVideo,
  sendAudio,
  sendLocation,
  sendContact,
  sendPoll,
  sendReaction,
  sendReply,
  getWhatsAppConfig
} from '../config/whatsapp.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * Send order confirmation via WhatsApp
 * POST /api/whatsapp/order-confirmation
 */
router.post('/order-confirmation', authenticate, async (req, res) => {
  try {
    const { orderId, customerPhone, customerName, total, deliveryDate } = req.body;

    if (!customerPhone) {
      return res.status(400).json({ error: 'Customer phone number is required' });
    }

    const message = `
🎉 *Order Confirmed!*

Hi ${customerName || 'Valued Customer'}!

Your order #${orderId} has been confirmed.

*Order Details:*
💰 Total: ₹${total}
📅 Estimated Delivery: ${deliveryDate}

Thank you for choosing *Geethika Digital World*! 💝

Track your order: ${process.env.FRONTEND_URL || 'https://geethikadigitalworld.com'}/orders/${orderId}

Need help? Reply to this message or call us at +91 9492686421
    `.trim();

    const result = await sendWhatsAppMessage(customerPhone, message);

    if (result.success) {
      res.json({ 
        success: true, 
        message: 'WhatsApp notification sent',
        messageId: result.messageId || result.data?.messageId,
        quota: result.quota
      });
    } else {
      const statusCode = result.status || (result.code === 'RATE_LIMIT_EXCEEDED' || result.code === 'DAILY_LIMIT_EXCEEDED' ? 429 : 500);
      res.status(statusCode).json({ 
        success: false, 
        error: result.error || 'Failed to send WhatsApp message',
        code: result.code,
        details: result.details,
        quota: result.headers
      });
    }
  } catch (error) {
    console.error('WhatsApp order confirmation error:', error);
    res.status(500).json({ error: 'Failed to send WhatsApp notification' });
  }
});

/**
 * Send order status update via WhatsApp
 * POST /api/whatsapp/order-status
 */
router.post('/order-status', authenticate, isAdmin, async (req, res) => {
  try {
    const { orderId, customerPhone, customerName, status } = req.body;

    const statusEmojis = {
      'pending': '⏳',
      'processing': '📦',
      'shipped': '🚚',
      'delivered': '✅',
      'cancelled': '❌'
    };

    const statusMessages = {
      'pending': 'Your order is pending confirmation',
      'processing': 'Your order is being processed',
      'shipped': 'Your order has been shipped!',
      'delivered': 'Your order has been delivered',
      'cancelled': 'Your order has been cancelled'
    };

    const message = `
${statusEmojis[status] || '📦'} *Order Update*

Hi ${customerName || 'Customer'}!

*Order #${orderId}*
Status: ${statusMessages[status] || `Your order status is now ${status}`}

View details: ${process.env.FRONTEND_URL || 'https://geethikadigitalworld.com'}/orders/${orderId}

Questions? Call us at +91 9492686421
    `.trim();

    const result = await sendWhatsAppMessage(customerPhone, message);

    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Status update sent via WhatsApp',
        messageId: result.messageId,
        quota: result.quota
      });
    } else {
      const statusCode = result.status || 500;
      res.status(statusCode).json({ 
        success: false, 
        error: result.error || 'Failed to send status update',
        code: result.code
      });
    }
  } catch (error) {
    console.error('WhatsApp status update error:', error);
    res.status(500).json({ error: 'Failed to send status update' });
  }
});

/**
 * Send marketing campaign (Admin only)
 * POST /api/whatsapp/campaign
 */
router.post('/campaign', authenticate, isAdmin, async (req, res) => {
  try {
    const { phoneNumbers, message } = req.body;

    if (!phoneNumbers || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      return res.status(400).json({ error: 'Phone numbers array is required' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const results = [];
    const errors = [];
    let lastQuota = null;

    for (const phone of phoneNumbers) {
      const result = await sendTextMessage(phone, message);
      
      if (result.success) {
        results.push({ phone, success: true, messageId: result.messageId });
        if (result.quota) lastQuota = result.quota;
      } else {
        errors.push({ phone, error: result.error, code: result.code });

        // If daily limit exceeded, halt campaign immediately to preserve quota
        if (result.code === 'DAILY_LIMIT_EXCEEDED') {
          console.warn('⛔ Campaign halted: Daily WhatsApp quota limit reached.');
          break;
        }
      }

      // 1-second delay between dispatches to comply with per-minute burst rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    res.json({
      success: true,
      sent: results.length,
      failed: errors.length,
      results,
      errors,
      quota: lastQuota
    });
  } catch (error) {
    console.error('WhatsApp campaign error:', error);
    res.status(500).json({ error: 'Failed to send campaign' });
  }
});

/**
 * Send product image via WhatsApp
 * POST /api/whatsapp/send-image
 */
router.post('/send-image', authenticate, isAdmin, async (req, res) => {
  try {
    const { customerPhone, imageUrl, caption } = req.body;

    if (!customerPhone || !imageUrl) {
      return res.status(400).json({ error: 'Phone number and image URL are required' });
    }

    const result = await sendImage(
      customerPhone,
      imageUrl,
      caption || 'Check out this product from Geethika Digital World! 🎁'
    );

    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Image sent via WhatsApp',
        messageId: result.messageId,
        quota: result.quota
      });
    } else {
      res.status(result.status || 500).json({ 
        success: false, 
        error: result.error || 'Failed to send image'
      });
    }
  } catch (error) {
    console.error('WhatsApp image send error:', error);
    res.status(500).json({ error: 'Failed to send image' });
  }
});

/**
 * Send Document / PDF via WhatsApp
 * POST /api/whatsapp/send-document
 */
router.post('/send-document', authenticate, isAdmin, async (req, res) => {
  try {
    const { customerPhone, documentUrl, fileName, caption } = req.body;

    if (!customerPhone || !documentUrl || !fileName) {
      return res.status(400).json({ error: 'Phone number, documentUrl, and fileName are required' });
    }

    const result = await sendDocument(customerPhone, documentUrl, fileName, caption);

    if (result.success) {
      res.json({
        success: true,
        message: 'Document sent via WhatsApp',
        messageId: result.messageId,
        quota: result.quota
      });
    } else {
      res.status(result.status || 500).json({
        success: false,
        error: result.error || 'Failed to send document'
      });
    }
  } catch (error) {
    console.error('WhatsApp document send error:', error);
    res.status(500).json({ error: 'Failed to send document' });
  }
});

/**
 * Send Location coordinates via WhatsApp
 * POST /api/whatsapp/send-location
 */
router.post('/send-location', authenticate, isAdmin, async (req, res) => {
  try {
    const { customerPhone, latitude, longitude, name, address } = req.body;

    if (!customerPhone || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Phone number, latitude, and longitude are required' });
    }

    const result = await sendLocation(customerPhone, latitude, longitude, name, address);

    if (result.success) {
      res.json({
        success: true,
        message: 'Location sent via WhatsApp',
        messageId: result.messageId,
        quota: result.quota
      });
    } else {
      res.status(result.status || 500).json({
        success: false,
        error: result.error || 'Failed to send location'
      });
    }
  } catch (error) {
    console.error('WhatsApp location send error:', error);
    res.status(500).json({ error: 'Failed to send location' });
  }
});

/**
 * Send Contact Card via WhatsApp
 * POST /api/whatsapp/send-contact
 */
router.post('/send-contact', authenticate, isAdmin, async (req, res) => {
  try {
    const { customerPhone, fullName, contactPhone } = req.body;

    if (!customerPhone || !fullName || !contactPhone) {
      return res.status(400).json({ error: 'Customer phone, fullName, and contactPhone are required' });
    }

    const result = await sendContact(customerPhone, fullName, contactPhone);

    if (result.success) {
      res.json({
        success: true,
        message: 'Contact sent via WhatsApp',
        messageId: result.messageId,
        quota: result.quota
      });
    } else {
      res.status(result.status || 500).json({
        success: false,
        error: result.error || 'Failed to send contact'
      });
    }
  } catch (error) {
    console.error('WhatsApp contact send error:', error);
    res.status(500).json({ error: 'Failed to send contact' });
  }
});

/**
 * Send Interactive Poll via WhatsApp
 * POST /api/whatsapp/send-poll
 */
router.post('/send-poll', authenticate, isAdmin, async (req, res) => {
  try {
    const { customerPhone, question, options, selectableCount } = req.body;

    if (!customerPhone || !question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'Phone number, question, and at least 2 options are required' });
    }

    const result = await sendPoll(customerPhone, question, options, selectableCount || 1);

    if (result.success) {
      res.json({
        success: true,
        message: 'Poll sent via WhatsApp',
        messageId: result.messageId,
        quota: result.quota
      });
    } else {
      res.status(result.status || 500).json({
        success: false,
        error: result.error || 'Failed to send poll'
      });
    }
  } catch (error) {
    console.error('WhatsApp poll send error:', error);
    res.status(500).json({ error: 'Failed to send poll' });
  }
});

/**
 * Test WhatsApp connection
 * GET /api/whatsapp/test
 */
router.get('/test', authenticate, isAdmin, async (req, res) => {
  try {
    const testNumber = process.env.WHATSAPP_NUMBER || '919492686421';
    const testMessage = 'Test message from Geethika Digital World via SwiftProject WhatsApp Gateway. Connection is working perfectly! ✅';

    const result = await sendTextMessage(testNumber, testMessage);

    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Test message sent successfully via SwiftProject Gateway',
        messageId: result.messageId,
        to: result.to,
        quota: result.quota
      });
    } else {
      res.status(result.status || 500).json({ 
        success: false, 
        error: result.error || 'Test message failed',
        code: result.code,
        details: result.details
      });
    }
  } catch (error) {
    console.error('WhatsApp test error:', error);
    res.status(500).json({ error: 'Test failed: ' + error.message });
  }
});

export default router;
