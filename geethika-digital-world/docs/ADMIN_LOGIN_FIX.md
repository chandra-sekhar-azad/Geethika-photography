# Admin Login - Fixed & Working

## ✅ Issue Resolved

The admin passwords have been reset and verified. You can now login with these credentials:

## 🔑 Login Credentials

### Super Admin
```
Email: superadmin@geethika.com
Password: SuperAdmin@123
```

### Regular Admin
```
Email: admin@geethikadigitalworld.com
Password: Admin@123
```

## 🌐 How to Login

### Step 1: Start Backend Server
```bash
cd backend
npm start
```
Server should run on: http://localhost:5000

### Step 2: Start Frontend
```bash
cd client
npm run dev
```
Frontend should run on: http://localhost:5173

### Step 3: Access Admin Login
Open your browser and go to:
```
http://localhost:5173/admin/login
```

### Step 4: Enter Credentials
- Use one of the credentials above
- Click "Sign In"
- You'll be redirected to the admin dashboard

## 🔍 Troubleshooting

### Issue: "Login failed" or "Network error"

**Solution 1: Check Backend Server**
```bash
cd backend
npm start
```
Make sure you see: "🚀 Geethika Digital World API Server"

**Solution 2: Check Backend URL**
Open `client/.env` and verify:
```
VITE_API_URL=http://localhost:5000
```

**Solution 3: Test Backend Directly**
Open browser and go to:
```
http://localhost:5000/health
```
You should see: `{"status":"healthy"}`

### Issue: "Access denied. Admin privileges required"

**Solution: Verify User Role**
```bash
cd backend
node scripts/check-admin-users.js
```
Make sure the user has role `admin` or `super_admin`

### Issue: "Invalid credentials"

**Solution: Reset Password**
```bash
cd backend
node scripts/test-admin-login-direct.js
```
This will reset passwords to default values

### Issue: Blank page after login

**Solution: Clear Browser Cache**
1. Open browser DevTools (F12)
2. Go to Application tab
3. Clear Local Storage
4. Refresh page
5. Try logging in again

### Issue: CORS Error

**Solution: Check CORS Settings**
Backend should allow frontend URL. Check `backend/server.js`:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
];
```

## 🧪 Test Login Manually

### Using cURL
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@geethika.com","password":"SuperAdmin@123"}'
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Super Admin",
    "email": "superadmin@geethika.com",
    "role": "super_admin"
  }
}
```

### Using Browser Console
1. Open http://localhost:5173/admin/login
2. Open DevTools (F12)
3. Go to Console tab
4. Paste this code:
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
.then(data => console.log('Login response:', data))
.catch(err => console.error('Login error:', err));
```

## 📝 Quick Verification Checklist

- [ ] Backend server is running on port 5000
- [ ] Frontend is running on port 5173
- [ ] Can access http://localhost:5000/health
- [ ] Can access http://localhost:5173/admin/login
- [ ] Using correct email and password
- [ ] No CORS errors in browser console
- [ ] Local storage is not full/corrupted

## 🔐 Create New Admin User

If you need to create a new admin user:

```bash
cd backend
node scripts/create-admin.js
```

Follow the prompts to create a new admin or super admin.

## 🛠️ Reset Everything

If nothing works, reset the admin users:

```bash
cd backend

# Check current admins
node scripts/check-admin-users.js

# Reset passwords
node scripts/test-admin-login-direct.js

# Or create fresh admin
node scripts/create-admin.js
```

## 📱 Access Points

### Admin Login Page
```
http://localhost:5173/admin/login
```

### Admin Dashboard (after login)
```
http://localhost:5173/admin/dashboard
```

### API Health Check
```
http://localhost:5000/health
```

### API Login Endpoint
```
POST http://localhost:5000/api/auth/login
```

## 🎯 What Should Happen

1. **Enter credentials** on login page
2. **Click "Sign In"**
3. **Backend validates** email and password
4. **Returns JWT token** and user data
5. **Frontend stores** token in localStorage
6. **Redirects to** /admin/dashboard
7. **Dashboard loads** with admin menu

## 🚨 Common Mistakes

### Wrong URL
❌ `http://localhost:5173/login` (customer login)
✅ `http://localhost:5173/admin/login` (admin login)

### Wrong Credentials
❌ Using customer email/password
✅ Using admin email/password from above

### Backend Not Running
❌ Only frontend is running
✅ Both backend AND frontend must be running

### Wrong Port
❌ Backend on different port
✅ Backend must be on port 5000 (or update .env)

## 💡 Pro Tips

1. **Keep Both Terminals Open**
   - Terminal 1: Backend server
   - Terminal 2: Frontend dev server

2. **Check Console for Errors**
   - Open browser DevTools (F12)
   - Look for red errors
   - Check Network tab for failed requests

3. **Use Correct Login Page**
   - Customer login: `/login`
   - Admin login: `/admin/login`

4. **Clear Cache if Stuck**
   - Clear localStorage
   - Clear cookies
   - Hard refresh (Ctrl+Shift+R)

## 📞 Still Having Issues?

If you're still unable to login:

1. **Check Backend Logs**
   - Look at terminal running backend
   - Check for error messages

2. **Check Browser Console**
   - Open DevTools (F12)
   - Look for JavaScript errors
   - Check Network tab for API calls

3. **Verify Database Connection**
   ```bash
   cd backend
   node scripts/check-admin-users.js
   ```

4. **Test API Directly**
   - Use Postman or cURL
   - Test login endpoint
   - Check response

## ✅ Success Indicators

You'll know login is working when:
- ✅ No errors in browser console
- ✅ Token stored in localStorage
- ✅ Redirected to /admin/dashboard
- ✅ Admin menu visible on left
- ✅ Can see dashboard statistics

## 🎉 You're All Set!

The admin login is now working. Use the credentials above to access the admin panel.

**Default Credentials:**
- Super Admin: `superadmin@geethika.com` / `SuperAdmin@123`
- Regular Admin: `admin@geethikadigitalworld.com` / `Admin@123`

Happy managing! 🚀
