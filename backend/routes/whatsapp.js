import express from 'express';
import WhatsAppTemplate from '../models/WhatsAppTemplate.js';
import WhatsAppCampaign from '../models/WhatsAppCampaign.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
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

// ============================================================================
// WHATSAPP AUDIENCE / CUSTOMERS
// ============================================================================

/**
 * Get customers for WhatsApp campaigns
 * GET /api/whatsapp/customers
 */
router.get('/customers', authenticate, isAdmin, async (req, res) => {
  try {
    const { filter } = req.query; // 'all', 'active', 'inactive', 'high_value'

    const users = await User.find({ phone: { $exists: true, $ne: '' } }).select('name email phone createdAt').lean();
    const orders = await Order.find({ customer_phone: { $exists: true, $ne: '' } }).select('customer_name customer_email customer_phone total createdAt').lean();

    const customerMap = new Map();

    users.forEach((u) => {
      if (u.phone) {
        customerMap.set(u.phone, {
          id: u._id.toString(),
          name: u.name || 'Customer',
          phone: u.phone,
          email: u.email || '',
          orderCount: 0,
          totalSpent: 0,
        });
      }
    });

    orders.forEach((o) => {
      if (o.customer_phone) {
        const existing = customerMap.get(o.customer_phone);
        if (existing) {
          existing.orderCount += 1;
          existing.totalSpent += o.total || 0;
        } else {
          customerMap.set(o.customer_phone, {
            id: o._id.toString(),
            name: o.customer_name || 'Customer',
            phone: o.customer_phone,
            email: o.customer_email || '',
            orderCount: 1,
            totalSpent: o.total || 0,
          });
        }
      }
    });

    let customers = Array.from(customerMap.values());

    if (filter === 'active') {
      customers = customers.filter((c) => c.orderCount > 0);
    } else if (filter === 'high_value') {
      customers = customers.filter((c) => c.totalSpent >= 1000);
    } else if (filter === 'inactive') {
      customers = customers.filter((c) => c.orderCount === 0);
    }

    res.json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error('Get WhatsApp customers error:', error);
    res.status(500).json({ error: 'Failed to fetch customers: ' + error.message });
  }
});

// ============================================================================
// WHATSAPP CAMPAIGNS (Admin Dashboard)
// ============================================================================

/**
 * List campaigns
 * GET /api/whatsapp/campaigns
 */
router.get('/campaigns', authenticate, isAdmin, async (req, res) => {
  try {
    const campaigns = await WhatsAppCampaign.find().sort({ createdAt: -1 }).lean();
    res.json({
      success: true,
      campaigns: campaigns.map((c) => ({
        ...c,
        id: c._id.toString(),
        total_recipients: c.total_recipients || 0,
        sent_count: c.sent_count || 0,
        failed_count: c.failed_count || 0,
      })),
    });
  } catch (error) {
    console.error('Get WhatsApp campaigns error:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns: ' + error.message });
  }
});

/**
 * Create & trigger campaign
 * POST /api/whatsapp/campaigns
 * POST /api/whatsapp/campaign
 */
const handleCreateCampaign = async (req, res) => {
  try {
    const { campaign_name, template_id, target_audience, scheduled_at, phoneNumbers, message } = req.body;

    // Handle direct phone list campaign from WhatsAppMessaging bulk tab
    if (Array.isArray(phoneNumbers) && phoneNumbers.length > 0 && message) {
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
          if (result.code === 'DAILY_LIMIT_EXCEEDED') {
            console.warn('⛔ Campaign halted: Daily WhatsApp quota limit reached.');
            break;
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Record in WhatsAppCampaign history
      await WhatsAppCampaign.create({
        campaign_name: campaign_name || `Bulk Campaign - ${new Date().toLocaleDateString('en-IN')}`,
        message,
        target_audience: 'custom',
        status: errors.length === phoneNumbers.length ? 'failed' : 'completed',
        total_recipients: phoneNumbers.length,
        sent_count: results.length,
        failed_count: errors.length,
        results: [...results, ...errors],
        created_by: {
          id: req.user?._id?.toString() || req.user?.id || '',
          name: req.user?.name || 'Admin',
          email: req.user?.email || '',
        },
      }).catch((e) => console.error('Error saving campaign history:', e));

      return res.json({
        success: true,
        sent: results.length,
        failed: errors.length,
        results,
        errors,
        quota: lastQuota,
      });
    }

    // Handle structured campaign from WhatsAppCampaigns tab
    if (!campaign_name) {
      return res.status(400).json({ error: 'Campaign name is required' });
    }

    let templateName = '';
    let campaignMessage = message || '';

    if (template_id) {
      const template = await WhatsAppTemplate.findById(template_id);
      if (template) {
        templateName = template.name;
        if (!campaignMessage) campaignMessage = template.message;
      }
    }

    if (!campaignMessage) {
      return res.status(400).json({ error: 'Campaign message or valid template is required' });
    }

    // Resolve target audience phone numbers
    const users = await User.find({ phone: { $exists: true, $ne: '' } }).select('phone').lean();
    const orders = await Order.find({ customer_phone: { $exists: true, $ne: '' } }).select('customer_phone total').lean();
    const phoneSet = new Set();
    users.forEach((u) => u.phone && phoneSet.add(u.phone));
    orders.forEach((o) => o.customer_phone && phoneSet.add(o.customer_phone));
    const targetPhones = Array.from(phoneSet);

    const campaign = await WhatsAppCampaign.create({
      campaign_name,
      template_id: template_id || null,
      template_name: templateName,
      message: campaignMessage,
      target_audience: target_audience || 'all',
      scheduled_at: scheduled_at ? new Date(scheduled_at) : null,
      status: targetPhones.length === 0 ? 'completed' : 'sending',
      total_recipients: targetPhones.length,
      sent_count: 0,
      failed_count: 0,
      created_by: {
        id: req.user?._id?.toString() || req.user?.id || '',
        name: req.user?.name || 'Admin',
        email: req.user?.email || '',
      },
    });

    // Run campaign dispatch asynchronously in background
    (async () => {
      let sent = 0;
      let failed = 0;
      const results = [];

      for (const phone of targetPhones) {
        try {
          const res = await sendTextMessage(phone, campaignMessage);
          if (res.success) {
            sent++;
            results.push({ phone, success: true, messageId: res.messageId });
          } else {
            failed++;
            results.push({ phone, success: false, error: res.error });
            if (res.code === 'DAILY_LIMIT_EXCEEDED') break;
          }
        } catch (err) {
          failed++;
          results.push({ phone, success: false, error: err.message });
        }
        await new Promise((r) => setTimeout(r, 1000));
      }

      await WhatsAppCampaign.findByIdAndUpdate(campaign._id, {
        status: failed === targetPhones.length && targetPhones.length > 0 ? 'failed' : 'completed',
        sent_count: sent,
        failed_count: failed,
        results,
      });
    })().catch((err) => console.error('Campaign background worker error:', err));

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully and queued for dispatch',
      campaign: {
        id: campaign._id.toString(),
        _id: campaign._id,
        campaign_name: campaign.campaign_name,
        template_name: templateName,
        status: 'sending',
        total_recipients: targetPhones.length,
      },
    });
  } catch (error) {
    console.error('WhatsApp campaign dispatch error:', error);
    res.status(500).json({ error: 'Failed to process campaign: ' + error.message });
  }
};

router.post('/campaigns', authenticate, isAdmin, handleCreateCampaign);
router.post('/campaign', authenticate, isAdmin, handleCreateCampaign);

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

// ============================================================================
// CUSTOM MESSAGE DISPATCH (Admin Dashboard)
// ============================================================================

/**
 * Send custom text message to a user/customer
 * POST /api/whatsapp/send-custom
 * POST /api/whatsapp/send-message
 */
const handleSendCustomMessage = async (req, res) => {
  try {
    const { phone, customerPhone, message, customerName, templateId, variables } = req.body;
    const targetPhone = customerPhone || phone;

    if (!targetPhone) {
      return res.status(400).json({ error: 'Recipient phone number is required' });
    }

    let finalMessage = (message || '').trim();

    // If templateId is provided and message is empty, populate from template
    if (templateId && !finalMessage) {
      const template = await WhatsAppTemplate.findById(templateId);
      if (template) {
        finalMessage = template.message;
        if (variables && typeof variables === 'object') {
          Object.entries(variables).forEach(([key, val]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            finalMessage = finalMessage.replace(regex, val);
          });
        }
      }
    }

    if (!finalMessage) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // Optionally prepend customer greeting if name provided and not already in message
    if (customerName && !finalMessage.toLowerCase().includes(customerName.toLowerCase())) {
      finalMessage = `Hi ${customerName}!\n\n${finalMessage}`;
    }

    const result = await sendTextMessage(targetPhone, finalMessage);

    if (result.success) {
      res.json({
        success: true,
        message: 'WhatsApp message sent successfully',
        messageId: result.messageId,
        to: result.to,
        quota: result.quota
      });
    } else {
      const statusCode = result.status || 500;
      res.status(statusCode).json({
        success: false,
        error: result.error || 'Failed to send WhatsApp message',
        code: result.code,
        details: result.details
      });
    }
  } catch (error) {
    console.error('Send custom WhatsApp error:', error);
    res.status(500).json({ error: 'Failed to send custom message: ' + error.message });
  }
};

router.post('/send-custom', authenticate, isAdmin, handleSendCustomMessage);
router.post('/send-message', authenticate, isAdmin, handleSendCustomMessage);
router.post('/send', authenticate, isAdmin, handleSendCustomMessage);

// ============================================================================
// WHATSAPP TEMPLATES MANAGEMENT (CRUD)
// ============================================================================

const SEED_TEMPLATES = [
  {
    name: 'Order Confirmation',
    category: 'transactional',
    occasion: 'general',
    subject: 'Order Confirmed',
    message: '🎉 *Order Confirmed!*\n\nHi {{name}}! Your order #{{order_number}} of ₹{{total}} has been received and confirmed.\n\nTrack order: {{order_url}}\n\nThank you for choosing *Geethika Digital World*! 💝',
    variables: ['name', 'order_number', 'total', 'order_url']
  },
  {
    name: 'Order Shipped / Dispatched',
    category: 'notification',
    occasion: 'general',
    subject: 'Order On The Way',
    message: '🚚 *Order Shipped!*\n\nHi {{name}}! Your order #{{order_number}} is on its way to you.\n\nTrack here: {{order_url}}\n\nNeed help? Call or WhatsApp us at +91 9492686421.',
    variables: ['name', 'order_number', 'order_url']
  },
  {
    name: 'Custom Design Review',
    category: 'transactional',
    occasion: 'general',
    subject: 'Design Ready',
    message: '🎨 *Your Custom Design is Ready!*\n\nHi {{name}}, we have prepared the custom preview for your order #{{order_number}}.\n\nPlease review it here:\n{{design_url}}\n\nReply directly to this message with your approval or suggestions!',
    variables: ['name', 'order_number', 'design_url']
  },
  {
    name: 'Special Festive Offer',
    category: 'promotional',
    occasion: 'festival',
    subject: 'Festive Discount',
    message: '🎁 *Festive Surprise from Geethika Digital World!*\n\nDear {{name}},\n\nEnjoy an exclusive *{{discount}}% OFF* on all personalized frames and gifts this season.\n\nUse code: *{{coupon}}*\nShop online: {{shop_url}}',
    variables: ['name', 'discount', 'coupon', 'shop_url']
  },
  {
    name: 'Order Delivered & Feedback',
    category: 'notification',
    occasion: 'general',
    subject: 'Delivered',
    message: '✅ *Order Delivered!*\n\nHi {{name}}! Your order #{{order_number}} has been delivered. We hope you love it!\n\nWe would appreciate your review: {{review_url}}\n\nThank you for choosing *Geethika Digital World*! ❤️',
    variables: ['name', 'order_number', 'review_url']
  }
];

/**
 * Get all templates
 * GET /api/whatsapp/templates
 */
router.get('/templates', authenticate, isAdmin, async (req, res) => {
  try {
    const { category, occasion } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (occasion) filter.occasion = occasion;

    let templates = await WhatsAppTemplate.find(filter).sort({ createdAt: -1 });

    // Seed default templates if database is empty
    if (templates.length === 0 && !category && !occasion) {
      const count = await WhatsAppTemplate.countDocuments();
      if (count === 0) {
        templates = await WhatsAppTemplate.insertMany(SEED_TEMPLATES);
      }
    }

    res.json({
      success: true,
      templates: templates.map(t => ({
        id: t._id.toString(),
        _id: t._id,
        name: t.name,
        category: t.category,
        occasion: t.occasion,
        subject: t.subject,
        message: t.message,
        variables: t.variables,
        is_active: t.is_active,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get WhatsApp templates error:', error);
    res.status(500).json({ error: 'Failed to fetch templates: ' + error.message });
  }
});

/**
 * Get single template by ID
 * GET /api/whatsapp/templates/:id
 */
router.get('/templates/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const template = await WhatsAppTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json({
      success: true,
      template: {
        id: template._id.toString(),
        _id: template._id,
        name: template.name,
        category: template.category,
        occasion: template.occasion,
        subject: template.subject,
        message: template.message,
        variables: template.variables,
        is_active: template.is_active,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt
      }
    });
  } catch (error) {
    console.error('Get single WhatsApp template error:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

/**
 * Create a new template
 * POST /api/whatsapp/templates
 */
router.post('/templates', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, category, occasion, subject, message, variables } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Template name is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Template message content is required' });
    }

    // Auto-extract variables if not explicitly supplied
    let detectedVariables = Array.isArray(variables) ? variables : [];
    if (detectedVariables.length === 0) {
      const matches = message.match(/{{(\w+)}}/g);
      if (matches) {
        detectedVariables = [...new Set(matches.map(m => m.replace(/[{}]/g, '')))];
      }
    }

    const template = await WhatsAppTemplate.create({
      name: name.trim(),
      category: category || 'custom',
      occasion: occasion ? occasion.trim() : '',
      subject: subject ? subject.trim() : '',
      message: message.trim(),
      variables: detectedVariables
    });

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      template: {
        id: template._id.toString(),
        _id: template._id,
        name: template.name,
        category: template.category,
        occasion: template.occasion,
        subject: template.subject,
        message: template.message,
        variables: template.variables
      }
    });
  } catch (error) {
    console.error('Create WhatsApp template error:', error);
    res.status(500).json({ error: 'Failed to create template: ' + error.message });
  }
});

/**
 * Update an existing template
 * PUT /api/whatsapp/templates/:id
 * PATCH /api/whatsapp/templates/:id
 */
const handleUpdateTemplate = async (req, res) => {
  try {
    const { name, category, occasion, subject, message, variables } = req.body;

    const updates = {};
    if (name) updates.name = name.trim();
    if (category) updates.category = category;
    if (occasion !== undefined) updates.occasion = occasion.trim();
    if (subject !== undefined) updates.subject = subject.trim();
    if (message) {
      updates.message = message.trim();
      let detectedVariables = Array.isArray(variables) ? variables : [];
      if (detectedVariables.length === 0) {
        const matches = updates.message.match(/{{(\w+)}}/g);
        if (matches) {
          detectedVariables = [...new Set(matches.map(m => m.replace(/[{}]/g, '')))];
        }
      }
      updates.variables = detectedVariables;
    } else if (Array.isArray(variables)) {
      updates.variables = variables;
    }

    const template = await WhatsAppTemplate.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({
      success: true,
      message: 'Template updated successfully',
      template: {
        id: template._id.toString(),
        _id: template._id,
        name: template.name,
        category: template.category,
        occasion: template.occasion,
        subject: template.subject,
        message: template.message,
        variables: template.variables
      }
    });
  } catch (error) {
    console.error('Update WhatsApp template error:', error);
    res.status(500).json({ error: 'Failed to update template: ' + error.message });
  }
};

router.put('/templates/:id', authenticate, isAdmin, handleUpdateTemplate);
router.patch('/templates/:id', authenticate, isAdmin, handleUpdateTemplate);

/**
 * Delete a template
 * DELETE /api/whatsapp/templates/:id
 */
router.delete('/templates/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const template = await WhatsAppTemplate.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Delete WhatsApp template error:', error);
    res.status(500).json({ error: 'Failed to delete template: ' + error.message });
  }
});

export default router;
