import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('🔄 Testing admin login and product update...\n');

const adminEmail = process.env.ADMIN_EMAIL || 'admin@geethikadigitalworld.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

async function testAdminFlow() {
  try {
    // Step 1: Login as admin
    console.log('Step 1: Logging in as admin...');
    console.log('Email:', adminEmail);
    
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword
      })
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.json();
      throw new Error(`Login failed: ${error.error}`);
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful!');
    console.log('User:', loginData.user.email);
    console.log('Role:', loginData.user.role);
    console.log('Token:', loginData.token.substring(0, 20) + '...');

    const token = loginData.token;

    // Step 2: Test fetching products
    console.log('\nStep 2: Fetching products...');
    const productsResponse = await fetch('http://localhost:5000/api/products');
    const productsData = await productsResponse.json();
    console.log(`✅ Found ${productsData.products.length} products`);

    if (productsData.products.length === 0) {
      console.log('\n⚠️  No products found to test update');
      return;
    }

    // Step 3: Test updating a product
    const testProduct = productsData.products[0];
    console.log(`\nStep 3: Testing update on product ID ${testProduct.id}...`);
    console.log('Product name:', testProduct.name);

    const updateResponse = await fetch(`http://localhost:5000/api/products/${testProduct.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: testProduct.name,
        price: testProduct.price,
        description: testProduct.description,
        category_id: testProduct.category_id,
        is_active: testProduct.is_active
      })
    });

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      throw new Error(`Update failed: ${error.error}`);
    }

    const updateData = await updateResponse.json();
    console.log('✅ Product update successful!');
    console.log('Updated product:', updateData.product.name);

    console.log('\n✅ All tests passed! Admin authentication is working correctly.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure backend server is running on port 5000');
    console.error('2. Check admin credentials in .env file');
    console.error('3. Verify database connection is working');
  }
}

testAdminFlow();
