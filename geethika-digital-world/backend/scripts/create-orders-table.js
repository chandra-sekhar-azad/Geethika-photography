import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createOrdersTables() {
  try {
    console.log('🔄 Creating orders tables...\n');

    // Create orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255),
        customer_phone VARCHAR(20) NOT NULL,
        shipping_address TEXT NOT NULL,
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(10),
        subtotal DECIMAL(10, 2) NOT NULL,
        discount DECIMAL(10, 2) DEFAULT 0,
        shipping_cost DECIMAL(10, 2) DEFAULT 0,
        total DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'razorpay',
        payment_status VARCHAR(20) DEFAULT 'pending',
        order_status VARCHAR(20) DEFAULT 'pending',
        razorpay_order_id VARCHAR(255),
        razorpay_payment_id VARCHAR(255),
        razorpay_signature VARCHAR(255),
        order_type VARCHAR(20) DEFAULT 'online',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Orders table created');

    // Create order_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER,
        product_name VARCHAR(255) NOT NULL,
        product_image TEXT,
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        customization JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Order items table created');

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
      CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
      CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    `);
    console.log('✅ Indexes created');

    console.log('\n✅ Orders tables created successfully!');
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

createOrdersTables();
