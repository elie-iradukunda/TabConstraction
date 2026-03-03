import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Layers, Hammer, MapPin, ChevronRight, Sparkles, Bed, Bath, Building2, Tag } from 'lucide-react';
import { useListingStore } from '../store/listingStore';
import { useAuthStore } from '../store/authStore';
import { BACKEND_URL } from '../services/api';
import MainLayout from '../layouts/MainLayout';
import ListingCard from '../components/ListingCard';

const HomePage = () => {
  const navigate = useNavigate();
  const { listings, fetchListings } = useListingStore();
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchListings({ limit: 8 });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/listings?search=${searchQuery}`);
  };

  // Get all listing images for the hero carousel
  const getImageUrl = (imgObj) => {
    if (!imgObj?.imageUrl) return null;
    return imgObj.imageUrl.startsWith('http') ? imgObj.imageUrl : `${BACKEND_URL}${imgObj.imageUrl}`;
  };

  const heroImages = listings
    ?.flatMap(l => (l.images || []).map(img => ({ url: getImageUrl(img), title: l.title, location: l.location, price: l.price })))
    .filter(img => img.url)
    .slice(0, 6) || [];

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // Pick the first listing as the "recommended" one
  const recommendedListing = listings?.[0] || null;
  const getListingImage = (listing) => {
    if (!listing?.images || listing.images.length === 0) return null;
    const url = listing.images[0].imageUrl;
    return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
  };

  return (
    <MainLayout>
      {/* Hero Section with animated listing images */}
      <section className="relative h-[540px] flex items-center justify-center overflow-hidden">
        {/* Animated Background Images */}
        <div className="absolute inset-0 z-0">
          {heroImages.length > 0 ? (
            <>
              {heroImages.map((img, idx) => (
                <div
                  key={idx}
                  className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
                  style={{ opacity: idx === currentSlide ? 1 : 0 }}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover scale-105"
                    style={{
                      animation: idx === currentSlide ? 'heroZoom 8s ease-in-out infinite alternate' : 'none'
                    }}
                  />
                </div>
              ))}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
              <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>
          )}
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        {/* Slide indicators */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentSlide ? 'w-8 bg-white' : 'w-3 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Current slide info */}
        {heroImages.length > 0 && heroImages[currentSlide] && (
          <div className="absolute bottom-6 right-6 z-20 bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 hidden md:block">
            <div className="text-white/90 text-xs font-bold truncate max-w-[200px]">{heroImages[currentSlide].title}</div>
            <div className="text-white/50 text-[10px] flex items-center gap-1">
              <MapPin size={10} /> {heroImages[currentSlide].location}
            </div>
          </div>
        )}

        <div className="relative z-10 w-full max-w-5xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full mb-6 border border-white/10">
            <Building2 size={16} className="text-primary" />
            <span className="text-white/80 text-sm font-bold">Rwanda's #1 Real Estate & Construction Platform</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight drop-shadow-lg">
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

      {/* Recommendations Section — uses REAL listing data */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black text-dark mb-4 tracking-tight font-poppins">
                Find Your <span className="text-primary">Perfect Home</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 font-medium leading-relaxed">
                {isAuthenticated 
                  ? "Continue your journey from your dashboard. Browse new listings, manage your bookings, and more." 
                  : "Sign in for a more personalized experience. Get recommendations based on your preferences."}
              </p>
              <button 
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')} 
                className="btn-outline border-primary px-10 rounded-md py-4 text-primary font-bold"
              >
                {isAuthenticated ? 'Visit Dashboard' : 'Sign in'}
              </button>
            </div>
            
            <div className="relative">
              {/* Show a REAL listing card */}
              <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-3xl transition-shadow"
                onClick={() => recommendedListing && navigate(`/listings/${recommendedListing.id}`)}>
                
                <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {recommendedListing && getListingImage(recommendedListing) ? (
                    <img 
                      src={getListingImage(recommendedListing)} 
                      alt={recommendedListing.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-blue-50">
                      <Home size={48} className="text-primary/30" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {recommendedListing ? (
                    <>
                      <div className="text-2xl font-black text-dark">
                        {Number(recommendedListing.price).toLocaleString()} RWF
                        {recommendedListing.type === 'rent' && <span className="text-sm font-bold text-gray-400">/mo</span>}
                      </div>
                      <div className="text-gray-500 font-medium mt-1">
                        {recommendedListing.category === 'house' && (
                          <>{recommendedListing.bedrooms} bd | {recommendedListing.bathrooms} ba | </>
                        )}
                        {recommendedListing.size && `${recommendedListing.size} — `}
                        {recommendedListing.propertyType || recommendedListing.category} for {recommendedListing.type}
                      </div>
                      <div className="text-gray-400 text-sm mt-1 flex items-center gap-1">
                        <MapPin size={14} />
                        {recommendedListing.location}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-black text-dark">Browse Listings</div>
                      <div className="text-gray-500 font-medium">Explore houses, land, and materials near you</div>
                    </>
                  )}
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

          {listings?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {listings?.slice(0, 4).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
              <Home size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-dark mb-2">No Listings Yet</h3>
              <p className="text-gray-400 mb-6">Be the first to add a property or material!</p>
              <button onClick={() => navigate(isAuthenticated ? '/dashboard/add-listing' : '/register')} 
                className="btn-primary px-8 py-3 rounded-xl">
                {isAuthenticated ? 'Add Listing' : 'Get Started'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Construction Materials Section */}
      {(() => {
        const materialListing = listings?.find(l => l.category === 'material');
        const materialImage = materialListing && getListingImage(materialListing);
        return (
          <section className="py-24 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center gap-16">
                <div className="md:w-1/2 rounded-3xl overflow-hidden shadow-2xl h-[400px] relative group cursor-pointer"
                  onClick={() => materialListing && navigate(`/listings/${materialListing.id}`)}>
                  {materialImage ? (
                    <>
                      <img 
                        src={materialImage} 
                        alt={materialListing.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Material</span>
                        <h3 className="text-xl font-black text-white mt-2 drop-shadow-lg">{materialListing.title}</h3>
                        <p className="text-white/70 text-sm font-medium flex items-center gap-1 mt-1">
                          <MapPin size={12} /> {materialListing.location}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                      <div className="text-center p-12">
                        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6">
                          <Hammer size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-dark mb-2">Quality Materials</h3>
                        <p className="text-gray-500 font-medium">Cement • Steel • Bricks • Tiles • Sand</p>
                      </div>
                    </div>
                  )}
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
        );
      })()}

      {/* CSS animation for hero zoom */}
      <style>{`
        @keyframes heroZoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
      `}</style>
    </MainLayout>
  );
};

export default HomePage;
