# Geethika Digital World - Full Stack Application

Complete e-commerce and service booking platform with React frontend and Node.js backend.

## 📁 Project Structure

```
geethika-digital-world/
├── client/                 # React Frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context (Cart)
│   │   ├── data/          # Static data
│   │   └── App.jsx        # Main app
│   ├── public/            # Static assets
│   └── package.json
│
├── backend/               # Node.js Backend (Express + PostgreSQL)
│   ├── config/           # Configuration files
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── scripts/          # Database migrations
│   └── server.js         # Main server
│
└── Documentation/        # Project documentation
    ├── README.md
    ├── QUICKSTART.md
    ├── DEPLOYMENT_CHECKLIST.md
    ├── CUSTOMIZATION_GUIDE.md
    ├── FULL_STACK_DEPLOYMENT.md
    ├── COMPLETE_PROJECT_SUMMARY.md
    └── DEVELOPER_QUICK_REFERENCE.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

#### Option 1: Install All at Once
```bash
npm run install:all
```

#### Option 2: Install Separately
```bash
# Install client dependencies
npm run install:client

# Install backend dependencies
npm run install:backend
```

### Development

#### Run Both Client and Backend
```bash
npm run dev
```

#### Run Separately

**Client Only** (Port 5173):
```bash
npm run client
```

**Backend Only** (Port 5000):
```bash
npm run backend
```

### Database Setup

1. Create PostgreSQL database:
```bash
createdb geethika_db
```

2. Configure backend/.env (copy from backend/.env.example)

3. Run migrations:
```bash
npm run migrate
```

### Build for Production

```bash
# Build client
npm run build:client

# Build backend (if needed)
npm run build:backend
```

## 📚 Documentation

Comprehensive documentation is available in the root directory:

- **README.md** - Main project documentation
- **QUICKSTART.md** - Quick setup guide
- **DEPLOYMENT_CHECKLIST.md** - Pre-deployment checklist
- **CUSTOMIZATION_GUIDE.md** - Customization instructions
- **FULL_STACK_DEPLOYMENT.md** - Complete deployment guide
- **COMPLETE_PROJECT_SUMMARY.md** - Full project overview
- **DEVELOPER_QUICK_REFERENCE.md** - Quick reference cheat sheet

## 🛠️ Technology Stack

### Frontend (Client)
- React 19
- Vite 7
- Tailwind CSS 4
- React Router DOM 7
- Lucide React (icons)
- Context API

### Backend
- Node.js 18+
- Express.js 4
- PostgreSQL 14+
- JWT Authentication
- Cloudinary (image upload)
- Razorpay (payments)

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd client
vercel
```

### Backend (Render)
- Push to GitHub
- Connect repository to Render
- Configure environment variables
- Deploy

See **FULL_STACK_DEPLOYMENT.md** for detailed instructions.

## 📦 Available Scripts

### Root Level
- `npm run dev` - Run both client and backend
- `npm run client` - Run client only
- `npm run backend` - Run backend only
- `npm run install:all` - Install all dependencies
- `npm run build:client` - Build client for production
- `npm run migrate` - Run database migrations

### Client (cd client)
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend (cd backend)
- `npm run dev` - Start dev server with nodemon
- `npm start` - Start production server
- `npm run migrate` - Run database migrations

## 🔐 Environment Variables

### Client (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY=your_razorpay_key
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

## 🧪 Testing

### Test Client
```bash
cd client
npm run dev
# Visit http://localhost:5173
```

### Test Backend
```bash
cd backend
npm run dev
# Visit http://localhost:5000/health
```

### Test Full Stack
```bash
# Terminal 1
npm run backend

# Terminal 2
npm run client

# Or use concurrently
npm run dev
```

## 📞 Support

- **Email**: info@geethikadigitalworld.com
- **WhatsApp**: +91 98765 43210

## 📄 License

Copyright © 2026 Geethika Digital World. All rights reserved.

---

## 🎯 Quick Links

- [Client README](./client/README.md)
- [Backend README](./backend/README.md)
- [Full Documentation](./README.md)
- [Deployment Guide](./FULL_STACK_DEPLOYMENT.md)
- [Quick Reference](./DEVELOPER_QUICK_REFERENCE.md)

---

**Status**: ✅ Production Ready

**Last Updated**: February 4, 2026
