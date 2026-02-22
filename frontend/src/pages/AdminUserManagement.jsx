import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Shield, 
  ShieldAlert,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  MapPin,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { userService } from '../services/userService';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      if (!window.confirm(`Are you sure you want to change this user's status to ${status}?`)) return;
      await userService.updateUserStatus(id, status);
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'manager': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'landlord': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      case 'rejected': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-dark font-poppins mb-1">User Management</h1>
          <p className="text-gray-500 font-medium text-sm tracking-tight">Manage roles, permissions and account activations.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden overflow-x-visible">
        <div className="p-4 md:p-8 border-b border-gray-50 flex flex-col md:flex-row gap-4 md:items-center justify-between">
           <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, email or role..." 
                className="w-full pl-12 pr-6 py-3 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-primary/30 transition-all font-medium text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        {/* ── Mobile: Card List ── */}
        <div className="md:hidden divide-y divide-gray-50">
          {loading ? (
            <div className="p-12 text-center text-gray-400 font-bold">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-bold">No users found</div>
          ) : (
            filteredUsers.map((u) => (
              <div key={u.id} className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-dark text-sm">{u.name}</div>
                      <div className="text-[11px] text-gray-400 font-medium truncate max-w-[150px]">{u.email}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${getRoleBadge(u.role)}`}>
                      {u.role}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${getStatusBadge(u.status)}`}>
                       {u.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedUser(u)}
                    className="flex-1 bg-gray-50 text-gray-600 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                  >
                    Details
                  </button>
                  {u.status === 'pending' && (
                    <button 
                      onClick={() => setSelectedUser(u)}
                      className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20"
                    >
                      Review
                    </button>
                  )}
                  {u.status === 'active' && u.role !== 'admin' && (
                    <button 
                      onClick={() => handleStatusUpdate(u.id, 'suspended')}
                      className="flex-1 bg-orange-500 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20"
                    >
                      Suspend
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(u.id)}
                    className="p-2.5 bg-red-50 text-red-500 rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Desktop: Table View ── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-dark">{u.name}</div>
                        <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                          <Mail size={12} />
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getRoleBadge(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mx-auto flex items-center gap-1.5 w-fit ${getStatusBadge(u.status)}`}>
                       {u.status === 'active' && <CheckCircle2 size={12} />}
                       {u.status === 'pending' && <XCircle size={12} />}
                       {u.status === 'suspended' && <ShieldAlert size={12} />}
                       {u.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <div className="flex items-center justify-end gap-3 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedUser(u)}
                          className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          title="View Profile"
                        >
                           <Edit2 size={18} />
                        </button>
                        {u.status === 'pending' && (
                          <button 
                            onClick={() => setSelectedUser(u)}
                            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-1.5"
                            title="Review details"
                          >
                             <Eye size={12} /> Review
                          </button>
                        )}
                        {u.status === 'active' && u.role !== 'admin' && (
                          <button 
                            onClick={() => handleStatusUpdate(u.id, 'suspended')}
                            className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
                          >
                             Suspend
                          </button>
                        )}
                        {u.role !== 'admin' && (
                          <button 
                            onClick={() => handleDelete(u.id)}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                             <Trash2 size={18} />
                          </button>
                        )}
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="p-12 text-center text-gray-400 font-bold">Loading users...</div>}
          {!loading && filteredUsers.length === 0 && <div className="p-12 text-center text-gray-400 font-bold">No users found</div>}
        </div>
      </div>

      {/* ── User Details Modal ── */}
      {selectedUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-dark/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl md:rounded-[2.5rem] shadow-2xl relative animate-in fade-in zoom-in duration-300">
             <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-3xl">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-dark font-poppins">
                    {selectedUser.status === 'pending' ? '🔍 Review Account' : 'User Detail Profile'}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-bold"
                >✕</button>
             </div>
             
             <div className="p-6 md:p-8 space-y-6 md:space-y-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                   <div className="w-20 h-20 md:w-24 md:h-24 bg-primary text-white rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-4xl font-black shadow-lg shadow-primary/20">
                      {selectedUser.name.charAt(0).toUpperCase()}
                   </div>
                   <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl font-black text-dark truncate">{selectedUser.name}</h3>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${getRoleBadge(selectedUser.role)}`}>
                          {selectedUser.role}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusBadge(selectedUser.status)}`}>
                          {selectedUser.status}
                        </span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                    <div className="space-y-4">
                      <div>
                         <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Mail size={10} /> Email</p>
                         <p className="font-bold text-dark text-sm sm:text-base break-all">{selectedUser.email}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar size={10} /> Joined</p>
                         <p className="font-bold text-dark text-sm">{new Date(selectedUser.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                         <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 flex items-center gap-1.5">📱 Phone</p>
                         <p className="font-bold text-dark text-sm">{selectedUser.phone || 'N/A'}</p>
                      </div>
                      {selectedUser.nationalId && (
                        <div>
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Shield size={10} /> ID Number</p>
                          <p className="font-bold text-dark text-sm">{selectedUser.nationalId}</p>
                        </div>
                      )}
                    </div>
                </div>

                {selectedUser.address && (
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3">
                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Business Address</p>
                      <p className="text-xs font-bold text-dark leading-relaxed">{selectedUser.address}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                   {selectedUser.status === 'pending' && (
                     <button 
                       onClick={() => handleStatusUpdate(selectedUser.id, 'active')}
                       className="flex-1 py-3.5 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-500/20 hover:scale-[1.02] transition-all"
                     >Approve Account</button>
                   )}
                   {selectedUser.status === 'active' && selectedUser.role !== 'admin' && (
                     <button 
                       onClick={() => handleStatusUpdate(selectedUser.id, 'suspended')}
                       className="flex-1 py-3.5 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition-all"
                     >Suspend Account</button>
                   )}
                   <div className="flex gap-3 flex-1 sm:flex-none">
                      <button 
                        onClick={() => handleStatusUpdate(selectedUser.id, 'rejected')}
                        className="flex-1 sm:px-6 py-3.5 bg-gray-100 text-gray-400 rounded-2xl font-black text-xs hover:bg-red-50 hover:text-red-500 transition-all uppercase tracking-widest"
                      >Reject</button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
