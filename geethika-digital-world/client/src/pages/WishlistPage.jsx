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
      <div className="min-h-screen bg-background">
        <div className="relative bg-gradient-to-r from-valentine-pink/30 to-valentine-red/20 py-8 sm:py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-valentine-red mb-2 sm:mb-4 italic">
              My Wishlist
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-700">
              Save your favorite items for later
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Start adding products you love!</p>
            <Link
              to="/shop"
              className="inline-block bg-gradient-to-r from-valentine-red to-valentine-rose text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-gradient-to-r from-valentine-pink/30 to-valentine-red/20 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-valentine-red mb-2 sm:mb-4 italic">
            My Wishlist
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {wishlist.map((product) => {
            const finalPrice = product.discount 
              ? product.price - (product.price * product.discount / 100)
              : product.price;

            return (
              <div key={product.id} className="card-romantic group relative">
                <Link to={`/product/${product.id}`}>
                  <div className="relative overflow-hidden bg-gray-100">
                    <img
                      src={
                        (product.image_url || product.image)?.startsWith('http')
                          ? (product.image_url || product.image)
                          : `${import.meta.env.VITE_API_URL}${product.image_url || product.image}`
                      }
                      alt={product.name}
                      className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
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
                      className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-valentine-red hover:bg-valentine-red hover:text-white transition-all duration-300 hover:scale-110 z-10"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    
                    {product.valentine_special && (
                      <div className="absolute top-2 left-2 bg-valentine-red text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold">
                        💝 Valentine Special
                      </div>
                    )}
                    {product.discount && (
                      <div className="absolute top-12 left-2 bg-gradient-to-r from-valentine-red to-valentine-rose text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-lg">
                        💝 {product.discount}% OFF
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-3 sm:p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1.5 sm:mb-2 hover:text-valentine-red transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      {product.discount ? (
                        <div className="flex items-center space-x-1.5 sm:space-x-2">
                          <span className="text-base sm:text-lg md:text-xl font-bold text-valentine-red">₹{finalPrice}</span>
                          <span className="text-xs sm:text-sm text-gray-500 line-through">₹{product.price}</span>
                        </div>
                      ) : (
                        <span className="text-base sm:text-lg md:text-xl font-bold text-valentine-red">₹{product.price}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      addedToCart[product.id]
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-valentine-red to-valentine-rose text-white hover:shadow-lg'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    {addedToCart[product.id] ? 'Added to Cart!' : 'Add to Cart'}
                  </button>

                  {product.customizable && (
                    <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-valentine-pink font-semibold">
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
