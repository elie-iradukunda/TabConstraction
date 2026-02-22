import React, { useState } from 'react';
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
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    { name: 'Media / Images', path: '/admin/media', icon: <Search size={20} /> },
    { name: 'Report Center', path: '/admin/reports', icon: <MessageSquare size={20} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
    ...(user?.role === 'admin' ? [{ name: 'System Settings', path: '/admin/settings', icon: <Settings size={20} /> }] : []),
  ];

  const SidebarContent = ({ onLinkClick }) => (
    <>
      <div className="p-8 pb-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-xl">
          <Home size={24} fill="white" />
        </div>
        <span className="text-xl font-bold font-poppins tracking-tight">Admin Portal</span>
      </div>

      <nav className="flex-grow px-0 pt-10 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onLinkClick}
              className={`flex items-center gap-5 px-8 py-4 transition-all relative ${
                location.pathname === item.path 
                  ? 'bg-blue-600/20 border-l-[6px] border-primary text-white shadow-inner' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white border-l-[6px] border-transparent'
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
        <div className="flex items-center gap-3 px-4 mb-4">
           <img 
              src={`https://ui-avatars.com/api/?name=${user?.name || 'A'}&background=3b82f6&color=fff`} 
              alt="avatar" 
              className="w-10 h-10 rounded-xl"
           />
           <div className="min-w-0">
              <p className="text-sm font-black text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{user?.role}</p>
           </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 text-white/70 hover:text-white transition-colors group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-[280px] bg-[#1A2B4D] text-white flex-col fixed h-full z-20 shadow-2xl">
        <SidebarContent onLinkClick={() => {}} />
      </aside>

      {/* ── Mobile Sidebar Drawer ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#1A2B4D] text-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <SidebarContent onLinkClick={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <div className="flex-grow lg:pl-[280px] flex flex-col min-h-screen w-full">
        <header className="h-[70px] bg-white shadow-sm px-4 md:px-10 flex items-center justify-between sticky top-0 z-10 w-full">
           <button 
             className="lg:hidden p-2 text-gray-500 hover:text-primary rounded-xl"
             onClick={() => setSidebarOpen(true)}
           >
             <Menu size={24} />
           </button>

           <div className="flex lg:hidden items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <Home size={16} fill="white" />
              </div>
              <span className="font-black text-dark text-lg font-poppins">Admin</span>
           </div>

           <div className="flex items-center gap-6 ml-auto">
              <button className="hidden sm:block text-gray-400 hover:text-primary transition-colors">
                <Search size={20} />
              </button>
              <button className="hidden sm:block text-gray-400 hover:text-primary transition-colors">
                <LayoutDashboard size={20} />
              </button>
              <button className="hidden sm:block text-gray-400 hover:text-primary transition-colors">
                <Users size={20} />
              </button>
              <button className="hidden sm:block text-gray-400 hover:text-primary transition-colors">
                <Settings size={20} />
              </button>
              <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>
              <div className="flex items-center gap-3">
                 <img 
                    src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=3b82f6&color=fff`} 
                    alt="avatar" 
                    className="w-9 h-9 rounded-lg object-cover border border-gray-100 shadow-sm"
                 />
                 <ChevronRight size={16} className="text-gray-300 hidden sm:block" />
              </div>
           </div>
        </header>

        <main className="p-4 md:p-8">
           <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
