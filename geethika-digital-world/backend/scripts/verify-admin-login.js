import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

async function verifyAdminLogin() {
  console.log('\n🔍 ADMIN LOGIN VERIFICATION\n');
  console.log('='.repeat(50));
  
  try {
    // Step 1: Check database connection
    console.log('\n1️⃣  Checking database connection...');
    await pool.query('SELECT 1');
    console.log('   ✅ Database connected');
    
    // Step 2: Check JWT secret
    console.log('\n2️⃣  Checking JWT secret...');
    if (!process.env.JWT_SECRET) {
      console.log('   ❌ JWT_SECRET not found in .env');
      console.log('   Add: JWT_SECRET=your-secret-key-here');
      process.exit(1);
    }
    console.log('   ✅ JWT_SECRET configured');
    
    // Step 3: Check admin users
    console.log('\n3️⃣  Checking admin users...');
    const admins = await pool.query(`
      SELECT id, name, email, role 
      FROM users 
      WHERE role IN ('admin', 'super_admin')
    `);
    
    if (admins.rows.length === 0) {
      console.log('   ❌ No admin users found');
      console.log('   Run: node scripts/create-admin.js');
      process.exit(1);
    }
    
    console.log(`   ✅ Found ${admins.rows.length} admin user(s)`);
    
    // Step 4: Test login for each admin
    console.log('\n4️⃣  Testing login credentials...\n');
    
    const testCreds = [
      { email: 'superadmin@geethika.com', password: 'SuperAdmin@123', name: 'Super Admin' },
      { email: 'admin@geethikadigitalworld.com', password: 'Admin@123', name: 'Regular Admin' }
    ];
    
    for (const cred of testCreds) {
      console.log(`   Testing: ${cred.name}`);
      console.log(`   Email: ${cred.email}`);
      
      const user = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [cred.email]
      );
      
      if (user.rows.length === 0) {
        console.log('   ❌ User not found\n');
        continue;
      }
      
      const isValid = await bcrypt.compare(cred.password, user.rows[0].password);
      
      if (!isValid) {
        console.log('   ❌ Password incorrect - Resetting...');
        const hashedPassword = await bcrypt.hash(cred.password, 10);
        await pool.query(
          'UPDATE users SET password = $1 WHERE id = $2',
          [hashedPassword, user.rows[0].id]
        );
        console.log('   ✅ Password reset successfully');
      } else {
        console.log('   ✅ Password correct');
      }
      
      // Test JWT generation
      const token = jwt.sign(
        { id: user.rows[0].id, email: user.rows[0].email, role: user.rows[0].role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      console.log('   ✅ JWT token generated');
      console.log(`   Password: ${cred.password}\n`);
    }
    
    // Step 5: Summary
    console.log('='.repeat(50));
    console.log('\n✅ VERIFICATION COMPLETE\n');
    console.log('📋 LOGIN CREDENTIALS:\n');
    console.log('Super Admin:');
    console.log('  Email: superadmin@geethika.com');
    console.log('  Password: SuperAdmin@123');
    console.log('  URL: http://localhost:5173/admin/login\n');
    console.log('Regular Admin:');
    console.log('  Email: admin@geethikadigitalworld.com');
    console.log('  Password: Admin@123');
    console.log('  URL: http://localhost:5173/admin/login\n');
    console.log('='.repeat(50));
    console.log('\n🚀 Start servers:');
    console.log('   Backend: cd backend && npm start');
    console.log('   Frontend: cd client && npm run dev\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    process.exit(1);
  }
}

verifyAdminLogin();
