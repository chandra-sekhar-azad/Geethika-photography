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

async function checkUser(email) {
  try {
    console.log('🔍 Checking for user:', email);
    console.log('📊 Database:', process.env.DB_NAME);
    
    // First, check table structure
    const tableInfo = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Users table columns:');
    tableInfo.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });
    
    // Now check for the user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (result.rows.length === 0) {
      console.log('❌ User not found in database');
    } else {
      console.log('✅ User found!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('User Details:');
      console.log(JSON.stringify(result.rows[0], null, 2));
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await pool.end();
  } catch (error) {
    console.error('❌ Error checking user:', error.message);
    await pool.end();
    process.exit(1);
  }
}

// Get email from command line or use default
const email = process.argv[2] || 'kandasagar2006@gmail.com';
checkUser(email);
