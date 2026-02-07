import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkAllUsers() {
  console.log('\n' + '═'.repeat(80));
  console.log('  🔍 CHECKING ALL USERS IN PRODUCTION DATABASE');
  console.log('═'.repeat(80) + '\n');

  try {
    // Check database connection
    console.log('📡 Connecting to database...');
    const testConnection = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully\n');
    console.log('═'.repeat(80) + '\n');

    // Get all users
    console.log('👥 FETCHING ALL USERS...\n');
    const result = await pool.query(`
      SELECT 
        id,
        email,
        role,
        name,
        phone,
        created_at,
        updated_at
      FROM users
      ORDER BY 
        CASE 
          WHEN role = 'super_admin' THEN 1
          WHEN role = 'admin' THEN 2
          WHEN role = 'customer' THEN 3
          ELSE 4
        END,
        created_at DESC
    `);

    if (result.rows.length === 0) {
      console.log('❌ No users found in database!\n');
      return;
    }

    console.log(`✅ Found ${result.rows.length} users\n`);
    console.log('═'.repeat(80) + '\n');

    // Group users by role
    const usersByRole = {
      super_admin: [],
      admin: [],
      customer: []
    };

    result.rows.forEach(user => {
      if (usersByRole[user.role]) {
        usersByRole[user.role].push(user);
      }
    });

    // Display Super Admins
    if (usersByRole.super_admin.length > 0) {
      console.log('👑 SUPER ADMINS (' + usersByRole.super_admin.length + ')');
      console.log('─'.repeat(80));
      usersByRole.super_admin.forEach((user, index) => {
        console.log(`\n${index + 1}. ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.name || 'Not set'}`);
        console.log(`   Phone: ${user.phone || 'Not set'}`);
        console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
      });
      console.log('\n' + '═'.repeat(80) + '\n');
    }

    // Display Regular Admins
    if (usersByRole.admin.length > 0) {
      console.log('🔧 REGULAR ADMINS (' + usersByRole.admin.length + ')');
      console.log('─'.repeat(80));
      usersByRole.admin.forEach((user, index) => {
        console.log(`\n${index + 1}. ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.name || 'Not set'}`);
        console.log(`   Phone: ${user.phone || 'Not set'}`);
        console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
      });
      console.log('\n' + '═'.repeat(80) + '\n');
    }

    // Display Customers
    if (usersByRole.customer.length > 0) {
      console.log('👤 CUSTOMERS (' + usersByRole.customer.length + ')');
      console.log('─'.repeat(80));
      
      // Show first 10 customers
      const customersToShow = usersByRole.customer.slice(0, 10);
      customersToShow.forEach((user, index) => {
        console.log(`\n${index + 1}. ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.name || 'Not set'}`);
        console.log(`   Phone: ${user.phone || 'Not set'}`);
        console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
      });

      if (usersByRole.customer.length > 10) {
        console.log(`\n... and ${usersByRole.customer.length - 10} more customers`);
      }
      console.log('\n' + '═'.repeat(80) + '\n');
    }

    // Summary
    console.log('📊 SUMMARY');
    console.log('─'.repeat(80));
    console.log(`Total Users: ${result.rows.length}`);
    console.log(`  • Super Admins: ${usersByRole.super_admin.length}`);
    console.log(`  • Regular Admins: ${usersByRole.admin.length}`);
    console.log(`  • Customers: ${usersByRole.customer.length}`);
    console.log('\n' + '═'.repeat(80) + '\n');

    // Admin credentials reminder
    console.log('🔐 ADMIN LOGIN CREDENTIALS');
    console.log('─'.repeat(80));
    console.log('\nSuper Admin:');
    console.log('  Email: superadmin@geethika.com');
    console.log('  Password: SuperAdmin@123');
    console.log('\nRegular Admin:');
    console.log('  Email: admin@geethikadigitalworld.com');
    console.log('  Password: Admin@123');
    console.log('\n' + '═'.repeat(80) + '\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await pool.end();
    console.log('✅ Database connection closed\n');
  }
}

checkAllUsers();
