import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

async function createTestCustomer() {
  try {
    console.log('👤 Creating test customer...\n');

    const hashedPassword = await bcrypt.hash('Test@123', 10);

    const result = await pool.query(`
      INSERT INTO users (name, email, phone, password, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE 
      SET name = EXCLUDED.name, phone = EXCLUDED.phone
      RETURNING id, name, email, phone, role, created_at
    `, [
      'Test Customer',
      'testcustomer@example.com',
      '9876543210',
      hashedPassword,
      'customer'
    ]);

    console.log('✅ Test customer created successfully!\n');
    console.log('📋 Customer details:');
    console.log(`   ID: ${result.rows[0].id}`);
    console.log(`   Name: ${result.rows[0].name}`);
    console.log(`   Email: ${result.rows[0].email}`);
    console.log(`   Phone: ${result.rows[0].phone}`);
    console.log(`   Role: ${result.rows[0].role}`);
    console.log(`   Created: ${new Date(result.rows[0].created_at).toLocaleString()}`);
    console.log('\n💡 You can login with:');
    console.log(`   Email: testcustomer@example.com`);
    console.log(`   Password: Test@123`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

createTestCustomer();
