# Geethika Digital World - Project Summary & Tech Stack

## 📋 Project Overview

**Geethika Digital World** is a full-stack e-commerce platform for personalized gifts, event services, and custom products. The platform features a dynamic admin dashboard for managing products, services, orders, and customers, with real-time updates and image upload capabilities.

## 🎯 Key Features

### Customer Features
- Browse products by 16+ categories
- Filter products (Valentine specials, categories)
- View product details with images
- Shopping cart functionality
- User authentication (signup/login)
- Password reset with OTP verification
- Service booking via WhatsApp
- Responsive design for all devices
- Real-time product availability

### Admin Features
- Complete admin dashboard
- Product management (CRUD with image upload)
- Service management (CRUD with image upload)
- Order management and tracking
- Customer database
- Sales reports and analytics
- Category management
- Real-time statistics

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.5
- **Routing**: React Router DOM 7.1.1
- **Styling**: 
  - Tailwind CSS 3.4.17
  - Custom CSS animations
- **Icons**: Lucide React 0.469.0
- **State Management**: React Context API
- **HTTP Client**: Fetch API
- **Form Validation**: Express Validator (backend)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.21.2
- **Language**: JavaScript (ES6+ with modules)
- **API Architecture**: RESTful API

### Database
- **Database**: PostgreSQL 8.13.0
- **Hosting**: Render (Cloud PostgreSQL)
- **ORM**: Native pg driver (no ORM)
- **Connection Pooling**: pg Pool

### Authentication & Security
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 2.4.3
- **Security Headers**: Helmet 8.0.0
- **Rate Limiting**: express-rate-limit 7.5.0
- **CORS**: cors 2.8.5
- **Input Validation**: express-validator 7.2.1

### File Upload & Storage
- **Image Upload**: Multer 1.4.5-lts.1
- **Cloud Storage**: Cloudinary 2.5.1
- **Local Storage**: Backend uploads folder
- **Supported Formats**: JPG, PNG, GIF, WebP
- **Max File Size**: 5MB

### Email Services
- **Email Client**: Nodemailer 6.9.16
- **SMTP**: Gmail SMTP
- **Features**: OTP verification, password reset, welcome emails

### Payment Integration
- **Payment Gateway**: Razorpay (configured)
- **Features**: Order payments, advance booking payments

### Development Tools
- **Process Manager**: Nodemon 3.1.11
- **Logging**: Morgan 1.10.0
- **Compression**: compression 1.7.5
- **Environment Variables**: dotenv 16.4.7

## 📁 Project Structure

```
geethika-digital-world/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js      # Cloudinary configuration
│   │   ├── database.js        # PostgreSQL connection
│   │   ├── email.js           # Email service setup
│   │   └── razorpay.js        # Payment gateway config
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── errorHandler.js   # Error handling
│   │   └── upload.js          # File upload middleware
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── products.js        # Product CRUD
│   │   ├── services.js        # Service CRUD
│   │   ├── orders.js          # Order management
│   │   ├── categories.js      # Category management
│   │   └── admin.js           # Admin analytics
│   ├── scripts/
│   │   ├── create-admin.js    # Admin user creation
│   │   ├── add-categories.js  # Seed categories
│   │   └── add-products-simple.js # Seed products
│   ├── uploads/               # Local file storage
│   ├── server.js              # Express server
│   ├── package.json
│   └── .env                   # Environment variables
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ShopPage.jsx
│   │   │   ├── ServicesPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── ProductManagement.jsx
│   │   │       ├── ServiceManagement.jsx
│   │   │       ├── OrderManagement.jsx
│   │   │       └── CustomerDatabase.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── products-images/           # Product image assets
```

## 🗄️ Database Schema

### Tables
1. **users** - Customer and admin accounts
2. **categories** - Product categories (16 categories)
3. **products** - Product catalog with images
4. **services** - Service offerings with images
5. **orders** - Customer orders
6. **order_items** - Order line items
7. **otps** - OTP verification codes
8. **service_bookings** - Service booking requests

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with OTP

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin, with image)
- `PUT /api/products/:id` - Update product (admin, with image)
- `DELETE /api/products/:id` - Delete product (admin)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service (with image)
- `PUT /api/services/:id` - Update service (with image)
- `DELETE /api/services/:id` - Delete service

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status (admin)

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/sales-report` - Sales analytics
- `GET /api/admin/top-products` - Best selling products
- `GET /api/admin/customers` - Customer database

## 🎨 Design Features

### UI/UX
- Valentine's Day themed design
- Pink and red color scheme
- Smooth animations and transitions
- Responsive grid layouts
- Mobile-first approach
- Loading states and skeletons
- Toast notifications
- Modal dialogs

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader friendly
- High contrast text

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection
- Secure file upload validation

## 📦 Product Categories (16)

1. 🎁 Personalised Gifts
2. 💑 Couple Gifts
3. 👕 T-Shirts
4. 🌱 Plants
5. 🖼️ Photo Frames
6. 🖨️ Printing Works
7. 🏠 Interior Gifts & Decor Items
8. 📸 Photography & Videography
9. 🎉 Event Decor
10. 🏡 Home Redecor
11. 🏪 Shop Redecor
12. 🎂 Cakes
13. 💐 Flower Bouquets
14. 🍫 Chocolate Bouquets
15. 🎪 Event Needs
16. 🎁 Return Gifts

## 🚀 Deployment

### Frontend
- Platform: Vercel (recommended)
- Build Command: `npm run build`
- Output Directory: `dist`

### Backend
- Platform: Render / Railway / Heroku
- Start Command: `npm start`
- Environment: Node.js

### Database
- Platform: Render PostgreSQL
- Connection: SSL enabled
- Backup: Automated daily backups

### Image Storage
- Platform: Cloudinary
- CDN: Global delivery
- Optimization: Automatic

## 📊 Current Status

### Completed Features ✅
- Full authentication system with OTP
- Dynamic product management with images
- Dynamic service management with images
- Admin dashboard with analytics
- Shopping cart functionality
- Order management system
- Customer database
- Category management
- Responsive design
- Image upload to Cloudinary
- 18 sample products with images
- 16 product categories

### In Progress 🔄
- Payment gateway integration (Razorpay configured)
- Email service (SMTP configured, DNS issues)

### Future Enhancements 🎯
- Product reviews and ratings
- Wishlist functionality
- Advanced search and filters
- Order tracking with notifications
- Bulk product upload
- Multi-language support
- Social media integration
- Analytics dashboard improvements

## 🔧 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://...
DB_HOST=...
DB_PORT=5432
DB_NAME=...
DB_USER=...
DB_PASSWORD=...

# JWT
JWT_SECRET=...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Razorpay
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...

# Email
EMAIL_USER=...
EMAIL_PASSWORD=...

# Frontend
FRONTEND_URL=http://localhost:5174
```

## 📱 Access URLs

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5000
- **Admin Dashboard**: http://localhost:5174/admin
- **Shop**: http://localhost:5174/shop
- **Services**: http://localhost:5174/services

## 👥 Default Admin Credentials

- **Email**: admin@geethikadigitalworld.com
- **Password**: Admin@123

## 📞 Contact Integration

- **WhatsApp**: +91 9492686421
- **WhatsApp Float Button**: Integrated on all pages
- **Service Booking**: Via WhatsApp

## 🎓 Learning Resources

This project demonstrates:
- Full-stack JavaScript development
- RESTful API design
- JWT authentication
- File upload handling
- Database design and queries
- React state management
- Responsive web design
- Admin panel development
- E-commerce workflows

## 📄 License

Private project for Geethika Digital World

---

**Built with ❤️ for Geethika Digital World**
