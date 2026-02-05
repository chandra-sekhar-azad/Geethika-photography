import pool from '../config/database.js';

async function createServicesTable() {
  try {
    console.log('Creating services table...');

    // Create services table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image_url TEXT,
        image_public_id VARCHAR(255),
        price_range VARCHAR(100),
        features TEXT[],
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Services table created successfully!');

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug)
    `);

    console.log('✅ Indexes created successfully!');

    console.log('\n🎉 Services table setup complete!');
    console.log('ℹ️  You can now add services through the admin panel!');
    
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating services table:', error);
    process.exit(1);
  }
}

createServicesTable();
