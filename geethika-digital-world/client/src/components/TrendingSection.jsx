import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleProductCard from './SimpleProductCard';
import { Sparkles } from 'lucide-react';

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

      if (data.products.length === 0) {
        const fallbackResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/products?limit=6`);
        const fallbackData = await fallbackResponse.json();
        setProducts(fallbackData.products || []);
      } else {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-10 sm:py-14 md:py-20 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg-white)' }}>
      {/* Subtle orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute top-16 left-10 w-64 h-64 rounded-full blur-3xl animate-float" style={{ backgroundColor: 'rgba(168,213,213,0.12)' }} />
        <div className="absolute bottom-16 right-10 w-64 h-64 rounded-full blur-3xl animate-float" style={{ backgroundColor: 'rgba(91,163,163,0.10)', animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-8 md:mb-14 animate-slide-up">
          <p className="font-body text-xs uppercase tracking-[0.25em] font-semibold mb-3 inline-flex items-center gap-2" style={{ color: 'var(--color-teal-400)' }}>
            <Sparkles className="w-4 h-4" />
            Hot Picks
            <Sparkles className="w-4 h-4" />
          </p>
          <h2 className="section-title text-2xl xs:text-3xl sm:text-4xl md:text-5xl">
            Trending Now
          </h2>
          <div className="mt-4 flex justify-center">
            <div className="h-0.5 w-14 rounded" style={{ backgroundColor: 'var(--color-teal-400)' }}></div>
          </div>
          <p className="font-body mt-5 text-xs xs:text-sm sm:text-base max-w-2xl mx-auto" style={{ color: 'var(--color-text-mid)' }}>
            Most loved gifts this season
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: 'var(--color-teal-400)' }}></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
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
          <div className="text-center py-12">
            <p className="font-body text-sm xs:text-base" style={{ color: 'var(--color-text-mid)' }}>No products available</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-10 md:mt-14">
          <button
            onClick={() => navigate('/shop')}
            className="btn-romantic inline-flex items-center gap-2 text-xs xs:text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
          >
            <Sparkles className="w-4 h-4" />
            Explore All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
