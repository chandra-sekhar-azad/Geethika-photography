import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden bg-black">
      {/* Hero Content */}
      {/* Hero Content */}
      <div className="relative min-h-[450px] xs:min-h-[500px] sm:min-h-[550px] md:min-h-[600px] lg:min-h-[700px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/bokeh-background.jpg"
            alt="Photography studio with bokeh lighting"
            className="w-full h-full object-cover opacity-40"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Decorative bokeh lights overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="absolute top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-orange-primary/15 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-20 w-24 h-24 sm:w-32 sm:h-32 bg-orange-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/4 w-20 h-20 sm:w-24 sm:h-24 bg-orange-primary/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-20 py-12">
          <div className="max-w-2xl animate-fade-in">
            {/* Badge */}
            <div className="inline-block mb-6 sm:mb-8">
              <div className="border border-orange-primary/30 px-4 py-2 inline-block">
                <p className="text-gray-400 text-xs sm:text-sm tracking-[0.3em] uppercase">
                  ESTD 2012
                </p>
              </div>
            </div>

            {/* Text removed as per request */}

            <div className="border-l-2 border-orange-primary pl-4 sm:pl-6 mb-6 sm:mb-8">
              <p className="font-body text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed tracking-wide uppercase text-sm">
                PHOTOGRAPHER
              </p>
            </div>

            <p className="font-body text-sm sm:text-base md:text-lg text-gray-400 mb-6 sm:mb-8 max-w-xl leading-relaxed">
              Luxury photography, custom gifts, and premium prints crafted for your once-in-a-lifetime memories.
            </p>

            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
              <button
                className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-black bg-orange-primary hover:bg-orange-hover transition-all duration-300 uppercase tracking-wider"
                onClick={() => navigate('/shop')}
              >
                <span>Explore Collection</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <button
                className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white border border-white/30 hover:border-orange-primary hover:text-orange-primary transition-all duration-300 uppercase tracking-wider"
                onClick={() => navigate('/services')}
              >
                <span>View Services</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Credibility Section */}
      <div className="bg-black border-t border-gray-800 py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Happy Customers */}
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-primary mb-2">500+</div>
              <div className="text-xs sm:text-sm text-white font-medium uppercase tracking-wider">Happy Customers</div>
            </div>

            {/* Years of Experience */}
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-primary mb-2">10+</div>
              <div className="text-xs sm:text-sm text-white font-medium uppercase tracking-wider">Years Experience</div>
            </div>

            {/* Rating */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-primary">5.0</span>
              </div>
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-orange-primary" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <div className="text-xs sm:text-sm text-white font-medium uppercase tracking-wider">Customer Rating</div>
            </div>

            {/* Projects */}
            <div className="text-center col-span-2 md:col-span-1">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-primary mb-2">1000+</div>
              <div className="text-xs sm:text-sm text-white font-medium uppercase tracking-wider">Projects Done</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
