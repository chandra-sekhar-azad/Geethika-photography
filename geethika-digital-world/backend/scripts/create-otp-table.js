import pool from '../config/database.js';

async function createOTPTable() {
  try {
    console.log('Creating OTP table...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS otps (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        purpose VARCHAR(50) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ OTP table created successfully!');

    // Create index for faster lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email);
      CREATE INDEX IF NOT EXISTS idx_otps_expires ON otps(expires_at);
    `);

    console.log('✅ Indexes created successfully!');
    console.log('\n🎉 OTP table setup complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating OTP table:', error);
    process.exit(1);
  }
}

createOTPTable();
