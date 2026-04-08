"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus, 
  Image as ImageIcon,
  Loader2,
  Info,
  ExternalLink,
  PlusCircle,
  Coins,
  Trash2,
  GripVertical,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { uploadFile } from '@/lib/supabase/storage';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Category } from '@/lib/supabase/types';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    base_price: 0,
    category: '',
    moq: 1,
    delivery_days: '7-10 Days',
    images: [] as string[],
    template_images: [] as string[],
    wireframe_images: {} as Record<string, string>,
    quality_levels: ['Standard', 'Premium'],
    quality_prices: {} as Record<string, number>,
    bulk_pricing: [] as { min: number; discount: number }[],
    customization_fields: ['Logo', 'Text Color'],
    packaging_options: ['Standard Box'],
    supported_views: ['front'],
    specifications: {}
  });

  useEffect(() => {
    async function fetchData() {
      const [{ data: catData }, { data: prodData }] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('id, name, slug')
      ]);
      
      if (catData) {
        setCategories(catData);
        if (catData.length > 0) {
          setFormData(prev => ({ ...prev, category: catData[0].name }));
        }
      }
      if (prodData) {
        setAllProducts(prodData);
      }
    }
    fetchData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'gallery' | 'wireframe' = 'gallery', side?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const publicUrl = await uploadFile('products', fileName, file);
      
      if (type === 'wireframe' && side) {
        setFormData(prev => ({ 
          ...prev, 
          wireframe_images: {
            ...prev.wireframe_images,
            [side]: publicUrl
          }
        }));
      } else {
        setFormData(prev => ({ ...prev, images: [...prev.images, publicUrl] }));
      }
      toast.success(type === 'wireframe' ? `${side?.toUpperCase()} Wireframe uploaded` : 'Image uploaded');
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
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    setLoading(true);

    try {
      // 1. Insert product
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert([formData])
        .select()
        .single();

      if (productError) throw productError;

      // 2. Insert recommendations if any
      if (recommendations.length > 0 && newProduct) {
        const { error: insError } = await supabase
          .from('product_recommendations')
          .insert(
            recommendations.map((rid, index) => ({
              product_id: newProduct.id,
              recommended_product_id: rid,
              sort_order: index
            }))
          );
        if (insError) throw insError;
      }

      toast.success('Product published successfully!');
      router.push('/admin/products');
    } catch (err: any) {
      console.error(err);
      toast.error(`Error adding product: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = (key: 'customization_fields' | 'packaging_options' | 'quality_levels') => {
    const value = prompt(`Add new ${key.replace('_', ' ')}:`);
    if (value) {
      const newFields = [...formData[key], value];
      const updates: any = { [key]: newFields };
      
      if (key === 'quality_levels') {
        updates.quality_prices = { ...formData.quality_prices, [value]: 0 };
      }
      
      setFormData({ ...formData, ...updates });
    }
  };

  const removeField = (key: 'customization_fields' | 'packaging_options' | 'quality_levels', index: number) => {
    const valueToRemove = formData[key][index];
    const newFields = [...formData[key]];
    newFields.splice(index, 1);
    
    const updates: any = { [key]: newFields };
    if (key === 'quality_levels') {
      const newPrices = { ...formData.quality_prices };
      delete newPrices[valueToRemove];
      updates.quality_prices = newPrices;
    }
    
    setFormData({ ...formData, ...updates });
  };

  const handleQualityPriceChange = (level: string, price: number) => {
    setFormData({
      ...formData,
      quality_prices: {
        ...formData.quality_prices,
        [level]: price
      }
    });
  };

  const handleAddBulkTier = () => {
    const min = prompt('Minimum quantity for this tier:');
    const discount = prompt('Discount percentage (0-100):');
    if (min && discount) {
      setFormData({
        ...formData,
        bulk_pricing: [
          ...formData.bulk_pricing,
          { min: parseInt(min), discount: parseInt(discount) }
        ].sort((a, b) => a.min - b.min)
      });
    }
  };

  const removeBulkTier = (index: number) => {
    const newTiers = [...formData.bulk_pricing];
    newTiers.splice(index, 1);
    setFormData({ ...formData, bulk_pricing: newTiers });
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
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all border border-gray-100 outline-none font-bold text-brand-dark appearance-none cursor-pointer"
                  >
                     <option value="">Select Category</option>
                     {categories.map(cat => (
                       <option key={cat.id} value={cat.name}>{cat.name}</option>
                     ))}
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

          {/* Pricing Controls - BULK & QUALITY */}
          <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4">
                <Coins className="w-32 h-32 text-brand-dark" />
             </div>
             <h2 className="text-xl font-extrabold text-brand-dark mb-8 flex items-center gap-3">
                <div className="h-3 w-3 bg-brand-dark rounded-full"></div>
                Advanced Pricing Controls
             </h2>

             <div className="space-y-10">
                {/* Quality Level Pricing Override */}
                <div>
                   <div className="flex items-center justify-between mb-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quality Price Overrides</label>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {formData.quality_levels.map((level: string) => (
                        <div key={level} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                           <span className="flex-1 text-xs font-bold text-brand-dark truncate">{level}</span>
                           <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-100">
                             <span className="text-[10px] font-black text-gray-400">+₹</span>
                             <input 
                               type="number"
                               value={formData.quality_prices?.[level] || 0}
                               onChange={(e) => handleQualityPriceChange(level, parseInt(e.target.value) || 0)}
                               className="w-16 bg-transparent text-xs font-bold text-brand-pink focus:outline-none"
                             />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Bulk Pricing Registry */}
                <div>
                   <div className="flex items-center justify-between mb-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bulk Discount Registry</label>
                      <button type="button" onClick={handleAddBulkTier} className="flex items-center gap-1.5 text-[10px] font-black text-brand-cyan hover:underline uppercase tracking-widest">
                         <PlusCircle className="h-3.5 w-3.5" /> Add Tier
                      </button>
                   </div>
                   <div className="space-y-2">
                      {formData.bulk_pricing.length > 0 ? formData.bulk_pricing.map((tier: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-brand-dark text-white rounded-[24px] group/tier">
                           <div className="flex items-center gap-6">
                              <div className="flex flex-col">
                                 <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Min Qty</span>
                                 <span className="text-lg font-black italic">{tier.min}+</span>
                              </div>
                              <div className="w-px h-6 bg-white/10" />
                              <div className="flex flex-col">
                                 <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Discount</span>
                                 <span className="text-lg font-black text-brand-cyan italic">{tier.discount}% OFF</span>
                              </div>
                           </div>
                           <button onClick={() => removeBulkTier(i)} className="p-2 hover:bg-white/10 rounded-xl text-red-400 opacity-0 group-hover/tier:opacity-100 transition-all">
                              <Trash2 className="h-4 w-4" />
                           </button>
                        </div>
                      )) : (
                        <div className="p-8 border-2 border-dashed border-gray-100 rounded-3xl text-center">
                           <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No bulk discounts configured</p>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </section>

           <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4">
                <ImageIcon className="w-32 h-32 text-brand-dark" />
             </div>
             <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                <h2 className="text-xl font-extrabold text-brand-dark flex items-center gap-3">
                   <div className="h-3 w-3 bg-brand-pink rounded-full"></div>
                   Asset Deployment (Wireframes)
                </h2>
                
                {/* NEW: AI PROMPT GUIDE POPUP/INLINE */}
                <div className="bg-brand-dark/5 p-4 rounded-2xl border border-brand-dark/5 flex items-center gap-4 group/guide cursor-help">
                   <div className="w-10 h-10 bg-brand-dark text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover/guide:scale-110 transition-all">
                      <Zap className="h-5 w-5" />
                   </div>
                   <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark block">AI Wireframe Guide</span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Generated using Midjourney / DALL-E</span>
                   </div>
                </div>
             </div>

             {/* INLINE AI GUIDE */}
             <div className="mb-12 p-8 bg-brand-dark rounded-[32px] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <ShieldAlert className="w-20 h-20" />
                </div>
                <div className="relative z-10">
                   <h3 className="text-sm font-black italic uppercase tracking-widest mb-6 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                      Studio Requirements
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <div className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black">1</div>
                            <p className="text-[10px] font-bold text-gray-300 uppercase leading-relaxed">Generate a <span className="text-white">Flat Lay</span> or <span className="text-white">Mockup</span> on a pure white background for high contrast.</p>
                         </div>
                         <div className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black">2</div>
                            <p className="text-[10px] font-bold text-gray-300 uppercase leading-relaxed">Remove background using <span className="text-brand-cyan italic underline">remove.bg</span> or Photoshop. Save as <span className="text-white">Transparent PNG</span>.</p>
                         </div>
                      </div>
                      <div className="bg-white/5 p-5 rounded-2xl border border-white/5 group/prompt">
                         <span className="text-[8px] font-black text-brand-cyan uppercase tracking-widest block mb-1">PRO COPY: Midjourney v6</span>
                         <code className="text-[10px] font-mono text-gray-200 block leading-tight break-all cursor-copy active:text-brand-pink transition-colors" onClick={(e) => {
                            navigator.clipboard.writeText(e.currentTarget.innerText);
                            toast.success("Prompt copied to clipboard!");
                         }}>
                            Flat lay front view of a white [PRODUCT], high resolution, studio lighting, isolated on white background, 8k, technical line art style --no shadows --v 6.0
                         </code>
                      </div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">Select & Rank Linked Products</label>
                  
                  <Reorder.Group 
                    axis="y" 
                    values={recommendations} 
                    onReorder={setRecommendations}
                    className="space-y-3 mb-6"
                  >
                     {recommendations.map(rid => {
                        const p = allProducts.find(ap => ap.id === rid);
                        return (
                          <Reorder.Item 
                            key={rid} 
                            value={rid}
                            className="flex items-center gap-4 bg-white px-5 py-4 rounded-2xl border border-gray-100 shadow-sm active:shadow-lg active:scale-[1.02] transition-all cursor-grab active:cursor-grabbing group/tag"
                          >
                             <GripVertical className="h-4 w-4 text-gray-300 group-hover:text-brand-pink transition-colors" />
                             <span className="flex-1 text-xs font-bold text-brand-dark italic">{p?.name || 'Loading...'}</span>
                             <button 
                               type="button"
                               onClick={() => setRecommendations(r => r.filter(id => id !== rid))}
                               className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                             >
                                <X className="h-4 w-4" />
                             </button>
                          </Reorder.Item>
                        );
                     })}
                  </Reorder.Group>

                  {recommendations.length === 0 && (
                     <div className="py-10 border-2 border-dashed border-gray-100 rounded-3xl text-center mb-6">
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">No manual links. System will default to category-based matches.</p>
                     </div>
                  )}

                  <div className="relative">
                     <select 
                       onChange={(e) => {
                         const val = e.target.value;
                         if (val && !recommendations.includes(val)) {
                           setRecommendations([...recommendations, val]);
                           e.target.value = "";
                         }
                       }}
                       className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent border-gray-100 focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-bold text-brand-dark appearance-none cursor-pointer"
                     >
                        <option value="">Add a recommendation...</option>
                        {allProducts.filter(p => !recommendations.includes(p.id)).map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.slug})</option>
                        ))}
                     </select>
                  </div>
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
                      <div className="flex flex-col items-center gap-3">
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

          <section className="bg-white p-8 sm:p-10 rounded-[40px] border border-gray-100 shadow-sm">
             <h2 className="text-xl font-bold mb-6 w-full text-left italic underline uppercase tracking-tighter">Canvas Wireframes (PNG Only)</h2>
             <div className="w-full grid grid-cols-2 gap-4">
                {[
                  { key: 'front', label: 'Front View' },
                  { key: 'back', label: 'Back View' },
                  { key: 'side_l', label: 'Side Left' },
                  { key: 'side_r', label: 'Side Right' },
                ].map((side) => (
                  <div key={side.key} className="relative">
                    <label className="block text-[8px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-widest">{side.label}</label>
                    <div className="aspect-square relative rounded-2xl overflow-hidden border-2 border-dashed border-gray-100 hover:border-brand-pink/30 transition-all group bg-gray-50 flex flex-col items-center justify-center cursor-pointer">
                      {formData.wireframe_images[side.key] ? (
                        <>
                          <img src={formData.wireframe_images[side.key]} alt={side.label} className="w-full h-full object-contain p-2" />
                          <button 
                            type="button"
                            onClick={() => setFormData(p => {
                              const newWires = { ...p.wireframe_images };
                              delete newWires[side.key];
                              return { ...p, wireframe_images: newWires };
                            })}
                            className="absolute top-2 right-2 p-1.5 bg-red-400 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/png" 
                            onChange={(e) => handleImageUpload(e, 'wireframe', side.key)} 
                          />
                          <ImageIcon className="h-6 w-6 text-gray-200 group-hover:text-brand-pink transition-colors" />
                          <span className="text-[7px] font-black text-gray-300 uppercase mt-2 group-hover:text-brand-pink transition-colors">Upload PNG</span>
                        </label>
                      )}
                    </div>
                  </div>
                ))}
             </div>
             <p className="mt-4 text-[9px] font-bold text-gray-400 italic">Highly recommended to use transparent PNGs for Surface Color support.</p>
          </section>
        </div>
      </form>

      <div className="mt-20 border-t border-gray-100 pt-16 text-center">
         <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-10 italic">Review portfolio details before publishing</p>
         <button 
           onClick={() => handleSubmit()}
           disabled={loading || uploading}
           className="min-w-[400px] flex items-center justify-center gap-4 px-12 py-6 bg-brand-pink text-white font-black text-xl rounded-full hover:shadow-2xl hover:shadow-pink-200 hover:-translate-y-1 transition-all disabled:opacity-50 italic"
         >
           {loading ? <Loader2 className="h-7 w-7 animate-spin" /> : <Save className="h-7 w-7" />}
           Publish Product Portfolio
         </button>
      </div>
    </div>
  );
}
