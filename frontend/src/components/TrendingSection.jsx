import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleProductCard from './SimpleProductCard';

const TrendingSection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', 'Mugs', 'T-Shirts', 'Frames', 'Gifts'];

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/products?limit=8`;
      if (activeTab !== 'All') {
        let categorySlug = activeTab.toLowerCase();
        if (activeTab === 'Frames') categorySlug = 'photo-frames';
        if (activeTab === 'Gifts') categorySlug = 'personalised-gifts';
        url += `&category=${categorySlug}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-4 bg-[#F9F9F9]">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="section-title">Curated for Your Special Moments</h2>
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mt-4 md:mt-6 lg:mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2 rounded-full font-body text-sm font-medium transition-all duration-300 ${
                  activeTab === cat 
                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-purple-200' 
                    : 'bg-white text-gray-500 border border-gray-100 hover:border-purple-200 hover:text-[var(--color-primary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-14 px-4 md:px-10 lg:px-20">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <SimpleProductCard
                  product={product}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <p className="text-gray-400 font-body">No products found in this category.</p>
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-8 md:mt-12 lg:mt-16">
          <button
            onClick={() => navigate('/shop')}
            className="btn-outline"
          >
            Explore All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
