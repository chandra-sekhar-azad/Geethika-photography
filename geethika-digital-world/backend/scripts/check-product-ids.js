import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkProducts() {
  try {
    const result = await pool.query('SELECT id, name, price FROM products ORDER BY id');
    console.log('\n=== Products in Database ===\n');
    result.rows.forEach(product => {
      console.log(`ID: ${product.id} | Name: ${product.name} | Price: ₹${product.price}`);
    });
    console.log(`\nTotal products: ${result.rows.length}\n`);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkProducts();
