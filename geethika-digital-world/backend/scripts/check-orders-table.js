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

async function checkOrdersTable() {
  try {
    console.log('🔄 Checking orders table...\n');

    // Check if orders table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'orders'
      );
    `);
    
    console.log('Orders table exists:', tableCheck.rows[0].exists);

    if (tableCheck.rows[0].exists) {
      // Get table structure
      const structure = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'orders'
        ORDER BY ordinal_position;
      `);
      
      console.log('\nOrders table structure:');
      structure.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });

      // Check order_items table
      const itemsCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'order_items'
        );
      `);
      
      console.log('\nOrder items table exists:', itemsCheck.rows[0].exists);
    }

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    await pool.end();
    process.exit(1);
  }
}

checkOrdersTable();
