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
        
        {/* Gradient Overlay - Reduced opacity for clearer image */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/20 sm:via-white/10 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-start sm:items-center pt-8 sm:pt-0">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-lg lg:max-w-xl animate-fade-in">
              {/* Valentine Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-valentine-red to-valentine-rose text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-3 sm:mb-4 shadow-lg">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                <span className="text-xs sm:text-sm font-semibold">Valentine Special Collection</span>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-premium-black leading-tight mb-3 sm:mb-4 drop-shadow-lg">
                <span className="block text-shadow-lg">Where Memories Turn Into</span>
                <span className="block bg-gradient-to-r from-valentine-red via-valentine-rose to-premium-gold bg-clip-text text-transparent drop-shadow-2xl">
                  Masterpieces
                </span>
              </h1>
              
              <p className="font-body text-sm sm:text-base md:text-lg lg:text-xl text-gray-900 mb-4 sm:mb-5 md:mb-7 max-w-md font-medium leading-relaxed drop-shadow-md">
                Luxury photography, custom gifts, and premium prints crafted for your once-in-a-lifetime memories.
              </p>

              <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                <button 
                  className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-valentine-red to-valentine-rose rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                  onClick={() => navigate('/shop')}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-valentine-rose to-valentine-red opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:animate-pulse" />
                  <span className="relative z-10">Explore Collection</span>
                  <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 blur-xl bg-valentine-red transition-opacity duration-300" />
                </button>
              </div>

              {/* Offer Banner */}
              <div className="mt-4 sm:mt-5 md:mt-8 inline-block">
                <div className="bg-white/80 backdrop-blur-sm border-2 border-valentine-red/30 rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg">
                  <p className="text-valentine-red font-semibold text-xs sm:text-sm">
                    🎉 Limited Time: <span className="text-valentine-darkRed font-bold">Flat 20% OFF</span> on Valentine Collection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Credibility Section */}
      <div className="bg-white border-t border-gray-100 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {/* Happy Customers */}
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-valentine-red mb-1">500+</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Happy Customers</div>
            </div>
            
            {/* Years of Experience */}
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-valentine-red mb-1">10+</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Years Experience</div>
            </div>
            
            {/* Rating */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-2xl sm:text-3xl font-bold text-valentine-red">5.0</span>
                <div className="flex text-premium-gold">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Customer Rating</div>
            </div>
            
            {/* Testimonial Preview */}
            <div className="text-center col-span-2 md:col-span-1">
              <div className="text-valentine-red text-xl sm:text-2xl mb-1">"</div>
              <div className="text-xs sm:text-sm text-gray-700 italic font-medium">Amazing quality & service!</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
