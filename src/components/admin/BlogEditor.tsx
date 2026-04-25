"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  Loader2, 
  Globe, 
  Eye, 
  Tag, 
  FileText,
  Clock,
  Search,
  CheckCircle2,
  X,
  Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { uploadFile } from '@/lib/supabase/storage';
import { CmsContent } from '@/lib/supabase/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface BlogEditorProps {
  initialData?: Partial<CmsContent>;
  isEditing?: boolean;
}

export default function BlogEditor({ initialData, isEditing = false }: BlogEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<CmsContent>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft',
    type: 'Blog',
    featured_image: '',
    meta_description: '',
    tags: [],
    reading_time: 5,
    author_name: 'Admin',
    ...initialData
  });

  const [tagInput, setTagInput] = useState('');

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, isEditing]);

  const handleSave = async () => {
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error('Please fill in title, slug, and content');
      return;
    }

    setLoading(true);
    try {
      if (isEditing && formData.id) {
        const { error } = await supabase
          .from('cms_content')
          .update({
            ...formData,
            last_modified: new Date().toISOString()
          })
          .eq('id', formData.id);
        if (error) throw error;
        toast.success('Blog post updated successfully');
      } else {
        const { error } = await supabase
          .from('cms_content')
          .insert([formData]);
        if (error) throw error;
        toast.success('Blog post created successfully');
      }
      router.push('/admin/blogs');
      router.refresh();
    } catch (err: any) {
      console.error('Error saving blog:', err);
      toast.error('Failed to save blog: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const url = await uploadFile('public', `blogs/${fileName}`, file);
      setFormData(prev => ({ ...prev, featured_image: url }));
      toast.success('Featured image uploaded');
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    if (tagInput && !formData.tags?.includes(tagInput)) {
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tag) }));
  };

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto min-h-screen">
      <header className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-pink hover:border-brand-pink/20 transition-all shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-brand-dark tracking-tighter mb-1">
              {isEditing ? 'Update' : 'Create'} <span className="text-brand-pink italic">Intelligence</span>
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Matrix Content Management System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setFormData(prev => ({ ...prev, status: prev.status === 'published' ? 'draft' : 'published' }))}
             className={cn(
               "px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-3",
               formData.status === 'published' 
                 ? "bg-green-50 text-green-600 border-green-100" 
                 : "bg-gray-50 text-gray-400 border-gray-100"
             )}
           >
             {formData.status === 'published' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
             {formData.status === 'published' ? 'Published' : 'Draft Mode'}
           </button>
           <button 
             onClick={handleSave}
             disabled={loading}
             className="px-10 py-4 bg-brand-dark text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:shadow-brand-pink/20 hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-50"
           >
             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-brand-pink" />}
             Compile & Sync
           </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_350px] gap-10">
        <div className="space-y-8">
          {/* Main Content Area */}
          <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
             <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-3">Article Title</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter a compelling title..."
                    className="w-full px-8 py-5 rounded-2xl bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 focus:outline-none text-2xl font-black text-brand-dark placeholder:text-gray-200 transition-all"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-3">URL Slug</label>
                    <div className="relative">
                      <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input 
                        type="text" 
                        value={formData.slug}
                        onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        className="w-full pl-12 pr-6 py-4 rounded-xl bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 focus:outline-none text-sm font-bold text-gray-600 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-3">Content Type</label>
                    <select 
                      value={formData.type}
                      onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-6 py-4 rounded-xl bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 focus:outline-none text-sm font-bold text-gray-600 transition-all"
                    >
                      <option value="Blog">Blog Post</option>
                      <option value="Page">Static Page</option>
                      <option value="Campaign">Campaign</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-3">Author Name</label>
                    <input 
                      type="text" 
                      value={formData.author_name}
                      onChange={e => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                      className="w-full px-6 py-4 rounded-xl bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 focus:outline-none text-sm font-bold text-gray-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-3 flex justify-between items-center">
                    Article Body (Markdown Supported)
                    <span className="text-[8px] font-bold text-brand-pink italic">Content Syncs in Real-time</span>
                  </label>
                  <textarea 
                    rows={15}
                    value={formData.content}
                    onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your story here..."
                    className="w-full px-8 py-8 rounded-[32px] bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 focus:outline-none text-base font-medium text-gray-700 leading-relaxed transition-all resize-none"
                  />
                </div>
             </div>
          </section>

          {/* Excerpt section */}
          <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-3">Short Excerpt (Teaser)</label>
             <textarea 
                rows={3}
                value={formData.excerpt}
                onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="A brief summary for cards and lists..."
                className="w-full px-8 py-5 rounded-2xl bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 focus:outline-none text-sm font-bold text-gray-500 transition-all resize-none"
              />
          </section>
        </div>

        {/* Sidebar Settings */}
        <aside className="space-y-8">
           {/* Featured Image */}
           <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-6">Featured Image</label>
              <div className="relative aspect-video rounded-3xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden group">
                 {formData.featured_image ? (
                   <>
                    <Image src={formData.featured_image} alt="Featured" fill className="object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))} className="p-3 bg-white rounded-full text-red-500 hover:scale-110 transition-transform shadow-xl"><X className="w-5 h-5" /></button>
                    </div>
                   </>
                 ) : (
                   <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-300 shadow-sm">
                        {uploading ? <Loader2 className="w-6 h-6 animate-spin text-brand-pink" /> : <ImageIcon className="w-6 h-6" />}
                      </div>
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Click to Upload</span>
                   </div>
                 )}
                 <input 
                   type="file" 
                   accept="image/*"
                   onChange={handleImageUpload}
                   className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                   disabled={uploading}
                 />
              </div>
           </section>

           {/* SEO Settings */}
           <section className="bg-brand-dark p-8 rounded-[40px] shadow-2xl relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Search className="w-32 h-32" /></div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-pink block mb-6 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" /> SEO Optimization
              </label>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <label className="text-[8px] font-black uppercase tracking-widest text-white/40 block mb-2">Meta Description</label>
                  <textarea 
                    rows={3}
                    value={formData.meta_description}
                    onChange={e => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-brand-pink/40 outline-none text-xs font-medium text-white/80 resize-none"
                    placeholder="Search engine description..."
                  />
                </div>
                
                <div>
                   <label className="text-[8px] font-black uppercase tracking-widest text-white/40 block mb-2">Estimated Reading Time</label>
                   <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                      <input 
                        type="number" 
                        value={formData.reading_time}
                        onChange={e => setFormData(prev => ({ ...prev, reading_time: parseInt(e.target.value) || 0 }))}
                        className="w-full pl-12 pr-5 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-pink/40 outline-none text-xs font-black text-white"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black uppercase text-white/20 tracking-widest">MIN</span>
                   </div>
                </div>
              </div>
           </section>

           {/* Tags */}
           <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-6 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" /> Category Tags
              </label>
              <div className="space-y-4">
                 <div className="flex gap-2">
                   <input 
                     type="text" 
                     value={tagInput}
                     onChange={e => setTagInput(e.target.value)}
                     onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                     placeholder="Add a tag..."
                     className="flex-1 px-5 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none text-xs font-bold text-gray-600"
                   />
                   <button onClick={addTag} className="w-11 h-11 bg-brand-pink text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform"><Plus className="w-5 h-5" /></button>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {formData.tags?.map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-gray-100 rounded-lg text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 group">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                    {(!formData.tags || formData.tags.length === 0) && (
                      <p className="text-[10px] font-bold text-gray-300 italic">No tags added yet.</p>
                    )}
                 </div>
              </div>
           </section>
        </aside>
      </div>
    </div>
  );
}
