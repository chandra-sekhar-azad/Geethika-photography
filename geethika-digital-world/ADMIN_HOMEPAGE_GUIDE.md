# Admin Homepage Management Guide

## Overview
Admins have full access to edit and manage the homepage content through the Admin Dashboard. This guide explains how to use the Homepage Management feature.

## Accessing Homepage Management

### Step 1: Login as Admin
1. Navigate to `/admin/login`
2. Login with your admin credentials
3. You'll be redirected to the Admin Dashboard

### Step 2: Navigate to Homepage Management
1. From the Admin Dashboard sidebar, click on **"Homepage"**
2. Or navigate directly to `/admin/homepage`

## What Can Be Edited?

The Homepage Management panel allows you to edit three main sections:

### 1. **Hero Banner** 
The main banner at the top of the homepage with the large image and call-to-action.

**Editable Fields:**
- **Image**: Upload a new hero banner image
- **Title**: Main heading text (e.g., "Where Memories Turn Into Masterpieces")
- **Description**: Subtitle or description text
- **Link URL**: Where the button should redirect (e.g., `/shop`)
- **Display Order**: Order of appearance (if multiple banners)
- **Active Status**: Show/hide the banner

### 2. **Special Offers Cards**
The 4 offer cards displayed in the Special Offers section.

**Editable Fields:**
- **Image**: Upload offer card image
- **Title**: Offer title (e.g., "Valentine Special", "Personalized Gifts")
- **Description**: Offer description (e.g., "Flat 20% OFF on all couple gifts")
- **Link URL**: Where clicking the card should redirect
- **Display Order**: Order of cards (1-4)
- **Active Status**: Show/hide individual cards

### 3. **Testimonials**
Customer testimonials displayed on the homepage.

**Editable Fields:**
- **Image**: Customer photo or related image
- **Title**: Customer name (e.g., "Priya & Rahul")
- **Description**: Testimonial text/review
- **Display Order**: Order of testimonials
- **Active Status**: Show/hide individual testimonials

## How to Edit Content

### Editing Existing Content

1. **Navigate to Homepage Management** (`/admin/homepage`)

2. **Find the content you want to edit** in one of the three sections:
   - Hero Banner
   - Special Offers Cards
   - Testimonials

3. **Click the Edit Icon** (📷 image icon) on the content card

4. **Edit Modal will open** with the following fields:
   - **Image Upload**: Click "Upload New Image" to change the image
   - **Title**: Edit the title text
   - **Description**: Edit the description text
   - **Link URL**: Edit where the content should link to
   - **Display Order**: Change the order (lower numbers appear first)
   - **Active Status**: Check/uncheck to show/hide

5. **Preview the Image**: The current or newly uploaded image will show as a preview

6. **Save Changes**: Click "Save Changes" button

7. **Confirmation**: You'll see a success message and the content will update

### Quick Actions

#### Show/Hide Content
- Click the **Eye Icon** (👁️) to quickly toggle visibility
- Green eye = Active (visible on homepage)
- Gray eye = Inactive (hidden from homepage)

#### View Content Details
Each content card shows:
- Preview image
- Title and description
- Content type badge (banner/offer_card/testimonial)
- Display order number
- Active/inactive status (opacity changes when inactive)

## Best Practices

### Image Guidelines

1. **Hero Banner Images**
   - Recommended size: 1920x650px
   - Format: JPG or PNG
   - Keep file size under 2MB for fast loading
   - Use high-quality, professional images
   - Ensure text is readable over the image

2. **Offer Card Images**
   - Recommended size: 800x600px
   - Format: JPG or PNG
   - Keep file size under 1MB
   - Use clear, attractive product images
   - Maintain consistent style across all cards

3. **Testimonial Images**
   - Recommended size: 400x400px (square)
   - Format: JPG or PNG
   - Keep file size under 500KB
   - Use customer photos or related imagery

### Content Guidelines

1. **Titles**
   - Keep concise (3-8 words)
   - Use action-oriented language
   - Highlight key benefits

2. **Descriptions**
   - Keep brief (10-20 words)
   - Focus on value proposition
   - Use clear, simple language

3. **Link URLs**
   - Use relative URLs (e.g., `/shop`, `/services`)
   - Test links after updating
   - Ensure links are relevant to the content

### Display Order

- Lower numbers appear first (1, 2, 3, 4...)
- Use consistent numbering (1, 2, 3, 4 for offers)
- Leave gaps for future additions (10, 20, 30...)

## Current Homepage Structure

### Hero Banner Section
```
┌─────────────────────────────────────────┐
│                                         │
│         HERO BANNER IMAGE               │
│                                         │
│  Title: "Where Memories Turn Into..."  │
│  Description: "Luxury photography..."   │
│  Button: "Explore Collection"           │
│                                         │
└─────────────────────────────────────────┘
```

### Special Offers Section
```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Offer 1  │ │ Offer 2  │ │ Offer 3  │ │ Offer 4  │
│  Image   │ │  Image   │ │  Image   │ │  Image   │
│  Title   │ │  Title   │ │  Title   │ │  Title   │
│  Desc    │ │  Desc    │ │  Desc    │ │  Desc    │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

### Testimonials Section
```
┌──────────┐ ┌──────────┐ ┌──────────┐
│Customer 1│ │Customer 2│ │Customer 3│
│  Photo   │ │  Photo   │ │  Photo   │
│  Name    │ │  Name    │ │  Name    │
│  Review  │ │  Review  │ │  Review  │
└──────────┘ └──────────┘ └──────────┘
```

## Troubleshooting

### Image Not Uploading
- Check file size (must be under 5MB)
- Ensure file format is JPG, PNG, or GIF
- Check internet connection
- Try a different browser

### Changes Not Appearing
- Clear browser cache (Ctrl+F5)
- Check if content is marked as "Active"
- Verify the display order is correct
- Wait a few seconds for changes to propagate

### Permission Denied
- Ensure you're logged in as admin
- Check if your admin account has proper permissions
- Contact super admin if you need elevated access

## API Endpoints (For Developers)

### Public Endpoints
- `GET /api/homepage/content` - Get active homepage content

### Admin Endpoints (Requires Authentication)
- `GET /api/homepage/admin/content` - Get all content (including inactive)
- `GET /api/homepage/admin/content/:id` - Get specific content by ID
- `PUT /api/homepage/admin/content/:id` - Update content
- `POST /api/homepage/admin/content` - Create new content
- `DELETE /api/homepage/admin/content/:id` - Delete content

## Database Schema

```sql
CREATE TABLE homepage_content (
  id SERIAL PRIMARY KEY,
  section VARCHAR(50) NOT NULL UNIQUE,
  content_type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  description TEXT,
  image_url VARCHAR(500),
  link_url VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Features

1. **Authentication Required**: Only logged-in admins can access
2. **Super Admin Only**: Homepage management requires super admin role
3. **Audit Logging**: All changes are logged with user info and timestamp
4. **Image Validation**: File type and size validation on upload
5. **SQL Injection Protection**: Parameterized queries used throughout

## Tips for Success

1. **Preview Before Publishing**: Always check the "Active" status before saving
2. **Backup Images**: Keep original images in case you need to revert
3. **Test Links**: Click through all links after updating
4. **Mobile Check**: View homepage on mobile after making changes
5. **Seasonal Updates**: Update offers and banners for holidays/events
6. **A/B Testing**: Try different images and copy to see what works best
7. **Regular Updates**: Keep content fresh with regular updates

## Support

If you need help or encounter issues:
1. Check this guide first
2. Contact the technical team
3. Check the audit log for recent changes
4. Review browser console for error messages

## Quick Reference

| Action | Steps |
|--------|-------|
| Edit Content | Click edit icon → Modify fields → Save |
| Change Image | Click "Upload New Image" → Select file → Save |
| Hide Content | Click eye icon to toggle visibility |
| Reorder Items | Edit display_order field (lower = first) |
| Add New Content | Currently requires database access |

---

**Last Updated**: February 2026
**Version**: 1.0
**Maintained By**: Geethika Digital World Tech Team
