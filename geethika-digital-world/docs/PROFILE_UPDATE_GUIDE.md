# Profile Update Feature Guide

## Overview
Users can update their profile information (name and phone number) from the Profile page. The data is automatically saved to the database.

## How It Works

### Frontend (ProfilePage.jsx)
- Located at: `/client/src/pages/ProfilePage.jsx`
- Route: `/profile` (protected route - requires login)
- Users can update:
  - **Full Name** (required)
  - **Phone Number** (optional)
  - **Password** (separate form)

### Backend API
- Endpoint: `PUT /api/auth/profile`
- Authentication: Required (Bearer token)
- Request Body:
  ```json
  {
    "name": "User Full Name",
    "phone": "1234567890"
  }
  ```

### Database
- Table: `users`
- Updated Columns:
  - `name` (VARCHAR, NOT NULL)
  - `phone` (VARCHAR, nullable)

## User Flow

1. **Navigate to Profile**
   - User clicks on their profile/account menu
   - Goes to `/profile` page

2. **View Current Information**
   - Email (read-only, cannot be changed)
   - Current name
   - Current phone number

3. **Update Information**
   - User edits name and/or phone
   - Clicks "Update Profile" button
   - Success message appears
   - Data is saved to database
   - User object in localStorage is updated

4. **Verification**
   - Updated information appears immediately
   - Persists across page refreshes
   - Visible in admin Customer Database

## Testing Profile Update

### Manual Test
1. Login as a customer
2. Go to Profile page (`/profile`)
3. Update name to "John Doe"
4. Update phone to "9876543210"
5. Click "Update Profile"
6. Verify success message appears
7. Refresh page - changes should persist

### Database Verification
```sql
-- Check user data in database
SELECT id, email, name, phone FROM users WHERE email = 'user@example.com';
```

### Admin Verification
1. Login as admin
2. Go to Customer Database
3. Find the user
4. Verify updated name and phone appear

## API Response

### Success Response (200)
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "9876543210",
    "role": "customer"
  }
}
```

### Error Responses

**401 Unauthorized**
```json
{
  "error": "No token provided"
}
```

**400 Bad Request**
```json
{
  "errors": [
    {
      "msg": "Name is required",
      "param": "name"
    }
  ]
}
```

**404 Not Found**
```json
{
  "error": "User not found"
}
```

## Code Implementation

### Frontend Update Function
```javascript
const handleUpdateProfile = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: formData.name,
      phone: formData.phone
    })
  });
  
  const data = await response.json();
  // Update local user data
  login(data.user);
};
```

### Backend Update Handler
```javascript
router.put('/profile', async (req, res) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { name, phone } = req.body;
  
  const result = await pool.query(
    'UPDATE users SET name = $1, phone = $2 WHERE id = $3 RETURNING *',
    [name, phone, decoded.id]
  );
  
  res.json({
    message: 'Profile updated successfully',
    user: result.rows[0]
  });
});
```

## Security Features

1. **Authentication Required**: Must be logged in with valid JWT token
2. **User Isolation**: Users can only update their own profile
3. **Email Protection**: Email cannot be changed (prevents account hijacking)
4. **Input Validation**: Name is required, phone is optional
5. **SQL Injection Protection**: Uses parameterized queries

## Common Issues

### Issue: "No token provided"
**Solution**: User needs to login again. Token may have expired.

### Issue: Changes don't persist
**Solution**: 
- Check if backend server is running
- Verify database connection
- Check browser console for errors

### Issue: Phone number validation
**Solution**: Phone field accepts any format. Add validation if needed:
```javascript
body('phone').optional().isMobilePhone('en-IN')
```

## Related Files

- Frontend: `/client/src/pages/ProfilePage.jsx`
- Backend: `/backend/routes/auth.js`
- Database: `users` table
- Auth Context: `/client/src/context/AuthContext.jsx`

## Future Enhancements

- [ ] Add profile picture upload
- [ ] Add address fields
- [ ] Add email verification for email changes
- [ ] Add phone number verification (OTP)
- [ ] Add profile completion percentage
- [ ] Add social media links
