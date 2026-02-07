// Test login API with durga@gmail.com
const API_URL = 'https://geethika-digital-world1.onrender.com';

async function testLogin() {
  console.log('\n' + '═'.repeat(80));
  console.log('  🧪 TESTING LOGIN API');
  console.log('═'.repeat(80) + '\n');

  const testCredentials = {
    email: 'durga@gmail.com',
    password: 'Durga@123'
  };

  try {
    console.log('Testing login with:');
    console.log('  Email:', testCredentials.email);
    console.log('  Password:', testCredentials.password);
    console.log('\n');

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testCredentials)
    });

    const data = await response.json();

    console.log('Response:');
    console.log('  Status:', response.status);
    console.log('  Data:', JSON.stringify(data, null, 2));
    console.log('\n');

    if (response.status === 401) {
      console.log('❌ Login failed - Invalid credentials');
      console.log('   This means either:');
      console.log('   1. User does not exist in database');
      console.log('   2. Password is incorrect');
      console.log('\n');
      
      console.log('🔍 Let me check if user exists in database...\n');
    } else if (response.ok) {
      console.log('✅ Login successful!');
      console.log('   User:', data.user);
      console.log('   Token:', data.token ? 'Received' : 'Not received');
    }

    console.log('═'.repeat(80) + '\n');

    // Now test registration
    console.log('🧪 TESTING REGISTRATION API\n');
    
    const newUser = {
      email: `test${Date.now()}@example.com`,
      password: 'Test@123456',
      name: 'Test User',
      phone: '9876543210'
    };

    console.log('Registering new user:');
    console.log('  Email:', newUser.email);
    console.log('  Name:', newUser.name);
    console.log('\n');

    const regResponse = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    });

    const regData = await regResponse.json();

    console.log('Registration Response:');
    console.log('  Status:', regResponse.status);
    console.log('  Data:', JSON.stringify(regData, null, 2));
    console.log('\n');

    if (regResponse.ok) {
      console.log('✅ Registration successful!');
      console.log('   User ID:', regData.user.id);
      console.log('   Email:', regData.user.email);
      console.log('\n');

      // Try to login with new user
      console.log('🧪 TESTING LOGIN WITH NEW USER\n');

      const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password
        })
      });

      const loginData = await loginResponse.json();

      console.log('Login Response:');
      console.log('  Status:', loginResponse.status);
      console.log('  Data:', JSON.stringify(loginData, null, 2));
      console.log('\n');

      if (loginResponse.ok) {
        console.log('✅ Login with new user successful!');
        console.log('   Backend registration and login are working correctly!');
      } else {
        console.log('❌ Login with new user failed!');
      }
    } else {
      console.log('❌ Registration failed!');
      console.log('   Error:', regData.error || regData.message);
    }

    console.log('\n' + '═'.repeat(80) + '\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin();
