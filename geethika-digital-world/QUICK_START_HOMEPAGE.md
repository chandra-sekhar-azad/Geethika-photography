# 🚀 Quick Start: Homepage Management

## Setup (One-Time)

### Step 1: Run Database Migration
```bash
cd geethika-digital-world/backend
node scripts/create-homepage-content-table.js
```

**Expected Output:**
```
🔄 Creating homepage_content table...
✅ Database connected successfully
🔄 Inserting default homepage content...
✅ Default content inserted successfully
📊 Homepage Content Summary:
- Hero Banner: 1 item
- Special Offers: 4 items
- Testimonials: 3 items
✅ Homepage content table setup complete!
```

### Step 2: Start Servers
```bash
# Terminal 1 - Backend
cd geethika-digital-world/backend
npm run dev

# Terminal 2 - Frontend
cd geethika-digital-world/client
npm run dev
```

## Using the Feature

### Access Homepage Management

**Option 1: From Dashboard**
1. Login as Super Admin → `http://localhost:5173/admin/login`
2. Click "Homepage Management" card on dashboard

**Option 2: Direct URL**
- Go to `http://localhost:5173/admin/homepage`

### Edit Content

#### 1. Hero Banner
```
┌─────────────────────────────────────────┐
│  Hero Banner                            │
├─────────────────────────────────────────┤
│  [Image Preview]                        │
│  Title: Thoughtful Gifts for Every...  │
│  Description: Celebrate your special... │
│  [Edit] [Show/Hide]                     │
└─────────────────────────────────────────┘
```

**To Edit:**
- Click **Edit** icon (image icon)
- Upload new banner image
- Update title/description
- Click **Save Changes**

#### 2. Special Offers (4 Cards)
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Valentine    │ Personalized │ Photo        │ Premium      │
│ Special      │ Gifts        │ Sessions     │ Combos       │
│ [Edit] [👁️]  │ [Edit] [👁️]  │ [Edit] [👁️]  │ [Edit] [👁️]  │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**To Edit:**
- Click **Edit** on any card
- Update title/description
- Change link URL
- Modify display order
- Click **Save Changes**

#### 3. Testimonials (3 Cards)
```
┌──────────────┬──────────────┬──────────────┐
│ [Photo]      │ [Photo]      │ [Photo]      │
│ Priya &      │ Anjali       │ Vikram &     │
│ Rahul        │ Sharma       │ Sneha        │
│ "Amazing..." │ "Quality..." │ "Beautiful..." │
│ [Edit] [👁️]  │ [Edit] [👁️]  │ [Edit] [👁️]  │
└──────────────┴──────────────┴──────────────┘
```

**To Edit:**
- Click **Edit** on testimonial
- Upload new customer photo
- Update name and review
- Click **Save Changes**

### Toggle Visibility

**Show/Hide Content:**
- Click the **Eye** icon
- 👁️ Green = Visible on homepage
- 👁️ Gray = Hidden from homepage

## Edit Modal

When you click Edit, you'll see:

```
┌─────────────────────────────────────────┐
│  Edit Content                      [X]  │
├─────────────────────────────────────────┤
│  Image                                  │
│  [Current Image Preview]                │
│  [Upload New Image]                     │
│                                         │
│  Title                                  │
│  [Text Input]                           │
│                                         │
│  Description                            │
│  [Textarea]                             │
│                                         │
│  Link URL (optional)                    │
│  [Text Input]                           │
│                                         │
│  Display Order                          │
│  [Number Input]                         │
│                                         │
│  ☑ Active (visible on homepage)        │
│                                         │
│  [Save Changes] [Cancel]                │
└─────────────────────────────────────────┘
```

## Common Tasks

### Change Hero Banner Image
1. Go to `/admin/homepage`
2. Click Edit on Hero Banner
3. Click "Upload New Image"
4. Select image (1920x650px recommended)
5. Click "Save Changes"
6. Visit homepage to see change

### Update Offer Text
1. Go to `/admin/homepage`
2. Find "Special Offers Cards" section
3. Click Edit on any offer
4. Update title/description
5. Click "Save Changes"

### Hide a Testimonial
1. Go to `/admin/homepage`
2. Find "Testimonials" section
3. Click Eye icon on testimonial
4. Icon turns gray (hidden)
5. Visit homepage - testimonial won't show

### Reorder Content
1. Click Edit on content item
2. Change "Display Order" number
3. Lower numbers appear first
4. Click "Save Changes"

## Verification

### Check Changes on Homepage
1. Go to `http://localhost:5173/`
2. Scroll through homepage
3. Verify your changes appear

### Check Audit Log
1. Go to `/admin/audit-log`
2. Look for "homepage_content" entries
3. Verify your changes are logged

## Troubleshooting

### ❌ Can't access /admin/homepage
**Solution:** Verify you're logged in as Super Admin

### ❌ Image won't upload
**Solutions:**
- Check file size < 5MB
- Use JPG, PNG, or WebP format
- Verify `backend/uploads/` directory exists

### ❌ Changes not showing
**Solutions:**
- Hard refresh browser (Ctrl+F5)
- Check "Active" checkbox is checked
- Verify backend is running

### ❌ "Content not found" error
**Solution:** Run database migration script again

## Quick Reference

### Image Sizes
- Hero Banner: 1920x650px
- Testimonials: 200x200px
- Offers: Optional

### Content Types
- `banner` - Hero Banner
- `offer_card` - Special Offers
- `testimonial` - Customer Reviews

### API Endpoints
- Public: `/api/homepage/content`
- Admin: `/api/homepage/admin/content`

### Files Location
- Backend Route: `backend/routes/homepage.js`
- Frontend Page: `client/src/pages/admin/HomePageManagement.jsx`
- Migration: `backend/scripts/create-homepage-content-table.js`

## Next Steps

1. ✅ Run database migration
2. ✅ Start servers
3. ✅ Login as super admin
4. ✅ Access homepage management
5. ✅ Upload your images
6. ✅ Update content
7. ✅ Verify on homepage
8. ✅ Deploy to production

## Need Help?

📖 **Full Guide**: `docs/HOMEPAGE_MANAGEMENT_GUIDE.md`
📋 **Technical Details**: `HOMEPAGE_MANAGEMENT_COMPLETE.md`
🧪 **Testing Guide**: `TEST_HOMEPAGE_FEATURE.md`
📊 **Feature Summary**: `FEATURE_SUMMARY.md`

---

**That's it! You can now manage your homepage content without touching any code! 🎉**
