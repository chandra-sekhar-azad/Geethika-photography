import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? {
    rejectUnauthorized: false
  } : false
});

async function verifyAdmin() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Verifying admin user...\n');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@geethikadigitalworld.com';

    // Check if admin user exists
    const result = await client.query(
      'SELECT id, name, email, role FROM users WHERE email = $1',
      [adminEmail]
    );

    if (result.rows.length === 0) {
      console.log('❌ Admin user not found!');
      console.log(`\nNo user found with email: ${adminEmail}`);
      console.log('\n💡 To create admin user, run:');
      console.log('   node scripts/create-admin.js');
      return;
    }

    const admin = result.rows[0];
    console.log('✅ Admin user found!');
    console.log('\nAdmin Details:');
    console.log('  ID:', admin.id);
    console.log('  Name:', admin.name);
    console.log('  Email:', admin.email);
    console.log('  Role:', admin.role);

    // Verify role is admin
    if (admin.role !== 'admin') {
      console.log('\n⚠️  WARNING: User role is not "admin"!');
      console.log('   Current role:', admin.role);
      console.log('\n💡 To fix, run this SQL:');
      console.log(`   UPDATE users SET role = 'admin' WHERE email = '${adminEmail}';`);
    } else {
      console.log('\n✅ User has admin role');
    }

    // Test login
    console.log('\n🔄 Testing login...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@123'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful!');
      console.log('   Token generated:', loginData.token.substring(0, 20) + '...');
      console.log('\n✅ Everything is working correctly!');
      console.log('\n💡 If you still get 401 errors in the browser:');
      console.log('   1. Open browser DevTools (F12)');
      console.log('   2. Go to Console tab');
      console.log('   3. Run: localStorage.clear()');
      console.log('   4. Go to http://localhost:5174/admin/login');
      console.log('   5. Login with:');
      console.log(`      Email: ${adminEmail}`);
      console.log(`      Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    } else {
      const error = await loginResponse.json();
      console.log('❌ Login failed!');
      console.log('   Error:', error.error);
      console.log('\n💡 This might be a password issue.');
      console.log('   Try resetting the admin password with:');
      console.log('   node scripts/create-admin.js');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

verifyAdmin();
