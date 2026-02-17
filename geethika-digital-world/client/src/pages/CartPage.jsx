import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, AlertCircle, Upload } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartSubtotal, getServiceCharge, getFinalTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const [showCustomizationAlert, setShowCustomizationAlert] = useState(false);
  const [itemsNeedingCustomization, setItemsNeedingCustomization] = useState([]);

  // Check if any customizable items are missing images
  const checkCustomizationComplete = () => {
    const incompleteItems = cart.filter(item => {
      // Check if item is customizable and doesn't have an uploaded image
      return item.is_customizable && (!item.customization || !item.customization.image);
    });

    if (incompleteItems.length > 0) {
      setItemsNeedingCustomization(incompleteItems);
      setShowCustomizationAlert(true);
      return false;
    }
    return true;
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    // Check if all customizable items have images uploaded
    if (checkCustomizationComplete()) {
      navigate('/checkout');
    }
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-700 mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-white">Login Required</h2>
          <p className="text-gray-400 mb-6">Please login to view your cart and place orders</p>
          <button
            onClick={() => navigate('/login', { state: { from: { pathname: '/cart' } } })}
            className="px-6 py-3 bg-orange-primary text-black font-bold rounded-lg hover:bg-orange-hover transition-colors uppercase tracking-wide"
          >
            Login to Continue
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="mt-3 px-6 py-3 border border-gray-600 rounded-lg font-semibold text-gray-300 hover:bg-gray-800 transition-colors w-full uppercase tracking-wide"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-700 mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-white">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Add some products to get started!</p>
          <button onClick={() => navigate('/shop')} className="px-6 py-3 bg-orange-primary text-black font-bold rounded-lg hover:bg-orange-hover transition-colors uppercase tracking-wide">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="relative bg-black/50 py-8 sm:py-12 md:py-16 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-2 sm:mb-4 uppercase tracking-wide">
            Shopping Cart
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-400">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-gray-900 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-800 hover:border-orange-primary/30 transition-all duration-300">
                <div className="flex gap-3 sm:gap-4 md:gap-6">
                  <div className="relative group">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 line-clamp-2 text-white group-hover:text-orange-primary transition-colors uppercase tracking-wide">{item.name}</h3>

                    {item.customization && (
                      <div className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 space-y-0.5 sm:space-y-1 bg-black/20 p-2 rounded-lg">
                        {item.customization.size && (
                          <p><span className="text-gray-500">Size:</span> <span className="text-gray-300">{item.customization.size}</span></p>
                        )}
                        {Object.entries(item.customization.textInputs || {}).map(([key, value]) => (
                          <p key={key} className="truncate"><span className="text-gray-500">{key}:</span> <span className="text-gray-300">{value}</span></p>
                        ))}
                        {item.customization.image && (
                          <p className="text-green-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            Custom image uploaded
                          </p>
                        )}
                      </div>
                    )}

                    {/* Show warning if customizable but no image */}
                    {item.is_customizable && (!item.customization || !item.customization.image) && (
                      <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-2 mb-2 sm:mb-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-yellow-500 font-medium">
                              Image upload required
                            </p>
                            <p className="text-xs text-yellow-400/80 mt-0.5">
                              This item needs customization. Please upload your image.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
                      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-600 bg-black hover:border-orange-primary hover:text-orange-primary text-gray-400 transition-colors flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <span className="text-base sm:text-lg font-semibold w-6 sm:w-8 text-center text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-600 bg-black hover:border-orange-primary hover:text-orange-primary text-gray-400 transition-colors flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      <div className="text-left xs:text-right">
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-orange-primary">
                          ₹{item.finalPrice * item.quantity}
                        </p>
                        {item.basePrice !== item.finalPrice && (
                          <p className="text-xs sm:text-sm text-gray-600 line-through">
                            ₹{item.basePrice * item.quantity}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors self-start p-2 hover:bg-red-500/10 rounded-full"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-24 border border-gray-800">
              <h2 className="text-xl sm:text-2xl font-display font-bold mb-4 sm:mb-6 text-white uppercase tracking-wide">
                Order Summary
              </h2>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-semibold text-white">₹{getCartSubtotal()}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-400">Service Charge</span>
                  <span className="font-semibold text-white">₹{getServiceCharge()}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-400">Shipping</span>
                  <span className="font-semibold text-green-500">FREE</span>
                </div>
                <div className="border-t border-gray-800 pt-2 sm:pt-3 flex justify-between">
                  <span className="text-base sm:text-lg font-bold text-white">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-orange-primary">
                    ₹{getFinalTotal()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-orange-primary text-black font-bold uppercase tracking-wide flex items-center justify-center space-x-2 text-sm sm:text-base py-3 rounded-lg hover:bg-orange-hover transition-colors shadow-lg shadow-orange-primary/20"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={() => navigate('/shop')}
                className="w-full mt-3 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-600 rounded-lg font-semibold text-gray-300 hover:bg-gray-800 transition-colors text-sm sm:text-base uppercase tracking-wide"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customization Alert Modal */}
      {showCustomizationAlert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-fade-in border border-gray-800">
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-900/30 rounded-full mx-auto mb-4 border border-yellow-700/30">
              <Upload className="w-8 h-8 text-yellow-500" />
            </div>

            <h2 className="text-2xl font-bold text-center mb-3 text-white">
              Customization Required
            </h2>

            <p className="text-gray-400 text-center mb-6">
              The following items need custom images uploaded before checkout:
            </p>

            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {itemsNeedingCustomization.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded bg-gray-800"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm line-clamp-2 text-white">{item.name}</p>
                    <p className="text-xs text-yellow-500">Upload required</p>
                  </div>
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowCustomizationAlert(false);
                  // Navigate to shop to customize items
                  navigate('/shop');
                }}
                className="w-full bg-orange-primary text-black font-semibold py-3 rounded-lg hover:bg-orange-hover transition-colors uppercase tracking-wide"
              >
                Go to Shop & Customize
              </button>

              <button
                onClick={() => setShowCustomizationAlert(false)}
                className="w-full px-6 py-3 border border-gray-600 rounded-lg font-semibold text-gray-300 hover:bg-gray-800 transition-colors uppercase tracking-wide"
              >
                Continue Shopping
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              💡 Tip: Remove these items from cart or upload custom images to proceed
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
