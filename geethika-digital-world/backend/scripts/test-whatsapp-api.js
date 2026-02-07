import { sendWhatsAppMessage } from '../config/whatsapp.js';
import dotenv from 'dotenv';

dotenv.config();

async function testWhatsAppAPI() {
  console.log('\n' + '═'.repeat(80));
  console.log('  🧪 TESTING WHATSAPP API');
  console.log('═'.repeat(80) + '\n');

  console.log('Configuration:');
  console.log('  Access Token:', process.env.WHATSAPP_ACCESS_TOKEN ? '✅ Set' : '❌ Not set');
  console.log('  Phone Number ID:', process.env.WHATSAPP_PHONE_NUMBER_ID || '❌ Not set');
  console.log('  WhatsApp Number:', process.env.WHATSAPP_NUMBER || '❌ Not set');
  console.log('\n');

  if (!process.env.WHATSAPP_ACCESS_TOKEN) {
    console.log('❌ WHATSAPP_ACCESS_TOKEN is not set in .env file');
    console.log('   Please add it to backend/.env');
    return;
  }

  if (!process.env.WHATSAPP_PHONE_NUMBER_ID) {
    console.log('⚠️  WHATSAPP_PHONE_NUMBER_ID is not set');
    console.log('   You need to get this from Facebook Business Manager');
    console.log('   Go to: https://business.facebook.com/wa/manage/phone-numbers/');
    console.log('\n');
    return;
  }

  console.log('═'.repeat(80));
  console.log('\n');

  // Test sending a message
  console.log('📤 Sending test message...\n');
  
  const testNumber = process.env.WHATSAPP_NUMBER || '919492686421';
  const testMessage = 'Hello from Geethika Digital World! This is a test message from your WhatsApp API integration.';

  const result = await sendWhatsAppMessage(testNumber, testMessage);

  console.log('\n' + '═'.repeat(80));
  console.log('\n');

  if (result.success) {
    console.log('✅ TEST PASSED!');
    console.log('   Message sent successfully');
    console.log('   Message ID:', result.data.messages?.[0]?.id);
  } else {
    console.log('❌ TEST FAILED!');
    console.log('   Error:', result.error);
    console.log('\n');
    console.log('Common issues:');
    console.log('  1. Invalid access token (expired or wrong)');
    console.log('  2. Wrong phone number ID');
    console.log('  3. Phone number not registered in WhatsApp Business');
    console.log('  4. Insufficient permissions');
  }

  console.log('\n' + '═'.repeat(80) + '\n');
}

testWhatsAppAPI();
