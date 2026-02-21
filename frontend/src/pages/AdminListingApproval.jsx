import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Eye, 
  Filter, 
  Search,
  MoreVertical,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { listingService } from '../services/listingService';

const AdminListingApproval = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const data = await listingService.getAdminListings();
      if (data.success) {
        setListings(data.listings);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await listingService.updateListingStatus(id, status);
      setListings(listings.map(l => l.id === id ? { ...l, status } : l));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const pendingListings = listings.filter(l => l.status === 'pending');
  const reviewedToday = listings.filter(l => l.status !== 'pending').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-dark font-poppins mb-2">Listing Approval System</h1>
        <p className="text-gray-500 font-medium">Verify and approve new submissions to keep the marketplace safe.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
           <div className="flex items-center gap-3 text-orange-600 mb-2">
              <AlertTriangle size={20} />
              <span className="font-bold uppercase text-xs tracking-widest">Pending Review</span>
           </div>
           <h3 className="text-3xl font-black text-dark">{pendingListings.length}</h3>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
           <div className="flex items-center gap-3 text-blue-600 mb-2">
              <Activity size={20} />
              <span className="font-bold uppercase text-xs tracking-widest">Reviewed Today</span>
           </div>
           <h3 className="text-3xl font-black text-dark">24</h3>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden text-[#1A2B4D]">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search submissions..." 
                  className="pl-12 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-primary/30 transition-all font-medium text-sm w-80"
                />
              </div>
              <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors">
                 <Filter size={18} />
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Listing Details</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Submitted By</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-5 text-[10px) font-black text-gray-400 uppercase tracking-widest text-right">Verification</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {pendingListings.map((lst) => (
                   <tr key={lst.id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-8 py-6">
                         <div>
                            <div className="font-black text-dark text-[15px]">{lst.title}</div>
                            <div className="text-xs text-primary font-bold mt-1">${parseFloat(lst.price).toLocaleString()}</div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-600">{lst.owner?.name || 'Unknown'}</span>
                            <ExternalLink size={12} className="text-gray-300" />
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black uppercase text-gray-500 tracking-tighter">
                            {lst.category}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center justify-end gap-3">
                            <button 
                              onClick={() => handleStatusUpdate(lst.id, 'active')}
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all shadow-lg shadow-green-500/20"
                            >
                               <CheckCircle size={14} />
                               <span className="text-[10px] font-black uppercase">Approve</span>
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(lst.id, 'rejected')}
                              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all shadow-lg shadow-red-500/20"
                            >
                               <XCircle size={14} />
                               <span className="text-[10px] font-black uppercase">Reject</span>
                            </button>
                            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                               <Eye size={18} />
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

export default AdminListingApproval;
