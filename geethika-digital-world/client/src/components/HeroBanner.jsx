import { useNavigate } from 'react-router-dom';

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-start overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/hero-bg.png" 
          alt="Happy couple with gift"
          className="w-full h-full object-cover object-right sm:object-center transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/40 to-transparent" />
      </div>

      {/* Content Container with large top padding to clear fixed navbar */}
      <div className="relative z-10 w-full px-6 sm:px-12 lg:px-24 pt-80 pb-12">
        <div className="md:max-w-2xl max-w-full animate-slide-up text-left">
          {/* Badge */}
          <span className="badge-yellow">Suitable for all occasions</span>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 text-gray-900">
            Turn Your <span className="italic text-[var(--color-primary)]">Memories</span> into <br />
            <span className="text-gray-900">Beautiful Gifts</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-lg font-body leading-relaxed">
            Customize T-shirts, Photo Frames, Mugs, and Premium Gifts crafted just for your special moments. Crafted in Eluru, delivered with care.
          </p>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/shop')}
              className="btn-primary flex items-center group"
            >
              Customize Now
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button 
              onClick={() => navigate('/shop')}
              className="px-8 py-3 rounded-md font-medium uppercase tracking-wider text-sm border border-gray-400 text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
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
