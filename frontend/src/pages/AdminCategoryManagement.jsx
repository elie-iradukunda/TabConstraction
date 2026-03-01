import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Layers,
  ShoppingBag,
  Home,
  Mountain,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

const AdminCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Property',
    icon: 'Home'
  });

  const iconOptions = [
    { name: 'Home', icon: <Home size={18} /> },
    { name: 'ShoppingBag', icon: <ShoppingBag size={18} /> },
    { name: 'Mountain', icon: <Mountain size={18} /> },
    { name: 'Layers', icon: <Layers size={18} /> }
  ];

  const getIcon = (name) => {
    switch(name) {
      case 'Home': return <Home size={20} />;
      case 'ShoppingBag': return <ShoppingBag size={20} />;
      case 'Mountain': return <Mountain size={20} />;
      default: return <Layers size={20} />;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Could not load categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({
        name: cat.name,
        type: cat.type,
        icon: cat.icon || 'Home'
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        type: 'Property',
        icon: 'Home'
      });
    }
    setIsModalOpen(true);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? Listings using this category will remain, but the category itself will be removed from management.')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        alert('Failed to delete category');
      }
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-dark font-poppins mb-2">Category Management</h1>
          <p className="text-gray-500 font-medium">Create and organize marketplace categories.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-auto"
        >
           <Plus size={20} />
           <span className="text-xs font-black uppercase tracking-widest">Create Category</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden text-[#1A2B4D]">
        <div className="p-6 md:p-8 border-b border-gray-50">
           <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search categories..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-primary/30 transition-all font-medium text-sm"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
           {loading ? (
             <div className="p-20 text-center font-bold text-gray-400">Loading categories...</div>
           ) : filteredCategories.length === 0 ? (
             <div className="p-20 text-center font-bold text-gray-400">No categories found.</div>
           ) : (
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
                  {filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50/30 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                {getIcon(cat.icon)}
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
                              <button 
                                onClick={() => handleOpenModal(cat)}
                                className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                              >
                                <Edit3 size={18} />
                              </button>
                              <button 
                                onClick={() => handleDelete(cat.id)}
                                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                          </div>
                        </td>
                    </tr>
                  ))}
                </tbody>
            </table>
           )}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
               <div>
                <h2 className="text-2xl font-black text-dark font-poppins">{editingCategory ? 'Edit Category' : 'Create Category'}</h2>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Configure marketplace entity</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Category Name</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  placeholder="e.g. Apartments, Concrete Bricks..."
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-primary/30 transition-all font-black text-dark"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Listing Group Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Property', 'Land', 'Material'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({...formData, type: t})}
                      className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                        formData.type === t 
                        ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20'
                        : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Display Icon</label>
                <div className="flex gap-4">
                  {iconOptions.map(opt => (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => setFormData({...formData, icon: opt.name})}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                        formData.icon === opt.name
                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110'
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {opt.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  className="w-full flex items-center justify-center gap-3 py-5 bg-primary text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                   <Save size={18} />
                   <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoryManagement;
