// Test homepage API on production
const API_URL = 'https://geethika-digital-world.onrender.com';

async function testHomepageAPI() {
  console.log('🔍 Testing Homepage API...\n');

  try {
    // Test 1: Public content endpoint
    console.log('1️⃣ Testing public content endpoint...');
    const publicResponse = await fetch(`${API_URL}/api/homepage/content`);
    const publicData = await publicResponse.json();
    
    console.log('Status:', publicResponse.status);
    console.log('Response:', JSON.stringify(publicData, null, 2));
    
    if (publicData.success) {
      console.log('✅ Public endpoint working!');
      console.log(`   - Hero Banner: ${publicData.content.hero_banner ? 'Found' : 'Not found'}`);
      console.log(`   - Offers: ${publicData.content.offers?.length || 0} items`);
      console.log(`   - Testimonials: ${publicData.content.testimonials?.length || 0} items`);
    } else {
      console.log('❌ Public endpoint failed');
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Test 2: Admin endpoint (will fail without token, but we can see if route exists)
    console.log('2️⃣ Testing admin content endpoint (without auth)...');
    const adminResponse = await fetch(`${API_URL}/api/homepage/admin/content`);
    const adminData = await adminResponse.json();
    
    console.log('Status:', adminResponse.status);
    console.log('Response:', JSON.stringify(adminData, null, 2));
    
    if (adminResponse.status === 401) {
      console.log('✅ Admin endpoint exists (requires authentication)');
    } else if (adminResponse.status === 404) {
      console.log('❌ Admin endpoint not found - route may not be loaded');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testHomepageAPI();
