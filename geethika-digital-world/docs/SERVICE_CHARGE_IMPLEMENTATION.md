# Service Charge Implementation

## Overview
Added a ₹2 service charge to all orders in the e-commerce platform.

## Changes Made

### 1. CartContext (`client/src/context/CartContext.jsx`)
- Added `SERVICE_CHARGE` constant = 2
- Added new functions:
  - `getCartSubtotal()` - Returns cart items total without service charge
  - `getServiceCharge()` - Returns ₹2 if cart has items, ₹0 if empty
  - `getFinalTotal()` - Returns subtotal + service charge
- Kept `getCartTotal()` for backward compatibility

### 2. Cart Page (`client/src/pages/CartPage.jsx`)
- Updated Order Summary to show:
  - Subtotal (items total)
  - Service Charge (₹2)
  - Shipping (FREE)
  - Total (subtotal + service charge)

### 3. Checkout Page (`client/src/pages/CheckoutPage.jsx`)
- Updated all calculations to use new functions
- Order summary shows service charge breakdown
- Razorpay payment amount includes service charge
- Backend order creation includes service_charge field

### 4. Backend Orders Route (`backend/routes/orders.js`)
- Added `service_charge` field extraction from request body
- Updated INSERT query to include service_charge column
- Service charge stored in database for each order

### 5. Database Migration (`backend/scripts/add-service-charge-column.js`)
- Created migration script to add `service_charge` column to orders table
- Column type: DECIMAL(10, 2) DEFAULT 0

## Database Migration

**Run this command in production:**
```bash
node backend/scripts/add-service-charge-column.js
```

This will add the `service_charge` column to the `orders` table.

## Order Breakdown

**Example Order:**
- Product 1: ₹100
- Product 2: ₹50
- **Subtotal: ₹150**
- **Service Charge: ₹2**
- **Shipping: FREE**
- **Total: ₹152**

## User Experience

1. **Cart Page**: Users see service charge in order summary
2. **Checkout Page**: Service charge clearly displayed before payment
3. **Payment**: Razorpay charges total including service charge
4. **Order History**: Service charge stored and can be displayed

## Testing Checklist

- [ ] Add items to cart
- [ ] Verify service charge shows in cart summary
- [ ] Proceed to checkout
- [ ] Verify service charge shows in checkout summary
- [ ] Complete payment
- [ ] Verify correct amount charged (subtotal + ₹2)
- [ ] Check order in database has service_charge field
- [ ] Verify order history shows correct total

## Notes

- Service charge is ₹2 for all orders regardless of cart value
- Service charge is 0 if cart is empty
- Service charge is included in Razorpay payment amount
- Service charge is stored in database for record keeping
