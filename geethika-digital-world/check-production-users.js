// Check all users in production database
const API_URL = 'https://geethika-digital-world.onrender.com';

async function checkUsers() {
  console.log('🔍 Checking Users in Production Database...\n');
  console.log('Backend URL:', API_URL);
  console.log('='.repeat(80));
  console.log('\n');

  try {
    // First, let's check if we can access the health endpoint
    console.log('1️⃣ Testing backend connection...');
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    
    if (healthData.status === 'healthy') {
      console.log('✅ Backend is healthy and database is connected\n');
    } else {
      console.log('❌ Backend is not healthy\n');
      return;
    }

    console.log('='.repeat(80));
    console.log('\n');

    // Note: We can't directly query users without authentication
    // But we can try to login with known credentials to verify users exist
    
    console.log('2️⃣ User Information:\n');
    console.log('⚠️  Cannot directly query users table without authentication.');
    console.log('⚠️  This is a security feature to protect user data.\n');
    
    console.log('To check users, you need to:');
    console.log('1. Connect to production database directly');
    console.log('2. Or use the admin panel after logging in');
    console.log('3. Or run a backend script with database credentials\n');

    console.log('='.repeat(80));
    console.log('\n');

    console.log('3️⃣ Testing Admin Login Endpoint...\n');
    
    // Test if admin login endpoint exists
    const loginTest = await fetch(`${API_URL}/api/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    });

    const loginData = await loginTest.json();
    
    if (loginTest.status === 401 || loginTest.status === 400) {
      console.log('✅ Admin login endpoint is working');
      console.log('   Response:', loginData.error || loginData.message);
    } else if (loginTest.status === 404) {
      console.log('❌ Admin login endpoint not found');
    } else {
      console.log('Status:', loginTest.status);
      console.log('Response:', loginData);
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n');

    console.log('4️⃣ Admin Credentials Location:\n');
    console.log('Check these files for admin credentials:');
    console.log('   📄 ADMIN_CREDENTIALS.txt');
    console.log('   📄 docs/ADMIN_QUICKSTART.md');
    console.log('   📄 docs/SUPER_ADMIN_QUICKSTART.md\n');

    console.log('='.repeat(80));
    console.log('\n');

    console.log('5️⃣ To Check Users via Database:\n');
    console.log('You need to connect to PostgreSQL database on Render:');
    console.log('   1. Get database credentials from Render dashboard');
    console.log('   2. Use psql or pgAdmin to connect');
    console.log('   3. Run: SELECT id, email, role, created_at FROM users;\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUsers();
