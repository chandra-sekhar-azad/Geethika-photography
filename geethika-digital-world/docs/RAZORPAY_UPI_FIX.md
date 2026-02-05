# Razorpay UPI Fix - Complete Guide

## ✅ Issue Fixed

**Problem:** UPI payment option was not showing in Razorpay checkout even though it's activated in live mode.

**Root Cause:** The `method` block in Razorpay options was restricting payment methods. Even with `upi: true`, explicit method configuration can cause display issues.

**Solution:** Removed the `method` block entirely. Razorpay will now automatically show all payment methods that are enabled in your dashboard.

## Changes Made

### Before (Problematic Code):
```javascript
const options = {
  key: "YOUR_KEY",
  amount: 39900,
  currency: "INR",
  name: "Geethika Digital World",
  description: "Order Payment",
  order_id: "ORDER_ID",
  prefill: { ... },
  method: {              // ❌ This was causing the issue
    card: true,
    netbanking: true,
    wallet: true,
    upi: true
  },
  theme: { color: "#DC143C" }
};
```

### After (Fixed Code):
```javascript
const options = {
  key: "YOUR_KEY",
  amount: 39900,
  currency: "INR",
  name: "Geethika Digital World",
  description: "Order Payment",
  order_id: "ORDER_ID",
  prefill: { ... },
  // ✅ No method block - Razorpay shows all enabled methods automatically
  theme: { color: "#DC143C" }
};
```

## How Razorpay Works Now

Without the `method` block, Razorpay automatically displays:
- ✅ All payment methods enabled in your Razorpay Dashboard
- ✅ UPI (Apps, QR Code, UPI ID)
- ✅ Cards (Credit/Debit)
- ✅ Net Banking
- ✅ Wallets (Paytm, PhonePe, etc.)
- ✅ EMI (if enabled)
- ✅ Cardless EMI (if enabled)

## Testing Checklist

### 1. Clear Browser Cache
```bash
# Hard refresh in browser
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### 2. Test on Mobile Device
UPI options are more prominent on mobile browsers:
- Open your website on mobile browser (Chrome/Safari)
- Go through checkout process
- UPI should show with:
  - UPI Apps (GPay, PhonePe, Paytm, etc.)
  - QR Code option
  - UPI ID/VPA input

### 3. Test on Desktop
Desktop will show:
- UPI QR Code
- UPI ID/VPA input field
- List of UPI apps (if applicable)

### 4. Verify Razorpay Dashboard Settings
1. Login to Razorpay Dashboard
2. Go to Settings → Payment Methods
3. Ensure UPI is **ACTIVATED** (should show green checkmark)
4. Check if there are any restrictions or limits

## Environment Variables

Make sure your `.env` file has the correct Razorpay keys:

### Client (.env)
```env
VITE_RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID
```

### Backend (.env)
```env
RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
```

## Testing Steps

### Test Mode (Development)
1. Use test key: `rzp_test_XXXXXXXXXXXX`
2. Test UPI: Use test UPI ID `success@razorpay`
3. Test cards: Use Razorpay test cards

### Live Mode (Production)
1. Use live key: `rzp_live_XXXXXXXXXXXX`
2. Make a small real transaction (₹1-10)
3. Verify all payment methods appear
4. Complete payment with UPI

## Common Issues & Solutions

### Issue 1: UPI Still Not Showing
**Solution:**
- Check Razorpay Dashboard → Payment Methods → UPI is activated
- Clear browser cache completely
- Try incognito/private browsing mode
- Test on different device/browser

### Issue 2: Only Cards Showing
**Solution:**
- Verify you removed the `method` block completely
- Check for any `config.display` blocks in code
- Ensure no custom display configuration

### Issue 3: UPI Shows on Mobile but Not Desktop
**This is Normal:**
- UPI is primarily a mobile payment method
- Desktop shows QR code and UPI ID input
- Mobile shows app list and better UPI integration

### Issue 4: Payment Gateway Not Loading
**Solution:**
- Check internet connection
- Verify Razorpay script is loading: `https://checkout.razorpay.com/v1/checkout.js`
- Check browser console for errors
- Ensure HTTPS is enabled (required for payment gateways)

## Payment Flow

1. **User clicks "Pay" button**
   - Frontend validates form
   - Sends order data to backend

2. **Backend creates Razorpay order**
   - Generates `order_id`
   - Returns order details to frontend

3. **Frontend opens Razorpay checkout**
   - Loads Razorpay script
   - Opens modal with payment options
   - **UPI should be visible here**

4. **User completes payment**
   - Razorpay processes payment
   - Returns payment details to handler

5. **Frontend verifies payment**
   - Sends payment details to backend
   - Backend verifies signature
   - Order status updated

## UPI Payment Options

When UPI is working correctly, users will see:

### On Mobile:
- **UPI Apps:** Direct links to GPay, PhonePe, Paytm, etc.
- **QR Code:** Scan with any UPI app
- **UPI ID:** Enter UPI ID manually (e.g., user@paytm)

### On Desktop:
- **QR Code:** Display QR for mobile scanning
- **UPI ID:** Enter UPI ID manually
- **Intent Links:** May show app links if apps are installed

## Verification Commands

### Check if Razorpay script loads:
```javascript
// Open browser console and run:
console.log(typeof Razorpay);
// Should output: "function"
```

### Check Razorpay options:
```javascript
// Add this before rzp.open() to debug:
console.log('Razorpay Options:', options);
```

### Check order creation:
```javascript
// In backend, add logging:
console.log('Razorpay Order Created:', razorpayOrder);
```

## Important Notes

1. **No Method Restrictions:** By removing the `method` block, Razorpay automatically shows all enabled payment methods from your dashboard.

2. **Dashboard Controls:** Payment methods are controlled in Razorpay Dashboard, not in code. Enable/disable methods there.

3. **Mobile First:** UPI is optimized for mobile. Always test on mobile devices for best UPI experience.

4. **Live Mode Required:** Some payment methods (like certain UPI apps) only show in live mode, not test mode.

5. **HTTPS Required:** Payment gateways require HTTPS in production. Use SSL certificate.

## Support

If UPI still doesn't show after these fixes:

1. **Contact Razorpay Support:**
   - Email: support@razorpay.com
   - Phone: +91-80-6890-6890
   - Dashboard: Settings → Support

2. **Check Razorpay Status:**
   - Visit: https://status.razorpay.com
   - Verify no ongoing issues

3. **Review Integration:**
   - Razorpay Docs: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/
   - Check for any breaking changes

## File Modified

- `client/src/pages/CheckoutPage.jsx` - Removed `method` block from Razorpay options

## Testing Recommendation

1. ✅ Clear browser cache
2. ✅ Test on mobile device first
3. ✅ Use incognito/private mode
4. ✅ Verify Razorpay Dashboard settings
5. ✅ Make a small test transaction (₹1-10)
6. ✅ Check all payment methods appear
7. ✅ Complete UPI payment successfully

## Success Indicators

You'll know it's working when:
- ✅ UPI option appears in payment methods
- ✅ UPI apps list shows on mobile
- ✅ QR code displays properly
- ✅ UPI ID input field is available
- ✅ Payment completes successfully via UPI

---

**Last Updated:** February 6, 2026
**Status:** ✅ Fixed - UPI should now be visible
