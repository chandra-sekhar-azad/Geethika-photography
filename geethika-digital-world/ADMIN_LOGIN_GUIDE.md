# Admin Login Guide

## Admin Credentials

**Email:** `admin@geethikadigitalworld.com`  
**Password:** `Admin@123`

## How to Access Admin Dashboard

1. Go to: `http://localhost:5173/login`
2. Enter the admin credentials above
3. Click "Login"
4. You will be automatically redirected to: `http://localhost:5173/admin/dashboard`

## Admin Dashboard Features

### Available Sections:

1. **Dashboard** (`/admin/dashboard`)
   - Overview of store statistics
   - Quick action links
   - Recent activity

2. **Product Management** (`/admin/products`)
   - Add new products
   - Edit existing products
   - Delete products
   - Manage product images
   - Set customization options

3. **Order Management** (`/admin/orders`)
   - View all orders
   - Update order status
   - Process payments
   - Add offline orders

4. **Service Management** (`/admin/services`)
   - Manage service offerings
   - View service bookings
   - Update booking status

5. **Customer Database** (`/admin/customers`)
   - View all registered customers
   - Customer order history
   - Contact information

6. **Sales Report** (`/admin/sales-report`)
   - View sales analytics
   - Revenue reports
   - Export data

## Direct Admin Dashboard Access

You can also directly access the admin dashboard at:
`http://localhost:5173/admin/dashboard`

If you're not logged in, you'll be redirected to the login page.

## Troubleshooting

### Issue: Not redirecting to admin dashboard after login

**Solution:**
1. Clear browser cache and localStorage
2. Make sure both frontend and backend servers are running:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`
3. Check browser console for any errors
4. Try logging in again

### Issue: "Invalid credentials" error

**Solution:**
1. Make sure you're using the exact credentials (case-sensitive)
2. Check that the backend server is running
3. Verify database connection in backend `.env` file

### Issue: Admin pages show errors

**Solution:**
1. Make sure the database migration was successful
2. Check that all admin page components exist
3. Verify the backend API is responding

## Database Connection

The admin system is connected to your Render PostgreSQL database:
- Database: `geethika_digital_world`
- Host: `dpg-d61oektactks73bgkl20-a.oregon-postgres.render.com`

All admin actions (adding products, managing orders, etc.) will be saved to this database.

## Security Notes

⚠️ **Important:** Change the default admin password before deploying to production!

To change the admin password:
1. Update `ADMIN_PASSWORD` in `backend/.env`
2. Run the migration script again: `npm run migrate` (in backend directory)

## Need Help?

If you encounter any issues:
1. Check that both servers are running
2. Look at browser console for errors
3. Check backend terminal for API errors
4. Verify database connection
