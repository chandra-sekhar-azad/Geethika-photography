import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: { pathname: `/order/${id}` } } });
      return;
    }
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    
    return `${day}-${month}-${year} ${hours}:${minutes}${ampm}`;
  };

  const getStatusSteps = () => {
    const currentStatus = order?.order_status || order?.status || 'pending';
    const steps = [
      { label: 'Order Placed', status: 'completed' },
      { label: 'Processing', status: currentStatus === 'pending' ? 'current' : 'completed' },
      { label: 'Shipped', status: currentStatus === 'completed' ? 'completed' : 'pending' },
      { label: 'Delivered', status: currentStatus === 'completed' ? 'completed' : 'pending' }
    ];
    return steps;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-valentine-red"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/my-orders')} className="btn-primary">
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="valentine-gradient text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/my-orders')}
            className="flex items-center gap-2 mb-4 hover:underline"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to My Orders
          </button>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Order Details
          </h1>
          <p className="text-lg">Order ID: #{order.id}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Order Status</h2>
              <div className="relative">
                <div className="flex justify-between">
                  {getStatusSteps().map((step, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.status === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : step.status === 'current'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {step.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <Clock className="w-6 h-6" />
                        )}
                      </div>
                      <p className="text-xs mt-2 text-center font-semibold">{step.label}</p>
                    </div>
                  ))}
                </div>
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <img
                      src={item.product_image_url || item.image_url || '/images/image.png'}
                      alt={item.product_name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.product_name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      {item.customization && (
                        <div className="mt-2 text-sm text-gray-600">
                          <p className="font-semibold text-valentine-red">✨ Customized</p>
                          {item.customization.size && (
                            <p>Size: {item.customization.size}</p>
                          )}
                          {Object.entries(item.customization.textInputs || {}).map(([key, value]) => (
                            <p key={key}>{key}: {value}</p>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-valentine-red">₹{item.price}</p>
                      <p className="text-sm text-gray-600">× {item.quantity}</p>
                      <p className="text-sm font-semibold mt-1">
                        Total: ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date</span>
                  <span className="font-semibold">{formatDate(order.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-semibold capitalize">{order.order_status || order.status || 'Pending'}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-2xl font-bold text-valentine-red">
                    ₹{order.total_amount || order.total || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {(order.shipping_info || order.shipping_address) && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-valentine-red" />
                  <h2 className="text-xl font-bold">Shipping Address</h2>
                </div>
                <div className="text-gray-700 space-y-1">
                  {order.shipping_info ? (
                    <>
                      <p className="font-semibold">{order.shipping_info.name}</p>
                      <p>{order.shipping_info.address}</p>
                      <p>{order.shipping_info.city}, {order.shipping_info.state}</p>
                      <p><span className="font-medium">PIN:</span> {order.shipping_info.pincode}</p>
                      <p><span className="font-medium">Phone:</span> {order.shipping_info.phone}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold">{order.customer_name}</p>
                      <p>{order.shipping_address}</p>
                      <p><span className="font-medium">Phone:</span> {order.customer_phone}</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-valentine-red" />
                <h2 className="text-xl font-bold">Payment Information</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-semibold">{order.payment_method || 'Online Payment'}</span>
                </div>
                {order.razorpay_order_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="text-xs font-mono">{order.razorpay_order_id}</span>
                  </div>
                )}
                {order.razorpay_payment_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID</span>
                    <span className="text-xs font-mono">{order.razorpay_payment_id}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-valentine-pink/10 rounded-xl p-6 border border-valentine-pink/20">
              <h3 className="font-bold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Contact us for any queries regarding your order
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="w-full btn-primary text-sm"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
