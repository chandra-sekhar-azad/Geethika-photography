# Geethika Digital World - Frontend (Client)

React-based frontend for Geethika Digital World e-commerce platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
client/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   └── WhatsAppFloat.jsx
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx
│   │   ├── ShopPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── ServicesPage.jsx
│   │   ├── GalleryPage.jsx
│   │   ├── ContactPage.jsx
│   │   └── CartPage.jsx
│   ├── context/            # React Context
│   │   └── CartContext.jsx
│   ├── data/               # Static data
│   │   ├── categories.js
│   │   ├── products.js
│   │   └── services.js
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Features

- ✅ 7 fully functional pages
- ✅ Product customization (image upload, text, sizes)
- ✅ Shopping cart with localStorage
- ✅ Service booking forms
- ✅ Valentine special theme
- ✅ WhatsApp integration
- ✅ Fully responsive design
- ✅ Fast performance (88KB gzipped)

## 🛠️ Technology Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **Icons**: Lucide React
- **State Management**: Context API

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY=your_razorpay_key_id
```

### Tailwind Configuration

Custom colors are defined in `tailwind.config.js`:

```javascript
colors: {
  valentine: {
    pink: '#FF69B4',
    red: '#DC143C',
    lightPink: '#FFB6C1',
    darkRed: '#8B0000',
    rose: '#FF007F',
  }
}
```

## 📦 Available Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Customization

### Update WhatsApp Number

Update in these files:
1. `src/components/WhatsAppFloat.jsx`
2. `src/pages/ServicesPage.jsx`
3. `src/pages/CartPage.jsx`
4. `src/pages/ContactPage.jsx`

### Add New Product

Edit `src/data/products.js`:

```javascript
{
  id: 19,
  name: 'Product Name',
  category: 'category-slug',
  price: 999,
  image: 'https://image-url.com/image.jpg',
  description: 'Description',
  customizable: true,
  valentineSpecial: false,
  discount: 0
}
```

### Change Theme Colors

Edit `src/index.css`:

```css
@theme {
  --color-valentine-pink: #FF69B4;
  --color-valentine-red: #DC143C;
  /* ... other colors */
}
```

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables on Vercel

Add in Vercel dashboard:
- `VITE_API_URL` - Your backend API URL
- `VITE_RAZORPAY_KEY` - Your Razorpay key

## 📊 Performance

- **Build Time**: ~3 seconds
- **Bundle Size**: 293 KB (uncompressed)
- **Gzipped Size**: 88 KB
- **First Load**: <2 seconds

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173
npm run dev
```

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .vite
npm install
npm run build
```

## 📞 Support

- **Email**: info@geethikadigitalworld.com
- **Documentation**: See root README.md

## 📄 License

Copyright © 2026 Geethika Digital World. All rights reserved.
