import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Home, PlusCircle, Heart, User, LogOut, ChevronRight, Search, Settings, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    ...(user?.role === 'admin' || user?.role === 'manager' ? [{ name: 'Control Panel', path: '/admin', icon: <ShieldCheck size={20} /> }] : []),
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    ...(['admin', 'manager', 'landlord'].includes(user?.role) ? [
      { name: 'My Listings', path: '/dashboard/my-listings', icon: <Home size={20} /> },
      { name: 'Add New Listing', path: '/dashboard/add-listing', icon: <PlusCircle size={20} /> }
    ] : []),
    { name: 'Favorites', path: '/dashboard/favorites', icon: <Heart size={20} /> },
    { name: 'Profile Settings', path: '/dashboard/profile', icon: <User size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex">
      {/* Premium Dark Sidebar - Matching Mockup */}
      <aside className="w-[280px] bg-[#1A2B4D] text-white flex flex-col fixed h-full z-20 shadow-2xl">
        <div className="p-8 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-xl">
            <Home size={24} fill="white" />
          </div>
          <span className="text-xl font-bold font-poppins tracking-tight">TabiConst</span>
        </div>

        <nav className="flex-grow px-0 pt-10">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-5 px-8 py-4 transition-all relative ${
                  location.pathname === item.path 
                    ? 'bg-blue-600/20 border-l-[6px] border-primary text-white shadow-inner' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={location.pathname === item.path ? 'text-white' : 'text-white/60'}>
                  {item.icon}
                </span>
                <span className="font-semibold text-base">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-6 border-t border-white/5 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-white/50 hover:text-white transition-all group font-bold"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow pl-[280px] flex flex-col min-h-screen">
        <header className="h-[75px] bg-white shadow-sm px-10 flex items-center justify-end sticky top-0 z-10">
           <div className="flex items-center gap-8">
              <button className="text-gray-400 hover:text-primary transition-colors">
                <Search size={20} />
              </button>
              <button className="text-gray-400 hover:text-primary transition-colors">
                <LayoutDashboard size={20} />
              </button>
              <button className="text-gray-400 hover:text-primary transition-colors">
                 <ShieldCheck size={20} />
              </button>
              <button className="text-gray-400 hover:text-primary transition-colors">
                <Settings size={20} />
              </button>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <div className="flex items-center gap-3 cursor-pointer group">
                 <img 
                    src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=3b82f6&color=fff`} 
                    alt="avatar" 
                    className="w-9 h-9 rounded-lg object-cover border border-gray-100 shadow-sm"
                 />
                 <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
              </div>
           </div>
        </header>

        <main className="p-10 bg-[#F0F2F5]">
           <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
