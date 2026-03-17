"use client";

import React from 'react';
import { Settings, Info, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [loading, setLoading] = React.useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Configuration updated successfully!');
    }, 1000);
  };

  return (
    <div className="p-12 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-brand-dark tracking-tighter mb-2">System <span className="text-brand-pink">Settings</span></h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Configure Storefront and Business Logic</p>
      </header>

      <div className="space-y-10">
        <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-100">
           <h2 className="text-xl font-extrabold text-brand-dark mb-8 flex items-center gap-3">
              <div className="p-2 bg-brand-pink/10 rounded-xl">
                 <Settings className="h-5 w-5 text-brand-pink" />
              </div>
              General Configuration
           </h2>
           
           <div className="space-y-6">
              <div>
                 <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                    Store Name
                    <Info className="h-3 w-3" />
                 </label>
                 <input 
                   type="text" 
                   defaultValue="A to Z Prints"
                   className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-bold text-brand-dark"
                 />
              </div>
              <div>
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Business Email</label>
                 <input 
                   type="email" 
                   defaultValue="orders@atozprints.com"
                   className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-bold text-brand-dark"
                 />
              </div>
           </div>
        </section>

        <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-100">
           <h2 className="text-xl font-extrabold text-brand-dark mb-8 flex items-center gap-3">
              <div className="p-2 bg-brand-cyan/10 rounded-xl">
                 <Save className="h-5 w-5 text-brand-cyan" />
              </div>
              Production Defaults
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Default Production Days</label>
                 <input 
                   type="number" 
                   defaultValue="7"
                   className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-bold text-brand-dark"
                 />
              </div>
              <div>
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Support Phone</label>
                 <input 
                   type="text" 
                   defaultValue="+91 98765 43210"
                   className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-bold text-brand-dark"
                 />
              </div>
           </div>
        </section>

        <div className="flex justify-end pt-6">
           <button 
             onClick={handleSave}
             disabled={loading}
             className="px-12 py-5 bg-brand-dark text-white rounded-full font-black text-lg hover:shadow-2xl hover:shadow-gray-200 transition-all active:scale-95 flex items-center gap-3"
           >
             {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
             Save Configuration
           </button>
        </div>
      </div>
    </div>
  );
}
