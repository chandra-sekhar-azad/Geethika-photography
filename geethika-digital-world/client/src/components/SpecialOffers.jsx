import { Gift, Camera, Heart, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SpecialOffers = () => {
  const navigate = useNavigate();

  const offers = [
    {
      icon: Heart,
      title: 'Valentine Special',
      description: 'Flat 20% OFF on all couple gifts',
      color: 'from-valentine-red to-valentine-rose',
      action: () => navigate('/shop/couple-gifts')
    },
    {
      icon: Gift,
      title: 'Personalized Gifts',
      description: 'Free customization on orders above ₹999',
      color: 'from-valentine-pink to-valentine-lightPink',
      action: () => navigate('/shop/personalised-gifts')
    },
    {
      icon: Camera,
      title: 'Photo Sessions',
      description: 'Book now & get 15% OFF on couple shoots',
      color: 'from-valentine-rose to-valentine-red',
      action: () => navigate('/services')
    },
    {
      icon: Sparkles,
      title: 'Premium Combos',
      description: 'Save up to 30% on gift combos',
      color: 'from-valentine-darkRed to-valentine-red',
      action: () => navigate('/shop')
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Special Offers</h2>
          <p className="text-gray-600 text-lg">
            Limited time deals you don't want to miss
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer, index) => {
            const Icon = offer.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, var(--color-valentine-red), var(--color-valentine-rose))`,
                }}
                onClick={offer.action}
              >
                <div className="relative z-10">
                  <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">
                    {offer.title}
                  </h3>
                  <p className="text-white/90 text-sm mb-4">
                    {offer.description}
                  </p>
                  <div className="inline-flex items-center text-white font-semibold text-sm group-hover:gap-2 transition-all">
                    <span>Shop Now</span>
                    <span className="ml-1 group-hover:ml-2 transition-all">→</span>
                  </div>
                </div>
                
                {/* Decorative circles */}
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
