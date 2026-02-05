import pool from '../config/database.js';

async function checkAdminUsers() {
  try {
    console.log('Checking admin users in database...\n');
    
    const result = await pool.query(`
      SELECT id, name, email, role, created_at 
      FROM users 
      WHERE role IN ('admin', 'super_admin')
      ORDER BY created_at DESC
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ No admin users found in database!');
      console.log('\nTo create an admin user, run:');
      console.log('node scripts/create-admin.js');
    } else {
      console.log(`✅ Found ${result.rows.length} admin user(s):\n`);
      result.rows.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${user.created_at}`);
        console.log('');
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking admin users:', error);
    process.exit(1);
  }
}

checkAdminUsers();
