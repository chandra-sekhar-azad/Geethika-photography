import HeroBanner from '../components/HeroBanner';
import CategoriesSection from '../components/CategoriesSection';
import TrendingSection from '../components/TrendingSection';
import SpecialOffers from '../components/SpecialOffers';
import Testimonials from '../components/Testimonials';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <HeroBanner />
      <div className="py-6 xs:py-7 sm:py-8 md:py-12 lg:py-16">
        <SpecialOffers />
      </div>
      <div className="py-6 xs:py-7 sm:py-8 md:py-12 lg:py-16">
        <CategoriesSection />
      </div>
      <div className="py-6 xs:py-7 sm:py-8 md:py-12 lg:py-16">
        <TrendingSection />
      </div>
      <div className="py-6 xs:py-7 sm:py-8 md:py-12 lg:py-16">
        <Testimonials />
      </div>
    </div>
  );
};

export default HomePage;
