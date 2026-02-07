import pool from '../config/database.js';

async function addDesignApprovalSystem() {
  const client = await pool.connect();
  
  try {
    console.log('🎨 Adding design approval system...');

    // Add design columns to orders table
    await client.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS design_url TEXT,
      ADD COLUMN IF NOT EXISTS design_status VARCHAR(20) DEFAULT 'pending' CHECK (design_status IN ('pending', 'uploaded', 'approved', 'rejected')),
      ADD COLUMN IF NOT EXISTS design_uploaded_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS design_approved_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS design_notes TEXT
    `);

    console.log('✅ Design approval columns added to orders table');

    // Create design_history table for tracking design changes
    await client.query(`
      CREATE TABLE IF NOT EXISTS design_history (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        design_url TEXT NOT NULL,
        status VARCHAR(20) NOT NULL,
        notes TEXT,
        uploaded_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Design history table created');

    console.log('🎉 Design approval system setup complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    client.release();
  }
}

addDesignApprovalSystem()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
