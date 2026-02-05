import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? {
    rejectUnauthorized: false
  } : false
});

async function fixOrdersTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Fixing orders table...\n');

    // Check current columns
    const columnsResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders'
      ORDER BY ordinal_position;
    `);
    
    console.log('Current columns:', columnsResult.rows.map(r => r.column_name).join(', '));

    // Add missing columns if they don't exist
    const columnsToAdd = [
      { name: 'shipping_cost', type: 'DECIMAL(10, 2)', default: '0' },
      { name: 'discount', type: 'DECIMAL(10, 2)', default: '0' },
      { name: 'city', type: 'VARCHAR(100)', default: null },
      { name: 'state', type: 'VARCHAR(100)', default: null },
      { name: 'pincode', type: 'VARCHAR(10)', default: null },
      { name: 'order_type', type: 'VARCHAR(20)', default: "'online'" },
      { name: 'notes', type: 'TEXT', default: null }
    ];

    for (const col of columnsToAdd) {
      const exists = columnsResult.rows.some(r => r.column_name === col.name);
      
      if (!exists) {
        const defaultClause = col.default ? `DEFAULT ${col.default}` : '';
        await client.query(`
          ALTER TABLE orders 
          ADD COLUMN IF NOT EXISTS ${col.name} ${col.type} ${defaultClause};
        `);
        console.log(`✅ Added column: ${col.name}`);
      } else {
        console.log(`⏭️  Column already exists: ${col.name}`);
      }
    }

    // Verify the fix
    const updatedColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n✅ Updated columns:', updatedColumns.rows.map(r => r.column_name).join(', '));
    console.log('\n✅ Orders table fixed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

fixOrdersTable();
