# How to Enable UPI Payment in Razorpay

## Current Issue
UPI/QR payment method is not showing in the Razorpay checkout modal.

## Root Cause
You are using **live Razorpay keys** (`rzp_live_SCXkFazIA5jEk0`), and UPI payment method needs to be explicitly activated in your Razorpay Dashboard for live mode.

## Solution: Enable UPI in Razorpay Dashboard

### Step 1: Login to Razorpay Dashboard
1. Go to: https://dashboard.razorpay.com/
2. Login with your credentials

### Step 2: Navigate to Payment Methods
1. Click on **Settings** (gear icon) in the left sidebar
2. Select **Payment Methods** or **Configuration** → **Payment Methods**

### Step 3: Enable UPI
1. Find **UPI** in the list of payment methods
2. Toggle it **ON** to enable
3. You may see options like:
   - UPI Intent
   - UPI Collect
   - UPI QR Code
4. Enable all UPI options

### Step 4: Complete KYC (If Required)
For live mode, Razorpay requires:
- Business KYC verification
- Bank account verification
- Business documents

If your KYC is not complete:
1. Go to **Account & Settings** → **KYC Details**
2. Upload required documents:
   - PAN Card
   - Business Registration
   - Bank Account Proof
   - Address Proof

### Step 5: Activate Payment Methods
1. After enabling UPI, click **Save** or **Activate**
2. Wait for Razorpay approval (usually instant for verified accounts)
3. Check activation status in the dashboard

### Step 6: Test the Payment
1. Clear browser cache
2. Try making a test payment
3. UPI should now appear in payment options

## Alternative: Use Test Mode First

If you want to test UPI immediately:

1. **Switch to Test Keys**:
   - Get test keys from Razorpay Dashboard
   - Test keys: `rzp_test_xxxxxxxxxx`
   - Update in `.env` files

2. **Test Mode Benefits**:
   - All payment methods enabled by default
   - No KYC required
   - Instant testing

3. **Update Environment Variables**:
   ```env
   # Backend: geethika-digital-world/backend/.env
   RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY
   RAZORPAY_KEY_SECRET=YOUR_TEST_SECRET
   
   # Frontend: geethika-digital-world/client/.env
   VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY
   ```

## Verification Checklist

- [ ] Logged into Razorpay Dashboard
- [ ] Navigated to Payment Methods settings
- [ ] Enabled UPI payment method
- [ ] Completed KYC (for live mode)
- [ ] Saved and activated changes
- [ ] Cleared browser cache
- [ ] Tested payment flow
- [ ] UPI option visible in checkout

## Common Issues

### Issue 1: UPI Not Showing After Enabling
**Solution**: 
- Clear browser cache and cookies
- Wait 5-10 minutes for changes to propagate
- Check if KYC is approved

### Issue 2: "Payment Method Not Available"
**Solution**:
- Verify business account is activated
- Check if UPI is enabled for your business type
- Contact Razorpay support

### Issue 3: Test Mode Works, Live Mode Doesn't
**Solution**:
- Complete KYC verification
- Activate live mode in dashboard
- Enable payment methods for live mode separately

## Contact Razorpay Support

If issues persist:
- **Email**: support@razorpay.com
- **Phone**: +91-80-6890-6890
- **Dashboard**: Use chat support in dashboard
- **Documentation**: https://razorpay.com/docs/

## Current Configuration

Your current Razorpay setup:
- **Mode**: Live
- **Key ID**: rzp_live_SCXkFazIA5jEk0
- **Backend**: Configured ✓
- **Frontend**: Configured ✓
- **UPI Status**: Needs activation in dashboard

## Next Steps

1. **Immediate**: Login to Razorpay Dashboard and enable UPI
2. **Short-term**: Complete KYC if not done
3. **Long-term**: Monitor payment success rates and optimize

---

**Note**: This is a Razorpay account configuration issue, not a code issue. The code is correctly configured to support UPI payments.
