import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroBanner = () => {
  const navigate = useNavigate();
  const [heroImageUrl, setHeroImageUrl] = useState(null);

  useEffect(() => {
    const fetchHeroBanner = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiBase}/api/homepage/content`);
        const data = await response.json();

        if (data?.success && data.content?.hero_banner?.image_url) {
          // Backend returns relative path like /uploads/...
          setHeroImageUrl(`${apiBase}${data.content.hero_banner.image_url}`);
        }
      } catch (err) {
        // Fail silently and fall back to default image
        console.error('Failed to load hero banner image:', err);
      }
    };

    fetchHeroBanner();
  }, []);

  const fallbackImage = '/images/bokeh-background.jpg';
  const backgroundImageSrc = heroImageUrl || fallbackImage;

  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-hero)' }}>
      {/* Hero Content */}
      <div className="relative min-h-[450px] xs:min-h-[500px] sm:min-h-[550px] md:min-h-[600px] lg:min-h-[700px] flex items-center">
        {/* Background Image (dynamic from admin, with graceful fallback) */}
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImageSrc}
            alt="Photography studio hero banner"
            className="w-full h-full object-cover opacity-20"
            onError={(e) => {
              if (e.currentTarget.src !== fallbackImage) {
                e.currentTarget.src = fallbackImage;
              }
            }}
          />
          {/* Light teal overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(178,216,216,0.85) 0%, rgba(168,213,213,0.7) 60%, rgba(128,192,192,0.6) 100%)' }} />
        </div>

        {/* Decorative teal orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="absolute top-10 right-10 w-40 h-40 sm:w-56 sm:h-56 rounded-full blur-3xl animate-float" style={{ backgroundColor: 'rgba(91,163,163,0.18)' }} />
          <div className="absolute bottom-20 left-1/4 w-28 h-28 sm:w-40 sm:h-40 rounded-full blur-3xl animate-float" style={{ backgroundColor: 'rgba(61,138,138,0.12)', animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-10 w-16 h-16 rounded-full blur-2xl animate-float" style={{ backgroundColor: 'rgba(128,192,192,0.2)', animationDelay: '3.5s' }} />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-20 py-12">
          <div className="max-w-2xl animate-fade-in">
            {/* Badge */}
            <div className="inline-block mb-6 sm:mb-8">
              <div className="border px-4 py-2 inline-block" style={{ borderColor: 'rgba(18,42,60,0.2)' }}>
                <p className="text-xs sm:text-sm tracking-[0.3em] uppercase font-body" style={{ color: 'var(--color-text-mid)' }}>
                  ESTD 2012
                </p>
              </div>
            </div>

            <div className="border-l-2 pl-4 sm:pl-6 mb-6 sm:mb-8" style={{ borderColor: 'var(--color-navy-800)' }}>
              <p className="font-body text-base sm:text-lg md:text-xl leading-relaxed tracking-widest uppercase text-sm" style={{ color: 'var(--color-navy-800)' }}>
                PHOTOGRAPHER
              </p>
            </div>

            <p className="font-body text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-xl leading-relaxed" style={{ color: 'var(--color-text-mid)' }}>
              Luxury photography, custom gifts, and premium prints crafted for your once-in-a-lifetime memories.
            </p>

            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
              <button
                className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-body font-medium text-white transition-all duration-300 uppercase tracking-widest hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--color-navy-800)' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-teal-500)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-navy-800)'}
                onClick={() => navigate('/shop')}
              >
                <span>Explore Collection</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <button
                className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-body font-medium transition-all duration-300 uppercase tracking-widest hover:-translate-y-0.5"
                style={{ border: '1.5px solid var(--color-navy-800)', color: 'var(--color-navy-800)', backgroundColor: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-navy-800)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-navy-800)'; }}
                onClick={() => navigate('/services')}
              >
                <span>View Services</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Credibility Section */}
      <div className="border-t py-6 sm:py-8 md:py-12" style={{ backgroundColor: 'var(--color-navy-800)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Happy Customers */}
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold mb-2" style={{ color: 'var(--color-teal-300)' }}>500+</div>
              <div className="text-xs sm:text-sm font-body font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.7)' }}>Happy Customers</div>
            </div>

            {/* Years of Experience */}
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold mb-2" style={{ color: 'var(--color-teal-300)' }}>10+</div>
              <div className="text-xs sm:text-sm font-body font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.7)' }}>Years Experience</div>
            </div>

            {/* Rating */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold" style={{ color: 'var(--color-teal-300)' }}>5.0</span>
              </div>
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5" style={{ fill: 'var(--color-teal-300)' }} viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <div className="text-xs sm:text-sm font-body font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.7)' }}>Customer Rating</div>
            </div>

            {/* Projects */}
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold mb-2" style={{ color: 'var(--color-teal-300)' }}>1000+</div>
              <div className="text-xs sm:text-sm font-body font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.7)' }}>Projects Done</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
