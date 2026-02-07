# 📱 WhatsApp Business API Setup Guide

## ✅ Access Token Added

Your WhatsApp/Facebook access token has been added to the `.env` file.

⚠️ **SECURITY NOTE**: The token you shared is now in your codebase. Make sure:
1. Never commit `.env` files to GitHub
2. Regenerate the token if it was exposed publicly
3. Keep your `.env` file secure

---

## 🔧 Required Configuration

You need to add these additional values to your `.env` file:

### 1. Phone Number ID

This is different from your WhatsApp phone number. Get it from:
- Go to: https://business.facebook.com/wa/manage/phone-numbers/
- Select your WhatsApp Business Account
- Click on your phone number
- Copy the "Phone Number ID" (looks like: `123456789012345`)

Add to `.env`:
```
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
```

### 2. Business Account ID (Optional)

Get it from the same page as above.

Add to `.env`:
```
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id_here
```

### 3. Webhook Verify Token (Optional)

For receiving messages/webhooks:
```
WHATSAPP_VERIFY_TOKEN=geethika_verify_token_123
```

---

## 🧪 Testing the Integration

### Step 1: Install axios (if not already installed)

```bash
cd backend
npm install axios
```

### Step 2: Update .env with Phone Number ID

Edit `backend/.env` and add your Phone Number ID.

### Step 3: Run the test script

```bash
node backend/scripts/test-whatsapp-api.js
```

This will:
- Check if all required environment variables are set
- Send a test message to your WhatsApp number
- Show success or error messages

---

## 📋 What's Been Set Up

### 1. Environment Variables (`.env`)
```
WHATSAPP_NUMBER=919492686421
WHATSAPP_ACCESS_TOKEN=EAARYOkhj1ZBM... (your token)
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here (needs to be added)
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id_here (optional)
```

### 2. WhatsApp Configuration (`backend/config/whatsapp.js`)
Functions available:
- `sendWhatsAppMessage(to, message)` - Send text messages
- `sendWhatsAppTemplate(to, templateName, languageCode, components)` - Send template messages
- `sendWhatsAppMedia(to, mediaType, mediaUrl, caption)` - Send images/videos/documents
- `verifyWebhook(mode, token, challenge)` - Verify webhook for receiving messages

### 3. Test Script (`backend/scripts/test-whatsapp-api.js`)
- Tests the API connection
- Sends a test message
- Shows configuration status

---

## 🚀 How to Use in Your Application

### Example 1: Send Order Confirmation

```javascript
import { sendWhatsAppMessage } from './config/whatsapp.js';

// After order is placed
const customerPhone = '919876543210'; // Customer's WhatsApp number
const message = `
Hello! Your order #${orderId} has been confirmed.

Order Details:
- Total: ₹${total}
- Delivery: ${deliveryDate}

Thank you for shopping with Geethika Digital World!
`;

await sendWhatsAppMessage(customerPhone, message);
```

### Example 2: Send Marketing Campaign

```javascript
import { sendWhatsAppTemplate } from './config/whatsapp.js';

// Send promotional template
await sendWhatsAppTemplate(
  '919876543210',
  'valentine_special', // Template name from WhatsApp Business Manager
  'en',
  [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: 'John' }, // Customer name
        { type: 'text', text: '20%' }   // Discount
      ]
    }
  ]
);
```

### Example 3: Send Product Image

```javascript
import { sendWhatsAppMedia } from './config/whatsapp.js';

await sendWhatsAppMedia(
  '919876543210',
  'image',
  'https://your-domain.com/product-image.jpg',
  'Check out our Valentine Special! 💝'
);
```

---

## 🔐 Getting Your Phone Number ID

### Method 1: Facebook Business Manager

1. Go to https://business.facebook.com/
2. Select your Business Account
3. Go to "WhatsApp Accounts" in the left menu
4. Click on your WhatsApp Business Account
5. Go to "Phone Numbers" tab
6. Click on your phone number
7. Copy the "Phone Number ID" (15-digit number)

### Method 2: Graph API Explorer

1. Go to https://developers.facebook.com/tools/explorer/
2. Select your app
3. Get User Access Token with `whatsapp_business_management` permission
4. Make a GET request to: `/me/phone_numbers`
5. Copy the `id` field from the response

---

## 📱 WhatsApp Business Manager Setup

If you haven't set up WhatsApp Business API yet:

1. **Create Facebook Business Account**
   - Go to https://business.facebook.com/
   - Create or select your business

2. **Add WhatsApp Business Account**
   - Go to Business Settings
   - Click "Add" → "WhatsApp Accounts"
   - Follow the setup wizard

3. **Verify Your Phone Number**
   - Add your business phone number
   - Verify via SMS or call

4. **Create WhatsApp Business App**
   - Go to https://developers.facebook.com/
   - Create a new app
   - Add "WhatsApp" product
   - Link to your Business Account

5. **Get Access Token**
   - Go to WhatsApp → Getting Started
   - Generate a permanent access token
   - Copy and save it securely

---

## ⚠️ Important Notes

### Token Expiration
- The access token you provided may expire
- Generate a permanent token from Facebook Business Manager
- Store it securely in `.env` file

### Rate Limits
- Free tier: 1,000 conversations per month
- Each 24-hour conversation window counts as 1
- Check your usage in Facebook Business Manager

### Message Templates
- Marketing messages require pre-approved templates
- Create templates in WhatsApp Business Manager
- Templates must be approved before use

### Phone Number Format
- Use international format without + sign
- Example: `919876543210` (not `+91 9876543210`)

---

## 🐛 Troubleshooting

### Error: "Invalid access token"
- Token may have expired
- Generate a new permanent token
- Update `.env` file

### Error: "Phone number not found"
- Check `WHATSAPP_PHONE_NUMBER_ID` is correct
- Verify phone number is registered in WhatsApp Business

### Error: "Insufficient permissions"
- Check app has `whatsapp_business_messaging` permission
- Regenerate access token with correct permissions

### Error: "Message not delivered"
- Recipient must have WhatsApp installed
- Recipient must have opted in to receive messages
- Check phone number format

---

## 📚 Resources

- [WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp)
- [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [WhatsApp Business Manager](https://business.facebook.com/wa/manage/)
- [Message Templates Guide](https://developers.facebook.com/docs/whatsapp/message-templates)

---

## ✅ Next Steps

1. Add `WHATSAPP_PHONE_NUMBER_ID` to `.env`
2. Run test script: `node backend/scripts/test-whatsapp-api.js`
3. If test passes, integrate into your order/marketing flows
4. Create message templates in WhatsApp Business Manager
5. Test with real customers

---

**Last Updated**: February 7, 2026  
**Status**: Configuration Added - Needs Phone Number ID
