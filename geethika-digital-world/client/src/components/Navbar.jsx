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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-valentine-red fill-valentine-red" />
            <div>
              <h1 className="text-2xl font-display font-bold text-valentine-red">
                Geethika Digital World
              </h1>
              <p className="text-xs text-gray-600">Capture Every Moment</p>
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
                  <span className="font-medium">{user?.name || user?.email}</span>
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

          <div className="md:hidden flex items-center space-x-4">
            {isAuthenticated() ? (
              <button onClick={handleLogout}>
                <LogOut className="w-6 h-6 text-gray-700" />
              </button>
            ) : (
              <Link to="/login">
                <User className="w-6 h-6 text-gray-700" />
              </Link>
            )}
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-valentine-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-valentine-red"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 font-medium ${
                  isActive(link.path)
                    ? 'text-valentine-red'
                    : 'text-gray-700'
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
                  className="block py-2 font-medium text-gray-700"
                >
                  My Orders
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 font-medium text-gray-700"
                >
                  Profile ({user?.name || user?.email})
                </Link>
                <button
                  onClick={handleLogout}
                  className="block py-2 font-medium text-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block py-2 font-medium text-gray-700"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
