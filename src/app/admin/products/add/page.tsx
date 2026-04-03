"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus, 
  Image as ImageIcon,
  Loader2,
  Info,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { uploadFile } from '@/lib/supabase/storage';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    base_price: 0,
    category: 'Packaging',
    moq: 1,
    delivery_days: '7-10 Days',
    images: [] as string[],
    template_images: [] as string[],
    wireframe_images: [] as string[],
    quality_levels: ['Standard', 'Premium'],
    customization_fields: ['Logo', 'Text Color'],
    packaging_options: ['Standard Box'],
    supported_views: ['front'],
    specifications: {}
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'gallery' | 'wireframe' = 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const publicUrl = await uploadFile('products', fileName, file);
      
      if (type === 'wireframe') {
        setFormData(prev => ({ 
          ...prev, 
          wireframe_images: [...prev.wireframe_images, publicUrl]
        }));
      } else {
        setFormData(prev => ({ ...prev, images: [...prev.images, publicUrl] }));
      }
      toast.success(type === 'wireframe' ? 'Wireframe uploaded' : 'Image uploaded');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (formData.images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }
    setLoading(true);

    const { error } = await supabase
      .from('products')
      .insert([formData]);

    if (error) {
      toast.error(`Error adding product: ${error.message}`);
    } else {
      toast.success('Product published successfully!');
      router.push('/admin/products');
    }
    setLoading(false);
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

  return (
    <div className="p-12 max-w-7xl mx-auto pb-32">
      <Link 
        href="/admin/products"
        className="inline-flex items-center gap-2 text-gray-400 font-bold text-sm mb-12 hover:text-brand-pink transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl font-black text-brand-dark tracking-tighter mb-2">Add New <span className="text-brand-pink">Product</span></h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Expanding the A to Z Prints Catalog</p>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Basic Info & Config */}
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-bold text-brand-dark"
                    placeholder="e.g. Premium Matte Pizza Box"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">URL Slug</label>
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
                    placeholder="Describe the product features and quality..."
                  />
                </div>
             </div>
          </section>

          <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
             <h2 className="text-xl font-extrabold text-brand-dark mb-8 flex items-center gap-3">
               <div className="h-3 w-3 bg-brand-cyan rounded-full"></div>
               Configuration
             </h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    placeholder="e.g. 7-10 Days"
                  />
                </div>
             </div>
          </section>
        </div>

        {/* Right Column: Studio Features & Gallery */}
        <div className="space-y-10">
          <section className="bg-brand-dark p-8 sm:p-10 rounded-[40px] text-white overflow-hidden relative shadow-2xl">
             <h2 className="text-xl font-bold mb-8 relative z-10">Studio Features</h2>
             <div className="space-y-8 relative z-10">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Custom Fields</label>
                    <button type="button" onClick={() => handleAddField('customization_fields')} className="text-brand-pink hover:scale-110 transition-transform"><Plus className="h-4 w-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {formData.customization_fields.map((f, i) => (
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
                     {formData.quality_levels.map((f, i) => (
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

          <section className="bg-white p-8 sm:p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
             <h2 className="text-xl font-bold mb-6 w-full text-left">Product Gallery</h2>
             <div className="w-full grid grid-cols-2 gap-4">
                {formData.images.map((url, idx) => (
                  <div key={idx} className="aspect-square relative rounded-2xl overflow-hidden border border-gray-100 group">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <button 
                        type="button"
                        onClick={() => {
                          setFormData(p => ({ 
                            ...p, 
                            images: p.images.filter((_, i) => i !== idx)
                          }))
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded-full text-[8px] font-black uppercase tracking-widest"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                {formData.images.length < 6 && (
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 hover:border-brand-pink/30 transition-colors flex flex-col items-center justify-center cursor-pointer group">
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onClick={(e) => (e.target as any).value = null}
                      onChange={(e) => handleImageUpload(e, 'gallery')} 
                      disabled={uploading} 
                    />
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 text-brand-pink animate-spin" />
                        <span className="text-[8px] font-black text-brand-pink uppercase animate-pulse">Uploading...</span>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-gray-200 group-hover:text-brand-pink transition-colors" />
                        <span className="text-[10px] font-black text-gray-300 uppercase mt-2">Add Photo</span>
                      </>
                    )}
                  </label>
                )}
             </div>
          </section>
        </div>
      </form>

      {/* SIMPLIFIED WIREFRAME SECTION - CENTRAL & SPACIOUS */}
      <section className="mt-16 bg-white p-8 sm:p-12 rounded-[50px] border border-gray-100 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-cyan/5 rounded-full blur-[100px] -z-10"></div>

        <div className="mb-12 text-center md:text-left">
          <h2 className="text-3xl font-black text-brand-dark mb-2 tracking-tighter">Canvas <span className="text-brand-pink">Wireframe</span> Center</h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Upload technical product outlines (Transparent PNGs) generated from your preferred AI tools</p>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
             <h3 className="text-sm font-black text-brand-dark uppercase tracking-wider">Manual Inventory</h3>
             <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{formData.wireframe_images.length}/4 Slots Filled</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {formData.wireframe_images.map((url, idx) => (
                <div key={idx} className="aspect-square relative rounded-[32px] overflow-hidden border border-gray-100 group bg-gray-50/50 p-6 transition-all hover:shadow-2xl hover:border-brand-pink/20">
                  <img src={url} alt="Wireframe" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                     <button 
                       type="button"
                       onClick={() => {
                         setFormData(p => ({ 
                           ...p, 
                           wireframe_images: p.wireframe_images.filter((_, i) => i !== idx)
                         }))
                       }}
                       className="px-5 py-2 bg-red-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                     >
                       Delete Asset
                     </button>
                  </div>
                  <div className="absolute top-4 left-4 px-3 py-1 bg-brand-dark text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                    {idx === 0 ? 'Front' : idx === 1 ? 'Back' : 'Side View'}
                  </div>
                </div>
              ))}
              {formData.wireframe_images.length < 4 && (
                <label className="aspect-square rounded-[32px] border-2 border-dashed border-gray-100 hover:border-brand-pink/30 hover:bg-brand-pink/[0.02] transition-all flex flex-col items-center justify-center cursor-pointer group">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onClick={(e) => (e.target as any).value = null}
                    onChange={(e) => handleImageUpload(e, 'wireframe')} 
                    disabled={uploading} 
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-8 w-8 text-brand-pink animate-spin" />
                      <span className="text-[10px] font-black text-brand-pink uppercase animate-pulse">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                         <ImageIcon className="h-6 w-6 text-gray-200 group-hover:text-brand-pink transition-colors" />
                      </div>
                      <span className="text-[10px] font-black text-gray-300 uppercase mt-4 tracking-widest group-hover:text-brand-dark transition-colors text-center px-4">Upload Clean Wireframe</span>
                    </>
                  )}
                </label>
              )}
          </div>
        </div>
      </section>

      <div className="mt-20 border-t border-gray-100 pt-16 text-center">
         <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-10">Review your portfolio details before publishing</p>
         <button 
           onClick={() => handleSubmit()}
           disabled={loading || uploading}
           className="min-w-[400px] flex items-center justify-center gap-4 px-12 py-6 bg-brand-pink text-white font-black text-xl rounded-full hover:shadow-2xl hover:shadow-pink-200 hover:-translate-y-1 transition-all disabled:opacity-50"
         >
           {loading ? <Loader2 className="h-7 w-7 animate-spin" /> : <Save className="h-7 w-7" />}
           Publish Product Portfolio
         </button>
      </div>
    </div>
  );
}
