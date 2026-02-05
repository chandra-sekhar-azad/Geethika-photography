# Deployment Preparation - Fix Hardcoded URLs

## ⚠️ Critical: Replace Hardcoded URLs Before Deployment

Your code currently has **hardcoded `http://localhost:5000`** URLs in multiple files. These need to be replaced with the `API_BASE_URL` from the utility file for deployment to work.

## Quick Fix Solution

### Step 1: Import API_BASE_URL

Add this import at the top of each file that makes API calls:

```javascript
import { API_BASE_URL } from '../utils/api';
// or adjust path based on file location
```

### Step 2: Replace All localhost URLs

Replace all instances of:
```javascript
'http://localhost:5000/api/...'
```

With:
```javascript
`${API_BASE_URL}/api/...`
```

---

## Files That Need Updates

### 🔴 Priority 1: Core Functionality

#### 1. `client/src/pages/CheckoutPage.jsx`
**Lines to fix:**
```javascript
// Line 79 - Change:
const response = await fetch('http://localhost:5000/api/orders', {

// To:
const response = await fetch(`${API_BASE_URL}/api/orders`, {

// Line 114 - Change:
await fetch(`http://localhost:5000/api/orders/${data.order.id}/payment`, {

// To:
await fetch(`${API_BASE_URL}/api/orders/${data.order.id}/payment`, {
```

**Add import:**
```javascript
import { API_BASE_URL } from '../utils/api';
```

#### 2. `client/src/pages/LoginPage.jsx`
```javascript
// Line 93 - Change:
const response = await fetch('http://localhost:5000/api/auth/login', {

// To:
const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
```

**Add import:**
```javascript
import { API_BASE_URL } from '../utils/api';
```

#### 3. `client/src/pages/ShopPage.jsx`
```javascript
// Line 27 - Change:
let url = 'http://localhost:5000/api/products?';

// To:
let url = `${API_BASE_URL}/api/products?`;
```

**Add import:**
```javascript
import { API_BASE_URL } from '../utils/api';
```

#### 4. `client/src/pages/ProductDetailPage.jsx`
```javascript
// Line 30 - Change:
const response = await fetch(`http://localhost:5000/api/products/${id}`);

// To:
const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
```

**Add import:**
```javascript
import { API_BASE_URL } from '../utils/api';
```

---

### 🟡 Priority 2: User Features

#### 5. `client/src/pages/MyOrdersPage.jsx`
```javascript
// Line 25 - Change:
const response = await fetch('http://localhost:5000/api/orders/my-orders', {

// To:
const response = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
```

**Add import:**
```javascript
import { API_BASE_URL } from '../../utils/api';
```

#### 6. `client/src/pages/OrderDetailPage.jsx`
```javascript
// Line 25 - Change:
const response = await fetch(`http://localhost:5000/api/orders/${id}`, {

// To:
const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
```

**Add import:**
```javascript
import { API_BASE_URL } from '../../utils/api';
```

#### 7. `client/src/pages/ProfilePage.jsx`
```javascript
// Line 55 - Change:
const response = await fetch('http://localhost:5000/api/auth/profile', {

// To:
const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {

// Line 105 - Change:
const response = await fetch('http://localhost:5000/api/auth/change-password', {

// To:
const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
```

**Add import:**
```javascript
import { API_BASE_URL } from '../utils/api';
```

#### 8. `client/src/pages/ForgotPasswordPage.jsx`
```javascript
// Line 28 - Change:
const response = await fetch('http://localhost:5000/api/auth/forgot-password', {

// To:
const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {

// Line 89 - Change:
const response = await fetch('http://localhost:5000/api/auth/reset-password', {

// To:
const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
```

**Add import:**
```javascript
import { API_BASE_URL } from '../utils/api';
```

#### 9. `client/src/pages/ResetPasswordPage.jsx`
```javascript
// Line 47 - Change:
const response = await fetch('http://localhost:5000/api/auth/reset-password', {

// To:
const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
```

**Add import:**
```javascript
import { API_BASE_URL } from '../utils/api';
```

#### 10. `client/src/pages/ServicesPage.jsx`
```javascript
// Line 24 - Change:
const response = await fetch('http://localhost:5000/api/services');

// To:
const response = await fetch(`${API_BASE_URL}/api/services`);
```

**Add import:**
```javascript
import { API_BASE_URL } from '../utils/api';
```

---

### 🟢 Priority 3: Admin Panel

#### 11. `client/src/pages/admin/AdminLogin.jsx`
```javascript
// Line 20 - Change:
const response = await fetch('http://localhost:5000/api/auth/login', {

// To:
const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
```

**Add import:**
```javascript
import { API_BASE_URL } from '../../utils/api';
```

#### 12. `client/src/pages/admin/ProductManagement.jsx`
```javascript
// Line 47 - Change:
const response = await fetch('http://localhost:5000/api/products');

// To:
const response = await fetch(`${API_BASE_URL}/api/products`);

// Line 59 - Change:
const response = await fetch('http://localhost:5000/api/categories');

// To:
const response = await fetch(`${API_BASE_URL}/api/categories`);

// Line 101-102 - Change:
const url = editingProduct
  ? `http://localhost:5000/api/products/${editingProduct.id}`
  : 'http://localhost:5000/api/products';

// To:
const url = editingProduct
  ? `${API_BASE_URL}/api/products/${editingProduct.id}`
  : `${API_BASE_URL}/api/products`;

// Line 171 - Change:
const response = await fetch(`http://localhost:5000/api/products/${id}`, {

// To:
const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
```

**Add import:**
```javascript
import { API_BASE_URL } from '../../utils/api';
```

#### 13. `client/src/pages/admin/ServiceManagement.jsx`
```javascript
// Line 28 - Change:
const response = await fetch('http://localhost:5000/api/services');

// To:
const response = await fetch(`${API_BASE_URL}/api/services`);

// Line 72-73 - Change:
const url = editingService
  ? `http://localhost:5000/api/services/${editingService.id}`
  : 'http://localhost:5000/api/services';

// To:
const url = editingService
  ? `${API_BASE_URL}/api/services/${editingService.id}`
  : `${API_BASE_URL}/api/services`;

// Line 97 - Change:
const response = await fetch(`http://localhost:5000/api/services/${id}`, {

// To:
const response = await fetch(`${API_BASE_URL}/api/services/${id}`, {
```

**Add import:**
```javascript
import { API_BASE_URL } from '../../utils/api';
```

#### 14. `client/src/pages/admin/OrderManagement.jsx`
```javascript
// Line 19 - Change:
const response = await fetch('http://localhost:5000/api/orders', {

// To:
const response = await fetch(`${API_BASE_URL}/api/orders`, {

// Line 34 - Change:
const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {

// To:
const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {

// Line 60 - Change:
const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);

// To:
const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);

// Line 320 - Change:
const response = await fetch('http://localhost:5000/api/orders', {

// To:
const response = await fetch(`${API_BASE_URL}/api/orders`, {
```

**Add import:**
```javascript
import { API_BASE_URL } from '../../utils/api';
```

#### 15. `client/src/pages/admin/CustomerDatabase.jsx`
```javascript
// Line 21 - Change:
const response = await fetch(`http://localhost:5000/api/admin/customers?${params}`, {

// To:
const response = await fetch(`${API_BASE_URL}/api/admin/customers?${params}`, {
```

**Add import:**
```javascript
import { API_BASE_URL } from '../../utils/api';
```

#### 16. `client/src/pages/admin/SalesReport.jsx`
```javascript
// Line 25 - Change:
const response = await fetch(`http://localhost:5000/api/admin/sales-report?${params}`, {

// To:
const response = await fetch(`${API_BASE_URL}/api/admin/sales-report?${params}`, {
```

**Add import:**
```javascript
import { API_BASE_URL } from '../../utils/api';
```

---

### 🔵 Priority 4: Components

#### 17. `client/src/components/TrendingSection.jsx`
```javascript
// Line 17 - Change:
const response = await fetch('http://localhost:5000/api/products?valentine=true&limit=6');

// To:
const response = await fetch(`${API_BASE_URL}/api/products?valentine=true&limit=6`);

// Line 22 - Change:
const fallbackResponse = await fetch('http://localhost:5000/api/products?limit=6');

// To:
const fallbackResponse = await fetch(`${API_BASE_URL}/api/products?limit=6`);
```

**Add import:**
```javascript
import { API_BASE_URL } from '../utils/api';
```

---

## Automated Fix Script

Create a script to help with the replacement:

```bash
# Create fix-urls.sh
#!/bin/bash

# Find and replace in all JSX files
find client/src -name "*.jsx" -type f -exec sed -i "s|'http://localhost:5000|\`\${API_BASE_URL}|g" {} +
find client/src -name "*.jsx" -type f -exec sed -i "s|\"http://localhost:5000|\`\${API_BASE_URL}|g" {} +

echo "URLs replaced! Don't forget to add imports."
```

---

## Environment Variables Setup

### Development (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
```

### Production (.env.production)
```env
VITE_API_URL=https://api.yourdomain.com
VITE_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
```

### Or set in deployment platform:

**Vercel:**
- Go to Project Settings → Environment Variables
- Add `VITE_API_URL` with your backend URL

**Netlify:**
- Go to Site Settings → Build & Deploy → Environment
- Add `VITE_API_URL` with your backend URL

**Railway:**
- Go to Variables tab
- Add `VITE_API_URL` with your backend URL

---

## Testing After Changes

### 1. Test Locally:
```bash
cd client
npm run dev
```

Visit: `http://localhost:5173`
- Test login
- Test shop
- Test checkout
- Test admin panel at `/admin/login`

### 2. Test with Production API:
```bash
# Temporarily set production API
export VITE_API_URL=https://your-backend.com
npm run dev
```

### 3. Build and Test:
```bash
npm run build
npm run preview
```

---

## Verification Checklist

After making changes, verify:

- [ ] All imports added correctly
- [ ] All localhost URLs replaced
- [ ] No syntax errors (check with `npm run build`)
- [ ] Environment variables set
- [ ] Test login works
- [ ] Test shop page loads products
- [ ] Test checkout process
- [ ] Test admin login at `/admin/login`
- [ ] Test admin features
- [ ] Test on mobile device
- [ ] Test payment gateway

---

## Admin Access After Deployment

### Development:
```
http://localhost:5173/admin/login
```

### Production:
```
https://yourdomain.com/admin/login
```

**The route stays the same!** Only the domain changes.

### Admin Credentials:
- Email: admin@geethikadigitalworld.com (or your admin email)
- Password: (set during admin creation)

### Create Admin on Production:
```bash
# SSH into your server or use database client
cd backend
node scripts/create-admin.js
```

---

## Quick Reference

### Import Statement:
```javascript
import { API_BASE_URL } from '../utils/api';
// Adjust ../ based on file location
```

### Usage:
```javascript
// Before:
fetch('http://localhost:5000/api/products')

// After:
fetch(`${API_BASE_URL}/api/products`)
```

### Path Adjustments:
- From `pages/`: `'../utils/api'`
- From `pages/admin/`: `'../../utils/api'`
- From `components/`: `'../utils/api'`

---

## Common Mistakes to Avoid

1. ❌ Forgetting to add import
2. ❌ Wrong import path (../ vs ../../)
3. ❌ Using single quotes instead of backticks
4. ❌ Not setting environment variables
5. ❌ Testing without rebuilding

---

## Need Help?

If you encounter issues:

1. Check browser console for errors
2. Verify environment variables are set
3. Check network tab in DevTools
4. Ensure backend is running
5. Verify CORS settings in backend

---

**Status:** ⚠️ Action Required
**Priority:** 🔴 Critical for Deployment
**Estimated Time:** 30-45 minutes

Make these changes before deploying to production!
