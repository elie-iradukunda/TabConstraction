import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Briefcase, ArrowRight, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
    nationalId: '',
    address: ''
  });

  const { register, loading, error, clearError, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [pendingSuccess, setPendingSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await register(formData);
      if (result?.pendingApproval) {
        setPendingSuccess(true);
      }
    } catch (err) {
      // Error handled by store
    }
  };

  // Show success screen for pending landlord accounts
  if (pendingSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white p-8">
        <div className="max-w-lg text-center">
          <div className="w-24 h-24 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-dark font-poppins mb-4">Account Pending Approval</h1>
          <p className="text-gray-600 text-lg font-medium mb-8 leading-relaxed">
            Your landlord account has been created successfully! An admin will review and approve your account shortly.
          </p>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg text-left space-y-4 mb-8">
            <h3 className="font-black text-dark text-sm uppercase tracking-widest">Contact Admin to Speed Up</h3>
            <div className="flex items-center gap-3 text-gray-600">
              <Mail size={18} className="text-primary" />
              <a href="mailto:admin@tabiconst.com" className="font-bold text-primary hover:underline">admin@tabiconst.com</a>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone size={18} className="text-primary" />
              <a href="tel:+250788000000" className="font-bold text-primary hover:underline">+250 788 000 000</a>
            </div>
          </div>
          <Link to="/login" className="inline-block bg-dark text-white px-10 py-4 rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-dark/10">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Right side background for mobile logic swap */}
      <div className="hidden lg:block relative overflow-hidden bg-primary order-last">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1503387762-592dee58c160?auto=format&fit=crop&q=80&w=2000" 
            alt="Construction" 
            className="w-full h-full object-cover mix-blend-overlay opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent"></div>
        </div>
        <div className="absolute bottom-24 left-24 right-24 text-white">
          <h2 className="text-5xl font-black font-poppins mb-6 leading-tight">Build the Future with Us</h2>
          <p className="text-xl text-blue-100 font-medium leading-relaxed max-w-lg">
            Create an account today and join a growing community of properties and materials experts.
          </p>
        </div>
      </div>

      {/* Left side: Form */}
      <div className="flex items-center justify-center p-8 lg:p-20 bg-white">
        <div className="w-full max-w-xl">
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                <User size={20} />
              </div>
              <span className="text-2xl font-black text-dark font-poppins">TabiConst</span>
            </Link>
            <h1 className="text-4xl font-black text-dark font-poppins mb-2">Create Account</h1>
            <p className="text-gray-500 font-medium">Join our marketplace and start listing your products.</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl">
              <div className="flex justify-between items-center">
                <p className="text-red-700 font-bold">{error}</p>
                <button onClick={clearError} className="text-red-500 hover:text-red-700">×</button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-black text-dark uppercase tracking-widest mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  name="name"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-accent/50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-black text-dark uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  name="email"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-accent/50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-black text-dark uppercase tracking-widest mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="tel" 
                  name="phone"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-accent/50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-black text-dark uppercase tracking-widest mb-2">I am a...</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  name="role"
                  className="w-full pl-12 pr-4 py-3 bg-accent/50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium appearance-none"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user">Normal User (Buyer / Browser)</option>
                  <option value="landlord">Landlord (Property Owner)</option>
                </select>
              </div>
              {formData.role === 'landlord' && (
                <p className="mt-2 text-xs text-orange-600 font-bold bg-orange-50 px-3 py-2 rounded-xl">
                  ⚠️ Landlord accounts require admin approval before you can post listings.
                </p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-black text-dark uppercase tracking-widest mb-2">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  name="password"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-accent/50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {formData.role === 'landlord' && (
              <div className="col-span-2 bg-orange-50/50 p-6 rounded-[2rem] border border-orange-100 space-y-6 mt-4">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                      <Shield size={16} />
                   </div>
                   <h3 className="font-black text-dark text-sm uppercase tracking-widest">Government Verification</h3>
                </div>
                
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  To maintain platform trust and comply with local regulations, landlords must provide valid identification and business information.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-dark uppercase tracking-widest mb-2">Government ID / National ID *</label>
                    <input 
                      type="text" 
                      name="nationalId"
                      required
                      className="w-full px-5 py-3 bg-white border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all font-medium text-sm"
                      placeholder="Enter ID Number"
                      value={formData.nationalId}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-dark uppercase tracking-widest mb-2">Business or Home Address *</label>
                    <input 
                      type="text" 
                      name="address"
                      required
                      className="w-full px-5 py-3 bg-white border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all font-medium text-sm"
                      placeholder="District, Sector, Street"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <p className="text-[10px] text-orange-600 font-bold italic">
                  Note: You may be asked to upload physical copies of these documents during administrative review.
                </p>
              </div>
            )}

            <div className="col-span-2 pt-4">
               <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-dark text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-center mt-8 text-gray-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-black hover:underline uppercase tracking-wider text-sm">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
