import { Link, useLocation } from 'react-router-dom';
import { Send, Share2, Aperture, Mail } from 'lucide-react';

const Footer = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-white text-gray-700 pt-24 pb-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand */}
          <div className="animate-slide-up">
            <Link to="/" className="flex items-center gap-4 mb-6">
              <img src="/logo.png" className="h-10 w-auto" alt="Logo" />
              <h2 className="text-2xl font-display font-bold italic text-gray-900">
                Geethika Digital World
              </h2>
            </Link>
            <p className="font-body text-gray-400 text-sm leading-relaxed max-w-xs">
              Crafting sentiments into tangible art pieces for those who value the beauty of a moment.
            </p>
          </div>

          {/* Quick Links */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h4 className="font-body font-bold text-xs uppercase tracking-[0.2em] text-[var(--color-primary)] mb-8">
              Quick Links
            </h4>
            <ul className="space-y-4">
              <li><Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors">Terms of Service</Link></li>
              <li><Link to="/shipping-info" className="text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors">Shipping Info</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h4 className="font-body font-bold text-xs uppercase tracking-[0.2em] text-[var(--color-primary)] mb-8">
              Newsletter
            </h4>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Subscribe to receive studio updates and exclusive offers.
            </p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 pr-12 text-sm font-body focus:ring-2 focus:ring-purple-100 transition-all"
              />
              <button className="absolute right-1 top-1 bottom-1 w-10 bg-[#8E447E] text-white rounded-lg flex items-center justify-center hover:bg-[#7A3B6D] transition-colors shadow-sm">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Studio Hours */}
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h4 className="font-body font-bold text-xs uppercase tracking-[0.2em] text-[var(--color-primary)] mb-8">
              Studio Hours
            </h4>
            <p className="text-sm text-gray-500 mb-1 leading-relaxed">
              Mon – Fri: 9:00 AM – 6:00 PM
            </p>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Sat: 10:00 AM – 4:00 PM
            </p>
            
            <div className="flex items-center gap-5">
              <a href="#" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                <Aperture className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-50 text-center">
          <p className="text-[10px] text-gray-300 font-body tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} Geethika Digital World. Crafted with sentiment.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

