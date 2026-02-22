import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Home, PlusCircle, Heart, User, LogOut, Search, Settings, ShieldCheck, Menu, X, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    ...(user?.role === 'admin' || user?.role === 'manager'
      ? [{ name: 'Control Panel', path: '/admin', icon: <ShieldCheck size={20} /> }]
      : []),
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    ...(['admin', 'manager', 'landlord'].includes(user?.role)
      ? [
          { name: 'My Listings', path: '/dashboard/my-listings', icon: <Home size={20} /> },
          { name: 'Add New Listing', path: '/dashboard/add-listing', icon: <PlusCircle size={20} /> },
        ]
      : []),
    { name: 'Favorites', path: '/dashboard/favorites', icon: <Heart size={20} /> },
    { name: 'Profile Settings', path: '/dashboard/profile', icon: <User size={20} /> },
  ];

  const SidebarContent = ({ onLinkClick }) => (
    <>
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg flex-shrink-0">
          <Home size={20} fill="white" />
        </div>
        <span className="text-lg font-black font-poppins tracking-tight">TabiConst</span>
      </div>

      {/* Nav */}
      <nav className="flex-grow pt-6 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onLinkClick}
                className={`flex items-center gap-4 px-6 py-3.5 transition-all relative ${
                  isActive
                    ? 'bg-blue-600/20 border-l-[4px] border-primary text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white border-l-[4px] border-transparent'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-white/50'}>{item.icon}</span>
                <span className="font-semibold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-3 px-2 mb-3">
          <img
            src={`https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=3b82f6&color=fff`}
            alt="avatar"
            className="w-9 h-9 rounded-xl flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="text-sm font-black text-white truncate">{user?.name}</div>
            <div className="text-[10px] text-white/40 font-bold capitalize">{user?.role}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all group font-bold text-sm"
        >
          <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex w-[260px] bg-[#1A2B4D] text-white flex-col fixed h-full z-20 shadow-2xl">
        <SidebarContent onLinkClick={() => {}} />
      </aside>

      {/* ── Mobile Sidebar Drawer ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-[#1A2B4D] text-white flex flex-col shadow-2xl z-50 animate-in slide-in-from-left duration-300">
            <SidebarContent onLinkClick={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-grow md:pl-[260px] flex flex-col min-h-screen">

        {/* Top Header */}
        <header className="h-[60px] md:h-[70px] bg-white shadow-sm px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-primary rounded-xl hover:bg-primary/5 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Brand on mobile */}
          <div className="md:hidden flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white">
              <Home size={14} fill="white" />
            </div>
            <span className="font-black text-dark text-base font-poppins">TabiConst</span>
          </div>

          {/* Right header icons */}
          <div className="flex items-center gap-4 ml-auto">
            <button className="hidden sm:block text-gray-400 hover:text-primary transition-colors">
              <Search size={18} />
            </button>
            <button className="hidden sm:block text-gray-400 hover:text-primary transition-colors">
              <LayoutDashboard size={18} />
            </button>
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <Link to="/admin" className="hidden sm:block text-gray-400 hover:text-primary transition-colors">
                <ShieldCheck size={18} />
              </Link>
            )}
            <button className="hidden sm:block text-gray-400 hover:text-primary transition-colors">
              <Settings size={18} />
            </button>
            <div className="w-px h-5 bg-gray-200 hidden sm:block" />
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=3b82f6&color=fff`}
              alt="avatar"
              className="w-8 h-8 md:w-9 md:h-9 rounded-lg border border-gray-100 shadow-sm cursor-pointer"
            />
            <ChevronRight size={14} className="text-gray-300 hidden sm:block" />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 md:p-8 lg:p-10 bg-[#F0F2F5] flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
