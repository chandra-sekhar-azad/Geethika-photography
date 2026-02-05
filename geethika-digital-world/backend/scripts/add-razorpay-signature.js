import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? {
    rejectUnauthorized: false
  } : false
});

async function addRazorpaySignature() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Adding razorpay_signature column...\n');

    // Check if column exists
    const result = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'razorpay_signature';
    `);

    if (result.rows.length === 0) {
      await client.query(`
        ALTER TABLE orders 
        ADD COLUMN razorpay_signature VARCHAR(255);
      `);
      console.log('✅ Added razorpay_signature column');
    } else {
      console.log('⏭️  razorpay_signature column already exists');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addRazorpaySignature();
