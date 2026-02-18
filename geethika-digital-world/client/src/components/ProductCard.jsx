import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, cart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [addedToCart, setAddedToCart] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [alreadyInCart, setAlreadyInCart] = useState(false);

  const finalPrice = product.discount
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  const inWishlist = isInWishlist(product.id);

  // Check if product is already in cart
  const isProductInCart = cart.some(item => item.id === product.id);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Check if already in cart
    if (isProductInCart) {
      setAlreadyInCart(true);
      setTimeout(() => setAlreadyInCart(false), 2000);
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      finalPrice: finalPrice,
      image: product.image_url || product.image,
      quantity: 1,
      customization: null
    };

    const success = addToCart(cartItem);

    if (success) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      setTimeout(() => navigate('/login'), 500);
      return;
    }

    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-orange-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-primary/10 hover:-translate-y-1">
      {showLoginPrompt && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-orange-primary text-black px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-semibold animate-bounce">
          Please login first
        </div>
      )}

      {addedToCart && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-semibold animate-bounce">
          Added to cart!
        </div>
      )}

      {alreadyInCart && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-semibold animate-bounce">
          Already in cart!
        </div>
      )}

      {/* Image - clickable to product detail */}
      <div className="relative overflow-hidden bg-gray-800 cursor-pointer" onClick={handleCardClick}>
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

        {product.valentine_special && (
          <div className="absolute top-2 left-2 bg-orange-primary text-black px-2 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold pointer-events-none">
            ✨ Special Item
          </div>
        )}
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-lg pointer-events-none">
            {product.discount}% OFF
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4">
        {/* Title - clickable to product detail */}
        <div onClick={handleCardClick} className="cursor-pointer relative z-10 mb-2">
          <h3 className="font-display font-bold text-sm sm:text-base md:text-lg text-white hover:text-orange-primary transition-colors line-clamp-2 uppercase tracking-wide">
            {product.name}
          </h3>
        </div>

        <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between relative z-10">
          <div>
            {product.discount ? (
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="text-base sm:text-lg md:text-xl font-bold text-orange-primary">₹{finalPrice}</span>
                <span className="text-xs sm:text-sm text-gray-500 line-through">₹{product.price}</span>
              </div>
            ) : (
              <span className="text-base sm:text-lg md:text-xl font-bold text-orange-primary">₹{product.price}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWishlistClick}
              className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer ${inWishlist
                  ? 'bg-orange-primary text-black shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-orange-primary hover:text-black'
                }`}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${inWishlist ? 'fill-current' : ''}`}
              />
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isProductInCart}
              className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer ${isProductInCart
                  ? 'bg-blue-600 text-white shadow-lg cursor-not-allowed'
                  : addedToCart
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-orange-primary text-black hover:shadow-lg hover:shadow-orange-primary/30'
                }`}
              aria-label={isProductInCart ? 'Already in cart' : 'Add to cart'}
              title={isProductInCart ? 'Already in cart - adjust quantity in cart page' : 'Add to cart'}
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {product.customizable && (
          <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-orange-400 font-semibold uppercase tracking-wider">
            ✨ Customizable
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
