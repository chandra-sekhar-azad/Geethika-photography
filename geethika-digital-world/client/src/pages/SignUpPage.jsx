import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Camera, CheckCircle2 } from 'lucide-react';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '', acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Please accept the terms';
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password, name: formData.fullName, phone: formData.phone })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/', { state: { message: 'Account created successfully! Welcome to the studio.' } });
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Visual Side */}
      <div className="hidden lg:flex lg:flex-1 relative bg-gray-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2000&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="Studio Equipment"
        />
        <div className="relative z-10 p-20 flex flex-col justify-between w-full">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-full">
              <img src="/logo.png" className="h-12 w-auto invert brightness-0" alt="Logo" />
            </Link>
          </div>
          
          <div>
            <h2 className="text-6xl font-display font-bold text-white mb-8 leading-tight">
              Begin Your <span className="italic font-serif font-medium text-purple-300">Creative</span><br />
              Journey With Us.
            </h2>
            <div className="space-y-6">
              {[
                "Exclusive access to private galleries",
                "Priority booking for studio sessions",
                "Curated gift selections & offers",
                "Seamless order tracking"
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3 text-gray-200 font-body">
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-white/50 text-[10px] font-body font-bold uppercase tracking-widest">
            <span>© 2024 Studio</span>
            <div className="w-1 h-1 bg-white/20 rounded-full" />
            <span>Join The Community</span>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-20 bg-gray-50/50 overflow-y-auto">
        <div className="w-full max-w-md space-y-12 py-12">
          <div>
            <Link to="/">
              <img src="/logo.png" className="h-16 w-auto mb-8" alt="Geethika Digital World" />
            </Link>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">Create Account</h1>
            <p className="text-gray-400 font-body">Join our curated community of sentimental curators.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-body border border-red-100">
                {errors.submit}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[var(--color-primary)] transition-colors" />
                  <input
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-100 rounded-2xl p-4 pl-12 font-body text-sm text-gray-700 focus:ring-4 focus:ring-purple-100 focus:border-[var(--color-primary)] transition-all outline-none"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest ml-4">Email Address (Optional)</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[var(--color-primary)] transition-colors" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-100 rounded-2xl p-4 pl-12 font-body text-sm text-gray-700 focus:ring-4 focus:ring-purple-100 focus:border-[var(--color-primary)] transition-all outline-none"
                    placeholder="your@email.com (Optional)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-body font-bold text-gray-900 uppercase tracking-widest ml-4 flex items-center gap-2">
                  Phone Number
                  <span className="text-[var(--color-primary)]">*</span>
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[var(--color-primary)] transition-colors" />
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-900/10 rounded-2xl p-4 pl-12 font-body text-sm text-gray-700 focus:ring-4 focus:ring-purple-100 focus:border-[var(--color-primary)] transition-all outline-none"
                    placeholder="e.g. +91 94926 86421"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest ml-4">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[var(--color-primary)] transition-colors" />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-100 rounded-2xl p-4 pl-12 pr-12 font-body text-sm text-gray-700 focus:ring-4 focus:ring-purple-100 focus:border-[var(--color-primary)] transition-all outline-none"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest ml-4">Confirm</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[var(--color-primary)] transition-colors" />
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-100 rounded-2xl p-4 pl-12 pr-12 font-body text-sm text-gray-700 focus:ring-4 focus:ring-purple-100 focus:border-[var(--color-primary)] transition-all outline-none"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 px-4">
              <input 
                type="checkbox" 
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" 
              />
              <span className="text-xs font-body text-gray-400 leading-relaxed">
                I agree to the <Link to="/terms" className="text-gray-900 font-bold hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-gray-900 font-bold hover:underline">Privacy Policy</Link>.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-gray-900 text-white rounded-2xl font-body font-bold text-sm uppercase tracking-widest hover:bg-[var(--color-primary)] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 group"
            >
              <span>{isSubmitting ? 'Creating Account...' : 'Register'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <p className="text-center font-body text-sm text-gray-400 mt-8">
              Already a member?{' '}
              <Link to="/login" className="text-gray-900 font-bold hover:text-[var(--color-primary)] transition-colors">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

