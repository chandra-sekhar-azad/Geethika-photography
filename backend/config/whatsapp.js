import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CHATMITRA_API_URL = 'https://backend.chatmitra.com/developer/api';
const CHATMITRA_API_KEY = process.env.CHATMITRA_API_KEY;

const formatPhoneNumber = (phone) => phone.replace(/\D/g, '');

export const sendWhatsAppTemplate = async (to, templateName, languageCode = 'en', components = [], customerName = '') => {
  try {
    if (!CHATMITRA_API_KEY) {
      console.warn('⚠️  ChatMitra API key not configured');
      return { success: false, error: 'ChatMitra API key not configured' };
    }
    const response = await axios.post(
      `${CHATMITRA_API_URL}/send_message`,
      {
        recipient_mobile_number: formatPhoneNumber(to),
        customer_name: customerName,
        messages: [{ kind: 'template', template: { name: templateName, language: languageCode, components } }],
      },
      { headers: { Authorization: `Bearer ${CHATMITRA_API_KEY}`, 'Content-Type': 'application/json' } }
    );
    console.log('✅ WhatsApp template sent via ChatMitra:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ ChatMitra template failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const sendWhatsAppMessage = async (to, message, customerName = '') => {
  try {
    if (!CHATMITRA_API_KEY) {
      console.warn('⚠️  ChatMitra API key not configured');
      return { success: false, error: 'ChatMitra API key not configured' };
    }
    const response = await axios.post(
      `${CHATMITRA_API_URL}/send_message`,
      {
        recipient_mobile_number: formatPhoneNumber(to),
        customer_name: customerName,
        messages: [{ kind: 'text', text: { body: message } }],
      },
      { headers: { Authorization: `Bearer ${CHATMITRA_API_KEY}`, 'Content-Type': 'application/json' } }
    );
    console.log('✅ WhatsApp message sent via ChatMitra:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ ChatMitra message failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const sendWhatsAppMedia = async (to, mediaType, mediaUrl, caption = '') => {
  try {
    if (!CHATMITRA_API_KEY) {
      return { success: false, error: 'ChatMitra API key not configured' };
    }
    const mediaObject = { link: mediaUrl };
    if (caption && (mediaType === 'image' || mediaType === 'video')) mediaObject.caption = caption;

    const response = await axios.post(
      `${CHATMITRA_API_URL}/send_message`,
      {
        recipient_mobile_number: formatPhoneNumber(to),
        messages: [{ kind: mediaType, [mediaType]: mediaObject }],
      },
      { headers: { Authorization: `Bearer ${CHATMITRA_API_KEY}`, 'Content-Type': 'application/json' } }
    );
    console.log('✅ WhatsApp media sent via ChatMitra:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ ChatMitra media failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const verifyWebhook = (mode, token, challenge) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'geethika_verify_token';
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified');
    return challenge;
  }
  console.log('❌ Webhook verification failed');
  return null;
};

export default { sendWhatsAppMessage, sendWhatsAppTemplate, sendWhatsAppMedia, verifyWebhook };
