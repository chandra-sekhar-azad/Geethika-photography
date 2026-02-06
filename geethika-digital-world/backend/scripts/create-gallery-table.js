import pool from '../config/database.js';

async function createGalleryTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(500) NOT NULL,
        category VARCHAR(100) DEFAULT 'general',
        uploaded_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Gallery table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating gallery table:', error);
    process.exit(1);
  }
}

createGalleryTable();
