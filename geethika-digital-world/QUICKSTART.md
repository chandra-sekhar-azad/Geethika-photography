# Quick Start Guide - Geethika Digital World

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd geethika-digital-world
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Step 3: Build for Production
```bash
npm run build
```

## 📱 Configure WhatsApp Number

Replace the phone number in these files:
1. `src/components/WhatsAppFloat.jsx` - Line 4
2. `src/pages/ServicesPage.jsx` - Line 40
3. `src/pages/CartPage.jsx` - Line 62
4. `src/pages/ContactPage.jsx` - Line 4

Change `919876543210` to your actual WhatsApp business number.

## 🎨 Customize Business Information

### Contact Details
Edit `src/pages/ContactPage.jsx`:
- Address (Line 30-34)
- Phone (Line 42)
- Email (Line 52)
- Business Hours (Line 62-65)

### Footer
Edit `src/components/Footer.jsx`:
- Company description (Line 15-17)
- Contact information (Lines 50-70)

### Google Maps
Edit `src/pages/ContactPage.jsx` (Line 100):
- Replace the iframe src with your actual Google Maps embed URL

## 🛍️ Add Your Products

Edit `src/data/products.js`:
- Add new products to the `products` array
- Update product images (use your own URLs or Cloudinary links)
- Set prices and customization options

## 📸 Add Your Services

Edit `src/data/services.js`:
- Modify service packages
- Update pricing
- Change service descriptions

## 🎯 Valentine Theme Toggle

To change from Valentine theme to regular theme:

1. Edit `tailwind.config.js` - change color scheme
2. Edit `src/index.css` - update gradient classes
3. Remove Valentine banners from `src/components/Navbar.jsx`

## 🌐 Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: Vercel Dashboard
1. Go to https://vercel.com
2. Import your GitHub repository
3. Vercel will auto-detect Vite and deploy

## 📦 Project Structure

```
geethika-digital-world/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   └── WhatsAppFloat.jsx
│   ├── pages/          # Page components
│   │   ├── HomePage.jsx
│   │   ├── ShopPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── ServicesPage.jsx
│   │   ├── GalleryPage.jsx
│   │   ├── ContactPage.jsx
│   │   └── CartPage.jsx
│   ├── context/        # React Context
│   │   └── CartContext.jsx
│   ├── data/           # Static data
│   │   ├── categories.js
│   │   ├── products.js
│   │   └── services.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json         # Vercel deployment config
```

## 🔧 Common Issues

### Port Already in Use
```bash
# Kill the process using port 5173
npx kill-port 5173
npm run dev
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Images Not Loading
- Ensure image URLs are accessible
- Consider using Cloudinary for image hosting
- Check CORS settings if using external images

## 📞 Support

For technical support:
- Check the main README.md for detailed documentation
- Review the code comments in each file
- Contact: info@geethikadigitalworld.com

## 🎉 You're Ready!

Your Valentine special website is now ready to launch. Customize it with your branding, products, and services, then deploy to Vercel!
