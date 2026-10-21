/**
 * SwiftProject WhatsApp Gateway - Backend Service Configuration
 * 
 * Replaces Meta Cloud API & ChatMitra with the SwiftProject WhatsApp Gateway.
 * Base URL: https://wg.swiftproject.in/api/send
 * Auth: Bearer ${process.env.WHATSAPP_TOKEN}
 * 
 * Built with native fetch for zero-dependency reliability in Node 18+.
 */

import './loadEnv.js';

const DEFAULT_GATEWAY_URL = 'https://wg.swiftproject.in/api/send';

/**
 * Get and validate gateway configuration
 */
export const getWhatsAppConfig = () => {
  const url = process.env.WHATSAPP_URL?.trim() || DEFAULT_GATEWAY_URL;
  const token = process.env.WHATSAPP_TOKEN?.trim() || '';

  if (!token) {
    console.warn('⚠️  WHATSAPP_TOKEN is not configured in environment variables.');
  }

  return { url, token };
};

/**
 * Sanitizes phone numbers:
 * - Strips all non-digit characters (+, -, spaces, parentheses)
 * - Removes leading zeros
 * - Auto-prepends country code '91' (India) if 10 digits provided
 * - Validates length (10-15 digits)
 */
export const formatPhoneNumber = (phone, defaultCountryCode = '91') => {
  if (!phone) {
    throw new Error('Phone number is required');
  }

  let cleaned = String(phone).replace(/\D/g, '');
  cleaned = cleaned.replace(/^0+/, '');

  if (cleaned.length === 10) {
    cleaned = `${defaultCountryCode}${cleaned}`;
  }

  if (cleaned.length < 10 || cleaned.length > 15) {
    throw new Error(
      `Invalid phone number "${phone}". Sanitized result "${cleaned}" must be between 10 and 15 digits.`
    );
  }

  return cleaned;
};

/**
 * Extract rate limit and quota headers from response headers
 */
const extractQuotaHeaders = (headers) => {
  const parseNum = (val) => (val ? parseInt(val, 10) : undefined);
  const getHeader = (key) => {
    if (typeof headers?.get === 'function') {
      return headers.get(key) || headers.get(key.toLowerCase());
    }
    return headers?.[key] || headers?.[key.toLowerCase()];
  };

  return {
    rateLimitLimit: parseNum(getHeader('x-ratelimit-limit')),
    quotaDailyLimit: parseNum(getHeader('x-quota-daily-limit')),
    quotaDailyUsed: parseNum(getHeader('x-quota-daily-used')),
    quotaDailyRemaining: parseNum(getHeader('x-quota-daily-remaining')),
    quotaDailyReset: getHeader('x-quota-daily-reset') || undefined,
  };
};

/**
 * Core dispatch function to SwiftProject WhatsApp Gateway
 */
export const sendWhatsAppRequest = async (payload) => {
  const { url, token } = getWhatsAppConfig();

  if (!token) {
    return {
      success: false,
      error: 'WHATSAPP_TOKEN is not configured. WhatsApp dispatch skipped.'
    };
  }

  let sanitizedPhone;
  try {
    sanitizedPhone = formatPhoneNumber(payload.phone);
  } catch (validationErr) {
    return {
      success: false,
      error: validationErr.message,
      code: 'VALIDATION_ERROR'
    };
  }

  const finalPayload = {
    ...payload,
    phone: sanitizedPhone
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(finalPayload)
    });

    const quotaHeaders = extractQuotaHeaders(response.headers);
    let data;
    try {
      data = await response.json();
    } catch {
      const text = await response.text().catch(() => '');
      data = { error: text || `HTTP ${response.status} ${response.statusText}` };
    }

    // Handle 429 Rate Limit vs Daily Quota Exceeded
    if (response.status === 429) {
      const isBurst =
        data?.code === 'RATE_LIMIT_EXCEEDED' ||
        (typeof data?.error === 'string' && data.error.toLowerCase().includes('per-minute'));

      if (isBurst) {
        const retryAfter = data?.retryAfter || 30;
        console.error(`⚠️  WhatsApp Per-Minute Rate Limit Exceeded. Retry after ${retryAfter}s.`);
        return {
          success: false,
          error: data?.error || `Per-minute rate limit exceeded. Retry after ${retryAfter} seconds.`,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter,
          headers: quotaHeaders,
          status: 429
        };
      }

      console.error(`⛔ WhatsApp Daily Quota Exceeded. Used: ${data?.usedToday}/${data?.dailyLimit}.`);
      return {
        success: false,
        error: data?.error || 'Daily WhatsApp message quota reached.',
        code: 'DAILY_LIMIT_EXCEEDED',
        dailyLimit: data?.dailyLimit || quotaHeaders.quotaDailyLimit,
        usedToday: data?.usedToday || quotaHeaders.quotaDailyUsed,
        remaining: data?.remaining ?? quotaHeaders.quotaDailyRemaining ?? 0,
        resetsAt: data?.resetsAt || quotaHeaders.quotaDailyReset,
        headers: quotaHeaders,
        status: 429
      };
    }

    if (response.status === 401 || response.status === 403) {
      console.error('❌ WhatsApp Gateway Authentication Failed. Please verify WHATSAPP_TOKEN.');
      return {
        success: false,
        error: 'WhatsApp Gateway authentication failed (invalid or expired WHATSAPP_TOKEN).',
        code: 'AUTH_FAILED',
        status: response.status
      };
    }

    if (!response.ok || data?.ok === false || data?.success === false) {
      const errorMsg = data?.error || data?.message || `HTTP ${response.status} ${response.statusText}`;
      console.error(`❌ WhatsApp Gateway Error [HTTP ${response.status}]:`, errorMsg);
      return {
        success: false,
        error: errorMsg,
        details: data,
        status: response.status
      };
    }

    console.log(`✅ WhatsApp message sent to ${sanitizedPhone} [ID: ${data.messageId || 'N/A'}]`);
    if (data.quota) {
      console.log(`📊 Quota: ${data.quota.usedToday}/${data.quota.dailyLimit} used (${data.quota.dailyRemaining} remaining)`);
    }

    return {
      success: true,
      ok: true,
      messageId: data.messageId,
      session: data.session,
      status: data.status || 'QUEUED',
      to: data.to || sanitizedPhone,
      quota: data.quota,
      headers: quotaHeaders,
      data
    };
  } catch (error) {
    console.error('❌ WhatsApp Gateway Network Error:', error.message);
    return {
      success: false,
      error: `Network error connecting to WhatsApp Gateway: ${error.message}`
    };
  }
};

// ============================================================================
// INDIVIDUAL MESSAGE TYPE FUNCTIONS
// ============================================================================

/**
 * 1. Send plain text message
 */
export const sendTextMessage = async (phone, text) => {
  return sendWhatsAppRequest({
    phone,
    message: text
  });
};

/**
 * 2. Send image (URL or base64)
 */
export const sendImage = async (phone, imageUrl, caption = '', contentType = 'image/jpeg') => {
  return sendWhatsAppRequest({
    phone,
    attachment: {
      url: imageUrl,
      contentType
    },
    message: caption || undefined
  });
};

/**
 * 3. Send Document / PDF
 */
export const sendDocument = async (phone, documentUrl, fileName = 'document.pdf', caption = '', contentType = 'application/pdf') => {
  return sendWhatsAppRequest({
    phone,
    attachment: {
      url: documentUrl,
      contentType,
      fileName
    },
    message: caption || undefined
  });
};

/**
 * 4. Send Video
 */
export const sendVideo = async (phone, videoUrl, caption = '', contentType = 'video/mp4') => {
  return sendWhatsAppRequest({
    phone,
    attachment: {
      url: videoUrl,
      contentType
    },
    message: caption || undefined
  });
};

/**
 * 5. Send Audio / Voice
 */
export const sendAudio = async (phone, audioUrl, contentType = 'audio/mpeg') => {
  return sendWhatsAppRequest({
    phone,
    attachment: {
      url: audioUrl,
      contentType
    }
  });
};

/**
 * 6. Send Location
 */
export const sendLocation = async (phone, latitude, longitude, name = '', address = '') => {
  return sendWhatsAppRequest({
    phone,
    location: {
      latitude: Number(latitude),
      longitude: Number(longitude),
      name: name || undefined,
      address: address || undefined
    }
  });
};

/**
 * 7. Send Contact Card (vCard)
 */
export const sendContact = async (phone, fullName, contactPhone) => {
  return sendWhatsAppRequest({
    phone,
    contact: {
      fullName,
      phone: formatPhoneNumber(contactPhone)
    }
  });
};

/**
 * 8. Send Interactive Poll
 */
export const sendPoll = async (phone, question, options = [], selectableCount = 1) => {
  return sendWhatsAppRequest({
    phone,
    poll: {
      name: question,
      options,
      selectableCount
    }
  });
};

/**
 * 9. Send Reaction to a message
 */
export const sendReaction = async (phone, emoji, messageId) => {
  return sendWhatsAppRequest({
    phone,
    reaction: {
      emoji,
      messageId
    }
  });
};

/**
 * 10. Send Reply quoting an existing message
 */
export const sendReply = async (phone, text, quotedMessageId) => {
  return sendWhatsAppRequest({
    phone,
    message: text,
    quotedMessageId
  });
};

// ============================================================================
// COMPATIBILITY WRAPPERS (for existing routes/orders.js and designs.js)
// ============================================================================

/**
 * Legacy wrapper: Send text message to customer
 */
export const sendWhatsAppMessage = async (to, message, customerName = '') => {
  const greeting = customerName ? `Hi ${customerName}!\n\n` : '';
  const fullText = message.startsWith('Hi ') ? message : `${greeting}${message}`.trim();
  return sendTextMessage(to, fullText);
};

/**
 * Legacy wrapper: Send media to customer
 */
export const sendWhatsAppMedia = async (to, mediaType, mediaUrl, caption = '') => {
  switch (mediaType) {
    case 'image':
      return sendImage(to, mediaUrl, caption);
    case 'video':
      return sendVideo(to, mediaUrl, caption);
    case 'audio':
      return sendAudio(to, mediaUrl);
    case 'document':
      return sendDocument(to, mediaUrl, 'document.pdf', caption);
    default:
      return sendImage(to, mediaUrl, caption);
  }
};

/**
 * Legacy wrapper: Send template (adapted for SwiftProject Gateway)
 */
export const sendWhatsAppTemplate = async (to, templateName, languageCode = 'en', components = [], customerName = '') => {
  let text = customerName ? `Hello ${customerName}!\n\n` : '';
  text += `Notification: ${templateName}\n`;

  if (Array.isArray(components)) {
    components.forEach((c) => {
      if (c.parameters) {
        c.parameters.forEach((p) => {
          if (p.text) text += `${p.text}\n`;
        });
      }
    });
  }

  return sendTextMessage(to, text.trim());
};

export default {
  sendWhatsAppRequest,
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
  sendWhatsAppMessage,
  sendWhatsAppMedia,
  sendWhatsAppTemplate,
  formatPhoneNumber,
  getWhatsAppConfig
};
