# 🚀 Deployment Guide - Geethika Digital World

Complete guide to deploy your application to production using Vercel (Frontend) and Render (Backend + Database).

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup (Render PostgreSQL)](#database-setup)
3. [Backend Deployment (Render)](#backend-deployment)
4. [Frontend Deployment (Vercel)](#frontend-deployment)
5. [Post-Deployment Setup](#post-deployment-setup)
6. [Environment Variables](#environment-variables)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before starting, ensure you have:

- ✅ GitHub account (to push your code)
- ✅ Vercel account (sign up at https://vercel.com)
- ✅ Render account (sign up at https://render.com)
- ✅ Your code pushed to a GitHub repository
- ✅ Razorpay account with API keys
- ✅ Email service credentials (Gmail/SendGrid)

---

## 🗄️ Database Setup (Render PostgreSQL)

### Step 1: Create PostgreSQL Database

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" → "PostgreSQL"

2. **Configure Database**
   ```
   Name: geethika-db
   Database: geethika_db
   User: (auto-generated)
   Region: Singapore (or closest to your users)
   PostgreSQL Version: 15
   Plan: Free (or Starter for production)
   ```

3. **Create Database**
   - Click "Create Database"
   - Wait 2-3 minutes for provisioning

4. **Get Connection Details**
   - Copy the "Internal Database URL" (for backend)
   - Copy the "External Database URL" (for local testing)
   - Format: `postgresql://user:password@host:port/database`

### Step 2: Initialize Database Schema

**Option A: Using Render Shell**

1. Go to your database dashboard
2. Click "Connect" → "PSQL Command"
3. Run in your local terminal:
   ```bash
   psql <your-external-database-url>
   ```

**Option B: Using Database Migration Script**

1. Update your local `.env` with the External Database URL
2. Run setup scripts:
   ```bash
   cd backend
   node scripts/create-admin.js
   node scripts/create-services-table.js
   node scripts/create-whatsapp-templates-table.js
   node scripts/create-gallery-table.js
   node scripts/add-all-categories-simple.js
   ```

---

## 🖥️ Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

1. **Create `render.yaml` in project root** (optional but recommended):
   ```yaml
   services:
     - type: web
       name: geethika-backend
       env: node
       region: singapore
       plan: free
       buildCommand: cd backend && npm install
       startCommand: cd backend && npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: PORT
           value: 10000
   ```

2. **Ensure `backend/package.json` has correct scripts**:
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

### Step 2: Deploy to Render

1. **Go to Render Dashboard**
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Select "Connect a repository"
   - Choose your GitHub repository
   - Click "Connect"

3. **Configure Service**
   ```
   Name: geethika-backend
   Region: Singapore
   Branch: main (or master)
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free (or Starter)
   ```

4. **Add Environment Variables**
   
   Click "Advanced" → "Add Environment Variable" and add:

   ```bash
   # Database
   DATABASE_URL=<your-internal-database-url-from-render>
   
   # Server
   NODE_ENV=production
   PORT=10000
   
   # JWT
   JWT_SECRET=<generate-random-string-min-32-chars>
   
   # Razorpay
   RAZORPAY_KEY_ID=<your-razorpay-key-id>
   RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
   
   # Email (Gmail)
   EMAIL_USER=<your-gmail-address>
   EMAIL_PASSWORD=<your-gmail-app-password>
   EMAIL_FROM=<your-gmail-address>
   
   # Cloudinary (Optional - for image uploads)
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
   CLOUDINARY_API_KEY=<your-cloudinary-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-secret>
   
   # CORS (Important!)
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Note your backend URL: `https://geethika-backend.onrender.com`

### Step 3: Verify Backend Deployment

Test your backend:
```bash
# Health check
curl https://geethika-backend.onrender.com/

# API test
curl https://geethika-backend.onrender.com/api/products
```

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. **Update `client/.env.production`** (create if doesn't exist):
   ```bash
   VITE_API_URL=https://geethika-backend.onrender.com
   ```

2. **Ensure `client/vercel.json` exists**:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ],
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-XSS-Protection",
             "value": "1; mode=block"
           }
         ]
       }
     ]
   }
   ```

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd client
   vercel --prod
   ```

**Option B: Using Vercel Dashboard**

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   ```
   Framework Preset: Vite
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables**
   
   Click "Environment Variables" and add:
   ```bash
   VITE_API_URL=https://geethika-backend.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Note your frontend URL: `https://your-app.vercel.app`

### Step 3: Update Backend CORS

1. **Go back to Render Dashboard**
2. **Update Backend Environment Variables**
   - Add/Update: `FRONTEND_URL=https://your-app.vercel.app`
3. **Redeploy Backend** (it will restart automatically)

---

## ⚙️ Post-Deployment Setup

### 1. Create Admin User

**Option A: Using Render Shell**

1. Go to Render Dashboard → Your Backend Service
2. Click "Shell" tab
3. Run:
   ```bash
   cd backend
   node scripts/create-admin.js
   ```

**Option B: Using Local Connection**

1. Connect to production database locally:
   ```bash
   # Update local .env with production DATABASE_URL
   cd backend
   node scripts/create-admin.js
   ```

### 2. Add Initial Data

Run these scripts to populate your database:

```bash
# Categories
node scripts/add-all-categories-simple.js

# Services
node scripts/create-services-table.js

# WhatsApp Templates
node scripts/create-whatsapp-templates-table.js

# Gallery Table
node scripts/create-gallery-table.js
```

### 3. Test Your Application

1. **Visit Frontend**: `https://your-app.vercel.app`
2. **Test Customer Features**:
   - Browse products
   - Add to cart
   - Register/Login
   - Place test order

3. **Test Admin Panel**:
   - Go to: `https://your-app.vercel.app/admin/login`
   - Login with admin credentials
   - Test all admin features

### 4. Configure Custom Domain (Optional)

**For Vercel (Frontend)**:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**For Render (Backend)**:
1. Go to Service Settings → Custom Domains
2. Add your API subdomain (e.g., `api.yourdomain.com`)
3. Update DNS records

---

## 🔐 Environment Variables Reference

### Backend Environment Variables

```bash
# Required
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-secret-min-32-characters
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=https://your-app.vercel.app

# Optional
NODE_ENV=production
PORT=10000
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

### Frontend Environment Variables

```bash
# Required
VITE_API_URL=https://your-backend.onrender.com

# Optional
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Backend Not Starting

**Error**: "Application failed to respond"

**Solutions**:
- Check Render logs for errors
- Verify DATABASE_URL is correct
- Ensure PORT is set to 10000
- Check all required environment variables are set

#### 2. CORS Errors

**Error**: "Access-Control-Allow-Origin"

**Solutions**:
- Verify FRONTEND_URL in backend matches your Vercel URL
- Check backend CORS configuration in `server.js`
- Ensure no trailing slashes in URLs

#### 3. Database Connection Failed

**Error**: "Connection refused" or "Authentication failed"

**Solutions**:
- Use Internal Database URL for backend on Render
- Verify database is running in Render dashboard
- Check database credentials are correct
- Ensure database region matches backend region

#### 4. Images Not Loading

**Solutions**:
- Check if uploads directory exists
- Verify Cloudinary credentials (if using)
- Check file upload size limits
- Ensure proper CORS headers for images

#### 5. Payment Gateway Not Working

**Solutions**:
- Verify Razorpay keys (use live keys for production)
- Check Razorpay webhook URL is set
- Test with Razorpay test mode first
- Verify HTTPS is enabled

#### 6. Email Not Sending

**Solutions**:
- Use Gmail App Password (not regular password)
- Enable "Less secure app access" in Gmail
- Check EMAIL_USER and EMAIL_PASSWORD are correct
- Consider using SendGrid for production

### Checking Logs

**Render Backend Logs**:
1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. Filter by error level

**Vercel Frontend Logs**:
1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click on a deployment → "View Function Logs"

---

## 🔄 Continuous Deployment

### Automatic Deployments

Both Vercel and Render support automatic deployments:

**Vercel**:
- Automatically deploys on every push to `main` branch
- Preview deployments for pull requests

**Render**:
- Automatically deploys on every push to `main` branch
- Can configure branch-specific deployments

### Manual Deployments

**Vercel**:
```bash
cd client
vercel --prod
```

**Render**:
- Go to Dashboard → Service → "Manual Deploy" → "Deploy latest commit"

---

## 📊 Monitoring & Maintenance

### Health Checks

Set up monitoring for your services:

**Backend Health Endpoint**:
```
GET https://your-backend.onrender.com/
```

**Frontend Health**:
```
GET https://your-app.vercel.app/
```

### Database Backups

**Render PostgreSQL**:
- Free plan: No automatic backups
- Paid plans: Daily automatic backups
- Manual backup: Use `pg_dump` command

```bash
pg_dump <external-database-url> > backup.sql
```

### Performance Optimization

1. **Enable Caching**: Use Redis for session storage
2. **CDN**: Vercel provides automatic CDN
3. **Image Optimization**: Use Cloudinary or Vercel Image Optimization
4. **Database Indexing**: Add indexes to frequently queried columns
5. **Compression**: Enable gzip compression (already configured)

---

## 🎯 Production Checklist

Before going live, ensure:

- [ ] All environment variables are set correctly
- [ ] Database is backed up
- [ ] Admin user is created
- [ ] Initial data is populated (categories, services)
- [ ] HTTPS is enabled (automatic on Vercel/Render)
- [ ] Custom domain is configured (optional)
- [ ] Email sending is working
- [ ] Payment gateway is tested
- [ ] All admin features are working
- [ ] Customer registration/login works
- [ ] Order placement works end-to-end
- [ ] Error monitoring is set up
- [ ] Logs are being collected
- [ ] Security headers are configured
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured
- [ ] File uploads are working
- [ ] WhatsApp integration is tested (if using)

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Render/Vercel documentation
3. Check application logs
4. Verify all environment variables
5. Test locally with production database

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use strong JWT secrets** (min 32 characters)
3. **Enable rate limiting** (already configured)
4. **Use HTTPS only** (automatic on Vercel/Render)
5. **Regularly update dependencies**: `npm audit fix`
6. **Use environment-specific keys** (test vs production)
7. **Enable database SSL** (automatic on Render)
8. **Set up monitoring** for suspicious activity
9. **Regular backups** of database
10. **Keep admin credentials secure**

---

## 📝 Quick Reference

### URLs After Deployment

```
Frontend: https://your-app.vercel.app
Backend API: https://your-backend.onrender.com
Admin Panel: https://your-app.vercel.app/admin/login
Database: Internal URL (from Render)
```

### Important Commands

```bash
# Deploy frontend
cd client && vercel --prod

# View backend logs
# (Use Render Dashboard)

# Backup database
pg_dump <database-url> > backup.sql

# Restore database
psql <database-url> < backup.sql
```

---

## ✅ Deployment Complete!

Your application is now live! 🎉

- Frontend: Hosted on Vercel
- Backend: Hosted on Render
- Database: PostgreSQL on Render

Remember to:
- Monitor your application regularly
- Keep dependencies updated
- Backup your database
- Review logs for errors
- Scale resources as needed

---

**Last Updated**: February 2026
**Version**: 1.0.0
