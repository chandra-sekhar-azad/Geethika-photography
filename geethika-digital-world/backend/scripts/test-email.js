import { sendOTPEmail } from '../config/email.js';

async function testEmail() {
  console.log('\n📧 Testing Email Configuration...\n');
  
  const testEmail = 'kandasagar2006@gmail.com';
  const testOTP = '123456';
  
  try {
    console.log(`Sending test OTP email to: ${testEmail}`);
    console.log(`Test OTP: ${testOTP}\n`);
    
    await sendOTPEmail(testEmail, testOTP, 'password-reset');
    
    console.log('\n✅ Test email sent successfully!');
    console.log(`📬 Check inbox at: ${testEmail}`);
    console.log('\nIf you received the email, your configuration is working! 🎉\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test email failed!');
    console.error('Error:', error.message);
    console.error('\nPossible issues:');
    console.error('1. Gmail App Password might be incorrect');
    console.error('2. Gmail account might have 2-Step Verification disabled');
    console.error('3. Network/firewall blocking SMTP connection');
    console.error('\nTo fix:');
    console.error('1. Go to: https://myaccount.google.com/apppasswords');
    console.error('2. Generate a new App Password');
    console.error('3. Update EMAIL_PASSWORD in .env file\n');
    
    process.exit(1);
  }
}

testEmail();
