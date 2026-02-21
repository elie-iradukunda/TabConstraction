import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Filter, Search, X } from 'lucide-react';
import { useListingStore } from '../store/listingStore';
import MainLayout from '../layouts/MainLayout';
import ListingCard from '../components/ListingCard';

const ListingsPage = () => {
  const location = useLocation();
  const { listings, loading, fetchListings } = useListingStore();
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    search: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters = {
      category: params.get('category') || '',
      type: params.get('type') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      location: params.get('location') || '',
      search: params.get('search') || ''
    };
    setFilters(newFilters);
    fetchListings(newFilters);
  }, [location.search]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchListings(filters);
    if (window.innerWidth < 768) setShowFilters(false);
  };

  const clearFilters = () => {
    const empty = { category: '', type: '', minPrice: '', maxPrice: '', location: '', search: '' };
    setFilters(empty);
    fetchListings(empty);
  };

  return (
    <MainLayout>
      <div className="bg-accent/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-dark font-poppins">Search Properties</h1>
              <p className="text-gray-500 mt-2">Found {listings.length} listings for you</p>
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 btn-outline"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Filters</h3>
                <button onClick={clearFilters} className="text-primary text-sm font-semibold hover:underline">Clear all</button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Keyword</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      name="search"
                      placeholder="Search..." 
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                      value={filters.search}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select 
                    name="category"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                    value={filters.category}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Categories</option>
                    <option value="house">House</option>
                    <option value="land">Land</option>
                    <option value="material">Material</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Listing Type</label>
                  <select 
                    name="type"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                    value={filters.type}
                    onChange={handleFilterChange}
                  >
                    <option value="">Any Type</option>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                  <input 
                    type="text" 
                    name="location"
                    placeholder="City, State..." 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                    value={filters.location}
                    onChange={handleFilterChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      name="minPrice"
                      placeholder="Min" 
                      className="w-1/2 px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                    />
                    <input 
                      type="number" 
                      name="maxPrice"
                      placeholder="Max" 
                      className="w-1/2 px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>

                <button 
                  onClick={applyFilters}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Listing Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Loading listings...</p>
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">No listings found</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">We couldn't find any results matching your filters. Try adjusting your search criteria.</p>
                <button onClick={clearFilters} className="btn-primary">Clear all filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ListingsPage;
