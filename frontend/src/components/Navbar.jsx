import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Menu, X, Home, LayoutDashboard, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const close = () => setIsOpen(false);

  return (
    <nav className="bg-white border-b border-gray-100 h-16 md:h-20 flex items-center sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-full">

          {/* Left Nav Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/listings?type=sale" className="text-sm font-bold text-dark hover:text-primary transition-colors">Buy</Link>
            <Link to="/listings?type=rent" className="text-sm font-bold text-dark hover:text-primary transition-colors">Rent</Link>
            <Link to="/dashboard/add-listing" className="text-sm font-bold text-dark hover:text-primary transition-colors">Sell</Link>
            <Link to="/listings?category=material" className="text-sm font-bold text-dark hover:text-primary transition-colors">Materials</Link>
          </div>

          {/* Center Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white group-hover:rotate-6 transition-transform shadow-lg shadow-primary/20">
              <Home size={20} />
            </div>
            <span className="text-xl font-black text-dark tracking-tighter uppercase font-poppins">TabiConst</span>
          </Link>

          {/* Right Nav */}
          <div className="hidden lg:flex items-center space-x-5">
            <Link to="/listings" className="text-sm font-bold text-dark hover:text-primary transition-colors">Browse</Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-4 border-l border-gray-100 pl-5 ml-2">
                <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold text-dark hover:text-primary transition-colors">
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
                <span className="text-xs font-black text-gray-300">|</span>
                <span className="text-sm font-bold text-dark">{user?.name?.split(' ')[0]}</span>
                <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-bold text-red-500 hover:text-red-700 transition-colors">
                  <LogOut size={15} /> Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-2.5 px-6 rounded-md text-xs font-black uppercase tracking-widest">
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-dark p-1">
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 lg:hidden shadow-2xl z-50">
          <div className="p-5 space-y-1">
            <Link to="/listings?type=sale" onClick={close} className="flex items-center gap-3 font-bold text-dark text-base py-3 px-4 rounded-xl hover:bg-accent/50 transition-colors">🏷️ Buy Property</Link>
            <Link to="/listings?type=rent" onClick={close} className="flex items-center gap-3 font-bold text-dark text-base py-3 px-4 rounded-xl hover:bg-accent/50 transition-colors">🔑 Rent Property</Link>
            <Link to="/listings?category=material" onClick={close} className="flex items-center gap-3 font-bold text-dark text-base py-3 px-4 rounded-xl hover:bg-accent/50 transition-colors">🔧 Materials</Link>
            <Link to="/listings" onClick={close} className="flex items-center gap-3 font-bold text-dark text-base py-3 px-4 rounded-xl hover:bg-accent/50 transition-colors">🔍 Browse All</Link>
            <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={close} className="flex items-center gap-3 font-black text-primary text-base py-3 px-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors">
                    <LayoutDashboard size={18} /> My Dashboard
                  </Link>
                  <Link to="/dashboard/add-listing" onClick={close} className="flex items-center gap-3 font-bold text-dark text-base py-3 px-4 rounded-xl hover:bg-accent/50 transition-colors">
                    ➕ Add New Listing
                  </Link>
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">{user?.name?.[0]?.toUpperCase()}</div>
                      <div>
                        <div className="text-sm font-black text-dark">{user?.name}</div>
                        <div className="text-[10px] text-gray-400 font-bold capitalize">{user?.role}</div>
                      </div>
                    </div>
                    <button onClick={() => { handleLogout(); close(); }} className="flex items-center gap-1 text-xs font-black text-red-500 bg-red-50 px-3 py-1.5 rounded-lg">
                      <LogOut size={12} /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link to="/login" onClick={close} className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl">
                  <User size={18} /> Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
