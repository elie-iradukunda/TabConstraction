import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Home, 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronRight,
  Search,
  LayoutDashboard,
  MessageSquare
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <BarChart3 size={20} /> },
    { name: 'User Management', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Listings Control', path: '/admin/listings', icon: <Home size={20} /> },
    { name: 'Approval System', path: '/admin/approvals', icon: <ShieldCheck size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <LayoutDashboard size={20} /> },
    { name: 'Media / Images', path: '/admin/media', icon: <Search size={20} /> }, // Placeholder for Media
    { name: 'Report Center', path: '/admin/reports', icon: <MessageSquare size={20} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
    ...(user?.role === 'admin' ? [{ name: 'System Settings', path: '/admin/settings', icon: <Settings size={20} /> }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex">
      {/* Admin Sidebar - Matching Screenshot */}
      <aside className="w-[280px] bg-[#1A2B4D] text-white flex flex-col fixed h-full z-20">
        <div className="p-8 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-xl">
            <Home size={24} fill="white" />
          </div>
          <span className="text-xl font-bold font-poppins tracking-tight">Admin Dashboard</span>
        </div>

        <nav className="flex-grow px-0 pt-10">
          <div className="space-y-1">
            {navItems.map((item) => (
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

        <div className="p-4 border-t border-white/10 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 text-white/70 hover:text-white transition-colors group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow pl-[280px] flex flex-col min-h-screen">
        <header className="h-[70px] bg-white shadow-sm px-10 flex items-center justify-end sticky top-0 z-10">
           <div className="flex items-center gap-6">
              <button className="text-gray-400 hover:text-primary transition-colors">
                <Search size={20} />
              </button>
              <button className="text-gray-400 hover:text-primary transition-colors">
                <LayoutDashboard size={20} />
              </button>
              <button className="text-gray-400 hover:text-primary transition-colors">
                <Users size={20} />
              </button>
              <button className="text-gray-400 hover:text-primary transition-colors">
                <Settings size={20} />
              </button>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <div className="flex items-center gap-3">
                 <img 
                    src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=random`} 
                    alt="avatar" 
                    className="w-9 h-9 rounded-lg object-cover border border-gray-100 shadow-sm"
                 />
                 <ChevronRight size={16} className="text-gray-300" />
              </div>
           </div>
        </header>

        <main className="p-8">
           <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
