import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Menu, X, User, LogOut, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { path: '/', label: 'Studio' },
    { path: '/shop', label: 'Shop' },
    { path: '/gallery', label: 'Collections' },
    { path: '/shop', label: 'Gifts' },
    { path: '/about', label: 'About' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    setIsOpen(false);
  };

  return (
    <nav className={`sticky top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-0' : 'bg-white py-1'}`}>
      <div className="container-custom">
        <div className="flex justify-between items-center h-12 sm:h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center mr-2">
                <span className="text-white font-display font-bold text-xs">GW</span>
              </div>
              <h1 className="text-xl font-display font-semibold tracking-tight text-gray-900 hidden sm:block">
                Geethika <span className="text-[var(--color-primary)]">Digital World</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body font-medium text-sm transition-all duration-300 relative group ${isActive(link.path) ? 'text-[var(--color-primary)]' : 'text-gray-600 hover:text-[var(--color-primary)]'}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[var(--color-primary)] transform origin-left transition-transform duration-300 ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </Link>
            ))}
          </div>

          {/* Icons & Actions */}
          <div className="flex items-center space-x-5">
            <button className="text-gray-600 hover:text-[var(--color-primary)] transition-colors hidden sm:block">
              <Search className="w-5 h-5" />
            </button>
            <Link
              to={isAuthenticated() ? "/profile" : "/login"}
              className="text-gray-600 hover:text-[var(--color-primary)] transition-colors hidden sm:block"
              title={isAuthenticated() ? "Profile" : "Login"}
            >
              <User className="w-5 h-5" />
            </Link>

            <Link to="/wishlist" className="relative text-gray-600 hover:text-[var(--color-primary)] transition-colors">
              <Heart className="w-5 h-5" />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {getWishlistCount()}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative text-gray-600 hover:text-[var(--color-primary)] transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--color-accent)] text-gray-900 text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {isAuthenticated() && (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-[var(--color-primary)] transition-colors hidden sm:block"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-gray-900 p-1"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 py-6 px-4 animate-slide-up shadow-xl overflow-y-auto max-h-[80vh]">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-body font-medium ${isActive(link.path) ? 'text-[var(--color-primary)]' : 'text-gray-700'}`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated() ? (
                <button
                  onClick={handleLogout}
                  className="text-lg font-body font-medium text-red-500 text-left"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-body font-medium text-gray-700"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
