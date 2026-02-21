import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useListingStore } from '../store/listingStore';
import { Link } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Home, Tag, Briefcase, Box, Users, Package, ShieldCheck, Heart, MessageSquare
} from 'lucide-react';

const DashboardOverview = () => {
  const { user } = useAuthStore();
  const { myListings, fetchMyListings } = useListingStore();

  useEffect(() => {
    fetchMyListings();
  }, []);

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

  const stats = isManagement ? [
    { title: 'Platform Listings', value: '320', icon: <Home className="text-blue-600" />, iconBg: 'bg-blue-50' },
    { title: 'Properties for Sale', value: '120', icon: <Tag className="text-blue-800" />, iconBg: 'bg-blue-100' },
    { title: 'Materials', value: '115', icon: <Box className="text-orange-600" />, iconBg: 'bg-orange-50' },
    { title: 'Total Users', value: '1,540', icon: <Users className="text-purple-600" />, iconBg: 'bg-purple-50' },
  ] : isLandlord ? [
    { title: 'My Properties', value: myListings.length, icon: <Home className="text-blue-600" />, iconBg: 'bg-blue-50' },
    { title: 'Pending Approval', value: myListings.filter(l => l.status === 'pending').length, icon: <Tag className="text-orange-600" />, iconBg: 'bg-orange-50' },
    { title: 'Total Views', value: '1,240', icon: <Briefcase className="text-blue-900" />, iconBg: 'bg-indigo-50' },
    { title: 'Messages', value: '12', icon: <MessageSquare className="text-purple-600" />, iconBg: 'bg-purple-50' },
  ] : [
    { title: 'Saved Properties', value: '12', icon: <Heart className="text-pink-600" />, iconBg: 'bg-pink-50' },
    { title: 'Recent Searches', value: '5', icon: <Search className="text-blue-800" />, iconBg: 'bg-blue-100' },
    { title: 'Notifications', value: '3', icon: <Box className="text-orange-600" />, iconBg: 'bg-orange-50' },
    { title: 'My Reviews', value: '2', icon: <Users className="text-purple-600" />, iconBg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-dark font-poppins mb-1">Hello, {user?.name || 'User'}! 👋</h1>
          {user?.status === 'pending' && user?.role === 'landlord' ? (
            <div className="bg-orange-50 border border-orange-200 px-4 py-2 rounded-xl mt-2 inline-flex items-center gap-2">
              <ShieldCheck size={18} className="text-orange-600" />
              <p className="text-orange-700 font-bold text-sm">Your account is pending admin approval.</p>
            </div>
          ) : (
            <p className="text-gray-500 font-medium">Welcome back to your {user?.role} dashboard.</p>
          )}
        </div>
        {isManagement && (
          <Link to="/admin" className="bg-[#1A2B4D] text-white px-8 py-3 rounded-xl flex items-center gap-2 font-bold hover:opacity-90 transition-all shadow-lg">
             <ShieldCheck size={20} />
             <span>Go to Admin Panel</span>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div className={`w-14 h-14 ${stat.iconBg} rounded-2xl flex items-center justify-center`}>
              {React.cloneElement(stat.icon, { size: 28 })}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-2xl font-black text-dark">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className={(isManagement || isLandlord) ? "lg:col-span-8 space-y-6" : "lg:col-span-12 space-y-6"}>
          {(isManagement || isLandlord) ? (
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-dark mb-8">{isManagement ? 'Recent Platform Activity' : 'My Recent Listings'}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                      <th className="pb-4 px-4">Listing</th>
                      <th className="pb-4 px-4 text-center">Status</th>
                      <th className="pb-4 px-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {myListings.length > 0 ? myListings.slice(0, 5).map((l) => (
                      <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-5 px-4">
                          <div className="font-bold text-dark">{l.title}</div>
                          <div className="text-xs text-gray-400">{l.location}</div>
                        </td>
                        <td className="py-5 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            l.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {l.status}
                          </span>
                        </td>
                        <td className="py-5 px-4 text-right text-sm font-bold text-gray-500">
                          {new Date(l.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="3" className="py-20 text-center">
                          <Package size={48} className="mx-auto text-gray-100 mb-4" />
                          <p className="text-gray-400 font-bold">No listings found.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
             <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm text-center">
                <div className="w-20 h-20 bg-pink-50 text-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                   <Heart size={40} fill="currentColor" />
                </div>
                <h2 className="text-2xl font-black text-dark mb-2">Explore Properties</h2>
                <p className="text-gray-500 font-medium mb-8">Start saving your favorite houses and materials to see them here.</p>
                <Link to="/listings" className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-transform inline-block">
                   Browse Market
                </Link>
             </div>
          )}
        </div>

        {/* Sidebar Style Analytics */}
        {(isManagement || isLandlord) && (
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-dark mb-8">Performance</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#F1F1F1" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#ADB5BD'}} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 15px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                    <Line type="monotone" dataKey="sales" stroke="#1A2B4D" strokeWidth={4} dot={false} />
                    <Line type="monotone" dataKey="rentals" stroke="#006AFF" strokeWidth={4} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between mt-6 px-4">
                 <div className="text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Views</p>
                    <p className="text-xl font-black text-dark">4.2k</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Leads</p>
                    <p className="text-xl font-black text-dark">128</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">CTR</p>
                    <p className="text-xl font-black text-dark">3.4%</p>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;
