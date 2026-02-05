import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Eye, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, completed, cancelled

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: { pathname: '/my-orders' } } });
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Package className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    const orderStatus = (order.order_status || order.status || '').toLowerCase();
    return orderStatus === filter;
  });

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-valentine-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="valentine-gradient text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            My Orders
          </h1>
          <p className="text-lg">
            Track and manage your orders
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-valentine-red text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'pending'
                  ? 'bg-valentine-red text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({orders.filter(o => o.status?.toLowerCase() === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'completed'
                  ? 'bg-valentine-red text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed ({orders.filter(o => o.status?.toLowerCase() === 'completed').length})
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'cancelled'
                  ? 'bg-valentine-red text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelled ({orders.filter(o => o.status?.toLowerCase() === 'cancelled').length})
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Orders Found</h2>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't placed any orders yet."
                : `You don't have any ${filter} orders.`}
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="btn-primary"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-bold text-lg">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-semibold">{formatDate(order.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-bold text-xl text-valentine-red">₹{order.total_amount}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                        <img
                          src={item.product_image_url || item.image_url || '/images/image.png'}
                          alt={item.product_name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.product_name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          {item.customization && (
                            <p className="text-xs text-gray-500 mt-1">
                              ✨ Customized
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-valentine-red">₹{item.price}</p>
                          <p className="text-sm text-gray-600">× {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  {(order.shipping_info || order.shipping_address) && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-bold mb-2">Shipping Address</h4>
                      {order.shipping_info ? (
                        <>
                          <p className="text-gray-700">{order.shipping_info.name}</p>
                          <p className="text-gray-600 text-sm">
                            {order.shipping_info.address}, {order.shipping_info.city}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {order.shipping_info.state} - {order.shipping_info.pincode}
                          </p>
                          <p className="text-gray-600 text-sm">
                            <span className="font-medium">Phone:</span> {order.shipping_info.phone}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-700">{order.customer_name}</p>
                          <p className="text-gray-600 text-sm">{order.shipping_address}</p>
                          <p className="text-gray-600 text-sm">
                            <span className="font-medium">Phone:</span> {order.customer_phone}
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  {/* Payment Info */}
                  <div className="mt-6 pt-6 border-t flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-semibold">{order.payment_method || 'Online Payment'}</p>
                      {order.razorpay_order_id && (
                        <p className="text-xs text-gray-500">ID: {order.razorpay_order_id}</p>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/order/${order.id}`)}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-valentine-red text-valentine-red rounded-lg hover:bg-valentine-red hover:text-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
