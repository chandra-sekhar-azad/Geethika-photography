# Audit Log System - Super Admin Feature

## Overview
The audit log system tracks all changes made by admins in the system. Super admins can view detailed logs of all admin activities including creates, updates, and deletes.

## Features

### 1. Comprehensive Activity Tracking
- **Actions Tracked**: CREATE, UPDATE, DELETE, VIEW, LOGIN
- **Entity Types**: Products, Orders, Customers, Services, Admins
- **Detailed Changes**: Before/after values for all modifications
- **Metadata**: IP address, user agent, timestamp

### 2. Advanced Filtering
- Filter by action type
- Filter by entity type
- Filter by date range
- Filter by specific admin
- Search functionality

### 3. Statistics Dashboard
- Recent activity (24 hours)
- Total actions count
- Active admins count
- Entity type distribution
- Action type distribution
- Top admin activities

### 4. Detailed Change Tracking
- View exact changes made (before/after)
- JSON format for complex data
- Expandable details in UI

## Setup Instructions

### 1. Create Database Table
Run the migration script to create the audit_logs table:

```bash
cd backend
node scripts/create-audit-log-table.js
```

This creates:
- `audit_logs` table with all necessary columns
- Indexes for optimal query performance
- Foreign key relationships

### 2. Restart Backend Server
The audit routes are automatically loaded. Just restart your server:

```bash
cd backend
npm start
```

### 3. Access Audit Log
1. Login as super admin
2. Navigate to Admin Panel
3. Click "Audit Log" in the sidebar (only visible to super admins)

## API Endpoints

### Get Audit Logs
```
GET /api/audit/logs
```

Query Parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)
- `adminId` - Filter by admin ID
- `entityType` - Filter by entity type (product, order, customer, etc.)
- `action` - Filter by action (CREATE, UPDATE, DELETE, etc.)
- `startDate` - Filter from date
- `endDate` - Filter to date

### Get Audit Statistics
```
GET /api/audit/stats
```

Query Parameters:
- `startDate` - Statistics from date
- `endDate` - Statistics to date

### Get Admin Activity
```
GET /api/audit/admin/:adminId
```

Query Parameters:
- `page` - Page number
- `limit` - Items per page

## Automatic Logging

The system automatically logs admin actions when:

### Products
- Creating a new product
- Updating product details
- Deleting a product
- Changing product status

### Orders
- Updating order status
- Modifying order details
- Canceling orders

### Customers
- Creating customer accounts
- Updating customer information
- Deleting customers

### Services
- Adding new services
- Updating service details
- Removing services

### Admins
- Creating admin accounts
- Updating admin roles
- Deactivating admins

## Usage Examples

### View All Recent Activity
1. Go to Audit Log page
2. Logs are displayed in reverse chronological order
3. Most recent activities appear first

### Filter by Action Type
1. Select action from dropdown (CREATE, UPDATE, DELETE)
2. Logs automatically filter
3. Clear filters to reset

### View Specific Admin's Activity
1. Use the admin filter dropdown
2. Or click on admin name in the log
3. See all actions by that admin

### View Change Details
1. Click "View Changes" in the Details column
2. See before/after values
3. JSON format for complex data

### Export Date Range
1. Set start and end dates
2. Apply filters
3. Use browser print or export functionality

## Security Features

### Access Control
- Only super admins can access audit logs
- Regular admins cannot view or modify logs
- Logs cannot be deleted through the UI

### Data Integrity
- Logs are write-only (no updates/deletes)
- Foreign key constraints maintain data relationships
- Automatic timestamps prevent tampering

### Privacy
- IP addresses are logged for security
- User agents tracked for device identification
- Sensitive data (passwords) never logged

## Database Schema

```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  admin_email VARCHAR(255),
  admin_name VARCHAR(255),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INTEGER,
  entity_name VARCHAR(255),
  changes JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes
- `idx_audit_logs_admin_id` - Fast admin filtering
- `idx_audit_logs_entity_type` - Fast entity filtering
- `idx_audit_logs_created_at` - Fast date sorting
- `idx_audit_logs_action` - Fast action filtering

## Best Practices

### For Super Admins
1. **Regular Reviews**: Check audit logs weekly
2. **Monitor Patterns**: Look for unusual activity
3. **Verify Changes**: Cross-check important modifications
4. **Export Records**: Keep backups of critical periods

### For Developers
1. **Always Log**: Add logging to new admin features
2. **Meaningful Names**: Use clear entity names
3. **Include Context**: Log relevant change details
4. **Test Logging**: Verify logs are created correctly

## Troubleshooting

### Logs Not Appearing
1. Check if table exists: `\dt audit_logs` in psql
2. Verify admin is authenticated
3. Check server logs for errors
4. Ensure middleware is imported

### Missing Change Details
1. Verify `changes` parameter is passed
2. Check JSON serialization
3. Ensure old/new data is captured

### Performance Issues
1. Use date range filters
2. Limit results per page
3. Check index usage
4. Consider archiving old logs

## Future Enhancements

Potential additions:
- Export to CSV/PDF
- Email alerts for critical actions
- Retention policies
- Advanced analytics
- Real-time notifications
- Rollback functionality

## Support

For issues or questions:
1. Check server logs
2. Verify database connection
3. Review API responses
4. Contact system administrator
