# 🔐 Admin Login - Quick Guide

## ✅ Status: WORKING & VERIFIED

All admin accounts are active and passwords have been verified.

---

## 🎯 Quick Start (3 Steps)

### Step 1: Start Backend
```bash
cd backend
npm start
```
✅ Wait for: "🚀 Geethika Digital World API Server"

### Step 2: Start Frontend
```bash
cd client
npm run dev
```
✅ Wait for: "Local: http://localhost:5173"

### Step 3: Login
Open browser: **http://localhost:5173/admin/login**

---

## 🔑 Login Credentials

### Super Admin (Full Access)
```
Email:    superadmin@geethika.com
Password: SuperAdmin@123
```

### Regular Admin (Standard Access)
```
Email:    admin@geethikadigitalworld.com
Password: Admin@123
```

---

## 📍 Important URLs

| Page | URL |
|------|-----|
| Admin Login | http://localhost:5173/admin/login |
| Admin Dashboard | http://localhost:5173/admin/dashboard |
| Customer Login | http://localhost:5173/login |
| Backend API | http://localhost:5000 |
| API Health | http://localhost:5000/health |

---

## 🎨 What You'll See

### 1. Login Page
- Pink/red gradient background
- Lock icon at top
- Email and password fields
- "Sign In" button

### 2. After Login
- Redirects to admin dashboard
- Left sidebar with menu
- Dashboard statistics
- Admin name in header

### 3. Admin Menu Items
- 📊 Dashboard
- 📦 Products
- 🛍️ Services
- 🛒 Orders
- 👥 Customers
- 📈 Sales Report
- 💬 WhatsApp Templates
- 📤 WhatsApp Campaigns
- 🛡️ Admin Management (Super Admin only)
- 📋 Audit Log (Super Admin only)

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Login failed" or "Network error"
**Cause:** Backend not running
**Solution:**
```bash
cd backend
npm start
```

### Issue 2: "Access denied"
**Cause:** Using customer credentials
**Solution:** Use admin credentials from above

### Issue 3: Blank page after login
**Cause:** Cached data
**Solution:**
1. Press F12 (DevTools)
2. Application → Local Storage
3. Clear all
4. Refresh page

### Issue 4: "Cannot connect to server"
**Cause:** Wrong backend URL
**Solution:** Check `client/.env`:
```
VITE_API_URL=http://localhost:5000
```

---

## 🧪 Test Login (Browser Console)

1. Open http://localhost:5173/admin/login
2. Press F12 (DevTools)
3. Go to Console tab
4. Paste and run:

```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'superadmin@geethika.com',
    password: 'SuperAdmin@123'
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Login successful!', data);
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/admin/dashboard';
  }
})
.catch(err => console.error('❌ Login failed:', err));
```

---

## 🔧 Troubleshooting Commands

### Check if admins exist
```bash
cd backend
node scripts/check-admin-users.js
```

### Verify login system
```bash
cd backend
node scripts/verify-admin-login.js
```

### Reset passwords
```bash
cd backend
node scripts/test-admin-login-direct.js
```

### Create new admin
```bash
cd backend
node scripts/create-admin.js
```

---

## 📱 Mobile/Tablet Access

The admin panel is responsive and works on:
- ✅ Desktop (recommended)
- ✅ Tablet
- ✅ Mobile (limited)

---

## 🔒 Security Notes

1. **Change Default Passwords** in production
2. **Use HTTPS** in production
3. **Enable 2FA** (future feature)
4. **Regular password updates** recommended
5. **Monitor audit logs** for suspicious activity

---

## 💡 Pro Tips

### Tip 1: Keep Terminals Open
- Terminal 1: Backend server (don't close)
- Terminal 2: Frontend dev server (don't close)

### Tip 2: Bookmark Admin Login
Save this URL: http://localhost:5173/admin/login

### Tip 3: Use Browser Profiles
- Profile 1: Admin account
- Profile 2: Customer account
- Prevents logout conflicts

### Tip 4: Check Network Tab
If login fails:
1. Press F12
2. Go to Network tab
3. Look for `/api/auth/login` request
4. Check response for errors

---

## 🎯 Success Checklist

Before reporting issues, verify:

- [ ] Backend server is running (port 5000)
- [ ] Frontend is running (port 5173)
- [ ] Using correct URL: `/admin/login` not `/login`
- [ ] Using admin credentials (not customer)
- [ ] No errors in browser console (F12)
- [ ] Can access http://localhost:5000/health
- [ ] Tried clearing browser cache
- [ ] Tried different browser

---

## 📞 Need Help?

### Quick Checks
1. ✅ Both servers running?
2. ✅ Using correct credentials?
3. ✅ On correct login page?
4. ✅ Browser console clear?

### Verification Script
```bash
cd backend
node scripts/verify-admin-login.js
```

This will check everything and show you the credentials.

---

## 🎉 You're Ready!

Everything is set up and working. Use the credentials above to login and start managing your store!

**Login URL:** http://localhost:5173/admin/login

**Super Admin:** superadmin@geethika.com / SuperAdmin@123

**Regular Admin:** admin@geethikadigitalworld.com / Admin@123

Happy managing! 🚀
