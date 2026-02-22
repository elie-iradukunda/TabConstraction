import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useListingStore } from '../store/listingStore';
import MainLayout from '../layouts/MainLayout';
import ListingCard from '../components/ListingCard';

// ─── Filter Panel (defined OUTSIDE to prevent remount on each keystroke) ───
const FilterPanel = ({ filters, setFilters, onApply, onClear }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-black text-dark text-lg">Filters</h3>
      {Object.values(filters).some(Boolean) && (
        <button onClick={onClear} className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
          <X size={14} /> Clear all
        </button>
      )}
    </div>

    <div className="space-y-5">
      {/* Search */}
      <div>
        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Keyword</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            name="search"
            placeholder="Search listings..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Category</label>
        <select
          name="category"
          value={filters.category}
          onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white text-sm font-medium"
        >
          <option value="">All Categories</option>
          <option value="house">🏠 House / Property</option>
          <option value="land">🌿 Land / Plot</option>
          <option value="material">🔧 Materials</option>
        </select>
      </div>

      {/* Type */}
      <div>
        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Listing Type</label>
        <div className="grid grid-cols-3 gap-2">
          {[{ v: '', l: 'All' }, { v: 'sale', l: 'For Sale' }, { v: 'rent', l: 'For Rent' }].map(opt => (
            <button
              key={opt.v}
              type="button"
              onClick={() => setFilters(f => ({ ...f, type: opt.v }))}
              className={`py-2 rounded-xl text-xs font-black border-2 transition-all ${
                filters.type === opt.v
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 text-gray-500 hover:border-primary/30'
              }`}
            >
              {opt.l}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Location</label>
        <input
          type="text"
          name="location"
          placeholder="e.g. Kigali, Rwamagana..."
          value={filters.location}
          onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
        />
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Price Range ($)</label>
        <div className="flex gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            value={filters.minPrice}
            onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
            className="w-1/2 px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
            className="w-1/2 px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
          />
        </div>
      </div>

      <button onClick={onApply} className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 font-black text-sm">
        <Search size={16} /> Apply Filters
      </button>
    </div>
  </div>
);

// ─── Main Page ───
const ListingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { listings, loading, fetchListings } = useListingStore();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '', type: '', minPrice: '', maxPrice: '', location: '', search: ''
  });

  // Sync filters from URL on load / URL change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlFilters = {
      category: params.get('category') || '',
      type:     params.get('type') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      location: params.get('location') || '',
      search:   params.get('search') || '',
    };
    setFilters(urlFilters);
    fetchListings(urlFilters);
  }, [location.search]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    navigate(`/listings?${params.toString()}`);
    setShowFilters(false);
  };

  const clearFilters = () => navigate('/listings');

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const pageTitle =
    filters.type === 'sale' && !filters.category ? 'Properties for Sale' :
    filters.type === 'rent' && !filters.category ? 'Properties for Rent' :
    filters.category ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} Listings` :
    'All Listings';

  return (
    <MainLayout>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-4 md:py-6 sticky top-16 md:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-dark font-poppins">{pageTitle}</h1>
              <p className="text-gray-500 text-sm font-medium mt-0.5">
                {loading ? 'Searching...' : `${listings.length} result${listings.length !== 1 ? 's' : ''} found`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="hidden sm:flex items-center gap-1.5 text-xs font-black text-red-500 bg-red-50 px-3 py-2 rounded-xl hover:bg-red-100 transition-colors">
                  <X size={12} /> Clear filters
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 btn-outline px-4 py-2.5 text-sm font-bold rounded-xl relative"
              >
                <SlidersHorizontal size={16} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-black text-lg text-dark">Filter Listings</h2>
              <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <FilterPanel filters={filters} setFilters={setFilters} onApply={applyFilters} onClear={clearFilters} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="sticky top-36">
              <FilterPanel filters={filters} setFilters={setFilters} onApply={applyFilters} onClear={clearFilters} />
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Loading listings...</p>
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                  We couldn't find any results matching your criteria. Try adjusting your search.
                </p>
                <button onClick={clearFilters} className="btn-primary px-8 py-3 rounded-xl">Clear all filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ListingsPage;
