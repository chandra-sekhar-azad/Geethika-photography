import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const categories = [
  { name: 'Personalised Gifts', icon: '🎁' },
  { name: 'Couple Gifts', icon: '💑' },
  { name: 'T-Shirts', icon: '👕' },
  { name: 'Plants', icon: '🌱' },
  { name: 'Photo Frames', icon: '🖼️' },
  { name: 'Printing Works', icon: '🖨️' },
  { name: 'Interior Gifts & Decor Items', icon: '🏠' },
  { name: 'Photography & Videography', icon: '📸' },
  { name: 'Event Decor', icon: '🎉' },
  { name: 'Home Redecor', icon: '🏡' },
  { name: 'Shop Redecor', icon: '🏪' },
  { name: 'Cakes', icon: '🎂' },
  { name: 'Flower Bouquets', icon: '💐' },
  { name: 'Chocolate Bouquets', icon: '🍫' },
  { name: 'Event Needs', icon: '🎪' },
  { name: 'Return Gifts', icon: '🎁' }
];

async function addCategories() {
  try {
    console.log('🔄 Adding categories to database...\n');

    // Check if categories table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'categories'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('📋 Creating categories table...');
      await pool.query(`
        CREATE TABLE categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          slug VARCHAR(100) NOT NULL UNIQUE,
          icon VARCHAR(10),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Categories table created\n');
    }

    let addedCount = 0;
    let skippedCount = 0;

    for (const category of categories) {
      const slug = category.name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/&/g, 'and');

      try {
        // Check if category already exists
        const existing = await pool.query(
          'SELECT id FROM categories WHERE name = $1 OR slug = $2',
          [category.name, slug]
        );

        if (existing.rows.length > 0) {
          console.log(`⏭️  Skipped: ${category.name} (already exists)`);
          skippedCount++;
        } else {
          await pool.query(
            'INSERT INTO categories (name, slug, icon) VALUES ($1, $2, $3)',
            [category.name, slug, category.icon]
          );
          console.log(`✅ Added: ${category.icon} ${category.name}`);
          addedCount++;
        }
      } catch (error) {
        console.error(`❌ Failed to add ${category.name}:`, error.message);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Categories added: ${addedCount}`);
    console.log(`⏭️  Categories skipped: ${skippedCount}`);
    console.log(`📊 Total categories: ${addedCount + skippedCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Display all categories
    const allCategories = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    console.log('📋 All Categories in Database:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    allCategories.rows.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.icon} ${cat.name} (${cat.slug})`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

addCategories();
