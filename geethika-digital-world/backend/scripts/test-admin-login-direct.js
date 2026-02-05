import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

async function testAdminLogin() {
  try {
    console.log('Testing admin login credentials...\n');
    
    // Test credentials
    const testCredentials = [
      { email: 'superadmin@geethika.com', password: 'SuperAdmin@123' },
      { email: 'admin@geethikadigitalworld.com', password: 'Admin@123' }
    ];
    
    for (const cred of testCredentials) {
      console.log(`Testing: ${cred.email}`);
      
      const result = await pool.query(
        'SELECT id, name, email, password, role FROM users WHERE email = $1',
        [cred.email]
      );
      
      if (result.rows.length === 0) {
        console.log(`❌ User not found\n`);
        continue;
      }
      
      const user = result.rows[0];
      console.log(`✅ User found: ${user.name} (${user.role})`);
      
      const isPasswordValid = await bcrypt.compare(cred.password, user.password);
      
      if (isPasswordValid) {
        console.log(`✅ Password is correct`);
        console.log(`   Login credentials: ${cred.email} / ${cred.password}\n`);
      } else {
        console.log(`❌ Password is incorrect`);
        console.log(`   Trying to reset password...\n`);
        
        // Reset password
        const hashedPassword = await bcrypt.hash(cred.password, 10);
        await pool.query(
          'UPDATE users SET password = $1 WHERE id = $2',
          [hashedPassword, user.id]
        );
        
        console.log(`✅ Password reset successfully`);
        console.log(`   New credentials: ${cred.email} / ${cred.password}\n`);
      }
    }
    
    console.log('\n=== ADMIN LOGIN CREDENTIALS ===');
    console.log('\nSuper Admin:');
    console.log('Email: superadmin@geethika.com');
    console.log('Password: SuperAdmin@123');
    console.log('\nRegular Admin:');
    console.log('Email: admin@geethikadigitalworld.com');
    console.log('Password: Admin@123');
    console.log('\n================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing admin login:', error);
    process.exit(1);
  }
}

testAdminLogin();
