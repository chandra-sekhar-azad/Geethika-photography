# Full Stack Deployment Guide
## Geethika Digital World - Frontend + Backend

Complete guide to deploy the full application with frontend on Vercel and backend on Render.

---

## 📋 Prerequisites

Before starting, ensure you have:

- [x] GitHub account
- [x] Vercel account (free tier)
- [x] Render account (free tier)
- [x] Cloudinary account (free tier)
- [x] Razorpay account (test mode)
- [x] PostgreSQL knowledge (basic)

---

## 🗄️ Part 1: Database Setup (Render PostgreSQL)

### Step 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `geethika-db`
   - **Database**: `geethika_db`
   - **User**: (auto-generated)
   - **Region**: Choose closest to your users
   - **Plan**: Free
4. Click **"Create Database"**
5. Wait for provisioning (2-3 minutes)

### Step 2: Note Database Credentials

From the database dashboard, copy:
- **Internal Database URL** (for backend connection)
- **External Database URL** (for local testing)
- **Host**, **Port**, **Database**, **Username**, **Password**

---

## 🔧 Part 2: Backend Deployment (Render)

### Step 1: Push Code to GitHub

```bash
cd geethika-digital-world
git init
git add .
git commit -m "Initial commit - Full stack application"
git branch -M main
git remote add origin https://github.com/yourusername/geethika-digital-world.git
git push -u origin main
```

### Step 2: Create Web Service on Render

1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `geethika-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Add Environment Variables

In the "Environment" tab, add:

```env
NODE_ENV=production
PORT=5000

# Database (use Internal Database URL from Step 1)
DB_HOST=<from-render-postgres>
DB_PORT=5432
DB_NAME=geethika_db
DB_USER=<from-render-postgres>
DB_PASSWORD=<from-render-postgres>

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend URL (will update after frontend deployment)
FRONTEND_URL=https://your-frontend.vercel.app

# Admin Credentials
ADMIN_EMAIL=admin@geethikadigitalworld.com
ADMIN_PASSWORD=Admin@123

# WhatsApp
WHATSAPP_NUMBER=919876543210
```

### Step 4: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://geethika-backend.onrender.com`

### Step 5: Run Database Migrations

1. Go to your service dashboard
2. Click **"Shell"** tab
3. Run:
   ```bash
   npm run migrate
   ```
4. Verify tables are created

### Step 6: Test Backend

```bash
# Health check
curl https://geethika-backend.onrender.com/health

# Should return:
# {"status":"healthy","timestamp":"...","database":"connected"}
```

---

## 🎨 Part 3: Frontend Deployment (Vercel)

### Step 1: Update Frontend API URL

Edit `geethika-digital-world/src/config/api.js` (create if doesn't exist):

```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || '';
```

### Step 2: Update Frontend Code

Update API calls to use the API_URL. For example, in your order creation:

```javascript
import { API_URL } from '../config/api';

const response = await fetch(`${API_URL}/api/orders`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
});
```

### Step 3: Deploy to Vercel

#### Option A: Vercel CLI

```bash
cd geethika-digital-world
npm install -g vercel
vercel login
vercel
```

#### Option B: Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 4: Add Environment Variables

In Vercel project settings → Environment Variables:

```env
VITE_API_URL=https://geethika-backend.onrender.com
VITE_RAZORPAY_KEY=your_razorpay_key_id
```

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Note your frontend URL: `https://geethika-digital-world.vercel.app`

### Step 6: Update Backend CORS

Go back to Render backend → Environment Variables:

Update `FRONTEND_URL`:
```env
FRONTEND_URL=https://geethika-digital-world.vercel.app
```

Redeploy backend for changes to take effect.

---

## 🔐 Part 4: Cloudinary Setup

### Step 1: Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for free account
3. Go to Dashboard

### Step 2: Get Credentials

From dashboard, copy:
- **Cloud Name**
- **API Key**
- **API Secret**

### Step 3: Create Upload Presets

1. Go to Settings → Upload
2. Click **"Add upload preset"**
3. Configure:
   - **Preset name**: `geethika_products`
   - **Signing Mode**: Unsigned
   - **Folder**: `geethika/products`
4. Save

### Step 4: Update Backend Environment

Already added in Part 2, Step 3.

---

## 💳 Part 5: Razorpay Setup

### Step 1: Create Razorpay Account

1. Go to [Razorpay](https://razorpay.com)
2. Sign up and complete KYC
3. Go to Dashboard

### Step 2: Get API Keys

1. Go to Settings → API Keys
2. Generate Test Keys (for testing)
3. Copy:
   - **Key ID**
   - **Key Secret**

### Step 3: Configure Webhooks (Optional)

1. Go to Settings → Webhooks
2. Add webhook URL: `https://geethika-backend.onrender.com/api/orders/webhook`
3. Select events: `payment.captured`, `payment.failed`

### Step 4: Update Environment Variables

Already added in Part 2, Step 3 and Part 3, Step 4.

---

## ✅ Part 6: Testing Full Stack

### Test 1: Frontend Access

1. Visit: `https://geethika-digital-world.vercel.app`
2. Verify homepage loads
3. Check all pages work

### Test 2: Product Browsing

1. Go to Shop page
2. Verify products load from backend
3. Click on a product
4. Verify product details load

### Test 3: Add to Cart

1. Add product to cart
2. Go to cart page
3. Verify cart items display

### Test 4: Place Order

1. Fill checkout form
2. Click "Place Order"
3. Verify order is created in backend
4. Check Razorpay payment (test mode)

### Test 5: Service Booking

1. Go to Services page
2. Select a service
3. Fill booking form
4. Submit booking
5. Verify booking is created

### Test 6: Admin Login

1. Go to `/admin` (if admin panel is built)
2. Login with admin credentials
3. Verify admin dashboard loads

---

## 🔧 Part 7: Post-Deployment Configuration

### Update WhatsApp Number

Update in backend environment variables:
```env
WHATSAPP_NUMBER=919876543210
```

### Update Business Information

1. Edit frontend contact page
2. Update address, phone, email
3. Update Google Maps embed
4. Redeploy frontend

### Add Custom Domain (Optional)

#### For Frontend (Vercel):
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

#### For Backend (Render):
1. Go to Service Settings → Custom Domain
2. Add your API subdomain (e.g., api.yourdomain.com)
3. Update DNS records

### SSL Certificates

Both Vercel and Render provide automatic SSL certificates. No action needed.

---

## 📊 Part 8: Monitoring & Maintenance

### Monitor Backend

1. Render Dashboard → Your Service
2. Check Logs tab for errors
3. Monitor Metrics tab for performance

### Monitor Frontend

1. Vercel Dashboard → Your Project
2. Check Deployments for build status
3. Use Analytics (if enabled)

### Database Backups

1. Render PostgreSQL → Backups tab
2. Enable automatic backups
3. Download manual backup:
   ```bash
   pg_dump <external-database-url> > backup.sql
   ```

### Update Dependencies

```bash
# Backend
cd backend
npm update
npm audit fix

# Frontend
cd ..
npm update
npm audit fix
```

---

## 🐛 Troubleshooting

### Backend Not Connecting to Database

1. Check database is running on Render
2. Verify connection string in environment variables
3. Check logs for connection errors

### CORS Errors

1. Verify `FRONTEND_URL` in backend matches your Vercel URL
2. Check CORS configuration in `server.js`
3. Ensure no trailing slashes in URLs

### Images Not Uploading

1. Verify Cloudinary credentials
2. Check upload preset is unsigned
3. Verify file size is under 10MB

### Payment Failing

1. Use Razorpay test cards
2. Verify API keys are correct
3. Check Razorpay dashboard for errors

### Slow Performance

1. Enable Render's paid plan for better performance
2. Optimize images with Cloudinary
3. Enable caching headers
4. Consider CDN for static assets

---

## 📈 Scaling Considerations

### When to Upgrade

- **Free Tier Limits**:
  - Render: 750 hours/month, sleeps after 15 min inactivity
  - Vercel: 100GB bandwidth/month
  - PostgreSQL: 1GB storage

- **Upgrade When**:
  - Traffic exceeds free tier
  - Need faster response times
  - Require 24/7 uptime
  - Need more database storage

### Optimization Tips

1. **Database**: Add indexes on frequently queried columns
2. **Caching**: Implement Redis for session storage
3. **CDN**: Use Cloudinary's CDN for all images
4. **Code Splitting**: Lazy load routes in frontend
5. **Compression**: Already enabled in backend

---

## 🎉 Deployment Complete!

Your full-stack application is now live:

- **Frontend**: https://geethika-digital-world.vercel.app
- **Backend**: https://geethika-backend.onrender.com
- **Database**: Render PostgreSQL
- **Images**: Cloudinary CDN
- **Payments**: Razorpay

### Next Steps

1. ✅ Test all features thoroughly
2. ✅ Update business information
3. ✅ Add real product images
4. ✅ Configure payment gateway for live mode
5. ✅ Set up monitoring and alerts
6. ✅ Create backup strategy
7. ✅ Launch marketing campaign!

---

## 📞 Support

Need help? Contact:
- **Email**: info@geethikadigitalworld.com
- **WhatsApp**: +91 98765 43210

---

**Congratulations! Your e-commerce platform is live! 🚀**
