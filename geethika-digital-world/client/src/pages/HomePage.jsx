import HeroBanner from '../components/HeroBanner';
import FeaturesSection from '../components/FeaturesSection';
import TrendingSection from '../components/TrendingSection';
import ShopByOccasionSection from '../components/ShopByOccasionSection';
import ProfessionalServicesSection from '../components/ProfessionalServicesSection';
import GalleryHomeSection from '../components/GalleryHomeSection';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';

const HomePage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-light)' }}>
      <HeroBanner />
      <FeaturesSection />
      <TrendingSection />
      <ShopByOccasionSection />
      <ProfessionalServicesSection />
      <GalleryHomeSection />
      <Testimonials />
      <CTASection />
    </div>
  );
};

export default HomePage;
