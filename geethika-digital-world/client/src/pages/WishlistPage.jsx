import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState({});

  const handleAddToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      finalPrice: product.discount
        ? product.price - (product.price * product.discount / 100)
        : product.price,
      image: product.image_url || product.image,
      quantity: 1,
      customization: null
    };

    const success = addToCart(cartItem);
    if (success) {
      setAddedToCart(prev => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedToCart(prev => ({ ...prev, [product.id]: false }));
      }, 2000);
    }
  };

  const handleRemove = (productId) => {
    removeFromWishlist(productId);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <div className="relative bg-black/50 py-8 sm:py-12 md:py-16 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-2 sm:mb-4 uppercase tracking-wide">
              My Wishlist
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-400">
              Save your favorite items for later
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-6">Start adding products you love!</p>
            <Link
              to="/shop"
              className="inline-block bg-orange-primary text-black px-6 py-3 rounded-full font-bold hover:shadow-lg hover:bg-orange-hover transition-all uppercase tracking-wide"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="relative bg-black/50 py-8 sm:py-12 md:py-16 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-2 sm:mb-4 uppercase tracking-wide">
            My Wishlist
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-400">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {wishlist.map((product) => {
            const finalPrice = product.discount
              ? product.price - (product.price * product.discount / 100)
              : product.price;

            return (
              <div key={product.id} className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-orange-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-primary/10">
                <Link to={`/product/${product.id}`}>
                  <div className="relative overflow-hidden bg-gray-800">
                    <img
                      src={
                        (product.image_url || product.image)?.startsWith('http')
                          ? (product.image_url || product.image)
                          : `${import.meta.env.VITE_API_URL}${product.image_url || product.image}`
                      }
                      alt={product.name}
                      className="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop';
                      }}
                    />

                    {/* Remove from wishlist button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(product.id);
                      }}
                      className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-red-600 transition-all duration-300 hover:scale-110 z-10 backdrop-blur-sm"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {product.valentine_special && (
                      <div className="absolute top-2 left-2 bg-orange-primary text-black px-2 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold pointer-events-none">
                        ✨ Special Item
                      </div>
                    )}
                    {product.discount && (
                      <div className="absolute top-12 left-2 bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-lg pointer-events-none">
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-2 sm:p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-bold text-xs sm:text-base md:text-lg mb-1.5 sm:mb-2 text-white hover:text-orange-primary transition-colors line-clamp-2 uppercase tracking-wide">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-400 text-[10px] sm:text-sm mb-2 sm:mb-3 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div>
                      {product.discount ? (
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <span className="text-sm sm:text-lg md:text-xl font-bold text-orange-primary">₹{finalPrice}</span>
                          <span className="text-[10px] sm:text-sm text-gray-500 line-through">₹{product.price}</span>
                        </div>
                      ) : (
                        <span className="text-sm sm:text-lg md:text-xl font-bold text-orange-primary">₹{product.price}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-2.5 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide text-sm ${addedToCart[product.id]
                      ? 'bg-green-600 text-white'
                      : 'bg-orange-primary text-black hover:bg-orange-hover hover:shadow-lg'
                      }`}
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    {addedToCart[product.id] ? 'Added to Cart!' : 'Add to Cart'}
                  </button>

                  {product.customizable && (
                    <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-orange-400 font-semibold uppercase tracking-wider">
                      ✨ Customizable
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
