import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/services', label: 'Services' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/about', label: 'About Us' },
  ];

  const legalLinks = [
    { to: '/privacy-policy', label: 'Privacy Policy' },
    { to: '/terms-conditions', label: 'Terms & Conditions' },
    { to: '/refund-policy', label: 'Refund Policy' },
  ];

  return (
    <footer className="bg-[#F3F4F6] text-gray-700 pt-20 pb-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Social */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                <span className="text-white font-display font-bold text-xs">GW</span>
              </div>
              <h1 className="text-xl font-display font-semibold tracking-tight text-gray-900">
                Geethika <span className="text-[var(--color-primary)]">Digital World</span>
              </h1>
            </div>
            <p className="font-body text-sm text-gray-500 mb-8 leading-relaxed">
              Your one-stop destination for premium personalized gifts, professional photography, and cinematic memories.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg text-gray-900 mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-bold text-lg text-gray-900 mb-8">Connect Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-[var(--color-primary)] shrink-0" />
                <span className="text-sm text-gray-500">123 Creative Street, Digital Hub, Eluru, Andhra Pradesh</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-[var(--color-primary)] shrink-0" />
                <a href="tel:+919492686421" className="text-sm text-gray-500 hover:text-[var(--color-primary)]">+91 94926 86421</a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-[var(--color-primary)] shrink-0" />
                <a href="mailto:geethikadigital@world.com" className="text-sm text-gray-500 hover:text-[var(--color-primary)] underline decoration-[var(--color-primary)]">geethikadigital@world.com</a>
              </li>
            </ul>
          </div>

          {/* Map */}
          <div>
            <h4 className="font-display font-bold text-lg text-gray-900 mb-8">Our Location</h4>
            <div className="rounded-xl overflow-hidden shadow-md h-40 group">
              <img src="/assets/map.png" alt="Map Location" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" />
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-400 font-body">
            © {new Date().getFullYear()} Geethika Digital World. All rights reserved. Premium Design by Antigravity AI.
          </p>
          <div className="flex gap-8">
            {legalLinks.map(link => (
              <Link key={link.to} to={link.to} className="text-xs text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
