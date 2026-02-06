# Gallery Management & Analytics Features

## ✅ Features Added

### 1. Gallery Management
Upload, manage, and organize gallery images for your website.

**Features:**
- Upload images with title, description, and category
- Filter images by category (General, Products, Events, Services, Testimonials)
- Edit image details (title, description, category)
- Delete images
- Image preview before upload
- Responsive grid layout

**Access:** `/admin/gallery`

**Categories Available:**
- General
- Products
- Events
- Services
- Testimonials

### 2. Analytics Dashboard
Comprehensive analytics and reporting for business insights.

**Features:**
- Real-time statistics (Total Revenue, Monthly Revenue, Total Orders, Total Customers)
- Sales overview with daily breakdown
- Order status tracking (Pending, Completed, Today's Revenue)
- Top products display
- Recent orders list
- Date range filtering (7 days, 30 days, 90 days, 1 year)

**Access:** `/admin/analytics`

**Metrics Tracked:**
- Total Revenue (all-time)
- Monthly Revenue (last 30 days)
- Daily Revenue (today)
- Total Orders (paid only)
- Total Customers
- Pending Orders
- Completed Orders
- Sales by date
- Top performing products

## 🗄️ Database

### Gallery Table
```sql
CREATE TABLE gallery (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  category VARCHAR(100) DEFAULT 'general',
  uploaded_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## 🔌 API Endpoints

### Gallery Routes (`/api/gallery`)
- `GET /` - Get all gallery images (public, with optional category filter)
- `POST /` - Upload new image (admin only, requires image file)
- `PUT /:id` - Update image details (admin only)
- `DELETE /:id` - Delete image (admin only)

### Analytics Routes
Uses existing admin routes:
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/sales-report` - Sales data with date range
- `GET /api/admin/orders` - Recent orders
- `GET /api/products` - Product data

## 🚀 How to Use

### Gallery Management

1. **Navigate to Gallery Management:**
   - Go to `/admin/gallery` or click "Gallery Management" from admin dashboard

2. **Upload Image:**
   - Click "Upload Image" button
   - Select image file
   - Enter title (required)
   - Select category
   - Add description (optional)
   - Click "Upload Image"

3. **Edit Image:**
   - Click "Edit" button on any image
   - Update title, category, or description
   - Click "Update Image"

4. **Delete Image:**
   - Click "Delete" button on any image
   - Confirm deletion

5. **Filter Images:**
   - Use category dropdown to filter by category

### Analytics

1. **Navigate to Analytics:**
   - Go to `/admin/analytics` or click "Analytics" from admin dashboard

2. **View Statistics:**
   - See real-time stats at the top
   - View sales overview chart
   - Check order status breakdown
   - See top products
   - View recent orders

3. **Change Date Range:**
   - Use date range dropdown (Last 7/30/90/365 days)
   - Data updates automatically

## 📝 Notes

- Gallery images are stored in `/backend/uploads/` directory
- Only admin users can upload/edit/delete gallery images
- Public users can view gallery images
- Analytics data is calculated from actual database records
- Total Orders count only includes paid orders
- All monetary values are displayed in Indian Rupees (₹)

## 🔧 Setup

The gallery table has been created automatically. If you need to recreate it:

```bash
cd backend
node scripts/create-gallery-table.js
```

## 🎨 UI Features

### Gallery Management
- Grid layout with image cards
- Image preview on hover
- Category badges
- Edit/Delete actions
- Upload modal with drag-and-drop support
- Image preview before upload

### Analytics
- Color-coded stat cards
- Sales timeline
- Order status indicators
- Product rankings
- Recent activity feed
- Responsive design

## 🔐 Security

- All admin routes require authentication
- Image uploads are validated
- File size limits enforced by multer middleware
- Audit logging for all gallery actions
- CORS protection enabled

## 📊 Future Enhancements

Potential improvements:
- Bulk image upload
- Image cropping/editing
- Advanced analytics charts (graphs, pie charts)
- Export reports to PDF/Excel
- Customer analytics
- Product performance metrics
- Revenue forecasting
