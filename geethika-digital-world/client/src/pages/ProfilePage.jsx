import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Save, ArrowLeft, Camera, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: { pathname: '/profile' } } });
      return;
    }
    
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update profile');

      const updatedUser = { 
        ...user, 
        name: data.user.name,
        fullName: data.user.name,
        phone: data.user.phone 
      };
      login(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to change password');

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-12 pb-24">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-3 text-xs font-body font-bold text-gray-400 uppercase tracking-widest mb-6 group hover:text-[var(--color-primary)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-2" />
              Back
            </button>
            <p className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">ACCOUNT SETTINGS</p>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 tracking-tight">
              Studio Profile
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 pr-8 rounded-full shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-[var(--color-primary)]">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest">MEMBER SINCE</p>
              <p className="font-body font-bold text-gray-900">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {message.text && (
          <div className={`mb-8 p-6 rounded-3xl animate-slide-up border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-100 text-green-700' 
              : 'bg-red-50 border-red-100 text-red-700'
          } font-body font-medium text-sm`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Profile Info Card */}
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900">Information</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest mb-3">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-gray-400 font-body text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest mb-3">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-body text-sm focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest mb-3">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-body text-sm focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gray-900 text-white rounded-2xl font-body font-bold text-sm uppercase tracking-widest hover:bg-[var(--color-primary)] transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900">Security</h2>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest mb-3">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-body text-sm focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest mb-3">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-body text-sm focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                      placeholder="Min 6 chars"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest mb-3">Confirm New</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-body text-sm focus:ring-2 focus:ring-purple-100 transition-all outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-white border border-gray-100 text-gray-900 rounded-2xl font-body font-bold text-sm uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Update Password'}
              </button>
            </form>

            <div className="mt-12 p-8 bg-purple-50/50 rounded-[30px] flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[10px] font-body font-bold text-gray-900 uppercase tracking-widest mb-2">SECURE ACCOUNT</h4>
                <p className="text-[10px] font-body leading-relaxed text-gray-400 uppercase tracking-wider">
                  Your security is our priority. We use studio-grade encryption to protect your curated data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

