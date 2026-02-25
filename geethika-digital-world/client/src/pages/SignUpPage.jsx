import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Heart } from 'lucide-react';

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
    else if (formData.fullName.trim().length < 2) newErrors.fullName = 'Name must be at least 2 characters';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    if (formData.phone) {
      if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!passwordRegex.test(formData.password)) newErrors.password = 'Password must include a number and special character';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';
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
        body: JSON.stringify({ email: formData.email, password: formData.password, name: formData.fullName, phone: formData.phone || null })
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ email: 'Email already registered' });
        } else if (data.errors) {
          const newErrors = {};
          data.errors.forEach(err => { newErrors[err.path] = err.msg; });
          setErrors(newErrors);
        } else {
          setErrors({ submit: data.error || 'Registration failed. Please try again.' });
        }
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/', { state: { message: 'Account created successfully! Welcome to Geethika Digital World.' } });
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const borderColor = (field) => errors[field] ? '#f87171' : 'rgba(168,213,213,0.6)';

  const Field = ({ id, label, icon: Icon, type = 'text', placeholder, showToggle, onToggle, shown, maxLength }) => (
    <div>
      <label htmlFor={id} className="block font-body text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-mid)' }}>
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
        <input
          id={id} name={id} type={showToggle ? (shown ? 'text' : 'password') : type}
          value={formData[id]} onChange={handleChange}
          className={`pl-10 w-full px-4 py-3 border rounded-lg text-sm font-body focus:outline-none transition-colors ${showToggle ? 'pr-10' : ''}`}
          style={{ backgroundColor: 'white', borderColor: borderColor(id), color: 'var(--color-text-dark)' }}
          placeholder={placeholder}
          maxLength={maxLength}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--color-teal-400)'}
          onBlur={e => e.currentTarget.style.borderColor = borderColor(id)}
        />
        {showToggle && (
          <button type="button" onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: 'var(--color-text-light)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-teal-500)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-light)'}
          >
            {shown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {errors[id] && <p className="mt-1 text-xs text-red-500 font-body">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ background: 'linear-gradient(135deg, var(--color-bg-hero) 0%, var(--color-bg-light) 60%, white 100%)' }}>
      <div className="max-w-md w-full">
        {/* Brand mark */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2">
            <Heart className="w-6 h-6" style={{ color: 'var(--color-teal-500)', fill: 'var(--color-teal-500)' }} />
            <span className="font-display font-semibold text-lg" style={{ color: 'var(--color-text-dark)' }}>Geethika Digital World</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-2xl border" style={{ borderColor: 'rgba(168,213,213,0.35)', boxShadow: '0 8px 40px rgba(26,43,53,0.10)' }}>
          <div className="text-center mb-7">
            <h2 className="font-display font-semibold text-3xl" style={{ color: 'var(--color-text-dark)' }}>Create Account</h2>
            <p className="font-body text-sm mt-2" style={{ color: 'var(--color-text-mid)' }}>Join us to explore amazing gifts and services</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Field id="fullName" label="Full Name *" icon={User} placeholder="Enter your full name" />
            <Field id="email" label="Email Address *" icon={Mail} type="email" placeholder="your@email.com" />
            <Field id="phone" label="Phone Number (Optional)" icon={Phone} type="tel" placeholder="10-digit phone number" maxLength={10} />
            <Field id="password" label="Password *" icon={Lock} placeholder="Min 8 chars, 1 number, 1 special char"
              showToggle onToggle={() => setShowPassword(!showPassword)} shown={showPassword} />
            <Field id="confirmPassword" label="Confirm Password *" icon={Lock} placeholder="Re-enter your password"
              showToggle onToggle={() => setShowConfirmPassword(!showConfirmPassword)} shown={showConfirmPassword} />

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange}
                  className="mt-0.5 w-4 h-4 rounded" style={{ accentColor: 'var(--color-teal-500)' }} />
                <span className="font-body text-sm" style={{ color: 'var(--color-text-mid)' }}>
                  I accept the{' '}
                  <Link to="/terms" className="font-medium transition-colors" style={{ color: 'var(--color-teal-500)' }}>Terms & Conditions</Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="font-medium transition-colors" style={{ color: 'var(--color-teal-500)' }}>Privacy Policy</Link>
                </span>
              </label>
              {errors.acceptTerms && <p className="mt-1 text-xs text-red-500 font-body">{errors.acceptTerms}</p>}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-body">{errors.submit}</div>
            )}

            <button type="submit" disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg font-body font-semibold uppercase tracking-widest text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white mt-2"
              style={{ backgroundColor: 'var(--color-navy-800)' }}
              onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = 'var(--color-teal-500)'; }}
              onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = 'var(--color-navy-800)'; }}
            >
              {isSubmitting ? 'Creating Account…' : 'Sign Up'}
            </button>

            <p className="text-center font-body text-sm" style={{ color: 'var(--color-text-mid)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold transition-colors" style={{ color: 'var(--color-teal-500)' }}>Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
