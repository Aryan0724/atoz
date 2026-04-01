"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus, 
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Info,
  Trash2
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { uploadFile } from '@/lib/supabase/storage';
import Link from 'next/link';
import { toast } from 'sonner';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { cn } from '@/lib/utils';
import { mockProducts } from '@/lib/data/mockProducts';

export default function EditProductPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error || !data) throw new Error(error?.message || 'Not found');

        // Normalize array fields to prevent .map() crashes
        setFormData({
          ...data,
          images: data.images || [],
          template_images: data.template_images || [],
          supported_views: data.supported_views || ['front'],
          customization_fields: data.customization_fields || [],
          quality_levels: data.quality_levels || ['Standard', 'Premium', 'Luxury'],
          packaging_options: data.packaging_options || [],
        });
      } catch (err) {
        console.error('Fetch error:', err);
        toast.error('Product not found in live database');
        router.push('/admin/products');
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchProduct();
  }, [slug, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isTemplate = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const publicUrl = await uploadFile('products', fileName, file);
      
      setFormData((prev: any) => {
        const newImages = [...prev.images, publicUrl];
        const newTemplates = isTemplate ? [...prev.template_images, publicUrl] : prev.template_images;
        return { ...prev, images: newImages, template_images: newTemplates };
      });
      toast.success(isTemplate ? 'Template uploaded' : 'Image uploaded');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }
    setSaving(true);

    const { error } = await supabase
      .from('products')
      .update(formData)
      .eq('id', formData.id);

    if (error) {
      toast.error(`Error updating product: ${error.message}`);
    } else {
      toast.success('Product updated successfully');
      router.push('/admin/products');
    }
    setSaving(false);
  };

  const handleAddField = (key: 'customization_fields' | 'packaging_options' | 'quality_levels') => {
    const value = prompt(`Add new ${key.replace('_', ' ')}:`);
    if (value) {
      setFormData({ ...formData, [key]: [...formData[key], value] });
    }
  };

  const removeField = (key: 'customization_fields' | 'packaging_options' | 'quality_levels', index: number) => {
    const newFields = [...formData[key]];
    newFields.splice(index, 1);
    setFormData({ ...formData, [key]: newFields });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-12 w-12 text-brand-pink animate-spin" />
    </div>
  );

  return (
    <div className="p-12 max-w-5xl mx-auto pb-32">
      <Breadcrumbs items={[
        { label: 'Admin' },
        { label: 'Products', href: '/admin/products' },
        { label: 'Edit Product' }
      ]} />

      <header className="mb-12">
        <h1 className="text-4xl font-black text-brand-dark tracking-tighter mb-2">Edit <span className="text-brand-pink">Product</span></h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Modifying: {formData.name}</p>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
             <h2 className="text-xl font-extrabold text-brand-dark mb-8 flex items-center gap-3">
                <div className="h-3 w-3 bg-brand-pink rounded-full"></div>
                Core Information
             </h2>
             <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Product Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-bold text-brand-dark"
                  />
                </div>
                <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">URL Slug (Careful: breaking change if renamed)</label>
                   <input 
                     type="text" 
                     required
                     value={formData.slug}
                     onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                     className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-medium text-gray-400 text-sm"
                   />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                  <textarea 
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-medium text-gray-600"
                  />
                </div>
             </div>
          </section>

          <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
             <h2 className="text-xl font-extrabold text-brand-dark mb-8 flex items-center gap-3">
                <div className="h-3 w-3 bg-brand-cyan rounded-full"></div>
                Configuration
             </h2>
             <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-bold text-brand-dark appearance-none"
                  >
                     <option>Packaging</option>
                     <option>Stationary</option>
                     <option>Apparel</option>
                     <option>Merchandise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Base Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.base_price}
                    onChange={(e) => setFormData({ ...formData, base_price: parseInt(e.target.value) })}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-bold text-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Min. Order Qty (MOQ)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.moq}
                    onChange={(e) => setFormData({ ...formData, moq: parseInt(e.target.value) })}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-bold text-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Delivery Days</label>
                  <input 
                    type="text" 
                    required
                    value={formData.delivery_days}
                    onChange={(e) => setFormData({ ...formData, delivery_days: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-bold text-brand-dark"
                  />
                </div>
             </div>
          </section>
        </div>

        {/* Right Column: Customization & Images */}
        <div className="space-y-10">
          <section className="bg-brand-dark p-10 rounded-[40px] text-white overflow-hidden relative">
             <h2 className="text-xl font-bold mb-8 relative z-10">Studio Features</h2>
             
             <div className="space-y-8 relative z-10">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Custom Fields</label>
                    <button type="button" onClick={() => handleAddField('customization_fields')} className="text-brand-pink hover:scale-110 transition-transform"><Plus className="h-4 w-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {formData.customization_fields.map((f: string, i: number) => (
                       <span key={i} className="px-3 py-1.5 bg-white/5 rounded-xl text-[10px] font-bold border border-white/5 flex items-center gap-2 group">
                         {f}
                         <button type="button" onClick={() => removeField('customization_fields', i)} className="opacity-0 group-hover:opacity-100 text-red-400 transition-opacity"><X className="h-3 w-3" /></button>
                       </span>
                     ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quality Tiers</label>
                    <button type="button" onClick={() => handleAddField('quality_levels')} className="text-brand-pink hover:scale-110 transition-transform"><Plus className="h-4 w-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {formData.quality_levels.map((f: string, i: number) => (
                       <span key={i} className="px-3 py-1.5 bg-white/5 rounded-xl text-[10px] font-bold border border-white/5 flex items-center gap-2 group">
                         {f}
                         <button type="button" onClick={() => removeField('quality_levels', i)} className="opacity-0 group-hover:opacity-100 text-red-400 transition-opacity"><X className="h-3 w-3" /></button>
                       </span>
                     ))}
                  </div>
                </div>
             </div>

             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-pink/10 rounded-full blur-3xl"></div>
          </section>

          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
             <div className="w-full grid grid-cols-2 gap-4 mb-6">
                {formData.images.map((url: string, idx: number) => {
                  const isTemplate = formData.template_images?.includes(url);
                  return (
                    <div key={idx} className="aspect-square relative rounded-2xl overflow-hidden border border-gray-100 group">
                      <img src={url} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <button 
                          type="button"
                          onClick={() => {
                            const newTemplates = isTemplate 
                              ? formData.template_images.filter((t: string) => t !== url)
                              : [...(formData.template_images || []), url];
                            setFormData((f: any) => ({ ...f, template_images: newTemplates }));
                          }}
                          className={cn(
                            "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all",
                            isTemplate ? "bg-brand-cyan text-white" : "bg-white text-brand-dark"
                          )}
                        >
                          {isTemplate ? 'Template ✓' : 'Set as Template'}
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setFormData((p: any) => ({ 
                              ...p, 
                              images: p.images.filter((_: any, i: number) => i !== idx),
                              template_images: (p.template_images || []).filter((t: string) => t !== url)
                            }))
                          }}
                          className="px-3 py-1 bg-red-500 text-white rounded-full text-[8px] font-black uppercase tracking-widest"
                        >
                          Remove
                        </button>
                      </div>
                      {isTemplate && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-brand-cyan text-white text-[7px] font-black uppercase tracking-widest rounded-md">
                          Canvas
                        </div>
                      )}
                    </div>
                  );
                })}
                {formData.images.length < 6 && (
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 hover:border-brand-pink/30 transition-colors flex flex-col items-center justify-center cursor-pointer group">
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e)} disabled={uploading} />
                    {uploading ? (
                      <Loader2 className="h-8 w-8 text-brand-pink animate-spin" />
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-gray-200 group-hover:text-brand-pink transition-colors" />
                        <span className="text-[10px] font-black text-gray-300 uppercase mt-2">Add Photo</span>
                      </>
                    )}
                  </label>
                )}
             </div>

             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 px-4">Maximum 4 dynamic product images</p>
             
             <button 
               type="submit"
               disabled={saving || uploading}
               className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-brand-dark text-white font-black text-lg rounded-full hover:shadow-2xl hover:shadow-gray-200 transition-all disabled:opacity-50"
             >
               {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
               Save Changes
             </button>
          </div>
        </div>
      </form>
    </div>
  );
}
