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

async function checkProductConstraints() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Checking product constraints...\n');

    // Check foreign key constraints on products table
    const constraints = await client.query(`
      SELECT
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND (tc.table_name = 'products' OR ccu.table_name = 'products');
    `);

    if (constraints.rows.length === 0) {
      console.log('✅ No foreign key constraints found on products table');
    } else {
      console.log('Foreign key constraints:');
      constraints.rows.forEach(row => {
        console.log(`  - ${row.table_name}.${row.column_name} -> ${row.foreign_table_name}.${row.foreign_column_name}`);
      });
    }

    // Check if product ID 6 exists
    const productId = 6;
    const product = await client.query('SELECT * FROM products WHERE id = $1', [productId]);
    
    if (product.rows.length === 0) {
      console.log(`\n⚠️  Product ID ${productId} does not exist`);
    } else {
      console.log(`\n✅ Product ID ${productId} exists:`, product.rows[0].name);
      
      // Check if it's referenced in order_items
      const orderItems = await client.query(
        'SELECT COUNT(*) FROM order_items WHERE product_id = $1',
        [productId]
      );
      
      console.log(`   Referenced in ${orderItems.rows[0].count} order items`);
      
      if (parseInt(orderItems.rows[0].count) > 0) {
        console.log('\n⚠️  This product is referenced in orders and cannot be deleted!');
        console.log('   Solution: Set is_active = false instead of deleting');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkProductConstraints();
