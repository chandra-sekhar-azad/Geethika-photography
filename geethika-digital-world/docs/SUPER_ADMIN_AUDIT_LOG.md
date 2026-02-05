# Super Admin - Audit Log Quick Reference

## What is the Audit Log?

The Audit Log tracks every action performed by admins in your system. It's your security camera for admin activities.

## How to Access

1. Login as Super Admin
2. Go to Admin Panel
3. Click **"Audit Log"** in the sidebar (only visible to super admins)

## What Gets Logged?

### Actions Tracked
- ✅ **CREATE** - When admins add new items (products, customers, services)
- ✅ **UPDATE** - When admins modify existing items (order status, product details)
- ✅ **DELETE** - When admins remove items
- ✅ **VIEW** - When admins access sensitive information
- ✅ **LOGIN** - When admins log into the system

### Information Captured
- **Who**: Admin name and email
- **What**: Type of action and what was changed
- **When**: Exact date and time
- **Where**: IP address and device used
- **Details**: Before/after values for changes

## Quick Actions

### View Recent Activity
- Logs appear in reverse chronological order
- Most recent actions at the top
- Default shows last 50 actions

### Filter by Action Type
1. Click "Action" dropdown
2. Select: CREATE, UPDATE, DELETE, VIEW, or LOGIN
3. Logs filter automatically

### Filter by Entity Type
1. Click "Entity Type" dropdown
2. Select: Product, Order, Customer, Service, or Admin
3. See only actions on that type

### Filter by Date Range
1. Set "Start Date"
2. Set "End Date"
3. View actions within that period

### View Change Details
1. Find the log entry
2. Click "View Changes" in Details column
3. See before/after values

### Clear All Filters
- Click "Clear Filters" button
- Returns to showing all logs

## Understanding the Dashboard

### Statistics Cards

**Recent Activity (24h)**
- Number of actions in last 24 hours
- Quick indicator of admin activity level

**Total Actions**
- All actions in filtered period
- Shows overall system usage

**Active Admins**
- Number of admins who performed actions
- Helps identify active team members

**Entity Types**
- Different types of items modified
- Shows what areas are being worked on

## Common Use Cases

### 1. Monitor Daily Activity
**Goal**: See what happened today

Steps:
1. Set Start Date to today
2. Leave End Date empty
3. Review all actions

### 2. Check Specific Admin's Work
**Goal**: See what a particular admin did

Steps:
1. Look for admin's name in logs
2. Note their admin_id
3. Use admin filter (if available)
4. Review their actions

### 3. Track Product Changes
**Goal**: See all product modifications

Steps:
1. Select Entity Type: "product"
2. Select Action: "UPDATE"
3. Review changes made

### 4. Investigate Order Issues
**Goal**: Find who changed an order

Steps:
1. Select Entity Type: "order"
2. Search for order number in logs
3. View change details
4. Check admin who made changes

### 5. Security Audit
**Goal**: Review all admin logins

Steps:
1. Select Action: "LOGIN"
2. Set date range for audit period
3. Check IP addresses
4. Verify all logins are legitimate

## Red Flags to Watch For

⚠️ **Unusual Activity Patterns**
- Admin logging in at odd hours
- Multiple failed login attempts
- Actions from unexpected IP addresses

⚠️ **Suspicious Changes**
- Mass deletions
- Price changes without approval
- Order status changes without reason

⚠️ **Access Violations**
- Admin accessing areas outside their role
- Viewing customer data unnecessarily
- Modifying critical settings

## Best Practices

### Daily Review
- Check audit log every morning
- Review previous day's activity
- Look for any unusual patterns

### Weekly Analysis
- Export weekly reports
- Review admin activity trends
- Identify training needs

### Monthly Audit
- Comprehensive review of all actions
- Verify compliance with policies
- Archive important records

### Incident Response
- Check audit log immediately for issues
- Document findings
- Take corrective action

## Tips & Tricks

### Efficient Filtering
- Start broad, then narrow down
- Use date ranges to reduce results
- Combine multiple filters for precision

### Reading Change Details
- JSON format shows exact changes
- "before" shows old value
- "after" shows new value
- null means field was empty

### Performance
- Use date ranges for faster loading
- Limit results per page
- Clear filters when done

### Documentation
- Take screenshots of important logs
- Export data for records
- Keep notes on investigations

## Troubleshooting

### Can't See Audit Log Menu
- Verify you're logged in as super admin
- Check your role in profile
- Contact system administrator

### No Logs Appearing
- Check if date filters are too restrictive
- Verify actions have been performed
- Try clearing all filters

### Changes Not Showing
- Some actions may not log changes
- Check if action type supports change tracking
- Verify the action completed successfully

### Slow Loading
- Reduce date range
- Use more specific filters
- Decrease items per page

## Security Notes

### Access Control
- Only super admins can view audit logs
- Regular admins cannot see this feature
- Logs cannot be modified or deleted

### Data Retention
- Logs are kept indefinitely by default
- Consider archiving old logs
- Consult with IT for retention policy

### Privacy
- Logs contain admin activity only
- Customer passwords never logged
- Sensitive data is protected

## Need Help?

### Common Questions
1. **How far back do logs go?**
   - From the date the feature was enabled
   - All future actions are logged automatically

2. **Can logs be deleted?**
   - No, logs are permanent for security
   - Only database admin can remove logs

3. **Are customer actions logged?**
   - No, only admin actions are tracked
   - Customer activity is separate

4. **Can I export logs?**
   - Currently view-only in browser
   - Export feature coming soon
   - Use browser print for now

### Contact Support
- For technical issues: Check with IT team
- For policy questions: Contact management
- For training: Request admin training session

## Quick Reference Card

| Task | Steps |
|------|-------|
| View today's activity | Set start date to today |
| Find specific admin | Look for admin name in logs |
| Check product changes | Filter: Entity Type = product |
| Review order updates | Filter: Entity Type = order, Action = UPDATE |
| Security audit | Filter: Action = LOGIN, set date range |
| Clear filters | Click "Clear Filters" button |
| View change details | Click "View Changes" in log entry |
| Navigate pages | Use Previous/Next buttons at bottom |

---

**Remember**: The audit log is a powerful tool for maintaining security and accountability. Use it regularly to ensure your system is running smoothly and securely.
