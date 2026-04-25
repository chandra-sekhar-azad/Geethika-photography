import { useNavigate } from 'react-router-dom';

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full h-[100vh] sm:min-h-[90vh] flex flex-col justify-end sm:justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/hero-bg.png" 
          alt="Happy couple with gift"
          className="w-full h-full object-cover object-center sm:object-right-top transition-transform duration-1000"
        />
        {/* Dynamic Gradient: Top-down on mobile, Left-right on desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent sm:bg-gradient-to-r sm:from-white/95 sm:via-white/40 sm:to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full px-6 sm:px-12 lg:px-24 pb-20 sm:pb-0 sm:pt-20">
        <div className="md:max-w-2xl max-w-full animate-slide-up text-left sm:text-left">
          {/* Badge */}
          <span className="badge-yellow mb-4 inline-block">Suitable for all occasions</span>

          {/* Headline */}
          <h1 className="text-[40px] leading-[1.1] md:text-7xl font-display font-bold mb-6 text-gray-900">
            Turn Your <span className="italic text-[var(--color-primary)]">Memories</span> <br className="hidden sm:block" />
            into <span className="text-gray-900">Beautiful Gifts</span>
          </h1>

          <p className="text-base md:text-xl text-gray-600 mb-10 max-w-lg font-body leading-relaxed">
            Customize T-shirts, Photo Frames, Mugs, and Premium Gifts crafted just for your special moments. Crafted in Eluru, delivered with care.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/shop')}
              className="btn-primary flex items-center justify-center group"
            >
              Customize Now
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button 
              onClick={() => navigate('/shop')}
              className="px-8 py-4 sm:py-3 rounded-md font-medium text-sm border border-gray-400 text-gray-700 hover:bg-gray-50 transition-all shadow-sm text-center"
            >
              Explore Gifts
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
