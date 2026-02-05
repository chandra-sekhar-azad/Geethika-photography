import pool from '../config/database.js';

async function createAuditLogTable() {
  const client = await pool.connect();
  
  try {
    console.log('Creating audit_logs table...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        admin_email VARCHAR(255),
        admin_name VARCHAR(255),
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id INTEGER,
        entity_name VARCHAR(255),
        changes JSONB,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✓ audit_logs table created successfully');
    
    // Create indexes for better query performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON audit_logs(admin_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
    `);
    
    console.log('✓ Indexes created successfully');
    
  } catch (error) {
    console.error('Error creating audit_logs table:', error);
    throw error;
  } finally {
    client.release();
  }
}

createAuditLogTable()
  .then(() => {
    console.log('Audit log table setup complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
