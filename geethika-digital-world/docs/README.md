# Geethika Digital World - Valentine Special Website

A professional Phase 1 business website for Geethika Digital World, featuring a Valentine's special theme with e-commerce capabilities, service booking, and WhatsApp integration.

## 🎯 Features

### Product Selling
- 15+ product categories including Couple Gifts, Personalised Gifts, T-Shirts, Plants, Photo Frames, etc.
- Product customization (image upload, text input, size selection)
- Dynamic pricing based on customization
- Shopping cart with quantity management
- Valentine special discounts

### Service Booking
- Photography & Videography services
- Event Decoration (Wedding, Birthday, Corporate)
- Home & Shop Redecor services
- Package-based pricing
- Booking form with advance payment integration

### E-Commerce Flow
Product → Customization → Add to Cart → Checkout → Address Entry → Payment → WhatsApp Confirmation

### UI/UX
- Valentine special theme (Red & Pink gradient palette)
- Responsive design (Mobile, Tablet, Desktop)
- Modern, clean interface
- Smooth animations and transitions
- Professional typography (Inter + Playfair Display)

### Integrations
- WhatsApp floating button
- WhatsApp order confirmation
- Razorpay payment gateway (ready for backend integration)
- Google Maps location

## 🛠️ Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **State Management**: React Context API
- **Hosting**: Vercel (Frontend)

## 📦 Installation

1. Clone the repository:
```bash
cd geethika-digital-world
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 🌐 Pages

1. **Home Page** - Hero banner, featured products, services showcase, offers
2. **Shop Page** - Category filtering, product grid, search functionality
3. **Product Detail Page** - Product customization, add to cart
4. **Services Page** - Service packages, booking form
5. **Gallery Page** - Image gallery with category filters
6. **Contact Page** - Contact information, Google Maps, WhatsApp integration
7. **Cart Page** - Cart management, checkout form

## 🎨 Theme Colors

- Valentine Pink: #FF69B4
- Valentine Red: #DC143C
- Light Pink: #FFB6C1
- Dark Red: #8B0000
- Rose: #FF007F

## 📱 WhatsApp Integration

Update the phone number in the following files:
- `src/components/WhatsAppFloat.jsx`
- `src/pages/ServicesPage.jsx`
- `src/pages/CartPage.jsx`
- `src/pages/ContactPage.jsx`

Replace `919876543210` with your actual WhatsApp business number.

## 💳 Payment Integration

The frontend is ready for Razorpay integration. Backend implementation required for:
- Order creation
- Payment verification
- Order status updates

## 🚀 Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to complete deployment

## 📋 Business Categories

1. Personalised Gifts
2. Couple Gifts
3. T-Shirts
4. Plants
5. Photo Frames
6. Printing Works
7. Interior Gifts & Decor Items
8. Photography & Videography
9. Event Decor
10. Home Redecor
11. Shop Redecor
12. Cakes
13. Flower Bouquets
14. Chocolate Bouquets
15. Event Needs
16. Return Gifts

## 🔄 Next Steps (Phase 2)

- Backend API development (Node.js + Express)
- PostgreSQL database setup
- Razorpay payment integration
- Cloudinary image upload
- Admin dashboard
- Order management system
- Customer database
- Sales reporting

## 📞 Support

For any queries or support, contact:
- Email: info@geethikadigitalworld.com
- Phone: +91 98765 43210

## 📄 License

Copyright © 2026 Geethika Digital World. All rights reserved.
