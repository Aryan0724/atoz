"use client";

import React, { useState } from 'react';
import { Settings, Info, Save, Loader2, LayoutPanelTop, FileJson, Megaphone } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

export default function SettingsClient({ initialConfig }: { initialConfig: any }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'banner' | 'pricing'>('hero');

  // Fields state
  const [heroTitle, setHeroTitle] = useState(initialConfig?.hero?.title || '');
  const [heroSubtitle, setHeroSubtitle] = useState(initialConfig?.hero?.subtitle || '');
  const [heroImage, setHeroImage] = useState(initialConfig?.hero?.image || '');

  const [bannerText, setBannerText] = useState(initialConfig?.topBanner?.text || '');
  const [bannerActive, setBannerActive] = useState(initialConfig?.topBanner?.isActive !== false);

  const [pricingJsonStr, setPricingJsonStr] = useState(JSON.stringify(initialConfig?.pricing || {}, null, 2));

  const handleSave = async () => {
    setLoading(true);
    let validPricingData = {};

    try {
      validPricingData = JSON.parse(pricingJsonStr);
    } catch (err) {
      toast.error('Invalid JSON format in Pricing settings!');
      setLoading(false);
      return;
    }

    const payload = {
      hero: {
        title: heroTitle,
        subtitle: heroSubtitle,
        image: heroImage,
      },
      topBanner: {
        text: bannerText,
        isActive: bannerActive,
      },
      pricing: validPricingData
    };

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'global', config: payload });

      if (error) throw error;
      toast.success('Global Configuration synced live!');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to sync settings. Ensure you have admin rights.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex border-b border-gray-100 bg-gray-50/50 p-4 gap-4">
        <button 
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'hero' ? 'bg-brand-dark text-white shadow-xl' : 'text-gray-400 hover:bg-gray-100'}`}
        >
          <LayoutPanelTop className="w-4 h-4" /> Hero Section
        </button>
        <button 
          onClick={() => setActiveTab('banner')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'banner' ? 'bg-brand-dark text-white shadow-xl' : 'text-gray-400 hover:bg-gray-100'}`}
        >
          <Megaphone className="w-4 h-4" /> Top Banner
        </button>
        <button 
          onClick={() => setActiveTab('pricing')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'pricing' ? 'bg-brand-dark text-white shadow-xl' : 'text-gray-400 hover:bg-gray-100'}`}
        >
          <FileJson className="w-4 h-4" /> Pricing Config (JSON)
        </button>
      </div>

      <div className="p-10">
        {activeTab === 'hero' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Primary Title (supports \n for line breaks)</label>
                <textarea 
                  rows={3}
                  value={heroTitle}
                  onChange={e => setHeroTitle(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 focus:ring-4 focus:ring-brand-pink/10 transition-all outline-none font-bold text-brand-dark resize-none"
                />
             </div>
             <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Secondary Subtitle</label>
                <textarea 
                  rows={3}
                  value={heroSubtitle}
                  onChange={e => setHeroSubtitle(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 focus:ring-4 focus:ring-brand-pink/10 transition-all outline-none font-bold text-brand-dark resize-none"
                />
             </div>
             <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Hero Image Splash URL</label>
                <input 
                  type="url"
                  value={heroImage}
                  onChange={e => setHeroImage(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 focus:ring-4 focus:ring-brand-pink/10 transition-all outline-none font-bold text-brand-dark"
                />
             </div>
          </div>
        )}

        {activeTab === 'banner' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div>
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                   Announcement Text
                   <Info className="h-3 w-3" />
                </label>
                <input 
                  type="text" 
                  value={bannerText}
                  onChange={e => setBannerText(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 focus:ring-4 focus:ring-brand-pink/10 transition-all outline-none font-bold text-brand-dark"
                />
             </div>
             <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-2xl">
                <input 
                  type="checkbox" 
                  id="bannerActive"
                  checked={bannerActive}
                  onChange={e => setBannerActive(e.target.checked)}
                  className="w-6 h-6 rounded text-brand-pink focus:ring-brand-pink"
                />
                <label htmlFor="bannerActive" className="text-sm font-black text-brand-dark cursor-pointer select-none tracking-tight">Enable Top Banner Globally</label>
             </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
             <div className="flex items-start gap-4 p-6 bg-pink-50 text-brand-pink rounded-3xl mb-4">
                <Info className="h-6 w-6 shrink-0" />
                <p className="text-xs font-bold leading-relaxed">
                   <strong>Advanced System Access:</strong> This is a RAW JSON editor mapped directly to the Pricing Client components. Modify categories, base tiers, arrays, and scale pricing instantly. Ensure valid JSON arrays.
                </p>
             </div>
             
             <textarea 
               value={pricingJsonStr}
               onChange={e => setPricingJsonStr(e.target.value)}
               className="w-full h-[500px] font-mono text-sm px-6 py-6 rounded-3xl bg-gray-900 text-green-400 focus:outline-none focus:ring-4 focus:ring-brand-pink/20 selection:bg-brand-pink/30"
               spellCheck={false}
             />
          </div>
        )}

        <div className="flex justify-end pt-10 border-t border-gray-100 mt-10">
           <button 
             onClick={handleSave}
             disabled={loading}
             className="px-12 py-5 bg-brand-dark text-white rounded-full font-black text-xs tracking-widest uppercase hover:shadow-2xl hover:shadow-brand-pink/20 hover:bg-brand-pink transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
           >
             {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
             Commit Changes
           </button>
        </div>
      </div>
    </div>
  );
}
