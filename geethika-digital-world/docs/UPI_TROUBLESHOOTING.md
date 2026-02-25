# UPI Payment Not Showing - Troubleshooting Guide

## Current Status
- ✅ UPI is ACTIVATED in Razorpay Dashboard
- ✅ UPI Autopay is ACTIVATED
- ❌ UPI option not visible in payment modal
- ✅ Cards, Netbanking, Wallet options are showing

## Possible Causes & Solutions

### 1. UPI vs UPI Autopay Confusion
**Issue**: You have "UPI Autopay" activated, but regular "UPI" might need separate activation.

**Solution**:
1. In Razorpay Dashboard, go to **Account & Settings** → **UPI/QR**
2. Check if there's a separate toggle for:
   - **UPI** (for one-time payments)
   - **UPI Autopay** (for recurring payments)
3. Make sure **UPI** (not just UPI Autopay) is enabled

### 2. Minimum Amount Restriction
**Issue**: UPI has minimum transaction limits.

**Current Test Amount**: ₹1

**Solution**:
- Try with amount ≥ ₹10
- Some UPI providers have minimum limits
- Test with ₹100 to rule out amount issues

### 3. Business Category Restriction
**Issue**: Some business categories have UPI restrictions.

**Check**:
1. Go to Razorpay Dashboard → **Account & Settings**
2. Check your **Business Category**
3. Some categories (gaming, crypto, etc.) may have UPI disabled

**Solution**:
- Contact Razorpay support if your category restricts UPI
- Request UPI enablement for your business type

### 4. KYC/Activation Status
**Issue**: UPI might show as "ACTIVATED" but pending verification.

**Check**:
1. Dashboard → **Account & Settings** → **Activation Status**
2. Look for any pending verifications
3. Check if "Live Mode" is fully activated

**Solution**:
- Complete any pending KYC steps
- Wait for Razorpay approval (can take 24-48 hours)

### 5. Payment Method Configuration
**Issue**: UPI might be enabled but not configured for Standard Checkout.

**Check**:
1. Dashboard → **Settings** → **Payment Methods**
2. Click on **UPI** (not UPI Autopay)
3. Check if it's enabled for:
   - ✅ Standard Checkout
   - ✅ Payment Links
   - ✅ Payment Pages

**Solution**:
- Enable UPI for all checkout types
- Save and wait 5-10 minutes for changes to propagate

### 6. Browser/Cache Issue
**Issue**: Old Razorpay script cached in browser.

**Solution**:
1. Clear browser cache completely
2. Try in incognito/private mode
3. Try different browser
4. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### 7. Razorpay Account Type
**Issue**: Test vs Live mode confusion.

**Current Setup**: Live keys (`rzp_live_SCXkFazIA5jEk0`)

**Check**:
1. Verify you're checking settings in **Live Mode** (not Test Mode)
2. Toggle between Test/Live in dashboard top-right
3. Ensure UPI is enabled in Live Mode specifically

### 8. UPI Provider Selection
**Issue**: No UPI apps/providers configured.

**Solution**:
1. Dashboard → **UPI/QR** settings
2. Check which UPI providers are enabled:
   - Google Pay
   - PhonePe
   - Paytm
   - BHIM
   - Other UPI apps
3. Enable all major providers

### 9. Hidden in UI
**Issue**: UPI might be there but in unexpected location.

**Where to Look**:
- Click "All payment methods" at top
- Scroll down in the payment modal
- Check under "More payment options"
- Look in "Wallet" section (sometimes UPI is grouped there)
- Try clicking each category (Cards, Netbanking, Wallet)

## Debugging Steps

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for Razorpay-related logs
4. Check for any errors or warnings
5. Look for payment methods array

### Step 2: Test with Different Amount
```javascript
// Try these amounts:
- ₹10 (minimum for most UPI)
- ₹100 (safe amount)
- ₹500 (higher amount)
```

### Step 3: Contact Razorpay Support
If none of the above works:

**Email**: support@razorpay.com
**Phone**: +91-80-6890-6890
**Dashboard Chat**: Click support icon in dashboard

**What to tell them**:
```
Subject: UPI not showing in checkout despite being activated

Hi Razorpay Team,

UPI is showing as ACTIVATED in my dashboard (Account ID: [your account ID]),
but it's not appearing in the checkout modal for customers.

- Business: Geethika Digital World
- Key ID: rzp_live_SCXkFazIA5jEk0
- Issue: Only Cards, Netbanking, and Wallet options visible
- UPI Status: ACTIVATED (as per dashboard)
- Mode: Live

Please help enable UPI in the checkout flow.

Thanks!
```

## Quick Test Checklist

- [ ] Clear browser cache and try again
- [ ] Test in incognito mode
- [ ] Try amount ≥ ₹100
- [ ] Check "All payment methods" in modal
- [ ] Verify Live Mode is active in dashboard
- [ ] Check UPI (not just UPI Autopay) is enabled
- [ ] Wait 10 minutes after enabling (propagation time)
- [ ] Try different browser
- [ ] Check browser console for errors
- [ ] Contact Razorpay support

## Expected Behavior

When UPI is properly enabled, you should see:
1. **UPI** as a separate payment method category
2. Options like:
   - Pay with UPI ID
   - Scan QR Code
   - Google Pay
   - PhonePe
   - Paytm
   - BHIM
   - Other UPI apps

## Current Code Status

✅ Frontend code is correctly configured
✅ Backend Razorpay integration is correct
✅ No method restrictions in code
✅ All payment methods allowed

**Conclusion**: This is a Razorpay account/dashboard configuration issue, not a code issue.

## Next Steps

1. **Immediate**: Try with amount ≥ ₹100
2. **Short-term**: Contact Razorpay support with above template
3. **Alternative**: Use test keys temporarily to verify UPI works in test mode
