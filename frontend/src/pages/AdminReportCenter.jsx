import React, { useState } from 'react';
import { 
  AlertCircle, 
  Flag, 
  Trash2, 
  UserX, 
  CheckCircle,
  MoreVertical,
  Search,
  MessageSquare
} from 'lucide-react';

const AdminReportCenter = () => {
  const [reports, setReports] = useState([
    { id: 1, type: 'Listing', target: 'Fake Rental in Kilimani', reason: 'Misleading information', reporter: 'Jane Doe', date: '2026-02-21', status: 'Pending' },
    { id: 2, type: 'User', target: 'Sam Scammer', reason: 'Attempted fraud', reporter: 'John Smith', date: '2026-02-20', status: 'Urgent' },
    { id: 3, type: 'Image', target: 'Asset #4928', reason: 'Inappropriate content', reporter: 'System AI', date: '2026-02-19', status: 'Resolved' },
  ]);

  return (
    <div className="space-y-8 text-[#1A2B4D]">
      <div>
        <h1 className="text-3xl font-black text-dark font-poppins mb-2">Report Center</h1>
        <p className="text-gray-500 font-medium tracking-tight">Review and moderate community reports and violations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
           { label: 'Total Reports', count: 154, color: 'blue' },
           { label: 'Pending Action', count: 12, color: 'orange' },
           { label: 'User Reports', count: 42, color: 'red' },
           { label: 'Resolved', count: 100, color: 'green' },
         ].map((stat, idx) => (
           <div key={idx} className={`p-6 rounded-2xl bg-${stat.color}-50 border border-${stat.color}-100`}>
              <div className={`text-${stat.color}-600 font-black text-[10px] uppercase tracking-widest mb-2`}>{stat.label}</div>
              <div className="text-3xl font-black text-dark tracking-tighter">{stat.count}</div>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between gap-6">
           <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search reports..." 
                className="w-full pl-12 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-primary/30 transition-all font-medium text-sm"
              />
           </div>
           <div className="flex gap-4">
              <button className="px-5 py-3 rounded-xl border border-gray-100 font-bold text-xs text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all">All Objects</button>
              <button className="px-5 py-3 rounded-xl border border-gray-100 font-bold text-xs text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all">Urgent Only</button>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Report Subject</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Moderation</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {reports.map((rep) => (
                   <tr key={rep.id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-8 py-6">
                         <div>
                            <div className="font-bold text-dark">{rep.target}</div>
                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Reported by {rep.reporter} • {rep.date}</div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${rep.type === 'User' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                            {rep.type}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="text-sm font-medium text-gray-500 max-w-xs">{rep.reason}</div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center justify-end gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-dark text-white rounded-lg transition-all text-[10px] font-black uppercase">
                               <UserX size={14} />
                               <span>Ban</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg transition-all text-[10px] font-black uppercase shadow-lg shadow-red-500/20">
                               <Trash2 size={14} />
                               <span>Delete Content</span>
                            </button>
                            <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                               <CheckCircle size={18} />
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

export default AdminReportCenter;
