import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Check if DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

async function addServiceChargeColumn() {
  let client;
  try {
    console.log('🔄 Adding service_charge column to orders table...\n');
    console.log('📡 Connecting to database...');

    client = await pool.connect();
    console.log('✅ Connected to database');

    // Check if column already exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='orders' AND column_name='service_charge';
    `);

    if (checkColumn.rows.length > 0) {
      console.log('ℹ️  service_charge column already exists');
    } else {
      // Add service_charge column
      await client.query(`
        ALTER TABLE orders 
        ADD COLUMN service_charge DECIMAL(10, 2) DEFAULT 0;
      `);
      console.log('✅ service_charge column added successfully!');
    }

    client.release();
    await pool.end();
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (client) client.release();
    await pool.end();
    process.exit(1);
  }
}

addServiceChargeColumn();
