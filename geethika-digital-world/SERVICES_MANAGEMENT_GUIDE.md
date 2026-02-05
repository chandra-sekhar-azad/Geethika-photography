# Services Management Guide

## Overview
The Services Management system allows admin and super admin users to manage all services offered by Geethika Digital World. Services can be added, edited, deleted, and displayed to customers on the Services page.

## Services Included

### 1. **Photography** 📸
- Professional photography services for all occasions
- Weddings, pre-wedding shoots, couple photoshoots, events
- Price Range: ₹5,999 - ₹25,000
- Image: `/services/photography.jpg`

### 2. **Videography** 🎥
- Cinematic videography services
- Wedding films, event coverage
- Price Range: ₹10,000 - ₹30,000
- Image: `/services/videography.jpg`

### 3. **Event Decor** 🎉
- Beautiful decoration for all events
- Birthdays, weddings, anniversaries
- Price Range: ₹5,000 - ₹50,000
- Image: `/services/event-decor.png`

### 4. **Home Redecor** 🏠
- Professional interior design and redecoration
- Single rooms to complete home makeovers
- Price Range: ₹15,000 - ₹75,000
- Image: `/services/home-redecor.jpg`

### 5. **Shop Redecor** 🏪
- Professional shop and store interior design
- Custom designs for retail spaces
- Price Range: ₹25,000 - ₹1,00,000
- Image: `/services/shop-redecor.jpg`

### 6. **Return Gifts** 🎁
- Unique and personalized return gifts
- For all occasions
- Price Range: ₹50 - ₹500 per piece
- Image: To be added

## Admin Features

### Accessing Service Management
1. Login to admin panel at `/admin/login`
2. Navigate to Admin Dashboard
3. Click on "Service Management" card
4. URL: `/admin/services`

### Adding a New Service
1. Click the "Add Service" button
2. Fill in the form:
   - **Service Name** (required): e.g., "Photography"
   - **Description**: Detailed description of the service
   - **Price Range**: e.g., "₹5,000 - ₹50,000"
   - **Service Image**: Upload an image (optional)
   - **Active**: Toggle to make service visible to customers
3. Click "Add Service" to save

### Editing a Service
1. Find the service in the table
2. Click the Edit icon (pencil)
3. Update the fields as needed
4. Upload a new image if desired (replaces old image)
5. Click "Update Service" to save changes

### Deleting a Service
1. Find the service in the table
2. Click the Delete icon (trash)
3. Confirm the deletion
4. Service and its image will be permanently removed

### Service Status
- **Active**: Service is visible to customers on the Services page
- **Inactive**: Service is hidden from customers but remains in the database

## Customer View

### Services Page (`/services`)
- Displays all active services
- Shows service image, name, description, and price range
- "Book Now via WhatsApp" button for each service
- Customers can inquire about services directly through WhatsApp

## Technical Details

### Database Schema
```sql
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  image_public_id VARCHAR(255),
  price_range VARCHAR(100),
  features TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints

#### Public Endpoints
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service

#### Admin/SuperAdmin Endpoints (Requires Authentication)
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Image Upload
- Images are uploaded to Cloudinary
- Supported formats: JPG, PNG, JPEG
- Recommended size: 800x600px or larger
- Old images are automatically deleted when updating

## Setup Instructions

### 1. Create Services Table
```bash
cd geethika-digital-world
node backend/scripts/setup-services-simple.js
```

This will:
- Create the services table
- Add indexes for performance
- Insert 6 initial services

### 2. Add Service Images
Place service images in:
- `client/public/services/photography.jpg`
- `client/public/services/videography.jpg`
- `client/public/services/event-decor.png`
- `client/public/services/home-redecor.jpg`
- `client/public/services/shop-redecor.jpg`

### 3. Start the Application
```bash
# Backend
cd backend
npm start

# Frontend
cd client
npm run dev
```

## WhatsApp Integration

When customers click "Book Now via WhatsApp", they are redirected to WhatsApp with a pre-filled message:
```
Hi! I'm interested in [Service Name]. Can you provide more details?
```

The WhatsApp number is configured in the backend `.env` file:
```
WHATSAPP_NUMBER=918897536435
```

## Best Practices

### For Admins
1. **Use High-Quality Images**: Upload clear, professional images for each service
2. **Keep Descriptions Concise**: Write clear, compelling descriptions
3. **Update Prices Regularly**: Keep price ranges current
4. **Use Active/Inactive Wisely**: Hide services temporarily without deleting them
5. **Test Before Publishing**: Preview services on the customer-facing page

### For Developers
1. **Image Optimization**: Compress images before uploading
2. **Error Handling**: All API calls include proper error handling
3. **Authentication**: All admin operations require valid JWT token
4. **Validation**: Form inputs are validated on both client and server
5. **Cloudinary Cleanup**: Old images are deleted when updating/removing services

## Troubleshooting

### Services Not Showing
- Check if services are marked as "Active"
- Verify backend server is running
- Check browser console for errors

### Image Upload Fails
- Verify Cloudinary credentials in `.env`
- Check file size (max 10MB)
- Ensure file format is supported (JPG, PNG, JPEG)

### Authentication Errors
- Ensure you're logged in as admin or super admin
- Check if JWT token is valid
- Try logging out and logging back in

## Future Enhancements

Potential features to add:
- Service packages/pricing tiers
- Service booking system with calendar
- Customer reviews and ratings
- Service categories
- Featured services
- Service availability scheduling
- Email notifications for bookings
- Payment integration for advance booking

## Support

For issues or questions:
- Check the console logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure database connection is working
- Contact the development team

---

**Last Updated**: February 6, 2026
**Version**: 1.0.0
