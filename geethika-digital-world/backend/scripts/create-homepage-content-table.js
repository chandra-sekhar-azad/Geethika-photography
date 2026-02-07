import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function createHomePageContentTable() {
  try {
    console.log('🔄 Creating homepage_content table...');

    // Create homepage_content table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS homepage_content (
        id SERIAL PRIMARY KEY,
        section VARCHAR(50) NOT NULL UNIQUE,
        content_type VARCHAR(50) NOT NULL,
        title VARCHAR(255),
        description TEXT,
        image_url VARCHAR(500),
        link_url VARCHAR(500),
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default content
    console.log('🔄 Inserting default homepage content...');

    const defaultContent = [
      // Hero Banner
      {
        section: 'hero_banner',
        content_type: 'banner',
        title: 'Thoughtful Gifts for Every Love Story',
        description: 'Celebrate your special moments with personalized gifts, stunning photography, and unforgettable experiences',
        image_url: '/images/image copy 6.png',
        link_url: '/shop',
        display_order: 1
      },
      // Special Offers
      {
        section: 'offer_valentine',
        content_type: 'offer_card',
        title: 'Valentine Special',
        description: 'Flat 20% OFF on all couple gifts',
        image_url: null,
        link_url: '/shop/couple-gifts',
        display_order: 1
      },
      {
        section: 'offer_personalized',
        content_type: 'offer_card',
        title: 'Personalized Gifts',
        description: 'Free customization on orders above ₹999',
        image_url: null,
        link_url: '/shop/personalised-gifts',
        display_order: 2
      },
      {
        section: 'offer_photo',
        content_type: 'offer_card',
        title: 'Photo Sessions',
        description: 'Book now & get 15% OFF on couple shoots',
        image_url: null,
        link_url: '/services',
        display_order: 3
      },
      {
        section: 'offer_combo',
        content_type: 'offer_card',
        title: 'Premium Combos',
        description: 'Save up to 30% on gift combos',
        image_url: null,
        link_url: '/shop',
        display_order: 4
      },
      // Testimonials
      {
        section: 'testimonial_1',
        content_type: 'testimonial',
        title: 'Priya & Rahul',
        description: 'Amazing experience! The personalized photo frame we ordered was absolutely stunning. Perfect Valentine gift!',
        image_url: '/images/image.png',
        link_url: null,
        display_order: 1
      },
      {
        section: 'testimonial_2',
        content_type: 'testimonial',
        title: 'Anjali Sharma',
        description: 'The quality of customization is top-notch. My husband loved the personalized mug and t-shirt combo!',
        image_url: '/images/image copy 3.png',
        link_url: null,
        display_order: 2
      },
      {
        section: 'testimonial_3',
        content_type: 'testimonial',
        title: 'Vikram & Sneha',
        description: 'Geethika Digital World captured our special moments beautifully. Highly recommend their services!',
        image_url: '/images/image copy 6.png',
        link_url: null,
        display_order: 3
      }
    ];

    console.log('✅ Table created successfully');

    for (const content of defaultContent) {
      await pool.query(
        `INSERT INTO homepage_content (section, content_type, title, description, image_url, link_url, display_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (section) DO UPDATE SET
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         image_url = EXCLUDED.image_url,
         link_url = EXCLUDED.link_url,
         display_order = EXCLUDED.display_order`,
        [
          content.section,
          content.content_type,
          content.title,
          content.description,
          content.image_url,
          content.link_url,
          content.display_order
        ]
      );
    }

    console.log('✅ Default content inserted successfully');
    console.log('\n📊 Homepage Content Summary:');
    console.log('- Hero Banner: 1 item');
    console.log('- Special Offers: 4 items');
    console.log('- Testimonials: 3 items');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

createHomePageContentTable()
  .then(() => {
    console.log('\n✅ Homepage content table setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
