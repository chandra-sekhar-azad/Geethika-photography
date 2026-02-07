import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testRegistration() {
  const email = 'roastguru11@gmail.com';
  const password = 'password@123';
  const name = 'sagar';
  const phone = '9492686421';

  try {
    console.log('🧪 Testing registration process...\n');
    
    // Step 1: Check if user exists
    console.log('Step 1: Checking if user exists...');
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    console.log(`✅ User exists check: ${existingUser.rows.length > 0 ? 'User already exists' : 'User does not exist'}`);

    if (existingUser.rows.length > 0) {
      console.log('⚠️ User already registered. Skipping insertion.');
      console.log('Existing user:', existingUser.rows[0]);
      await pool.end();
      return;
    }

    // Step 2: Hash password
    console.log('\nStep 2: Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed successfully');

    // Step 3: Insert user
    console.log('\nStep 3: Inserting user into database...');
    console.log('Data:', { email, name, phone });
    
    const result = await pool.query(
      'INSERT INTO users (email, password, name, phone) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at',
      [email, hashedPassword, name, phone]
    );

    console.log('✅ User inserted successfully!');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Created User:');
    console.log(JSON.stringify(result.rows[0], null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await pool.end();
  } catch (error) {
    console.error('\n❌ Registration test failed!');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error detail:', error.detail);
    console.error('\nFull error:', error);
    await pool.end();
    process.exit(1);
  }
}

testRegistration();
