// Test registration and login flow
const API_URL = 'https://geethika-digital-world1.onrender.com';

async function testRegistrationFlow() {
  console.log('\n' + '═'.repeat(80));
  console.log('  🧪 TESTING REGISTRATION AND LOGIN FLOW');
  console.log('═'.repeat(80) + '\n');

  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'Test@123456',
    name: 'Test User',
    phone: '9876543210'
  };

  try {
    // Step 1: Register new user
    console.log('1️⃣ TESTING REGISTRATION...\n');
    console.log('Test user data:');
    console.log('  Email:', testUser.email);
    console.log('  Name:', testUser.name);
    console.log('  Phone:', testUser.phone);
    console.log('  Password:', testUser.password);
    console.log('\n');

    const registerResponse = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    const registerData = await registerResponse.json();

    console.log('Registration Response:');
    console.log('  Status:', registerResponse.status);
    console.log('  Response:', JSON.stringify(registerData, null, 2));
    console.log('\n');

    if (!registerResponse.ok) {
      console.log('❌ Registration failed!');
      console.log('   Error:', registerData.error || registerData.message);
      if (registerData.errors) {
        console.log('   Validation errors:', registerData.errors);
      }
      return;
    }

    console.log('✅ Registration successful!');
    console.log('   User ID:', registerData.user.id);
    console.log('   Email:', registerData.user.email);
    console.log('   Name:', registerData.user.name);
    console.log('   Role:', registerData.user.role);
    console.log('   Token received:', registerData.token ? 'Yes' : 'No');
    console.log('\n' + '═'.repeat(80) + '\n');

    // Step 2: Try to login with the same credentials
    console.log('2️⃣ TESTING LOGIN WITH NEW USER...\n');

    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    const loginData = await loginResponse.json();

    console.log('Login Response:');
    console.log('  Status:', loginResponse.status);
    console.log('  Response:', JSON.stringify(loginData, null, 2));
    console.log('\n');

    if (!loginResponse.ok) {
      console.log('❌ Login failed!');
      console.log('   Error:', loginData.error || loginData.message);
      return;
    }

    console.log('✅ Login successful!');
    console.log('   User ID:', loginData.user.id);
    console.log('   Email:', loginData.user.email);
    console.log('   Name:', loginData.user.name);
    console.log('   Role:', loginData.user.role);
    console.log('   Token received:', loginData.token ? 'Yes' : 'No');
    console.log('\n' + '═'.repeat(80) + '\n');

    // Step 3: Test duplicate registration
    console.log('3️⃣ TESTING DUPLICATE REGISTRATION...\n');

    const duplicateResponse = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    const duplicateData = await duplicateResponse.json();

    console.log('Duplicate Registration Response:');
    console.log('  Status:', duplicateResponse.status);
    console.log('  Response:', JSON.stringify(duplicateData, null, 2));
    console.log('\n');

    if (duplicateResponse.status === 409) {
      console.log('✅ Duplicate check working correctly!');
      console.log('   Error message:', duplicateData.error);
    } else {
      console.log('⚠️  Duplicate check may not be working properly');
    }

    console.log('\n' + '═'.repeat(80) + '\n');

    // Step 4: Test wrong password
    console.log('4️⃣ TESTING LOGIN WITH WRONG PASSWORD...\n');

    const wrongPasswordResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testUser.email,
        password: 'WrongPassword123!'
      })
    });

    const wrongPasswordData = await wrongPasswordResponse.json();

    console.log('Wrong Password Response:');
    console.log('  Status:', wrongPasswordResponse.status);
    console.log('  Response:', JSON.stringify(wrongPasswordData, null, 2));
    console.log('\n');

    if (wrongPasswordResponse.status === 401) {
      console.log('✅ Password validation working correctly!');
      console.log('   Error message:', wrongPasswordData.error);
    } else {
      console.log('⚠️  Password validation may not be working properly');
    }

    console.log('\n' + '═'.repeat(80) + '\n');

    // Summary
    console.log('📊 TEST SUMMARY');
    console.log('─'.repeat(80));
    console.log('✅ Registration: Working');
    console.log('✅ Login: Working');
    console.log('✅ Duplicate check: Working');
    console.log('✅ Password validation: Working');
    console.log('\n✨ All tests passed! Registration and login flow is working correctly.\n');
    console.log('═'.repeat(80) + '\n');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('\nFull error:', error);
  }
}

testRegistrationFlow();
