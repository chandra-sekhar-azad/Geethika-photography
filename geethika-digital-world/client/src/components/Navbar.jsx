import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();

  // Don't render navbar on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/services', label: 'Services' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/about', label: 'About' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    // Always redirect to home for customer logout
    // Admin logout is handled separately in AdminLayout
    navigate('/', { replace: true });
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-teal-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
          <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            <h1 className="text-base sm:text-xl md:text-2xl font-display font-semibold text-navy-900 leading-tight tracking-wide">
              Geethika <span className="text-teal-500">Digital World</span>
            </h1>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body font-medium transition-all duration-300 relative group tracking-widest text-xs uppercase ${isActive(link.path)
                    ? 'text-teal-500'
                    : 'text-navy-700 hover:text-teal-500'
                  }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400 transform origin-left transition-transform duration-300 ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
              </Link>
            ))}

            {isAuthenticated() ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/my-orders"
                  className="font-body font-medium text-navy-700 hover:text-teal-500 transition-colors tracking-widest text-xs uppercase"
                >
                  My Orders
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-navy-700 hover:text-teal-500 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-body font-medium text-xs">{user?.fullName || user?.name || 'User'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-navy-700 hover:text-teal-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-body font-medium text-xs">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 text-navy-700 hover:text-teal-500 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="font-body font-medium text-xs uppercase tracking-widest">Login</span>
              </Link>
            )}

            <Link to="/wishlist" className="relative">
              <Heart className="w-6 h-6 text-navy-600 hover:text-teal-500 transition-colors" />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-teal-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {getWishlistCount()}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-navy-600 hover:text-teal-500 transition-colors" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-teal-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-2 sm:space-x-3">

            <Link to="/wishlist" className="relative p-1.5">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-primary text-black text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-semibold shadow shadow-orange-primary/30">
                  {getWishlistCount()}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative p-1.5">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-primary text-black text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-semibold shadow shadow-orange-primary/30">
                  {getCartCount()}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-orange-primary p-1.5"
            >
              {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-teal-100 mt-2">
            <div className="py-2 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2.5 px-3 font-body font-medium rounded-lg transition-colors uppercase tracking-widest text-xs ${isActive(link.path)
                      ? 'text-teal-500 bg-teal-50'
                      : 'text-navy-700 hover:bg-teal-50'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated() ? (
                <>
                  <Link
                    to="/wishlist"
                    onClick={() => setIsOpen(false)}
                    className="block py-2.5 px-3 font-body font-medium text-navy-700 rounded-lg hover:bg-teal-50 uppercase tracking-widest text-xs"
                  >
                    My Wishlist
                  </Link>
                  <Link
                    to="/my-orders"
                    onClick={() => setIsOpen(false)}
                    className="block py-2.5 px-3 font-body font-medium text-navy-700 rounded-lg hover:bg-teal-50 uppercase tracking-widest text-xs"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block py-2.5 px-3 font-body font-medium text-navy-700 rounded-lg hover:bg-teal-50 text-xs"
                  >
                    Profile ({user?.fullName || user?.name || 'User'})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2.5 px-3 font-body font-medium text-navy-700 rounded-lg hover:bg-teal-50 uppercase tracking-widest text-xs"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block py-2.5 px-3 font-body font-medium text-navy-700 rounded-lg hover:bg-teal-50 uppercase tracking-widest text-xs"
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
