import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to load .env from parent directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function addImageColumn() {
    try {
        console.log('🔄 Checking categories table schema...');

        // Check if image_url column exists
        const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'categories' AND column_name = 'image_url';
    `);

        if (columnCheck.rows.length === 0) {
            console.log('📝 Adding image_url column to categories table...');
            await pool.query(`
        ALTER TABLE categories 
        ADD COLUMN image_url VARCHAR(255);
      `);
            console.log('✅ Added image_url column');
        } else {
            console.log('ℹ️  image_url column already exists');
        }

        console.log('✅ Migration completed successfully');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await pool.end();
    }
}

addImageColumn();
