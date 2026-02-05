# Razorpay Payment Methods Configuration

## ✅ UPI Payment Enabled

The checkout page now includes all payment methods including UPI.

## Configuration

### Current Setup (CheckoutPage.jsx)

```javascript
const options = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  amount: getCartTotal() * 100,
  currency: 'INR',
  name: 'Geethika Digital World',
  description: 'Order Payment',
  order_id: data.razorpay_order_id,
  handler: function (response) {
    // Payment success handler
  },
  prefill: {
    name: shippingInfo.name,
    email: shippingInfo.email,
    contact: shippingInfo.phone
  },
  method: {
    card: true,        // Credit/Debit Cards
    netbanking: true,  // Net Banking
    wallet: true,      // Wallets (Paytm, PhonePe, etc.)
    upi: true          // UPI (Google Pay, PhonePe, Paytm UPI, etc.)
  },
  theme: {
    color: '#DC143C'
  }
};
```

## Available Payment Methods

With the current configuration, customers can pay using:

1. **💳 Credit/Debit Cards**
   - Visa
   - Mastercard
   - RuPay
   - American Express

2. **📱 UPI**
   - Google Pay
   - PhonePe
   - Paytm UPI
   - BHIM
   - Any UPI app

3. **🏦 Net Banking**
   - All major banks
   - SBI, HDFC, ICICI, Axis, etc.

4. **👛 Wallets**
   - Paytm
   - PhonePe
   - Amazon Pay
   - Mobikwik
   - Freecharge

## Important Notes

### ⚠️ DO NOT Restrict Payment Methods

**WRONG ❌:**
```javascript
method: {
  card: true  // This will ONLY show cards
}
```

**CORRECT ✅:**
```javascript
method: {
  card: true,
  netbanking: true,
  wallet: true,
  upi: true  // All methods enabled
}
```

### Alternative: No Method Restriction

You can also omit the `method` property entirely to show all available payment methods:

```javascript
const options = {
  key: "YOUR_KEY_ID",
  amount: 39900,
  currency: "INR",
  name: "Geethika Digital World",
  description: "Order Payment",
  // No method property = all methods enabled
  theme: {
    color: "#DC143C"
  }
};
```

## Testing UPI Payments

### Test Mode (Development)

When using Razorpay test keys:
- Use test UPI ID: `success@razorpay`
- This will simulate a successful payment
- No real money is charged

### Live Mode (Production)

When using live Razorpay keys:
- Real UPI payments will be processed
- Customers can use their actual UPI apps
- Real money will be transferred

## Environment Variables

Make sure your `.env` file has the correct Razorpay keys:

```env
# Development (Test Keys)
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx

# Production (Live Keys)
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
```

## Verification

To verify UPI is enabled:

1. Go to checkout page
2. Click "Pay" button
3. Razorpay modal should show:
   - Cards tab
   - UPI tab ✅
   - Net Banking tab
   - Wallets tab

## Troubleshooting

### UPI Not Showing?

1. **Check method configuration:**
   - Ensure `upi: true` is in the method object
   - Or remove method object entirely

2. **Check Razorpay account:**
   - Login to Razorpay Dashboard
   - Go to Settings → Payment Methods
   - Ensure UPI is enabled for your account

3. **Check browser console:**
   - Look for any Razorpay errors
   - Verify the options object is correct

### Only Cards Showing?

This happens when you restrict methods:
```javascript
// REMOVE THIS:
method: {
  card: true  // Only cards will show
}

// USE THIS:
method: {
  card: true,
  netbanking: true,
  wallet: true,
  upi: true  // All methods
}
```

## Customer Experience

When a customer clicks "Pay":

1. Razorpay modal opens
2. Shows all payment options (Cards, UPI, Net Banking, Wallets)
3. Customer selects UPI
4. Enters UPI ID or scans QR code
5. Completes payment in their UPI app
6. Returns to website with success message

## Support

For Razorpay-specific issues:
- Documentation: https://razorpay.com/docs/
- Support: https://razorpay.com/support/

For implementation issues:
- Check browser console for errors
- Verify environment variables
- Test with Razorpay test credentials first
