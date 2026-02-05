import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

async function addSuperAdminRole() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Adding super_admin role support...\n');
    
    // Check if role column exists and its type
    const checkColumn = await client.query(`
      SELECT data_type, column_default
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='role'
    `);
    
    if (checkColumn.rows.length === 0) {
      console.log('❌ Role column does not exist');
      return;
    }
    
    console.log('✅ Role column exists');
    console.log(`   Type: ${checkColumn.rows[0].data_type}`);
    
    // Create super admin user
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'superadmin@geethika.com';
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123';
    const superAdminName = 'Super Admin';
    
    // Check if super admin already exists
    const existingSuperAdmin = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [superAdminEmail]
    );
    
    if (existingSuperAdmin.rows.length > 0) {
      console.log('\n📝 Super Admin user already exists');
      console.log(`   Email: ${superAdminEmail}`);
      console.log(`   Current Role: ${existingSuperAdmin.rows[0].role}`);
      
      // Update to super_admin role
      await client.query(
        "UPDATE users SET role = 'super_admin' WHERE email = $1",
        [superAdminEmail]
      );
      
      console.log('✅ Updated to super_admin role');
    } else {
      // Create new super admin
      const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
      
      const result = await client.query(`
        INSERT INTO users (name, email, password, role, phone)
        VALUES ($1, $2, $3, 'super_admin', '0000000000')
        RETURNING id, name, email, role
      `, [superAdminName, superAdminEmail, hashedPassword]);
      
      console.log('\n✅ Super Admin created successfully!');
      console.log(`   ID: ${result.rows[0].id}`);
      console.log(`   Name: ${result.rows[0].name}`);
      console.log(`   Email: ${result.rows[0].email}`);
      console.log(`   Role: ${result.rows[0].role}`);
      console.log(`   Password: ${superAdminPassword}`);
    }
    
    console.log('\n📋 Super Admin Credentials:');
    console.log(`   Email: ${superAdminEmail}`);
    console.log(`   Password: ${superAdminPassword}`);
    console.log('\n🔐 IMPORTANT: Change the password after first login!');
    console.log('\n🌐 Login at: http://localhost:5173/admin/login');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addSuperAdminRole();
