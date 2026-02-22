import React, { useEffect } from 'react';
import { useListingStore } from '../store/listingStore';
import { Edit, Trash2, ExternalLink, Plus, Package, MapPin, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusStyle = (status) => ({
  active:   'bg-green-100 text-green-700',
  pending:  'bg-orange-100 text-orange-700',
  rejected: 'bg-red-100 text-red-700',
})[status] || 'bg-gray-100 text-gray-500';

const MyListings = ({ adminView = false }) => {
  const { myListings, listings, loading, fetchMyListings, fetchListings, deleteListing } = useListingStore();

  useEffect(() => {
    adminView ? fetchListings() : fetchMyListings();
  }, [adminView]);

  const displayListings = adminView ? listings : myListings;

  const handleDelete = async (id) => {
    if (window.confirm('Delete this listing? This cannot be undone.')) {
      try { await deleteListing(id); }
      catch { alert('Failed to delete listing'); }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-dark font-poppins mb-1">
            {adminView ? 'All Platform Listings' : 'My Listings'}
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            {adminView ? 'Monitor every listing on the platform.' : 'Manage and monitor your posted properties.'}
          </p>
        </div>
        {!adminView && (
          <Link to="/dashboard/add-listing" className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap self-start sm:self-auto">
            <Plus size={18} />
            <span>Add New Listing</span>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-medium">Fetching listings...</p>
        </div>
      ) : displayListings.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm text-center py-24 px-8">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-gray-300" />
          </div>
          <p className="text-lg font-bold text-dark mb-2">No listings yet</p>
          <p className="text-gray-400 mb-8">Start selling your property or materials today!</p>
          <Link to="/dashboard/add-listing" className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-xl">
            <Plus size={18} /> Create First Listing
          </Link>
        </div>
      ) : (
        <>
          {/* ─── Mobile: Cards ─── */}
          <div className="md:hidden space-y-4">
            {displayListings.map(listing => (
              <div key={listing.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex gap-4 p-4">
                  <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                    <img
                      src={listing.images?.[0]?.imageUrl
                        ? (listing.images[0].imageUrl.startsWith('http') ? listing.images[0].imageUrl : `http://localhost:5000${listing.images[0].imageUrl}`)
                        : 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=150'}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/listings/${listing.id}`} className="font-black text-dark hover:text-primary text-base block truncate">
                      {listing.title}
                    </Link>
                    <div className="flex items-center gap-1 text-gray-400 text-xs font-medium mt-1">
                      <MapPin size={12} /> <span className="truncate">{listing.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-accent rounded-full text-[10px] font-black uppercase text-gray-500 tracking-widest">
                        {listing.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase capitalize ${statusStyle(listing.status)}`}>
                        {listing.status}
                      </span>
                    </div>
                    <div className="font-black text-dark font-poppins text-base mt-1">
                      ${Number(listing.price).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 pb-4">
                  <Link to={`/listings/${listing.id}`} className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-black text-gray-500 bg-gray-50 hover:bg-primary/5 hover:text-primary rounded-xl transition-all">
                    <ExternalLink size={14} /> View
                  </Link>
                  <Link to={`/dashboard/edit-listing/${listing.id}`} className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-black text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all">
                    <Edit size={14} /> Edit
                  </Link>
                  <button onClick={() => handleDelete(listing.id)} className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-black text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ─── Desktop: Table ─── */}
          <div className="hidden md:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-accent/50 border-b border-gray-100">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Property</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-accent/20 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 shadow-sm">
                            <img
                              src={listing.images?.[0]?.imageUrl
                                ? (listing.images[0].imageUrl.startsWith('http') ? listing.images[0].imageUrl : `http://localhost:5000${listing.images[0].imageUrl}`)
                                : 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=150'}
                              alt={listing.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div>
                            <Link to={`/listings/${listing.id}`} className="font-bold text-dark hover:text-primary transition-colors block mb-1">
                              {listing.title}
                            </Link>
                            <p className="text-xs text-gray-400 font-medium">{listing.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-accent rounded-full text-[10px] font-black uppercase text-gray-500 tracking-widest">
                          {listing.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-black text-dark font-poppins">${Number(listing.price).toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase capitalize ${statusStyle(listing.status)}`}>
                          {listing.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/listings/${listing.id}`} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="View">
                            <ExternalLink size={18} />
                          </Link>
                          <Link to={`/dashboard/edit-listing/${listing.id}`} className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all" title="Edit">
                            <Edit size={18} />
                          </Link>
                          <button onClick={() => handleDelete(listing.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyListings;
