import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const MSG91_BASE_URL = 'https://control.msg91.com/api';
const AUTH_KEY = process.env.MSG91_AUTH_KEY || process.env.MSG91_TEST_AUTH_KEY;
const SENDER_ID = process.env.MSG91_SENDER_ID || 'GEETHI';
const ROUTE = process.env.MSG91_ROUTE || '4';
const COUNTRY = process.env.MSG91_COUNTRY || '91';

const normalizePhoneNumber = (phone) => String(phone || '').replace(/\D/g, '');

export const sendSms = async (to, message) => {
  const mobile = normalizePhoneNumber(to);

  if (!AUTH_KEY) {
    return {
      success: false,
      error: 'MSG91_AUTH_KEY is not configured',
    };
  }

  if (!mobile) {
    return {
      success: false,
      error: 'Recipient phone number is required',
    };
  }

  try {
    const response = await axios.get(`${MSG91_BASE_URL}/sendhttp.php`, {
      params: {
        authkey: AUTH_KEY,
        mobiles: mobile,
        message,
        sender: SENDER_ID,
        route: ROUTE,
        country: COUNTRY,
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ MSG91 SMS failed:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};

export default {
  sendSms,
};