import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Prevent browser back button from leaving admin area
    if (requireAdmin && user && (user.role === 'admin' || user.role === 'super_admin')) {
      const handlePopState = (e) => {
        if (!location.pathname.startsWith('/admin')) {
          e.preventDefault();
          window.history.pushState(null, '', location.pathname);
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [requireAdmin, user, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-valentine-red mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={requireAdmin ? "/admin/login" : "/login"} replace />;
  }

  if (requireAdmin && user.role !== 'admin' && user.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <a href="/admin/login" className="text-valentine-red hover:underline">Go to Admin Login</a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
