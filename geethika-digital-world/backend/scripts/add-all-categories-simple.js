import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const { Pool } = pg;

async function addCategories() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔄 Adding all product categories...\n');

    const categories = [
      { 
        name: 'Personalised Gifts', 
        slug: 'personalised-gifts', 
        description: 'Custom and personalized gifts for every occasion - photo frames, mugs, t-shirts, and more',
        icon: '🎁'
      },
      { 
        name: 'Couple Gifts', 
        slug: 'couple-gifts', 
        description: 'Special gifts for couples and romantic occasions - matching items, couple sets, and romantic hampers',
        icon: '💑'
      },
      { 
        name: 'T-Shirts', 
        slug: 't-shirts', 
        description: 'Custom printed t-shirts for all occasions - birthdays, events, couples, and personalized designs',
        icon: '👕'
      },
      { 
        name: 'Plants', 
        slug: 'plants', 
        description: 'Indoor and decorative plants - succulents, air purifying plants, and beautiful planters',
        icon: '🌱'
      },
      { 
        name: 'Photo Frames', 
        slug: 'photo-frames', 
        description: 'Beautiful frames for your memories - single frames, collage frames, and custom designs',
        icon: '🖼️'
      },
      { 
        name: 'Printing Works', 
        slug: 'printing-works', 
        description: 'Professional printing services - invitation cards, business cards, posters, banners, and more',
        icon: '🖨️'
      },
      { 
        name: 'Interior Gifts & Decor', 
        slug: 'interior-decor', 
        description: 'Home decoration and interior items - wall hangings, showpieces, LED lights, and decorative pieces',
        icon: '🏠'
      },
      { 
        name: 'Cakes', 
        slug: 'cakes', 
        description: 'Delicious cakes for all celebrations - birthday cakes, photo cakes, designer cakes, and more',
        icon: '🎂'
      },
      { 
        name: 'Flower Bouquets', 
        slug: 'flower-bouquets', 
        description: 'Fresh flower arrangements - roses, mixed bouquets, orchids, and seasonal flowers',
        icon: '💐'
      },
      { 
        name: 'Chocolate Bouquets', 
        slug: 'chocolate-bouquets', 
        description: 'Sweet chocolate arrangements - Ferrero Rocher, Dairy Milk, and premium chocolate hampers',
        icon: '🍫'
      },
      { 
        name: 'Event Needs', 
        slug: 'event-needs', 
        description: 'Everything you need for your events - balloons, banners, party supplies, and decorations',
        icon: '🎉'
      }
    ];

    let addedCount = 0;
    let skippedCount = 0;

    for (const category of categories) {
      try {
        // Check if category already exists
        const existing = await pool.query(
          'SELECT id FROM categories WHERE slug = $1',
          [category.slug]
        );

        if (existing.rows.length > 0) {
          console.log(`⏭️  Category "${category.name}" already exists, skipping...`);
          skippedCount++;
          continue;
        }

        // Insert category
        await pool.query(
          'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3)',
          [category.name, category.slug, category.description]
        );
        
        console.log(`✅ Added category: ${category.icon} ${category.name}`);
        addedCount++;
      } catch (error) {
        console.error(`❌ Error adding ${category.name}:`, error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log(`   ✅ Added: ${addedCount} categories`);
    console.log(`   ⏭️  Skipped: ${skippedCount} categories (already exist)`);
    console.log(`   📦 Total: ${categories.length} categories`);
    console.log('='.repeat(60));
    
    console.log('\n🎉 Category setup complete!');
    console.log('ℹ️  You can now add products to these categories through the admin panel.');
    console.log('📍 Admin Panel: http://localhost:5175/admin/products\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

addCategories();
