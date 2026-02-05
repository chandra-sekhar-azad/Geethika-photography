import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? {
    rejectUnauthorized: false
  } : false
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function deleteAllProducts() {
  const client = await pool.connect();
  
  try {
    console.log('⚠️  WARNING: This will delete ALL products and related data!\n');

    // Show what will be deleted
    const productsCount = await client.query('SELECT COUNT(*) FROM products');
    const orderItemsCount = await client.query('SELECT COUNT(*) FROM order_items');
    const ordersCount = await client.query('SELECT COUNT(*) FROM orders');

    console.log('Current database state:');
    console.log(`  - Products: ${productsCount.rows[0].count}`);
    console.log(`  - Order Items: ${orderItemsCount.rows[0].count}`);
    console.log(`  - Orders: ${ordersCount.rows[0].count}`);
    console.log('\nThis will:');
    console.log('  1. Delete all order items');
    console.log('  2. Delete all orders');
    console.log('  3. Delete all products');
    console.log('\n⚠️  This action CANNOT be undone!\n');

    const answer = await askQuestion('Are you sure you want to continue? (type "yes" to confirm): ');

    if (answer.toLowerCase() !== 'yes') {
      console.log('\n❌ Operation cancelled');
      rl.close();
      await pool.end();
      return;
    }

    console.log('\n🔄 Starting deletion...\n');

    // Delete in correct order to avoid foreign key constraints
    
    // 1. Delete order items first
    const deletedItems = await client.query('DELETE FROM order_items RETURNING id');
    console.log(`✅ Deleted ${deletedItems.rows.length} order items`);

    // 2. Delete orders
    const deletedOrders = await client.query('DELETE FROM orders RETURNING id');
    console.log(`✅ Deleted ${deletedOrders.rows.length} orders`);

    // 3. Delete products
    const deletedProducts = await client.query('DELETE FROM products RETURNING id');
    console.log(`✅ Deleted ${deletedProducts.rows.length} products`);

    // Reset sequences to start from 1
    await client.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE order_items_id_seq RESTART WITH 1');
    console.log('✅ Reset ID sequences');

    console.log('\n✅ All products and related data deleted successfully!');
    console.log('\nYou can now add products manually through the admin panel.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    rl.close();
    client.release();
    await pool.end();
  }
}

deleteAllProducts();
