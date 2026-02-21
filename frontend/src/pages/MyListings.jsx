import React, { useEffect } from 'react';
import { useListingStore } from '../store/listingStore';
import { Edit, Trash2, ExternalLink, Plus, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyListings = ({ adminView = false }) => {
  const { myListings, listings, loading, fetchMyListings, fetchListings, deleteListing } = useListingStore();

  useEffect(() => {
    if (adminView) {
      fetchListings();
    } else {
      fetchMyListings();
    }
  }, [adminView]);

  const displayListings = adminView ? listings : myListings;

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      try {
        await deleteListing(id);
      } catch (err) {
        alert('Failed to delete listing');
      }
    }
  };

  return (
    <div>
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-dark font-poppins mb-2">{adminView ? 'All Platform Listings' : 'My Listings'}</h1>
          <p className="text-gray-500 font-medium">{adminView ? 'Monitor and manage every listing published on the platform.' : 'Manage and monitor the performance of your posted properties.'}</p>
        </div>
        {!adminView && (
          <Link to="/dashboard/add-listing" className="btn-primary flex items-center gap-2 px-8">
            <Plus size={20} />
            <span>Add New Listing</span>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
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
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 font-medium">Fetching listings...</p>
                  </td>
                </tr>
              ) : displayListings.length > 0 ? (
                displayListings.map((listing) => (
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
                      <span className="px-3 py-1 bg-accent rounded-full text-[10px] font-black uppercase text-gray-500 tracking-widest leading-none">
                        {listing.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-dark font-poppins">${Number(listing.price).toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm font-bold text-gray-600">Active</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/listings/${listing.id}`} 
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          title="View Publicly"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all" title="Edit Listing">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(listing.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" 
                          title="Delete Listing"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-32 text-center text-gray-400">
                    <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package size={32} className="text-gray-300" />
                    </div>
                    <p className="text-lg font-bold text-dark mb-2">No listings found</p>
                    <p className="mb-8">Start selling your property or materials today!</p>
                    <Link to="/dashboard/add-listing" className="btn-primary inline-flex">Create First Listing</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyListings;
