# Admin Authentication Troubleshooting Guide

## Issue: 401 Unauthorized when editing/deleting products

The backend authentication is working correctly (verified by test script). The issue is likely on the frontend.

## Quick Diagnosis

Open your browser's DevTools (F12) and run these commands in the Console:

### 1. Check if token exists:
```javascript
console.log('Token:', localStorage.getItem('token'));
```

### 2. Check if user is stored:
```javascript
console.log('User:', localStorage.getItem('user'));
```

### 3. Check user role:
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('Role:', user?.role);
```

## Common Issues & Solutions

### Issue 1: Token is null or undefined
**Symptom:** `localStorage.getItem('token')` returns `null`

**Solution:** You need to log in again
1. Go to `/admin/login`
2. Login with credentials:
   - Email: `admin@geethikadigitalworld.com`
   - Password: `Admin@123`

### Issue 2: Token exists but user role is not 'admin'
**Symptom:** Token exists but role is 'user' instead of 'admin'

**Solution:** You're logged in as a regular user, not admin
1. Logout from current account
2. Go to `/admin/login` (not the regular login)
3. Login with admin credentials

### Issue 3: Token has expired
**Symptom:** Token exists but API returns 401

**Solution:** Token has expired, login again
1. Clear localStorage: `localStorage.clear()`
2. Go to `/admin/login`
3. Login with admin credentials

### Issue 4: Wrong admin login page
**Symptom:** Using regular login instead of admin login

**Solution:** Make sure you're using the correct login page
- ❌ Wrong: `http://localhost:5174/login` (regular user login)
- ✅ Correct: `http://localhost:5174/admin/login` (admin login)

## Step-by-Step Fix

1. **Open Browser DevTools** (Press F12)

2. **Go to Console tab**

3. **Clear all localStorage:**
   ```javascript
   localStorage.clear();
   ```

4. **Navigate to admin login:**
   ```
   http://localhost:5174/admin/login
   ```

5. **Login with admin credentials:**
   - Email: `admin@geethikadigitalworld.com`
   - Password: `Admin@123`

6. **Verify login was successful:**
   ```javascript
   console.log('Token:', localStorage.getItem('token'));
   console.log('User:', JSON.parse(localStorage.getItem('user')));
   ```

   You should see:
   - Token: A long string starting with "eyJ..."
   - User: Object with `role: "admin"`

7. **Try editing a product again**

## Verify Backend is Working

Run this test script to verify backend authentication:

```bash
cd geethika-digital-world/backend
node scripts/test-admin-login.js
```

Expected output:
```
✅ Login successful!
✅ Found X products
✅ Product update successful!
✅ All tests passed!
```

## Admin Credentials

**Email:** `admin@geethikadigitalworld.com`  
**Password:** `Admin@123`

These are configured in `backend/.env`:
```env
ADMIN_EMAIL=admin@geethikadigitalworld.com
ADMIN_PASSWORD=Admin@123
```

## Check if Admin User Exists in Database

Run this script to verify admin user exists:

```bash
cd geethika-digital-world/backend
node scripts/check-user.js
```

If admin doesn't exist, create it:

```bash
node scripts/create-admin.js
```

## Network Request Debugging

When you try to edit a product, check the Network tab in DevTools:

1. Open DevTools (F12)
2. Go to Network tab
3. Try to edit a product
4. Look for the PUT request to `/api/products/:id`
5. Check the request headers:
   - Should have: `Authorization: Bearer eyJ...`
   - If missing, the token isn't being sent

## Common Mistakes

1. **Using regular login instead of admin login**
   - Regular users can't edit products
   - Must use `/admin/login` page

2. **Token not stored after login**
   - Check if AdminLogin.jsx is saving token
   - Should call: `localStorage.setItem('token', data.token)`

3. **Browser cache issues**
   - Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear browser cache completely

4. **Multiple browser tabs**
   - If you logged out in one tab, other tabs still think you're logged in
   - Close all tabs and open a fresh one

## Still Not Working?

If you've tried everything above and it's still not working:

1. **Check browser console for errors**
   - Look for red error messages
   - Share the error message for further help

2. **Check backend logs**
   - Look at the terminal where backend is running
   - Should show incoming requests and any errors

3. **Verify backend is running**
   - Backend should be running on port 5000
   - Test: Open `http://localhost:5000/health` in browser
   - Should show: `{"status":"healthy",...}`

4. **Check CORS settings**
   - Backend should allow requests from `http://localhost:5174`
   - Check `backend/server.js` CORS configuration
