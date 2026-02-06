# 🚀 Vercel Frontend Deployment Guide

Complete step-by-step guide to deploy your React frontend to Vercel.

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ GitHub account with your code pushed
- ✅ Vercel account (sign up at https://vercel.com)
- ✅ Backend API URL (from Render or your backend host)
- ✅ Code is working locally

---

## 🎯 Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Sign Up / Login to Vercel

1. Go to https://vercel.com
2. Click "Sign Up" or "Login"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub repositories

### Step 2: Import Your Project

1. **Click "Add New..."** in the top right
2. **Select "Project"**
3. **Import Git Repository**:
   - You'll see a list of your GitHub repositories
   - Find your repository (e.g., `geethika-digital-world`)
   - Click "Import"

### Step 3: Configure Project Settings

You'll see a configuration screen. Fill in:

#### Framework Preset
```
Framework Preset: Vite
```
(Vercel should auto-detect this)

#### Root Directory
```
Root Directory: client
```
**Important**: Click "Edit" next to Root Directory and type `client`

#### Build and Output Settings
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```
(These should be auto-filled)

#### Node.js Version
```
Node.js Version: 18.x (or latest LTS)
```

### Step 4: Add Environment Variables

**CRITICAL**: Before deploying, add environment variables:

1. **Expand "Environment Variables" section**
2. **Add the following**:

```bash
# Variable Name: VITE_API_URL
# Value: https://your-backend.onrender.com
# Environment: Production, Preview, Development (select all)
```

**Example**:
```
Name: VITE_API_URL
Value: https://geethika-backend.onrender.com
```

**Note**: Replace with your actual backend URL (no trailing slash!)

### Step 5: Deploy

1. **Click "Deploy"**
2. **Wait 2-5 minutes** for the build to complete
3. **Watch the build logs** (they'll show in real-time)

### Step 6: Verify Deployment

Once deployed, you'll see:
- ✅ Confetti animation (success!)
- 🔗 Your deployment URL: `https://your-project.vercel.app`
- 📸 Screenshot preview of your site

**Click "Visit"** to see your live site!

---

## 🎯 Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Navigate to Client Directory

```bash
cd geethika-digital-world/client
```

### Step 4: Create Production Environment File

Create `.env.production`:

```bash
VITE_API_URL=https://your-backend.onrender.com
```

### Step 5: Deploy

```bash
vercel --prod
```

Follow the prompts:
```
? Set up and deploy "~/geethika-digital-world/client"? [Y/n] Y
? Which scope do you want to deploy to? Your Account
? Link to existing project? [y/N] N
? What's your project's name? geethika-digital-world
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

### Step 6: Note Your URL

After deployment completes, you'll see:
```
✅  Production: https://geethika-digital-world.vercel.app [copied to clipboard]
```

---

## ⚙️ Configuration Files

### Verify `vercel.json` Exists

Your `client/vercel.json` should contain:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
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
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

This ensures:
- React Router works correctly (all routes go to index.html)
- Security headers are set

### Verify `package.json` Scripts

Your `client/package.json` should have:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 🔧 Environment Variables Management

### View/Edit Environment Variables

1. Go to your project in Vercel Dashboard
2. Click "Settings" tab
3. Click "Environment Variables" in sidebar
4. Add/Edit/Delete variables as needed

### Environment Types

- **Production**: Used for production deployments (main branch)
- **Preview**: Used for preview deployments (PRs, other branches)
- **Development**: Used for local development with `vercel dev`

### Required Variables

```bash
VITE_API_URL=https://your-backend.onrender.com
```

### Optional Variables

```bash
# If you need Razorpay key in frontend
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx

# Google Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your-key
```

**Important**: All Vite environment variables MUST start with `VITE_`

---

## 🔄 Automatic Deployments

### How It Works

Vercel automatically deploys when you push to GitHub:

- **Push to `main` branch** → Production deployment
- **Push to other branches** → Preview deployment
- **Open Pull Request** → Preview deployment with unique URL

### Disable Auto-Deploy (Optional)

1. Go to Project Settings
2. Click "Git" in sidebar
3. Toggle "Production Branch" or "Preview Deployments"

---

## 🌐 Custom Domain Setup

### Add Custom Domain

1. **Go to Project Settings**
2. **Click "Domains"**
3. **Click "Add"**
4. **Enter your domain**: `www.yourdomain.com`
5. **Follow DNS instructions**:
   - Add A record or CNAME record
   - Wait for DNS propagation (5-60 minutes)

### Example DNS Settings

For `www.yourdomain.com`:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

For root domain `yourdomain.com`:
```
Type: A
Name: @
Value: 76.76.21.21
```

### SSL Certificate

- Vercel automatically provisions SSL certificates
- HTTPS is enabled by default
- No configuration needed!

---

## 🐛 Troubleshooting

### Issue 1: Build Failed

**Error**: "Build failed with exit code 1"

**Solutions**:
1. Check build logs for specific error
2. Verify `package.json` has correct scripts
3. Ensure all dependencies are in `package.json`
4. Try building locally: `npm run build`
5. Check Node.js version compatibility

**Common causes**:
```bash
# Missing dependency
npm install <missing-package>

# Wrong Node version
# Update in Project Settings → General → Node.js Version

# TypeScript errors
# Fix errors shown in build log
```

### Issue 2: Environment Variables Not Working

**Error**: API calls failing, undefined variables

**Solutions**:
1. Verify variable name starts with `VITE_`
2. Check variable is set for correct environment (Production)
3. Redeploy after adding variables
4. Check for typos in variable names

**Test**:
```javascript
// In your code
console.log('API URL:', import.meta.env.VITE_API_URL);
```

### Issue 3: 404 on Page Refresh

**Error**: Refreshing any page shows 404

**Solution**: Ensure `vercel.json` has rewrites configuration (see above)

### Issue 4: CORS Errors

**Error**: "Access-Control-Allow-Origin" error

**Solutions**:
1. Update backend `FRONTEND_URL` environment variable
2. Use your Vercel URL (e.g., `https://your-app.vercel.app`)
3. No trailing slash in URL
4. Redeploy backend after updating

### Issue 5: Images Not Loading

**Solutions**:
1. Check image paths are correct
2. Verify images are in `public` folder or imported
3. Check browser console for 404 errors
4. Ensure backend image URLs are correct

### Issue 6: Slow Build Times

**Solutions**:
1. Check for large dependencies
2. Use `npm ci` instead of `npm install` (faster)
3. Enable caching in Vercel settings
4. Consider upgrading Vercel plan

---

## 📊 Monitoring & Analytics

### View Deployment Logs

1. Go to your project
2. Click "Deployments" tab
3. Click on a deployment
4. View "Building" and "Function Logs"

### Analytics (Pro Plan)

Vercel provides:
- Page views
- Top pages
- Visitor locations
- Device types
- Performance metrics

### Speed Insights

1. Go to Project Settings
2. Enable "Speed Insights"
3. View real user performance data

---

## 🔐 Security Best Practices

### 1. Environment Variables

- ✅ Never commit `.env` files
- ✅ Use Vercel's environment variables
- ✅ Rotate secrets regularly
- ✅ Use different values for preview/production

### 2. Security Headers

Already configured in `vercel.json`:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy

### 3. HTTPS

- ✅ Automatic SSL certificates
- ✅ HTTPS enforced by default
- ✅ HTTP redirects to HTTPS

### 4. Access Control

- Set up team access in Vercel
- Use deployment protection for sensitive projects
- Enable password protection for preview deployments

---

## 🚀 Performance Optimization

### 1. Enable Compression

Vercel automatically compresses responses (gzip/brotli)

### 2. Image Optimization

Use Vercel Image Optimization:

```jsx
import Image from 'next/image'; // If using Next.js

// Or for Vite/React, optimize images before upload
```

### 3. Code Splitting

Vite automatically code-splits. Verify in build output:

```
dist/assets/index-abc123.js    150 KB
dist/assets/vendor-def456.js   500 KB
```

### 4. Caching

Vercel automatically caches:
- Static assets (CSS, JS, images)
- API responses (if configured)

### 5. CDN

Vercel's global CDN automatically serves your app from the nearest location.

---

## 📱 Preview Deployments

### What Are Preview Deployments?

- Unique URL for each branch/PR
- Test changes before merging
- Share with team for review

### Access Preview Deployments

1. Push to a branch (not main)
2. Vercel creates preview deployment
3. Get URL from GitHub PR or Vercel dashboard
4. Share URL: `https://your-app-git-branch-name.vercel.app`

### Preview Environment Variables

Set different values for preview:
1. Go to Environment Variables
2. Select "Preview" environment
3. Add preview-specific values

---

## 🔄 Rollback Deployment

### If Something Goes Wrong

1. **Go to Deployments tab**
2. **Find previous working deployment**
3. **Click "..." menu**
4. **Click "Promote to Production"**
5. **Confirm**

Your site instantly rolls back to the previous version!

---

## 📋 Deployment Checklist

Before deploying:

- [ ] Code is pushed to GitHub
- [ ] `vercel.json` is configured
- [ ] Environment variables are ready
- [ ] Backend URL is known
- [ ] Build works locally (`npm run build`)
- [ ] No console errors locally
- [ ] All routes work locally

After deploying:

- [ ] Site loads successfully
- [ ] All pages accessible
- [ ] API calls working
- [ ] Images loading
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Admin panel accessible
- [ ] Backend CORS updated

---

## 🎯 Quick Commands Reference

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs <deployment-url>

# List deployments
vercel ls

# Remove deployment
vercel rm <deployment-url>

# Open project in browser
vercel open
```

---

## 📞 Support & Resources

### Vercel Documentation
- https://vercel.com/docs
- https://vercel.com/docs/concepts/deployments/overview

### Vite Documentation
- https://vitejs.dev/guide/build.html
- https://vitejs.dev/guide/env-and-mode.html

### Community
- Vercel Discord: https://vercel.com/discord
- GitHub Discussions: https://github.com/vercel/vercel/discussions

---

## ✅ Success Checklist

Your deployment is successful when:

- ✅ Build completes without errors
- ✅ Site is accessible via HTTPS
- ✅ All pages load correctly
- ✅ API calls work (check Network tab)
- ✅ Images display properly
- ✅ No console errors
- ✅ Mobile view works
- ✅ Admin panel accessible
- ✅ Performance is good (< 3s load time)

---

## 🎉 Congratulations!

Your frontend is now live on Vercel! 🚀

**Your URLs**:
- Production: `https://your-app.vercel.app`
- Admin Panel: `https://your-app.vercel.app/admin/login`

**Next Steps**:
1. Update backend CORS with your Vercel URL
2. Test all features end-to-end
3. Set up custom domain (optional)
4. Monitor deployment logs
5. Share with your team!

---

**Last Updated**: February 2026
**Vercel Version**: Latest
