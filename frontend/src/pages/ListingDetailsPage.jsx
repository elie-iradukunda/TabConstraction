import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Move, Share2, Heart, Phone, Mail, User, ChevronLeft, ChevronRight, Calendar, Tag, ExternalLink } from 'lucide-react';
import { useListingStore } from '../store/listingStore';
import MainLayout from '../layouts/MainLayout';

const ListingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedListing, loading, fetchListingById } = useListingStore();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchListingById(id);
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium font-poppins text-lg">Loading property details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!selectedListing) {
    return (
      <MainLayout>
        <div className="text-center py-24">
          <h2 className="text-3xl font-bold mb-4">Listing not found</h2>
          <button onClick={() => navigate('/listings')} className="btn-primary">Browse Listings</button>
        </div>
      </MainLayout>
    );
  }

  const { title, price, location, description, type, category, bedrooms, bathrooms, size, images, owner, createdAt } = selectedListing;
  
  const allImages = images && images.length > 0 
    ? images.map(img => img.imageUrl.startsWith('http') ? img.imageUrl : `http://localhost:5000${img.imageUrl}`)
    : ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1200'];

  return (
    <MainLayout>
      <div className="bg-white border-b border-gray-100 py-6 mb-8 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-dark transition-colors font-medium">
              <ChevronLeft size={20} />
              <span>Back to results</span>
            </button>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 btn-outline rounded-xl px-6">
                <Share2 size={18} />
                <span>Share</span>
              </button>
              <button className="flex items-center gap-2 btn-outline rounded-xl px-6 hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                <Heart size={18} />
                <span>Favorite</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 relative aspect-video bg-gray-100 rounded-3xl overflow-hidden shadow-lg border border-gray-100">
            <img 
              src={allImages[activeImage]} 
              alt={title} 
              className="w-full h-full object-cover"
            />
            {allImages.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setActiveImage(activeImage === 0 ? allImages.length - 1 : activeImage - 1)}
                  className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-dark hover:bg-white shadow-lg transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => setActiveImage(activeImage === allImages.length - 1 ? 0 : activeImage + 1)}
                  className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-dark hover:bg-white shadow-lg transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[500px] pb-2 lg:pb-0 scrollbar-hide">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`relative flex-shrink-0 w-24 lg:w-full aspect-video rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black text-white ${type === 'sale' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                  FOR {type.toUpperCase()}
                </span>
                <span className="px-4 py-1.5 rounded-full text-xs font-black text-dark bg-accent">
                  {category.toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-dark font-poppins mb-4 leading-tight">{title}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-4 justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-primary flex-shrink-0" />
                  <span className="text-base font-medium text-gray-500">{location}</span>
                </div>
                <div>
                  {selectedListing.mapLink ? (
                    <a
                      href={selectedListing.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-black text-white bg-green-500 hover:bg-green-600 transition-colors uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-md shadow-green-500/20"
                    >
                      <ExternalLink size={12} />
                      <span>📍 Exact Location</span>
                    </a>
                  ) : (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location + ', Rwanda')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-black text-primary hover:text-dark transition-colors uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-lg"
                    >
                      <ExternalLink size={12} />
                      <span>View on Map</span>
                    </a>
                  )}
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-primary font-poppins">${Number(price).toLocaleString()}</div>
            </div>

            {/* Quick Stats */}
            {category === 'house' && (
              <div className="grid grid-cols-3 gap-6 p-8 bg-accent/30 rounded-3xl border border-gray-100 mb-12">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary mx-auto mb-3 shadow-sm">
                    <Bed size={24} />
                  </div>
                  <div className="text-lg font-bold text-dark">{bedrooms}</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary mx-auto mb-3 shadow-sm">
                    <Bath size={24} />
                  </div>
                  <div className="text-lg font-bold text-dark">{bathrooms}</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary mx-auto mb-3 shadow-sm">
                    <Move size={24} />
                  </div>
                  <div className="text-lg font-bold text-dark">{size}</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Area</div>
                </div>
              </div>
            )}

            {category !== 'house' && size && (
                <div className="flex items-center gap-6 p-8 bg-accent/30 rounded-3xl border border-gray-100 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                            <Tag size={24} />
                        </div>
                        <div>
                            <div className="text-lg font-bold text-dark">{size}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Size Specification</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Description */}
            <div className="mb-12">
              <h3 className="text-2xl font-black text-dark font-poppins mb-6 pb-2 border-b-2 border-primary w-fit">Description</h3>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Features (Dynamic from DB) */}
            {(() => {
              let featuresList = selectedListing.features;
              if (typeof featuresList === 'string') {
                try { featuresList = JSON.parse(featuresList); } catch { featuresList = []; }
              }
              return featuresList && Array.isArray(featuresList) && featuresList.length > 0 ? (
                <div>
                  <h3 className="text-2xl font-black text-dark font-poppins mb-6 pb-2 border-b-2 border-primary w-fit">Property Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {featuresList.map(feature => (
                      <div key={feature} className="flex items-center gap-3 text-gray-700 font-medium">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}
          </div>

          {/* Contact & Owner */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-40 bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl">
              <h3 className="text-xl font-black text-dark mb-8 font-poppins">Listing Owner</h3>
              
              <div className="flex items-center gap-5 mb-10 pb-10 border-b border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <User size={32} />
                </div>
                <div>
                  <div className="text-xl font-bold text-dark">{owner?.name || 'Vannisa Real Estate'}</div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Verified Agent</div>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <a 
                  href={`tel:${owner?.phone || '+250788000000'}`}
                  className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-3 group"
                >
                  <Phone size={20} className="group-hover:rotate-12 transition-transform" />
                  <span className="text-lg font-bold">{owner?.phone || '+250 788 000 000'}</span>
                </a>
                <a 
                  href={`mailto:${owner?.email || 'sales@tabiconst.com'}?subject=Inquiry about ${encodeURIComponent(title)}`}
                  className="w-full btn-outline py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-primary/5 hover:border-primary/30 group"
                >
                  <Mail size={20} className="group-hover:translate-x-1 transition-transform" />
                  <span className="text-lg font-bold">Send Email</span>
                </a>
              </div>

              <div className="p-6 bg-accent/50 rounded-2xl">
                <div className="flex items-center gap-3 text-gray-600 text-sm font-bold mb-4">
                  <Calendar size={18} className="text-gray-400" />
                  <span>Posted on {new Date(createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-xs text-gray-400 leading-relaxed">
                  Mention TabiConst when calling to get the best experience and verify property details.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
};

export default ListingDetailsPage;
