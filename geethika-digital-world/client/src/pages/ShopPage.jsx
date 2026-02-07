import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/categories';

const ShopPage = () => {
  const { category } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showValentineOnly, setShowValentineOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, showValentineOnly]);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `${import.meta.env.VITE_API_URL}/api/products?`;
      
      if (selectedCategory !== 'all') {
        url += `category=${selectedCategory}&`;
      }
      
      if (showValentineOnly) {
        url += `valentine=true&`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setFilteredProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-valentine-pink/30 to-valentine-red/20 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-valentine-red mb-2 sm:mb-4 italic">
            Shop Our Collection
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700">
            Discover unique gifts and personalized items for every occasion
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg lg:sticky lg:top-24 border border-valentine-pink/20 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-valentine-red" />
                  <h2 className="text-lg sm:text-xl font-bold text-valentine-red">Filters</h2>
                </div>

                {/* Valentine Special Filter */}
                <div className="mb-4 sm:mb-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showValentineOnly}
                      onChange={(e) => setShowValentineOnly(e.target.checked)}
                      className="w-4 h-4 text-valentine-red rounded focus:ring-valentine-red"
                    />
                    <span className="text-xs sm:text-sm font-semibold">💝 Valentine Special Only</span>
                  </label>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Categories</h3>
                  <div className="space-y-1.5 sm:space-y-2">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all font-medium text-sm ${
                        selectedCategory === 'all'
                          ? 'bg-valentine-red text-white shadow-md'
                          : 'hover:bg-valentine-pink/10 text-gray-700'
                      }`}
                    >
                      All Products
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all text-xs sm:text-sm font-medium ${
                          selectedCategory === cat.id
                            ? 'bg-valentine-red text-white shadow-md'
                            : 'hover:bg-valentine-pink/10 text-gray-700'
                        }`}
                      >
                        {cat.icon} {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 sm:mb-6 flex justify-between items-center">
              <p className="text-sm sm:text-base text-gray-600">
                {loading ? 'Loading...' : `Showing ${filteredProducts.length} products`}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-valentine-red"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-base sm:text-lg">No products found in this category.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setShowValentineOnly(false);
                  }}
                  className="mt-4 text-valentine-red font-semibold hover:underline text-sm sm:text-base"
                >
                  View All Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
