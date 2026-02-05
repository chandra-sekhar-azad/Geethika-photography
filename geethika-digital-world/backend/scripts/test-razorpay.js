import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('🔄 Testing Razorpay configuration...\n');
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? '***' + process.env.RAZORPAY_KEY_SECRET.slice(-4) : 'NOT SET');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function testRazorpay() {
  try {
    console.log('\n🔄 Creating test Razorpay order...\n');

    const options = {
      amount: 10000, // 100 INR in paise
      currency: 'INR',
      receipt: 'TEST-' + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    console.log('✅ Razorpay order created successfully!');
    console.log('Order ID:', order.id);
    console.log('Amount:', order.amount);
    console.log('Currency:', order.currency);
    console.log('Status:', order.status);

  } catch (error) {
    console.error('❌ Razorpay error:', error.message);
    console.error('Error details:', error.error);
  }
}

testRazorpay();
