import HeroBanner from '../components/HeroBanner';
import CategoriesSection from '../components/CategoriesSection';
import TrendingSection from '../components/TrendingSection';
import SpecialOffers from '../components/SpecialOffers';
import Testimonials from '../components/Testimonials';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroBanner />
      <SpecialOffers />
      <CategoriesSection />
      <TrendingSection />
      <Testimonials />
    </div>
  );
};

export default HomePage;
