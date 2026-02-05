# Super Admin Quick Start

## 🚀 Quick Setup

### 1. Create Super Admin

```bash
cd backend
node scripts/add-super-admin-role.js
```

### 2. Login Credentials

```
Email: superadmin@geethika.com
Password: SuperAdmin@123
```

### 3. Login URL

```
http://localhost:5173/admin/login
```

## 📋 What Super Admin Can Do

### ✅ Everything Regular Admin Can Do:
- Manage Products
- Manage Orders  
- Manage Services
- View Customers
- View Analytics

### ✨ Plus Super Admin Exclusive:
- **Create new Admins**
- **Edit existing Admins**
- **Delete Admins**
- **Change Admin roles**
- **View all system users**

## 🎯 Quick Actions

### Access Admin Management

1. Login as Super Admin
2. Go to Dashboard
3. Click "Admin Management" (red shield icon)

### Create New Admin

1. Click "Add Admin"
2. Fill in details:
   - Name
   - Email
   - Password
   - Role (Admin or Super Admin)
3. Click "Create Admin"

### Edit Admin

1. Click Edit icon (pencil)
2. Update details
3. Click "Update Admin"

### Delete Admin

1. Click Delete icon (trash)
2. Confirm deletion

## 🔐 Security Notes

- ⚠️ Change default password after first login
- 🛡️ Cannot delete yourself
- 🔒 Cannot change your own role
- 🚫 Only Super Admin can access Admin Management

## 📊 Admin Dashboard

Super Admins see an extra card:

```
┌─────────────────────────────────┐
│  🛡️  Admin Management           │
│  Manage admin users and         │
│  permissions                    │
└─────────────────────────────────┘
```

## 🔧 Troubleshooting

### Can't access Admin Management?

Check your role:
```sql
SELECT role FROM users WHERE email = 'your-email';
```

Update to super_admin:
```sql
UPDATE users SET role = 'super_admin' WHERE email = 'your-email';
```

Then logout and login again.

## 📚 Full Documentation

See `SUPER_ADMIN_GUIDE.md` for complete documentation.
