# 🧪 Test Homepage Feature - Step by Step

## ✅ Current Status

- ✅ Code fixed and pushed to GitHub
- ✅ SQL placeholders corrected
- ✅ Routes properly configured
- ⏳ **WAITING**: Render deployment

---

## 🚀 STEP 1: Deploy on Render (YOU MUST DO THIS)

### Go to Render Dashboard
1. Open: https://dashboard.render.com
2. Login to your account
3. Find service: **geethika-digital-world1**

### Deploy Latest Code
1. Click **"Manual Deploy"** button (top right)
2. Select **"Deploy latest commit"**
3. Wait for deployment (2-3 minutes)
4. Look for "Live" status with green checkmark

### Verify Deployment
Run this command to test:
```bash
curl https://geethika-digital-world1.onrender.com/api/homepage/content
```

**Expected Result:**
```json
{
  "success": true,
  "content": {
    "hero_banner": {
      "id": 1,
      "title": "Welcome to Geethika Digital World",
      "description": "...",
      "image_url": "/uploads/...",
      "is_active": true
    },
    "offers": [
      { "id": 2, "title": "Special Offer 1", ... },
      { "id": 3, "title": "Special Offer 2", ... },
      { "id": 4, "title": "Special Offer 3", ... },
      { "id": 5, "title": "Special Offer 4", ... }
    ],
    "testimonials": [
      { "id": 6, "title": "Customer 1", ... },
      { "id": 7, "title": "Customer 2", ... },
      { "id": 8, "title": "Customer 3", ... }
    ]
  }
}
```

---

## 🧪 STEP 2: Test Admin Panel

### Login as Super Admin
1. Go to your frontend URL
2. Click "Admin Login" or go to `/admin/login`
3. Enter Super Admin credentials:
   - Email: (your super admin email)
   - Password: (your super admin password)

### Navigate to Homepage Management
1. After login, you'll see the admin dashboard
2. Look for "Homepage Management" in the sidebar
3. Click it or go to `/admin/homepage`

### What You Should See
```
┌─────────────────────────────────────────┐
│  Homepage Management                    │
│  Manage hero banner, offers, and        │
│  testimonials                           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  📷 Hero Banner                         │
│  ┌───────────────────────────────────┐  │
│  │ [Image] Welcome to Geethika...    │  │
│  │         Description text...       │  │
│  │         [Edit] [👁️]               │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  📷 Special Offers Cards                │
│  ┌──────────┐ ┌──────────┐             │
│  │ Offer 1  │ │ Offer 2  │             │
│  │ [Edit]   │ │ [Edit]   │             │
│  └──────────┘ └──────────┘             │
│  ┌──────────┐ ┌──────────┐             │
│  │ Offer 3  │ │ Offer 4  │             │
│  │ [Edit]   │ │ [Edit]   │             │
│  └──────────┘ └──────────┘             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  📷 Testimonials                        │
│  ┌──────┐ ┌──────┐ ┌──────┐            │
│  │ Test │ │ Test │ │ Test │            │
│  │  1   │ │  2   │ │  3   │            │
│  │[Edit]│ │[Edit]│ │[Edit]│            │
│  └──────┘ └──────┘ └──────┘            │
└─────────────────────────────────────────┘
```

---

## 🎨 STEP 3: Edit Content

### Test 1: Edit Hero Banner
1. Click the **Edit** button on the hero banner card
2. A modal should open with:
   - Current image preview
   - "Upload New Image" button
   - Title input field
   - Description textarea
   - Link URL input
   - Display order input
   - Active checkbox
   - Save Changes button

3. Try uploading a new image:
   - Click "Upload New Image"
   - Select an image file (JPG, PNG)
   - See preview update

4. Update the title:
   - Change text in title field
   - Example: "Capture Your Special Moments"

5. Click "Save Changes"
   - Should see success message
   - Modal should close
   - Content should update in the list

### Test 2: Toggle Visibility
1. Click the **eye icon** (👁️) on any card
2. Card should become semi-transparent (inactive)
3. Click eye icon again
4. Card should become fully visible (active)

### Test 3: Edit an Offer
1. Click **Edit** on any offer card
2. Upload a new offer image
3. Update title: "Valentine's Day Special - 20% Off"
4. Update description: "Get 20% off on all customized gifts"
5. Add link: "/shop?category=customized-gifts"
6. Save changes

---

## 🌐 STEP 4: Verify on Homepage

### View Public Homepage
1. Open your frontend URL in a new tab
2. Go to the homepage (/)
3. You should see:
   - Updated hero banner with new image
   - Special offers section with your changes
   - Testimonials section

### Check Changes Applied
- ✅ Hero banner shows new title
- ✅ Hero banner shows new image
- ✅ Offers show updated content
- ✅ Inactive items are hidden
- ✅ Links work correctly

---

## 🐛 Troubleshooting

### Problem: Still seeing "unable to customise home page images"

**Cause**: Render hasn't been redeployed yet

**Solution**:
1. Go to Render dashboard
2. Click "Manual Deploy"
3. Wait for deployment to complete
4. Refresh admin panel

---

### Problem: Sections not loading (spinning loader)

**Cause**: API endpoint returning 404

**Solution**:
1. Check Render deployment status
2. Verify backend URL in `.env`:
   ```
   VITE_API_URL=https://geethika-digital-world1.onrender.com
   ```
3. Test API directly:
   ```bash
   curl https://geethika-digital-world1.onrender.com/api/homepage/content
   ```
4. Check Render logs for errors

---

### Problem: Images not uploading

**Cause**: File size or format issue

**Solution**:
1. Check file size (must be < 10MB)
2. Use supported formats: JPG, PNG, GIF, WebP
3. Try a different image
4. Check browser console for errors

---

### Problem: Changes not saving

**Cause**: Authentication or permission issue

**Solution**:
1. Verify you're logged in as Super Admin
2. Check browser console for 401/403 errors
3. Try logging out and back in
4. Verify token is valid

---

## 📊 Expected API Responses

### GET /api/homepage/content (Public)
```json
{
  "success": true,
  "content": {
    "hero_banner": { ... },
    "offers": [ ... ],
    "testimonials": [ ... ]
  }
}
```

### GET /api/homepage/admin/content (Admin)
```json
{
  "success": true,
  "content": [
    {
      "id": 1,
      "section": "hero",
      "content_type": "banner",
      "title": "Welcome...",
      "description": "...",
      "image_url": "/uploads/...",
      "link_url": "/shop",
      "display_order": 0,
      "is_active": true,
      "created_at": "2026-02-07...",
      "updated_at": "2026-02-07..."
    },
    ...
  ]
}
```

### PUT /api/homepage/admin/content/:id (Update)
```json
{
  "success": true,
  "message": "Content updated successfully",
  "content": { ... }
}
```

---

## ✅ Success Checklist

After completing all steps, you should have:

- [x] Deployed latest code on Render
- [x] Accessed admin homepage management
- [x] Seen all 3 sections (banner, offers, testimonials)
- [x] Edited hero banner successfully
- [x] Uploaded a new image
- [x] Toggled visibility on/off
- [x] Verified changes on public homepage
- [x] All images loading correctly

---

## 🎯 Next Steps

Once everything is working:

1. **Customize Hero Banner**
   - Upload high-quality banner image (1920x600px)
   - Write compelling headline
   - Add call-to-action link

2. **Update Offers**
   - Create 4 attractive offer cards
   - Use eye-catching images
   - Add promotional text
   - Link to relevant products

3. **Add Testimonials**
   - Upload customer photos
   - Add genuine reviews
   - Include customer names

4. **Test on Mobile**
   - Check responsive design
   - Verify images load
   - Test all links

---

**Ready to Deploy?** Go to Render and click "Manual Deploy" now! 🚀
