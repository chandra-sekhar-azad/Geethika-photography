import pool from '../config/database.js';

async function checkCustomers() {
  try {
    console.log('🔍 Checking customers in database...\n');

    // Check total users
    const usersResult = await pool.query(`
      SELECT COUNT(*) as total, role 
      FROM users 
      GROUP BY role
    `);
    
    console.log('📊 Users by role:');
    usersResult.rows.forEach(row => {
      console.log(`   ${row.role}: ${row.total}`);
    });

    // Check customers specifically
    const customersResult = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.role,
        u.created_at,
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(o.total), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.email = o.customer_email OR u.phone = o.customer_phone
      WHERE u.role = 'customer'
      GROUP BY u.id, u.name, u.email, u.phone, u.role, u.created_at
      ORDER BY u.created_at DESC
    `);

    console.log(`\n✅ Total customers: ${customersResult.rows.length}\n`);
    
    if (customersResult.rows.length > 0) {
      console.log('📋 Customer details:');
      customersResult.rows.forEach((customer, index) => {
        console.log(`\n${index + 1}. ${customer.name}`);
        console.log(`   Email: ${customer.email}`);
        console.log(`   Phone: ${customer.phone}`);
        console.log(`   Orders: ${customer.total_orders}`);
        console.log(`   Total Spent: ₹${customer.total_spent}`);
        console.log(`   Joined: ${new Date(customer.created_at).toLocaleDateString()}`);
      });
    } else {
      console.log('⚠️  No customers found in database');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkCustomers();
