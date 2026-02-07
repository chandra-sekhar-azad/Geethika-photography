# 🚀 Deploy Homepage Management Feature

## Pre-Deployment Checklist

### ✅ Local Testing Complete
- [ ] Database migration ran successfully
- [ ] Backend server starts without errors
- [ ] Frontend loads homepage management page
- [ ] Can upload images
- [ ] Can edit content
- [ ] Can toggle visibility
- [ ] Changes appear on homepage
- [ ] Audit log records changes
- [ ] Only super admins can access

## Deployment Steps

### 1. Backend Deployment (Render/Your Host)

#### A. Database Migration
```bash
# SSH into your production server or use Render shell
cd backend
node scripts/create-homepage-content-table.js
```

**Verify Output:**
```
✅ Homepage content table setup complete!
```

#### B. Deploy Code
```bash
# Commit and push changes
git add .
git commit -m "Add homepage management feature"
git push origin main
```

**Files to Deploy:**
- `backend/routes/homepage.js` ✅
- `backend/scripts/create-homepage-content-table.js` ✅
- `backend/server.js` (modified) ✅

#### C. Verify Backend
```bash
# Test API endpoint
curl https://geethika-digital-world1.onrender.com/api/homepage/content
```

**Expected Response:**
```json
{
  "success": true,
  "content": {
    "hero_banner": {...},
    "offers": [...],
    "testimonials": [...]
  }
}
```

### 2. Frontend Deployment (Vercel)

#### A. Build Frontend
```bash
cd client
npm run build
```

**Verify Build:**
- No errors in build output
- `dist/` folder created
- Check bundle size

#### B. Deploy to Vercel
```bash
cd client
vercel --prod
```

**Or via Git:**
```bash
git push origin main
# Vercel auto-deploys
```

**Files to Deploy:**
- `client/src/pages/admin/HomePageManagement.jsx` ✅
- `client/src/App.jsx` (modified) ✅
- `client/src/pages/admin/AdminDashboard.jsx` (modified) ✅
- `client/src/components/AdminLayout.jsx` (modified) ✅

#### C. Verify Frontend
1. Visit your production URL
2. Login as super admin
3. Navigate to `/admin/homepage`
4. Verify page loads correctly

### 3. Post-Deployment Testing

#### Test Checklist
- [ ] Access `/admin/homepage` in production
- [ ] Upload a test image
- [ ] Edit hero banner
- [ ] Update offer card
- [ ] Change testimonial
- [ ] Toggle visibility
- [ ] Verify changes on homepage
- [ ] Check audit log
- [ ] Test on mobile device
- [ ] Test in different browsers

#### API Testing
```bash
# Get public content
curl https://your-domain.com/api/homepage/content

# Get admin content (with token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-domain.com/api/homepage/admin/content
```

### 4. Environment Variables

#### Backend (.env)
```env
# Existing variables
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
JWT_SECRET=your-jwt-secret

# No new variables needed for this feature
```

#### Frontend (.env.production)
```env
VITE_API_URL=https://geethika-digital-world1.onrender.com
VITE_RAZORPAY_KEY_ID=your-razorpay-key
```

### 5. Database Verification

#### Check Table Exists
```sql
-- Connect to production database
SELECT * FROM homepage_content;
```

**Expected Result:**
- 8 rows (1 banner + 4 offers + 3 testimonials)
- All with `is_active = true`

#### Check Indexes
```sql
SELECT * FROM pg_indexes 
WHERE tablename = 'homepage_content';
```

### 6. Security Verification

#### Test Access Control
- [ ] Anonymous users cannot access `/api/homepage/admin/*`
- [ ] Regular users cannot access admin endpoints
- [ ] Only super admins can edit content
- [ ] JWT tokens are validated
- [ ] File uploads are validated

#### Test Audit Logging
- [ ] All changes are logged
- [ ] User ID is recorded
- [ ] Timestamps are correct
- [ ] Action types are accurate

## Rollback Plan

### If Issues Occur:

#### 1. Rollback Database
```sql
-- Drop table if needed
DROP TABLE IF EXISTS homepage_content;
```

#### 2. Rollback Code
```bash
git revert HEAD
git push origin main
```

#### 3. Redeploy Previous Version
- Vercel: Rollback to previous deployment
- Render: Redeploy previous commit

## Monitoring

### After Deployment:

#### Check Logs
```bash
# Backend logs (Render)
# Check for errors in homepage routes

# Frontend logs (Vercel)
# Check for console errors
```

#### Monitor Performance
- [ ] API response times < 500ms
- [ ] Image uploads complete successfully
- [ ] No memory leaks
- [ ] Database queries optimized

#### User Feedback
- [ ] Super admins can access feature
- [ ] Interface is intuitive
- [ ] Images display correctly
- [ ] Changes save successfully

## Documentation for Team

### Share with Team:
1. **QUICK_START_HOMEPAGE.md** - How to use the feature
2. **HOMEPAGE_MANAGEMENT_GUIDE.md** - Detailed user guide
3. **FEATURE_SUMMARY.md** - Technical overview

### Training Points:
- How to access homepage management
- How to upload images
- How to edit content
- How to toggle visibility
- Image size recommendations
- Where to find audit logs

## Success Criteria

### Feature is Successfully Deployed When:
- ✅ Database table exists in production
- ✅ API endpoints respond correctly
- ✅ Admin page loads without errors
- ✅ Super admins can upload images
- ✅ Content updates save successfully
- ✅ Changes appear on homepage
- ✅ Audit log records all changes
- ✅ Security controls work
- ✅ Mobile responsive
- ✅ No console errors

## Post-Deployment Tasks

### Immediate (Day 1):
- [ ] Test all functionality in production
- [ ] Upload production-ready images
- [ ] Update homepage content
- [ ] Verify audit logs
- [ ] Monitor error logs

### Short-term (Week 1):
- [ ] Gather user feedback
- [ ] Monitor performance metrics
- [ ] Check for any issues
- [ ] Document any bugs
- [ ] Plan improvements

### Long-term (Month 1):
- [ ] Review usage analytics
- [ ] Optimize if needed
- [ ] Consider enhancements
- [ ] Update documentation
- [ ] Train additional admins

## Support

### If Issues Arise:

#### Backend Issues:
1. Check Render logs
2. Verify database connection
3. Test API endpoints
4. Check environment variables

#### Frontend Issues:
1. Check Vercel logs
2. Verify build succeeded
3. Test in incognito mode
4. Clear browser cache

#### Database Issues:
1. Verify table exists
2. Check data integrity
3. Test queries manually
4. Review migration logs

## Contact

For deployment support:
- Check documentation in `docs/` folder
- Review error logs
- Test locally first
- Verify all files are deployed

---

## Quick Deploy Commands

```bash
# 1. Run migration on production
node scripts/create-homepage-content-table.js

# 2. Deploy backend
git push origin main

# 3. Deploy frontend
cd client
vercel --prod

# 4. Test
curl https://your-domain.com/api/homepage/content

# 5. Verify
# Login and test at /admin/homepage
```

---

**Ready to deploy! 🚀**
