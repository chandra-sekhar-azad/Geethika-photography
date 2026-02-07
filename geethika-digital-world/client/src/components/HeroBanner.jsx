import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-pink-50 via-red-50 to-rose-50">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-valentine-pink/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 sm:w-32 sm:h-32 bg-valentine-red/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-20 h-20 sm:w-24 sm:h-24 bg-valentine-rose/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Background Image */}
      <div className="relative h-[400px] sm:h-[500px] md:h-[550px] lg:h-[650px]">
        <img
          src="/images/image copy 6.png"
          alt="Romantic couple with roses and champagne"
          className="w-full h-full object-cover object-center"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 sm:via-white/60 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-xl lg:max-w-2xl animate-fade-in">
              {/* Valentine Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-valentine-red to-valentine-rose text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6 shadow-lg">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                <span className="text-xs sm:text-sm font-semibold">Valentine Special Collection</span>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-premium-black leading-tight mb-3 sm:mb-4">
                <span className="block">Capturing Moments</span>
                <span className="block bg-gradient-to-r from-premium-gold via-valentine-red to-premium-royalBlue bg-clip-text text-transparent">
                  That Last Forever
                </span>
              </h1>
              
              <p className="font-body text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-4 sm:mb-6 md:mb-8 max-w-xl">
                Professional photography, personalized gifts, and premium printing services for your special moments
              </p>

              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
                <button 
                  className="btn-romantic text-sm sm:text-base md:text-lg inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 transform hover:scale-105 transition-transform duration-300"
                  onClick={() => navigate('/shop')}
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Book Now</span>
                </button>
              </div>

              {/* Offer Banner */}
              <div className="mt-4 sm:mt-6 md:mt-8 inline-block">
                <div className="bg-white/80 backdrop-blur-sm border-2 border-valentine-red/30 rounded-xl sm:rounded-2xl px-4 py-2 sm:px-6 sm:py-3 shadow-lg">
                  <p className="text-valentine-red font-semibold text-xs sm:text-sm md:text-base">
                    🎉 Limited Time: <span className="text-valentine-darkRed font-bold">Flat 20% OFF</span> on Valentine Collection
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
