# WhatsApp Marketing System - Complete Guide

## Overview

A comprehensive WhatsApp template and campaign management system that allows admins and super admins to create message templates and send bulk promotional messages to customers.

## Features

### 1. Template Management
- Create unlimited message templates
- Categorize by type (promotional, transactional, notification)
- Tag by occasion (Valentine's Day, Birthday, Festival, etc.)
- Use dynamic variables for personalization
- Preview templates before use
- Duplicate existing templates
- Track usage statistics

### 2. Campaign Management
- Create targeted campaigns
- Select customer segments
- Schedule campaigns for future dates
- Track campaign performance
- Monitor delivery status
- View detailed analytics

### 3. Customer Segmentation
- **All Customers**: Send to everyone
- **Active Customers**: Ordered in last 90 days
- **Inactive Customers**: No orders in 90 days
- **High Value Customers**: Spent more than ₹5000
- **Custom Filters**: Create your own segments

### 4. Message Personalization
Use variables in templates for dynamic content:
- `{{name}}` - Customer name
- `{{discount}}` - Discount percentage
- `{{order_number}}` - Order number
- `{{date}}` - Custom dates
- `{{url}}` - Links to products/shop
- Any custom variable you define

## Getting Started

### Step 1: Access WhatsApp Features

1. Login as admin or super admin
2. Navigate to Admin Panel
3. Find "WhatsApp Templates" and "WhatsApp Campaigns" in sidebar

### Step 2: Create Your First Template

1. Click "WhatsApp Templates"
2. Click "New Template" button
3. Fill in the details:
   - **Name**: Internal name for the template
   - **Category**: Promotional, Transactional, or Notification
   - **Occasion**: Valentine, Birthday, Festival, or General
   - **Subject**: Brief description
   - **Message**: Your message content with variables

4. Use `{{variable_name}}` for dynamic content
5. Click "Create Template"

### Step 3: Launch a Campaign

1. Click "WhatsApp Campaigns"
2. Click "New Campaign" button
3. Configure campaign:
   - **Campaign Name**: Descriptive name
   - **Template**: Select from your templates
   - **Target Audience**: Choose customer segment
   - **Schedule**: Set date/time or save as draft

4. Review recipient count
5. Click "Create Campaign"

## Template Examples

### Valentine's Day Promotion
```
Hi {{name}}! 💝

Valentine's Day is here! Show your love with our special collection.

🎁 Get {{discount}}% OFF on all Valentine gifts
🌹 Free gift wrapping
💐 Same-day delivery available

Use code: {{code}}
Valid till: {{valid_date}}

Shop now: {{shop_url}}

- Geethika Digital World
```

### Birthday Wishes
```
Happy Birthday {{name}}! 🎂🎉

Wishing you a wonderful day filled with joy!

🎁 Here's a special gift: {{discount}}% OFF on your next purchase
🎈 Use code: BDAY{{code}}
⏰ Valid for 7 days

Celebrate with us: {{shop_url}}

- Geethika Digital World
```

### Order Confirmation
```
Hi {{name}}! ✅

Your order #{{order_number}} has been confirmed!

📦 Order Total: ₹{{order_total}}
🚚 Expected Delivery: {{delivery_date}}

Track your order: {{tracking_url}}

Thank you for shopping with us!
- Geethika Digital World
```

### Festival Offer
```
Hi {{name}}! 🪔✨

Celebrate {{festival_name}} with amazing offers!

🎊 Up to {{discount}}% OFF
🎁 Special gift hampers
🚚 Free delivery on orders above ₹{{min_order}}

Offer ends: {{end_date}}
Shop now: {{shop_url}}

- Geethika Digital World
```

### New Product Launch
```
Hello {{name}}! 🎉

Exciting news! We've just launched new products that you'll love.

✨ Fresh designs
🎨 Customizable options
📦 Fast delivery

Check them out: {{product_url}}

Happy Shopping!
- Geethika Digital World
```

## Best Practices

### Template Creation

1. **Keep it Short**: WhatsApp messages should be concise
2. **Use Emojis**: Make messages visually appealing
3. **Clear CTA**: Include clear call-to-action
4. **Add Value**: Offer discounts, information, or benefits
5. **Brand Signature**: End with your business name

### Variable Usage

1. **Always Include Name**: Personalize with `{{name}}`
2. **Test Variables**: Ensure all variables are provided
3. **Fallback Values**: Have defaults for missing data
4. **Consistent Naming**: Use clear variable names

### Campaign Strategy

1. **Segment Wisely**: Target the right audience
2. **Timing Matters**: Send at appropriate times
3. **Frequency Control**: Don't spam customers
4. **Test First**: Send test messages before campaigns
5. **Track Results**: Monitor performance metrics

### Compliance

1. **Get Consent**: Only message customers who opted in
2. **Provide Opt-out**: Include unsubscribe option
3. **Follow Guidelines**: Comply with WhatsApp policies
4. **Respect Privacy**: Don't share customer data
5. **Business Hours**: Send during reasonable hours

## Template Categories

### Promotional
- Sales and discounts
- New product launches
- Special offers
- Seasonal promotions
- Flash sales

### Transactional
- Order confirmations
- Shipping updates
- Delivery notifications
- Payment receipts
- Account updates

### Notification
- Appointment reminders
- Event notifications
- Stock alerts
- Service updates
- Important announcements

## Customer Segments

### All Customers
- **Use For**: General announcements, major sales
- **Best Time**: Festival seasons, year-end sales
- **Frequency**: Monthly or less

### Active Customers
- **Use For**: New products, exclusive offers
- **Best Time**: After their last purchase
- **Frequency**: Bi-weekly

### Inactive Customers
- **Use For**: Win-back campaigns, special discounts
- **Best Time**: 90+ days after last order
- **Frequency**: Monthly

### High Value Customers
- **Use For**: VIP offers, early access, premium products
- **Best Time**: Before major launches
- **Frequency**: Weekly

## Campaign Performance Metrics

### Key Metrics to Track

1. **Total Recipients**: Number of customers targeted
2. **Sent Count**: Successfully sent messages
3. **Failed Count**: Failed deliveries
4. **Success Rate**: Percentage of successful sends
5. **Response Rate**: Customer engagement (future feature)

### Analyzing Results

- Compare different templates
- Test different audience segments
- Optimize send times
- Refine message content
- A/B test variations

## Integration with WhatsApp Business API

### Current Status
This is a template management system. To actually send messages, you need to integrate with WhatsApp Business API.

### Required Steps for Production

1. **Get WhatsApp Business Account**
   - Apply for WhatsApp Business API
   - Get approved by WhatsApp
   - Obtain API credentials

2. **Configure API**
   - Add API keys to backend `.env`
   - Set up webhook endpoints
   - Configure message templates with WhatsApp

3. **Template Approval**
   - Submit templates to WhatsApp for approval
   - Wait for approval (24-48 hours)
   - Only use approved templates

4. **Implement Sending**
   - Update backend to call WhatsApp API
   - Handle delivery status callbacks
   - Log message delivery status

### Environment Variables Needed
```env
WHATSAPP_API_URL=https://api.whatsapp.com/v1
WHATSAPP_API_KEY=your_api_key
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_account_id
```

## Database Schema

### whatsapp_templates
```sql
- id: Template ID
- name: Template name
- category: promotional/transactional/notification
- occasion: valentine/birthday/festival/general
- subject: Brief description
- message: Template content
- variables: Array of variable names
- created_by: Admin who created it
- is_active: Active status
- usage_count: Times used
- last_used_at: Last usage timestamp
```

### whatsapp_campaigns
```sql
- id: Campaign ID
- template_id: Associated template
- campaign_name: Campaign name
- target_audience: Customer segment
- total_recipients: Number of customers
- sent_count: Successfully sent
- failed_count: Failed sends
- status: draft/scheduled/sending/completed/failed
- scheduled_at: When to send
- created_by: Admin who created it
```

### whatsapp_message_log
```sql
- id: Message ID
- campaign_id: Associated campaign
- template_id: Template used
- customer_id: Customer ID
- customer_phone: Phone number
- message_content: Actual message sent
- status: pending/sent/delivered/read/failed
- sent_at: Send timestamp
- delivered_at: Delivery timestamp
```

## API Endpoints

### Templates

**GET /api/whatsapp/templates**
- Get all templates
- Query params: category, occasion, active

**GET /api/whatsapp/templates/:id**
- Get single template

**POST /api/whatsapp/templates**
- Create new template
- Body: name, category, occasion, subject, message, variables

**PUT /api/whatsapp/templates/:id**
- Update template

**DELETE /api/whatsapp/templates/:id**
- Delete template

**GET /api/whatsapp/templates/:id/stats**
- Get template statistics

### Campaigns

**GET /api/whatsapp/campaigns**
- Get all campaigns
- Query params: status

**POST /api/whatsapp/campaigns**
- Create new campaign
- Body: template_id, campaign_name, target_audience, scheduled_at

### Customers

**GET /api/whatsapp/customers**
- Get customers for campaigns
- Query params: filter (all/active/inactive/high_value)

### Testing

**POST /api/whatsapp/test-message**
- Send test message
- Body: template_id, phone, variables

## Troubleshooting

### Templates Not Showing
- Check if templates are marked as active
- Verify database connection
- Check browser console for errors

### Campaign Creation Fails
- Ensure template is selected
- Verify customer segment has recipients
- Check API response for error details

### Variables Not Replacing
- Ensure variable names match exactly
- Check variable format: `{{name}}` not `{name}`
- Verify variables are provided in campaign

### No Customers in Segment
- Check customer database has phone numbers
- Verify segment filter criteria
- Ensure customers have orders (for active/inactive filters)

## Security & Privacy

### Data Protection
- Customer phone numbers are encrypted
- Only admins can access templates
- Audit logs track all actions
- Secure API endpoints

### Compliance
- GDPR compliant
- WhatsApp Business Policy compliant
- Opt-in/opt-out management
- Data retention policies

## Future Enhancements

Planned features:
- [ ] Rich media support (images, videos)
- [ ] Interactive buttons
- [ ] Quick replies
- [ ] Message scheduling calendar
- [ ] A/B testing
- [ ] Advanced analytics
- [ ] Customer response tracking
- [ ] Automated follow-ups
- [ ] Template versioning
- [ ] Multi-language support

## Support

For issues or questions:
1. Check this documentation
2. Review API responses
3. Check audit logs
4. Contact system administrator

## Quick Reference

| Action | Location | Permission |
|--------|----------|------------|
| Create Template | WhatsApp Templates | Admin/Super Admin |
| Edit Template | WhatsApp Templates | Admin/Super Admin |
| Delete Template | WhatsApp Templates | Admin/Super Admin |
| Create Campaign | WhatsApp Campaigns | Admin/Super Admin |
| View Analytics | WhatsApp Campaigns | Admin/Super Admin |
| Send Test Message | Template Preview | Admin/Super Admin |

---

**Remember**: Always test templates before launching campaigns. Respect customer privacy and follow WhatsApp's business policies.
