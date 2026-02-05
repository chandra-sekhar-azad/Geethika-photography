import fetch from 'node-fetch';

async function testOrderCreation() {
  try {
    console.log('🔄 Testing order creation...\n');

    const orderData = {
      customer_name: 'Test Customer',
      customer_email: 'test@example.com',
      customer_phone: '9876543210',
      shipping_address: '123 Test Street, Test City, Test State - 123456',
      items: [
        {
          id: 1,
          product_id: 1,
          name: 'Test Product',
          image: 'test.jpg',
          quantity: 1,
          price: 100,
          finalPrice: 100
        }
      ],
      subtotal: 100,
      shipping_cost: 0,
      total: 100,
      payment_method: 'razorpay'
    };

    console.log('Sending order data:', JSON.stringify(orderData, null, 2));

    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    console.log('\nResponse status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ Order creation failed');
    } else {
      console.log('✅ Order created successfully');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testOrderCreation();
