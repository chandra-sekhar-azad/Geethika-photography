import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-pink-50 via-red-50 to-rose-50">
      {/* Decorative Elements - Valentine only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-valentine-pink/25 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 sm:w-32 sm:h-32 bg-valentine-red/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-20 h-20 sm:w-24 sm:h-24 bg-valentine-rose/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        {/* Floating hearts */}
        {[...Array(6)].map((_, i) => (
          <Heart
            key={i}
            className="absolute w-4 h-4 sm:w-5 sm:h-5 text-valentine-pink/40 fill-valentine-pink/30 animate-float-heart pointer-events-none"
            style={{
              left: `${12 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* Background Image */}
      <div className="relative h-[450px] xs:h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px]">
        <img
          src="/images/image copy 6.png"
          alt="Romantic couple with roses and champagne"
          className="w-full h-full object-cover object-center"
        />
        
        {/* Gradient Overlay - Adjusted for better mobile readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/30 sm:via-white/20 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-lg lg:max-w-xl animate-fade-in">
              {/* Valentine Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-valentine-red to-valentine-rose text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-3 sm:mb-4 shadow-lg valentine-glow border border-white/20">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-current animate-heartbeat" />
                <span className="text-[10px] xs:text-xs sm:text-sm font-semibold">Valentine's Day Special</span>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>

              <h1 className="font-heading text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-premium-black leading-tight mb-2 xs:mb-3 sm:mb-4 drop-shadow-lg">
                <span className="block text-shadow-lg">Where Memories</span>
                <span className="block text-shadow-lg">Turn Into</span>
                <span className="block bg-gradient-to-r from-valentine-red via-valentine-rose to-premium-gold bg-clip-text text-transparent drop-shadow-2xl">
                  Masterpieces
                </span>
              </h1>
              
              <p className="font-body text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-900 mb-3 xs:mb-4 sm:mb-5 md:mb-7 max-w-md font-medium leading-relaxed drop-shadow-md">
                Luxury photography, custom gifts, and premium prints crafted for your once-in-a-lifetime memories.
              </p>

              <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                <button 
                  className="group relative inline-flex items-center justify-center gap-2 px-5 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-xs xs:text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-valentine-red to-valentine-rose rounded-full shadow-xl shadow-valentine-red/30 hover:shadow-2xl hover:shadow-valentine-rose/40 transform hover:scale-105 transition-all duration-300 overflow-hidden valentine-glow border border-white/20"
                  onClick={() => navigate('/shop')}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-valentine-rose to-valentine-red opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Heart className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 relative z-10 group-hover:animate-heartbeat fill-current" />
                  <span className="relative z-10">Explore Collection</span>
                  <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 blur-xl bg-valentine-red transition-opacity duration-300" />
                </button>
              </div>

              {/* Offer Banner */}
              <div className="mt-3 xs:mt-4 sm:mt-5 md:mt-8 inline-block">
                <div className="bg-white/90 backdrop-blur-sm border-2 border-valentine-red/40 rounded-lg sm:rounded-xl px-2.5 xs:px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg flex items-center gap-1.5 xs:gap-2">
                  <Heart className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-valentine-red fill-valentine-red animate-heartbeat" />
                  <p className="text-valentine-red font-semibold text-[10px] xs:text-xs sm:text-sm">
                    💝 <span className="hidden xs:inline">Limited Time: </span><span className="text-valentine-darkRed font-bold">Flat 20% OFF</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Credibility Section - Valentine theme */}
      <div className="bg-gradient-to-r from-valentine-lightPink/10 via-white to-valentine-pink/10 border-t-2 border-valentine-pink/20 py-4 xs:py-5 sm:py-6 md:py-8">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 max-w-5xl mx-auto">
            {/* Happy Customers */}
            <div className="text-center">
              <div className="text-xl xs:text-2xl sm:text-3xl font-bold text-valentine-red mb-0.5 xs:mb-1">500+</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Happy Customers</div>
            </div>
            
            {/* Years of Experience */}
            <div className="text-center">
              <div className="text-xl xs:text-2xl sm:text-3xl font-bold text-valentine-red mb-0.5 xs:mb-1">10+</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Years Experience</div>
            </div>
            
            {/* Rating */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-0.5 xs:gap-1 mb-0.5 xs:mb-1">
                <span className="text-xl xs:text-2xl sm:text-3xl font-bold text-valentine-red">5.0</span>
                <div className="flex text-premium-gold">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Customer Rating</div>
            </div>
            
            {/* Testimonial Preview */}
            <div className="text-center col-span-2 md:col-span-1">
              <div className="text-valentine-red text-lg xs:text-xl sm:text-2xl mb-0.5 xs:mb-1">"</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-gray-700 italic font-medium">Amazing quality!</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
