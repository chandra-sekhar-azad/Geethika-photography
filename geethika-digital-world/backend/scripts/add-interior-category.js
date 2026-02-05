import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const { Pool } = pg;

async function addCategory() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await pool.query(
      "INSERT INTO categories (name, slug) VALUES ('Interior Gifts & Decor', 'interior-decor') ON CONFLICT (slug) DO NOTHING"
    );
    console.log('✅ Added Interior Gifts & Decor category');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

addCategory();
