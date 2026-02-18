import { Gift, Camera, Heart, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const SpecialOffers = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default offers as fallback
  const defaultOffers = [
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
      image: '/images/image%20copy.png',
      color: 'from-valentine-pink to-valentine-lightPink',
      action: () => navigate('/shop/personalised-gifts')
    },
    {
      icon: Camera,
      title: 'Photo Sessions',
      description: 'Book now & get 15% OFF on couple shoots',
      image: '/images/image%20copy%202.png',
      color: 'from-valentine-rose to-valentine-red',
      action: () => navigate('/services')
    },
    {
      icon: Sparkles,
      title: 'Premium Combos',
      description: 'Save up to 30% on gift combos',
      image: '/images/image%20copy%203.png',
      color: 'from-valentine-darkRed to-valentine-red',
      action: () => navigate('/shop')
    }
  ];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/homepage/content`);
        const data = await response.json();

        if (data.success && data.content && data.content.offers && data.content.offers.length > 0) {
          // Map API data to component structure
          const apiOffers = data.content.offers.map((offer, index) => {
            // Determine icon based on index or title (simplified logic)
            let Icon = Gift;
            if (index === 0) Icon = Heart;
            else if (index === 2) Icon = Camera;
            else if (index === 3) Icon = Sparkles;

            return {
              icon: Icon,
              title: offer.title,
              description: offer.description,
              image: offer.image_url ? `${import.meta.env.VITE_API_URL}${offer.image_url}` : defaultOffers[index % 4].image,
              action: () => navigate(offer.link_url || '/shop')
            };
          });
          setOffers(apiOffers);
        } else {
          setOffers(defaultOffers);
        }
      } catch (error) {
        console.error('Error fetching special offers:', error);
        setOffers(defaultOffers);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <section className="py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 xs:w-40 sm:w-48 h-32 xs:h-40 sm:h-48 bg-orange-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-32 xs:w-40 sm:w-48 h-32 xs:h-40 sm:h-48 bg-orange-primary/10 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 xs:mb-7 sm:mb-8 md:mb-12">
          <div className="inline-flex items-center gap-1.5 xs:gap-2 mb-2">
            <Heart className="w-4 h-4 xs:w-5 xs:h-5 text-orange-primary fill-orange-primary" />
            <span className="text-orange-primary font-semibold uppercase tracking-wider text-[10px] xs:text-xs sm:text-sm">Valentine's Day</span>
            <Heart className="w-4 h-4 xs:w-5 xs:h-5 text-orange-primary fill-orange-primary" />
          </div>
          <h2 className="section-title text-xl xs:text-2xl sm:text-3xl md:text-4xl text-white">Special Offers</h2>
          <p className="text-gray-300 text-xs xs:text-sm sm:text-base md:text-lg mt-1 xs:mt-2 px-2">
            Limited time deals for your special someone
          </p>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 md:gap-6">
          {loading ? (
            // Skeleton loading
            [...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-800 rounded-xl h-64 border-2 border-gray-700"></div>
            ))
          ) : (
            offers.map((offer, index) => {
              const Icon = offer.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-orange-primary/30 bg-gray-800 border-2 border-gray-700 hover:border-orange-primary"
                  onClick={offer.action}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden">
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
                    <div className="absolute top-2 right-2 xs:top-3 xs:right-3 md:top-4 md:right-4 bg-black/95 backdrop-blur-sm w-8 h-8 xs:w-10 xs:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-700 group-hover:border-orange-primary transition-colors">
                      <Icon className="w-4 h-4 xs:w-5 xs:h-5 md:w-6 md:h-6 text-orange-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 xs:p-4 md:p-6">
                    <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-display font-bold text-white mb-1 md:mb-2 line-clamp-1">
                      {offer.title}
                    </h3>
                    <p className="text-gray-300 text-xs xs:text-sm md:text-base mb-2 xs:mb-3 md:mb-4 line-clamp-2">
                      {offer.description}
                    </p>
                    <div className="inline-flex items-center gap-1 text-orange-primary font-semibold text-xs xs:text-sm group-hover:gap-2 transition-all">
                      <Heart className="w-3 h-3 xs:w-4 xs:h-4 fill-orange-primary opacity-80" />
                      <span>Shop Now</span>
                      <span className="ml-0.5 xs:ml-1 group-hover:ml-2 transition-all">→</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
