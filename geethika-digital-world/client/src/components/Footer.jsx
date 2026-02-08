import { Link, useLocation } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, Instagram } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  
  // Don't render footer on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* About */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2 mb-3 sm:mb-4">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-valentine-red fill-valentine-red" />
              <h3 className="text-lg sm:text-xl font-display font-bold">Geethika Digital World</h3>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">
              Your one-stop destination for personalized gifts, photography services, and event decoration.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-valentine-pink transition-colors text-sm">Home</Link></li>
              <li><Link to="/shop" className="text-gray-400 hover:text-valentine-pink transition-colors text-sm">Shop</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-valentine-pink transition-colors text-sm">Services</Link></li>
              <li><Link to="/gallery" className="text-gray-400 hover:text-valentine-pink transition-colors text-sm">Gallery</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-valentine-pink transition-colors text-sm">About Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Popular Categories</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link to="/shop/couple-gifts" className="text-gray-400 hover:text-valentine-pink transition-colors text-sm">Couple Gifts</Link></li>
              <li><Link to="/shop/personalised-gifts" className="text-gray-400 hover:text-valentine-pink transition-colors text-sm">Personalised Gifts</Link></li>
              <li><Link to="/shop/flower-bouquets" className="text-gray-400 hover:text-valentine-pink transition-colors text-sm">Flower Bouquets</Link></li>
              <li><Link to="/shop/cakes" className="text-gray-400 hover:text-valentine-pink transition-colors text-sm">Cakes</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-valentine-pink transition-colors text-sm">Photography</Link></li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Legal & Information</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-valentine-pink transition-colors text-sm">About Us</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-valentine-pink transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="text-gray-400 hover:text-valentine-pink transition-colors text-sm">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="text-gray-400 hover:text-valentine-pink transition-colors text-sm">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Us</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start justify-center sm:justify-start space-x-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-valentine-pink shrink-0 mt-1" />
                <a 
                  href="https://maps.app.goo.gl/xWe5mszQAzkjj3iQA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 text-xs sm:text-sm hover:text-valentine-pink transition-colors"
                >
                  Geethika Digital World<br />
                  View on Google Maps →
                </a>
              </li>
              <li className="flex items-center justify-center sm:justify-start space-x-2">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-valentine-pink" />
                <a href="tel:+919492686421" className="text-gray-400 hover:text-valentine-pink transition-colors text-xs sm:text-sm">+91 94926 86421</a>
              </li>
              <li className="flex items-center justify-center sm:justify-start space-x-2">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-valentine-pink" />
                <a href="mailto:geethikaphotoplanet9@gmail.com" className="text-gray-400 hover:text-valentine-pink transition-colors text-xs sm:text-sm break-all">geethikaphotoplanet9@gmail.com</a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-4">
              <a 
                href="https://www.instagram.com/geethikadigitalworld?igsh=czdycmR3aXEwdnN6" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-valentine-pink transition-colors group justify-center sm:justify-start"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base font-medium">@geethikadigitalworld</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
          <p className="mb-2">&copy; {new Date().getFullYear()} Geethika Digital World. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs">
            <Link to="/privacy-policy" className="hover:text-valentine-pink transition-colors">Privacy Policy</Link>
            <span className="hidden sm:inline">•</span>
            <Link to="/terms-conditions" className="hover:text-valentine-pink transition-colors">Terms & Conditions</Link>
            <span className="hidden sm:inline">•</span>
            <Link to="/refund-policy" className="hover:text-valentine-pink transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
