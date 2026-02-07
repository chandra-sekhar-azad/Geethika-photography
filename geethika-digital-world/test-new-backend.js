// Test new backend URL
const API_URL = 'https://geethika-digital-world.onrender.com';

async function testBackend() {
  console.log('🔍 Testing New Backend URL...\n');
  console.log(`Backend: ${API_URL}\n`);
  console.log('═'.repeat(60));

  const tests = [
    {
      name: 'Health Check',
      endpoint: '/health',
      method: 'GET'
    },
    {
      name: 'Products API',
      endpoint: '/api/products',
      method: 'GET'
    },
    {
      name: 'Categories API',
      endpoint: '/api/categories',
      method: 'GET'
    },
    {
      name: 'Services API',
      endpoint: '/api/services',
      method: 'GET'
    },
    {
      name: 'Homepage Content',
      endpoint: '/api/homepage/content',
      method: 'GET'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`\n📝 Testing: ${test.name}`);
      console.log(`   Endpoint: ${test.endpoint}`);
      
      const response = await fetch(`${API_URL}${test.endpoint}`, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Status: ${response.status} ${response.statusText}`);
        
        // Show data summary
        if (Array.isArray(data)) {
          console.log(`   📊 Data: Array with ${data.length} items`);
        } else if (data.products) {
          console.log(`   📊 Data: ${data.products.length} products`);
        } else if (data.services) {
          console.log(`   📊 Data: ${data.services.length} services`);
        } else if (data.status) {
          console.log(`   📊 Data: ${JSON.stringify(data)}`);
        } else {
          console.log(`   📊 Data: Object with ${Object.keys(data).length} keys`);
        }
        passed++;
      } else {
        console.log(`   ❌ Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log(`   Error: ${text.substring(0, 100)}`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('\n📊 Test Results:');
  console.log(`   ✅ Passed: ${passed}/${tests.length}`);
  console.log(`   ❌ Failed: ${failed}/${tests.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Backend is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check backend logs on Render.');
  }
  
  console.log('\n' + '═'.repeat(60));
}

// Run tests
testBackend().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
