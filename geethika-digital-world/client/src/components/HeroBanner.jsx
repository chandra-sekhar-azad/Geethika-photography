import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-pink-50 via-red-50 to-rose-50">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-valentine-pink/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-valentine-red/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-valentine-rose/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Background Image */}
      <div className="relative h-[500px] md:h-[600px] lg:h-[650px]">
        <img
          src="/images/image copy 6.png"
          alt="Romantic couple with roses and champagne"
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/60 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-2xl animate-fade-in">
              {/* Valentine Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-valentine-red to-valentine-rose text-white px-4 py-2 rounded-full mb-6 shadow-lg">
                <Heart className="w-4 h-4 fill-current" />
                <span className="text-sm font-semibold">Valentine Special Collection</span>
                <Sparkles className="w-4 h-4" />
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-4">
                <span className="italic">Thoughtful Gifts</span>
                <br />
                <span className="bg-gradient-to-r from-valentine-red via-valentine-rose to-valentine-pink bg-clip-text text-transparent">
                  for Every Love Story
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl">
                Celebrate your special moments with personalized gifts, stunning photography, and unforgettable experiences
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="btn-romantic text-base md:text-lg inline-flex items-center justify-center gap-2"
                  onClick={() => navigate('/shop')}
                >
                  <Heart className="w-5 h-5" />
                  Explore Collection
                </button>
                <button 
                  className="btn-secondary text-base md:text-lg inline-flex items-center justify-center gap-2"
                  onClick={() => navigate('/services')}
                >
                  <Sparkles className="w-5 h-5" />
                  Book Services
                </button>
              </div>

              {/* Offer Banner */}
              <div className="mt-8 inline-block">
                <div className="bg-white/80 backdrop-blur-sm border-2 border-valentine-red/30 rounded-2xl px-6 py-3 shadow-lg">
                  <p className="text-valentine-red font-semibold text-sm md:text-base">
                    🎉 Limited Time Offer: <span className="text-valentine-darkRed font-bold">Flat 20% OFF</span> on Valentine Collection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
