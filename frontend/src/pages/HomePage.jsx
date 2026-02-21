import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Layers, Hammer, MapPin, ChevronRight, Sparkles } from 'lucide-react';
import { useListingStore } from '../store/listingStore';
import MainLayout from '../layouts/MainLayout';
import ListingCard from '../components/ListingCard';

const HomePage = () => {
  const navigate = useNavigate();
  const { listings, fetchListings } = useListingStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchListings({ limit: 4 });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/listings?search=${searchQuery}`);
  };

  return (
    <MainLayout>
      {/* Zillow-Style Hero Section */}
      <section className="relative h-[540px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=2000" 
            alt="Beautiful Home" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight drop-shadow-md">
            Rentals. Homes. <br className="md:hidden" /> Materials. Agents.
          </h1>
          
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
            <input 
              type="text" 
              placeholder="Enter an address, neighborhood, city, or ZIP code" 
              className="w-full py-5 px-6 pr-16 bg-white rounded-md shadow-2xl text-lg outline-none border-0 focus:ring-2 focus:ring-primary/50 transition-all font-medium placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform p-2">
              <Search size={28} strokeWidth={3} />
            </button>
          </form>
        </div>
      </section>

      {/* Recommendations Section (Zillow-like Style) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black text-dark mb-4 leading-tight">Get home recommendations</h2>
              <p className="text-lg text-gray-600 mb-8 font-medium">Sign in for a more personalized experience.</p>
              <button onClick={() => navigate('/login')} className="btn-outline border-primary px-10 rounded-md py-4 text-primary font-bold">
                Sign in
              </button>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6199fbfd0b?auto=format&fit=crop&q=80&w=1000" 
                  alt="Modern Home" 
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <div className="text-2xl font-black text-dark">$695,000</div>
                  <div className="text-gray-500 font-medium">4 bd | 3 ba | 2,132 sqft - House for sale</div>
                  <div className="text-gray-400 text-sm mt-1">2106 Lakeview Ct, Mahomet, IL 61853</div>
                </div>
              </div>
              
              {/* Floating Recommendations Badges */}
              <div className="absolute -top-10 -right-6 bg-white rounded-full shadow-xl p-3 border border-gray-100 flex items-center gap-3 pr-6 animate-bounce-slow">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Sparkles size={18} />
                </div>
                <div>
                   <div className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Recommended homes</div>
                   <div className="text-xs font-bold text-dark">Based on your monthly budget</div>
                </div>
              </div>

              <div className="absolute top-20 -left-12 bg-white rounded-full shadow-xl p-3 border border-gray-100 flex items-center gap-3 pr-6 animate-pulse-slow">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                  <MapPin size={18} />
                </div>
                <div>
                   <div className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Recommended homes</div>
                   <div className="text-xs font-bold text-dark">Based on your preferred location</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings (Clean Grid) */}
      <section className="pb-24 bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-2xl font-black text-dark font-poppins">Featured Properties</h2>
              <div className="w-12 h-1 bg-primary mt-2"></div>
            </div>
            <button onClick={() => navigate('/listings')} className="text-primary font-bold flex items-center gap-1 hover:underline text-sm uppercase tracking-widest">
              View All <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Construction Materials Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1000" 
                alt="Materials" 
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <Hammer size={24} />
              </div>
              <h2 className="text-4xl font-black text-dark mb-6 tracking-tight">Everything for your <span className="text-primary">Construction</span> needs</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                From cement and steel to tiles and decor. Find the best quality materials at competitive prices from verified suppliers across the country.
              </p>
              <button 
                onClick={() => navigate('/listings?category=material')}
                className="btn-primary px-10 py-4 rounded-md shadow-lg shadow-primary/20"
              >
                Browse Materials
              </button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
