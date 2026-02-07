# 🚀 Production Deployment Guide

## Current Setup

- **Backend**: https://geethika-digital-world1.onrender.com (✅ Working)
- **Frontend**: Deploy to Vercel
- **Database**: PostgreSQL on Render

---

## 📦 Frontend Deployment to Vercel

### Step 1: Update Environment Variables

Create `.env.production` in the `client` folder:

```env
VITE_API_URL=https://geethika-digital-world1.onrender.com
```

### Step 2: Vercel Configuration

Your `vercel.json` is already configured:
```json
{
  "version": 2,
  "buildCommand": "cd client && npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "cd client && npm install",
  "framework": null,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 3: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: Leave empty (or select `client` if prompted)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `cd client && npm install`
   - **Node.js Version**: 20.x

5. Add Environment Variables:
   - `VITE_API_URL` = `https://geethika-digital-world1.onrender.com`

6. Click "Deploy"

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd geethika-digital-world
vercel --prod
```

---

## ⚙️ Backend Configuration (Already on Render)

Your backend is already deployed at:
**https://geethika-digital-world1.onrender.com**

### Required Environment Variables on Render:

Make sure these are set in Render Dashboard:

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=<your-postgres-connection-string>
JWT_SECRET=<your-secret-key>
FRONTEND_URL=<your-vercel-url>
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
EMAIL_USER=<your-email>
EMAIL_PASSWORD=<your-email-password>
EMAIL_FROM=<your-from-email>
CLOUDINARY_CLOUD_NAME=<optional>
CLOUDINARY_API_KEY=<optional>
CLOUDINARY_API_SECRET=<optional>
```

---

## 🔧 Update Frontend URL After Deployment

After Vercel deployment, you'll get a URL like:
`https://geethika-digital-world.vercel.app`

**Update Render Backend:**
1. Go to Render Dashboard
2. Select your backend service
3. Go to Environment
4. Update `FRONTEND_URL` to your Vercel URL
5. Save and redeploy

---

## ✅ Production Checklist

### Before Deployment:

- [x] Tailwind v3 installed (stable)
- [x] Vite 5 installed (stable)
- [x] Workspace configuration removed
- [x] CSS converted to Tailwind v3 syntax
- [x] Backend URL configured
- [ ] Environment variables set
- [ ] Node 20.x selected in Vercel

### After Deployment:

- [ ] Test all pages load correctly
- [ ] Test authentication (login/signup)
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test checkout with Razorpay
- [ ] Test admin panel access
- [ ] Test image uploads
- [ ] Test email notifications
- [ ] Check mobile responsiveness
- [ ] Test all API endpoints

---

## 🐛 Troubleshooting

### Build Fails on Vercel

**Error: Cannot find module @rollup/rollup-linux-x64-gnu**

✅ **Fixed!** We're now using:
- Tailwind CSS 3.4.4 (no LightningCSS)
- Vite 5.4.11 (stable)
- Node 20.x

### Styles Not Loading

Make sure:
1. `index.css` has `@tailwind` directives (not `@import "tailwindcss"`)
2. `postcss.config.js` uses `tailwindcss: {}` (not `@tailwindcss/postcss`)
3. Build completes successfully

### API Calls Failing

Check:
1. `VITE_API_URL` is set correctly in Vercel
2. Backend `FRONTEND_URL` includes your Vercel domain
3. CORS is configured in backend

### Images Not Loading

If using Cloudinary:
1. Set Cloudinary env vars in Render
2. Test image upload in admin panel

If using local uploads:
1. Images won't persist on Render free tier
2. Consider using Cloudinary for production

---

## 📊 Performance Optimization

### Frontend (Vercel):
- ✅ Automatic CDN
- ✅ Edge caching
- ✅ Gzip compression
- ✅ Image optimization

### Backend (Render):
- ⚠️ Free tier spins down after 15 min inactivity
- Consider upgrading for production traffic
- Use connection pooling for database

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] Database credentials are secure
- [ ] Razorpay keys are in environment variables (not code)
- [ ] Email credentials are secure
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation is in place
- [ ] SQL injection protection (using parameterized queries)

---

## 📱 Custom Domain (Optional)

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Render:
1. Go to Service Settings → Custom Domain
2. Add your backend domain
3. Update DNS records

---

## 🎉 You're Ready!

Your production stack:
- ✅ **Frontend**: Vercel (Fast, Global CDN)
- ✅ **Backend**: Render (Node.js API)
- ✅ **Database**: PostgreSQL on Render
- ✅ **Payments**: Razorpay Integration
- ✅ **Emails**: Nodemailer
- ✅ **Images**: Cloudinary (optional)

**Next Steps:**
1. Deploy frontend to Vercel
2. Update backend FRONTEND_URL
3. Test everything
4. Share your live site! 🚀

---

## 📞 Support

If you encounter issues:
1. Check Vercel build logs
2. Check Render service logs
3. Test API endpoints directly
4. Verify environment variables
5. Check browser console for errors

---

**Happy Deploying! 🎊**
