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
  Sparkles,
  Info
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="p-12 max-w-5xl mx-auto pb-32">
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
                    placeholder="e.g. 7-10 Days"
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

          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
             <div className="w-full grid grid-cols-2 gap-4 mb-6">
                {formData.images.map((url, idx) => {
                  const isTemplate = formData.template_images.includes(url);
                  return (
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
                  );
                })}
                {formData.images.length < 6 && (
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 hover:border-brand-pink/30 transition-colors flex flex-col items-center justify-center cursor-pointer group">
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'gallery')} disabled={uploading} />
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

             <h2 className="text-xl font-bold mb-4 mt-8 w-full text-left">Canvas Wireframes</h2>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 w-full text-left italic">Technical outlines for the Designer Canvas</p>

             <div className="w-full grid grid-cols-2 gap-4 mb-6">
                {formData.wireframe_images.map((url, idx) => {
                  return (
                    <div key={idx} className="aspect-square relative rounded-2xl overflow-hidden border border-gray-100 group bg-gray-50 p-2">
                      <img src={url} alt="Wireframe" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <button 
                          type="button"
                          onClick={() => {
                            setFormData(p => ({ 
                              ...p, 
                              wireframe_images: p.wireframe_images.filter((_, i) => i !== idx)
                            }))
                          }}
                          className="px-3 py-1 bg-red-500 text-white rounded-full text-[8px] font-black uppercase tracking-widest"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-brand-cyan text-white text-[7px] font-black uppercase tracking-widest rounded-md">
                        {idx === 0 ? 'Front' : idx === 1 ? 'Back' : 'Side'}
                      </div>
                    </div>
                  );
                })}
                {formData.wireframe_images.length < 4 && (
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 hover:border-brand-pink/30 transition-colors flex flex-col items-center justify-center cursor-pointer group">
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'wireframe')} disabled={uploading} />
                    {uploading ? (
                      <Loader2 className="h-8 w-8 text-brand-pink animate-spin" />
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-gray-200 group-hover:text-brand-pink transition-colors" />
                        <span className="text-[10px] font-black text-gray-300 uppercase mt-2 italic">Add Wireframe</span>
                      </>
                    )}
                  </label>
                )}
             </div>

             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 px-4">Maximum 4 dynamic product images</p>
             
             <button 
               type="submit"
               disabled={loading || uploading}
               className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-brand-pink text-white font-black text-lg rounded-full hover:shadow-2xl hover:shadow-pink-200 transition-all disabled:opacity-50"
             >
               {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
               Publish Product
             </button>
          </div>
        </div>
      </form>
    </div>
  );
}
