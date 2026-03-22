import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

console.log('\n🔍 Checking Database Connection...\n');
console.log('📡 Host:', process.env.DB_HOST);
console.log('🗄️  DB Name:', process.env.DB_NAME);
console.log('👤 User:', process.env.DB_USER);
console.log('🔗 URL:', process.env.DATABASE_URL ? 'Present ✅' : 'Missing ❌');
console.log('');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 20000,
  idleTimeoutMillis: 10000,
});

async function testDB() {
  let client;
  try {
    console.log('⏳ Connecting to database...');
    client = await pool.connect();
    console.log('✅ DATABASE IS RUNNING!\n');

    // Check pg version
    const versionRes = await client.query('SELECT version()');
    console.log('📦 PostgreSQL:', versionRes.rows[0].version.split(' ').slice(0,2).join(' '));

    // Check users table
    const usersRes = await client.query('SELECT COUNT(*) FROM users');
    console.log('👥 Total Users:', usersRes.rows[0].count);

    // Check admin users
    const adminRes = await client.query("SELECT id, email, name, role FROM users WHERE role IN ('admin', 'super_admin')");
    if (adminRes.rows.length > 0) {
      console.log('\n🔐 Admin Users Found:');
      adminRes.rows.forEach(u => {
        console.log(`   📧 ${u.email} | Role: ${u.role} | Name: ${u.name}`);
      });
    } else {
      console.log('\n❌ NO ADMIN USERS FOUND IN DATABASE!');
      console.log('   Run: node scripts/setup-admin-user.js to create one');
    }

  } catch (err) {
    console.error('❌ DATABASE CONNECTION FAILED!');
    console.error('   Error:', err.message);
    if (err.message.includes('timeout')) {
      console.error('\n💡 Possible causes:');
      console.error('   - Render free DB is suspended (inactive for 90 days)');
      console.error('   - Firewall blocking port 5432');
      console.error('   - Wrong DATABASE_URL in .env');
    } else if (err.message.includes('password')) {
      console.error('\n💡 Wrong password or username!');
    } else if (err.message.includes('does not exist')) {
      console.error('\n💡 Database does not exist!');
    }
  } finally {
    if (client) client.release();
    await pool.end();
    process.exit(0);
  }
}

testDB();
