# Admin Dashboard Guide

## Overview
Complete admin dashboard for managing Geethika Digital World e-commerce platform with all essential features for running an online business.

## Features Implemented

### 1. Admin Login
- **Route:** `/admin/login`
- Secure authentication with JWT tokens
- Role-based access control (admin only)
- Beautiful gradient login page

**Default Admin Credentials:**
- Email: `admin@geethika.com`
- Password: `admin123`

### 2. Dashboard Overview
- **Route:** `/admin/dashboard`
- Real-time statistics:
  - Total Revenue
  - Total Orders
  - Total Products
  - Total Customers
- Pending orders quick access
- Recent activities feed
- Top selling products
- Quick action buttons

### 3. Product Management
- **Route:** `/admin/products`
- Add new products with full details
- Edit existing products
- Delete products
- Search and filter products
- Manage:
  - Product name, description
  - Category assignment
  - Pricing and discounts
  - Stock quantity
  - Valentine special flag
  - Customization options
  - Active/Inactive status

### 4. Order Management
- **Route:** `/admin/orders`
- View all orders (online + offline)
- Filter by status
- Search by order number or customer name
- Update order status:
  - Pending
  - Processing
  - Shipped
  - Delivered
  - Completed
  - Cancelled
- Update payment status
- View detailed order information
- Add offline orders manually

### 5. Offline Order Entry System
- Create orders for walk-in customers
- Capture customer details
- Select payment method (Cash/Card/UPI)
- Set payment status
- Add order notes
- Full address capture

### 6. Customer Database
- **Route:** `/admin/customers`
- View all registered customers
- Search by name, email, or phone
- Customer statistics:
  - Total orders per customer
  - Total amount spent
  - Registration date
- Customer lifetime value tracking

### 7. Sales Report
- **Route:** `/admin/sales-report`
- Comprehensive sales analytics
- Group by:
  - Daily
  - Weekly
  - Monthly
- Date range filtering
- Export to CSV
- Metrics:
  - Total orders
  - Total sales
  - Average order value
- Visual summary cards

## Setup Instructions

### 1. Database Setup

Run the SQL setup script:

```bash
cd backend
psql -U your_username -d your_database -f scripts/setup-admin.sql
```

Or manually execute the SQL file in your PostgreSQL client.

### 2. Backend Setup

The admin routes are already integrated. Make sure your backend is running:

```bash
cd backend
npm install
npm start
```

### 3. Frontend Setup

Admin pages are already integrated. Start the frontend:

```bash
cd client
npm install
npm run dev
```

### 4. Create Admin User

If you need to create an admin user manually:

```sql
-- Hash your password first using bcrypt
INSERT INTO users (email, password, name, role)
VALUES ('admin@example.com', 'hashed_password_here', 'Admin Name', 'admin');
```

Or use the registration endpoint and manually update the role in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

## API Endpoints

### Admin Routes (Require Admin Authentication)

```
GET    /api/admin/stats                  - Dashboard statistics
GET    /api/admin/sales-report           - Sales report with filters
GET    /api/admin/top-products           - Top selling products
GET    /api/admin/customers              - Customer database
GET    /api/admin/recent-activities      - Recent activities
```

### Product Routes

```
GET    /api/products                     - Get all products (public)
GET    /api/products/:id                 - Get single product (public)
POST   /api/products                     - Create product (admin)
PUT    /api/products/:id                 - Update product (admin)
DELETE /api/products/:id                 - Delete product (admin)
```

### Order Routes

```
GET    /api/orders                       - Get all orders (admin)
GET    /api/orders/:id                   - Get single order
POST   /api/orders                       - Create order
PATCH  /api/orders/:id/status            - Update order status (admin)
```

## Features Breakdown

### Dashboard Statistics
- Calculates real-time metrics from database
- Shows trends and comparisons
- Quick access to pending orders
- Recent activity timeline

### Product Management
- Full CRUD operations
- Image upload support (Cloudinary)
- Category management
- Stock tracking
- Discount management
- Valentine special products

### Order Management
- Online orders from website
- Offline orders from store
- Status workflow management
- Payment tracking
- Customer information
- Order history

### Sales Analytics
- Time-based grouping
- Revenue tracking
- Order count analysis
- Average order value
- CSV export for external analysis

### Customer Management
- Customer profiles
- Purchase history
- Lifetime value calculation
- Contact information
- Search and filter

## Security Features

1. **JWT Authentication**
   - Secure token-based auth
   - 7-day token expiry
   - Role-based access control

2. **Admin-Only Routes**
   - Middleware protection
   - Role verification
   - Unauthorized access prevention

3. **Input Validation**
   - Express-validator for all inputs
   - SQL injection prevention
   - XSS protection

## Usage Tips

### Adding Products
1. Navigate to Products page
2. Click "Add Product"
3. Fill in all required fields
4. Upload product image
5. Set pricing and stock
6. Save product

### Managing Orders
1. View all orders in Order Management
2. Use filters to find specific orders
3. Click eye icon to view details
4. Update status using dropdown
5. Track payment status

### Creating Offline Orders
1. Click "Add Offline Order"
2. Enter customer details
3. Add products (future enhancement)
4. Select payment method
5. Set payment status
6. Save order

### Viewing Reports
1. Go to Sales Report
2. Select time period
3. Choose grouping (day/week/month)
4. View analytics
5. Export to CSV if needed

## Customization

### Adding New Admin Features

1. Create new page in `client/src/pages/admin/`
2. Add route in `App.jsx`
3. Add menu item in `AdminLayout.jsx`
4. Create backend API endpoint if needed

### Styling
- Uses Tailwind CSS
- Valentine theme colors
- Responsive design
- Mobile-friendly sidebar

## Troubleshooting

### Cannot Login
- Check database connection
- Verify admin user exists
- Check JWT_SECRET in .env
- Verify password hash

### Orders Not Showing
- Check database connection
- Verify orders table exists
- Check authentication token
- Review API endpoint

### Products Not Updating
- Check file upload configuration
- Verify Cloudinary credentials
- Check admin permissions
- Review network requests

## Future Enhancements

Potential additions:
- Service management page
- Gallery management
- Email notifications
- SMS notifications
- Advanced analytics
- Inventory alerts
- Customer messaging
- Bulk operations
- Report scheduling
- Multi-admin support

## Support

For issues or questions:
1. Check console for errors
2. Review network requests
3. Verify database schema
4. Check authentication tokens
5. Review API responses

## Security Notes

⚠️ **Important:**
- Change default admin password immediately
- Use strong passwords
- Keep JWT_SECRET secure
- Enable HTTPS in production
- Regular security audits
- Update dependencies regularly

## Deployment

When deploying:
1. Set environment variables
2. Run database migrations
3. Build frontend: `npm run build`
4. Configure reverse proxy
5. Enable SSL/TLS
6. Set up monitoring
7. Configure backups

---

**Admin Dashboard Version:** 1.0.0  
**Last Updated:** 2024  
**Maintained by:** Geethika Digital World Team
