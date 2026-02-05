import pool from '../config/database.js';

async function addShippingInfoColumn() {
  const client = await pool.connect();
  
  try {
    console.log('Adding shipping_info column to orders table...');
    
    // Check if column already exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='orders' AND column_name='shipping_info'
    `);
    
    if (checkColumn.rows.length > 0) {
      console.log('✅ shipping_info column already exists');
      return;
    }
    
    // Add the column
    await client.query(`
      ALTER TABLE orders 
      ADD COLUMN shipping_info JSONB
    `);
    
    console.log('✅ Successfully added shipping_info column');
    
  } catch (error) {
    console.error('❌ Error adding shipping_info column:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addShippingInfoColumn();
