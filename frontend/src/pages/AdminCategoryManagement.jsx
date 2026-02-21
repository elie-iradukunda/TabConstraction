import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  MoreVertical,
  Layers,
  ShoppingBag,
  Home,
  Mountain
} from 'lucide-react';

const AdminCategoryManagement = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Houses for Sale', type: 'Property', count: 45, icon: <Home size={20} /> },
    { id: 2, name: 'Houses for Rent', type: 'Property', count: 32, icon: <Home size={20} /> },
    { id: 3, name: 'Land & Plots', type: 'Land', count: 18, icon: <Mountain size={20} /> },
    { id: 4, name: 'Cement & Bricks', type: 'Material', count: 24, icon: <ShoppingBag size={20} /> },
    { id: 5, name: 'Steel & Metal', type: 'Material', count: 15, icon: <ShoppingBag size={20} /> },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-dark font-poppins mb-2">Category Management</h1>
          <p className="text-gray-500 font-medium">Create and organize marketplace categories.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
           <Plus size={20} />
           <span className="text-xs font-black uppercase tracking-widest">Create Category</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden text-[#1A2B4D]">
        <div className="p-8 border-b border-gray-50">
           <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search categories..." 
                className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-primary/30 transition-all font-medium text-sm"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category Name</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Active Listings</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {categories.map((cat) => (
                   <tr key={cat.id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                               {cat.icon}
                            </div>
                            <span className="font-bold text-dark">{cat.name}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{cat.type}</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <span className="font-black text-dark text-lg">{cat.count}</span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center justify-end gap-2">
                            <button className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                               <Edit3 size={18} />
                            </button>
                            <button className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                               <Trash2 size={18} />
                            </button>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoryManagement;
