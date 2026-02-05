# Project Structure - Geethika Digital World

## 📁 Complete Directory Structure

```
geethika-digital-world/                    # Root directory
│
├── client/                                # Frontend Application
│   ├── src/
│   │   ├── components/                   # Reusable UI components
│   │   │   ├── Navbar.jsx               # Navigation bar with cart
│   │   │   ├── Footer.jsx               # Footer with links
│   │   │   ├── ProductCard.jsx          # Product display card
│   │   │   └── WhatsAppFloat.jsx        # Floating WhatsApp button
│   │   │
│   │   ├── pages/                        # Page components
│   │   │   ├── HomePage.jsx             # Landing page
│   │   │   ├── ShopPage.jsx             # Product catalog
│   │   │   ├── ProductDetailPage.jsx    # Product details
│   │   │   ├── ServicesPage.jsx         # Services & booking
│   │   │   ├── GalleryPage.jsx          # Image gallery
│   │   │   ├── ContactPage.jsx          # Contact information
│   │   │   └── CartPage.jsx             # Shopping cart
│   │   │
│   │   ├── context/                      # React Context
│   │   │   └── CartContext.jsx          # Cart state management
│   │   │
│   │   ├── data/                         # Static data
│   │   │   ├── categories.js            # Product categories
│   │   │   ├── products.js              # Product catalog
│   │   │   └── services.js              # Service packages
│   │   │
│   │   ├── App.jsx                       # Main app component
│   │   ├── main.jsx                      # Entry point
│   │   └── index.css                     # Global styles
│   │
│   ├── public/                           # Static assets
│   │   └── vite.svg
│   │
│   ├── node_modules/                     # Dependencies
│   ├── index.html                        # HTML template
│   ├── package.json                      # Dependencies & scripts
│   ├── package-lock.json                 # Lock file
│   ├── vite.config.js                    # Vite configuration
│   ├── tailwind.config.js                # Tailwind configuration
│   ├── postcss.config.js                 # PostCSS configuration
│   ├── eslint.config.js                  # ESLint configuration
│   ├── vercel.json                       # Vercel deployment config
│   ├── .gitignore                        # Git ignore rules
│   └── README.md                         # Client documentation
│
├── backend/                               # Backend Application
│   ├── config/                           # Configuration files
│   │   ├── database.js                  # PostgreSQL connection
│   │   ├── cloudinary.js                # Image upload config
│   │   └── razorpay.js                  # Payment gateway config
│   │
│   ├── middleware/                       # Express middleware
│   │   ├── auth.js                      # JWT authentication
│   │   ├── upload.js                    # File upload (Multer)
│   │   └── errorHandler.js              # Error handling
│   │
│   ├── routes/                           # API routes
│   │   ├── auth.js                      # Authentication endpoints
│   │   ├── products.js                  # Product CRUD
│   │   ├── categories.js                # Category management
│   │   ├── orders.js                    # Order processing
│   │   └── services.js                  # Service booking
│   │
│   ├── scripts/                          # Utility scripts
│   │   └── migrate.js                   # Database migration
│   │
│   ├── uploads/                          # Temporary file uploads
│   ├── node_modules/                     # Dependencies
│   ├── server.js                         # Main server file
│   ├── package.json                      # Dependencies & scripts
│   ├── .env.example                      # Environment template
│   ├── .gitignore                        # Git ignore rules
│   ├── README.md                         # Backend documentation
│   └── postman_collection.json           # API testing collection
│
├── Documentation/                         # Project documentation
│   ├── README.md                         # Main documentation
│   ├── QUICKSTART.md                     # Quick setup guide
│   ├── DEPLOYMENT_CHECKLIST.md           # Pre-deployment checklist
│   ├── CUSTOMIZATION_GUIDE.md            # Customization instructions
│   ├── FULL_STACK_DEPLOYMENT.md          # Complete deployment guide
│   ├── COMPLETE_PROJECT_SUMMARY.md       # Full project overview
│   ├── DEVELOPER_QUICK_REFERENCE.md      # Quick reference cheat sheet
│   └── PROJECT_STRUCTURE.md              # This file
│
├── .gitignore                            # Root git ignore
├── package.json                          # Root package.json (monorepo)
└── ROOT_README.md                        # Root documentation
```

## 📊 File Count Summary

### Client (Frontend)
- **Components**: 4 files
- **Pages**: 7 files
- **Context**: 1 file
- **Data**: 3 files
- **Config Files**: 7 files
- **Total**: ~22 files + node_modules

### Backend
- **Config**: 3 files
- **Middleware**: 3 files
- **Routes**: 5 files
- **Scripts**: 1 file
- **Config Files**: 4 files
- **Total**: ~16 files + node_modules

### Documentation
- **Guides**: 8 comprehensive documents

### Root
- **Config**: 2 files (.gitignore, package.json)

## 🎯 Key Directories Explained

### `/client`
Frontend React application built with Vite and Tailwind CSS. Contains all UI components, pages, and client-side logic.

**Port**: 5173 (development)  
**Build Output**: `client/dist/`  
**Deploy To**: Vercel

### `/backend`
Backend Node.js API built with Express and PostgreSQL. Handles authentication, data management, and business logic.

**Port**: 5000 (development)  
**Deploy To**: Render

### `/Documentation`
All project documentation including setup guides, deployment instructions, and customization tips.

## 🚀 Running the Application

### Development Mode

**Option 1: Run Both (Recommended)**
```bash
# From root directory
npm run dev
```

**Option 2: Run Separately**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

### Production Mode

**Build Client**
```bash
cd client
npm run build
```

**Start Backend**
```bash
cd backend
npm start
```

## 📦 Dependencies

### Client Dependencies
- react, react-dom
- react-router-dom
- lucide-react
- vite, tailwindcss

### Backend Dependencies
- express
- pg (PostgreSQL)
- jsonwebtoken, bcryptjs
- multer, cloudinary
- razorpay
- helmet, cors, compression

## 🔧 Configuration Files

### Client
- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS customization
- `postcss.config.js` - PostCSS plugins
- `vercel.json` - Vercel deployment settings

### Backend
- `.env` - Environment variables (not in git)
- `.env.example` - Environment template

### Root
- `package.json` - Monorepo scripts
- `.gitignore` - Git ignore rules

## 🌐 API Endpoints

All backend API endpoints are prefixed with `/api`:

- `/api/auth/*` - Authentication
- `/api/products/*` - Products
- `/api/categories/*` - Categories
- `/api/orders/*` - Orders
- `/api/services/*` - Services

See `backend/README.md` for complete API documentation.

## 📝 Important Files

### Must Configure Before Deployment

**Client**:
- `client/.env` - API URL and Razorpay key
- `client/src/components/WhatsAppFloat.jsx` - WhatsApp number
- `client/src/pages/ContactPage.jsx` - Business info

**Backend**:
- `backend/.env` - All environment variables
- `backend/config/database.js` - Database connection
- `backend/config/cloudinary.js` - Image upload
- `backend/config/razorpay.js` - Payment gateway

## 🔐 Environment Variables

### Client (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY=your_key
```

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_NAME=geethika_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
FRONTEND_URL=http://localhost:5173
```

## 📊 Database Schema

9 tables in PostgreSQL:
1. users
2. categories
3. products
4. services
5. service_packages
6. orders
7. order_items
8. service_bookings
9. gallery_images

See `backend/scripts/migrate.js` for complete schema.

## 🎨 Styling

### Tailwind Custom Theme

Defined in `client/src/index.css`:

```css
@theme {
  --color-valentine-pink: #FF69B4;
  --color-valentine-red: #DC143C;
  --color-valentine-lightPink: #FFB6C1;
  --color-valentine-darkRed: #8B0000;
  --color-valentine-rose: #FF007F;
}
```

### Custom CSS Classes

- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.card` - Card component
- `.valentine-gradient` - Gradient background
- `.section-title` - Section heading

## 🚀 Deployment Structure

```
Production:
├── Frontend (Vercel)
│   └── https://your-app.vercel.app
│
├── Backend (Render)
│   └── https://your-api.onrender.com
│
├── Database (Render PostgreSQL)
│   └── Internal connection
│
├── Images (Cloudinary)
│   └── CDN URLs
│
└── Payments (Razorpay)
    └── Payment gateway
```

## 📞 Quick Commands Reference

```bash
# Root level
npm run dev              # Run both client & backend
npm run install:all      # Install all dependencies
npm run migrate          # Run database migrations

# Client
cd client
npm run dev             # Start dev server
npm run build           # Build for production

# Backend
cd backend
npm run dev             # Start dev server
npm start               # Start production server
npm run migrate         # Run migrations
```

## 📚 Documentation Index

1. **ROOT_README.md** - Main entry point
2. **client/README.md** - Frontend documentation
3. **backend/README.md** - Backend documentation
4. **QUICKSTART.md** - Quick setup guide
5. **DEPLOYMENT_CHECKLIST.md** - Pre-deployment checklist
6. **CUSTOMIZATION_GUIDE.md** - Customization tips
7. **FULL_STACK_DEPLOYMENT.md** - Deployment guide
8. **DEVELOPER_QUICK_REFERENCE.md** - Quick reference

---

## ✅ Project Status

- **Frontend**: ✅ Complete
- **Backend**: ✅ Complete
- **Documentation**: ✅ Complete
- **Structure**: ✅ Organized
- **Status**: ✅ Production Ready

---

**Last Updated**: February 4, 2026
