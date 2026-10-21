import User from '../models/User.js';
import Order from '../models/Order.js';

/**
 * Normalizes phone number to digits only
 */
export const normalizePhone = (phone) => {
  if (!phone) return '';
  return String(phone).replace(/\D/g, '');
};

/**
 * Extracts the last 10 digits for Indian phone number matching
 */
export const getTenDigitPhone = (phone) => {
  const digits = normalizePhone(phone);
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits;
};

/**
 * Replaces placeholders in a WhatsApp template string with actual customer/order data.
 * Supported placeholders:
 * - {{name}} / {{customer_name}} / {{user_name}}
 * - {{phone}} / {{customer_phone}}
 * - {{email}} / {{customer_email}}
 * - {{order_number}} / {{orderId}} / {{order_id}}
 * - {{total}} / {{amount}} / {{order_total}}
 * - {{details}} / {{items}} / {{order_details}}
 * - {{status}} / {{order_status}}
 * - {{order_url}} / {{tracking_url}}
 * - {{address}} / {{shipping_address}}
 * - {{date}} / {{order_date}} / {{deliveryDate}}
 * - {{shop_url}} / {{store_url}}
 * - {{discount}} / {{coupon}}
 * - Any custom variables in data.variables
 */
export const replaceTemplatePlaceholders = (templateText, data = {}) => {
  if (!templateText || typeof templateText !== 'string') return '';
  let result = templateText;

  const frontendUrl = process.env.FRONTEND_URL || 'https://geethikadigitalworld.com';
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const name =
    data.name ||
    data.customer_name ||
    data.customerName ||
    data.userName ||
    data.user_name ||
    'Valued Customer';

  const phone =
    data.phone ||
    data.customer_phone ||
    data.customerPhone ||
    '';

  const email =
    data.email ||
    data.customer_email ||
    data.customerEmail ||
    '';

  const orderNumber =
    data.order_number ||
    data.orderNumber ||
    data.orderId ||
    data.order_id ||
    '';

  const orderUrl =
    data.order_url ||
    data.tracking_url ||
    (orderNumber ? `${frontendUrl}/order/${data._id || data.id || orderNumber}` : `${frontendUrl}/shop`);

  let totalStr = '';
  if (data.total !== undefined && data.total !== null && data.total !== '') {
    totalStr = typeof data.total === 'number' ? `₹${data.total.toLocaleString('en-IN')}` : String(data.total);
    if (!totalStr.includes('₹') && !isNaN(Number(totalStr))) {
      totalStr = `₹${totalStr}`;
    }
  }

  const details =
    data.details ||
    data.items ||
    data.order_details ||
    data.product_name ||
    'Personalized Gift Item';

  const address =
    data.address ||
    data.shipping_address ||
    data.shippingAddress ||
    '';

  const status =
    data.status ||
    data.order_status ||
    data.orderStatus ||
    'Confirmed';

  const date =
    data.date ||
    data.order_date ||
    data.deliveryDate ||
    todayFormatted;

  const shopUrl = data.shop_url || data.store_url || `${frontendUrl}/shop`;
  const discount = data.discount || '20';
  const coupon = data.coupon || 'SPECIAL20';

  const replacementMap = {
    name,
    customer_name: name,
    customername: name,
    user_name: name,
    username: name,
    client_name: name,

    phone,
    customer_phone: phone,
    customerphone: phone,

    email,
    customer_email: email,
    customeremail: email,

    order_number: orderNumber,
    ordernumber: orderNumber,
    order_id: orderNumber,
    orderid: orderNumber,

    total: totalStr,
    amount: totalStr,
    order_total: totalStr,

    details,
    items: details,
    order_details: details,
    item_details: details,

    status,
    order_status: status,

    order_url: orderUrl,
    tracking_url: orderUrl,

    address,
    shipping_address: address,

    date,
    order_date: date,
    deliverydate: date,

    shop_url: shopUrl,
    store_url: shopUrl,

    discount,
    coupon,
  };

  // Merge in explicit caller-provided custom variables
  if (data.variables && typeof data.variables === 'object') {
    Object.entries(data.variables).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        replacementMap[k.toLowerCase()] = String(v);
        replacementMap[k] = String(v);
      }
    });
  }

  // Replace all {{key}} case-insensitively, handling optional whitespace inside braces
  for (const [key, val] of Object.entries(replacementMap)) {
    if (val !== undefined && val !== null) {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`{{\\s*${escapedKey}\\s*}}`, 'gi');
      result = result.replace(regex, String(val));
    }
  }

  return result;
};

/**
 * Look up single customer details from User and Order collections by phone number
 */
export const getCustomerDetailsByPhone = async (phone) => {
  if (!phone) {
    return {
      name: 'Valued Customer',
      phone: '',
      email: '',
      order_number: '',
      total: '',
      details: '',
      address: '',
    };
  }

  const tenDigit = getTenDigitPhone(phone);
  const phonePattern = tenDigit ? new RegExp(`${tenDigit}$`) : null;

  let user = null;
  let order = null;

  try {
    if (phonePattern) {
      user = await User.findOne({ phone: { $regex: phonePattern } }).lean();
      order = await Order.findOne({ customer_phone: { $regex: phonePattern } })
        .sort({ createdAt: -1 })
        .lean();
    }
  } catch (err) {
    console.error('Error fetching customer by phone in templateParser:', err.message);
  }

  const name =
    user?.name ||
    order?.customer_name ||
    'Valued Customer';

  const email = user?.email || order?.customer_email || '';

  const orderNumber = order?.order_number || '';
  const total = order?.total !== undefined ? order.total : '';

  let details = '';
  if (order?.items && Array.isArray(order.items) && order.items.length > 0) {
    details = order.items.map((i) => `${i.product_name} (x${i.quantity})`).join(', ');
  }

  let address = order?.shipping_address || '';
  if (!address && user?.address) {
    const parts = [
      user.address.line1,
      user.address.landmark,
      user.address.city,
      user.address.state,
      user.address.pincode,
    ].filter(Boolean);
    address = parts.join(', ');
  }

  return {
    id: user?._id?.toString() || order?._id?.toString() || '',
    name,
    phone: phone,
    email,
    order_number: orderNumber,
    total,
    details,
    address,
    orderCount: order ? 1 : 0,
    totalSpent: order?.total || 0,
  };
};

/**
 * Builds a fast Map of tenDigitPhone -> customerDetails for batch campaign dispatch
 */
export const buildCustomerLookupMap = async (phoneList = []) => {
  const map = new Map();
  if (!Array.isArray(phoneList) || phoneList.length === 0) return map;

  try {
    // Extract 10-digit suffixes for indexing
    const tenDigits = phoneList.map(getTenDigitPhone).filter(Boolean);

    // Fetch all users and recent orders matching these phone suffixes
    const users = await User.find({ phone: { $exists: true, $ne: '' } })
      .select('name email phone address')
      .lean();

    const orders = await Order.find({ customer_phone: { $exists: true, $ne: '' } })
      .select('customer_name customer_email customer_phone order_number items total shipping_address createdAt')
      .sort({ createdAt: -1 })
      .lean();

    users.forEach((u) => {
      if (u.phone) {
        const key = getTenDigitPhone(u.phone);
        if (!map.has(key)) {
          let addr = '';
          if (u.address) {
            addr = [u.address.line1, u.address.city, u.address.pincode].filter(Boolean).join(', ');
          }
          map.set(key, {
            name: u.name || 'Valued Customer',
            phone: u.phone,
            email: u.email || '',
            order_number: '',
            total: '',
            details: '',
            address: addr,
          });
        }
      }
    });

    orders.forEach((o) => {
      if (o.customer_phone) {
        const key = getTenDigitPhone(o.customer_phone);
        const existing = map.get(key);

        let itemsText = '';
        if (o.items && Array.isArray(o.items) && o.items.length > 0) {
          itemsText = o.items.map((i) => `${i.product_name} (x${i.quantity})`).join(', ');
        }

        if (existing) {
          // If user didn't have orders, enrich with latest order info
          if (!existing.order_number && o.order_number) {
            existing.order_number = o.order_number;
            existing.total = o.total;
            existing.details = itemsText;
            existing.address = o.shipping_address || existing.address;
          }
        } else {
          map.set(key, {
            name: o.customer_name || 'Valued Customer',
            phone: o.customer_phone,
            email: o.customer_email || '',
            order_number: o.order_number || '',
            total: o.total,
            details: itemsText,
            address: o.shipping_address || '',
          });
        }
      }
    });
  } catch (err) {
    console.error('Error building customer lookup map:', err.message);
  }

  return map;
};
