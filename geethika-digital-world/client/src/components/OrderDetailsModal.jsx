import { X, Download, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

const OrderDetailsModal = ({ order, onClose, onUpdateStatus }) => {
  if (!order) return null;

  const downloadImage = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'custom-image.jpg';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download image:', error);
      alert('Failed to download image');
    }
  };

  const downloadAllImages = async (item) => {
    if (!item.customization_images || item.customization_images.length === 0) return;
    
    for (let i = 0; i < item.customization_images.length; i++) {
      const imageUrl = item.customization_images[i];
      const filename = `order-${order.order_number}-${item.product_name}-${i + 1}.jpg`;
      await downloadImage(imageUrl, filename);
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-600">Order #{order.order_number}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-semibold">{order.customer_name}</p>
              <p className="text-sm text-gray-600">{order.customer_email}</p>
              <p className="text-sm text-gray-600">{order.customer_phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.order_status]}`}>
                  {order.order_status}
                </span>
                <select
                  value={order.order_status}
                  onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Shipping Address</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>{order.shipping_address}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <img
                      src={`${API_BASE_URL}${item.product_image}`}
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    
                    {/* Product Info */}
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.product_name}</h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × ₹{item.price}
                      </p>
                      <p className="text-sm font-semibold text-valentine-red">
                        Subtotal: ₹{item.quantity * item.price}
                      </p>
                    </div>
                  </div>

                  {/* Custom Images Section */}
                  {item.customization_images && item.customization_images.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <ImageIcon className="w-5 h-5 text-valentine-red" />
                          <h5 className="font-semibold text-valentine-red">
                            Customer Uploaded Images ({item.customization_images.length})
                          </h5>
                        </div>
                        <button
                          onClick={() => downloadAllImages(item)}
                          className="flex items-center space-x-2 bg-valentine-red text-white px-4 py-2 rounded-lg hover:bg-valentine-darkRed transition-colors text-sm"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download All</span>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        {item.customization_images.map((imageUrl, imgIndex) => (
                          <div key={imgIndex} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`Custom ${imgIndex + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-valentine-lightPink"
                            />
                            <button
                              onClick={() => downloadImage(imageUrl, `order-${order.order_number}-${item.product_name}-${imgIndex + 1}.jpg`)}
                              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                            >
                              <Download className="w-6 h-6 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-valentine-red">₹{order.total_amount}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>Payment Method:</span>
              <span>{order.payment_method}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Payment Status:</span>
              <span className={order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                {order.payment_status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
