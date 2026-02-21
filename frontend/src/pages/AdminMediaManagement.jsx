import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  Grid, 
  List,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const AdminMediaManagement = () => {
  const [viewMode, setViewMode] = useState('grid');
  
  const images = [
    { id: 1, url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233', listing: 'Luxury Villa', size: '2.4 MB', date: '2026-02-21' },
    { id: 2, url: 'https://images.unsplash.com/photo-1580587771525-78b9bed1b438', listing: 'Office Space', size: '1.8 MB', date: '2026-02-20' },
    { id: 3, url: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff', listing: 'Building Sand', size: '0.9 MB', date: '2026-02-19' },
    { id: 4, url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6', listing: 'Cottage Home', size: '3.1 MB', date: '2026-02-18' },
    { id: 5, url: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09', listing: 'Modern Flat', size: '2.2 MB', date: '2026-02-17' },
    { id: 6, url: 'https://images.unsplash.com/photo-1549517045-bc93de075e53', listing: 'Suburban Villa', size: '1.5 MB', date: '2026-02-16' },
  ];

  return (
    <div className="space-y-8 text-[#1A2B4D]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-dark font-poppins mb-2">Media Management</h1>
          <p className="text-gray-500 font-medium">Monitor and moderate all uploaded images and documents.</p>
        </div>
        <div className="flex bg-white rounded-xl border border-gray-100 p-1">
           <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}>
              <Grid size={20} />
           </button>
           <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}>
              <List size={20} />
           </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-8">
           <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search media by listing name..." 
                className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-primary/30 transition-all font-medium text-sm"
              />
           </div>
           <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-gray-100 font-bold text-xs text-gray-500 hover:bg-gray-50 transition-all">
                 <Filter size={18} />
                 <span>All Category</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3.5 bg-red-50 text-red-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all">
                 <Trash2 size={18} />
                 <span>Bulk Delete</span>
              </button>
           </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                 <img src={img.url} alt="media" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3">
                    <div className="text-white text-[10px] font-black uppercase tracking-widest mb-1">{img.listing}</div>
                    <div className="flex gap-2">
                       <button className="p-3 bg-white text-dark rounded-xl hover:bg-primary hover:text-white transition-all shadow-lg">
                          <Eye size={18} />
                       </button>
                       <button className="p-3 bg-white text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg">
                          <Trash2 size={18} />
                       </button>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="bg-gray-50/50">
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Image Preview</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Listing</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Size / Date</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Settings</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {images.map((img) => (
                      <tr key={img.id} className="hover:bg-gray-50/30 transition-colors">
                         <td className="px-8 py-6">
                            <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-100">
                               <img src={img.url} alt="media" className="w-full h-full object-cover" />
                            </div>
                         </td>
                         <td className="px-8 py-6 font-bold text-dark">{img.listing}</td>
                         <td className="px-8 py-6 text-xs text-gray-500 font-bold">{img.size} • {img.date}</td>
                         <td className="px-8 py-6">
                            <div className="flex justify-end gap-2">
                               <button className="p-2 text-gray-400 hover:text-primary transition-colors"><Eye size={18} /></button>
                               <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMediaManagement;
