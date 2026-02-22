import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useListingStore } from '../store/listingStore';
import { listingService } from '../services/listingService';
import { Link } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Home, Tag, Briefcase, Box, Users, Package, ShieldCheck, Heart, MessageSquare, Clock, CheckCircle2, ArrowRight
} from 'lucide-react';

const DashboardOverview = () => {
  const { user } = useAuthStore();
  const { myListings, fetchMyMyListings } = useListingStore();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Note: I missed that useListingStore uses fetchMyListings not fetchMyMyListings in previous edit, 
  // but looking at the import, it's fetchMyListings. 
  const { fetchMyListings } = useListingStore();

  useEffect(() => {
    fetchMyListings();
    if (['admin', 'manager'].includes(user?.role)) {
      loadStats();
    }
  }, []);

  const loadStats = async () => {
    try {
      const data = await listingService.getDashboardStats();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const lineData = [
    { name: 'Jan', sales: 15, rentals: 5 },
    { name: 'Feb', sales: 45, rentals: 15 },
    { name: 'Mar', sales: 30, rentals: 12 },
    { name: 'Apr', sales: 65, rentals: 42 },
    { name: 'May', sales: 42, rentals: 30 },
    { name: 'Jun', sales: 52, rentals: 72 },
  ];

  const isManagement = ['admin', 'manager'].includes(user?.role);
  const isLandlord = user?.role === 'landlord';

  const statCards = isManagement && stats ? [
    { title: 'Total Listings', value: stats.listings.total, icon: <Home className="text-blue-600" />, iconBg: 'bg-blue-50' },
    { title: 'For Sale', value: stats.listings.forSale, icon: <Tag className="text-emerald-600" />, iconBg: 'bg-emerald-50' },
    { title: 'For Rent', value: stats.listings.forRent, icon: <Briefcase className="text-indigo-600" />, iconBg: 'bg-indigo-50' },
    { title: 'Total Users', value: stats.users.total, icon: <Users className="text-purple-600" />, iconBg: 'bg-purple-50' },
  ] : isLandlord ? [
    { title: 'My Properties', value: myListings.length, icon: <Home className="text-blue-600" />, iconBg: 'bg-blue-50' },
    { title: 'Pending Approval', value: myListings.filter(l => l.status === 'pending').length, icon: <Clock className="text-orange-600" />, iconBg: 'bg-orange-50' },
    { title: 'Active', value: myListings.filter(l => l.status === 'active').length, icon: <CheckCircle2 className="text-green-600" />, iconBg: 'bg-green-50' },
    { title: 'Messages', value: '0', icon: <MessageSquare className="text-purple-600" />, iconBg: 'bg-purple-50' },
  ] : [
    { title: 'Saved Properties', value: '0', icon: <Heart className="text-pink-600" />, iconBg: 'bg-pink-50' },
    { title: 'Listings Available', value: '-', icon: <Home className="text-blue-600" />, iconBg: 'bg-blue-50' },
    { title: 'Notifications', value: '0', icon: <Box className="text-orange-600" />, iconBg: 'bg-orange-50' },
    { title: 'Reviews', value: '0', icon: <Users className="text-purple-600" />, iconBg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-dark font-poppins mb-1">Hello, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
          {user?.status === 'pending' && user?.role === 'landlord' ? (
            <div className="bg-orange-50 border border-orange-100 px-4 py-2 rounded-xl mt-2 inline-flex items-center gap-2">
              <ShieldCheck size={16} className="text-orange-600" />
              <p className="text-orange-700 font-bold text-[11px] uppercase tracking-wider">Account pending verification</p>
            </div>
          ) : (
            <p className="text-gray-400 font-medium text-sm">Everything looks good on your dashboardวันนี้.</p>
          )}
        </div>
        {isManagement && (
          <Link to="/admin" className="bg-[#1A2B4D] text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-black text-sm hover:opacity-90 transition-all shadow-lg shadow-dark/10">
             <ShieldCheck size={18} />
             <span>ADMIN PANEL</span>
          </Link>
        )}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div className={`w-14 h-14 ${stat.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
              {React.cloneElement(stat.icon, { size: 28 })}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-2xl font-black text-dark">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Sub-stats for Managers */}
      {isManagement && stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: 'Houses', value: stats.listings.houses, color: 'text-blue-600' },
            { label: 'Land', value: stats.listings.land, color: 'text-green-600' },
            { label: 'Materials', value: stats.listings.materials, color: 'text-orange-600' },
            { label: 'Pending Listings', value: stats.listings.pending, color: 'text-yellow-600' },
            { label: 'Pending Users', value: stats.users.pending, color: 'text-red-600' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
              <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table Content */}
        <div className={(isManagement || isLandlord) ? "lg:col-span-8 space-y-6" : "lg:col-span-12 space-y-6"}>
          {(isManagement || isLandlord) ? (
            <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg md:text-xl font-black text-dark font-poppins">{isManagement ? 'Recent Activity' : 'My Recent Submissions'}</h2>
                <Link to={isManagement ? "/admin/listings" : "/dashboard/my-listings"} className="text-xs font-black text-primary flex items-center gap-1.5 hover:underline transition-all">
                  VIEW ALL <ArrowRight size={14} />
                </Link>
              </div>
              
              <div className="overflow-x-auto -mx-1 pr-4">
                <table className="w-full text-left min-w-[500px]">
                  <thead>
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                      <th className="pb-4 px-2">Listing Detail</th>
                      <th className="pb-4 px-2">Category</th>
                      <th className="pb-4 px-2 text-center">Status</th>
                      <th className="pb-4 px-2 text-right">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(() => {
                      const items = isManagement && stats ? stats.recentListings : myListings;
                      return items && items.length > 0 ? items.slice(0, 5).map((l) => (
                        <tr key={l.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="py-4 px-2">
                            <div className="font-bold text-dark text-sm group-hover:text-primary transition-colors">{l.title}</div>
                            <div className="text-[11px] text-gray-400 font-medium">{l.location}</div>
                          </td>
                          <td className="py-4 px-2">
                             <span className="text-[10px] font-black uppercase text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">{l.category}</span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              l.status === 'active' ? 'bg-green-100 text-green-700' :
                              l.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {l.status}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right text-[11px] font-bold text-gray-400">
                            {new Date(l.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4" className="py-16 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                               <Package size={24} className="text-gray-200" />
                            </div>
                            <p className="text-gray-400 font-bold text-sm">No activity records found.</p>
                          </td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
             <div className="bg-white p-10 md:p-16 rounded-3xl md:rounded-[3rem] border border-gray-100 shadow-sm text-center">
                <div className="w-20 h-20 bg-pink-50 text-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm shadow-pink-100">
                   <Heart size={40} fill="currentColor" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-dark mb-2 font-poppins">Ready to find a home?</h2>
                <p className="text-gray-400 font-medium mb-8 text-sm md:text-base max-w-md mx-auto">Start browsing the marketplace and save your favorite properties to see them right here on your dashboard.</p>
                <Link to="/listings" className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.03] transition-transform inline-block text-sm uppercase tracking-widest">
                   BROWSE MARKET
                </Link>
             </div>
          )}
        </div>

        {/* Sidebar Graphics */}
        {(isManagement || isLandlord) && (
          <div className="lg:col-span-4 space-y-6">
            {isManagement && stats && (
              <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h2 className="text-lg font-black text-dark mb-6 font-poppins">Platform Users</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Admins', val: stats.users.admins, color: 'bg-purple-500' },
                    { label: 'Managers', val: stats.users.managers, color: 'bg-indigo-500' },
                    { label: 'Landlords', val: stats.users.landlords, color: 'bg-blue-500' },
                    { label: 'Normal Users', val: stats.users.normalUsers, color: 'bg-gray-400' },
                  ].map((r, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{r.label}</span>
                        <span className="text-sm font-black text-dark">{r.val}</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                        <div className={`h-full ${r.color} rounded-full transition-all duration-700`} style={{ width: `${stats.users.total > 0 ? (r.val / stats.users.total) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <h2 className="text-lg font-black text-dark mb-6 font-poppins">Performance Trend</h2>
              <div className="h-48 w-full -ml-4">
                <ResponsiveContainer width="110%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#F1F1F1" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#ADB5BD'}} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 15px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                    <Line type="monotone" dataKey="sales" stroke="#1A2B4D" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="rentals" stroke="#3B82F6" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;
