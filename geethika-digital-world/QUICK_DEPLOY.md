# ⚡ Quick Deploy Guide

Fast-track deployment guide for experienced developers.

---

## 🎯 Overview

- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Node.js + Express)
- **Database**: Render PostgreSQL

---

## 📦 1. Database (Render)

```bash
# Create PostgreSQL on Render Dashboard
Name: geethika-db
Plan: Free
Region: Singapore

# Copy Internal Database URL
postgresql://user:pass@host:5432/geethika_db
```

---

## 🖥️ 2. Backend (Render)

### Deploy
```bash
# Render Dashboard → New Web Service
Repository: Your GitHub repo
Root Directory: backend
Build: npm install
Start: npm start
```

### Environment Variables
```bash
DATABASE_URL=<internal-db-url>
JWT_SECRET=<random-32-chars>
NODE_ENV=production
PORT=10000
RAZORPAY_KEY_ID=<your-key>
RAZORPAY_KEY_SECRET=<your-secret>
EMAIL_USER=<gmail>
EMAIL_PASSWORD=<app-password>
EMAIL_FROM=<gmail>
FRONTEND_URL=<vercel-url>
```

### Initialize Database
```bash
# Connect to production DB
export DATABASE_URL=<external-db-url>

cd backend
node scripts/create-admin.js
node scripts/create-services-table.js
node scripts/create-whatsapp-templates-table.js
node scripts/create-gallery-table.js
node scripts/add-all-categories-simple.js
```

---

## 🌐 3. Frontend (Vercel)

### Deploy
```bash
# Option 1: CLI
cd client
vercel --prod

# Option 2: Dashboard
# Import from GitHub
# Root: client
# Framework: Vite
```

### Environment Variables
```bash
VITE_API_URL=<render-backend-url>
```

---

## 🔄 4. Update Backend CORS

```bash
# In Render Backend Settings
FRONTEND_URL=<your-vercel-url>

# Redeploy backend
```

---

## ✅ 5. Test

```bash
# Frontend
curl https://your-app.vercel.app

# Backend
curl https://your-backend.onrender.com/api/products

# Admin Login
https://your-app.vercel.app/admin/login
```

---

## 🚨 Common Issues

### CORS Error
```bash
# Update FRONTEND_URL in Render backend
# Ensure no trailing slashes
```

### Database Connection
```bash
# Use Internal URL for backend
# Use External URL for local scripts
```

### Images Not Loading
```bash
# Check uploads directory
# Verify Cloudinary config (if using)
```

---

## 📝 Admin Credentials

Check: `ADMIN_CREDENTIALS.txt`

```
Email: admin@geethikadigitalworld.com
Password: Admin@123
```

---

## 🔗 Quick Links

- [Full Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [Render Dashboard](https://dashboard.render.com)
- [Vercel Dashboard](https://vercel.com/dashboard)

---

## ⏱️ Estimated Time

- Database Setup: 5 minutes
- Backend Deploy: 10 minutes
- Frontend Deploy: 5 minutes
- Testing: 10 minutes

**Total: ~30 minutes**

---

## 🎉 Done!

Your app is live at:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`
- Admin: `https://your-app.vercel.app/admin/login`
