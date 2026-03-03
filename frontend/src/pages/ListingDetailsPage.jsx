import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Move, Share2, Heart, Phone, Mail, User, ChevronLeft, ChevronRight, Calendar, Tag, ExternalLink, X, ShoppingCart, CheckCircle } from 'lucide-react';
import { useListingStore } from '../store/listingStore';
import { useAuthStore } from '../store/authStore';
import MainLayout from '../layouts/MainLayout';
import api, { BACKEND_URL } from '../services/api';

const ListingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedListing, loading, fetchListingById } = useListingStore();
  const { isAuthenticated } = useAuthStore();
  const [activeImage, setActiveImage] = useState(0);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({ visitationDate: '', visitationTime: '', message: '' });
  const [checkoutForm, setCheckoutForm] = useState({ quantity: 1, shippingAddress: '' });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchListingById(id);
  }, [id]);

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    
    if (!bookingForm.visitationDate || !bookingForm.visitationTime) {
      setErrorMessage('Please select a date and time for your visit');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/bookings', {
        listingId: id,
        visitationDate: bookingForm.visitationDate,
        visitationTime: bookingForm.visitationTime,
        message: bookingForm.message
      });
      setSuccessMessage('Visitation request sent successfully! The landlord will approve and contact you shortly.');
      setTimeout(() => { setShowBookingModal(false); setSuccessMessage(''); }, 3000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to request visitation. Make sure you are logged in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    if (!checkoutForm.shippingAddress) {
      setErrorMessage('Shipping address is required');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/orders', {
        listingId: id,
        quantity: checkoutForm.quantity,
        totalPrice: checkoutForm.quantity * Number(selectedListing.price),
        shippingAddress: checkoutForm.shippingAddress
      });
      setSuccessMessage('Order placed successfully!');
      setTimeout(() => { setShowCheckoutModal(false); setSuccessMessage(''); }, 3000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to place order. Make sure you are logged in.');
    } finally {
      setSubmitting(false);
    }
  };

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
    ? images.map(img => img.imageUrl.startsWith('http') ? img.imageUrl : `${BACKEND_URL}${img.imageUrl}`)
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
              <div className="text-3xl md:text-4xl font-black text-primary font-poppins">{Number(price).toLocaleString()} RWF</div>
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
                {category === 'house' && type === 'rent' && (
                  <button 
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login');
                      } else {
                        setShowBookingModal(true);
                      }
                    }}
                    className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/30 transition-all font-black"
                  >
                    <Calendar size={20} />
                    <span className="text-lg">Schedule a Visit</span>
                  </button>
                )}
                {category === 'material' && (
                  <button 
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login');
                      } else {
                        setShowCheckoutModal(true);
                      }
                    }}
                    className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-xl shadow-orange-500/30 transition-all font-black"
                  >
                    <ShoppingCart size={20} />
                    <span className="text-lg">Order Material</span>
                  </button>
                )}
                <a 
                  href={`tel:${owner?.phone || '+250788000000'}`}
                  className={`w-full ${(category === 'house' && type === 'rent') || category === 'material' ? 'btn-outline border-gray-200 text-gray-700' : 'btn-primary'} py-4 rounded-2xl flex items-center justify-center gap-3 group transition-colors`}
                >
                  <Phone size={20} className="group-hover:rotate-12 transition-transform" />
                  <span className="text-lg font-bold">{owner?.phone || '+250 788 000 000'}</span>
                </a>
                <a 
                  href={`mailto:${owner?.email || 'sales@tabiconst.com'}?subject=Inquiry about ${encodeURIComponent(title)}`}
                  className="w-full btn-outline py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-primary/5 hover:border-primary/30 group text-gray-700 border-gray-200"
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

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-black font-poppins text-dark">Schedule Visit</h3>
              <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-dark hover:bg-gray-100 p-2 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {successMessage ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-dark mb-2">Request Sent!</h4>
                  <p className="text-gray-500">{successMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleCreateBooking} className="space-y-4">
                  {errorMessage && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                      {errorMessage}
                    </div>
                  )}

                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-2 relative">
                    <h4 className="font-black text-dark text-[11px] mb-4 uppercase tracking-widest text-blue-800">Booking Process</h4>
                    <div className="grid grid-cols-3 gap-2 relative">
                       <div className="absolute top-4 left-[16%] right-[16%] h-[2px] bg-blue-200/50 z-0 hidden sm:block"></div>
                       <div className="flex flex-col items-center text-center gap-2 z-10">
                         <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black border-2 border-white shadow-sm text-sm">1</div>
                         <span className="text-xs font-bold text-blue-900 leading-tight">Schedule<br/>Visit</span>
                       </div>
                       <div className="flex flex-col items-center text-center gap-2 z-10">
                         <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black border-2 border-white shadow-sm text-sm">2</div>
                         <span className="text-xs font-bold text-blue-900/60 leading-tight">View<br/>Property</span>
                       </div>
                       <div className="flex flex-col items-center text-center gap-2 z-10">
                         <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black border-2 border-white shadow-sm text-sm">3</div>
                         <span className="text-xs font-bold text-blue-900/60 leading-tight">Approve<br/>& Pay</span>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Visitation Date</label>
                      <input 
                        type="date" 
                        required 
                        className="input-field" 
                        value={bookingForm.visitationDate} 
                        onChange={(e) => setBookingForm({...bookingForm, visitationDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Preferred Time</label>
                      <select 
                        required 
                        className="input-field" 
                        value={bookingForm.visitationTime} 
                        onChange={(e) => setBookingForm({...bookingForm, visitationTime: e.target.value})}
                      >
                         <option value="">Select a time</option>
                         <option value="Morning (8AM - 11AM)">Morning (8AM - 11AM)</option>
                         <option value="Midday (11AM - 2PM)">Midday (11AM - 2PM)</option>
                         <option value="Afternoon (2PM - 5PM)">Afternoon (2PM - 5PM)</option>
                         <option value="Evening (5PM - 8PM)">Evening (5PM - 8PM)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Message for Landlord (Optional)</label>
                      <textarea 
                        rows={2}
                        className="input-field resize-none" 
                        placeholder="Any specific questions or requests?"
                        value={bookingForm.message} 
                        onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
                      />
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting} 
                    className="w-full btn-primary py-4 text-base mt-2 disabled:opacity-50 font-black shadow-lg shadow-blue-500/20"
                  >
                    {submitting ? 'Submitting...' : 'Request Visitation'}
                  </button>
                  <p className="text-center text-xs text-gray-400 font-bold">You won't be charged anything yet.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-black font-poppins text-dark">Order {title}</h3>
              <button onClick={() => setShowCheckoutModal(false)} className="text-gray-400 hover:text-dark hover:bg-gray-100 p-2 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {successMessage ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-dark mb-2">Order Confirmed!</h4>
                  <p className="text-gray-500">{successMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleCreateOrder} className="space-y-5">
                  {errorMessage && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                      {errorMessage}
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Quantity</label>
                    <input 
                      type="number" 
                      min="1"
                      required 
                      className="input-field" 
                      value={checkoutForm.quantity} 
                      onChange={(e) => setCheckoutForm({...checkoutForm, quantity: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Shipping Address</label>
                    <textarea 
                      required 
                      rows={3}
                      className="input-field resize-none" 
                      placeholder="Enter full delivery address"
                      value={checkoutForm.shippingAddress} 
                      onChange={(e) => setCheckoutForm({...checkoutForm, shippingAddress: e.target.value})}
                    />
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mt-4">
                    <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                      <span>Price per unit</span>
                      <span className="font-bold">{Number(price).toLocaleString()} RWF</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-black text-dark pt-2 border-t border-gray-200">
                      <span>Total Price</span>
                      <span className="text-primary">
                        { (checkoutForm.quantity * Number(price)).toLocaleString() } RWF
                      </span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting} 
                    className="w-full btn-primary py-4 text-lg mt-4 disabled:opacity-50"
                  >
                    {submitting ? 'Processing...' : 'Place Order'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </MainLayout>
  );
};

export default ListingDetailsPage;
