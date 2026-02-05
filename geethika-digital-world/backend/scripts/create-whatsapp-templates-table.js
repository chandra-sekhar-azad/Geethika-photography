import pool from '../config/database.js';

async function createWhatsAppTemplatesTable() {
  const client = await pool.connect();
  
  try {
    console.log('Creating whatsapp_templates table...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS whatsapp_templates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        occasion VARCHAR(100),
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        variables JSONB,
        created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_by_name VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        usage_count INTEGER DEFAULT 0,
        last_used_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✓ whatsapp_templates table created successfully');
    
    // Create whatsapp_campaigns table
    await client.query(`
      CREATE TABLE IF NOT EXISTS whatsapp_campaigns (
        id SERIAL PRIMARY KEY,
        template_id INTEGER REFERENCES whatsapp_templates(id) ON DELETE CASCADE,
        campaign_name VARCHAR(255) NOT NULL,
        target_audience VARCHAR(50) NOT NULL,
        customer_filter JSONB,
        total_recipients INTEGER DEFAULT 0,
        sent_count INTEGER DEFAULT 0,
        failed_count INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'draft',
        scheduled_at TIMESTAMP,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_by_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✓ whatsapp_campaigns table created successfully');
    
    // Create whatsapp_message_log table
    await client.query(`
      CREATE TABLE IF NOT EXISTS whatsapp_message_log (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER REFERENCES whatsapp_campaigns(id) ON DELETE CASCADE,
        template_id INTEGER REFERENCES whatsapp_templates(id) ON DELETE SET NULL,
        customer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        customer_phone VARCHAR(20) NOT NULL,
        customer_name VARCHAR(255),
        message_content TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        error_message TEXT,
        sent_at TIMESTAMP,
        delivered_at TIMESTAMP,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✓ whatsapp_message_log table created successfully');
    
    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_category ON whatsapp_templates(category);
      CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_occasion ON whatsapp_templates(occasion);
      CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_active ON whatsapp_templates(is_active);
      CREATE INDEX IF NOT EXISTS idx_whatsapp_campaigns_status ON whatsapp_campaigns(status);
      CREATE INDEX IF NOT EXISTS idx_whatsapp_message_log_status ON whatsapp_message_log(status);
      CREATE INDEX IF NOT EXISTS idx_whatsapp_message_log_campaign ON whatsapp_message_log(campaign_id);
    `);
    
    console.log('✓ Indexes created successfully');
    
    // Insert sample templates
    await client.query(`
      INSERT INTO whatsapp_templates (name, category, occasion, subject, message, variables, created_by_name)
      VALUES 
        (
          'Valentine Special Offer',
          'promotional',
          'valentine',
          'Valentine''s Day Special - 20% OFF',
          'Hi {{name}}! 💝\n\nValentine''s Day is here! Show your love with our special collection.\n\n🎁 Get 20% OFF on all Valentine gifts\n🌹 Free gift wrapping\n💐 Same-day delivery available\n\nUse code: LOVE2026\nValid till: {{valid_till}}\n\nShop now: {{shop_url}}\n\n- Geethika Digital World',
          '["name", "valid_till", "shop_url"]',
          'System'
        ),
        (
          'New Product Launch',
          'promotional',
          'general',
          'New Arrivals Just for You!',
          'Hello {{name}}! 🎉\n\nExciting news! We''ve just launched new products that you''ll love.\n\n✨ Fresh designs\n🎨 Customizable options\n📦 Fast delivery\n\nCheck them out: {{product_url}}\n\nHappy Shopping!\n- Geethika Digital World',
          '["name", "product_url"]',
          'System'
        ),
        (
          'Order Confirmation',
          'transactional',
          'general',
          'Order Confirmed',
          'Hi {{name}}! ✅\n\nYour order #{{order_number}} has been confirmed!\n\n📦 Order Total: ₹{{order_total}}\n🚚 Expected Delivery: {{delivery_date}}\n\nTrack your order: {{tracking_url}}\n\nThank you for shopping with us!\n- Geethika Digital World',
          '["name", "order_number", "order_total", "delivery_date", "tracking_url"]',
          'System'
        ),
        (
          'Birthday Special',
          'promotional',
          'birthday',
          'Happy Birthday! Special Gift Inside',
          'Happy Birthday {{name}}! 🎂🎉\n\nWishing you a wonderful day filled with joy!\n\n🎁 Here''s a special gift: {{discount}}% OFF on your next purchase\n🎈 Use code: BDAY{{code}}\n⏰ Valid for 7 days\n\nCelebrate with us: {{shop_url}}\n\n- Geethika Digital World',
          '["name", "discount", "code", "shop_url"]',
          'System'
        ),
        (
          'Festival Offer',
          'promotional',
          'festival',
          'Festival Special - Mega Discounts!',
          'Hi {{name}}! 🪔✨\n\nCelebrate {{festival_name}} with amazing offers!\n\n🎊 Up to {{discount}}% OFF\n🎁 Special gift hampers\n🚚 Free delivery on orders above ₹{{min_order}}\n\nOffer ends: {{end_date}}\nShop now: {{shop_url}}\n\n- Geethika Digital World',
          '["name", "festival_name", "discount", "min_order", "end_date", "shop_url"]',
          'System'
        )
      ON CONFLICT DO NOTHING
    `);
    
    console.log('✓ Sample templates inserted successfully');
    
  } catch (error) {
    console.error('Error creating WhatsApp templates tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

createWhatsAppTemplatesTable()
  .then(() => {
    console.log('WhatsApp templates setup complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
