import { useNavigate } from 'react-router-dom';
import SimpleProductCard from './SimpleProductCard';
import { products } from '../data/products';
import { TrendingUp, Sparkles } from 'lucide-react';

const TrendingSection = () => {
  const navigate = useNavigate();

  // Get Valentine special products or first 6 products
  const trendingProducts = products
    .filter(p => p.valentineSpecial)
    .slice(0, 6);

  const displayProducts = trendingProducts.length > 0 
    ? trendingProducts 
    : products.slice(0, 6);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-pink-50 via-white to-rose-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-valentine-rose/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-valentine-pink/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-valentine-red" />
            <span className="text-valentine-red font-semibold uppercase tracking-wider text-sm">
              Hot Picks
            </span>
            <Sparkles className="w-6 h-6 text-valentine-red" />
          </div>
          <h2 className="section-title">
            Trending Now
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Most loved gifts this Valentine season - handpicked just for you
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {displayProducts.map((product, index) => (
            <div 
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <SimpleProductCard
                image={product.image}
                price={product.discount 
                  ? product.price - (product.price * product.discount / 100)
                  : product.price
                }
                onClick={() => navigate(`/product/${product.id}`)}
              />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/shop')}
            className="btn-romantic inline-flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Explore All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
