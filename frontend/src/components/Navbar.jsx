import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Menu, X, Home } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 h-20 flex items-center sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-full">
          {/* Left Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/listings?type=sale" className="text-sm font-medium text-dark hover:text-primary transition-colors">Buy</Link>
            <Link to="/listings?type=rent" className="text-sm font-medium text-dark hover:text-primary transition-colors">Rent</Link>
            <Link to="/dashboard/add-listing" className="text-sm font-medium text-dark hover:text-primary transition-colors">Sell</Link>
            <Link to="/listings?category=material" className="text-sm font-medium text-dark hover:text-primary transition-colors">Materials</Link>
          </div>

          {/* Center Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white group-hover:rotate-6 transition-transform shadow-lg shadow-primary/20">
              <Home size={20} />
            </div>
            <span className="text-2xl font-black text-dark tracking-tighter uppercase font-poppins">TabiConst</span>
          </Link>

          {/* Right Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/listings" className="text-sm font-medium text-dark hover:text-primary transition-colors">Browse</Link>
            <Link to="/dashboard" className="text-sm font-medium text-dark hover:text-primary transition-colors">Manage rentals</Link>
            {isAuthenticated ? (
               <div className="flex items-center gap-4 border-l border-gray-100 pl-6 ml-4">
                  <span className="text-sm font-bold text-dark">{user?.name}</span>
                  <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-700">Logout</button>
               </div>
            ) : (
              <Link to="/login" className="btn-primary py-2.5 px-6 rounded-md text-xs font-black uppercase tracking-widest">
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-dark">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-20 left-0 right-0 bg-white border-b border-gray-100 lg:hidden shadow-xl animate-in slide-in-from-top duration-300">
           <div className="p-6 space-y-4">
              <Link to="/listings" className="block text-lg font-bold text-dark p-2">Browse All</Link>
              <Link to="/listings?category=house" className="block text-lg font-bold text-dark p-2">Houses</Link>
              <Link to="/listings?category=material" className="block text-lg font-bold text-dark p-2">Materials</Link>
              <div className="border-t border-gray-50 pt-4 mt-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn-primary w-full">Go to Dashboard</Link>
                ) : (
                  <Link to="/login" className="btn-primary w-full">Sign in</Link>
                )}
              </div>
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
