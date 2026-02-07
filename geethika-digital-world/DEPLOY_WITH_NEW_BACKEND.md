# Quick Deploy Guide - New Backend URL

## ✅ Backend URL Updated
**New Backend:** `https://geethika-digital-world.onrender.com`

All environment files have been updated to use the new backend URL.

---

## 🚀 Quick Deploy Steps

### Step 1: Test Backend (Optional but Recommended)
```bash
# Test if backend is responding
curl https://geethika-digital-world.onrender.com/health

# Test products endpoint
curl https://geethika-digital-world.onrender.com/api/products
```

Expected: JSON responses with data

---

### Step 2: Rebuild Frontend
```bash
cd geethika-digital-world/client

# Install dependencies (if needed)
npm install

# Build for production
npm run build
```

This will create an optimized production build in the `dist` folder.

---

### Step 3: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)
```bash
# Make sure you're in the client directory
cd geethika-digital-world/client

# Deploy to production
vercel --prod
```

#### Option B: Using Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update `VITE_API_URL` to: `https://geethika-digital-world.onrender.com`
5. Go to **Deployments** tab
6. Click **Redeploy** on the latest deployment

---

### Step 4: Verify Deployment

#### Check in Browser:
1. Open your deployed site
2. Open DevTools (F12)
3. Go to **Network** tab
4. Navigate around the site
5. **Verify:** All API calls go to `https://geethika-digital-world.onrender.com`

#### Test Key Features:
- [ ] Homepage loads
- [ ] Products page shows items
- [ ] Product detail page works
- [ ] Add to cart works
- [ ] Login/Register works
- [ ] Checkout process works
- [ ] Admin login works
- [ ] Admin dashboard loads

---

## 🔧 Troubleshooting

### Problem: API calls still going to old URL
**Solution:**
1. Clear browser cache (Ctrl + Shift + Delete)
2. Hard refresh (Ctrl + Shift + R)
3. Rebuild frontend: `npm run build`
4. Redeploy to Vercel

### Problem: 404 errors on API calls
**Solution:**
1. Check backend is running: `curl https://geethika-digital-world.onrender.com/health`
2. Check Render dashboard for backend status
3. Check backend logs for errors

### Problem: CORS errors
**Solution:**
1. Verify backend CORS settings allow your frontend domain
2. Check backend `.env` has correct `FRONTEND_URL`
3. Restart backend service on Render

### Problem: Images not loading
**Solution:**
1. Check if images are uploaded to Cloudinary
2. Verify Cloudinary credentials in backend
3. Check image URLs in database

---

## 📋 Environment Variables Checklist

### Frontend (.env and .env.production)
```env
VITE_API_URL=https://geethika-digital-world.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_live_SCXkFazIA5jEk0
```

### Vercel Dashboard
- `VITE_API_URL` = `https://geethika-digital-world.onrender.com`

### Backend (Render)
Make sure backend has:
- `FRONTEND_URL` = Your Vercel frontend URL
- `DATABASE_URL` = Your PostgreSQL connection string
- `JWT_SECRET` = Your JWT secret
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- `CLOUDINARY_*` variables (if using Cloudinary)

---

## 🎉 Success Indicators

✅ No console errors in browser  
✅ All API calls go to `https://geethika-digital-world.onrender.com`  
✅ Products load correctly  
✅ Cart functionality works  
✅ Checkout process completes  
✅ Admin panel accessible  
✅ Images display properly  

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check Network tab for failed requests
3. Check Render logs for backend errors
4. Verify all environment variables are set correctly

---

**Last Updated:** $(date)  
**Status:** Ready to Deploy ✅
