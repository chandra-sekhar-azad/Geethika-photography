import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Filter, ChevronDown, X, ArrowUpDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/categories';

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
];

const ShopPage = () => {
  const { category } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showValentineOnly, setShowValentineOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const filtersRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  const sortedProducts = useMemo(() => {
    if (sortBy === 'default') return filteredProducts;
    const list = [...filteredProducts];
    if (sortBy === 'price_asc') return list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === 'price_desc') return list.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortBy === 'name_asc') return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    if (sortBy === 'name_desc') return list.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    return list;
  }, [filteredProducts, sortBy]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filtersRef.current && !filtersRef.current.contains(e.target)) setFiltersOpen(false);
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) setCategoryDropdownOpen(false);
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) setSortDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-light)' }}>
      {/* Header */}
      <div className="relative py-10 sm:py-14 md:py-18 border-b" style={{ backgroundColor: 'var(--color-bg-hero)', borderColor: 'rgba(168,213,213,0.4)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl mb-3 tracking-wide" style={{ color: 'var(--color-text-dark)' }}>
            Shop Our Collection
          </h1>
          <p className="font-body text-sm sm:text-base md:text-lg" style={{ color: 'var(--color-text-mid)' }}>
            Discover unique gifts and personalized items for every occasion
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="flex-1">
          {/* Filter bar - Mobile optimized */}
          <div className="mb-4 sm:mb-6">
            {/* Mobile Layout - Stacked */}
            <div className="flex flex-col gap-3 sm:hidden">
              {/* Product Count */}
              <p className="font-body text-sm" style={{ color: 'var(--color-text-mid)' }}>
                {loading ? 'Loading...' : `${sortedProducts.length} products`}
              </p>

              {/* Buttons Row */}
              <div className="flex gap-2">
                {/* Sort Button */}
                <div className="relative flex-1" ref={sortDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 border rounded-xl font-body font-semibold shadow-sm transition-all text-sm"
                    style={{ backgroundColor: 'white', borderColor: 'rgba(168,213,213,0.5)', color: 'var(--color-text-dark)' }}
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    <span>Sort</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {sortDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-2 rounded-xl shadow-xl overflow-hidden z-50 border bg-white" style={{ borderColor: 'rgba(168,213,213,0.4)' }}>
                      <div className="p-2 border-b" style={{ borderColor: 'rgba(168,213,213,0.3)' }}>
                        <h3 className="font-body font-semibold text-xs uppercase tracking-widest" style={{ color: 'var(--color-teal-500)' }}>Sort by</h3>
                      </div>
                      <div className="py-1">
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setSortBy(opt.value);
                              setSortDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-body font-medium transition-colors ${sortBy === opt.value
                              ? 'text-white'
                              : 'hover:bg-teal-50'
                              }`}
                            style={sortBy === opt.value ? { backgroundColor: 'var(--color-navy-800)', color: 'white' } : { color: 'var(--color-text-dark)' }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Filter Button */}
                <div className="relative flex-1" ref={filtersRef}>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 border rounded-xl font-body font-semibold shadow-sm transition-all text-sm"
                    style={{ backgroundColor: 'white', borderColor: 'rgba(168,213,213,0.5)', color: 'var(--color-text-dark)' }}
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {filtersOpen && (
                    <div className="absolute left-0 right-0 mt-2 rounded-xl shadow-xl overflow-visible z-50 border bg-white" style={{ borderColor: 'rgba(168,213,213,0.4)' }}>
                      <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: 'rgba(168,213,213,0.3)' }}>
                        <h3 className="font-body font-semibold flex items-center gap-2 text-sm uppercase tracking-widest" style={{ color: 'var(--color-teal-500)' }}>
                          <Filter className="w-4 h-4" />
                          Filter by
                        </h3>
                        <button
                          type="button"
                          onClick={() => setFiltersOpen(false)}
                          className="p-1 rounded-lg transition-colors"
                          style={{ color: 'var(--color-text-light)' }}
                          aria-label="Close filters"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-3 space-y-3">
                        {/* Category dropdown */}
                        <div ref={categoryDropdownRef} className="relative">
                          <label className="block font-body font-semibold text-xs mb-1.5" style={{ color: 'var(--color-text-mid)' }}>Category</label>
                          <button
                            type="button"
                            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                            className="w-full flex items-center justify-between px-3 py-2 border rounded-lg text-left font-body font-medium transition-colors text-sm bg-white"
                            style={{ borderColor: 'rgba(168,213,213,0.5)', color: 'var(--color-text-dark)' }}
                          >
                            <span className="truncate">
                              {selectedCategory === 'all'
                                ? 'All Products'
                                : categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ml-2 ${categoryDropdownOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--color-text-light)' }} />
                          </button>
                          {categoryDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg py-1 z-10 max-h-48 overflow-y-auto bg-white" style={{ borderColor: 'rgba(168,213,213,0.4)' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCategory('all');
                                  setCategoryDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs font-body font-medium transition-colors`}
                                style={selectedCategory === 'all' ? { backgroundColor: 'var(--color-navy-800)', color: 'white' } : { color: 'var(--color-text-dark)' }}
                              >
                                All Products
                              </button>
                              {categories.map((cat) => (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCategory(cat.id);
                                    setCategoryDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-xs font-body font-medium flex items-center gap-2 transition-colors`}
                                  style={selectedCategory === cat.id ? { backgroundColor: 'var(--color-navy-800)', color: 'white' } : { color: 'var(--color-text-dark)' }}
                                >
                                  <span>{cat.icon}</span>
                                  <span className="truncate">{cat.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Special Item */}
                        <div>
                          <label className="block font-body font-semibold text-xs mb-1.5" style={{ color: 'var(--color-text-mid)' }}>Type</label>
                          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-teal-50">
                            <input
                              type="checkbox"
                              checked={showValentineOnly}
                              onChange={(e) => setShowValentineOnly(e.target.checked)}
                              className="w-4 h-4 rounded"
                            />
                            <span className="text-xs font-body font-medium" style={{ color: 'var(--color-text-dark)' }}>✨ Special Item Only</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tablet/Desktop Layout - Inline */}
            <div className="hidden sm:flex flex-wrap items-center gap-3">
              <p className="font-body text-sm sm:text-base mr-auto" style={{ color: 'var(--color-text-mid)' }}>
                {loading ? 'Loading...' : `Showing ${sortedProducts.length} products`}
              </p>

              <div className="relative" ref={sortDropdownRef}>
                <button
                  type="button"
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 sm:py-3 border rounded-xl font-body font-semibold shadow-sm transition-all bg-white"
                  style={{ borderColor: 'rgba(168,213,213,0.5)', color: 'var(--color-text-dark)' }}
                >
                  <ArrowUpDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Sort</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {sortDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl overflow-hidden z-50 border bg-white" style={{ borderColor: 'rgba(168,213,213,0.4)' }}>
                    <div className="p-3 border-b" style={{ borderColor: 'rgba(168,213,213,0.3)' }}>
                      <h3 className="font-body font-semibold text-sm uppercase tracking-widest" style={{ color: 'var(--color-teal-500)' }}>Sort by</h3>
                    </div>
                    <div className="py-1">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.value);
                            setSortDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-body font-medium transition-colors`}
                          style={sortBy === opt.value ? { backgroundColor: 'var(--color-navy-800)', color: 'white' } : { color: 'var(--color-text-dark)' }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={filtersRef}>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 sm:py-3 border rounded-xl font-body font-semibold shadow-sm transition-all bg-white"
                  style={{ borderColor: 'rgba(168,213,213,0.5)', color: 'var(--color-text-dark)' }}
                >
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Filters</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                </button>

                {filtersOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl shadow-xl overflow-visible z-50 border bg-white" style={{ borderColor: 'rgba(168,213,213,0.4)' }}>
                    <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(168,213,213,0.3)' }}>
                      <h3 className="font-body font-semibold flex items-center gap-2 uppercase tracking-widest text-sm" style={{ color: 'var(--color-teal-500)' }}>
                        <Filter className="w-4 h-4" />
                        Filter by
                      </h3>
                      <button
                        type="button"
                        onClick={() => setFiltersOpen(false)}
                        className="p-1 rounded-lg transition-colors"
                        style={{ color: 'var(--color-text-light)' }}
                        aria-label="Close filters"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-4 space-y-4">
                      {/* Category dropdown */}
                      <div ref={categoryDropdownRef} className="relative">
                        <label className="block font-body font-semibold text-sm mb-2" style={{ color: 'var(--color-text-mid)' }}>Category</label>
                        <button
                          type="button"
                          onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                          className="w-full flex items-center justify-between px-3 py-2.5 border rounded-lg text-left font-body font-medium transition-colors bg-white"
                          style={{ borderColor: 'rgba(168,213,213,0.5)', color: 'var(--color-text-dark)' }}
                        >
                          <span>
                            {selectedCategory === 'all'
                              ? 'All Products'
                              : categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                          </span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--color-text-light)' }} />
                        </button>
                        {categoryDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg py-1 z-10 bg-white" style={{ borderColor: 'rgba(168,213,213,0.4)' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCategory('all');
                                setCategoryDropdownOpen(false);
                              }}
                              className="w-full text-left px-3 py-2.5 text-sm font-body font-medium transition-colors"
                              style={selectedCategory === 'all' ? { backgroundColor: 'var(--color-navy-800)', color: 'white' } : { color: 'var(--color-text-dark)' }}
                            >
                              All Products
                            </button>
                            {categories.map((cat) => (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  setSelectedCategory(cat.id);
                                  setCategoryDropdownOpen(false);
                                }}
                                className="w-full text-left px-3 py-2.5 text-sm font-body font-medium flex items-center gap-2 transition-colors"
                                style={selectedCategory === cat.id ? { backgroundColor: 'var(--color-navy-800)', color: 'white' } : { color: 'var(--color-text-dark)' }}
                              >
                                <span>{cat.icon}</span>
                                {cat.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Special Item */}
                      <div>
                        <label className="block font-body font-semibold text-sm mb-2" style={{ color: 'var(--color-text-mid)' }}>Type</label>
                        <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-teal-50">
                          <input
                            type="checkbox"
                            checked={showValentineOnly}
                            onChange={(e) => setShowValentineOnly(e.target.checked)}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-sm font-body font-medium" style={{ color: 'var(--color-text-dark)' }}>✨ Special Item Only</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2" style={{ borderColor: 'var(--color-teal-400)' }}></div>
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="font-body text-base sm:text-lg" style={{ color: 'var(--color-text-mid)' }}>No products found with these filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setShowValentineOnly(false);
                  setFiltersOpen(false);
                }}
                className="mt-4 font-body font-semibold hover:underline text-sm sm:text-base uppercase tracking-widest transition-colors"
                style={{ color: 'var(--color-teal-500)' }}
              >
                Clear filters & view all
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
