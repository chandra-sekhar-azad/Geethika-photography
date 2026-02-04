import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const finalPrice = product.discount 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <div className="card group">
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {product.valentineSpecial && (
            <div className="absolute top-2 left-2 bg-valentine-red text-white px-3 py-1 rounded-full text-xs font-semibold">
              💝 Valentine Special
            </div>
          )}
          {product.discount && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {product.discount}% OFF
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-valentine-red transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <div>
            {product.discount ? (
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-valentine-red">₹{finalPrice}</span>
                <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
              </div>
            ) : (
              <span className="text-xl font-bold text-valentine-red">₹{product.price}</span>
            )}
          </div>
          
          <Link
            to={`/product/${product.id}`}
            className="bg-valentine-red text-white p-2 rounded-full hover:bg-valentine-darkRed transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </Link>
        </div>

        {product.customizable && (
          <div className="mt-3 text-xs text-valentine-pink font-semibold">
            ✨ Customizable
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
