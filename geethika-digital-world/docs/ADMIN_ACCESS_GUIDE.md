# Admin Access Guide - Development vs Production

## Quick Answer

### Development (Current):
```
http://localhost:5173/admin/login
```

### Production (After Deployment):
```
https://yourdomain.com/admin/login
```

**The `/admin/login` route never changes!** Only the domain changes.

---

## How It Works

Your React Router configuration in `App.jsx` handles the `/admin/login` route:

```javascript
<Route path="/admin/login" element={<AdminLogin />} />
```

This route is **relative to your domain**, so:
- In development: `localhost:5173` + `/admin/login`
- In production: `yourdomain.com` + `/admin/login`

---

## Admin Login Credentials

### Default Admin:
- **Email:** admin@geethikadigitalworld.com
- **Password:** (set when you ran create-admin script)

### Create New Admin:

**Development:**
```bash
cd backend
node scripts/create-admin.js
```

**Production (after deployment):**
```bash
# SSH into your server
cd backend
node scripts/create-admin.js

# Or use database client to run SQL:
INSERT INTO users (email, password, name, role) 
VALUES ('admin@yourdomain.com', 'hashed_password', 'Admin', 'admin');
```

---

## Deployment Scenarios

### Scenario 1: Vercel (Frontend + Backend)

**Frontend URL:**
```
https://geethika-digital-world.vercel.app
```

**Admin Access:**
```
https://geethika-digital-world.vercel.app/admin/login
```

**Backend URL:**
```
https://geethika-backend.vercel.app
```

### Scenario 2: Custom Domain

**Frontend URL:**
```
https://www.geethikadigitalworld.com
```

**Admin Access:**
```
https://www.geethikadigitalworld.com/admin/login
```

**Backend URL:**
```
https://api.geethikadigitalworld.com
```

### Scenario 3: Subdomain for Admin

If you want a separate subdomain for admin:

**Regular Site:**
```
https://www.geethikadigitalworld.com
```

**Admin Panel:**
```
https://admin.geethikadigitalworld.com/login
```

(This requires additional configuration)

---

## What Changes During Deployment

### ✅ Changes:
1. **Domain name** (localhost → yourdomain.com)
2. **Protocol** (http → https)
3. **Port** (5173 → none, uses default 80/443)
4. **API URL** (localhost:5000 → your-backend-url)

### ❌ Doesn't Change:
1. **Routes** (/admin/login stays the same)
2. **Admin credentials** (same email/password)
3. **Admin features** (all functionality works the same)
4. **Database structure** (same tables and data)

---

## Environment Variables

### Development (.env):
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
```

### Production (.env.production):
```env
VITE_API_URL=https://api.yourdomain.com
VITE_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
```

---

## Testing Admin Access

### Before Deployment (Local):
1. Start backend: `cd backend && npm start`
2. Start frontend: `cd client && npm run dev`
3. Visit: `http://localhost:5173/admin/login`
4. Login with admin credentials
5. Test all admin features

### After Deployment (Production):
1. Visit: `https://yourdomain.com/admin/login`
2. Login with same admin credentials
3. Test all admin features
4. Verify data loads correctly
5. Test creating/editing products

---

## Common Issues & Solutions

### Issue 1: Admin Login Not Found (404)
**Cause:** Frontend not deployed correctly or routing issue

**Solution:**
- Ensure build was successful
- Check deployment logs
- Verify `_redirects` file (Netlify) or `vercel.json` (Vercel)
- For Netlify, add: `/*  /index.html  200`

### Issue 2: Admin Login Shows But Can't Login
**Cause:** Backend not connected or admin user doesn't exist

**Solution:**
- Check API URL in environment variables
- Verify backend is running
- Create admin user in production database
- Check browser console for errors

### Issue 3: Admin Panel Loads But No Data
**Cause:** API calls failing or CORS issue

**Solution:**
- Check network tab in DevTools
- Verify API_BASE_URL is correct
- Check CORS settings in backend
- Ensure backend allows frontend domain

### Issue 4: "Unauthorized" Error
**Cause:** JWT token issue or admin role not set

**Solution:**
- Clear browser cache and cookies
- Login again
- Verify user has `role='admin'` in database
- Check JWT_SECRET is set in backend

---

## Security Best Practices

### 1. Use Strong Admin Password
```
Minimum 12 characters
Mix of uppercase, lowercase, numbers, symbols
Example: Admin@2026!Secure#Pass
```

### 2. Change Default Admin Email
```sql
-- Update admin email in production
UPDATE users 
SET email = 'your-secure-email@domain.com' 
WHERE role = 'admin';
```

### 3. Enable HTTPS
- Always use HTTPS in production
- Get free SSL from Let's Encrypt
- Most hosting platforms provide SSL automatically

### 4. Limit Admin Access (Optional)
```nginx
# Nginx config to restrict admin by IP
location /admin {
    allow YOUR_IP_ADDRESS;
    deny all;
}
```

### 5. Monitor Admin Activity
- Log all admin logins
- Track admin actions
- Set up alerts for suspicious activity

---

## Deployment Checklist

Before deploying:
- [ ] Admin user created in production database
- [ ] Strong admin password set
- [ ] Environment variables configured
- [ ] API URL updated (no localhost)
- [ ] CORS configured for production domain
- [ ] SSL certificate enabled
- [ ] Test admin login locally
- [ ] Backup database

After deploying:
- [ ] Visit `/admin/login` on production URL
- [ ] Login with admin credentials
- [ ] Test all admin features
- [ ] Verify products load
- [ ] Test creating new product
- [ ] Test order management
- [ ] Test customer database
- [ ] Check sales reports

---

## Quick Commands

### Create Admin (Production):
```bash
# SSH into server
ssh user@your-server.com

# Navigate to backend
cd /path/to/backend

# Run admin creation script
node scripts/create-admin.js

# Or use psql
psql $DATABASE_URL
INSERT INTO users (email, password, name, role) 
VALUES ('admin@domain.com', crypt('password', gen_salt('bf')), 'Admin', 'admin');
```

### Check Admin Exists:
```bash
# In psql
SELECT id, email, name, role FROM users WHERE role = 'admin';
```

### Reset Admin Password:
```bash
# Run in backend directory
node scripts/reset-admin-password.js
```

---

## Support Resources

### Documentation:
- React Router: https://reactrouter.com
- Vercel Deployment: https://vercel.com/docs
- Netlify Deployment: https://docs.netlify.com

### Troubleshooting:
1. Check browser console (F12)
2. Check network tab for API calls
3. Check deployment logs
4. Verify environment variables
5. Test backend API directly

---

## Example URLs

### Development:
- **Site:** http://localhost:5173
- **Shop:** http://localhost:5173/shop
- **Admin:** http://localhost:5173/admin/login
- **API:** http://localhost:5000

### Production (Example):
- **Site:** https://geethikadigitalworld.com
- **Shop:** https://geethikadigitalworld.com/shop
- **Admin:** https://geethikadigitalworld.com/admin/login
- **API:** https://api.geethikadigitalworld.com

---

## Remember

1. **Route stays the same:** `/admin/login` works everywhere
2. **Only domain changes:** localhost → yourdomain.com
3. **Same credentials:** Use same admin email/password
4. **Test thoroughly:** Always test after deployment
5. **Keep backups:** Backup database before major changes

---

**Need Help?**

If admin access doesn't work after deployment:
1. Check this guide's troubleshooting section
2. Review deployment logs
3. Verify environment variables
4. Test API endpoints directly
5. Check database for admin user

**Admin access is just a route - it works the same everywhere!** 🚀
