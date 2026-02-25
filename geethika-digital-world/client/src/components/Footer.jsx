import { Link, useLocation } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, Instagram } from 'lucide-react';

const Footer = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer style={{ backgroundColor: 'var(--color-navy-900)', color: 'rgba(255,255,255,0.85)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2 mb-4">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--color-teal-300)', fill: 'var(--color-teal-300)' }} />
              <h3 className="font-display font-semibold text-lg sm:text-xl text-white">Geethika Digital World</h3>
            </div>
            <p className="font-body text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Your one-stop destination for personalized gifts, photography services, and event decoration.
            </p>
            {/* Teal accent line */}
            <div className="mt-5">
              <div className="h-0.5 w-10 rounded sm:mx-0 mx-auto" style={{ backgroundColor: 'var(--color-teal-400)' }}></div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="font-display font-semibold text-base sm:text-lg text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/shop', label: 'Shop' },
                { to: '/services', label: 'Services' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/about', label: 'About Us' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="font-body text-sm transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-teal-300)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                  >{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="text-center sm:text-left">
            <h4 className="font-display font-semibold text-base sm:text-lg text-white mb-4">Popular Categories</h4>
            <ul className="space-y-2">
              {[
                { to: '/shop/couple-gifts', label: 'Couple Gifts' },
                { to: '/shop/personalised-gifts', label: 'Personalised Gifts' },
                { to: '/shop/flower-bouquets', label: 'Flower Bouquets' },
                { to: '/shop/cakes', label: 'Cakes' },
                { to: '/services', label: 'Photography' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="font-body text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-teal-300)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                  >{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
            <h4 className="font-display font-semibold text-base sm:text-lg text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start justify-center sm:justify-start space-x-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" style={{ color: 'var(--color-teal-300)' }} />
                <a
                  href="https://maps.app.goo.gl/xWe5mszQAzkjj3iQA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs sm:text-sm transition-colors"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-teal-300)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                >
                  Geethika Digital World<br />View on Google Maps →
                </a>
              </li>
              <li className="flex items-center justify-center sm:justify-start space-x-2">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--color-teal-300)' }} />
                <a href="tel:+919492686421"
                  className="font-body text-xs sm:text-sm transition-colors"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-teal-300)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                >+91 94926 86421</a>
              </li>
              <li className="flex items-center justify-center sm:justify-start space-x-2">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--color-teal-300)' }} />
                <a href="mailto:geethikaphotoplanet9@gmail.com"
                  className="font-body text-xs sm:text-sm transition-colors break-all"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-teal-300)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                >geethikaphotoplanet9@gmail.com</a>
              </li>
            </ul>

            {/* Social */}
            <div className="mt-5">
              <a
                href="https://www.instagram.com/geethikadigitalworld?igsh=czdycmR3aXEwdnN6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 transition-colors group justify-center sm:justify-start"
                style={{ color: 'rgba(255,255,255,0.55)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-teal-300)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="font-body text-sm font-medium">@geethikadigitalworld</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 text-center font-body text-xs sm:text-sm"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
          <p className="mb-3">© {new Date().getFullYear()} Geethika Digital World. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-5 text-[10px] sm:text-xs">
            {[
              { to: '/privacy-policy', label: 'Privacy Policy' },
              { to: '/terms-conditions', label: 'Terms & Conditions' },
              { to: '/refund-policy', label: 'Refund Policy' },
            ].map(link => (
              <Link key={link.to} to={link.to}
                className="transition-colors"
                style={{ color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-teal-300)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >{link.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
