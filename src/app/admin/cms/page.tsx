"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Layout, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  TrendingUp,
  Loader2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { supabase } from '@/lib/supabase/client';
import { CmsContent } from '@/lib/supabase/types';
import { toast } from 'sonner';

export default function CMSPage() {
  const [items, setItems] = useState<CmsContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editItem, setEditItem] = useState<Partial<CmsContent> | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .order('last_modified', { ascending: false });

    if (error) toast.error(error.message);
    else setItems(data || []);
    setLoading(false);
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem?.title || !editItem?.type) return;

    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const payload = {
      ...editItem,
      author_id: user?.id,
      author_name: user?.user_metadata?.full_name || 'Admin',
      last_modified: new Date().toISOString()
    };

    let error;
    if (editItem.id) {
      const { error: err } = await supabase
        .from('cms_content')
        .update(payload)
        .eq('id', editItem.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('cms_content')
        .insert([{ ...payload, slug: editItem.slug || editItem.title.toLowerCase().replace(/ /g, '-') }]);
      error = err;
    }

    if (error) toast.error(error.message);
    else {
      toast.success(editItem.id ? 'Content updated' : 'Content created');
      setShowForm(false);
      setEditItem(null);
      fetchContent();
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    const { error } = await supabase.from('cms_content').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Content deleted');
      fetchContent();
    }
  };

  const filteredItems = items.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-12 max-w-7xl mx-auto min-h-screen">
      <header className="mb-12 flex items-center justify-between">
        <div>
           <Breadcrumbs items={[{ label: 'Admin' }, { label: 'CMS' }]} />
           <h1 className="text-4xl font-black text-brand-dark tracking-tighter mb-2">Content <span className="text-brand-pink">Management</span></h1>
           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">AtoZ Brand Content Engine</p>
        </div>
        <button 
          onClick={() => { setEditItem({ type: 'Page', status: 'draft' }); setShowForm(true); }}
          className="flex items-center gap-3 px-8 py-4 bg-brand-pink text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-pink-100 hover:-translate-y-1 transition-all italic"
        >
           <Plus className="h-4 w-4" />
           New Content
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
         {/* Main Content List */}
         <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 mb-10">
               <div className="relative flex-1">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search campaigns, blogs, or site pages..." 
                    className="w-full pl-16 pr-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-pink/20 transition-all text-sm font-bold uppercase tracking-widest outline-none"
                  />
               </div>
            </div>

            <div className="bg-white rounded-[48px] shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Registry Overview</span>
                  <div className="flex gap-4">
                     <button className="text-[10px] font-black text-brand-pink uppercase tracking-widest">All {items.length}</button>
                  </div>
               </div>
               
               <div className="divide-y divide-gray-50">
                  {loading ? (
                    <div className="p-20 flex flex-col items-center gap-4">
                       <Loader2 className="h-10 w-10 text-brand-pink animate-spin" />
                       <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic font-bold">Synchronizing content...</span>
                    </div>
                  ) : filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <div key={item.id} className="p-8 flex items-center justify-between group hover:bg-gray-50/50 transition-all">
                        <div className="flex items-center gap-6">
                           <div className={cn(
                             "w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg",
                             item.type === 'Campaign' ? "bg-brand-pink text-white" : 
                             item.type === 'Blog' ? "bg-brand-cyan text-white" : "bg-brand-dark text-white"
                           )}>
                              {item.type === 'Campaign' ? <TrendingUp className="h-6 w-6" /> : 
                               item.type === 'Blog' ? <FileText className="h-6 w-6" /> : <Layout className="h-6 w-6" />}
                           </div>
                           <div>
                              <h4 className="font-black text-brand-dark text-xl tracking-tight mb-1">{item.title}</h4>
                              <div className="flex items-center gap-3 text-[9px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">
                                 <span>{item.type}</span>
                                 <span className="text-gray-200">/</span>
                                 <span>{item.author_name}</span>
                                 <span className="text-gray-200">/</span>
                                 <span>{new Date(item.last_modified!).toLocaleDateString()}</span>
                              </div>
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-8">
                           <div className={cn(
                              "px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border",
                              item.status === 'published' ? "bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20" : "bg-amber-50 text-amber-600 border-amber-100"
                           )}>
                              {item.status}
                           </div>
                           <div className="flex items-center gap-3">
                              <button 
                                onClick={() => { setEditItem(item); setShowForm(true); }}
                                className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-brand-pink hover:border-brand-pink/20 transition-all shadow-sm"
                              >
                                 <Edit3 className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(item.id)}
                                className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
                              >
                                 <Trash2 className="h-4 w-4" />
                              </button>
                           </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-32 flex flex-col items-center justify-center text-center opacity-20">
                       <FileText className="h-16 w-16 mb-4" />
                       <p className="text-sm font-black uppercase tracking-widest">No matching content records found</p>
                    </div>
                  )}
               </div>
            </div>
         </div>

         {/* Stats Sidebar */}
         <div className="space-y-10">
            <div className="bg-brand-dark rounded-[48px] p-10 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
               <h3 className="text-xl font-black mb-10 flex items-center justify-between tracking-tight uppercase italic pb-6 border-b border-white/10">
                  Content <span className="text-brand-pink">Intel</span>
                  <TrendingUp className="h-5 w-5 text-brand-pink" />
               </h3>
               <div className="space-y-8">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-2">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">Indexability</span>
                     <div className="text-3xl font-black text-white italic">Elite <span className="text-brand-pink text-sm non-italic ml-1">98%</span></div>
                  </div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-2">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">Live Records</span>
                     <div className="text-3xl font-black text-white italic">{items.length} <span className="text-brand-cyan text-sm non-italic ml-1">Items</span></div>
                  </div>
               </div>
            </div>

            <div className="p-10 bg-gray-50 rounded-[48px] border border-gray-100">
               <h4 className="text-[10px] font-black text-brand-dark uppercase tracking-widest mb-8 border-b border-gray-200 pb-4 italic">Library Categories</h4>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col items-center gap-3 group/item cursor-pointer hover:border-brand-pink transition-all">
                     <ImageIcon className="h-6 w-6 text-brand-pink group-hover/item:scale-110 transition-transform" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Assets</span>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col items-center gap-3 group/item cursor-pointer hover:border-brand-pink transition-all">
                     <Layout className="h-6 w-6 text-brand-cyan group-hover/item:scale-110 transition-transform" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Pages</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Content Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-dark/20 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-3xl font-black text-brand-dark italic tracking-tight uppercase">
                {editItem?.id ? 'Edit' : 'Deploy New'} <span className="text-brand-pink">Content</span>
              </h2>
              <button 
                onClick={() => { setShowForm(false); setEditItem(null); }}
                className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-brand-dark transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrUpdate} className="p-10 space-y-8 overflow-y-auto">
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Content Type</label>
                     <select 
                       value={editItem?.type}
                       onChange={(e) => setEditItem({ ...editItem, type: e.target.value as any })}
                       className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-bold text-sm tracking-widest uppercase italic"
                     >
                        <option value="Page">Site Page</option>
                        <option value="Blog">Blog Post</option>
                        <option value="Campaign">Campaign</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                     <select 
                       value={editItem?.status}
                       onChange={(e) => setEditItem({ ...editItem, status: e.target.value as any })}
                       className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-bold text-sm tracking-widest uppercase italic"
                     >
                        <option value="draft">Review Draft</option>
                        <option value="published">Deploy Public</option>
                     </select>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Internal Reference Title</label>
                  <input 
                    type="text" 
                    value={editItem?.title || ''}
                    onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                    placeholder="e.g. Summer 2026 Promotional Campaign"
                    className="w-full px-8 py-5 rounded-[24px] bg-gray-50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-black text-lg text-brand-dark tracking-tight shadow-inner"
                    required
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">System Slug (URL Path)</label>
                  <input 
                    type="text" 
                    value={editItem?.slug || ''}
                    onChange={(e) => setEditItem({ ...editItem, slug: e.target.value })}
                    placeholder="summer-collection-2026"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent font-bold text-xs tracking-widest text-gray-400 outline-none shadow-inner"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rich Content (Markdown/Text)</label>
                  <textarea 
                    rows={6}
                    value={editItem?.content || ''}
                    onChange={(e) => setEditItem({ ...editItem, content: e.target.value })}
                    className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-medium text-sm leading-relaxed shadow-inner no-scrollbar"
                    placeholder="Write your content here..."
                  />
               </div>

               <button 
                 disabled={isSaving}
                 className="w-full py-6 bg-brand-dark text-white rounded-3xl font-black uppercase text-xs tracking-[0.25em] shadow-2xl shadow-brand-dark/20 hover:bg-brand-pink hover:-translate-y-1 transition-all flex items-center justify-center gap-4 italic disabled:opacity-50"
               >
                 {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : editItem?.id ? 'Deploy Update' : 'Initialize Content'}
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
