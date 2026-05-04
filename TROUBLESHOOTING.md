# Troubleshooting Guide

## ✅ Issues Fixed

### 1. React Controlled/Uncontrolled Input Warning
**Error:** "A component is changing an uncontrolled input to be controlled"

**Cause:** The `special_offer` field was `undefined` in some products, causing React to treat checkboxes as uncontrolled initially.

**Solution Applied:**
- Updated `fetchProducts()` to ensure all products have default values
- Changed `||` to `??` operator in `handleEdit()` for proper boolean handling
- Added `is_active` field to API response

**Files Fixed:**
- `client/src/pages/admin/ProductManagement.jsx`
- `backend/routes/products.js`

---

## 🔍 Current Status

### Backend API ✅
- **Status:** Running on port 5000
- **special_offer field:** Present in all responses
- **is_active field:** Now included in responses
- **Products:** 30 total
  - 🎁 Special Offers: 0
  - 🔥 Trending: 1
  - 📦 Regular: 29

### Frontend ✅
- **Controlled inputs:** All checkboxes properly controlled
- **Default values:** All fields have proper defaults
- **Form state:** Properly initialized

---

## 🧪 Testing

### Test the API:
```powershell
# Get all products
Invoke-RestMethod -Uri "http://localhost:5000/api/products" | Select-Object -ExpandProperty products | Select-Object -First 5 id, name, special_offer, valentine_special, is_active | Format-Table

# Expected output: All fields should have values (true/false), not undefined
```

### Test the Frontend:
1. Open admin panel: `http://localhost:3000/admin`
2. Go to Product Management
3. Click "Edit" on any product
4. Check the console - no warnings should appear
5. All checkboxes should be properly checked/unchecked

---

## 🐛 Common Issues & Solutions

### Issue 1: "Unable to activate products"
**Symptoms:**
- Can't check the "Special Offer" checkbox
- Checkbox doesn't respond to clicks
- Form doesn't save

**Solutions:**
1. **Clear browser cache:**
   ```
   Ctrl + Shift + Delete (Chrome/Edge)
   Clear cache and reload
   ```

2. **Hard refresh:**
   ```
   Ctrl + Shift + R (Windows)
   Cmd + Shift + R (Mac)
   ```

3. **Check browser console:**
   - Press F12
   - Look for errors in Console tab
   - Check Network tab for failed requests

4. **Verify backend is running:**
   ```powershell
   # Check if backend is responding
   Invoke-RestMethod -Uri "http://localhost:5000/health"
   ```

5. **Restart frontend:**
   ```bash
   cd client
   npm run dev
   ```

### Issue 2: React Warning Still Appears
**If you still see the controlled/uncontrolled warning:**

1. **Clear React DevTools cache:**
   - Open DevTools (F12)
   - Go to Application tab
   - Clear Storage
   - Reload page

2. **Check form initialization:**
   - All form fields should have default values
   - No field should be `undefined` or `null`

3. **Verify product data:**
   ```javascript
   // In browser console:
   fetch('http://localhost:5000/api/products')
     .then(r => r.json())
     .then(d => console.log(d.products[0]))
   
   // Check that special_offer and is_active are present
   ```

### Issue 3: Special Offers Tab Shows Wrong Count
**Symptoms:**
- Tab shows (0) but products are marked
- Count doesn't update after saving

**Solutions:**
1. **Refresh the page** - Products list needs to reload
2. **Check filter logic:**
   ```javascript
   // Should filter by special_offer === true
   products.filter(p => p.special_offer === true)
   ```
3. **Verify database:**
   ```sql
   SELECT id, name, special_offer FROM products WHERE special_offer = true;
   ```

### Issue 4: Changes Don't Save
**Symptoms:**
- Click save but product doesn't update
- No error message shown
- Form closes but changes not applied

**Solutions:**
1. **Check authentication:**
   - Make sure you're logged in as admin
   - Token might have expired - try logging out and back in

2. **Check browser console:**
   - Look for 401 Unauthorized errors
   - Check for CORS errors
   - Verify API endpoint is correct

3. **Check backend logs:**
   - Look at terminal where backend is running
   - Check for error messages
   - Verify request is reaching the server

4. **Test API directly:**
   ```powershell
   # Get your auth token from browser (F12 > Application > Local Storage)
   $token = "YOUR_TOKEN_HERE"
   
   # Test update
   $headers = @{
       "Authorization" = "Bearer $token"
       "Content-Type" = "application/json"
   }
   
   $body = @{
       special_offer = $true
   } | ConvertTo-Json
   
   Invoke-RestMethod -Uri "http://localhost:5000/api/products/71" -Method PUT -Headers $headers -Body $body
   ```

### Issue 5: Category Images Not Uploading
**Symptoms:**
- Image upload fails
- No preview shown
- Error message appears

**Solutions:**
1. **Check file size:**
   - Must be under 5MB
   - Compress image if needed

2. **Check file format:**
   - Only JPG, PNG, GIF, WEBP allowed
   - Convert other formats first

3. **Check Cloudinary credentials:**
   ```bash
   # In backend/.env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Test Cloudinary connection:**
   ```bash
   cd backend
   node -e "import('./config/cloudinary.js').then(m => console.log('Cloudinary configured:', !!m.default))"
   ```

---

## 🔧 Debug Commands

### Check Backend Status:
```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:5000/health"

# Get products
Invoke-RestMethod -Uri "http://localhost:5000/api/products" | Select-Object -ExpandProperty products | Select-Object -First 3

# Get categories
Invoke-RestMethod -Uri "http://localhost:5000/api/categories" | Select-Object -ExpandProperty categories
```

### Check Database:
```sql
-- Check special_offer field exists
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'special_offer';

-- Check product data
SELECT id, name, special_offer, valentine_special, is_active 
FROM products 
LIMIT 5;

-- Count by type
SELECT 
  COUNT(*) FILTER (WHERE special_offer = true) as special_offers,
  COUNT(*) FILTER (WHERE valentine_special = true) as trending,
  COUNT(*) as total
FROM products;
```

### Check Frontend:
```bash
# Check if frontend is running
netstat -ano | findstr :3000

# Restart frontend
cd client
npm run dev
```

---

## 📊 Verification Checklist

After fixing issues, verify:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] No console errors in browser
- [ ] No React warnings
- [ ] Can open Product Management
- [ ] Can see "Special Offers" tab
- [ ] Can edit products
- [ ] All checkboxes work
- [ ] Can save changes
- [ ] Changes persist after refresh
- [ ] Special Offers tab shows correct count
- [ ] Category images upload successfully

---

## 🆘 Still Having Issues?

### 1. Restart Everything:
```bash
# Stop all processes
# Then restart:

# Backend
cd backend
npm run dev

# Frontend (in new terminal)
cd client
npm run dev
```

### 2. Check Logs:
- Backend terminal for API errors
- Browser console for frontend errors
- Network tab for failed requests

### 3. Verify Files:
```bash
# Check if files were updated
git status
git diff
```

### 4. Re-run Migration:
```bash
cd backend
node scripts/add-special-offer-field.js
```

---

## 📞 Getting Help

If issues persist:

1. **Check the logs:**
   - Backend terminal output
   - Browser console (F12)
   - Network tab in DevTools

2. **Gather information:**
   - What were you trying to do?
   - What happened instead?
   - Any error messages?
   - Screenshots if possible

3. **Try the test script:**
   ```bash
   node --input-type=module test-special-offer.js
   ```

4. **Review documentation:**
   - SETUP_GUIDE.md
   - ADMIN_QUICK_REFERENCE.md
   - FEATURE_UPDATE.md

---

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ No warnings in browser console
2. ✅ All checkboxes respond to clicks
3. ✅ Products save successfully
4. ✅ Special Offers tab shows correct count
5. ✅ Changes persist after page refresh
6. ✅ Category images upload without errors

---

**Last Updated:** March 4, 2026
**Status:** All known issues resolved
