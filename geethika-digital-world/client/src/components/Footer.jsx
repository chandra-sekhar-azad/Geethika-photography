import { Link, useLocation } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  
  // Don't render footer on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-6 h-6 text-valentine-red fill-valentine-red" />
              <h3 className="text-xl font-display font-bold">Geethika Digital World</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Your one-stop destination for personalized gifts, photography services, and event decoration.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-valentine-pink transition-colors">Home</Link></li>
              <li><Link to="/shop" className="text-gray-400 hover:text-valentine-pink transition-colors">Shop</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-valentine-pink transition-colors">Services</Link></li>
              <li><Link to="/gallery" className="text-gray-400 hover:text-valentine-pink transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-valentine-pink transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Popular Categories</h4>
            <ul className="space-y-2">
              <li><Link to="/shop/couple-gifts" className="text-gray-400 hover:text-valentine-pink transition-colors">Couple Gifts</Link></li>
              <li><Link to="/shop/personalised-gifts" className="text-gray-400 hover:text-valentine-pink transition-colors">Personalised Gifts</Link></li>
              <li><Link to="/shop/flower-bouquets" className="text-gray-400 hover:text-valentine-pink transition-colors">Flower Bouquets</Link></li>
              <li><Link to="/shop/cakes" className="text-gray-400 hover:text-valentine-pink transition-colors">Cakes</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-valentine-pink transition-colors">Photography</Link></li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal & Information</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-valentine-pink transition-colors">About Us</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-valentine-pink transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="text-gray-400 hover:text-valentine-pink transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="text-gray-400 hover:text-valentine-pink transition-colors">Refund Policy</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-valentine-pink transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-valentine-pink shrink-0 mt-1" />
                <a 
                  href="https://maps.app.goo.gl/xWe5mszQAzkjj3iQA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 text-sm hover:text-valentine-pink transition-colors"
                >
                  Geethika Digital World<br />
                  View on Google Maps →
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-valentine-pink" />
                <a href="tel:+917416111271" className="text-gray-400 hover:text-valentine-pink transition-colors">+91 74161 11271</a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-valentine-pink" />
                <a href="mailto:info@geethikadigitalworld.com" className="text-gray-400 hover:text-valentine-pink transition-colors">info@geethikadigitalworld.com</a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-valentine-pink transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-valentine-pink transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-valentine-pink transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p className="mb-2">&copy; {new Date().getFullYear()} Geethika Digital World. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <Link to="/privacy-policy" className="hover:text-valentine-pink transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms-conditions" className="hover:text-valentine-pink transition-colors">Terms & Conditions</Link>
            <span>•</span>
            <Link to="/refund-policy" className="hover:text-valentine-pink transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
