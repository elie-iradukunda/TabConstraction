import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Info, MapPin, Tag, Box } from 'lucide-react';
import { useListingStore } from '../store/listingStore';

const AddListingPage = () => {
  const navigate = useNavigate();
  const { createListing, loading, error } = useListingStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: 'sale',
    category: 'house',
    propertyType: '',
    bedrooms: '0',
    bathrooms: '0',
    size: ''
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    images.forEach(image => data.append('images', image));

    try {
      await createListing(data);
      navigate('/dashboard/my-listings');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-black text-dark font-poppins mb-2">Create New Listing</h1>
            <p className="text-gray-500 font-medium tracking-tight">Post your property or construction materials for the world to see.</p>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info Card */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Info size={20} />
              </div>
              <h2 className="text-xl font-black text-dark font-poppins uppercase tracking-widest text-sm">Basic Information</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Listing Title</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  className="input-field py-4 px-6 rounded-2xl bg-accent/50 border-gray-100 placeholder:text-gray-300"
                  placeholder="e.g. Modern Villa with Pool or High Quality Cement"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Full Description</label>
                <textarea 
                  name="description"
                  required
                  rows="6"
                  className="input-field py-4 px-6 rounded-2xl bg-accent/50 border-gray-100 placeholder:text-gray-300 resize-none"
                  placeholder="Describe your property or material in detail..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Category</label>
                  <select 
                    name="category"
                    className="input-field py-4 px-6 rounded-2xl bg-accent/50 border-gray-100 appearance-none bg-[url('https://cdn-icons-png.flaticon.com/512/271/271210.png')] bg-[length:12px] bg-[right_20px_center] bg-no-repeat"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="house">House / Property</option>
                    <option value="land">Land / Plot</option>
                    <option value="material">Construction Material</option>
                  </select>
               </div>

               <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Listing Type</label>
                  <div className="flex p-1 bg-accent/50 rounded-2xl gap-1">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, type: 'sale'})}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.type === 'sale' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-dark'}`}
                    >For Sale</button>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, type: 'rent'})}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.type === 'rent' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-dark'}`}
                    >For Rent</button>
                  </div>
               </div>
             </div>

             <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
               <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Bedrooms</label>
                  <input 
                    type="number" 
                    name="bedrooms"
                    className="input-field py-4 px-6 rounded-2xl bg-accent/50 border-gray-100"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    disabled={formData.category === 'material'}
                  />
               </div>
               <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Bathrooms</label>
                  <input 
                    type="number" 
                    name="bathrooms"
                    className="input-field py-4 px-6 rounded-2xl bg-accent/50 border-gray-100"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    disabled={formData.category === 'material'}
                  />
               </div>
               <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Total Size</label>
                  <input 
                    type="text" 
                    name="size"
                    className="input-field py-4 px-6 rounded-2xl bg-accent/50 border-gray-100"
                    placeholder="e.g. 1500 sqft"
                    value={formData.size}
                    onChange={handleChange}
                  />
               </div>
             </div>
          </div>

          {/* Media Card */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Upload size={20} />
              </div>
              <h2 className="text-xl font-black text-dark font-poppins uppercase tracking-widest text-sm">Media & Photos</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previews.map((preview, idx) => (
                <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              
              <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-accent/20 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/40 hover:border-primary/30 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-gray-400 group-hover:text-primary shadow-sm mb-3">
                  <Plus size={24} />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Add Image</span>
                <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl transition-all hover:shadow-2xl sticky top-24">
            <div className="mb-8 p-6 bg-primary rounded-3xl text-white">
               <label className="block text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Set Your Price</label>
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
            </div>

            <div className="space-y-6 mb-10">
               <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                    <input 
                      type="text" 
                      name="location"
                      required
                      className="input-field pl-12 py-4 px-6 rounded-2xl bg-accent/50 border-gray-100"
                      placeholder="e.g. New York, NY"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Property Type</label>
                  <div className="relative">
                    <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                    <input 
                      type="text" 
                      name="propertyType"
                      className="input-field pl-12 py-4 px-6 rounded-2xl bg-accent/50 border-gray-100"
                      placeholder="e.g. Apartment, Land, Plot"
                      value={formData.propertyType}
                      onChange={handleChange}
                    />
                  </div>
               </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-5 rounded-3xl font-black text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:scale-100"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Publish Listing</span>
                  <Plus size={20} />
                </>
              )}
            </button>
            <p className="text-center mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Takes less than 1 minute</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddListingPage;
