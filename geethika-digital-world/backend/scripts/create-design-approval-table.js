import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createDesignApprovalTable() {
  try {
    console.log('🎨 Creating design approval system...\n');

    // Create design_approvals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS design_approvals (
        id SERIAL PRIMARY KEY,
        order_item_id INTEGER REFERENCES order_items(id) ON DELETE CASCADE,
        customer_uploaded_images TEXT[],
        admin_designed_image TEXT,
        status VARCHAR(50) DEFAULT 'pending_design',
        customer_feedback TEXT,
        revision_count INTEGER DEFAULT 0,
        approved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Created design_approvals table');

    // Add index for faster queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_design_approvals_order_item 
      ON design_approvals(order_item_id);
    `);

    console.log('✅ Added indexes');

    // Add design_approval_id to order_items
    await pool.query(`
      ALTER TABLE order_items 
      ADD COLUMN IF NOT EXISTS design_approval_id INTEGER REFERENCES design_approvals(id);
    `);

    console.log('✅ Linked order_items to design_approvals');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Design Approval System Created!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📋 Design Approval Statuses:');
    console.log('  - pending_design: Waiting for admin to upload design');
    console.log('  - pending_approval: Design uploaded, waiting for customer approval');
    console.log('  - approved: Customer approved the design');
    console.log('  - revision_requested: Customer requested changes\n');

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error);
    await pool.end();
    process.exit(1);
  }
}

createDesignApprovalTable();
