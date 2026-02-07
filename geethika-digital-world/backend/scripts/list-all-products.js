import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function listProducts() {
  const result = await pool.query('SELECT id, name, image_url FROM products ORDER BY id');
  console.log('\n📋 All Products in Database:\n');
  result.rows.forEach(p => {
    console.log(`${p.id}. ${p.name}`);
    console.log(`   Image: ${p.image_url}\n`);
  });
  await pool.end();
}

listProducts();
