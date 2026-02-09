import HeroBanner from '../components/HeroBanner';
import CategoriesSection from '../components/CategoriesSection';
import TrendingSection from '../components/TrendingSection';
import SpecialOffers from '../components/SpecialOffers';
import Testimonials from '../components/Testimonials';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-valentine-lightPink/5 via-background to-valentine-pink/5">
      <HeroBanner />
      <div className="py-8 sm:py-12 md:py-16">
        <SpecialOffers />
      </div>
      <div className="py-8 sm:py-12 md:py-16">
        <CategoriesSection />
      </div>
      <div className="py-8 sm:py-12 md:py-16">
        <TrendingSection />
      </div>
      <div className="py-8 sm:py-12 md:py-16">
        <Testimonials />
      </div>
    </div>
  );
};

export default HomePage;
