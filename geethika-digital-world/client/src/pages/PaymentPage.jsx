import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, MapPin, Phone, User, ShieldCheck, CreditCard, Wallet, Landmark, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/api';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cart, getCartSubtotal, getServiceCharge, getFinalTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Details, 2: Payment
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    landmark: '',
    city: '',
    pincode: '',
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/profile?tab=cart');
    }
  }, [cart, navigate]);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please complete your information first.');
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleProcessPayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // 1. Create order in our backend
      const orderResponse = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: `${formData.address}, ${formData.landmark ? formData.landmark + ', ' : ''}${formData.city} - ${formData.pincode}`,
          items: cart,
          subtotal: getCartSubtotal(),
          service_charge: getServiceCharge(),
          total: getFinalTotal(),
          payment_method: 'razorpay',
          shipping_info: {
            address: formData.address,
            landmark: formData.landmark,
            city: formData.city,
            pincode: formData.pincode,
            state: 'Andhra Pradesh' // Default state
          }
        })
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(orderData.error || 'Failed to create order');

      const { razorpay_order_id, order: createdOrder } = orderData;

      // 2. Open Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_demo',
        amount: Math.round(getFinalTotal() * 100),
        currency: 'INR',
        name: 'Geethika Digital World',
        description: `Order #${createdOrder.order_number}`,
        image: '/logo.png',
        order_id: razorpay_order_id,
        handler: async (response) => {
          try {
            // 3. Verify Payment in Backend
            const verifyRes = await fetch(`${API_BASE_URL}/api/orders/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              // 4. Update Order Status
              await fetch(`${API_BASE_URL}/api/orders/${createdOrder.id}/payment`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });

              clearCart();
              navigate('/profile?tab=orders');
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Something went wrong during verification.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#8E447E'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const paymentOptions = [
    { id: 'upi', label: 'Razorpay Secure Checkout', icon: Wallet, desc: 'UPI, Cards, NetBanking, Wallets' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-14 z-40">
        <div className="container-custom py-6">
          <div className="flex items-center justify-center gap-4 md:gap-12">
            <div className={`flex items-center gap-3 transition-colors ${step >= 1 ? 'text-[var(--color-primary)]' : 'text-gray-300'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-body font-bold text-xs ${step >= 1 ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100'}`}>1</div>
              <span className="text-[10px] font-body font-bold uppercase tracking-widest hidden sm:inline">Information</span>
            </div>
            <div className="w-12 h-px bg-gray-100" />
            <div className={`flex items-center gap-3 transition-colors ${step >= 2 ? 'text-[var(--color-primary)]' : 'text-gray-300'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-body font-bold text-xs ${step >= 2 ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100'}`}>2</div>
              <span className="text-[10px] font-body font-bold uppercase tracking-widest hidden sm:inline">Payment Selection</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom pt-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Content */}
          <div className="flex-[1.5] space-y-12">
            {step === 1 ? (
              <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12 animate-fade-in">
                <div className="mb-12">
                  <h2 className="text-4xl font-display font-bold text-gray-900 mb-4 tracking-tight">Shipping Details</h2>
                  <p className="text-gray-400 font-body">Where should we deliver your curated masterpiece?</p>
                </div>
                
                <form onSubmit={handleNextStep} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-body text-sm text-gray-900 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-body text-sm text-gray-900 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                        placeholder="+91"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest ml-1">Street Address</label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-body text-sm text-gray-900 focus:ring-2 focus:ring-purple-100 outline-none transition-all h-32 resize-none"
                      placeholder="House / Flat / Building Name & Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-body text-sm text-gray-900 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest ml-1">Pincode</label>
                      <input
                        type="text"
                        required
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-body text-sm text-gray-900 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-5 bg-gray-900 text-white rounded-2xl font-body font-bold text-sm uppercase tracking-widest hover:bg-[var(--color-primary)] transition-all flex items-center justify-center gap-3 group"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12 animate-fade-in">
                <div className="mb-12 flex items-center justify-between">
                  <div>
                    <h2 className="text-4xl font-display font-bold text-gray-900 mb-4 tracking-tight">Payment Selection</h2>
                    <p className="text-gray-400 font-body">Complete your purchase securely via Razorpay.</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-[10px] font-body font-bold text-[var(--color-primary)] uppercase tracking-widest hover:underline underline-offset-4">Back to info</button>
                </div>

                <div className="space-y-4 mb-12">
                  {paymentOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center gap-6 p-6 rounded-[30px] border-2 cursor-pointer transition-all ${
                        paymentMethod === option.id 
                        ? 'border-[var(--color-primary)] bg-purple-50/30' 
                        : 'border-gray-50 hover:border-gray-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        className="hidden"
                        checked={paymentMethod === option.id}
                        onChange={() => setPaymentMethod(option.id)}
                      />
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        paymentMethod === option.id ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-50 text-gray-400'
                      }`}>
                        <option.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-display font-bold text-lg text-gray-900">{option.label}</h4>
                        <p className="text-xs font-body text-gray-400 uppercase tracking-widest">{option.desc}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === option.id ? 'border-[var(--color-primary)]' : 'border-gray-200'
                      }`}>
                        {paymentMethod === option.id && <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />}
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  onClick={handleProcessPayment}
                  disabled={loading}
                  className="w-full py-6 bg-[var(--color-primary)] text-white rounded-3xl font-body font-bold text-lg uppercase tracking-widest hover:shadow-2xl hover:shadow-purple-200 transition-all active:scale-95 flex items-center justify-center gap-4"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-6 h-6" />
                      <span>Pay Securely with Razorpay</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-8 py-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest">256-bit SSL Secure</span>
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest">Encrypted Checkout</span>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="flex-1">
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 md:p-12 sticky top-40 h-fit">
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-10 flex items-center gap-4">
                <ShoppingBag className="w-6 h-6" />
                Your Selection
              </h3>

              <div className="space-y-6 mb-10 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-sm font-body font-bold text-gray-900 truncate max-w-[150px]">{item.name}</h4>
                      <p className="text-[10px] font-body text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex items-center font-display font-bold text-gray-900">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-10 border-t border-gray-50">
                <div className="flex justify-between text-xs font-body text-gray-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">₹{getCartSubtotal()}</span>
                </div>
                <div className="flex justify-between text-xs font-body text-gray-400 uppercase tracking-widest">
                  <span>Service Fee</span>
                  <span className="text-gray-900 font-bold">₹{getServiceCharge()}</span>
                </div>
                <div className="flex justify-between text-xs font-body text-gray-400 uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="pt-8 flex flex-col">
                  <span className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-[0.3em] mb-2 text-center">GRAND TOTAL</span>
                  <span className="text-5xl font-display font-bold text-[var(--color-primary)] text-center tracking-tight">₹{getFinalTotal()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
