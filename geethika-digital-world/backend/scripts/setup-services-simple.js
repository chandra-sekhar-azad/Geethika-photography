import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const { Pool } = pg;

async function setupServices() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔄 Setting up services table...');

    // Read SQL file
    const sqlFile = join(__dirname, 'setup-services.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Execute SQL
    await pool.query(sql);

    console.log('✅ Services table created successfully!');
    console.log('✅ Initial services added!');
    console.log('\n📋 Services added:');
    console.log('  • Photography');
    console.log('  • Videography');
    console.log('  • Event Decor');
    console.log('  • Home Redecor');
    console.log('  • Shop Redecor');
    console.log('  • Return Gifts');
    console.log('\n🎉 Setup complete! You can now manage services through the admin panel.');

  } catch (error) {
    console.error('❌ Error setting up services:', error.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

setupServices();
