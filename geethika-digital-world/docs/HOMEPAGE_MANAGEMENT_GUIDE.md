# Homepage Management Feature

## Overview
Super admins can now manage all images and content displayed on the homepage including:
- Hero Banner
- Special Offers Cards
- Testimonials

## Features

### 1. Hero Banner Management
- Change the main banner image
- Update title and description
- Modify call-to-action links
- Toggle visibility

### 2. Special Offers Cards
- Update offer titles and descriptions
- Change card images (optional)
- Modify links to product categories
- Reorder cards by display order
- Show/hide individual offers

### 3. Testimonials
- Update customer names and photos
- Edit testimonial text
- Change customer images
- Reorder testimonials
- Toggle visibility

## How to Use

### Access Homepage Management
1. Login as Super Admin
2. Navigate to **Admin Dashboard**
3. Click on **Homepage Management** card
4. Or go directly to `/admin/homepage`

### Edit Content

#### To Update an Item:
1. Click the **Edit** icon (image icon) on any content card
2. A modal will open with the current content
3. Make your changes:
   - **Upload New Image**: Click "Upload New Image" button
   - **Title**: Update the heading text
   - **Description**: Modify the description
   - **Link URL**: Change where the item links to
   - **Display Order**: Set the order (lower numbers appear first)
   - **Active**: Check/uncheck to show/hide on homepage
4. Click **Save Changes**

#### To Show/Hide Content:
- Click the **Eye** icon to toggle visibility
- Green eye = visible on homepage
- Gray eye = hidden from homepage

### Image Guidelines
- **Hero Banner**: Recommended size 1920x650px
- **Offer Cards**: Images are optional (uses gradient if no image)
- **Testimonials**: Recommended size 200x200px (square)
- Supported formats: JPG, PNG, WebP
- Max file size: 5MB

## Database Structure

```sql
CREATE TABLE homepage_content (
  id SERIAL PRIMARY KEY,
  section VARCHAR(50) NOT NULL UNIQUE,
  content_type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  description TEXT,
  image_url VARCHAR(500),
  link_url VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Public Endpoints
- `GET /api/homepage/content` - Get active homepage content

### Admin Endpoints (Super Admin Only)
- `GET /api/homepage/admin/content` - Get all content (including inactive)
- `GET /api/homepage/admin/content/:id` - Get single content item
- `PUT /api/homepage/admin/content/:id` - Update content item
- `POST /api/homepage/admin/content` - Create new content item
- `DELETE /api/homepage/admin/content/:id` - Delete content item

## Setup Instructions

### 1. Run Database Migration
```bash
cd backend
node scripts/create-homepage-content-table.js
```

### 2. Verify Table Creation
The script will create the table and insert default content:
- 1 Hero Banner
- 4 Special Offers
- 3 Testimonials

### 3. Access Admin Panel
1. Login as super admin
2. Navigate to `/admin/homepage`
3. Start managing content!

## Content Types

### Banner (Hero Banner)
- **section**: `hero_banner`
- **content_type**: `banner`
- **Fields**: title, description, image_url, link_url

### Offer Card (Special Offers)
- **section**: `offer_valentine`, `offer_personalized`, etc.
- **content_type**: `offer_card`
- **Fields**: title, description, link_url, display_order

### Testimonial
- **section**: `testimonial_1`, `testimonial_2`, etc.
- **content_type**: `testimonial`
- **Fields**: title (customer name), description (review), image_url

## Security
- Only Super Admins can access homepage management
- All changes are logged in the audit log
- Image uploads are validated and sanitized
- File size limits enforced

## Audit Logging
All homepage content changes are automatically logged:
- Content creation
- Content updates
- Content deletion
- User who made the change
- Timestamp of change

View audit logs at `/admin/audit-log`

## Troubleshooting

### Images not displaying?
- Check file path starts with `/uploads/`
- Verify file exists in `backend/uploads/` directory
- Check file permissions

### Can't save changes?
- Verify you're logged in as Super Admin
- Check browser console for errors
- Ensure backend server is running

### Content not showing on homepage?
- Check `is_active` is set to `true`
- Verify `display_order` is set correctly
- Clear browser cache and refresh

## Future Enhancements
- Bulk image upload
- Image cropping tool
- Preview before publish
- Schedule content changes
- A/B testing support
- Analytics integration
