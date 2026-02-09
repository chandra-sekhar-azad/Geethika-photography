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
            <Heart className="w-6 h-6 text-valentine-red fill-valentine-red" />
            <span className="text-valentine-red font-semibold uppercase tracking-wider text-sm">
              Valentine Hot Picks
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
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-valentine-red"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
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
            <p className="text-gray-500">No products available</p>
          </div>
        )}

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
