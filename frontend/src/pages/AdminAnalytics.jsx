import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Users, Home, TrendingUp, Tag, Briefcase, Box, Clock, CheckCircle2, ShieldCheck, ArrowRight
} from 'lucide-react';
import { listingService } from '../services/listingService';
import { Link } from 'react-router-dom';

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await listingService.getDashboardStats();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-bold animate-pulse">Analyzing platform data...</p>
      </div>
    );
  }

  if (!stats) return <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 font-bold">Failed to load analytics. Please refresh.</div>;

  const topCards = [
    { title: 'Total Users', value: stats.users.total, icon: <Users />, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
    { title: 'Total Listings', value: stats.listings.total, icon: <Home />, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { title: 'Active Listings', value: stats.listings.active, icon: <CheckCircle2 />, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
    { title: 'Pending Approval', value: stats.listings.pending, icon: <Clock />, iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-dark font-poppins mb-1">Platform Analytics</h1>
        <p className="text-gray-500 font-medium text-sm tracking-tight">Real-time overview of your entire platform.</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {topCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div className={`w-14 h-14 ${stat.iconBg} rounded-2xl flex items-center justify-center ${stat.iconColor} flex-shrink-0`}>
              {React.cloneElement(stat.icon, { size: 28 })}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-2xl font-black text-dark">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Status Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {[
          { label: 'Houses', value: stats.listings.houses, icon: <Home size={18} />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Land', value: stats.listings.land, icon: <Tag size={18} />, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Materials', value: stats.listings.materials, icon: <Box size={18} />, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'For Sale', value: stats.listings.forSale, icon: <TrendingUp size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'For Rent', value: stats.listings.forRent, icon: <Briefcase size={18} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Pending Users', value: stats.users.pending, icon: <ShieldCheck size={18} />, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((item, idx) => (
          <div key={idx} className={`${item.bg} p-4 md:p-5 rounded-2xl text-center border border-white`}>
            <div className={`${item.color} flex justify-center mb-2`}>{item.icon}</div>
            <p className={`text-xl md:text-2xl font-black ${item.color}`}>{item.value}</p>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Recent Listings */}
        <div className="xl:col-span-7 bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg md:text-xl font-black text-dark font-poppins">Recent Listings</h2>
            <Link to="/admin/listings" className="text-xs font-black text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto -mx-1 pr-4">
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="pb-4 px-2">Listing Detail</th>
                  <th className="pb-4 px-2">Category</th>
                  <th className="pb-4 px-2 text-center">Current Status</th>
                  <th className="pb-4 px-2 text-right">Published</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentListings.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-2 max-w-[200px]">
                      <div className="font-bold text-dark text-sm truncate">{l.title}</div>
                      <div className="text-[11px] text-gray-400 font-medium truncate">{l.owner?.name || 'Tabi User'}</div>
                    </td>
                    <td className="py-4 px-2">
                       <span className="text-[10px] font-black uppercase text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">{l.category}</span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        l.status === 'active' ? 'bg-green-100 text-green-700' :
                        l.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>{l.status}</span>
                    </td>
                    <td className="py-4 px-2 text-right text-[11px] font-bold text-gray-400">
                      {new Date(l.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Breakdown & Chart */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h2 className="text-lg font-black text-dark mb-6 font-poppins">User Distribution</h2>
            <div className="space-y-5">
              {[
                { label: 'Admins', val: stats.users.admins, color: 'bg-purple-500' },
                { label: 'Managers', val: stats.users.managers, color: 'bg-indigo-500' },
                { label: 'Landlords', val: stats.users.landlords, color: 'bg-blue-500' },
                { label: 'Clients', val: stats.users.normalUsers, color: 'bg-gray-400' },
              ].map((r, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{r.label}</span>
                    <span className="text-sm font-black text-dark">{r.val}</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div className={`h-full ${r.color} rounded-full transition-all duration-700`} style={{ width: `${stats.users.total > 0 ? Math.max(5, (r.val / stats.users.total) * 100) : 0}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h2 className="text-lg font-black text-dark mb-2 font-poppins">Listings Trend</h2>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 italic"><div className="w-3 h-3 bg-[#1A2B4D] rounded-sm"></div><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sales</span></div>
              <div className="flex items-center gap-2 italic"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Rentals</span></div>
            </div>
            <div className="h-56 md:h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#F1F1F1" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#ADB5BD'}} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 15px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                  <Line type="monotone" dataKey="sales" stroke="#1A2B4D" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="rentals" stroke="#3B82F6" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg md:text-xl font-black text-dark font-poppins">Recent Registrations</h2>
          <Link to="/admin/users" className="text-xs font-black text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all">
            Manage All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {stats.recentUsers.map((u) => (
            <div key={u.id} className="text-center p-5 bg-accent/30 rounded-2xl border border-white hover:bg-accent/50 transition-all group">
              <div className="relative inline-block mb-3">
                <img 
                  src={`https://ui-avatars.com/api/?name=${u.name}&background=1A2B4D&color=fff&bold=true`} 
                  alt={u.name} 
                  className="w-14 h-14 rounded-2xl mx-auto shadow-md group-hover:scale-105 transition-transform"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <p className="font-black text-dark text-xs truncate max-w-full">{u.name}</p>
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tighter ${
                u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                u.role === 'manager' ? 'bg-indigo-100 text-indigo-700' :
                u.role === 'landlord' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-600'
              }`}>{u.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
