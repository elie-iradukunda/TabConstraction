import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Search,
  Activity,
  AlertTriangle,
  Mail,
  MapPin,
  Tag
} from 'lucide-react';
import { listingService } from '../services/listingService';

const AdminListingApproval = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
      if (!window.confirm(`Are you sure you want to ${status === 'active' ? 'approve' : 'reject'} this listing?`)) return;
      await listingService.updateListingStatus(id, status);
      setListings(listings.map(l => l.id === id ? { ...l, status } : l));
      setSelectedListing(null);
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const pendingListings = listings.filter(l => l.status === 'pending');
  const filteredPending = pendingListings.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-dark font-poppins mb-1">Listing Approval System</h1>
        <p className="text-gray-500 font-medium text-sm md:text-base">Verify and approve new submissions to keep the marketplace safe.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex flex-col justify-center">
           <div className="flex items-center gap-3 text-orange-600 mb-2">
              <AlertTriangle size={20} />
              <span className="font-bold uppercase text-[10px] tracking-widest">Pending Review</span>
           </div>
           <h3 className="text-3xl font-black text-dark">{pendingListings.length}</h3>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col justify-center">
           <div className="flex items-center gap-3 text-blue-600 mb-2">
              <Activity size={20} />
              <span className="font-bold uppercase text-[10px] tracking-widest">In System</span>
           </div>
           <h3 className="text-3xl font-black text-dark">{listings.length}</h3>
        </div>
      </div>

      <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden text-[#1A2B4D]">
        <div className="p-4 md:p-8 border-b border-gray-50 flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search submissions..." 
                className="w-full pl-12 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-primary/30 transition-all font-medium text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
        </div>

        {/* ── Mobile View ── */}
        <div className="md:hidden divide-y divide-gray-50">
           {loading ? (
             <div className="p-10 text-center text-gray-400 font-bold">Loading...</div>
           ) : filteredPending.length === 0 ? (
             <div className="p-10 text-center text-gray-400 font-bold">No pending listings found.</div>
           ) : (
             filteredPending.map((lst) => (
               <div key={lst.id} className="p-4 space-y-4">
                  <div>
                    <div className="font-black text-dark text-base">{lst.title}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-bold text-primary">${parseFloat(lst.price).toLocaleString()}</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded-md text-[9px] font-black uppercase text-gray-500">{lst.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-y border-gray-50">
                     <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-600">{lst.owner?.name || 'User'}</span>
                        <span className="text-[10px] text-gray-400 font-medium truncate max-w-[150px]">{lst.owner?.email}</span>
                     </div>
                     <button 
                       onClick={() => setSelectedListing(lst)}
                       className="p-2 bg-primary/5 text-primary rounded-xl"
                     >
                       <Eye size={18} />
                     </button>
                  </div>
                  <div className="flex gap-2">
                     <button 
                       onClick={() => handleStatusUpdate(lst.id, 'active')}
                       className="flex-1 bg-green-500 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/10"
                     >Approve</button>
                     <button 
                       onClick={() => handleStatusUpdate(lst.id, 'rejected')}
                       className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/10"
                     >Reject</button>
                  </div>
               </div>
             ))
           )}
        </div>

        {/* ── Desktop View ── */}
        <div className="hidden md:block overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Listing Details</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Submitted By</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Verification</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {filteredPending.map((lst) => (
                   <tr key={lst.id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-8 py-6">
                         <div>
                            <div className="font-black text-dark text-[15px]">{lst.title}</div>
                            <div className="text-xs text-primary font-bold mt-1">${parseFloat(lst.price).toLocaleString()}</div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex flex-col">
                            <span className="font-bold text-gray-600">{lst.owner?.name || 'Unknown'}</span>
                            <span className="text-[10px] text-gray-400 font-medium">{lst.owner?.email}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black uppercase text-gray-500 tracking-tighter">
                            {lst.category}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex items-center justify-end gap-3 md:opacity-0 group-hover:opacity-100 transition-opacity">
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
                            <button 
                              onClick={() => setSelectedListing(lst)}
                              className="p-2 text-gray-400 hover:text-primary transition-colors"
                            >
                               <Eye size={18} />
                            </button>
                         </div>
                      </td>
                   </tr>
                 ))}
                 {!loading && filteredPending.length === 0 && (
                   <tr>
                     <td colSpan="4" className="py-20 text-center text-gray-400 font-bold">No pending listings to review.</td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/60 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl md:rounded-[2.5rem] shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-3xl">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-dark font-poppins">Submission Review</h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Listing ID: {selectedListing.id.split('-')[0]}</p>
              </div>
              <button 
                onClick={() => setSelectedListing(null)}
                className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-bold"
              >✕</button>
            </div>

            <div className="p-6 md:p-8 space-y-6 md:space-y-8">
              {/* Media Gallery */}
              <div>
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Tag size={12} /> Submission Photos</h3>
                 <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4 font-poppins">
                    {selectedListing.images && selectedListing.images.length > 0 ? selectedListing.images.map((img, i) => (
                      <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-transform hover:scale-105 cursor-pointer">
                         <img src={img.imageUrl.startsWith('http') ? img.imageUrl : `http://localhost:5000${img.imageUrl}`} alt="property" className="w-full h-full object-cover" />
                      </div>
                    )) : (
                      <div className="col-span-full py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400 font-bold text-xs uppercase tracking-widest">
                         No images for this listing.
                      </div>
                    )}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                {/* Product Detail Card */}
                <div className="space-y-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-50">
                   <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Property Specification</h3>
                   <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-300 uppercase mb-1">Title</p>
                        <p className="text-lg font-black text-dark leading-snug">{selectedListing.title}</p>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <div className="min-w-[100px]">
                           <p className="text-[10px] font-black text-gray-300 uppercase mb-1">Pricing</p>
                           <p className="text-xl font-black text-primary">${parseFloat(selectedListing.price).toLocaleString()}</p>
                        </div>
                        <div className="flex-1">
                           <p className="text-[10px] font-black text-gray-300 uppercase mb-1">Location</p>
                           <div className="flex items-start gap-1 font-bold text-gray-600 text-sm">
                              <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                              <span>{selectedListing.location}</span>
                           </div>
                        </div>
                      </div>
                      <div className="pt-2">
                        <p className="text-[10px] font-black text-gray-300 uppercase mb-1">Features Summary</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-[9px] font-black uppercase bg-white border border-gray-100 px-2.5 py-1 rounded-lg">{selectedListing.category}</span>
                            <span className="text-[9px] font-black uppercase bg-white border border-gray-100 px-2.5 py-1 rounded-lg">{selectedListing.type}</span>
                            <span className="text-[9px] font-black uppercase bg-white border border-gray-100 px-2.5 py-1 rounded-lg">{selectedListing.bedrooms} Bed</span>
                            <span className="text-[9px] font-black uppercase bg-white border border-gray-100 px-2.5 py-1 rounded-lg">{selectedListing.bathrooms} Bath</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-[10px] font-black text-gray-300 uppercase mb-2">Description Overview</p>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium line-clamp-6">{selectedListing.description}</p>
                      </div>
                   </div>
                </div>

                {/* Owner Information Card */}
                <div className="space-y-6">
                   <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Contributor Profile</h3>
                   <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary font-black text-2xl shadow-sm border border-primary/5">
                           {selectedListing.owner?.name?.charAt(0).toUpperCase() || '?'}
                         </div>
                         <div className="min-w-0">
                            <p className="text-lg font-black text-dark truncate leading-none">{selectedListing.owner?.name || 'Tabi User'}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Platform Partner</p>
                         </div>
                      </div>
                      <div className="space-y-3 pt-4 border-t border-primary/5">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm"><Mail size={16} /></div>
                           <span className="text-xs font-bold text-gray-600 truncate">{selectedListing.owner?.email}</span>
                         </div>
                      </div>
                   </div>

                   <div className="pt-8 space-y-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                          onClick={() => handleStatusUpdate(selectedListing.id, 'active')}
                          className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-500/10 hover:scale-[1.02] transition-all"
                        >APPROVE LISTING</button>
                        <button 
                          onClick={() => handleStatusUpdate(selectedListing.id, 'rejected')}
                          className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/10 hover:scale-[1.02] transition-all"
                        >REJECT SUBMISSION</button>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminListingApproval;
