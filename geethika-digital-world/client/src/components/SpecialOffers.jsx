import { Gift, Camera, Heart, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SpecialOffers = () => {
  const navigate = useNavigate();

  const offers = [
    {
      icon: Heart,
      title: 'Valentine Special',
      description: 'Flat 20% OFF on all couple gifts',
      image: '/images/image.png',
      color: 'from-valentine-red to-valentine-rose',
      action: () => navigate('/shop/couple-gifts')
    },
    {
      icon: Gift,
      title: 'Personalized Gifts',
      description: 'Free customization on orders above ₹999',
      image: '/images/image copy.png',
      color: 'from-valentine-pink to-valentine-lightPink',
      action: () => navigate('/shop/personalised-gifts')
    },
    {
      icon: Camera,
      title: 'Photo Sessions',
      description: 'Book now & get 15% OFF on couple shoots',
      image: '/images/image copy 2.png',
      color: 'from-valentine-rose to-valentine-red',
      action: () => navigate('/services')
    },
    {
      icon: Sparkles,
      title: 'Premium Combos',
      description: 'Save up to 30% on gift combos',
      image: '/images/image copy 3.png',
      color: 'from-valentine-darkRed to-valentine-red',
      action: () => navigate('/shop')
    }
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-valentine-lightPink/5 via-white to-valentine-pink/5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-valentine-pink/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-valentine-rose/10 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-valentine-red fill-valentine-red" />
            <span className="text-valentine-red font-semibold uppercase tracking-wider text-sm">Valentine's Day</span>
            <Heart className="w-5 h-5 text-valentine-red fill-valentine-red" />
          </div>
          <h2 className="section-title text-2xl md:text-3xl lg:text-4xl">Special Offers</h2>
          <p className="text-gray-600 text-base md:text-lg mt-2">
            Limited time deals for your special someone
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {offers.map((offer, index) => {
            const Icon = offer.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-valentine-red/15 bg-white border-2 border-valentine-pink/20 hover:border-valentine-red/40"
                onClick={offer.action}
              >
                {/* Image */}
                <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback gradient background if image fails */}
                  <div 
                    className="absolute inset-0 hidden items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, var(--color-valentine-red), var(--color-valentine-rose))`,
                    }}
                  >
                    <Icon className="w-12 h-12 md:w-16 md:h-16 text-white opacity-50" />
                  </div>
                  {/* Overlay gradient - Valentine tint */}
                  <div className="absolute inset-0 bg-gradient-to-t from-valentine-darkRed/50 via-valentine-red/20 to-transparent" />
                  
                  {/* Icon badge */}
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/95 backdrop-blur-sm w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-valentine-pink/30 group-hover:border-valentine-red/50 transition-colors">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-valentine-red" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-display font-bold text-gray-900 mb-1 md:mb-2 line-clamp-1">
                    {offer.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4 line-clamp-2">
                    {offer.description}
                  </p>
                  <div className="inline-flex items-center gap-1 text-valentine-red font-semibold text-sm group-hover:gap-2 transition-all">
                    <Heart className="w-4 h-4 fill-valentine-red opacity-80" />
                    <span>Shop Now</span>
                    <span className="ml-1 group-hover:ml-2 transition-all">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
