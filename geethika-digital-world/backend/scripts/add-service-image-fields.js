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

async function addServiceImageFields() {
  try {
    console.log('🔄 Adding image fields to services table...\n');

    // Check if columns already exist
    const checkColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'services' 
      AND column_name IN ('image_url', 'image_public_id', 'price_range')
    `);

    const existingColumns = checkColumns.rows.map(row => row.column_name);

    if (!existingColumns.includes('image_url')) {
      await pool.query(`
        ALTER TABLE services 
        ADD COLUMN image_url TEXT
      `);
      console.log('✅ Added image_url column');
    } else {
      console.log('⏭️  image_url column already exists');
    }

    if (!existingColumns.includes('image_public_id')) {
      await pool.query(`
        ALTER TABLE services 
        ADD COLUMN image_public_id TEXT
      `);
      console.log('✅ Added image_public_id column');
    } else {
      console.log('⏭️  image_public_id column already exists');
    }

    if (!existingColumns.includes('price_range')) {
      await pool.query(`
        ALTER TABLE services 
        ADD COLUMN price_range VARCHAR(100)
      `);
      console.log('✅ Added price_range column');
    } else {
      console.log('⏭️  price_range column already exists');
    }

    console.log('\n✅ Migration completed successfully!');
    await pool.end();
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    await pool.end();
    process.exit(1);
  }
}

addServiceImageFields();
