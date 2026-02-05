import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function setupAdmin() {
  try {
    console.log('\n🔧 Setting up admin user...\n');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@geethikadigitalworld.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const adminName = 'Admin';

    console.log(`📧 Admin Email: ${adminEmail}`);
    console.log(`🔑 Admin Password: ${adminPassword}\n`);

    // Check if admin already exists
    const existingAdmin = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [adminEmail]
    );

    if (existingAdmin.rows.length > 0) {
      console.log('⚠️  Admin user already exists!');
      console.log('📊 Current admin details:');
      console.log(`   ID: ${existingAdmin.rows[0].id}`);
      console.log(`   Name: ${existingAdmin.rows[0].name}`);
      console.log(`   Email: ${existingAdmin.rows[0].email}`);
      console.log(`   Role: ${existingAdmin.rows[0].role}`);
      
      // Update password to match .env
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await pool.query(
        'UPDATE users SET password = $1, role = $2 WHERE email = $3',
        [hashedPassword, 'admin', adminEmail]
      );
      console.log('\n✅ Admin password updated to match .env file');
    } else {
      // Create new admin
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const result = await pool.query(
        'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
        [adminEmail, hashedPassword, adminName, 'admin']
      );

      const admin = result.rows[0];
      console.log('✅ Admin user created successfully!');
      console.log('📊 Admin details:');
      console.log(`   ID: ${admin.id}`);
      console.log(`   Name: ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
    }

    console.log('\n🎉 Admin setup complete!');
    console.log(`\n🔗 Login at: http://localhost:5174/admin/login`);
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}\n`);

  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

setupAdmin();
