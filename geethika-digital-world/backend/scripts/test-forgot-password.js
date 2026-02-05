import fetch from 'node-fetch';

async function testForgotPassword() {
  console.log('\n🔐 Testing Forgot Password Flow...\n');
  
  const testEmail = 'kandasagar2006@gmail.com';
  const apiUrl = 'http://localhost:5000/api/auth/forgot-password';
  
  try {
    console.log(`📧 Sending forgot password request for: ${testEmail}`);
    console.log(`🌐 API URL: ${apiUrl}\n`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testEmail })
    });

    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📦 Response Data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Forgot password request successful!');
      if (data.devOTP) {
        console.log(`🔑 Development OTP: ${data.devOTP}`);
      }
      console.log('📬 Check your email inbox for the OTP\n');
    } else {
      console.log('\n❌ Request failed!');
      console.log('Error:', data.error || 'Unknown error\n');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed!');
    console.error('Error:', error.message);
    console.error('\nPossible issues:');
    console.error('1. Backend server is not running (start with: npm start)');
    console.error('2. Wrong API URL or port');
    console.error('3. Network connection issue\n');
  }
}

testForgotPassword();
