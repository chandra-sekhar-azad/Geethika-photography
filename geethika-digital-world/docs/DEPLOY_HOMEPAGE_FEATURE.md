# Homepage Management Feature - Deployment Guide

## ✅ What Was Fixed

### 1. SQL Query Bug in homepage.js
- **Issue**: PostgreSQL placeholders were incorrectly formatted (`${paramCount}` instead of `$${paramCount}`)
- **Fixed**: All SQL placeholders now use proper format (`$1`, `$2`, etc.)
- **File**: `backend/routes/homepage.js`

### 2. Route Configuration
- **Verified**: Homepage routes are properly imported and registered in `server.js`
- **Endpoints**:
  - `GET /api/homepage/content` - Public endpoint (active content only)
  - `GET /api/homepage/admin/content` - Admin endpoint (all content)
  - `PUT /api/homepage/admin/content/:id` - Update content
  - `POST /api/homepage/admin/content` - Create content
  - `DELETE /api/homepage/admin/content/:id` - Delete content

### 3. Database Table
- **Table**: `homepage_content`
- **Status**: Already created on production database
- **Default Content**: 1 hero banner, 4 offers, 3 testimonials

## 🚀 Deployment Steps for Render

### Step 1: Push Changes to GitHub
```bash
cd geethika-digital-world
git add .
git commit -m "Fix homepage management SQL queries and routes"
git push origin main
```

### Step 2: Redeploy on Render
1. Go to https://dashboard.render.com
2. Find your backend service: `geethika-digital-world1`
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait for deployment to complete (2-3 minutes)

### Step 3: Verify Deployment
Test the API endpoints:

```bash
# Test public endpoint
curl https://geethika-digital-world1.onrender.com/api/homepage/content

# Test admin endpoint (should return 401 without token)
curl https://geethika-digital-world1.onrender.com/api/homepage/admin/content
```

Expected responses:
- Public endpoint: Should return hero banner, offers, and testimonials
- Admin endpoint: Should return `{"error": "Authentication required"}`

## 📋 Testing Homepage Management

### 1. Access Admin Panel
1. Go to your frontend URL
2. Login as Super Admin
3. Navigate to `/admin/homepage`

### 2. Test Features
- ✅ View all homepage content (banner, offers, testimonials)
- ✅ Edit content (title, description, link)
- ✅ Upload new images
- ✅ Toggle active/inactive status
- ✅ Change display order

### 3. Verify on Homepage
1. Go to the main homepage
2. Check if changes appear immediately
3. Verify images load correctly

## 🔧 Troubleshooting

### Issue: Routes still not found (404)
**Solution**: 
- Verify the latest code is pushed to GitHub
- Manually redeploy on Render
- Check Render logs for any import errors

### Issue: Database table not found
**Solution**:
Run the table creation script on production:
```bash
# Connect to production database and run:
# backend/scripts/create-homepage-content-table.js
```

### Issue: Images not uploading
**Solution**:
- Check Render has write permissions to `/uploads` directory
- Verify Cloudinary is configured (if using cloud storage)
- Check file size limits in upload middleware

## 📝 Files Modified

1. `backend/routes/homepage.js` - Fixed SQL placeholders
2. `backend/server.js` - Already has homepage routes registered
3. `client/src/pages/admin/HomePageManagement.jsx` - Frontend component (no changes needed)

## 🎯 Next Steps

After deployment:
1. Test all homepage management features
2. Upload custom images for hero banner
3. Update offers and testimonials
4. Verify changes appear on public homepage

## 📞 Support

If issues persist:
1. Check Render deployment logs
2. Verify database connection
3. Test API endpoints with Postman
4. Check browser console for frontend errors
