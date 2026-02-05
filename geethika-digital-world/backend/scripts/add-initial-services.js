import pool from '../config/database.js';

async function addInitialServices() {
  try {
    console.log('Adding initial services...');

    const services = [
      {
        name: 'Photography',
        slug: 'photography',
        description: 'Professional photography services for all occasions - weddings, pre-wedding shoots, couple photoshoots, events, and more. Capture your special moments with our expert photographers.',
        price_range: '₹5,999 - ₹25,000',
        image_url: '/services/photography.jpg',
        is_active: true
      },
      {
        name: 'Videography',
        slug: 'videography',
        description: 'Cinematic videography services to capture your special moments in motion. From wedding films to event coverage, we create stunning videos that tell your story.',
        price_range: '₹10,000 - ₹30,000',
        image_url: '/services/videography.jpg',
        is_active: true
      },
      {
        name: 'Event Decor',
        slug: 'event-decor',
        description: 'Beautiful decoration services for all your events - birthdays, weddings, anniversaries, and more. We transform your venue into a magical space.',
        price_range: '₹5,000 - ₹50,000',
        image_url: '/services/event-decor.png',
        is_active: true
      },
      {
        name: 'Home Redecor',
        slug: 'home-redecor',
        description: 'Transform your home with our professional interior design and redecoration services. From single rooms to complete home makeovers.',
        price_range: '₹15,000 - ₹75,000',
        image_url: '/services/home-redecor.jpg',
        is_active: true
      },
      {
        name: 'Shop Redecor',
        slug: 'shop-redecor',
        description: 'Professional shop and store interior design services to attract customers and enhance your business space. Custom designs for retail spaces.',
        price_range: '₹25,000 - ₹1,00,000',
        image_url: '/services/shop-redecor.jpg',
        is_active: true
      },
      {
        name: 'Return Gifts',
        slug: 'return-gifts',
        description: 'Unique and personalized return gifts for all occasions. Make your guests feel special with our curated collection of memorable gifts.',
        price_range: '₹50 - ₹500 per piece',
        image_url: null,
        is_active: true
      }
    ];

    for (const service of services) {
      // Check if service already exists
      const existing = await pool.query(
        'SELECT id FROM services WHERE slug = $1',
        [service.slug]
      );

      if (existing.rows.length > 0) {
        console.log(`⏭️  Service "${service.name}" already exists, skipping...`);
        continue;
      }

      await pool.query(`
        INSERT INTO services (name, slug, description, price_range, image_url, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        service.name,
        service.slug,
        service.description,
        service.price_range,
        service.image_url,
        service.is_active
      ]);

      console.log(`✅ Added service: ${service.name}`);
    }

    console.log('\n🎉 Initial services added successfully!');
    console.log('ℹ️  You can now manage these services through the admin panel.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding services:', error);
    process.exit(1);
  }
}

addInitialServices();
