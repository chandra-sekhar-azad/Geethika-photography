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
      let url = 'http://localhost:5000/api/products?';
      
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
      <div className="relative bg-gradient-to-r from-valentine-pink/30 to-valentine-red/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-valentine-red mb-4 italic">
            Shop Our Collection
          </h1>
          <p className="text-lg text-gray-700">
            Discover unique gifts and personalized items for every occasion
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg sticky top-24 border border-valentine-pink/20 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Filter className="w-5 h-5 text-valentine-red" />
                  <h2 className="text-xl font-bold text-valentine-red">Filters</h2>
                </div>

                {/* Valentine Special Filter */}
                <div className="mb-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showValentineOnly}
                      onChange={(e) => setShowValentineOnly(e.target.checked)}
                      className="w-4 h-4 text-valentine-red rounded focus:ring-valentine-red"
                    />
                    <span className="text-sm font-semibold">💝 Valentine Special Only</span>
                  </label>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-3">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium ${
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
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm font-medium ${
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
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                {loading ? 'Loading...' : `Showing ${filteredProducts.length} products`}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-valentine-red"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found in this category.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setShowValentineOnly(false);
                  }}
                  className="mt-4 text-valentine-red font-semibold hover:underline"
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
