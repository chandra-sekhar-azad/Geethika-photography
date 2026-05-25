import express from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
import SmsCampaign from '../models/SmsCampaign.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { sendSms } from '../config/msg91.js';

const router = express.Router();

const ACTIVE_WINDOW_DAYS = 90;
const HIGH_VALUE_THRESHOLD = 5000;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeRecipient = (customer) => ({
  id: String(customer._id),
  name: customer.name,
  email: customer.email || '',
  phone: customer.phone || '',
  last_order_at: customer.last_order_at || null,
  total_spent: customer.total_spent || 0,
});

const loadCustomerAudience = async () => {
  const customers = await User.find({
    role: 'customer',
    phone: { $nin: [null, ''] },
  })
    .select('_id name email phone')
    .sort({ createdAt: -1 })
    .lean();

  const emails = customers.map((customer) => customer.email).filter(Boolean);
  const orderStats = emails.length
    ? await Order.aggregate([
        {
          $match: {
            payment_status: 'paid',
            customer_email: { $in: emails },
          },
        },
        {
          $group: {
            _id: '$customer_email',
            last_order_at: { $max: '$createdAt' },
            total_spent: { $sum: '$total' },
          },
        },
      ])
    : [];

  const statsByEmail = new Map(orderStats.map((stat) => [stat._id, stat]));

  return customers.map((customer) => {
    const stats = customer.email ? statsByEmail.get(customer.email) : null;
    return normalizeRecipient({
      ...customer,
      last_order_at: stats?.last_order_at || null,
      total_spent: stats?.total_spent || 0,
    });
  });
};

const resolveRecipients = async (audience = 'all') => {
  const recipients = await loadCustomerAudience();
  const cutoff = new Date(Date.now() - ACTIVE_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  if (audience === 'active') {
    return recipients.filter((recipient) => recipient.last_order_at && new Date(recipient.last_order_at) >= cutoff);
  }

  if (audience === 'inactive') {
    return recipients.filter((recipient) => !recipient.last_order_at || new Date(recipient.last_order_at) < cutoff);
  }

  if (audience === 'high_value') {
    return recipients.filter((recipient) => Number(recipient.total_spent || 0) > HIGH_VALUE_THRESHOLD);
  }

  return recipients;
};

router.get('/preview', authenticate, isAdmin, async (req, res) => {
  try {
    const { audience = 'all' } = req.query;
    const recipients = await resolveRecipients(audience);

    res.json({
      audience,
      count: recipients.length,
    });
  } catch (error) {
    console.error('SMS preview error:', error);
    res.status(500).json({ error: 'Failed to preview SMS audience' });
  }
});

router.get('/campaigns', authenticate, isAdmin, async (req, res) => {
  try {
    const campaigns = await SmsCampaign.find().sort({ createdAt: -1 }).lean();

    res.json({
      campaigns: campaigns.map((campaign) => ({
        ...campaign,
        id: campaign._id,
      })),
    });
  } catch (error) {
    console.error('SMS campaign list error:', error);
    res.status(500).json({ error: 'Failed to fetch SMS campaigns' });
  }
});

router.post('/campaigns', authenticate, isAdmin, async (req, res) => {
  try {
    const { campaign_name, message, target_audience = 'all' } = req.body;

    if (!campaign_name || !campaign_name.trim()) {
      return res.status(400).json({ error: 'Campaign name is required' });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const recipients = await resolveRecipients(target_audience);

    if (!recipients.length) {
      return res.status(400).json({ error: 'No recipients found for the selected audience' });
    }

    const campaign = await SmsCampaign.create({
      campaign_name: campaign_name.trim(),
      message: message.trim(),
      target_audience,
      status: 'sending',
      total_recipients: recipients.length,
      sent_count: 0,
      failed_count: 0,
      results: [],
      errors: [],
      created_by: {
        id: req.user.id || '',
        name: req.user.name || 'Admin',
        email: req.user.email || '',
        role: req.user.role || 'admin',
      },
    });

    const results = [];
    const errors = [];

    for (const recipient of recipients) {
      const smsResult = await sendSms(recipient.phone, message.trim());

      if (smsResult.success) {
        results.push({ phone: recipient.phone, success: true });
      } else {
        errors.push({ phone: recipient.phone, error: smsResult.error });
      }

      await delay(1000);
    }

    campaign.sent_count = results.length;
    campaign.failed_count = errors.length;
    campaign.status = errors.length > 0 && results.length === 0 ? 'failed' : 'completed';
    campaign.results = results;
    campaign.failure_details = errors;
    campaign.sent_at = new Date();
    await campaign.save();

    res.json({
      success: true,
      campaign: {
        id: campaign._id,
        campaign_name: campaign.campaign_name,
        message: campaign.message,
        target_audience: campaign.target_audience,
        status: campaign.status,
        total_recipients: campaign.total_recipients,
        sent_count: campaign.sent_count,
        failed_count: campaign.failed_count,
        created_at: campaign.createdAt,
      },
    });
  } catch (error) {
    console.error('SMS campaign send error:', error);
    res.status(500).json({ error: 'Failed to send SMS campaign' });
  }
});

export default router;