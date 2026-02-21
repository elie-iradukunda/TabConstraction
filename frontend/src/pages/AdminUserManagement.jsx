import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MoreVertical, 
  Search, 
  Filter, 
  Mail, 
  Shield, 
  ShieldAlert,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { userService } from '../services/userService';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
      await userService.updateUserStatus(id, status);
      setUsers(users.map(u => u.id === id ? { ...u, status } : l));
      fetchUsers(); // Refresh logic
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
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        const data = await userService.getUsers();
        if (data.success) setUsers(data.users);
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-dark font-poppins mb-2">User Management</h1>
          <p className="text-gray-500 font-medium tracking-tight">Manage roles, permissions and account activations.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden text-[#1A2B4D]">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-6 md:items-center justify-between">
           <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, email or role..." 
                className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-primary/30 transition-all font-medium text-sm"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
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
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        {u.name.charAt(0)}
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
                  <td className="px-8 py-6">
                     <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        {u.status === 'pending' && (
                          <button 
                            onClick={() => handleStatusUpdate(u.id, 'active')}
                            className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all"
                          >
                             Approve
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
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
