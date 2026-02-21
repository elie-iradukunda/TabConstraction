import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Briefcase, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user'
  });

  const { register, loading, error, clearError, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

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
      await register(formData);
    } catch (err) {
      // Error handled by store
    }
  };

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
                  className="w-full pl-12 pr-4 py-3 bg-accent/50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user">Individual User</option>
                  <option value="agent">Real Estate Agent</option>
                </select>
              </div>
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
