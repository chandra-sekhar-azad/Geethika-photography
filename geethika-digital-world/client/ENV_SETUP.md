# Frontend Environment Variables Setup

## 📋 Overview

The frontend uses Vite's environment variable system. All variables must be prefixed with `VITE_` to be exposed to the client.

## 🔧 Setup

### 1. Create `.env` file

Copy `.env.example` to `.env`:
```bash
cd client
cp .env.example .env
```

### 2. Configure Variables

Edit `.env` with your values:

```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_API_BASE_URL=http://localhost:5000/api

# Razorpay Key (Frontend)
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here

# WhatsApp Number
VITE_WHATSAPP_NUMBER=919876543210

# App Details
VITE_APP_NAME=Geethika Digital World
VITE_APP_URL=http://localhost:5174

# Feature Flags
VITE_ENABLE_PAYMENT=true
VITE_ENABLE_EMAIL_VERIFICATION=false
VITE_ENABLE_ANALYTICS=false

# Environment
VITE_NODE_ENV=development
```

### 3. Restart Dev Server

After changing `.env`, restart the dev server:
```bash
npm run dev
```

## 📝 Available Variables

### API Configuration
- `VITE_API_URL` - Backend server URL
- `VITE_API_BASE_URL` - API base URL with /api prefix

### Payment
- `VITE_RAZORPAY_KEY_ID` - Razorpay public key (test or live)

### Contact
- `VITE_WHATSAPP_NUMBER` - WhatsApp number (format: country code + number)

### App
- `VITE_APP_NAME` - Application name
- `VITE_APP_URL` - Frontend URL

### Features
- `VITE_ENABLE_PAYMENT` - Enable/disable payment gateway
- `VITE_ENABLE_EMAIL_VERIFICATION` - Enable/disable email verification
- `VITE_ENABLE_ANALYTICS` - Enable/disable analytics

### Environment
- `VITE_NODE_ENV` - development or production

## 💻 Usage in Code

### Method 1: Direct Access
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
```

### Method 2: Using Config Helper (Recommended)
```javascript
import { env, api, getWhatsAppUrl } from '@/config/env';

// Access variables
console.log(env.apiUrl);
console.log(env.razorpayKeyId);

// Use API endpoints
fetch(api.products.list);
fetch(api.orders.create);

// Get WhatsApp URL
const whatsappUrl = getWhatsAppUrl('Hello!');
window.open(whatsappUrl, '_blank');

// Check features
if (env.enablePayment) {
  // Show payment options
}
```

## 🔄 Updating Existing Code

### Before (Hardcoded URLs):
```javascript
fetch('http://localhost:5000/api/products')
```

### After (Using env):
```javascript
import { api } from '@/config/env';
fetch(api.products.list)
```

### Before (Hardcoded WhatsApp):
```javascript
const url = `https://wa.me/919492686421?text=${message}`;
```

### After (Using helper):
```javascript
import { getWhatsAppUrl } from '@/config/env';
const url = getWhatsAppUrl(message);
```

## 🚀 Production Setup

### For Vercel Deployment:

1. Go to Project Settings → Environment Variables
2. Add each variable:
   - `VITE_API_URL` = `https://your-backend.com`
   - `VITE_API_BASE_URL` = `https://your-backend.com/api`
   - `VITE_RAZORPAY_KEY_ID` = `rzp_live_your_live_key`
   - `VITE_WHATSAPP_NUMBER` = `919876543210`
   - `VITE_NODE_ENV` = `production`

3. Redeploy

### For Other Platforms:

Create `.env.production`:
```env
VITE_API_URL=https://your-backend.com
VITE_API_BASE_URL=https://your-backend.com/api
VITE_RAZORPAY_KEY_ID=rzp_live_your_live_key
VITE_WHATSAPP_NUMBER=919876543210
VITE_NODE_ENV=production
```

## 🔒 Security Notes

### ✅ Safe to Expose (Frontend)
- API URLs
- Razorpay Key ID (public key)
- WhatsApp number
- App name and URL
- Feature flags

### ❌ Never Expose (Backend Only)
- Razorpay Key Secret
- Database credentials
- JWT secrets
- Email passwords
- API secrets

## 🐛 Troubleshooting

### Variables Not Working?

1. **Check prefix**: Must start with `VITE_`
   ```env
   ✅ VITE_API_URL=...
   ❌ API_URL=...
   ```

2. **Restart dev server**: Changes require restart
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Check import**: Use `import.meta.env` not `process.env`
   ```javascript
   ✅ import.meta.env.VITE_API_URL
   ❌ process.env.VITE_API_URL
   ```

4. **Verify file location**: Must be in `client/` folder
   ```
   ✅ client/.env
   ❌ .env (root)
   ```

### Variables Undefined?

Check if variable exists:
```javascript
console.log(import.meta.env);
// Should show all VITE_ variables
```

## 📦 Example API Call

```javascript
import { api } from '@/config/env';

// Fetch products
const response = await fetch(api.products.list);
const data = await response.json();

// Create order
const response = await fetch(api.orders.create, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(orderData)
});

// Get product detail
const productId = 1;
const response = await fetch(api.products.detail(productId));
```

## 🎯 Benefits

1. **Easy configuration** - Change URLs in one place
2. **Environment-specific** - Different values for dev/prod
3. **Type-safe** - Centralized config with defaults
4. **Maintainable** - No hardcoded values in components
5. **Secure** - Sensitive data in backend only

## 📚 Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Razorpay Keys](https://dashboard.razorpay.com/app/keys)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Remember**: Always restart the dev server after changing `.env` files!
