import pool from '../config/database.js';

async function checkUsersTable() {
  try {
    console.log('Checking users table structure...\n');
    
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    console.log('Users table columns:');
    result.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : '(nullable)'}`);
    });
    
    console.log('\nChecking sample user data...');
    const userData = await pool.query('SELECT id, email, name, phone, role FROM users LIMIT 3');
    console.log('\nSample users:');
    userData.rows.forEach(user => {
      console.log(`- ID: ${user.id}, Email: ${user.email}, Name: ${user.name || 'NULL'}, Phone: ${user.phone || 'NULL'}, Role: ${user.role}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkUsersTable();
