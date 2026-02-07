import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const finalPrice = product.discount 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <div className="card group">
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
          {product.valentine_special && (
            <div className="absolute top-2 left-2 bg-valentine-red text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold">
              💝 Valentine Special
            </div>
          )}
          {product.discount && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold">
              {product.discount}% OFF
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
        
        <div className="flex items-center justify-between">
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
          
          <Link
            to={`/product/${product.id}`}
            className="bg-valentine-red text-white p-1.5 sm:p-2 rounded-full hover:bg-valentine-darkRed transition-colors"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>

        {product.customizable && (
          <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-valentine-pink font-semibold">
            ✨ Customizable
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
