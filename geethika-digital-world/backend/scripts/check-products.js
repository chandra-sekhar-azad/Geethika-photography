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

async function checkProducts() {
  try {
    const result = await pool.query('SELECT id, name, image_url FROM products LIMIT 3');
    console.log('Sample products:');
    console.log(JSON.stringify(result.rows, null, 2));
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    await pool.end();
  }
}

checkProducts();
