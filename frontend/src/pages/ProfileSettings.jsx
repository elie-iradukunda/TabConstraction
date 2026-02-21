import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Save, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';

const ProfileSettings = () => {
  const { user, token } = useAuthStore();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile(profileData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-dark font-poppins mb-2">Profile Settings</h1>
        <p className="text-gray-500 font-medium">Manage your account information and security preferences.</p>
      </div>

      {message.text && (
        <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100 animate-shake'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
             {message.type === 'success' ? '✓' : '!'}
          </div>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        <div className="md:col-span-2 space-y-8">
          {/* General Information */}
          <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <User size={20} />
              </div>
              <h2 className="text-sm font-black text-dark uppercase tracking-[0.2em]">General Information</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      name="name"
                      className="input-field pl-12 py-3.5 rounded-2xl bg-accent/50 border-gray-100 focus:bg-white transition-all text-sm font-bold"
                      value={profileData.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="tel" 
                      name="phone"
                      className="input-field pl-12 py-3.5 rounded-2xl bg-accent/50 border-gray-100 focus:bg-white transition-all text-sm font-bold"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="email" 
                    name="email"
                    className="input-field pl-12 py-3.5 rounded-2xl bg-accent/50 border-gray-100 focus:bg-white transition-all text-sm font-bold"
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary py-4 px-10 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-70"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={20} />}
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </section>

          {/* Security / Password */}
          <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                <Lock size={20} />
              </div>
              <h2 className="text-sm font-black text-dark uppercase tracking-[0.2em]">Account Security</h2>
            </div>

            <form className="space-y-6">
               <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="input-field pl-12 py-3.5 rounded-2xl bg-accent/50 border-gray-100 focus:bg-white transition-all text-sm font-bold"
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Confirm New Password</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="input-field pl-12 py-3.5 rounded-2xl bg-accent/50 border-gray-100 focus:bg-white transition-all text-sm font-bold"
                    />
                  </div>
               </div>
               <div className="pt-4">
                  <button type="button" className="btn-outline border-orange-200 text-orange-600 hover:bg-orange-50 font-black py-4 px-10 rounded-2xl">
                    Change Password
                  </button>
               </div>
            </form>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-dark p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                   <ShieldCheck size={32} className="text-primary-light" />
                </div>
                <h3 className="text-xl font-black font-poppins mb-4">Security Tip</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                   Always use a strong, unique password for your account. Enable two-factor authentication if available to keep your listings safe.
                </p>
             </div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
             <h3 className="text-sm font-black text-dark uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Activity</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                   <span className="text-gray-400 font-bold uppercase">Member Since</span>
                   <span className="text-dark font-black">Aug 2025</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                   <span className="text-gray-400 font-bold uppercase">Role</span>
                   <span className="text-primary font-black uppercase tracking-tighter">{user?.role}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                   <span className="text-gray-400 font-bold uppercase">Listings Posted</span>
                   <span className="text-dark font-black">12</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
