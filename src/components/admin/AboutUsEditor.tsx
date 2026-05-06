"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, X, Upload, Loader2, User, UserPlus, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { uploadFile } from '@/lib/supabase/storage';
import { toast } from 'sonner';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function AboutUsEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [config, setConfig] = useState<any>({
    about: {
      title: "",
      description: "",
      founderStory: { title: "", content: "", image: "" },
      team: []
    }
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
      if (data?.config?.about) {
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
      toast.success('Site content updated successfully');
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
      if (path === 'founder') {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-pink" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tighter mb-2">
            Brand <span className="text-brand-pink italic">Narrative</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Manage founders, team and story</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-4 bg-brand-dark text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:shadow-brand-pink/20 hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-brand-pink" />}
          Sync Brand Intel
        </button>
      </header>

      {/* Main About Section */}
      <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
        <h2 className="text-xl font-black text-brand-dark uppercase tracking-widest flex items-center gap-3">
          <div className="w-2 h-8 bg-brand-pink rounded-full"></div>
          Company Overview
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-3">Main Title</label>
            <input 
              type="text" 
              value={config.about.title}
              onChange={e => setConfig({ ...config, about: { ...config.about, title: e.target.value } })}
              className="w-full px-8 py-5 rounded-2xl bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 focus:outline-none text-xl font-bold text-brand-dark transition-all"
              placeholder="e.g. AtoZ Prints"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-3">Company Description</label>
            <textarea 
              rows={4}
              value={config.about.description}
              onChange={e => setConfig({ ...config, about: { ...config.about, description: e.target.value } })}
              className="w-full px-8 py-5 rounded-2xl bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 focus:outline-none text-base font-medium text-gray-600 leading-relaxed transition-all"
              placeholder="Describe your brand's mission..."
            />
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
        <h2 className="text-xl font-black text-brand-dark uppercase tracking-widest flex items-center gap-3">
          <div className="w-2 h-8 bg-brand-pink rounded-full"></div>
          Founder Story
        </h2>
        
        <div className="grid md:grid-cols-[1fr_300px] gap-10">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-3">Story Title</label>
              <input 
                type="text" 
                value={config.about.founderStory.title}
                onChange={e => setConfig({ 
                  ...config, 
                  about: { 
                    ...config.about, 
                    founderStory: { ...config.about.founderStory, title: e.target.value } 
                  } 
                })}
                className="w-full px-8 py-5 rounded-2xl bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 focus:outline-none text-lg font-bold text-brand-dark transition-all"
                placeholder="e.g. The Visionary Behind AtoZ"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-3">The Narrative</label>
              <textarea 
                rows={6}
                value={config.about.founderStory.content}
                onChange={e => setConfig({ 
                  ...config, 
                  about: { 
                    ...config.about, 
                    founderStory: { ...config.about.founderStory, content: e.target.value } 
                  } 
                })}
                className="w-full px-8 py-5 rounded-2xl bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 focus:outline-none text-sm font-medium text-gray-600 leading-relaxed transition-all"
                placeholder="Tell the story of how it all started..."
              />
            </div>
          </div>
          
          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-3">Founder Image</label>
             <div className="relative aspect-square rounded-[32px] bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden group">
                {config.about.founderStory.image ? (
                  <>
                    <Image src={config.about.founderStory.image} alt="Founder" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button onClick={() => setConfig({ ...config, about: { ...config.about, founderStory: { ...config.about.founderStory, image: '' } } })} className="p-3 bg-white rounded-full text-red-500 shadow-xl hover:scale-110 transition-transform"><X className="w-5 h-5" /></button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-gray-300">
                    {uploading === 'founder' ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                    <span className="text-[10px] font-black uppercase tracking-widest">Upload Portrait</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => handleImageUpload(e, 'founder')}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={!!uploading}
                />
             </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-brand-dark uppercase tracking-widest flex items-center gap-3">
            <div className="w-2 h-8 bg-brand-pink rounded-full"></div>
            The Collective
          </h2>
          <button 
            onClick={addTeamMember}
            className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-brand-dark rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-pink hover:text-white transition-all shadow-sm"
          >
            <UserPlus className="w-4 h-4" /> Add Member
          </button>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {config.about.team?.map((member: any, idx: number) => (
            <div key={idx} className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100 space-y-6 relative group">
              <button 
                onClick={() => removeTeamMember(idx)}
                className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="relative aspect-square rounded-2xl bg-white border border-gray-100 flex flex-col items-center justify-center overflow-hidden group/img">
                {member.image ? (
                  <>
                    <Image src={member.image} alt={member.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                       <button onClick={() => updateTeamMember(idx, 'image', '')} className="p-2 bg-white rounded-full text-red-500 shadow-xl"><X className="w-4 h-4" /></button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-200">
                    {uploading === `team-${idx}` ? <Loader2 className="w-6 h-6 animate-spin" /> : <User className="w-8 h-8" />}
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => handleImageUpload(e, `team-${idx}`)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={!!uploading}
                />
              </div>
              
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={member.name}
                  onChange={e => updateTeamMember(idx, 'name', e.target.value)}
                  placeholder="Name"
                  className="w-full bg-transparent border-b border-gray-200 py-1 text-sm font-black text-brand-dark focus:outline-none focus:border-brand-pink transition-colors"
                />
                <input 
                  type="text" 
                  value={member.role}
                  onChange={e => updateTeamMember(idx, 'role', e.target.value)}
                  placeholder="Role"
                  className="w-full bg-transparent border-b border-gray-100 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest focus:outline-none focus:border-brand-pink transition-colors"
                />
              </div>
            </div>
          ))}
          {(!config.about.team || config.about.team.length === 0) && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-100 rounded-[32px]">
               <Users className="w-12 h-12 text-gray-100 mx-auto mb-4" />
               <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No team members added yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
