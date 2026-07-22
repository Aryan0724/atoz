"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, X, Upload, Loader2, User, UserPlus, Zap, Image as ImageIcon, MessageSquare, Layout, Info, Target, Award, ShieldCheck, Truck } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { uploadFile } from '@/lib/supabase/storage';
import { toast } from 'sonner';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function HomeContentEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [config, setConfig] = useState<any>({
    hero: { title: "", subtitle: "", image: "", badges: [] },
    about: { title: "", description: "", founderStory: { title: "", content: "", image: "" }, team: [] },
    features: { title: "", subtitle: "", items: [] },
    home_faq: { title: "", items: [] },
    home_cta: { title: "", description: "" }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('config')
        .eq('id', 'global')
        .single();
      
      if (error) throw error;
      if (data?.config) {
        setConfig(data.config);
      }
    } catch (err: any) {
      toast.error('Failed to load settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ config, updated_at: new Date().toISOString() })
        .eq('id', 'global');
      
      if (error) throw error;
      toast.success('Home page content updated successfully');
    } catch (err: any) {
      toast.error('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(path);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const url = await uploadFile('public', `site/${fileName}`, file);
      
      const newConfig = { ...config };
      if (path === 'hero') {
        newConfig.hero.image = url;
      } else if (path === 'founder') {
        if (!newConfig.about.founderStory) newConfig.about.founderStory = {};
        newConfig.about.founderStory.image = url;
      } else if (path.startsWith('team-')) {
        const index = parseInt(path.split('-')[1]);
        newConfig.about.team[index].image = url;
      }
      
      setConfig(newConfig);
      toast.success('Image uploaded');
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(null);
    }
  };

  // Team Helpers
  const addTeamMember = () => {
    const newConfig = { ...config };
    if (!newConfig.about.team) newConfig.about.team = [];
    newConfig.about.team.push({ name: '', role: '', image: '' });
    setConfig(newConfig);
  };

  const removeTeamMember = (index: number) => {
    const newConfig = { ...config };
    newConfig.about.team.splice(index, 1);
    setConfig(newConfig);
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const newConfig = { ...config };
    newConfig.about.team[index][field] = value;
    setConfig(newConfig);
  };

  // FAQ Helpers
  const addFaqItem = () => {
    const newConfig = { ...config };
    if (!newConfig.home_faq.items) newConfig.home_faq.items = [];
    newConfig.home_faq.items.push({ q: '', a: '' });
    setConfig(newConfig);
  };

  const removeFaqItem = (index: number) => {
    const newConfig = { ...config };
    newConfig.home_faq.items.splice(index, 1);
    setConfig(newConfig);
  };

  const updateFaqItem = (index: number, field: string, value: string) => {
    const newConfig = { ...config };
    newConfig.home_faq.items[index][field] = value;
    setConfig(newConfig);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-40">
      <header className="flex justify-between items-end bg-brand-dark p-12 rounded-[40px] text-white">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-4">
            Home Page <span className="text-brand-gold italic">Control</span>
          </h1>
          <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Total authority over your digital presence</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-10 py-5 bg-brand-gold text-brand-dark font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:bg-white transition-all flex items-center gap-3 disabled:opacity-50 rounded-2xl"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Deploy Live Content
        </button>
      </header>

      {/* 1. HERO SECTION EDITOR */}
      <section className="bg-white p-12 rounded-[50px] border border-gray-100 shadow-xl space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-gold/10 rounded-2xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-brand-gold" />
          </div>
          <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tighter">Hero Section</h2>
        </div>
        
        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
          <div className="space-y-8">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block mb-4">Main Heading (HTML Support)</label>
              <textarea 
                value={config.hero?.title}
                onChange={e => setConfig({ ...config, hero: { ...config.hero, title: e.target.value } })}
                className="w-full px-8 py-6 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-brand-gold/20 focus:bg-white focus:outline-none text-2xl font-bold text-brand-dark leading-tight"
                rows={3}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block mb-4">Supporting Narrative</label>
              <textarea 
                value={config.hero?.subtitle}
                onChange={e => setConfig({ ...config, hero: { ...config.hero, subtitle: e.target.value } })}
                className="w-full px-8 py-6 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-brand-gold/20 focus:bg-white focus:outline-none text-base font-medium text-gray-500 leading-relaxed"
                rows={4}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block">Featured Visual</label>
            <div className="relative aspect-[4/5] rounded-[40px] bg-gray-100 border-2 border-dashed border-gray-200 overflow-hidden group">
              {config.hero?.image ? (
                <>
                  <Image 
                    src={(() => {
                      const img = Array.isArray(config.hero.image) ? config.hero.image[0] : config.hero.image;
                      if (!img || img.includes('photo-1616628188506-4bd8d62c908d')) {
                        return "/images/hero/hero_showcase.png";
                      }
                      return img;
                    })()} 
                    alt="Hero" 
                    fill 
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => setConfig({ ...config, hero: { ...config.hero, image: '' } })} className="p-4 bg-white rounded-full text-red-500 shadow-2xl"><X className="w-6 h-6" /></button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 text-gray-400 h-full justify-center">
                  {uploading === 'hero' ? <Loader2 className="w-10 h-10 animate-spin" /> : <ImageIcon className="w-10 h-10" />}
                  <span className="text-[10px] font-black uppercase tracking-widest">Click to Upload</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'hero')} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT & FOUNDER (Expanded) */}
      <section className="bg-white p-12 rounded-[50px] border border-gray-100 shadow-xl space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Info className="w-6 h-6 text-blue-500" />
          </div>
          <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tighter">About & Origin Story</h2>
        </div>

        <div className="space-y-10">
          <div className="grid md:grid-cols-2 gap-8">
             <div>
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block mb-4">Mission Title</label>
                <input 
                  type="text" 
                  value={config.about?.title}
                  onChange={e => setConfig({ ...config, about: { ...config.about, title: e.target.value } })}
                  className="w-full px-8 py-6 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-200 focus:bg-white focus:outline-none font-bold"
                />
             </div>
             <div>
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block mb-4">Founder Name/Role</label>
                <input 
                  type="text" 
                  value={config.about?.founderStory?.title}
                  onChange={e => setConfig({ ...config, about: { ...config.about, founderStory: { ...config.about.founderStory, title: e.target.value } } })}
                  className="w-full px-8 py-6 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-200 focus:bg-white focus:outline-none font-bold"
                />
             </div>
          </div>
          
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block mb-4">Company Overview</label>
            <textarea 
              value={config.about?.description}
              onChange={e => setConfig({ ...config, about: { ...config.about, description: e.target.value } })}
              className="w-full px-8 py-6 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-blue-200 focus:bg-white focus:outline-none text-base font-medium leading-relaxed"
              rows={4}
            />
          </div>

          <div className="grid lg:grid-cols-[200px_1fr] gap-8 items-start">
             <div className="relative aspect-square rounded-3xl bg-gray-100 overflow-hidden group">
                {config.about?.founderStory?.image ? (
                   <>
                    <Image src={config.about.founderStory.image} alt="Founder" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => setConfig({ ...config, about: { ...config.about, founderStory: { ...config.about.founderStory, image: '' } } })} className="p-2 bg-white rounded-full text-red-500"><X className="w-4 h-4" /></button>
                    </div>
                   </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                    <User className="w-8 h-8" />
                    <span className="text-[8px] font-black uppercase">Portrait</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'founder')} className="absolute inset-0 opacity-0 cursor-pointer" />
             </div>
             <div>
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block mb-4">Founder Narrative</label>
                <textarea 
                  value={config.about?.founderStory?.content}
                  onChange={e => setConfig({ ...config, about: { ...config.about, founderStory: { ...config.about.founderStory, content: e.target.value } } })}
                  className="w-full px-8 py-6 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-blue-200 focus:bg-white focus:outline-none text-sm font-medium leading-relaxed italic"
                  rows={5}
                />
             </div>
          </div>
        </div>
      </section>

      {/* 3. TEAM COLLECTIVE */}
      <section className="bg-white p-12 rounded-[50px] border border-gray-100 shadow-xl space-y-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-purple-500" />
            </div>
            <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tighter">The Collective</h2>
          </div>
          <button onClick={addTeamMember} className="px-6 py-3 bg-brand-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-purple-600 transition-all">
            <Plus className="w-4 h-4" /> Add Member
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {config.about?.team?.map((member: any, idx: number) => (
             <div key={idx} className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 relative group">
                <button onClick={() => removeTeamMember(idx)} className="absolute -top-2 -right-2 w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10"><X className="w-4 h-4" /></button>
                <div className="relative aspect-[4/5] rounded-2xl bg-white mb-6 overflow-hidden group/img">
                   {member.image ? (
                     <Image src={member.image} alt={member.name} fill className="object-cover" />
                   ) : (
                     <div className="flex items-center justify-center h-full text-gray-200"><User className="w-12 h-12" /></div>
                   )}
                   <input type="file" accept="image/*" onChange={e => handleImageUpload(e, `team-${idx}`)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <input 
                  type="text" 
                  value={member.name} 
                  onChange={e => updateTeamMember(idx, 'name', e.target.value)}
                  placeholder="Member Name"
                  className="w-full bg-transparent border-b border-gray-200 mb-2 py-1 text-sm font-black text-brand-dark focus:outline-none focus:border-purple-500"
                />
                <input 
                  type="text" 
                  value={member.role} 
                  onChange={e => updateTeamMember(idx, 'role', e.target.value)}
                  placeholder="Role"
                  className="w-full bg-transparent border-b border-gray-100 py-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest focus:outline-none focus:border-purple-500"
                />
             </div>
           ))}
        </div>
      </section>

      {/* 4. FAQ & INSIGHTS EDITOR */}
      <section className="bg-white p-12 rounded-[50px] border border-gray-100 shadow-xl space-y-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tighter">FAQ Knowledge Base</h2>
          </div>
          <button onClick={addFaqItem} className="px-6 py-3 bg-brand-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-green-600 transition-all">
            <Plus className="w-4 h-4" /> Add FAQ
          </button>
        </div>

        <div className="space-y-6">
           {config.home_faq?.items?.map((item: any, idx: number) => (
             <div key={idx} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex gap-8 items-start relative group">
                <button onClick={() => removeFaqItem(idx)} className="absolute -top-2 -right-2 w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all"><X className="w-4 h-4" /></button>
                <span className="text-3xl font-black text-green-200 mt-2">{String(idx + 1).padStart(2, '0')}</span>
                <div className="flex-1 space-y-4">
                   <input 
                    type="text" 
                    value={item.q}
                    onChange={e => updateFaqItem(idx, 'q', e.target.value)}
                    placeholder="The Question"
                    className="w-full bg-white px-6 py-4 rounded-xl border border-transparent focus:border-green-200 focus:outline-none font-bold text-brand-dark"
                   />
                   <textarea 
                    value={item.a}
                    onChange={e => updateFaqItem(idx, 'a', e.target.value)}
                    placeholder="The Expert Answer"
                    className="w-full bg-white px-6 py-4 rounded-xl border border-transparent focus:border-green-200 focus:outline-none text-sm font-medium text-gray-500 leading-relaxed"
                    rows={3}
                   />
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION EDITOR */}
      <section className="bg-brand-dark p-12 rounded-[50px] shadow-2xl space-y-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <Layout className="w-6 h-6 text-brand-gold" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Final Conversion (CTA)</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
           <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 block mb-4">CTA Heading</label>
              <input 
                type="text" 
                value={config.home_cta?.title}
                onChange={e => setConfig({ ...config, home_cta: { ...config.home_cta, title: e.target.value } })}
                className="w-full bg-white/5 border border-white/10 px-8 py-6 rounded-2xl text-white font-bold focus:border-brand-gold focus:outline-none transition-all"
              />
           </div>
           <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 block mb-4">CTA Description</label>
              <input 
                type="text" 
                value={config.home_cta?.description}
                onChange={e => setConfig({ ...config, home_cta: { ...config.home_cta, description: e.target.value } })}
                className="w-full bg-white/5 border border-white/10 px-8 py-6 rounded-2xl text-white font-bold focus:border-brand-gold focus:outline-none transition-all"
              />
           </div>
        </div>
      </section>
    </div>
  );
}
