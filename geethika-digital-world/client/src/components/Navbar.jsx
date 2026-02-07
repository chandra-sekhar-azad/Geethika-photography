import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
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
    // If admin, redirect to admin login, otherwise to home
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      navigate('/admin/login');
    } else {
      navigate('/');
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
          <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            <Heart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-valentine-red fill-valentine-red" />
            <div className="hidden xs:block">
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-display font-bold text-valentine-red leading-tight">
                Geethika Digital World
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-600 hidden sm:block">Capture Every Moment</p>
            </div>
            <div className="block xs:hidden">
              <h1 className="text-sm font-display font-bold text-valentine-red">GDW</h1>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-valentine-red'
                    : 'text-gray-700 hover:text-valentine-red'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated() ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/my-orders"
                  className="font-medium text-gray-700 hover:text-valentine-red transition-colors"
                >
                  My Orders
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-valentine-red transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user?.fullName || user?.name || 'User'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-valentine-red transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-1 text-gray-700 hover:text-valentine-red transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Login</span>
              </Link>
            )}

            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-valentine-red transition-colors" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-valentine-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-2 sm:space-x-3">
            {isAuthenticated() ? (
              <button onClick={handleLogout} className="p-1.5">
                <LogOut className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
            ) : (
              <Link to="/login" className="p-1.5">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </Link>
            )}
            <Link to="/cart" className="relative p-1.5">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-valentine-red text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-semibold">
                  {getCartCount()}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-valentine-red p-1.5"
            >
              {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-2">
            <div className="py-2 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2.5 px-3 font-medium rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'text-valentine-red bg-valentine-pink/10'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated() ? (
                <>
                  <Link
                    to="/my-orders"
                    onClick={() => setIsOpen(false)}
                    className="block py-2.5 px-3 font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block py-2.5 px-3 font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Profile ({user?.fullName || user?.name || 'User'})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2.5 px-3 font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block py-2.5 px-3 font-medium text-gray-700 rounded-lg hover:bg-gray-50"
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
