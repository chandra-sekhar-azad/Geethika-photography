import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CHATMITRA_API_URL = process.env.CHATMITRA_API_URL || 'https://api.chatmitra.com';
const CHATMITRA_API_KEY = process.env.CHATMITRA_API_KEY;
const CHATMITRA_WHATSAPP_ID = process.env.CHATMITRA_WHATSAPP_ID;

const formatPhoneNumber = (phone) => {
  return phone.replace(/\D/g, '');
};

/**
 * Send a WhatsApp message using ChatMitra
 * @param {string} to - Recipient phone number (with country code, no + sign)
 * @param {string} message - Message text
 * @returns {Promise} API response
 */
export const sendWhatsAppMessage = async (to, message) => {
  try {
    const formattedTo = formatPhoneNumber(to);
    if (!CHATMITRA_API_KEY || !CHATMITRA_WHATSAPP_ID) {
      return {
        success: false,
        error: 'ChatMitra credentials are not configured',
      };
    }

    const response = await axios.post(
      `${CHATMITRA_API_URL.replace(/\/$/, '')}/whatsapp/messages`,
      {
        whatsapp_id: CHATMITRA_WHATSAPP_ID,
        to: formattedTo,
        message,
      },
      {
        headers: {
          'Authorization': `Bearer ${CHATMITRA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ WhatsApp message sent successfully:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ WhatsApp message failed:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

/**
 * Send a WhatsApp template message via ChatMitra
 * @param {string} to - Recipient phone number
 * @param {string} templateName - Template name from WhatsApp Business Manager
 * @param {string} languageCode - Language code (e.g., 'en', 'en_US')
 * @param {Array} components - Template components (optional)
 * @returns {Promise} API response
 */
export const sendWhatsAppTemplate = async (to, templateName, languageCode = 'en', components = []) => {
  try {
    if (!CHATMITRA_API_KEY || !CHATMITRA_WHATSAPP_ID) {
      return {
        success: false,
        error: 'ChatMitra credentials are not configured',
      };
    }

    const response = await axios.post(
      `${CHATMITRA_API_URL.replace(/\/$/, '')}/whatsapp/templates`,
      {
        whatsapp_id: CHATMITRA_WHATSAPP_ID,
        to,
        template_name: templateName,
        language_code: languageCode,
        components,
      },
      {
        headers: {
          'Authorization': `Bearer ${CHATMITRA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ WhatsApp template sent successfully:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ WhatsApp template failed:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

/**
 * Send WhatsApp message with media (image, video, document) via ChatMitra
 * @param {string} to - Recipient phone number
 * @param {string} mediaType - Type: 'image', 'video', 'document'
 * @param {string} mediaUrl - URL of the media file
 * @param {string} caption - Optional caption
 * @returns {Promise} API response
 */
export const sendWhatsAppMedia = async (to, mediaType, mediaUrl, caption = '') => {
  try {
    if (!CHATMITRA_API_KEY || !CHATMITRA_WHATSAPP_ID) {
      return {
        success: false,
        error: 'ChatMitra credentials are not configured',
      };
    }

    const mediaObject = {
      link: mediaUrl
    };

    if (caption && (mediaType === 'image' || mediaType === 'video')) {
      mediaObject.caption = caption;
    }

    const response = await axios.post(
      `${CHATMITRA_API_URL.replace(/\/$/, '')}/whatsapp/media`,
      {
        whatsapp_id: CHATMITRA_WHATSAPP_ID,
        to,
        media_type: mediaType,
        media: mediaObject,
      },
      {
        headers: {
          'Authorization': `Bearer ${CHATMITRA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ WhatsApp media sent successfully:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ WhatsApp media failed:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

/**
 * Verify WhatsApp webhook
 * @param {string} mode - Verification mode
 * @param {string} token - Verification token
 * @param {string} challenge - Challenge string
 * @returns {string|null} Challenge if verified, null otherwise
 */
export const verifyWebhook = (mode, token, challenge) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'geethika_verify_token';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified');
    return challenge;
  }

  console.log('❌ Webhook verification failed');
  return null;
};

export default {
  sendWhatsAppMessage,
  sendWhatsAppTemplate,
  sendWhatsAppMedia,
  verifyWebhook
};
