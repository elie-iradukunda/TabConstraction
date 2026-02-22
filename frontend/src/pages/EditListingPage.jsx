import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Plus, MapPin, Tag, Box, Home, Landmark, Layers, Bath, BedDouble, Maximize2, Building2, ChevronDown, ExternalLink, ArrowLeft, Save } from 'lucide-react';
import { useListingStore } from '../store/listingStore';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchListingById, selectedListing } = useListingStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    title: '', description: '', price: '', location: '', mapLink: '',
    type: 'sale', category: 'house', propertyType: '',
    bedrooms: '0', bathrooms: '0', size: ''
  });
  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState('');
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await fetchListingById(id);
      setPageLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    if (selectedListing && selectedListing.id === id) {
      setFormData({
        title:        selectedListing.title || '',
        description:  selectedListing.description || '',
        price:        selectedListing.price || '',
        location:     selectedListing.location || '',
        mapLink:      selectedListing.mapLink || '',
        type:         selectedListing.type || 'sale',
        category:     selectedListing.category || 'house',
        propertyType: selectedListing.propertyType || '',
        bedrooms:     String(selectedListing.bedrooms ?? '0'),
        bathrooms:    String(selectedListing.bathrooms ?? '0'),
        size:         selectedListing.size || '',
      });
      let feats = selectedListing.features;
      if (typeof feats === 'string') { try { feats = JSON.parse(feats); } catch { feats = []; } }
      setFeatures(Array.isArray(feats) ? feats : []);
      setExistingImages(selectedListing.images || []);
    }
  }, [selectedListing, id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
    setNewPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };
  const removeNewImage = (i) => {
    setNewImages(newImages.filter((_, idx) => idx !== i));
    setNewPreviews(newPreviews.filter((_, idx) => idx !== i));
  };

  const addFeature = () => {
    const t = featureInput.trim();
    if (t && !features.includes(t)) setFeatures([...features, t]);
    setFeatureInput('');
  };
  const removeFeature = (f) => setFeatures(features.filter(x => x !== f));
  const handleFeatureKey = (e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setLocalLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(k => data.append(k, formData[k]));
    data.append('features', JSON.stringify(features));
    newImages.forEach(img => data.append('images', img));

    try {
      await api.put(`/listings/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('Listing updated successfully!');
      navigate('/dashboard/my-listings');
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Failed to update listing.');
    } finally {
      setLocalLoading(false);
    }
  };

  const propertyTypeOptions = {
    house: ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Duplex', 'Studio', 'Bungalow', 'Cottage', 'Mansion', 'Condo'],
    land: ['Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Plot', 'Mixed Use'],
    material: ['Cement', 'Bricks', 'Steel', 'Sand', 'Timber', 'Tiles', 'Glass', 'Paint', 'Pipes', 'Electrical', 'Roofing', 'Equipment']
  };
  const isHouse = formData.category === 'house';
  const isLand = formData.category === 'land';
  const isMaterial = formData.category === 'material';
  const canAddMaterials = ['admin', 'manager'].includes(user?.role);
  const selectClass = "input-field py-4 px-6 rounded-2xl bg-accent/50 border-gray-100 appearance-none cursor-pointer";

  if (pageLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-dark font-bold text-sm mb-3 transition-colors">
            <ArrowLeft size={16} /> Back to My Listings
          </button>
          <h1 className="text-3xl font-black text-dark font-poppins mb-2">Edit Listing</h1>
          <p className="text-gray-500 font-medium tracking-tight">Update the details of your published property.</p>
        </div>
      </div>

      {submitError && (
        <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-3">
          <X size={18} className="text-red-400" />
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        <div className="lg:col-span-2 space-y-8">

          {/* CATEGORY */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center"><Layers size={20} /></div>
              <h2 className="text-sm font-black text-dark uppercase tracking-widest">Step 1 — Category</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'house', label: 'House / Property', icon: <Home size={28} />, desc: 'Apartments, Villas, etc.' },
                { value: 'land', label: 'Land / Plot', icon: <Landmark size={28} />, desc: 'Residential, Commercial' },
                { value: 'material', label: 'Materials', icon: <Box size={28} />, desc: 'Cement, Steel, Bricks', restricted: !canAddMaterials },
              ].map(cat => (
                <button key={cat.value} type="button" disabled={cat.restricted}
                  onClick={() => setFormData({ ...formData, category: cat.value, propertyType: '' })}
                  className={`relative p-6 rounded-2xl border-2 text-left transition-all ${formData.category === cat.value ? 'border-primary bg-primary/5 shadow-lg' : cat.restricted ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed' : 'border-gray-100 bg-white hover:border-primary/30'}`}
                >
                  <div className={`mb-4 ${formData.category === cat.value ? 'text-primary' : 'text-gray-400'}`}>{cat.icon}</div>
                  <div className="font-black text-dark text-sm">{cat.label}</div>
                  <div className="text-[10px] font-bold text-gray-400 mt-1">{cat.desc}</div>
                  {cat.restricted && <div className="absolute top-3 right-3 bg-red-100 text-red-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Admin Only</div>}
                </button>
              ))}
            </div>
          </div>

          {/* BASIC INFO */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center"><Tag size={20} /></div>
              <h2 className="text-sm font-black text-dark uppercase tracking-widest">Step 2 — Basic Information</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-dark uppercase tracking-widest mb-2">Listing Title *</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange}
                  className="input-field py-4 px-6 rounded-2xl bg-accent/50 border-gray-100" placeholder="e.g. Modern 3-Bedroom Villa" />
              </div>
              <div>
                <label className="block text-xs font-black text-dark uppercase tracking-widest mb-2">Full Description *</label>
                <textarea name="description" required rows={5} value={formData.description} onChange={handleChange}
                  className="input-field py-4 px-6 rounded-2xl bg-accent/50 border-gray-100 resize-none" placeholder="Describe the property..." />
              </div>
              <div>
                <label className="block text-xs font-black text-dark uppercase tracking-widest mb-2">Listing Purpose *</label>
                <div className="grid grid-cols-2 gap-4">
                  {['sale', 'rent'].map(t => (
                    <button key={t} type="button" onClick={() => setFormData({ ...formData, type: t })}
                      className={`py-4 rounded-2xl border-2 font-black text-sm transition-all ${formData.type === t ? 'border-primary bg-primary text-white' : 'border-gray-100 text-gray-400 hover:border-primary/30'}`}>
                      {t === 'sale' ? '🏷️ For Sale' : '🔑 For Rent'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PROPERTY DETAILS */}
          {!isMaterial && (
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center"><Home size={20} /></div>
                <h2 className="text-sm font-black text-dark uppercase tracking-widest">Step 3 — Property Details</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-dark uppercase tracking-widest mb-2">Property Type *</label>
                  <div className="relative">
                    <select name="propertyType" value={formData.propertyType} onChange={handleChange} className={selectClass}>
                      <option value="">— Select Type —</option>
                      {propertyTypeOptions[formData.category]?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>
                {isHouse && (
                  <div className="grid grid-cols-3 gap-4">
                    {['bedrooms', 'bathrooms'].map(field => (
                      <div key={field} className="bg-accent/30 rounded-2xl p-4 text-center">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                          {field === 'bedrooms' ? <BedDouble size={16} className="mx-auto mb-1" /> : <Bath size={16} className="mx-auto mb-1" />}
                          {field}
                        </label>
                        <div className="flex items-center justify-center gap-3">
                          <button type="button" onClick={() => setFormData({ ...formData, [field]: String(Math.max(0, parseInt(formData[field]) - 1)) })} className="w-8 h-8 rounded-full bg-white shadow text-dark font-black">−</button>
                          <span className="text-xl font-black text-dark w-8 text-center">{formData[field]}</span>
                          <button type="button" onClick={() => setFormData({ ...formData, [field]: String(parseInt(formData[field]) + 1) })} className="w-8 h-8 rounded-full bg-white shadow text-dark font-black">+</button>
                        </div>
                      </div>
                    ))}
                    <div className="bg-accent/30 rounded-2xl p-4 text-center">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3"><Maximize2 size={16} className="mx-auto mb-1" />Total Size</label>
                      <input type="text" name="size" value={formData.size} onChange={handleChange} placeholder="e.g. 2000 sqft" className="w-full text-center font-bold bg-transparent outline-none text-dark text-sm" />
                    </div>
                  </div>
                )}
                {isLand && (
                  <div>
                    <label className="block text-xs font-black text-dark uppercase tracking-widest mb-2">Plot Size</label>
                    <input type="text" name="size" value={formData.size} onChange={handleChange} placeholder="e.g. 500 sqm or 2 acres"
                      className="input-field py-4 px-6 rounded-2xl bg-accent/50 border-gray-100" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FEATURES */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center"><Tag size={20} /></div>
              <div>
                <h2 className="text-sm font-black text-dark uppercase tracking-widest">Property Features</h2>
                <p className="text-[10px] text-gray-400 font-bold mt-0.5">Add amenities like Wifi, Parking, Pool, etc.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {features.map(f => (
                <span key={f} className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-black">
                  {f}
                  <button type="button" onClick={() => removeFeature(f)} className="hover:text-red-500 transition-colors"><X size={12} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <input type="text" value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={handleFeatureKey}
                placeholder="Type a feature and press Enter..." className="input-field flex-1 py-3 px-5 rounded-2xl bg-accent/50 border-gray-100 text-sm" />
              <button type="button" onClick={addFeature} className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg hover:opacity-90"><Plus size={20} /></button>
            </div>
          </div>

          {/* EXISTING IMAGES */}
          {existingImages.length > 0 && (
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <h2 className="text-sm font-black text-dark uppercase tracking-widest mb-6">Current Photos</h2>
              <div className="grid grid-cols-3 gap-4">
                {existingImages.map((img, i) => (
                  <div key={i} className="aspect-video rounded-2xl overflow-hidden border-2 border-gray-100 bg-gray-50 relative">
                    <img src={img.imageUrl?.startsWith('http') ? img.imageUrl : `http://localhost:5000${img.imageUrl}`} alt="" className="w-full h-full object-cover" />
                    {i === 0 && <div className="absolute bottom-2 left-2 bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Cover</div>}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 font-bold mt-4">Add new photos below to supplement these images.</p>
            </div>
          )}

          {/* NEW IMAGES */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center"><Upload size={20} /></div>
              <h2 className="text-sm font-black text-dark uppercase tracking-widest">Add New Photos</h2>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {newPreviews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 group">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeNewImage(i)} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                </div>
              ))}
              <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-accent/20 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/40 hover:border-primary/30 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-gray-400 group-hover:text-primary shadow-sm mb-3"><Plus size={24} /></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Add Photos</span>
                <input type="file" multiple className="hidden" onChange={handleNewImages} accept="image/*" />
              </label>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl sticky top-24">
            {/* Price */}
            <div className="mb-8 p-6 bg-gradient-to-br from-primary to-blue-700 rounded-3xl text-white">
              <label className="block text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Property Price</label>
              <div className="flex items-center">
                <span className="text-3xl font-black mr-2">$</span>
                <input type="number" name="price" required value={formData.price} onChange={handleChange}
                  className="bg-transparent text-3xl font-black w-full outline-none placeholder:text-white/30" placeholder="0.00" />
              </div>
              {formData.type === 'rent' && <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mt-2">Per Month</p>}
            </div>

            {/* Location & Map */}
            <div className="space-y-6 mb-10">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                  <input type="text" name="location" required value={formData.location} onChange={handleChange}
                    className="input-field pl-12 py-4 px-6 rounded-2xl bg-accent/50 border-gray-100" placeholder="e.g. Kimihurura, Kigali" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                  Google Maps Link <span className="text-gray-300 font-medium normal-case tracking-normal text-[10px]">(optional)</span>
                </label>
                <div className="relative">
                  <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                  <input type="url" name="mapLink" value={formData.mapLink} onChange={handleChange}
                    className="input-field pl-12 py-4 px-6 rounded-2xl bg-accent/50 border-gray-100" placeholder="https://maps.app.goo.gl/..." />
                </div>
                <p className="text-[10px] text-gray-400 font-bold mt-2 bg-green-50/60 px-3 py-2 rounded-xl border border-green-100">
                  📍 Google Maps → Find property → Share → Copy link
                </p>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-accent/30 rounded-2xl p-5 mb-8 space-y-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Listing Preview</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold">Category</span>
                <span className="font-black text-dark capitalize">{formData.category}</span>
              </div>
              {formData.propertyType && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-bold">Type</span>
                  <span className="font-black text-dark">{formData.propertyType}</span>
                </div>
              )}
              {formData.price && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-bold">Price</span>
                  <span className="font-black text-primary">${Number(formData.price).toLocaleString()}{formData.type === 'rent' ? '/mo' : ''}</span>
                </div>
              )}
            </div>

            <button type="submit" disabled={localLoading}
              className="w-full bg-primary text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-3 disabled:opacity-70 hover:opacity-90 transition-all font-poppins">
              {localLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <><Save size={20} /><span>Save Changes</span></>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditListingPage;
