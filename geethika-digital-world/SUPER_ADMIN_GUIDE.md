# Super Admin Guide

## Overview

The Super Admin role has complete control over the Geethika Digital World website, including the ability to manage other admin users.

## Role Hierarchy

```
Super Admin (super_admin)
    ↓
Admin (admin)
    ↓
Customer (customer)
```

### Super Admin Capabilities

✅ **Everything an Admin can do:**
- Manage Products
- Manage Orders
- Manage Services
- View Customers
- View Analytics
- Manage Gallery

✅ **Plus Super Admin exclusive features:**
- **Create new Admin users**
- **Edit existing Admin users**
- **Delete Admin users**
- **Promote Admin to Super Admin**
- **Demote Super Admin to Admin**
- **View all system users**
- **Access system statistics**

### Admin Capabilities

✅ **Standard Admin features:**
- Manage Products
- Manage Orders
- Manage Services
- View Customers
- View Analytics

❌ **Cannot:**
- Create/Edit/Delete other Admins
- Access Admin Management page
- Change user roles

## Super Admin Credentials

### Default Super Admin

```
Email: superadmin@geethika.com
Password: SuperAdmin@123
```

🔐 **IMPORTANT:** Change this password immediately after first login!

### Login URL

```
http://localhost:5173/admin/login
```

## Creating Super Admin

### Method 1: Using Script (Recommended)

```bash
cd backend
node scripts/add-super-admin-role.js
```

This will:
- Create a super admin user if it doesn't exist
- Update existing user to super_admin role
- Display credentials

### Method 2: Manual Database Update

```sql
-- Update existing admin to super_admin
UPDATE users 
SET role = 'super_admin' 
WHERE email = 'your-admin@email.com';

-- Or create new super admin
INSERT INTO users (name, email, password, role, phone)
VALUES (
  'Super Admin',
  'superadmin@geethika.com',
  '$2a$10$hashedpassword', -- Use bcrypt to hash
  'super_admin',
  '0000000000'
);
```

### Method 3: Environment Variables

Add to `.env`:

```env
SUPER_ADMIN_EMAIL=superadmin@geethika.com
SUPER_ADMIN_PASSWORD=YourSecurePassword123
```

Then run the script:

```bash
node scripts/add-super-admin-role.js
```

## Admin Management Interface

### Accessing Admin Management

1. Login as Super Admin
2. Go to Admin Dashboard
3. Click on "Admin Management" card (red shield icon)

Or directly: `http://localhost:5173/admin/admin-management`

### Admin Management Features

#### 1. View All Admins

- See list of all admin and super_admin users
- View their details:
  - Name
  - Email
  - Phone
  - Role
  - Created date

#### 2. Create New Admin

Click "Add Admin" button:

**Required Fields:**
- Name *
- Email *
- Password * (minimum 6 characters)
- Role * (Admin or Super Admin)

**Optional Fields:**
- Phone

**Example:**
```
Name: John Doe
Email: john@geethika.com
Password: SecurePass123
Role: Admin
Phone: 9876543210
```

#### 3. Edit Admin

Click Edit icon (pencil) on any admin:

- Update name, email, phone
- Change role (Admin ↔ Super Admin)
- Change password (leave blank to keep current)

**Note:** You cannot change your own role

#### 4. Delete Admin

Click Delete icon (trash) on any admin:

- Confirmation dialog appears
- Admin is permanently deleted

**Note:** You cannot delete your own account

### Security Features

#### Self-Protection

- Super Admin cannot delete themselves
- Super Admin cannot demote themselves
- Prevents accidental lockout

#### Role Validation

- Only Super Admin can access Admin Management
- Regular Admins are redirected if they try to access
- Token-based authentication required

#### Password Security

- Passwords are hashed with bcrypt
- Minimum 6 characters required
- When editing, password is optional (keeps current if blank)

## API Endpoints

### Super Admin Routes

All routes require `super_admin` role.

#### Get All Admins

```http
GET /api/super-admin/admins
Authorization: Bearer <token>
```

Response:
```json
{
  "admins": [
    {
      "id": 1,
      "name": "Super Admin",
      "email": "superadmin@geethika.com",
      "role": "super_admin",
      "phone": "0000000000",
      "created_at": "2026-02-06T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### Create Admin

```http
POST /api/super-admin/admins
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@geethika.com",
  "password": "SecurePass123",
  "role": "admin",
  "phone": "9876543210"
}
```

#### Update Admin

```http
PUT /api/super-admin/admins/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "role": "super_admin",
  "password": "NewPassword123"
}
```

#### Delete Admin

```http
DELETE /api/super-admin/admins/:id
Authorization: Bearer <token>
```

#### Get System Statistics

```http
GET /api/super-admin/stats
Authorization: Bearer <token>
```

Response:
```json
{
  "total_customers": 150,
  "total_admins": 3,
  "total_super_admins": 1,
  "total_products": 45,
  "total_orders": 230,
  "total_categories": 8,
  "total_revenue": 125000
}
```

#### Get All Users

```http
GET /api/super-admin/users?role=customer&search=john&limit=50&offset=0
Authorization: Bearer <token>
```

## Middleware

### Authentication Middleware

```javascript
import { authenticate, isAdmin, isSuperAdmin } from './middleware/auth.js';

// Require authentication
router.get('/protected', authenticate, handler);

// Require admin or super_admin
router.get('/admin-only', authenticate, isAdmin, handler);

// Require super_admin only
router.get('/super-admin-only', authenticate, isSuperAdmin, handler);
```

### isAdmin Middleware

Allows both `admin` and `super_admin` roles:

```javascript
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
```

### isSuperAdmin Middleware

Allows only `super_admin` role:

```javascript
export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Super Admin access required' });
  }
  next();
};
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Valid Roles

- `customer` - Regular website users
- `admin` - Admin users (can manage products, orders, etc.)
- `super_admin` - Super admin users (can manage everything including admins)

## Frontend Components

### AdminManagement.jsx

Location: `client/src/pages/admin/AdminManagement.jsx`

Features:
- Admin list with search
- Create/Edit/Delete modals
- Role badges (Super Admin = purple, Admin = blue)
- Form validation
- Error handling

### AdminDashboard.jsx

Location: `client/src/pages/admin/AdminDashboard.jsx`

Features:
- Shows "Admin Management" card only for super admins
- Detects role from JWT token
- Dynamic quick links based on role

## Security Best Practices

### 1. Change Default Password

```bash
# After first login, change password immediately
# Go to Profile → Change Password
```

### 2. Use Strong Passwords

- Minimum 8 characters
- Include uppercase, lowercase, numbers, symbols
- Don't reuse passwords

### 3. Limit Super Admin Accounts

- Only create super admin accounts when necessary
- Most users should be regular admins
- Review admin list regularly

### 4. Regular Audits

- Check admin list monthly
- Remove inactive admins
- Update passwords periodically

### 5. Environment Variables

Never commit credentials to git:

```env
# .env (add to .gitignore)
SUPER_ADMIN_EMAIL=your-email@domain.com
SUPER_ADMIN_PASSWORD=YourSecurePassword
```

## Troubleshooting

### Cannot Access Admin Management

**Problem:** "Access denied. Super Admin only."

**Solution:**
1. Check your role:
   ```sql
   SELECT role FROM users WHERE email = 'your-email@domain.com';
   ```
2. If role is not `super_admin`, update it:
   ```sql
   UPDATE users SET role = 'super_admin' WHERE email = 'your-email@domain.com';
   ```
3. Logout and login again

### Cannot Create Admin

**Problem:** "Email already exists"

**Solution:**
- Use a different email address
- Or delete the existing user first

### Cannot Delete Admin

**Problem:** "Cannot delete your own account"

**Solution:**
- You cannot delete yourself
- Ask another super admin to delete your account
- Or use database directly

### Token Expired

**Problem:** "Your session has expired"

**Solution:**
- Login again at `/admin/login`
- Token expires after 24 hours

## Testing

### Test Super Admin Creation

```bash
cd backend
node scripts/add-super-admin-role.js
```

Expected output:
```
✅ Super Admin created successfully!
   Email: superadmin@geethika.com
   Password: SuperAdmin@123
```

### Test Admin Management

1. Login as super admin
2. Go to Admin Management
3. Create a test admin
4. Edit the admin
5. Delete the admin

### Test Role Restrictions

1. Login as regular admin
2. Try to access `/admin/admin-management`
3. Should be redirected to dashboard

## Files Modified

### Backend

1. `backend/middleware/auth.js`
   - Added `isSuperAdmin` middleware
   - Updated `isAdmin` to allow super_admin

2. `backend/routes/super-admin.js` (NEW)
   - Admin CRUD operations
   - System statistics
   - User management

3. `backend/server.js`
   - Added super-admin routes

4. `backend/scripts/add-super-admin-role.js` (NEW)
   - Script to create super admin

### Frontend

1. `client/src/pages/admin/AdminManagement.jsx` (NEW)
   - Admin management interface
   - Create/Edit/Delete admins

2. `client/src/pages/admin/AdminDashboard.jsx`
   - Added Admin Management card for super admins
   - Role detection

3. `client/src/App.jsx`
   - Added admin-management route

## Summary

The Super Admin system provides:

✅ Complete control over the website
✅ Ability to manage other admins
✅ Secure role-based access control
✅ Easy admin creation and management
✅ Self-protection features
✅ Comprehensive API endpoints

Super Admin can now control everything on the website including managing other admin users!
