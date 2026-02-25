import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ emailOrPhone: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const successMessage = location.state?.message;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone number is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{10}$/;
      if (!emailRegex.test(formData.emailOrPhone) && !phoneRegex.test(formData.emailOrPhone)) {
        newErrors.emailOrPhone = 'Enter a valid email or 10-digit phone number';
      }
    }
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const demoAdminEmail = '    ';
      const demoAdminPassword = '      ';
      if (formData.emailOrPhone === demoAdminEmail && formData.password === demoAdminPassword) {
        const demoToken = 'demo-admin-token-' + Date.now();
        const userData = { id: 'admin-1', email: demoAdminEmail, fullName: 'Admin User', role: 'admin', token: demoToken };
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(userData));
        login(userData);
        navigate('/admin/dashboard', { replace: true });
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.emailOrPhone, password: formData.password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        const userData = { id: data.user.id, email: data.user.email, fullName: data.user.name, role: data.user.role, token: data.token };
        login(userData);
        if (data.user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate(location.state?.from?.pathname || '/', { replace: true });
        }
      } catch (apiError) {
        setErrors({ submit: 'Invalid credentials. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const borderColor = (field) => errors[field] ? '#f87171' : 'rgba(168,213,213,0.6)';

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ background: 'linear-gradient(135deg, var(--color-bg-hero) 0%, var(--color-bg-light) 60%, white 100%)' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-1">
            <Heart className="w-6 h-6" style={{ color: 'var(--color-teal-500)', fill: 'var(--color-teal-500)' }} />
            <span className="font-display font-semibold text-lg" style={{ color: 'var(--color-text-dark)' }}>Geethika Digital World</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl border" style={{ borderColor: 'rgba(168,213,213,0.35)', boxShadow: '0 8px 40px rgba(26,43,53,0.10)' }}>
          <div className="text-center mb-7">
            <h2 className="font-display font-semibold text-3xl" style={{ color: 'var(--color-text-dark)' }}>Welcome Back</h2>
            <p className="font-body text-sm mt-2" style={{ color: 'var(--color-text-mid)' }}>Login to access your account</p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-body">{successMessage}</div>
            )}
            {/* Email or Phone */}
            <div>
              <label htmlFor="emailOrPhone" className="block font-body text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-mid)' }}>
                Email or Phone Number
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                <input
                  id="emailOrPhone" name="emailOrPhone" type="text"
                  value={formData.emailOrPhone} onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border rounded-lg text-sm font-body focus:outline-none transition-colors"
                  style={{ backgroundColor: 'white', borderColor: borderColor('emailOrPhone'), color: 'var(--color-text-dark)' }}
                  placeholder="Enter email or phone number"
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--color-teal-400)'}
                  onBlur={e => e.currentTarget.style.borderColor = borderColor('emailOrPhone')}
                />
              </div>
              {errors.emailOrPhone && <p className="mt-1 text-xs text-red-500 font-body">{errors.emailOrPhone}</p>}
            </div>
            {/* Password */}
            <div>
              <label htmlFor="password" className="block font-body text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-mid)' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                <input
                  id="password" name="password" type={showPassword ? 'text' : 'password'}
                  value={formData.password} onChange={handleChange}
                  className="pl-10 pr-10 w-full px-4 py-3 border rounded-lg text-sm font-body focus:outline-none transition-colors"
                  style={{ backgroundColor: 'white', borderColor: borderColor('password'), color: 'var(--color-text-dark)' }}
                  placeholder="Enter your password"
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--color-teal-400)'}
                  onBlur={e => e.currentTarget.style.borderColor = borderColor('password')}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--color-text-light)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-teal-500)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-light)'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500 font-body">{errors.password}</p>}
            </div>
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange}
                  className="w-4 h-4 rounded" style={{ accentColor: 'var(--color-teal-500)' }} />
                <span className="font-body text-sm" style={{ color: 'var(--color-text-mid)' }}>Remember me</span>
              </label>
              <Link to="/forgot-password" className="font-body text-sm font-medium transition-colors" style={{ color: 'var(--color-teal-500)' }}>
                Forgot Password?
              </Link>
            </div>
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-body">{errors.submit}</div>
            )}
            <button type="submit" disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg font-body font-semibold uppercase tracking-widest text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
              style={{ backgroundColor: 'var(--color-navy-800)' }}
              onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = 'var(--color-teal-500)'; }}
              onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = 'var(--color-navy-800)'; }}
            >
              {isSubmitting ? 'Logging in…' : 'Login'}
            </button>
            <p className="text-center font-body text-sm" style={{ color: 'var(--color-text-mid)' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold transition-colors" style={{ color: 'var(--color-teal-500)' }}>Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
