import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();

  // Show login prompt if not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your cart and place orders</p>
          <button 
            onClick={() => navigate('/login', { state: { from: { pathname: '/cart' } } })} 
            className="btn-primary"
          >
            Login to Continue
          </button>
          <button 
            onClick={() => navigate('/shop')} 
            className="mt-3 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors w-full"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <button onClick={() => navigate('/shop')} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="valentine-gradient text-white py-8 sm:py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-2 sm:mb-4">
            Shopping Cart
          </h1>
          <p className="text-sm sm:text-base md:text-lg">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
                <div className="flex gap-3 sm:gap-4 md:gap-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 line-clamp-2">{item.name}</h3>
                    
                    {item.customization && (
                      <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 space-y-0.5 sm:space-y-1">
                        {item.customization.size && (
                          <p>Size: {item.customization.size}</p>
                        )}
                        {Object.entries(item.customization.textInputs || {}).map(([key, value]) => (
                          <p key={key} className="truncate">{key}: {value}</p>
                        ))}
                        {item.customization.image && (
                          <p className="text-green-600">✓ Custom image uploaded</p>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
                      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-gray-300 hover:border-valentine-red transition-colors flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <span className="text-base sm:text-lg font-semibold w-6 sm:w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-gray-300 hover:border-valentine-red transition-colors flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      <div className="text-left xs:text-right">
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-valentine-red">
                          ₹{item.finalPrice * item.quantity}
                        </p>
                        {item.basePrice !== item.finalPrice && (
                          <p className="text-xs sm:text-sm text-gray-500 line-through">
                            ₹{item.basePrice * item.quantity}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors self-start"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-4">
              <h2 className="text-xl sm:text-2xl font-display font-bold mb-4 sm:mb-6">
                Order Summary
              </h2>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="border-t pt-2 sm:pt-3 flex justify-between">
                  <span className="text-base sm:text-lg font-bold">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-valentine-red">
                    ₹{getCartTotal()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated()) {
                    navigate('/login', { state: { from: { pathname: '/cart' } } });
                  } else {
                    navigate('/checkout');
                  }
                }}
                className="w-full btn-primary flex items-center justify-center space-x-2 text-sm sm:text-base py-3"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={() => navigate('/shop')}
                className="w-full mt-3 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
