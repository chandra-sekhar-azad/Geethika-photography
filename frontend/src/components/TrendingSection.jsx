import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleProductCard from './SimpleProductCard';

const FADE_MS = 200;

const TrendingSection = () => {
  const navigate = useNavigate();
  const [allTrending, setAllTrending] = useState([]); // all trending products (valentine=true)
  const [products, setProducts] = useState([]);        // displayed products
  const [categories, setCategories] = useState([]);    // tabs: ['All', ...only cats with products]
  const [initialLoading, setInitialLoading] = useState(true);
  const [gridVisible, setGridVisible] = useState(true);
  const hasLoadedOnce = useRef(false);
  const [activeTab, setActiveTab] = useState('All');

  // On mount: fetch all trending products once, then derive category tabs from them
  useEffect(() => {
    const controller = new AbortController();

    fetch(`${import.meta.env.VITE_API_URL}/api/products?limit=100&valentine=true`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        const trending = data.products || [];
        setAllTrending(trending);
        setProducts(trending.slice(0, 8));
        setInitialLoading(false);
        hasLoadedOnce.current = true;

        // Derive unique categories that have at least one trending product
        const seen = new Set();
        const cats = ['All'];
        trending.forEach((p) => {
          const name = p.category_name;
          if (name && !seen.has(name)) {
            seen.add(name);
            cats.push(name);
          }
        });
        setCategories(cats);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch trending products:', err);
          setInitialLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  // When tab changes, filter from already-fetched allTrending
  useEffect(() => {
    if (!hasLoadedOnce.current) return;

    setGridVisible(false);
    setTimeout(() => {
      if (activeTab === 'All') {
        setProducts(allTrending.slice(0, 8));
      } else {
        setProducts(
          allTrending.filter((p) => p.category_name === activeTab).slice(0, 8)
        );
      }
      setGridVisible(true);
    }, FADE_MS);
  }, [activeTab, allTrending]);

  return (
    <section className="py-4 bg-[#F9F9F9]">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="section-title">Curated for Your Special Moments</h2>

          {/* Tabs — only show categories that have trending products */}
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
        <div className="min-h-[280px] md:min-h-[360px] lg:min-h-[420px]">
          {initialLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-purple-200 border-t-[var(--color-primary)] rounded-full animate-spin" />
            </div>
          ) : (
            <div
              className={`transition-all duration-300 ease-out motion-reduce:transition-none ${
                gridVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-2 pointer-events-none'
              }`}
            >
              {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-14 px-4 md:px-10 lg:px-20 trending-cards">
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className={`animate-slide-up motion-reduce:animate-none ${
                        products.length === 1 ? 'col-span-2 md:col-span-1' : ''
                      }`}
                      style={{ animationDelay: `${index * 0.05}s` }}
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
            </div>
          )}
        </div>

        {/* View All */}
        <div className="text-center mt-8 md:mt-12 lg:mt-16">
          <button onClick={() => navigate('/shop')} className="btn-outline">
            Explore All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
