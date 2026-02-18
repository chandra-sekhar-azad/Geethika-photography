import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleProductCard from './SimpleProductCard';
import { Sparkles, Heart } from 'lucide-react';

const TrendingSection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products?valentine=true&limit=6`);
      const data = await response.json();

      // If no valentine products, fetch regular products
      if (data.products.length === 0) {
        const fallbackResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/products?limit=6`);
        const fallbackData = await fallbackResponse.json();
        setProducts(fallbackData.products || []);
      } else {
        setProducts(data.products || []);
      }

      // Debug: Log product images
      console.log('Trending Products:', data.products?.map(p => ({ id: p.id, name: p.name, image: p.image_url })));
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-48 xs:w-56 sm:w-64 md:w-72 h-48 xs:h-56 sm:h-64 md:h-72 bg-orange-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-48 xs:w-56 sm:w-64 md:w-72 h-48 xs:h-56 sm:h-64 md:h-72 bg-orange-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-1.5 xs:gap-2 mb-2 xs:mb-3 md:mb-4">
            <Heart className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-orange-primary fill-orange-primary" />
            <span className="text-orange-primary font-semibold uppercase tracking-wider text-[10px] xs:text-xs sm:text-sm">
              Valentine Hot Picks
            </span>
            <Sparkles className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-orange-primary" />
          </div>
          <h2 className="section-title text-xl xs:text-2xl sm:text-3xl md:text-4xl text-white">
            Trending Now
          </h2>
          <p className="text-gray-300 text-xs xs:text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            Most loved gifts this Valentine season
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-8 xs:py-10 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 xs:h-12 xs:w-12 border-b-2 border-orange-primary"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 xs:gap-4 md:gap-6">
            {products.map((product) => (
              <div
                key={`product-${product.id}-${product.image_url}`}
                className="animate-slide-up"
                style={{ animationDelay: `${products.indexOf(product) * 0.1}s` }}
              >
                <SimpleProductCard
                  image={product.image_url?.startsWith('http')
                    ? product.image_url
                    : `${import.meta.env.VITE_API_URL}${product.image_url}`
                  }
                  price={product.discount
                    ? product.price - (product.price * product.discount / 100)
                    : product.price
                  }
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 xs:py-10 sm:py-12">
            <p className="text-gray-400 text-sm xs:text-base">No products available</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-6 xs:mt-8 sm:mt-10 md:mt-12">
          <button
            onClick={() => navigate('/shop')}
            className="btn-romantic inline-flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm sm:text-base px-5 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4"
          >
            <Sparkles className="w-4 h-4 xs:w-5 xs:h-5" />
            Explore All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
