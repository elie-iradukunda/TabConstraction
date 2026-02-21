import React, { useState } from 'react';
import { 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck,
  Settings,
  Bell,
  Palette
} from 'lucide-react';

const AdminSystemSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'TabiConst',
    siteEmail: 'support@tabiconst.com',
    sitePhone: '+254 700 000 000',
    address: 'Nairobi, Kenya',
    allowGuestRegistration: true,
    enableNotifications: true,
    listingAutoApproval: false
  });

  return (
    <div className="space-y-8 max-w-4xl text-[#1A2B4D]">
      <div>
        <h1 className="text-3xl font-black text-dark font-poppins mb-2">System Settings</h1>
        <p className="text-gray-500 font-medium">Configure global platform parameters and branding.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: Navigation */}
        <div className="space-y-2">
           {[
             { name: 'General Information', icon: <Globe size={18} /> },
             { name: 'Communications', icon: <Mail size={18} /> },
             { name: 'Security & Auth', icon: <ShieldCheck size={18} /> },
             { name: 'Appearance', icon: <Palette size={18} /> },
             { name: 'Notification Rules', icon: <Bell size={18} /> },
           ].map((item, idx) => (
             <button key={idx} className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left font-bold transition-all ${idx === 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-white hover:text-dark border border-transparent'}`}>
                {item.icon}
                <span className="text-sm">{item.name}</span>
             </button>
           ))}
        </div>

        {/* Right Side: Forms */}
        <div className="md:col-span-2 space-y-6">
           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-8">
              <div className="space-y-4">
                 <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Website Branding</h3>
                 <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-dark uppercase tracking-wide px-1">Website Name</label>
                       <input 
                          type="text" 
                          value={settings.siteName}
                          onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-primary/30 font-bold transition-all"
                       />
                    </div>
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-50">
                 <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Contact Channels</h3>
                 <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-dark uppercase tracking-wide px-1">Support Email</label>
                       <input 
                          type="email" 
                          value={settings.siteEmail}
                          onChange={(e) => setSettings({...settings, siteEmail: e.target.value})}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-primary/30 font-bold transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-dark uppercase tracking-wide px-1">Public Phone Number</label>
                       <input 
                          type="text" 
                          value={settings.sitePhone}
                          onChange={(e) => setSettings({...settings, sitePhone: e.target.value})}
                          className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-primary/30 font-bold transition-all"
                       />
                    </div>
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-50">
                 <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Platform Rules</h3>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div>
                          <div className="font-bold text-dark">Auto-Approval</div>
                          <div className="text-xs text-gray-400 font-medium">Bypass manual verification for trusted sellers</div>
                       </div>
                       <div className={`w-12 h-6 rounded-full cursor-pointer transition-all ${settings.listingAutoApproval ? 'bg-primary' : 'bg-gray-200'} relative`} onClick={() => setSettings({...settings, listingAutoApproval: !settings.listingAutoApproval})}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.listingAutoApproval ? 'right-1' : 'left-1'}`}></div>
                       </div>
                    </div>
                    <div className="flex items-center justify-between">
                       <div>
                          <div className="font-bold text-dark">Guest Registration</div>
                          <div className="text-xs text-gray-400 font-medium">Allow anyone to create an account</div>
                       </div>
                       <div className={`w-12 h-6 rounded-full cursor-pointer transition-all ${settings.allowGuestRegistration ? 'bg-primary' : 'bg-gray-200'} relative`} onClick={() => setSettings({...settings, allowGuestRegistration: !settings.allowGuestRegistration})}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.allowGuestRegistration ? 'right-1' : 'left-1'}`}></div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-8">
                 <button className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:opacity-90 transition-all">
                    <Save size={18} />
                    <span>Save All Changes</span>
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemSettings;
