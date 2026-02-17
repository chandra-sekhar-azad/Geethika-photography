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
    <nav className="bg-black/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
          <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            <h1 className="text-base sm:text-xl md:text-2xl font-display font-bold text-white leading-tight tracking-wider uppercase">
              Geethika <span className="text-orange-primary">Digital World</span>
            </h1>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-all duration-300 relative group uppercase tracking-wider text-sm ${
                  isActive(link.path)
                    ? 'text-orange-primary'
                    : 'text-gray-300 hover:text-orange-primary'
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-orange-primary transform origin-left transition-transform duration-300 ${
                  isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}
            
            {isAuthenticated() ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/my-orders"
                  className="font-medium text-gray-300 hover:text-orange-primary transition-colors uppercase tracking-wider text-sm"
                >
                  My Orders
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-300 hover:text-orange-primary transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium text-sm">{user?.fullName || user?.name || 'User'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-300 hover:text-orange-primary transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-1 text-gray-300 hover:text-orange-primary transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="font-medium text-sm uppercase tracking-wider">Login</span>
              </Link>
            )}

            <Link to="/wishlist" className="relative">
              <Heart className="w-6 h-6 text-gray-300 hover:text-orange-primary transition-colors" />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-primary text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg shadow-orange-primary/30">
                  {getWishlistCount()}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-300 hover:text-orange-primary transition-colors" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-primary text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg shadow-orange-primary/30">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-2 sm:space-x-3">
            {isAuthenticated() ? (
              <button onClick={handleLogout} className="p-1.5">
                <LogOut className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
              </button>
            ) : (
              <Link to="/login" className="p-1.5">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
              </Link>
            )}
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
          <div className="md:hidden pb-4 border-t border-gray-800 mt-2">
            <div className="py-2 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2.5 px-3 font-medium rounded-lg transition-colors uppercase tracking-wider text-sm ${
                    isActive(link.path)
                      ? 'text-orange-primary bg-orange-primary/10'
                      : 'text-gray-300 hover:bg-gray-800'
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
                    className="block py-2.5 px-3 font-medium text-gray-300 rounded-lg hover:bg-gray-800 uppercase tracking-wider text-sm"
                  >
                    My Wishlist
                  </Link>
                  <Link
                    to="/my-orders"
                    onClick={() => setIsOpen(false)}
                    className="block py-2.5 px-3 font-medium text-gray-300 rounded-lg hover:bg-gray-800 uppercase tracking-wider text-sm"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block py-2.5 px-3 font-medium text-gray-300 rounded-lg hover:bg-gray-800 text-sm"
                  >
                    Profile ({user?.fullName || user?.name || 'User'})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2.5 px-3 font-medium text-gray-300 rounded-lg hover:bg-gray-800 uppercase tracking-wider text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block py-2.5 px-3 font-medium text-gray-300 rounded-lg hover:bg-gray-800 uppercase tracking-wider text-sm"
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
