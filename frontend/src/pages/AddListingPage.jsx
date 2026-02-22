import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Info, MapPin, Tag, Box, Home, Landmark, Layers, Bath, BedDouble, Maximize2, Building2, ChevronDown, Shield, ExternalLink } from 'lucide-react';
import { useListingStore } from '../store/listingStore';
import { useAuthStore } from '../store/authStore';

const AddListingPage = () => {
  const navigate = useNavigate();
  const { createListing, loading, error } = useListingStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    mapLink: '',
    type: 'sale',
    category: 'house',
    propertyType: '',
    bedrooms: '0',
    bathrooms: '0',
    size: ''
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures([...features, trimmed]);
    }
    setFeatureInput('');
  };

  const removeFeature = (featureToRemove) => {
    setFeatures(features.filter(f => f !== featureToRemove));
  };

  const handleFeatureKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setLocalLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('features', JSON.stringify(features));
    images.forEach(image => data.append('images', image));

    try {
      await createListing(data);
      alert('Success! Your listing has been submitted and is pending review.');
      window.location.reload(); 
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Failed to create listing. Please check your permissions.');
    } finally {
      setLocalLoading(false);
    }
  };

  // Dynamic property type options based on category
  const propertyTypeOptions = {
    house: ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Duplex', 'Studio', 'Bungalow', 'Cottage', 'Mansion', 'Condo'],
    land: ['Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Plot', 'Mixed Use'],
    material: ['Cement', 'Bricks', 'Steel', 'Sand', 'Timber', 'Tiles', 'Glass', 'Paint', 'Pipes', 'Electrical', 'Roofing', 'Equipment']
  };

  const isHouse = formData.category === 'house';
  const isLand = formData.category === 'land';
  const isMaterial = formData.category === 'material';

  // Check if user can add materials
  const canAddMaterials = ['admin', 'manager'].includes(user?.role);

  const selectClass = "input-field py-4 px-6 rounded-2xl bg-accent/50 border-gray-100 appearance-none cursor-pointer";


  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-black text-dark font-poppins mb-2">Create New Listing</h1>
            <p className="text-gray-500 font-medium tracking-tight">Fill in the details below to post your property or material.</p>
         </div>
         {user?.status === 'pending' && (
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-4 animate-pulse">
               <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
                  <Shield size={20} />
               </div>
               <div>
                  <p className="text-xs font-black text-orange-700 uppercase tracking-widest">Verification in Progress</p>
                  <p className="text-[10px] font-bold text-orange-600/80">You can submit your listing now. It will go live once your account is verified.</p>
               </div>
            </div>
         )}
      </div>

      {submitError && (
        <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-3">
          <X size={18} className="text-red-400" />
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        <div className="lg:col-span-2 space-y-8">

          {/* ═══════════ STEP 1: CATEGORY SELECTOR ═══════════ */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Layers size={20} />
              </div>
              <h2 className="text-sm font-black text-dark uppercase tracking-widest">Step 1 — What are you listing?</h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'house', label: 'House / Property', icon: <Home size={28} />, desc: 'Apartments, Villas, etc.' },
                { value: 'land', label: 'Land / Plot', icon: <Landmark size={28} />, desc: 'Residential, Commercial' },
                { value: 'material', label: 'Materials', icon: <Box size={28} />, desc: 'Cement, Steel, Bricks', restricted: !canAddMaterials },
              ].map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  disabled={cat.restricted}
                  onClick={() => setFormData({ ...formData, category: cat.value, propertyType: '', bedrooms: '0', bathrooms: '0' })}
                  className={`relative p-6 rounded-2xl border-2 text-left transition-all group ${
                    formData.category === cat.value
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                      : cat.restricted
                        ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-100 bg-white hover:border-primary/30 hover:shadow-md'
                  }`}
                >
                  <div className={`mb-4 ${formData.category === cat.value ? 'text-primary' : 'text-gray-400 group-hover:text-primary'} transition-colors`}>
                    {cat.icon}
                  </div>
                  <div className="font-black text-dark text-sm">{cat.label}</div>
                  <div className="text-[10px] font-bold text-gray-400 mt-1">{cat.desc}</div>
                  {cat.restricted && (
                    <div className="absolute top-3 right-3 bg-red-100 text-red-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                      Admin Only
                    </div>
                  )}
                  {formData.category === cat.value && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ═══════════ STEP 2: BASIC INFORMATION ═══════════ */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Info size={20} />
              </div>
              <h2 className="text-sm font-black text-dark uppercase tracking-widest">Step 2 — Basic Information</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Listing Title *</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  className="input-field py-4 px-6 rounded-2xl bg-accent/50 border-gray-100 placeholder:text-gray-300"
                  placeholder={isHouse ? "e.g. Modern 3-Bedroom Villa with Garden" : isLand ? "e.g. Prime 0.5 Acre Plot in Nyarutarama" : "e.g. Premium Grade A Cement — 50kg Bags"}
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Full Description *</label>
                <textarea 
                  name="description"
                  required
                  rows="5"
                  className="input-field py-4 px-6 rounded-2xl bg-accent/50 border-gray-100 placeholder:text-gray-300 resize-none"
                  placeholder={isHouse ? "Describe the property: features, condition, neighborhood, nearby amenities..." : isLand ? "Describe the land: terrain, access roads, utilities, zoning..." : "Describe quantity available, brand, quality grade..."}
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Listing Type Toggle (Sale / Rent) */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Listing Purpose</label>
                <div className="flex p-1.5 bg-accent/50 rounded-2xl gap-1">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'sale'})}
                    className={`flex-1 py-3.5 rounded-xl font-black text-sm transition-all ${formData.type === 'sale' ? 'bg-white text-primary shadow-md' : 'text-gray-400 hover:text-dark'}`}
                  >
                    <Tag size={16} className="inline mr-2" />
                    For Sale
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'rent'})}
                    className={`flex-1 py-3.5 rounded-xl font-black text-sm transition-all ${formData.type === 'rent' ? 'bg-white text-primary shadow-md' : 'text-gray-400 hover:text-dark'}`}
                  >
                    <Building2 size={16} className="inline mr-2" />
                    For Rent
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════ STEP 3: PROPERTY / MATERIAL DETAILS ═══════════ */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                {isHouse ? <Home size={20} /> : isLand ? <Landmark size={20} /> : <Box size={20} />}
              </div>
              <h2 className="text-sm font-black text-dark uppercase tracking-widest">
                Step 3 — {isHouse ? 'Property Details' : isLand ? 'Land Details' : 'Material Details'}
              </h2>
            </div>

            <div className="space-y-6">
              {/* Property Type Dropdown */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                  {isHouse ? 'Property Type *' : isLand ? 'Land Type *' : 'Material Type *'}
                </label>
                <div className="relative">
                  <select
                    name="propertyType"
                    required
                    className={selectClass}
                    value={formData.propertyType}
                    onChange={handleChange}
                  >
                    <option value="">— Select Type —</option>
                    {propertyTypeOptions[formData.category]?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* ─── House-Specific Fields ─── */}
              {isHouse && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                        <BedDouble size={14} className="inline mr-1 mb-0.5" /> Bedrooms *
                      </label>
                      <div className="flex items-center bg-accent/50 rounded-2xl border border-gray-100 overflow-hidden">
                        <button type="button" onClick={() => setFormData({...formData, bedrooms: String(Math.max(0, Number(formData.bedrooms) - 1))})} className="px-4 py-4 text-gray-400 hover:text-primary font-black text-xl transition-colors">−</button>
                        <input 
                          type="number" name="bedrooms" min="0"
                          className="flex-1 text-center py-4 bg-transparent outline-none font-black text-xl text-dark"
                          value={formData.bedrooms} onChange={handleChange}
                        />
                        <button type="button" onClick={() => setFormData({...formData, bedrooms: String(Number(formData.bedrooms) + 1)})} className="px-4 py-4 text-gray-400 hover:text-primary font-black text-xl transition-colors">+</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                        <Bath size={14} className="inline mr-1 mb-0.5" /> Bathrooms *
                      </label>
                      <div className="flex items-center bg-accent/50 rounded-2xl border border-gray-100 overflow-hidden">
                        <button type="button" onClick={() => setFormData({...formData, bathrooms: String(Math.max(0, Number(formData.bathrooms) - 1))})} className="px-4 py-4 text-gray-400 hover:text-primary font-black text-xl transition-colors">−</button>
                        <input 
                          type="number" name="bathrooms" min="0"
                          className="flex-1 text-center py-4 bg-transparent outline-none font-black text-xl text-dark"
                          value={formData.bathrooms} onChange={handleChange}
                        />
                        <button type="button" onClick={() => setFormData({...formData, bathrooms: String(Number(formData.bathrooms) + 1)})} className="px-4 py-4 text-gray-400 hover:text-primary font-black text-xl transition-colors">+</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                        <Maximize2 size={14} className="inline mr-1 mb-0.5" /> Total Size
                      </label>
                      <input 
                        type="text" name="size"
                        className="input-field py-4 px-6 rounded-2xl bg-accent/50 border-gray-100"
                        placeholder="e.g. 1500 sqft"
                        value={formData.size} onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ─── Land-Specific Fields ─── */}
              {isLand && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                      <Maximize2 size={14} className="inline mr-1 mb-0.5" /> Land Area *
                    </label>
                    <input 
                      type="text" name="size"
                      className="input-field py-4 px-6 rounded-2xl bg-accent/50 border-gray-100"
                      placeholder="e.g. 0.5 Acres or 2000 sqm"
                      value={formData.size} onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {/* ─── Material-Specific Fields ─── */}
              {isMaterial && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                      Unit / Quantity
                    </label>
                    <input 
                      type="text" name="size"
                      className="input-field py-4 px-6 rounded-2xl bg-accent/50 border-gray-100"
                      placeholder="e.g. 50kg bags, per ton, per piece"
                      value={formData.size} onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ═══════════ FEATURES (for houses) ═══════════ */}
          {isHouse && (
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                  <Tag size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-dark uppercase tracking-widest">Property Features</h2>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Add amenities like Wifi, Parking, Pool, etc.</p>
                </div>
              </div>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {features.map((feature) => (
                  <span key={feature} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold group">
                    {feature}
                    <button type="button" onClick={() => removeFeature(feature)} className="text-primary/40 hover:text-red-500 transition-colors">
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {features.length === 0 && (
                  <p className="text-gray-300 text-sm font-medium">No features added yet. Type below to add.</p>
                )}
              </div>

              {/* Add Feature Input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={handleFeatureKeyDown}
                  className="input-field flex-1 py-3.5 px-6 rounded-2xl bg-accent/50 border-gray-100 placeholder:text-gray-300"
                  placeholder="Type a feature and press Enter..."
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="bg-primary text-white px-6 rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ═══════════ STEP 4: MEDIA ═══════════ */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Upload size={20} />
              </div>
              <h2 className="text-sm font-black text-dark uppercase tracking-widest">Step 4 — Photos</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previews.map((preview, idx) => (
                <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                  {idx === 0 && (
                    <div className="absolute bottom-2 left-2 bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                      Cover
                    </div>
                  )}
                </div>
              ))}
              
              <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-accent/20 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/40 hover:border-primary/30 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-gray-400 group-hover:text-primary shadow-sm mb-3 transition-colors">
                  <Plus size={24} />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Add Image</span>
                <span className="text-[9px] text-gray-300 mt-1">Max 5 photos</span>
                <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
          </div>
        </div>

        {/* ═══════════ SIDEBAR ═══════════ */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl sticky top-24">
            {/* Price */}
            <div className="mb-8 p-6 bg-gradient-to-br from-primary to-blue-700 rounded-3xl text-white">
               <label className="block text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">
                 {isMaterial ? 'Price per Unit' : isLand ? 'Asking Price' : 'Property Price'}
               </label>
               <div className="flex items-center">
                  <span className="text-3xl font-black mr-2">$</span>
                  <input 
                    type="number" 
                    name="price"
                    required
                    className="bg-transparent text-3xl font-black w-full outline-none placeholder:text-white/30"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                  />
               </div>
               {formData.type === 'rent' && (
                 <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mt-2">Per Month</p>
               )}
            </div>

            {/* Location */}
            <div className="space-y-6 mb-10">
               <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                    <input 
                      type="text" 
                      name="location"
                      required
                      className="input-field pl-12 py-4 px-6 rounded-2xl bg-accent/50 border-gray-100"
                      placeholder={isLand ? "e.g. Nyarutarama, Kigali" : "e.g. Kimihurura, Kigali"}
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                    Google Maps Link <span className="text-gray-300 font-medium normal-case tracking-normal text-[10px]">(optional but recommended)</span>
                  </label>
                  <div className="relative">
                    <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                    <input 
                      type="url"
                      name="mapLink"
                      className="input-field pl-12 py-4 px-6 rounded-2xl bg-accent/50 border-gray-100"
                      placeholder="https://maps.app.goo.gl/..."
                      value={formData.mapLink}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold mt-2 leading-relaxed bg-green-50/60 px-3 py-2 rounded-xl border border-green-100">
                    📍 Open Google Maps → Find your exact property → Tap <strong>Share</strong> → Copy link → Paste here
                  </p>
               </div>
            </div>

            {/* Summary Preview */}
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
              {isHouse && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-bold">Rooms</span>
                  <span className="font-black text-dark">{formData.bedrooms} Bed / {formData.bathrooms} Bath</span>
                </div>
              )}
              {formData.price && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-bold">Price</span>
                  <span className="font-black text-primary">${Number(formData.price).toLocaleString()}{formData.type === 'rent' ? '/mo' : ''}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold">Status</span>
                <span className="font-black text-orange-600">Pending Review</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={localLoading || loading}
              className="w-full bg-primary text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:scale-100 hover:opacity-90 transition-all font-poppins"
            >
              {localLoading || loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Submit for Review</span>
                  <Plus size={20} />
                </>
              )}
            </button>
            <p className="text-center mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {['admin', 'manager'].includes(user?.role) ? 'Auto-approved for your role' : 'Requires admin/manager approval'}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddListingPage;
