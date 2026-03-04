import pool from '../config/database.js';

async function addSpecialOfferField() {
  try {
    console.log('Adding special_offer field to products table...');

    // Check if column already exists
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      AND column_name = 'special_offer'
    `);

    if (checkColumn.rows.length > 0) {
      console.log('✓ special_offer column already exists');
      return;
    }

    // Add special_offer column
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN special_offer BOOLEAN DEFAULT false
    `);

    console.log('✓ Successfully added special_offer field to products table');
    console.log('✓ Products can now be marked for Special Offers section');

  } catch (error) {
    console.error('Error adding special_offer field:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

addSpecialOfferField();
