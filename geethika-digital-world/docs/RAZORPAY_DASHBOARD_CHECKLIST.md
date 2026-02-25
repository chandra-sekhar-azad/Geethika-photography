# Razorpay Dashboard - UPI Activation Checklist

## Step-by-Step Verification

### 1. Verify You're in LIVE Mode
- [ ] Top-right corner of dashboard shows "LIVE" (not "TEST")
- [ ] Toggle is set to LIVE mode

### 2. Check Payment Methods Settings
Go to: **Settings** → **Payment Methods** (or **Configuration** → **Payment Methods**)

- [ ] Find "UPI" in the list (separate from UPI Autopay)
- [ ] UPI toggle is ON (green)
- [ ] Click on UPI to see detailed settings

### 3. UPI Detailed Settings
When you click on UPI, check:

- [ ] **Status**: Should show "Active" or "Enabled"
- [ ] **UPI Intent**: Enabled
- [ ] **UPI Collect**: Enabled  
- [ ] **UPI QR**: Enabled
- [ ] **Available for**: Standard Checkout (must be checked)
- [ ] **Available for**: Payment Links (optional)
- [ ] **Available for**: Payment Pages (optional)

### 4. Check Activation Status
Go to: **Account & Settings** → **Activation Status**

- [ ] Account Status: "Activated" (green checkmark)
- [ ] KYC Status: "Verified" or "Approved"
- [ ] Bank Account: "Verified"
- [ ] Live Mode: "Enabled"

### 5. Check Business Details
Go to: **Account & Settings** → **Business Details**

- [ ] Business Type: (check what's listed)
- [ ] Business Category: (check what's listed)
- [ ] GST Status: (if applicable)

**Note**: Some business categories have UPI restrictions:
- ❌ Gaming/Gambling
- ❌ Cryptocurrency
- ❌ Adult content
- ❌ Tobacco/Alcohol
- ✅ E-commerce (should be fine)
- ✅ Photography/Printing (should be fine)

### 6. Check Payment Gateway Settings
Go to: **Settings** → **Payment Gateway**

- [ ] Payment Gateway: "Enabled"
- [ ] Checkout Type: "Standard" or "Custom"
- [ ] Payment Methods: "All" or "Custom" (if custom, UPI must be selected)

### 7. Check for Pending Actions
Look for any notifications or pending actions:

- [ ] No pending KYC documents
- [ ] No pending verifications
- [ ] No account restrictions
- [ ] No compliance issues

### 8. UPI Specific Checks

#### In UPI/QR Settings Page:
- [ ] UPI Payment Methods section exists
- [ ] Shows list of UPI apps (Google Pay, PhonePe, etc.)
- [ ] No error messages or warnings
- [ ] "Save" button clicked after any changes

#### Check UPI Providers:
- [ ] Google Pay: Enabled
- [ ] PhonePe: Enabled
- [ ] Paytm: Enabled
- [ ] BHIM: Enabled
- [ ] Other UPI apps: Enabled

### 9. Check Transaction Limits
Go to: **Settings** → **Transaction Limits**

- [ ] UPI minimum amount: (check value)
- [ ] UPI maximum amount: (check value)
- [ ] No unusual restrictions

### 10. Check API Settings
Go to: **Settings** → **API Keys**

- [ ] Live API keys are generated
- [ ] Keys are not expired
- [ ] Keys have proper permissions

## Common Issues & Solutions

### Issue: UPI shows "Pending Activation"
**Solution**: 
- Complete KYC verification
- Wait 24-48 hours for approval
- Contact support if delayed

### Issue: UPI shows "Restricted"
**Solution**:
- Check business category
- Contact support to request UPI enablement
- May need additional documentation

### Issue: UPI shows "Activated" but not in checkout
**Solution**:
- This is YOUR current issue
- Means backend activation is incomplete
- **MUST contact Razorpay support**

### Issue: "UPI not available for your business type"
**Solution**:
- Request exception from Razorpay
- Provide business documentation
- May need to change business category

## What to Screenshot for Support

Take screenshots of:
1. **Dashboard showing UPI ACTIVATED**
   - Settings → Payment Methods → UPI section
   
2. **Checkout modal WITHOUT UPI**
   - Your website checkout page
   - Razorpay payment modal
   
3. **Account Activation Status**
   - Account & Settings → Activation Status
   
4. **Business Details**
   - Account & Settings → Business Details

## Next Steps

If ALL items above are checked and UPI still doesn't show:

1. ✅ **Email Razorpay Support** (use template in RAZORPAY_SUPPORT_EMAIL.txt)
2. ✅ **Call Razorpay**: +91-80-6890-6890
3. ✅ **Use Dashboard Chat**: Click support icon in dashboard
4. ✅ **Twitter**: Tweet @Razorpay for faster response

## Expected Response Time

- Email: 24-48 hours
- Phone: Immediate
- Chat: 5-30 minutes
- Twitter: 1-4 hours

## Temporary Workaround

While waiting for Razorpay to fix UPI:

1. **Promote other payment methods**:
   - Cards (working)
   - Netbanking (working)
   - Wallets (working)

2. **Add manual UPI option**:
   - Display your UPI ID on checkout page
   - Let customers pay manually
   - Verify payment and confirm order

3. **Use WhatsApp for UPI**:
   - Customer contacts via WhatsApp
   - You send UPI payment link
   - Confirm order after payment

## Important Note

This is **NOT a code issue**. Your integration is correct. This is a **Razorpay account configuration/permission issue** that only Razorpay support can resolve.

The fact that UPI shows as "ACTIVATED" in dashboard but doesn't appear in checkout indicates:
- Backend activation is incomplete
- Account needs additional verification
- Business category restriction
- Technical issue on Razorpay's end

**Action Required**: Contact Razorpay Support immediately.
