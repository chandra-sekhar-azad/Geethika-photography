import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000';

async function testProfileUpdate() {
  try {
    console.log('🧪 Testing Profile Update Functionality\n');
    
    // Step 1: Login
    console.log('1️⃣ Logging in...');
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'kandasagar2006@gmail.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok) {
      console.error('❌ Login failed:', loginData.error);
      return;
    }
    
    console.log('✅ Login successful');
    console.log('   User:', loginData.user.name);
    console.log('   Email:', loginData.user.email);
    const token = loginData.token;
    
    // Step 2: Get current profile
    console.log('\n2️⃣ Getting current profile...');
    const profileResponse = await fetch(`${API_URL}/api/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const profileData = await profileResponse.json();
    console.log('✅ Current profile:');
    console.log('   Name:', profileData.user.name);
    console.log('   Phone:', profileData.user.phone || 'Not set');
    
    // Step 3: Update profile
    console.log('\n3️⃣ Updating profile...');
    const updateResponse = await fetch(`${API_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Updated Test User',
        phone: '9876543210'
      })
    });
    
    const updateData = await updateResponse.json();
    
    if (!updateResponse.ok) {
      console.error('❌ Update failed:', updateData.error);
      return;
    }
    
    console.log('✅ Profile updated successfully!');
    console.log('   New Name:', updateData.user.name);
    console.log('   New Phone:', updateData.user.phone);
    
    // Step 4: Verify update
    console.log('\n4️⃣ Verifying update...');
    const verifyResponse = await fetch(`${API_URL}/api/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const verifyData = await verifyResponse.json();
    console.log('✅ Verified profile:');
    console.log('   Name:', verifyData.user.name);
    console.log('   Phone:', verifyData.user.phone);
    
    console.log('\n✅ All tests passed! Profile update is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testProfileUpdate();
