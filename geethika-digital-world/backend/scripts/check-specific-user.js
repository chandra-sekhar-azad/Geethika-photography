import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkUser() {
  const email = 'durga@gmail.com';
  const testPassword = 'Durga@123'; // Try this password

  console.log('\n' + '═'.repeat(80));
  console.log('  🔍 CHECKING USER: ' + email);
  console.log('═'.repeat(80) + '\n');

  try {
    // Check if user exists
    const result = await pool.query(
      'SELECT id, email, password, name, phone, role, created_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.log('❌ User NOT found in database!');
      console.log('   This means registration did not save the user.\n');
      return;
    }

    const user = result.rows[0];
    console.log('✅ User found in database!\n');
    console.log('User Details:');
    console.log('  ID:', user.id);
    console.log('  Email:', user.email);
    console.log('  Name:', user.name);
    console.log('  Phone:', user.phone);
    console.log('  Role:', user.role);
    console.log('  Created:', new Date(user.created_at).toLocaleString());
    console.log('  Password Hash:', user.password.substring(0, 20) + '...');
    console.log('\n' + '═'.repeat(80) + '\n');

    // Test password
    console.log('🔐 Testing Password...\n');
    console.log('Testing password:', testPassword);
    
    const isValid = await bcrypt.compare(testPassword, user.password);
    
    if (isValid) {
      console.log('✅ Password is CORRECT!');
      console.log('   Login should work with this password.\n');
    } else {
      console.log('❌ Password is INCORRECT!');
      console.log('   The password hash in database does not match.\n');
      console.log('Possible issues:');
      console.log('  1. Password was not hashed correctly during registration');
      console.log('  2. Different password was used during registration');
      console.log('  3. Password field is empty or corrupted\n');
    }

    console.log('═'.repeat(80) + '\n');

    // Try common passwords
    console.log('🔍 Testing common passwords...\n');
    const commonPasswords = [
      'Durga@123',
      'durga@123',
      'Durga123',
      'durga123',
      'Durga@1234',
      '12345678'
    ];

    for (const pwd of commonPasswords) {
      const match = await bcrypt.compare(pwd, user.password);
      if (match) {
        console.log(`✅ FOUND! Password is: "${pwd}"`);
        break;
      } else {
        console.log(`❌ Not: "${pwd}"`);
      }
    }

    console.log('\n' + '═'.repeat(80) + '\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkUser();
