import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, LineChart, Line 
} from 'recharts';
import { 
  Users, 
  Home, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  Activity,
  Tag,
  Briefcase,
  Box
} from 'lucide-react';

import { listingService } from '../services/listingService';
import { userService } from '../services/userService';

const AdminAnalytics = () => {
  const [data, setData] = useState({ listings: [], users: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [listingsRes, usersRes] = await Promise.all([
        listingService.getAdminListings(),
        userService.getUsers()
      ]);
      
      if (listingsRes.success && usersRes.success) {
        setData({
          listings: listingsRes.listings,
          users: usersRes.users
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  const listingsCount = data.listings.length;
  const usersCount = data.users.length;
  const housesCount = data.listings.filter(l => l.category === 'house').length;
  const landCount = data.listings.filter(l => l.category === 'land').length;
  const materialsCount = data.listings.filter(l => l.category === 'material').length;

  const stats = [
    { title: 'Total Users', value: usersCount.toLocaleString(), icon: <Users className="text-purple-600" />, iconBg: 'bg-purple-50' },
    { title: 'Total Listings', value: listingsCount.toLocaleString(), icon: <Home className="text-blue-600" />, iconBg: 'bg-blue-50' },
    { title: 'Properties (Houses)', value: housesCount.toLocaleString(), icon: <Tag className="text-blue-800" />, iconBg: 'bg-blue-100' },
    { title: 'Materials & Land', value: (landCount + materialsCount).toLocaleString(), icon: <Box className="text-orange-600" />, iconBg: 'bg-orange-50' },
  ];

  const recentListings = data.listings.slice(0, 4).map(l => ({
    id: l.id,
    name: l.title,
    type: l.category,
    status: l.status.charAt(0).toUpperCase() + l.status.slice(1),
    date: new Date(l.createdAt).toLocaleDateString()
  }));

  return (
    <div className="space-y-6">
      {/* Top Stats - Exact Match */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-14 h-14 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
              {React.cloneElement(stat.icon, { size: 28 })}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-black text-dark tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Listings Table - Left Section */}
        <div className="lg:col-span-7 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-dark mb-8">Recent Listings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm font-bold border-b border-gray-100">
                  <th className="pb-4">Property</th>
                  <th className="pb-4">Type</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentListings.map((listing) => (
                  <tr key={listing.id} className="text-[15px] font-medium text-dark">
                    <td className="py-5">{listing.name}</td>
                    <td className="py-5 text-gray-500">{listing.type}</td>
                    <td className="py-5">
                      <span className={`px-4 py-1.5 rounded-md text-xs font-bold ${
                        listing.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="py-5 text-gray-500">{listing.date}</td>
                    <td className="py-5 text-right">
                      <button className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-md text-xs font-bold transition-all">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="w-full mt-8 bg-primary/10 hover:bg-primary/20 text-primary py-3 rounded-lg font-bold transition-all">
             View All
          </button>
        </div>

        {/* Right Section: User Stats & Growth Chart */}
        <div className="lg:col-span-5 space-y-6">
           {/* User Statistics Card */}
           <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-dark mb-8">User Statistics</h2>
              <div className="space-y-8">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-blue-50 text-primary rounded-lg flex items-center justify-center">
                          <Users size={24} />
                       </div>
                       <span className="text-gray-500 font-bold">Total Users</span>
                    </div>
                    <span className="text-3xl font-black text-dark tracking-tighter">1,540</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-blue-50 text-indigo-800 rounded-lg flex items-center justify-center">
                          <Briefcase size={24} />
                       </div>
                       <span className="text-gray-500 font-bold">Agents</span>
                    </div>
                    <span className="text-3xl font-black text-dark tracking-tighter">320</span>
                 </div>
              </div>
           </div>

           {/* Listings Overview Graph */}
           <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-dark mb-4">Listings Overview</h2>
              <div className="flex gap-6 mb-8">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-[3px] bg-dark rounded-full"></div>
                    <span className="text-xs font-bold text-gray-500 uppercase">Sales</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-[3px] bg-green-500 rounded-full"></div>
                    <span className="text-xs font-bold text-gray-500 uppercase">Rentals</span>
                 </div>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F1F1F1" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#ADB5BD'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#ADB5BD'}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="sales" stroke="#2A2A33" strokeWidth={3} dot={{r: 4, fill: '#2A2A33', strokeWidth: 2, stroke: '#fff'}} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="rentals" stroke="#22C55E" strokeWidth={3} dot={{r: 4, fill: '#22C55E', strokeWidth: 2, stroke: '#fff'}} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
         <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-dark mb-6">Pending Approvals</h2>
            <div className="space-y-4">
               {[
                 'Villa in Downtown - Awaiting Approval',
                 'Steel Beams - Pending Review'
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center gap-4 group cursor-pointer border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span className="text-[15px] font-semibold text-gray-600 group-hover:text-primary transition-colors">{item}</span>
                 </div>
               ))}
               <button className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-all">
                  Manage Approvals
               </button>
            </div>
         </div>

         <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-dark mb-6">Recent User Activity</h2>
            <div className="space-y-6">
               {[
                 { name: 'John Added a New Listing', time: '10 mins ago' },
                 { name: 'Sarah Updated a Listing', time: '1 hour ago' },
                 { name: 'Michael Registered as a seller', time: '2 days ago' },
               ].map((user, idx) => (
                 <div key={idx} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                       <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="user" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-dark">{user.name}</p>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.time}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
