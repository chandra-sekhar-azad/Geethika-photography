import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Menu, X, User, LogOut, Search, Package, ChevronDown, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
    
    const handleClickOutside = (e) => {
      if (isProfileOpen && !e.target.closest('.profile-dropdown-container')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/services', label: 'Services' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/', { replace: true });
    setIsOpen(false);
  };

  const profileMenuItems = [
    { label: 'Edit Profile', path: '/profile?tab=profile', icon: User },
    { label: 'My Orders', path: '/profile?tab=orders', icon: Package },
    { label: 'Selection', path: '/profile?tab=cart', icon: ShoppingCart, count: getCartCount() },
    { label: 'Favorites', path: '/profile?tab=wishlist', icon: Heart, count: getWishlistCount() },
  ];

  const shopCategories = [
    { id: 'all', name: 'All Products' },
    { id: 'cakes', name: 'Cakes' },
    { id: 'chocolate-bouquets', name: 'Chocolate Bouquets' },
    { id: 'couple-gifts', name: 'Couple Gifts' },
    { id: 'event-needs', name: 'Event Needs' },
    { id: 'flower-bouquets', name: 'Flower Bouquets' },
    { id: 'interior-gifts-decor', name: 'Interior Gifts & Decor' },
    { id: 'personalised-gifts', name: 'Personalised Gifts' },
    { id: 'photo-frames', name: 'Photo Frames' },
    { id: 'plants', name: 'Plants' },
    { id: 'printing-works', name: 'Printing Works' },
    { id: 't-shirts', name: 'T-Shirts' },
  ];

  return (
    <nav className={`sticky top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-0' : 'bg-white py-1'}`}>
      <div className="container-custom">
        <div className="flex justify-between items-center h-12 sm:h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 flex-shrink-0 group">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
            />
            <div className="flex flex-col">
              <span className="text-xl font-display font-bold tracking-tight text-gray-900 leading-none">
                Geethika
              </span>
              <span className="text-[10px] font-body font-bold text-[var(--color-primary)] uppercase tracking-[0.3em] leading-none mt-1">
                Digital World
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-8 ml-auto mr-10">
            {navLinks.map((link) => (
              <div key={link.path} className="relative group/nav">
                <Link
                  to={link.path}
                  className={`font-body font-medium text-sm transition-all duration-300 relative py-4 flex items-center gap-1 ${isActive(link.path) ? 'text-[var(--color-primary)]' : 'text-gray-600 hover:text-[var(--color-primary)]'}`}
                >
                  {link.label}
                  {link.label === 'Shop' && <ChevronDown className="w-3 h-3 group-hover/nav:rotate-180 transition-transform" />}
                  <span className={`absolute bottom-3 left-0 w-full h-0.5 bg-[var(--color-primary)] transform origin-left transition-transform duration-300 ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100'}`} />
                </Link>

                {link.label === 'Shop' && (
                  <div className="absolute top-full left-0 w-64 bg-white/95 backdrop-blur-xl rounded-[30px] shadow-2xl border border-gray-50 p-4 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 translate-y-2 group-hover/nav:translate-y-0 z-50">
                    <div className="grid grid-cols-1 gap-1">
                      {shopCategories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={cat.id === 'all' ? '/shop' : `/shop/${cat.id}`}
                          className="px-4 py-2 rounded-xl text-xs font-body font-bold text-gray-500 hover:bg-gray-50 hover:text-[var(--color-primary)] transition-all flex items-center justify-between group/item"
                        >
                          <span>{cat.name}</span>
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-all translate-x-[-10px] group-hover/item:translate-x-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Icons & Actions */}
          <div className="flex items-center space-x-5">
            {/* Profile Dropdown */}
            <div className="relative profile-dropdown-container">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`text-gray-600 hover:text-[var(--color-primary)] transition-all p-2 rounded-full ${isProfileOpen ? 'bg-purple-50 text-[var(--color-primary)]' : ''}`}
                title="Account"
              >
                <User className="w-5 h-5" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 animate-slide-up">
                  {isAuthenticated() ? (
                    <>
                      <div className="px-4 py-3 mb-2 border-b border-gray-50">
                        <p className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest">Signed in as</p>
                        <p className="text-sm font-body font-bold text-gray-900 truncate">{user?.name || user?.email}</p>
                      </div>
                      <div className="space-y-1">
                        {profileMenuItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-body font-bold text-gray-600 hover:bg-gray-50 hover:text-[var(--color-primary)] transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </div>
                            {item.count > 0 && (
                              <span className="bg-purple-50 text-[var(--color-primary)] px-2 py-0.5 rounded-full text-[8px]">
                                {item.count}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-body font-bold text-red-500 hover:bg-red-50 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <div className="p-4">
                      <p className="text-xs font-body text-gray-400 mb-4 text-center">Sign in to access your curated dashboard.</p>
                      <Link
                        to="/login"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full py-3 bg-gray-900 text-white rounded-2xl font-body font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[var(--color-primary)] transition-all"
                      >
                        <User className="w-4 h-4" />
                        <span>Sign In</span>
                      </Link>
                      <p className="mt-4 text-center text-[10px] font-body text-gray-400">
                        New here? <Link to="/signup" className="text-gray-900 font-bold hover:underline">Join Us</Link>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

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
              <div className="pt-4 border-t border-gray-50 flex flex-col space-y-4">
                {isAuthenticated() ? (
                  <>
                    <Link to="/profile?tab=profile" onClick={() => setIsOpen(false)} className="text-lg font-body font-medium text-gray-700">Profile Dashboard</Link>
                    <button onClick={handleLogout} className="text-lg font-body font-medium text-red-500 text-left">Logout</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-lg font-body font-medium text-gray-700">Login</Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
