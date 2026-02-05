import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShoppingBag, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [cart, navigate, orderPlaced]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Create order in backend
      const orderData = {
        customer_name: shippingInfo.name,
        customer_email: shippingInfo.email,
        customer_phone: shippingInfo.phone,
        shipping_address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}`,
        shipping_info: {
          name: shippingInfo.name,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          pincode: shippingInfo.pincode
        },
        items: cart.map(item => ({
          id: item.id,
          product_id: item.id,
          name: item.name,
          image: item.image || item.image_url,
          image_url: item.image || item.image_url,
          quantity: item.quantity,
          price: item.finalPrice || item.price,
          finalPrice: item.finalPrice || item.price,
          customization: item.customization || null
        })),
        subtotal: getCartTotal(),
        shipping_cost: 0,
        total: getCartTotal(),
        payment_method: paymentMethod
      };

      console.log('Order data being sent:', orderData);

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Load Razorpay
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        alert('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }

      // Razorpay options - Clean configuration without method restrictions
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_demo', // Use environment variable
        amount: getCartTotal() * 100, // Amount in paise
        currency: 'INR',
        name: 'Geethika Digital World',
        description: 'Order Payment',
        order_id: data.razorpay_order_id,
        handler: async function (response) {
          // Payment successful
          try {
            // Update order with payment details
            await fetch(`http://localhost:5000/api/orders/${data.order.id}/payment`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            setOrderPlaced(true);
            clearCart();
            setLoading(false);
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment successful but verification failed. Please contact support.');
            setLoading(false);
          }
        },
        prefill: {
          name: shippingInfo.name,
          email: shippingInfo.email,
          contact: shippingInfo.phone
        },
        theme: {
          color: '#DC143C'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert(error.message || 'Failed to process payment. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || 
        !shippingInfo.city || !shippingInfo.state || !shippingInfo.pincode) {
      alert('Please fill in all required fields');
      return;
    }

    await handlePayment();
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/shop')} 
              className="w-full btn-primary"
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="valentine-gradient text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Checkout
          </h1>
          <p className="text-lg">Complete your order</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Truck className="w-6 h-6 text-valentine-red" />
                  <h2 className="text-2xl font-bold">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.name}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-valentine-red focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-valentine-red focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-valentine-red focus:border-transparent"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold mb-2">
                    Address *
                  </label>
                  <textarea
                    required
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-valentine-red focus:border-transparent"
                    rows="3"
                    placeholder="Street address, apartment, suite, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-valentine-red focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-valentine-red focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      pattern="[0-9]{6}"
                      value={shippingInfo.pincode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-valentine-red focus:border-transparent"
                      placeholder="6 digits"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCard className="w-6 h-6 text-valentine-red" />
                  <h2 className="text-2xl font-bold">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-valentine-red rounded-lg cursor-pointer bg-valentine-pink/10">
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">Razorpay (Recommended)</p>
                      <p className="text-sm text-gray-600">Pay securely with Credit/Debit Card, UPI, Net Banking</p>
                    </div>
                    <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-8" />
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer opacity-50">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      disabled
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Coming soon</p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Pay ₹${getCartTotal()}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <div className="flex items-center space-x-3 mb-6">
                <ShoppingBag className="w-6 h-6 text-valentine-red" />
                <h2 className="text-2xl font-bold">Order Summary</h2>
              </div>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-valentine-red">
                        ₹{item.finalPrice * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-valentine-red">
                    ₹{getCartTotal()}
                  </span>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  🔒 Secure payment powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
