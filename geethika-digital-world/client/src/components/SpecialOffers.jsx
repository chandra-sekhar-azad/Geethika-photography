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
    <section className="py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-valentine-lightPink/5 via-white to-valentine-pink/5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 xs:w-40 sm:w-48 h-32 xs:h-40 sm:h-48 bg-valentine-pink/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-32 xs:w-40 sm:w-48 h-32 xs:h-40 sm:h-48 bg-valentine-rose/10 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 xs:mb-7 sm:mb-8 md:mb-12">
          <div className="inline-flex items-center gap-1.5 xs:gap-2 mb-2">
            <Heart className="w-4 h-4 xs:w-5 xs:h-5 text-valentine-red fill-valentine-red" />
            <span className="text-valentine-red font-semibold uppercase tracking-wider text-[10px] xs:text-xs sm:text-sm">Valentine's Day</span>
            <Heart className="w-4 h-4 xs:w-5 xs:h-5 text-valentine-red fill-valentine-red" />
          </div>
          <h2 className="section-title text-xl xs:text-2xl sm:text-3xl md:text-4xl">Special Offers</h2>
          <p className="text-gray-600 text-xs xs:text-sm sm:text-base md:text-lg mt-1 xs:mt-2 px-2">
            Limited time deals for your special someone
          </p>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 md:gap-6">
          {offers.map((offer, index) => {
            const Icon = offer.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-valentine-red/15 bg-white border-2 border-valentine-pink/20 hover:border-valentine-red/40"
                onClick={offer.action}
              >
                {/* Image */}
                <div className="relative h-36 xs:h-40 sm:h-44 md:h-48 overflow-hidden">
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
                    <Icon className="w-10 h-10 xs:w-12 xs:h-12 md:w-16 md:h-16 text-white opacity-50" />
                  </div>
                  {/* Overlay gradient - Valentine tint */}
                  <div className="absolute inset-0 bg-gradient-to-t from-valentine-darkRed/50 via-valentine-red/20 to-transparent" />
                  
                  {/* Icon badge */}
                  <div className="absolute top-2 right-2 xs:top-3 xs:right-3 md:top-4 md:right-4 bg-white/95 backdrop-blur-sm w-8 h-8 xs:w-10 xs:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-valentine-pink/30 group-hover:border-valentine-red/50 transition-colors">
                    <Icon className="w-4 h-4 xs:w-5 xs:h-5 md:w-6 md:h-6 text-valentine-red" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 xs:p-4 md:p-6">
                  <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-display font-bold text-gray-900 mb-1 md:mb-2 line-clamp-1">
                    {offer.title}
                  </h3>
                  <p className="text-gray-600 text-xs xs:text-sm md:text-base mb-2 xs:mb-3 md:mb-4 line-clamp-2">
                    {offer.description}
                  </p>
                  <div className="inline-flex items-center gap-1 text-valentine-red font-semibold text-xs xs:text-sm group-hover:gap-2 transition-all">
                    <Heart className="w-3 h-3 xs:w-4 xs:h-4 fill-valentine-red opacity-80" />
                    <span>Shop Now</span>
                    <span className="ml-0.5 xs:ml-1 group-hover:ml-2 transition-all">→</span>
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
