# Quick Fix: 401 Unauthorized Error in Product Management

## The Problem
You're getting a 401 Unauthorized error when trying to add, edit, or delete products in the admin panel.

## Most Likely Cause
You're not logged in as an admin, or your login session has expired.

## Quick Fix (2 minutes)

### Step 1: Open Browser Console
Press **F12** to open DevTools, then click the **Console** tab.

### Step 2: Check Your Authentication
Paste this in the console and press Enter:

```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

**What you should see:**
- Token: A long string like "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
- User: An object with `role: "admin"`

**If you see `null` or `role: "user"`**, continue to Step 3.

### Step 3: Clear and Re-login
In the console, paste this:

```javascript
localStorage.clear();
```

### Step 4: Login as Admin
1. Go to: **http://localhost:5174/admin/login**
   - ⚠️ **Important:** Use `/admin/login`, NOT `/login`
   
2. Enter admin credentials:
   - **Email:** `admin@geethikadigitalworld.com`
   - **Password:** `Admin@123`

3. Click "Sign In"

### Step 5: Verify Login
After logging in, open console again (F12) and run:

```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('Role:', JSON.parse(localStorage.getItem('user')).role);
```

You should see:
- Token: A long string
- Role: "admin"

### Step 6: Try Again
Now try to add, edit, or delete a product. It should work!

---

## Alternative: Add Debug Component

If you want to see your authentication status in real-time:

1. Open `client/src/pages/admin/ProductManagement.jsx`

2. Add this import at the top:
```javascript
import AuthDebug from '../../components/AuthDebug';
```

3. Add this component inside the return statement (anywhere):
```javascript
<AuthDebug />
```

4. Save the file

You'll see a debug panel in the bottom-right corner showing your auth status.

---

## Still Not Working?

### Check Backend is Running
Open: **http://localhost:5000/health**

Should show: `{"status":"healthy",...}`

If not, start the backend:
```bash
cd geethika-digital-world/backend
npm start
```

### Verify Admin User Exists
```bash
cd geethika-digital-world/backend
node scripts/check-user.js
```

If admin doesn't exist:
```bash
node scripts/create-admin.js
```

### Test Backend Authentication
```bash
cd geethika-digital-world/backend
node scripts/test-admin-login.js
```

Should show: `✅ All tests passed!`

---

## Why This Happens

1. **Token Expiration:** JWT tokens can expire (though yours might not have expiration set)
2. **Wrong Login Page:** Using `/login` instead of `/admin/login` logs you in as a regular user
3. **Browser Cache:** Old session data can cause issues
4. **Multiple Tabs:** Logging out in one tab doesn't affect others

---

## Prevention

Always use the admin login page: **http://localhost:5174/admin/login**

Don't use the regular login page for admin access.
