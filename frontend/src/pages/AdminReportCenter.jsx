import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Flag, 
  Trash2, 
  UserX, 
  CheckCircle,
  MoreVertical,
  Search,
  MessageSquare,
  PackageX,
  UserCheck
} from 'lucide-react';
import api from '../services/api';

const AdminReportCenter = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalListings: 0,
    rejectedListings: 0,
    rejectedUsers: 0,
    pendingAction: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [listingsRes, usersRes] = await Promise.all([
        api.get('/listings/admin'),
        api.get('/auth/users')
      ]);

      if (listingsRes.data.success && usersRes.data.success) {
        const allListings = listingsRes.data.listings;
        const allUsers = usersRes.data.users;
        
        // Process rejected listings
        const rejectedItems = allListings.filter(l => l.status === 'rejected').map(l => ({
          id: `listing-${l.id}`,
          type: 'Listing',
          target: l.title,
          reason: 'Rejected during verification',
          reporter: l.owner?.name || 'Landlord',
          date: new Date(l.updatedAt).toLocaleDateString(),
          status: 'Rejected',
          originalId: l.id
        }));

        // Process rejected users / landlords
        const rejectedUsers = allUsers.filter(u => u.status === 'rejected').map(u => ({
          id: `user-${u.id}`,
          type: 'User Account',
          target: u.name,
          reason: 'Profile/ID verification rejected',
          reporter: 'Verification System',
          date: new Date(u.updatedAt).toLocaleDateString(),
          status: 'Rejected',
          originalId: u.id
        }));

        // Mock some other reports for UI purposes (as per previous mock)
        const mockReports = [
          { id: 1, type: 'Listing', target: 'Inappropriate Content #12', reason: 'Misleading information', reporter: 'Jane Doe', date: '2026-02-21', status: 'Pending' },
        ];

        setReports([...rejectedItems, ...rejectedUsers, ...mockReports]);
        
        setStats({
          totalListings: allListings.length,
          rejectedListings: rejectedItems.length,
          rejectedUsers: rejectedUsers.length,
          pendingAction: allListings.filter(l => l.status === 'pending').length + allUsers.filter(u => u.status === 'pending').length
        });
      }
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (reportId) => {
    alert('Action handled for ' + reportId);
  };

  const filteredReports = reports.filter(rep => 
    rep.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 text-[#1A2B4D]">
      <div>
        <h1 className="text-3xl font-black text-dark font-poppins mb-2">Report Center</h1>
        <p className="text-gray-500 font-medium tracking-tight">Review and moderate community reports and violations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-2">Total Listings</div>
              <div className="text-3xl font-black text-dark tracking-tighter">{stats.totalListings}</div>
          </div>
          <div className="p-6 rounded-2xl bg-orange-50 border border-orange-100">
              <div className="text-orange-600 font-black text-[10px] uppercase tracking-widest mb-2">Pending Verification</div>
              <div className="text-3xl font-black text-dark tracking-tighter">{stats.pendingAction}</div>
          </div>
          <div className="p-6 rounded-2xl bg-red-50 border border-red-100">
              <div className="text-red-600 font-black text-[10px] uppercase tracking-widest mb-2">Rejected Products</div>
              <div className="text-3xl font-black text-dark tracking-tighter">{stats.rejectedListings}</div>
          </div>
          <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
              <div className="text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-2">Rejected Users</div>
              <div className="text-3xl font-black text-dark tracking-tighter">{stats.rejectedUsers}</div>
          </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="relative flex-grow max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search reports/rejections..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-primary/30 transition-all font-medium text-sm"
              />
           </div>
           <div className="flex gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-5 py-3 rounded-xl border border-gray-100 font-bold text-xs text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all">All Objects</button>
              <button className="flex-1 md:flex-none px-5 py-3 rounded-xl border border-gray-100 font-bold text-xs text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all">Urgent Only</button>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left min-w-[800px]">
              <thead>
                 <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Issue / Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Moderation</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {loading ? (
                   <tr><td colSpan="4" className="py-20 text-center font-bold text-gray-400">Loading moderation data...</td></tr>
                 ) : filteredReports.length === 0 ? (
                    <tr><td colSpan="4" className="py-20 text-center font-bold text-gray-400">No reports or rejected items to review.</td></tr>
                 ) : filteredReports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-gray-50/30 transition-colors group">
                       <td className="px-8 py-6">
                          <div>
                             <div className="font-bold text-dark">{rep.target}</div>
                             <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                                {rep.reporter ? `Reported by ${rep.reporter}` : 'System Rejection'} • {rep.date}
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            rep.type.includes('User') ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                             {rep.type}
                          </span>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex flex-col">
                             <div className="text-sm font-medium text-gray-500 max-w-xs">{rep.reason}</div>
                             <span className={`text-[9px] font-bold uppercase mt-1 ${rep.status === 'Rejected' ? 'text-orange-500' : 'text-red-500'}`}>{rep.status}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center justify-end gap-3">
                             <button onClick={() => handleAction(rep.id)} className="flex items-center gap-2 px-4 py-2 bg-dark text-white rounded-lg transition-all text-[10px] font-black uppercase hover:opacity-90">
                                <UserX size={14} />
                                <span>Ban</span>
                             </button>
                             <button onClick={() => handleAction(rep.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg transition-all text-[10px] font-black uppercase shadow-lg shadow-red-500/20 hover:opacity-90">
                                <Trash2 size={14} />
                                <span>Delete Content</span>
                             </button>
                             <button onClick={() => fetchData()} className="p-2 text-gray-400 hover:text-green-500 transition-colors" title="Check again">
                                <CheckCircle size={18} />
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReportCenter;
