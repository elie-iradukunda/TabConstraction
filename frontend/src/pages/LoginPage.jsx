import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, clearError, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      // Error handled by store
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side: Form */}
      <div className="flex items-center justify-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 mb-10 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                <Lock size={20} />
              </div>
              <span className="text-2xl font-black text-dark font-poppins">TabiConst</span>
            </Link>
            <h1 className="text-4xl font-black text-dark font-poppins mb-3">Welcome back</h1>
            <p className="text-gray-500 font-medium">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-xl animate-shake">
              <div className="flex justify-between items-center">
                <p className="text-red-700 font-bold">{error}</p>
                <button onClick={clearError} className="text-red-500 hover:text-red-700">×</button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-black text-dark uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-accent/50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all font-medium"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-black text-dark uppercase tracking-widest">Password</label>
                <a href="#" className="text-sm font-bold text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="w-full pl-12 pr-12 py-4 bg-accent/50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-gray-300 text-primary focus:ring-primary" />
              <label htmlFor="remember" className="ml-3 text-sm font-bold text-gray-600">Keep me logged in</label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-dark text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-dark/10 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-10 text-gray-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-black hover:underline uppercase tracking-wider text-sm">Create an account</Link>
          </p>
        </div>
      </div>

      {/* Right side: Image/Context */}
      <div className="hidden lg:block relative overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
            alt="Real Estate" 
            className="w-full h-full object-cover mix-blend-overlay opacity-40 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent"></div>
        </div>
        <div className="absolute bottom-24 left-24 right-24 text-white">
          <h2 className="text-5xl font-black font-poppins mb-6 leading-tight">Elevate Your Property Brand</h2>
          <p className="text-xl text-blue-100 font-medium leading-relaxed max-w-lg">
            "TabiConst has redefined how we manage our listings. The exposure we get is unmatched in the local market."
          </p>
          <div className="mt-8 flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md"></div>
             <div>
                <div className="font-bold">Michael Chen</div>
                <div className="text-blue-200 text-sm">CEO, Elite Properties</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
