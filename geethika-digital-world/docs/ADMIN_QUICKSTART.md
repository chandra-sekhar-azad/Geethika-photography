# Admin Dashboard - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Setup Database

Run the admin setup SQL script:

```bash
cd backend
psql -U postgres -d geethika_db -f scripts/setup-admin.sql
```

Or if using a different database name:
```bash
psql -U your_username -d your_database -f scripts/setup-admin.sql
```

### Step 2: Create Admin User

**Option A: Use the script (Recommended)**
```bash
cd backend
npm run create-admin
```

Follow the prompts to enter:
- Admin name
- Admin email
- Admin password

**Option B: Use default credentials**

The setup script creates a default admin:
- Email: `admin@geethika.com`
- Password: `admin123`

⚠️ **Change this password immediately after first login!**

### Step 3: Start Backend

```bash
cd backend
npm install  # if not already done
npm run dev
```

Backend should be running on `http://localhost:5000`

### Step 4: Start Frontend

```bash
cd client
npm install  # if not already done
npm run dev
```

Frontend should be running on `http://localhost:5173`

### Step 5: Access Admin Dashboard

1. Open browser and go to: `http://localhost:5173/admin/login`
2. Login with your admin credentials
3. You'll be redirected to the dashboard!

## 📱 Admin Dashboard URLs

- **Login:** `/admin/login`
- **Dashboard:** `/admin/dashboard`
- **Products:** `/admin/products`
- **Orders:** `/admin/orders`
- **Customers:** `/admin/customers`
- **Sales Report:** `/admin/sales-report`

## ✨ First Steps After Login

### 1. Add Categories (if not already added)
Categories are auto-created by the setup script:
- Flowers
- Gifts
- Cakes
- Chocolates
- Combos

### 2. Add Your First Product
1. Go to Products page
2. Click "Add Product"
3. Fill in:
   - Product name
   - Description
   - Select category
   - Set price
   - Add stock quantity
   - Upload image (optional)
4. Click "Create Product"

### 3. Test Order Management
1. Go to Orders page
2. Click "Add Offline Order"
3. Enter customer details
4. Create test order

### 4. View Dashboard Stats
- Go back to Dashboard
- See your stats update in real-time!

## 🔧 Troubleshooting

### Cannot Login?

**Check 1: Database Connection**
```bash
psql -U postgres -d geethika_db -c "SELECT * FROM users WHERE role='admin';"
```

**Check 2: Backend Running**
- Visit `http://localhost:5000/health`
- Should return: `{"status":"healthy"}`

**Check 3: Admin User Exists**
```sql
SELECT email, role FROM users WHERE role = 'admin';
```

### Products Not Showing?

**Check categories exist:**
```sql
SELECT * FROM categories;
```

**Check products table:**
```sql
SELECT COUNT(*) FROM products;
```

### Orders Not Loading?

**Check orders table:**
```sql
SELECT COUNT(*) FROM orders;
```

## 📊 Sample Data (Optional)

Want to test with sample data? Run these SQL commands:

```sql
-- Add sample products
INSERT INTO products (name, slug, description, category_id, price, stock_quantity, is_active)
VALUES 
  ('Red Roses Bouquet', 'red-roses-bouquet', 'Beautiful red roses', 1, 999, 50, true),
  ('Chocolate Box', 'chocolate-box', 'Premium chocolates', 4, 499, 100, true),
  ('Birthday Cake', 'birthday-cake', 'Delicious cake', 3, 799, 20, true);

-- Add sample order
INSERT INTO orders (order_number, customer_name, customer_phone, shipping_address, subtotal, total, order_status, payment_status)
VALUES ('ORD-TEST-001', 'Test Customer', '9876543210', '123 Test Street', 999, 999, 'pending', 'pending');
```

## 🎯 Common Tasks

### Change Admin Password

```sql
-- First, hash your new password using bcrypt
-- Then update:
UPDATE users 
SET password = 'your_bcrypt_hashed_password' 
WHERE email = 'admin@geethika.com';
```

Or use the create-admin script to create a new admin user.

### Make Existing User Admin

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'user@example.com';
```

### View All Orders

```sql
SELECT order_number, customer_name, total, order_status, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;
```

### Check Sales Today

```sql
SELECT COUNT(*) as orders, SUM(total) as revenue 
FROM orders 
WHERE DATE(created_at) = CURRENT_DATE 
AND payment_status = 'paid';
```

## 🔐 Security Checklist

- [ ] Changed default admin password
- [ ] Set strong JWT_SECRET in .env
- [ ] Enabled HTTPS (in production)
- [ ] Set up database backups
- [ ] Configured CORS properly
- [ ] Set up rate limiting
- [ ] Enabled helmet security headers

## 📚 Next Steps

1. **Customize Products:** Add your actual products with images
2. **Configure Services:** Set up your service offerings
3. **Test Orders:** Create test orders to verify workflow
4. **Review Reports:** Check sales analytics
5. **Manage Customers:** Review customer database

## 🆘 Need Help?

1. Check the full guide: `ADMIN_DASHBOARD_GUIDE.md`
2. Review API endpoints in backend routes
3. Check browser console for errors
4. Review backend logs
5. Verify database schema

## 🎉 You're All Set!

Your admin dashboard is now ready to use. Start managing your e-commerce platform!

**Happy Selling! 🛍️**

---

**Quick Links:**
- Admin Login: http://localhost:5173/admin/login
- Website: http://localhost:5173
- API Health: http://localhost:5000/health
- Full Documentation: ADMIN_DASHBOARD_GUIDE.md
