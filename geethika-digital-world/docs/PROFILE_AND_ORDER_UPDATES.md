# Profile and Order Updates

## Changes Made

### 1. Order Detail Page Improvements
- **Total Amount Display**: Fixed to show `order.total_amount` or `order.total` with proper fallback
- **Date Format**: Changed to "05-Feb-2026 06:25pm" format (DD-MMM-YYYY HH:MMam/pm)
- **Shipping Address**: Already displays PIN and Phone properly:
  - PIN: {pincode}
  - Phone: {phone}

### 2. My Orders Page Improvements
- **Date Format**: Updated to match "05-Feb-2026 06:25pm" format
- **Total Amount**: Already displaying correctly

### 3. New Profile Page (`/profile`)
Features:
- **View Profile Information**: Email, Name, Phone
- **Update Profile**: Users can update their name and phone number
- **Change Password**: Secure password change with current password verification
- **Account Information**: Shows account type and member since date

### 4. Backend API Routes Added
New routes in `backend/routes/auth.js`:
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile (name, phone)
- `PUT /api/auth/change-password` - Change password with verification

### 5. Navigation Updates
- Added "Profile" link in navbar (desktop and mobile)
- Profile link shows user's name or email
- Clicking on user name/icon navigates to profile page

## How to Use

### Access Profile Page
1. Login to your account
2. Click on your name in the navbar (desktop) or menu (mobile)
3. Or navigate to `/profile`

### Update Profile
1. Go to Profile page
2. Edit Name or Phone fields
3. Click "Update Profile"

### Change Password
1. Go to Profile page
2. Enter current password
3. Enter new password (min 6 characters)
4. Confirm new password
5. Click "Change Password"

## API Endpoints

### Get Profile
```
GET /api/auth/profile
Headers: Authorization: Bearer {token}
Response: { user: { id, email, name, phone, role, created_at } }
```

### Update Profile
```
PUT /api/auth/profile
Headers: Authorization: Bearer {token}
Body: { name: string, phone: string }
Response: { message, user }
```

### Change Password
```
PUT /api/auth/change-password
Headers: Authorization: Bearer {token}
Body: { currentPassword: string, newPassword: string }
Response: { message }
```

## Files Modified

### Frontend
- `client/src/pages/OrderDetailPage.jsx` - Fixed date format
- `client/src/pages/MyOrdersPage.jsx` - Fixed date format
- `client/src/pages/ProfilePage.jsx` - NEW FILE
- `client/src/App.jsx` - Added profile route
- `client/src/components/Navbar.jsx` - Added profile link

### Backend
- `backend/routes/auth.js` - Added profile and password change routes

## Testing

1. **Test Order Details**:
   - Navigate to My Orders
   - Click "View Details" on any order
   - Verify date format is "05-Feb-2026 06:25pm"
   - Verify Total Amount is displayed
   - Verify Shipping Address shows PIN and Phone

2. **Test Profile Update**:
   - Login and go to /profile
   - Update name and phone
   - Verify success message
   - Check navbar shows updated name

3. **Test Password Change**:
   - Go to /profile
   - Enter current password
   - Enter new password twice
   - Verify success message
   - Logout and login with new password
