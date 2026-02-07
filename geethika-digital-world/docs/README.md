# Geethika Digital World - Backend API

Complete Node.js + Express + PostgreSQL backend for Geethika Digital World e-commerce platform.

## 🚀 Features

- **Authentication**: JWT-based auth with bcrypt password hashing
- **Product Management**: CRUD operations with image upload to Cloudinary
- **Order Management**: Complete order processing with Razorpay integration
- **Service Booking**: Service booking system with advance payments
- **Admin Dashboard**: Secure admin routes for management
- **Image Upload**: Cloudinary integration for image storage
- **Payment Gateway**: Razorpay payment integration
- **Database**: PostgreSQL with connection pooling
- **Security**: Helmet, CORS, rate limiting, input validation
- **Performance**: Compression, caching headers

## 📦 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer + Cloudinary
- **Payment**: Razorpay
- **Validation**: express-validator
- **Security**: Helmet, CORS, rate-limit

## 🛠️ Installation

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- Cloudinary account
- Razorpay account

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=geethika_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### Step 3: Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE geethika_db;

# Exit
\q
```

### Step 4: Run Migrations

```bash
npm run migrate
```

This will create all tables and an admin user.

### Step 5: Start Server

```bash
# Development
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## 📚 API Endpoints

### Authentication

```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login user
```

### Products

```
GET    /api/products               Get all products
GET    /api/products/:id           Get single product
POST   /api/products               Create product (admin)
PUT    /api/products/:id           Update product (admin)
DELETE /api/products/:id           Delete product (admin)
```

### Categories

```
GET    /api/categories             Get all categories
POST   /api/categories             Create category (admin)
PUT    /api/categories/:id         Update category (admin)
DELETE /api/categories/:id         Delete category (admin)
```

### Orders

```
POST   /api/orders/create-razorpay-order    Create Razorpay order
POST   /api/orders/verify-payment           Verify payment
POST   /api/orders                           Create order
GET    /api/orders                           Get all orders (admin)
GET    /api/orders/:id                       Get single order
PATCH  /api/orders/:id/status                Update order status (admin)
```

### Services

```
GET    /api/services                         Get all services
GET    /api/services/:id                     Get single service
POST   /api/services/bookings                Create booking
GET    /api/services/bookings/all            Get all bookings (admin)
PATCH  /api/services/bookings/:id/status     Update booking status (admin)
```

## 🔐 Authentication

Protected routes require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

Admin routes require admin role in JWT payload.

## 📝 Database Schema

### Users
- id, email, password, name, phone, role, timestamps

### Categories
- id, name, slug, icon, created_at

### Products
- id, name, slug, description, category_id, price, discount
- image_url, image_public_id, customizable, customization_options
- valentine_special, stock_quantity, is_active, timestamps

### Services
- id, name, slug, description, icon, image_url, image_public_id
- is_active, timestamps

### Service Packages
- id, service_id, name, price, duration, deliverables, features

### Orders
- id, user_id, order_number, customer details, shipping details
- subtotal, discount, total, payment details, status, timestamps

### Order Items
- id, order_id, product_id, product details, quantity, price
- customization, created_at

### Service Bookings
- id, booking_number, service_id, package_id, customer details
- booking_date, location, requirements, payment details
- status, timestamps

### Gallery Images
- id, title, category, image_url, image_public_id, is_active

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: express-validator
- **Password Hashing**: bcryptjs with salt rounds
- **JWT**: Secure token-based authentication
- **SQL Injection Protection**: Parameterized queries

## 🚀 Deployment

### Deploy to Render

1. Create account on [Render](https://render.com)

2. Create PostgreSQL database:
   - Click "New +" → "PostgreSQL"
   - Choose plan and region
   - Note down connection details

3. Create Web Service:
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure:
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment**: Node

4. Add Environment Variables:
   - Go to "Environment" tab
   - Add all variables from `.env`
   - Use Render's PostgreSQL connection string

5. Deploy:
   - Click "Create Web Service"
   - Wait for deployment

### Environment Variables on Render

```
NODE_ENV=production
PORT=5000
DB_HOST=<render-postgres-host>
DB_PORT=5432
DB_NAME=<database-name>
DB_USER=<database-user>
DB_PASSWORD=<database-password>
JWT_SECRET=<your-secret>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
RAZORPAY_KEY_ID=<your-key-id>
RAZORPAY_KEY_SECRET=<your-key-secret>
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Post-Deployment

1. Run migrations:
   ```bash
   # SSH into Render or use Render Shell
   npm run migrate
   ```

2. Test API:
   ```bash
   curl https://your-api-url.onrender.com/health
   ```

3. Update frontend API URL

## 🧪 Testing

### Test Endpoints

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@geethikadigitalworld.com","password":"Admin@123"}'

# Get products
curl http://localhost:5000/api/products
```

## 📊 Admin Credentials

Default admin credentials (change after first login):

```
Email: admin@geethikadigitalworld.com
Password: Admin@123
```

## 🔧 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U postgres -d geethika_db
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Cloudinary Upload Error

- Verify credentials in `.env`
- Check Cloudinary dashboard for API limits
- Ensure file size is under 10MB

### Razorpay Error

- Verify API keys
- Check Razorpay dashboard for test/live mode
- Ensure webhook URL is configured

## 📈 Performance Tips

1. **Database Indexing**: Add indexes on frequently queried columns
2. **Caching**: Implement Redis for caching
3. **CDN**: Use Cloudinary CDN for images
4. **Connection Pooling**: Already configured in database.js
5. **Compression**: Already enabled in server.js

## 🔄 Backup & Restore

### Backup Database

```bash
pg_dump -U postgres geethika_db > backup.sql
```

### Restore Database

```bash
psql -U postgres geethika_db < backup.sql
```

## 📞 Support

For issues or questions:
- Email: info@geethikadigitalworld.com
- GitHub Issues: [Create Issue]

## 📄 License

Copyright © 2026 Geethika Digital World. All rights reserved.
