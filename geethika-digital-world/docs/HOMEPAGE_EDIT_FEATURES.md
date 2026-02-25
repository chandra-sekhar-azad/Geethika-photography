# Homepage Edit Features

## Overview
Complete CRUD (Create, Read, Update, Delete) functionality for managing homepage content including hero banners, special offers, and testimonials.

## Features Added

### 1. Edit Text & Images
- Click the edit icon (📷) on any content card
- Modify title, description, and link URL
- Upload new images or keep existing ones
- Change display order
- Toggle active/inactive status

### 2. Add New Content
- **Add Banner**: Click "Add Banner" button in Hero Banner section
- **Add Offer**: Click "Add Offer" button in Special Offers section
- **Add Testimonial**: Click "Add Testimonial" button in Testimonials section

### 3. Delete Content
- Click the delete icon (🗑️) on any content card
- Confirmation dialog prevents accidental deletion
- Permanently removes content from database

### 4. Toggle Visibility
- Click the eye icon (👁️) to show/hide content
- Hidden content appears grayed out
- Doesn't delete content, just hides from public view

### 5. Reorder Content
- Edit any item and change the "Display Order" number
- Lower numbers appear first
- Useful for prioritizing content

## How to Use

### Edit Existing Content
1. Navigate to Admin Panel → Homepage
2. Find the content you want to edit
3. Click the blue edit icon
4. Make your changes in the modal
5. Click "Save Changes"

### Add New Content
1. Navigate to Admin Panel → Homepage
2. Click the appropriate "Add" button (Banner/Offer/Testimonial)
3. Fill in all fields:
   - Title (required)
   - Description (required)
   - Image (required for new content)
   - Link URL (optional)
   - Display Order (default: 0)
   - Active status (default: checked)
4. Click "Save Changes"

### Delete Content
1. Navigate to Admin Panel → Homepage
2. Find the content you want to delete
3. Click the red delete icon
4. Confirm deletion in the dialog

## Technical Details

### Backend API Endpoints
- `GET /api/homepage/content` - Public content (active only)
- `GET /api/homepage/admin/content` - All content (admin)
- `GET /api/homepage/admin/content/:id` - Single item
- `POST /api/homepage/admin/content` - Create new
- `PUT /api/homepage/admin/content/:id` - Update existing
- `DELETE /api/homepage/admin/content/:id` - Delete

### Frontend Component
- Location: `client/src/pages/admin/HomePageManagement.jsx`
- Features: Modal-based editing, image preview, form validation
- Responsive design for mobile and desktop

### Database Table
- Table: `homepage_content`
- Fields: id, section, content_type, title, description, image_url, link_url, display_order, is_active, created_at, updated_at

## Bug Fixes
- Fixed SQL parameter placeholders in UPDATE query (changed from `${paramCount}` to `$${paramCount}`)
- Added proper form data handling for both create and update operations
- Implemented proper image upload handling with FormData

## Security
- All endpoints require authentication
- Admin role required for modifications
- Audit logging for all changes
- File upload validation and sanitization
