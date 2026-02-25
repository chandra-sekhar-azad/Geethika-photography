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
    <div className="group relative bg-white rounded-lg overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ borderColor: 'rgba(168,213,213,0.35)', boxShadow: '0 2px 12px rgba(26,43,53,0.06)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 40px rgba(61,138,138,0.14)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(26,43,53,0.06)'}
    >
      {showLoginPrompt && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-body font-semibold animate-bounce text-white"
          style={{ backgroundColor: 'var(--color-teal-500)' }}>
          Please login first
        </div>
      )}

      {addedToCart && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-body font-semibold animate-bounce">
          Added to cart!
        </div>
      )}

      {alreadyInCart && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-body font-semibold animate-bounce text-white"
          style={{ backgroundColor: 'var(--color-navy-800)' }}>
          Already in cart!
        </div>
      )}

      {/* Image - clickable to product detail */}
      <div className="relative overflow-hidden cursor-pointer" style={{ backgroundColor: 'var(--color-teal-50)' }} onClick={handleCardClick}>
        <img
          src={
            (product.image_url || product.image)?.startsWith('http')
              ? (product.image_url || product.image)
              : `${import.meta.env.VITE_API_URL}${product.image_url || product.image}`
          }
          alt={product.name}
          className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop';
          }}
        />

        {product.valentine_special && (
          <div className="absolute top-2 left-2 px-2 py-1 sm:px-3 sm:py-1 rounded text-[10px] sm:text-xs font-body font-semibold pointer-events-none text-white"
            style={{ backgroundColor: 'var(--color-teal-500)' }}>
            ✨ Special Item
          </div>
        )}
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 px-2 py-1 sm:px-3 sm:py-1 rounded text-[10px] sm:text-xs font-body font-semibold shadow-lg pointer-events-none text-white"
            style={{ backgroundColor: 'var(--color-navy-800)' }}>
            {product.discount}% OFF
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4">
        {/* Title - clickable to product detail */}
        <div onClick={handleCardClick} className="cursor-pointer relative z-10 mb-1.5 sm:mb-2">
          <h3 className="font-display font-semibold text-sm sm:text-base md:text-lg hover:opacity-70 transition-opacity line-clamp-2 tracking-wide"
            style={{ color: 'var(--color-text-dark)' }}>
            {product.name}
          </h3>
        </div>

        <p className="font-body text-[10px] sm:text-xs mb-2 sm:mb-3 line-clamp-2"
          style={{ color: 'var(--color-text-mid)' }}>
          {product.description}
        </p>

        <div className="flex items-center justify-between relative z-10">
          <div>
            {product.discount ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-sm sm:text-base md:text-lg font-display font-semibold" style={{ color: 'var(--color-teal-500)' }}>₹{finalPrice}</span>
                <span className="text-[10px] sm:text-xs line-through" style={{ color: 'var(--color-text-light)' }}>₹{product.price}</span>
              </div>
            ) : (
              <span className="text-sm sm:text-base md:text-lg font-display font-semibold" style={{ color: 'var(--color-teal-500)' }}>₹{product.price}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWishlistClick}
              className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer`}
              style={inWishlist
                ? { backgroundColor: 'var(--color-teal-400)', color: 'white' }
                : { backgroundColor: 'var(--color-teal-50)', color: 'var(--color-teal-500)' }
              }
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
              className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer`}
              style={isProductInCart
                ? { backgroundColor: 'var(--color-navy-800)', color: 'white' }
                : addedToCart
                  ? { backgroundColor: '#22c55e', color: 'white' }
                  : { backgroundColor: 'var(--color-teal-400)', color: 'white' }
              }
              aria-label={isProductInCart ? 'Already in cart' : 'Add to cart'}
              title={isProductInCart ? 'Already in cart - adjust quantity in cart page' : 'Add to cart'}
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {product.customizable && (
          <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs font-body font-semibold uppercase tracking-widest" style={{ color: 'var(--color-teal-400)' }}>
            ✨ Customizable
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
