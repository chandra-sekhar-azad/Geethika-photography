import { useNavigate } from 'react-router-dom';
import CategoryCard from './CategoryCard';
import { categories } from '../data/categories';
import { Heart } from 'lucide-react';

const CategoriesSection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categorySlug) => {
    navigate(`/shop/${categorySlug}`);
  };

  // Get first 6 categories for display
  const displayCategories = categories.slice(0, 6);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white via-valentine-lightPink/5 to-white relative overflow-hidden">
      {/* Decorative Background - Valentine only */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-valentine-pink/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-valentine-rose/15 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-valentine-red fill-valentine-red" />
            <span className="text-valentine-red font-semibold uppercase tracking-wider text-sm">
              Discover
            </span>
            <Heart className="w-6 h-6 text-valentine-red fill-valentine-red" />
          </div>
          <h2 className="section-title">
            Shop by Categories
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find the perfect Valentine gift for your loved one from our curated collection
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {displayCategories.map((category, index) => (
            <div 
              key={category.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CategoryCard
                image={category.image || `/images/image.png`}
                title={category.name}
                onClick={() => handleCategoryClick(category.slug || category.id)}
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
            View All Categories
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
