import { useState } from 'react';
import { Download, Upload, X, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';

const OrderDetailsModal = ({ order, onClose, onUpdateStatus }) => {
  const [uploadingDesign, setUploadingDesign] = useState(null);
  const [designFile, setDesignFile] = useState(null);

  const handleDesignUpload = async (orderItemId) => {
    if (!designFile) return;

    const formData = new FormData();
    formData.append('design', designFile);

    try {
      setUploadingDesign(orderItemId);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/designs/upload/${orderItemId}`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        }
      );

      if (response.ok) {
        alert('Design uploaded successfully!');
        setDesignFile(null);
        window.location.reload();
      } else {
        alert('Failed to upload design');
      }
    } catch (error) {
      console.error('Error uploading design:', error);
      alert('Failed to upload design');
    } finally {
      setUploadingDesign(null);
    }
  };

  const downloadImage = (url, filename) => {
    const link = document.createElement('a');
    link.href = url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL}${url}`;
    link.download = filename || 'image.jpg';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-semibold">{order.order_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold">{new Date(order.created_at).toLocaleString()}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <p>{order.customer_name}</p>
              <p className="text-sm text-gray-600">{order.customer_email}</p>
              <p className="text-sm text-gray-600">{order.customer_phone}</p>
              <p className="text-sm text-gray-600 mt-2">{order.shipping_address}</p>
              <p className="text-sm text-gray-600">{order.city}, {order.state} - {order.pincode}</p>
            </div>

            {/* Order Items with Customization */}
            <div>
              <h3 className="font-semibold mb-3">Order Items</h3>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.product_image?.startsWith('http') 
                            ? item.product_image 
                            : `${import.meta.env.VITE_API_URL}${item.product_image}`
                          } 
                          alt={item.product_name} 
                          className="w-16 h-16 object-cover rounded" 
                        />
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          {item.customization_text && (
                            <p className="text-sm text-blue-600 mt-1">
                              Custom Text: {item.customization_text}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="font-semibold">₹{parseFloat(item.price * item.quantity).toLocaleString()}</p>
                    </div>

                    {/* Customer Uploaded Images */}
                    {item.customization_images && item.customization_images.length > 0 && (
                      <div className="mt-3 border-t pt-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Customer Uploaded Images ({item.customization_images.length})
                          </h4>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {item.customization_images.map((img, imgIndex) => (
                            <div key={imgIndex} className="relative group">
                              <img
                                src={img.startsWith('http') ? img : `${import.meta.env.VITE_API_URL}${img}`}
                                alt={`Customer upload ${imgIndex + 1}`}
                                className="w-full h-24 object-cover rounded border"
                              />
                              <button
                                onClick={() => downloadImage(img, `customer-image-${imgIndex + 1}.jpg`)}
                                className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              >
                                <Download className="w-6 h-6 text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Admin Design Upload Section */}
                    {item.customization_images && item.customization_images.length > 0 && (
                      <div className="mt-3 border-t pt-3 bg-blue-50 rounded p-3">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Upload Designed Image
                        </h4>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => setDesignFile(e.target.files[0])}
                            className="text-sm"
                          />
                          <button
                            onClick={() => handleDesignUpload(item.id)}
                            disabled={!designFile || uploadingDesign === item.id}
                            className="px-4 py-2 bg-valentine-red text-white rounded hover:bg-valentine-darkRed disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                          >
                            {uploadingDesign === item.id ? 'Uploading...' : 'Upload Design'}
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Upload your designed image for customer approval
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>₹{parseFloat(order.subtotal).toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Discount:</span>
                  <span>-₹{parseFloat(order.discount).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹{parseFloat(order.total).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
