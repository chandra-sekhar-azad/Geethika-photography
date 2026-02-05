// Test the customers API endpoint
async function testCustomersAPI() {
  try {
    console.log('🧪 Testing /api/admin/customers endpoint...\n');

    // First, login as admin to get token
    console.log('1️⃣ Logging in as admin...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@geethikadigitalworld.com',
        password: 'Admin@123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful\n');

    // Now fetch customers
    console.log('2️⃣ Fetching customers...');
    const customersResponse = await fetch('http://localhost:5000/api/admin/customers', {
      headers: { 
        'Authorization': `Bearer ${loginData.token}`
      }
    });

    if (!customersResponse.ok) {
      throw new Error(`Fetch customers failed: ${customersResponse.status}`);
    }

    const customersData = await customersResponse.json();
    console.log('✅ Customers fetched successfully\n');
    console.log('📊 Results:');
    console.log(`   Total customers: ${customersData.customers?.length || 0}`);
    console.log(`   Count: ${customersData.count || 0}\n`);

    if (customersData.customers && customersData.customers.length > 0) {
      console.log('👥 Customer list:');
      customersData.customers.forEach((customer, index) => {
        console.log(`\n${index + 1}. ${customer.name}`);
        console.log(`   Email: ${customer.email}`);
        console.log(`   Phone: ${customer.phone || 'N/A'}`);
        console.log(`   Orders: ${customer.total_orders}`);
        console.log(`   Spent: ₹${customer.total_spent}`);
      });
    } else {
      console.log('⚠️  No customers found');
      console.log('\n💡 This could mean:');
      console.log('   - No users have registered yet');
      console.log('   - Users exist but have role other than "customer"');
      console.log('   - Database connection issue');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   - Backend server is running (npm start in backend folder)');
    console.log('   - Database is accessible');
    console.log('   - Admin credentials are correct');
  }
}

testCustomersAPI();
