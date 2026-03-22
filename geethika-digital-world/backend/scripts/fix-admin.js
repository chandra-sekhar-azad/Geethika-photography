import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
});

async function fixAdmin() {
  console.log('\n🔧 Fixing admin user...\n');
  console.log('📧 Email:', process.env.ADMIN_EMAIL);
  console.log('🔑 Password:', process.env.ADMIN_PASSWORD);
  console.log('🌐 DB:', process.env.DATABASE_URL ? 'Connected via URL' : 'No URL found');

  try {
    const client = await pool.connect();
    console.log('\n✅ Database connected!\n');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@geethikadigitalworld.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check existing
    const existing = await client.query('SELECT id, email, role FROM users WHERE email = $1', [adminEmail]);

    if (existing.rows.length > 0) {
      console.log('⚠️  Admin already exists. Updating password and role...');
      await client.query(
        'UPDATE users SET password = $1, role = $2 WHERE email = $3',
        [hashedPassword, 'admin', adminEmail]
      );
      console.log('✅ Admin password reset successfully!');
    } else {
      console.log('Creating new admin user...');
      const result = await client.query(
        'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
        [adminEmail, hashedPassword, 'Admin', 'admin']
      );
      console.log('✅ Admin created:', result.rows[0]);
    }

    console.log('\n🎉 Done! Login with:');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    console.log('   URL: http://localhost:5173/admin/login\n');

    client.release();
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
  }
}

fixAdmin();
