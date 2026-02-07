# Test Homepage Management Feature

## Quick Test Steps

### 1. Start Backend Server
```bash
cd geethika-digital-world/backend
npm run dev
```

### 2. Start Frontend
```bash
cd geethika-digital-world/client
npm run dev
```

### 3. Login as Super Admin
1. Go to `http://localhost:5173/admin/login`
2. Use super admin credentials from `ADMIN_CREDENTIALS.txt`

### 4. Access Homepage Management
1. Click "Homepage Management" from dashboard
2. Or go to `http://localhost:5173/admin/homepage`

### 5. Test Features

#### Test Hero Banner
1. Click edit icon on hero banner
2. Upload a new image
3. Change title to "Test Title"
4. Click "Save Changes"
5. Go to homepage and verify changes

#### Test Special Offers
1. Click edit on any offer card
2. Update description
3. Change display order
4. Save and verify

#### Test Testimonials
1. Click edit on a testimonial
2. Upload new customer photo
3. Update review text
4. Save and check homepage

#### Test Visibility Toggle
1. Click eye icon to hide content
2. Go to homepage - content should be hidden
3. Click eye icon again to show
4. Verify content reappears

### 6. Verify Audit Log
1. Go to `/admin/audit-log`
2. Check for homepage content changes
3. Verify user, action, and timestamp

## Expected Results

✅ All content loads correctly
✅ Images upload successfully
✅ Changes save without errors
✅ Homepage reflects updates immediately
✅ Visibility toggle works
✅ Audit log records all changes
✅ Only super admins can access

## Troubleshooting

### Backend won't start?
- Check `.env` file has correct database credentials
- Verify database is running
- Check port 5000 is not in use

### Frontend won't start?
- Check `.env` has `VITE_API_URL`
- Verify port 5173 is available
- Run `npm install` if needed

### Can't access homepage management?
- Verify you're logged in as super admin
- Check browser console for errors
- Verify backend route is registered

### Images not uploading?
- Check `backend/uploads/` directory exists
- Verify file size < 5MB
- Check file format (JPG, PNG, WebP)

### Changes not showing?
- Hard refresh browser (Ctrl+F5)
- Check `is_active` is true
- Verify API response in Network tab

## API Test (Optional)

### Test with curl:
```bash
# Get public content
curl http://localhost:5000/api/homepage/content

# Get admin content (requires token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/homepage/admin/content
```

## Success Criteria

- [x] Database table created
- [x] Backend routes working
- [x] Frontend page loads
- [x] Can edit content
- [x] Can upload images
- [x] Can toggle visibility
- [x] Changes persist
- [x] Audit log works
- [x] Super admin only access

## Next: Deploy to Production

Once local testing is complete:
1. Run migration on production database
2. Deploy backend
3. Deploy frontend
4. Test in production
5. Update homepage content with real images
