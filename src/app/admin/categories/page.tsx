"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase/client';
import { 
  Package, 
  Plus, 
  Layout, 
  Trash2, 
  Edit3, 
  CheckCircle2,
  X,
  Loader2,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  image: string | null;
  is_service: boolean;
  product_count?: number;
}

const STANDARD_CATEGORIES = [
  { name: 'Apparel', slug: 'apparel', desc: 'T-Shirts, Hoodies, Corporate Uniforms' },
  { name: 'Drinkware', slug: 'drinkware', desc: 'Mugs, Tumblers, Bottles' },
  { name: 'Stationery', slug: 'stationery', desc: 'Business Cards, Letterheads, Pens' },
  { name: 'Packaging', slug: 'packaging', desc: 'Custom Boxes, Tapes, Mailers' },
  { name: 'Signage', slug: 'signage', desc: 'Posters, Banners, Standees' }
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [image, setImage] = useState('');
  const [isService, setIsService] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.warn("Categories fetch error:", error);
        setCategories([]);
      } else {
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { uploadFile } = await import('@/lib/supabase/storage');
      const url = await uploadFile('public', `categories/${Date.now()}-${file.name}`, file);
      if (url) {
        setImage(url);
        toast.success("Image uploaded!");
      }
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = name.toLowerCase().replace(/ /g, '-');
    
    try {
      const payload = { 
        name, 
        slug, 
        long_description: longDescription, 
        image, 
        is_service: isService 
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', editingCategory.id);
        if (error) throw error;
        toast.success("Category updated successfully!");
      } else {
        const { error } = await supabase
          .from('categories')
          .insert(payload);
        
        if (error) {
          if (error.code === '23505') {
            toast.error("Category already exists.");
          } else {
            throw error;
          }
          return;
        }
        toast.success("Category created successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchCategories();
    } catch (err: any) {
      toast.error(`Database Error: ${err.message || "Failed to save category"}`);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setLongDescription('');
    setImage('');
    setIsService(false);
    setEditingCategory(null);
  };

  const handleDelete = async (id: string, slug: string) => {
    if (STANDARD_CATEGORIES.some(c => c.slug === slug)) {
      if (!confirm("WARNING: This is a core standard category. Proceed?")) return;
    } else {
      if (!confirm("Are you sure you want to delete this category?")) return;
    }
    
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  const seedStandardCategories = async () => {
    setSeeding(true);
    try {
      const existingSlugs = categories.map(c => c.slug);
      const toInsert = STANDARD_CATEGORIES.filter(sc => !existingSlugs.includes(sc.slug))
        .map(sc => ({ name: sc.name, slug: sc.slug }));

      if (toInsert.length === 0) {
        toast.info("Standard categories are already active.");
        setSeeding(false);
        return;
      }

      const { error } = await supabase.from('categories').insert(toInsert);
      if (error) throw error;
      toast.success(`${toInsert.length} categories integrated.`);
      fetchCategories();
    } catch (err: any) {
      toast.error("Failed to seed categories.");
    } finally {
      setSeeding(false);
    }
  };

  const standardSlugs = STANDARD_CATEGORIES.map(c => c.slug);
  const coreCategories = categories.filter(c => standardSlugs.includes(c.slug));
  const customCategories = categories.filter(c => !standardSlugs.includes(c.slug));

  const missingCoreCount = STANDARD_CATEGORIES.length - coreCategories.length;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 pb-32">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-brand-dark tracking-tighter italic mb-2">Category <span className="text-brand-pink">Studio</span></h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Master control for store taxonomy and service catalogs.</p>
          </div>
          
          <div className="flex gap-4">
            {missingCoreCount > 0 && (
              <button 
                onClick={seedStandardCategories}
                disabled={seeding}
                className="px-6 py-3 bg-white text-brand-cyan border-2 border-brand-cyan/20 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-brand-cyan hover:text-white transition-all flex items-center gap-3 italic"
              >
                {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                Deploy Cores ({missingCoreCount})
              </button>
            )}
            <button 
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="px-6 py-3 bg-brand-dark text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-brand-dark/10 hover:bg-brand-pink hover:shadow-brand-pink/20 transition-all flex items-center gap-3 italic"
            >
              <Plus className="h-4 w-4" /> New Category
            </button>
          </div>
        </header>

        {loading ? (
           <div className="flex items-center justify-center py-20 text-brand-pink"><Loader2 className="h-10 w-10 animate-spin" /></div>
        ) : (
          <div className="space-y-16">
             {/* Core System Categories */}
             <section>
                <h3 className="text-sm font-black text-gray-400 tracking-[0.2em] uppercase mb-6 flex items-center gap-3">
                  <div className="h-px bg-gray-200 flex-1" /> Standard Categories <div className="h-px bg-gray-200 flex-1" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coreCategories.map((cat) => (
                    <CategoryCard 
                      key={cat.id} 
                      cat={cat} 
                      isCore={true} 
                      onEdit={(c) => { 
                        setEditingCategory(c); 
                        setName(c.name); 
                        setLongDescription(c.long_description || '');
                        setImage(c.image || '');
                        setIsService(c.is_service);
                        setIsModalOpen(true); 
                      }} 
                      onDelete={() => handleDelete(cat.id, cat.slug)} 
                    />
                  ))}
                </div>
             </section>

             {/* Custom Categories */}
             <section>
                <h3 className="text-sm font-black text-gray-400 tracking-[0.2em] uppercase mb-6 flex items-center gap-3">
                  <div className="h-px bg-brand-pink/20 flex-1" /> Premium Services & Custom <div className="h-px bg-brand-pink/20 flex-1" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customCategories.map((cat) => (
                    <CategoryCard 
                      key={cat.id} 
                      cat={cat} 
                      isCore={false} 
                      onEdit={(c) => { 
                        setEditingCategory(c); 
                        setName(c.name); 
                        setLongDescription(c.long_description || '');
                        setImage(c.image || '');
                        setIsService(c.is_service);
                        setIsModalOpen(true); 
                      }} 
                      onDelete={() => handleDelete(cat.id, cat.slug)} 
                    />
                  ))}
                </div>
             </section>
          </div>
        )}

        {/* Modal Logic */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-dark/40 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden relative border border-white/20 animate-in zoom-in-95 duration-300">
                <header className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                   <h2 className="text-2xl font-black text-brand-dark tracking-tighter italic">
                     {editingCategory ? "Update" : "Establish"} <span className="text-brand-pink">Category</span>
                   </h2>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <X className="h-5 w-5 text-gray-400" />
                   </button>
                </header>

                <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Display Name</label>
                        <input
                          required
                          type="text"
                          className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm focus:bg-white focus:border-brand-pink outline-none transition-all font-bold text-brand-dark"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
                        <div className="flex gap-2">
                           <button 
                             type="button" 
                             onClick={() => setIsService(false)}
                             className={cn("flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", !isService ? "bg-brand-dark text-white" : "bg-gray-50 text-gray-400")}
                           >Product</button>
                           <button 
                             type="button" 
                             onClick={() => setIsService(true)}
                             className={cn("flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", isService ? "bg-brand-pink text-white" : "bg-gray-50 text-gray-400")}
                           >Service</button>
                        </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hero Image</label>
                      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                         {image ? (
                           <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-white shadow-md">
                             <img src={image} className="object-cover h-full w-full" />
                             <button onClick={() => setImage('')} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg"><Trash2 className="h-3 w-3" /></button>
                           </div>
                         ) : (
                           <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center text-gray-200"><Layout className="h-8 w-8" /></div>
                         )}
                         <div className="flex-1">
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleFileUpload} 
                              className="text-xs font-bold text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-brand-pink/10 file:text-brand-pink hover:file:bg-brand-pink/20" 
                            />
                            {uploading && <Loader2 className="h-4 w-4 animate-spin text-brand-pink mt-2" />}
                         </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Elaborated Description</label>
                      <textarea
                        rows={5}
                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm focus:bg-white focus:border-brand-pink outline-none transition-all font-bold text-brand-dark resize-none"
                        placeholder="Detail the service/category expertise..."
                        value={longDescription}
                        onChange={(e) => setLongDescription(e.target.value)}
                      />
                   </div>

                    <button
                      type="submit"
                      disabled={saving || uploading}
                      className="w-full py-5 bg-brand-dark text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-brand-dark/10 hover:bg-brand-pink transition-all flex items-center justify-center gap-3 disabled:opacity-50 italic"
                    >
                      {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> processing</> : <><CheckCircle2 className="h-4 w-4" /> Commit Changes</>}
                    </button>
                </form>
              </div>
           </div>
         )}
      </div>
  );
}

function CategoryCard({ cat, isCore, onEdit, onDelete }: { cat: Category, isCore: boolean, onEdit: (c: Category) => void, onDelete: () => void }) {
  return (
    <div className={cn("group bg-white rounded-[32px] p-6 flex flex-col gap-6 hover:shadow-2xl transition-all duration-500 relative overflow-hidden ring-1", isCore ? "ring-gray-100 hover:shadow-brand-cyan/5" : "ring-brand-pink/10 hover:shadow-brand-pink/10")}>
        {isCore && <div className="absolute top-0 right-0 px-3 py-1 bg-gray-100 text-[8px] font-black uppercase tracking-widest text-gray-400 rounded-bl-xl">SYSTEM</div>}
        <div className="flex items-start justify-between">
           <div className={cn("w-14 h-14 rounded-3xl flex items-center justify-center text-brand-dark transition-all shadow-sm", isCore ? "bg-gray-100 group-hover:bg-brand-cyan group-hover:text-white" : "bg-pink-50 text-brand-pink group-hover:bg-brand-pink group-hover:text-white")}>
              <Layout className="h-6 w-6" />
           </div>
           <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(cat)} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-brand-dark transition-colors"><Edit3 className="h-4 w-4" /></button>
              <button onClick={onDelete} className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
           </div>
        </div>

        <div>
           <h3 className="text-xl font-black text-brand-dark tracking-tighter truncate italic group-hover:text-brand-pink transition-colors">{cat.name}</h3>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">/{cat.slug}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
           <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-300" />
              <span className="text-xs font-black text-brand-dark">{cat.product_count} <span className="text-gray-400 lowercase font-bold">Items</span></span>
           </div>
        </div>
    </div>
  );
}
