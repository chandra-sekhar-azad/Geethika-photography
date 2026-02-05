# Developer Quick Reference
## Geethika Digital World - Cheat Sheet

---

## 🚀 Quick Start Commands

### Frontend
```bash
cd geethika-digital-world
npm install
npm run dev          # Start dev server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend
```bash
cd backend
npm install
npm run migrate      # Run database migrations
npm run dev          # Start dev server with nodemon
npm start            # Start production server
```

---

## 📁 Key File Locations

### Frontend
```
src/
├── pages/           # All page components
├── components/      # Reusable components
├── context/         # CartContext.jsx
├── data/            # products.js, services.js, categories.js
├── App.jsx          # Main app with routes
└── index.css        # Tailwind styles
```

### Backend
```
backend/
├── routes/          # API endpoints
├── config/          # database.js, cloudinary.js, razorpay.js
├── middleware/      # auth.js, upload.js, errorHandler.js
├── scripts/         # migrate.js
└── server.js        # Main server file
```

---

## 🔑 Environment Variables

### Frontend (.env)
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

---

## 🎨 Tailwind Custom Classes

```css
.btn-primary          /* Primary button with gradient */
.btn-secondary        /* Secondary outlined button */
.card                 /* Card with shadow and hover */
.valentine-gradient   /* Red-pink gradient background */
.section-title        /* Large centered title */
```

### Custom Colors
```css
valentine-pink        /* #FF69B4 */
valentine-red         /* #DC143C */
valentine-lightPink   /* #FFB6C1 */
valentine-darkRed     /* #8B0000 */
valentine-rose        /* #FF007F */
```

---

## 🔌 API Endpoints Quick Reference

### Base URL
```
Local: http://localhost:5000
Production: https://your-backend.onrender.com
```

### Auth
```
POST /api/auth/register
POST /api/auth/login
```

### Products
```
GET    /api/products
GET    /api/products/:id
POST   /api/products          (admin)
PUT    /api/products/:id      (admin)
DELETE /api/products/:id      (admin)
```

### Orders
```
POST   /api/orders/create-razorpay-order
POST   /api/orders/verify-payment
POST   /api/orders
GET    /api/orders            (admin)
GET    /api/orders/:id
PATCH  /api/orders/:id/status (admin)
```

### Services
```
GET    /api/services
POST   /api/services/bookings
GET    /api/services/bookings/all (admin)
```

---

## 🗄️ Database Quick Commands

### PostgreSQL
```bash
# Connect to database
psql -U postgres -d geethika_db

# List tables
\dt

# Describe table
\d table_name

# Run query
SELECT * FROM products LIMIT 10;

# Exit
\q
```

### Common Queries
```sql
-- Get all products
SELECT * FROM products WHERE is_active = true;

-- Get orders with items
SELECT o.*, oi.* FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id;

-- Get user by email
SELECT * FROM users WHERE email = 'admin@geethikadigitalworld.com';

-- Update order status
UPDATE orders SET order_status = 'completed' WHERE id = 1;
```

---

## 🔐 Admin Credentials

```
Email: admin@geethikadigitalworld.com
Password: Admin@123
```

**⚠️ Change these after first login!**

---

## 📦 Adding New Product (Code)

```javascript
// In src/data/products.js
{
  id: 19,
  name: 'Product Name',
  category: 'category-slug',
  price: 999,
  image: 'https://image-url.com/image.jpg',
  description: 'Product description',
  customizable: true,
  customizationOptions: {
    imageUpload: true,
    textInput: ['Field 1', 'Field 2'],
    sizes: [
      { name: 'Small', price: 999 },
      { name: 'Large', price: 1299 }
    ]
  },
  valentineSpecial: false,
  discount: 0
}
```

---

## 🛠️ Common Tasks

### Update WhatsApp Number
```javascript
// Files to update:
1. src/components/WhatsAppFloat.jsx (line 4)
2. src/pages/ServicesPage.jsx (line 40)
3. src/pages/CartPage.jsx (line 62)
4. src/pages/ContactPage.jsx (line 4)

// Replace: 919876543210
// With: your_number
```

### Add New Route
```javascript
// In src/App.jsx
<Route path="/new-page" element={<NewPage />} />

// Create src/pages/NewPage.jsx
import React from 'react';

const NewPage = () => {
  return <div>New Page Content</div>;
};

export default NewPage;
```

### Add New API Endpoint
```javascript
// In backend/routes/yourRoute.js
router.get('/endpoint', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM table');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 🐛 Debugging Tips

### Frontend Issues
```bash
# Clear cache
rm -rf node_modules .vite
npm install

# Check console
Open DevTools → Console tab

# Check network
Open DevTools → Network tab
```

### Backend Issues
```bash
# Check logs
npm run dev  # Watch console output

# Test endpoint
curl http://localhost:5000/health

# Check database connection
psql -U postgres -d geethika_db
```

### Common Errors

**CORS Error**
- Check FRONTEND_URL in backend .env
- Verify CORS configuration in server.js

**Database Connection Error**
- Check PostgreSQL is running
- Verify credentials in .env
- Check database exists

**Image Upload Error**
- Verify Cloudinary credentials
- Check file size (max 5MB)
- Ensure uploads/ directory exists

---

## 📊 Testing Checklist

### Frontend
- [ ] All pages load
- [ ] Navigation works
- [ ] Cart functionality
- [ ] Forms submit
- [ ] Images display
- [ ] Responsive on mobile

### Backend
- [ ] Health check returns 200
- [ ] Auth endpoints work
- [ ] CRUD operations work
- [ ] File upload works
- [ ] Payment integration works

### Integration
- [ ] Frontend connects to backend
- [ ] Orders are created
- [ ] Images upload to Cloudinary
- [ ] Payments process
- [ ] WhatsApp links work

---

## 🚀 Deployment Commands

### Frontend (Vercel)
```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```

### Backend (Render)
```bash
# Push to GitHub
git add .
git commit -m "Deploy backend"
git push origin main

# Render auto-deploys from GitHub
```

---

## 📞 Quick Links

- **Frontend Local**: http://localhost:5173
- **Backend Local**: http://localhost:5000
- **API Health**: http://localhost:5000/health
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **Cloudinary**: https://cloudinary.com/console
- **Razorpay**: https://dashboard.razorpay.com

---

## 🔧 Useful npm Scripts

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # Run ESLint
```

### Backend
```bash
npm run dev          # Development with nodemon
npm start            # Production server
npm run migrate      # Run migrations
```

---

## 💡 Pro Tips

1. **Use Environment Variables**: Never hardcode credentials
2. **Test Locally First**: Always test before deploying
3. **Check Logs**: Monitor Render/Vercel logs for errors
4. **Backup Database**: Regular backups are essential
5. **Update Dependencies**: Keep packages up to date
6. **Use Git**: Commit frequently with clear messages
7. **Document Changes**: Update README when adding features
8. **Test on Mobile**: Always check mobile responsiveness

---

## 🆘 Emergency Contacts

- **Technical Issues**: Check documentation first
- **Deployment Issues**: Check Vercel/Render status pages
- **Payment Issues**: Contact Razorpay support
- **Database Issues**: Check Render PostgreSQL logs

---

**Keep this file handy for quick reference! 📌**

Last Updated: February 4, 2026
