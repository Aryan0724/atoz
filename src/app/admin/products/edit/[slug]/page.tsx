"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus, 
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Info,
  Trash2,
  PlusCircle,
  Percent,
  Coins,
  GripVertical,
  Zap,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { uploadFile } from '@/lib/supabase/storage';
import Link from 'next/link';
import { toast } from 'sonner';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { cn } from '@/lib/utils';
import { Category } from '@/lib/supabase/types';
import DesignAreaSelector from '@/components/admin/DesignAreaSelector';

export default function EditProductPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [editingArea, setEditingArea] = useState<{ url: string, side: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productRes, categoriesRes, allProductsRes, recommendationsRes] = await Promise.all([
          supabase.from('products').select('*').eq('slug', slug).single(),
          supabase.from('categories').select('*').order('name'),
          supabase.from('products').select('id, name, slug').neq('slug', slug),
          supabase.from('product_recommendations').select('recommended_product_id').eq('product_id', (await supabase.from('products').select('id').eq('slug', slug).single()).data?.id || '')
        ]);

        if (productRes.error || !productRes.data) throw new Error(productRes.error?.message || 'Product not found');
        
        const data = productRes.data;
        setCategories(categoriesRes.data || []);
        setAllProducts(allProductsRes.data || []);
        setRecommendations(recommendationsRes.data?.map(r => r.recommended_product_id) || []);

        // Normalize array fields to prevent .map() crashes
        setFormData({
          ...data,
          images: data.images || [],
          template_images: data.template_images || [],
          wireframe_images: data.wireframe_images || {},
          supported_views: data.supported_views || ['front'],
          customization_fields: data.customization_fields || [],
          quality_levels: data.quality_levels || ['Standard', 'Premium', 'Luxury'],
          quality_prices: data.quality_prices || {},
          bulk_pricing: data.bulk_pricing || [],
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

    if (slug) fetchData();
  }, [slug, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'gallery' | 'wireframe' = 'gallery', side?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const publicUrl = await uploadFile('products', fileName, file);
      
      setFormData((prev: any) => {
        if (type === 'wireframe' && side) {
          return { 
            ...prev, 
            wireframe_images: {
              ...(prev.wireframe_images || {}),
              [side]: publicUrl
            } 
          };
        }
        return { ...prev, images: [...prev.images, publicUrl] };
      });
      toast.success(type === 'wireframe' ? `${side?.toUpperCase()} wireframe uploaded` : 'Image uploaded');
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

    try {
      // 1. Update product basic info
      const { error: productError } = await supabase
        .from('products')
        .update(formData)
        .eq('id', formData.id);

      if (productError) throw productError;

      // 2. Sync recommendations (Delete then Insert)
      const { error: delError } = await supabase
        .from('product_recommendations')
        .delete()
        .eq('product_id', formData.id);
      
      if (delError) throw delError;

      if (recommendations.length > 0) {
        const { error: insError } = await supabase
          .from('product_recommendations')
          .insert(
            recommendations.map((rid, index) => ({
              product_id: formData.id,
              recommended_product_id: rid,
              sort_order: index
            }))
          );
        if (insError) throw insError;
      }

      toast.success('Product and recommendations updated successfully');
      router.push('/admin/products');
    } catch (err: any) {
       console.error(err);
       toast.error(`Operation failed: ${err.message}`);
    } finally {
       setSaving(false);
    }
  };

  const handleAddField = (key: 'customization_fields' | 'packaging_options' | 'quality_levels', value: string) => {
    if (value.trim()) {
      const newFields = [...formData[key], value.trim()];
      setFormData({ ...formData, [key]: newFields });
      
      // If adding a quality level, also initialize its price to 0 if not present
      if (key === 'quality_levels') {
        const newPrices = { ...formData.quality_prices };
        if (newPrices[value] === undefined) newPrices[value] = 0;
        setFormData((prev: any) => ({ ...prev, [key]: newFields, quality_prices: newPrices }));
      }
    }
  };

  const removeField = (key: 'customization_fields' | 'packaging_options' | 'quality_levels', index: number) => {
    const valueToRemove = formData[key][index];
    const newFields = [...formData[key]];
    newFields.splice(index, 1);
    
    const updates: any = { [key]: newFields };
    
    // If removing a quality level, also remove its associated price
    if (key === 'quality_levels') {
      const newPrices = { ...formData.quality_prices };
      delete newPrices[valueToRemove];
      updates.quality_prices = newPrices;
    }
    
    setFormData({ ...formData, ...updates });
  };

  const handleQualityPriceChange = (level: string, value: string) => {
    const price = parseFloat(value);
    setFormData({
      ...formData,
      quality_prices: {
        ...formData.quality_prices,
        [level]: isNaN(price) ? 0 : price
      }
    });
  };

  const handleAddBulkTier = (minStr: string, discountStr: string) => {
    const min = parseInt(minStr);
    const discount = parseInt(discountStr);
    if (!isNaN(min) && !isNaN(discount)) {
      setFormData({
        ...formData,
        bulk_pricing: [
          ...formData.bulk_pricing,
          { min, discount }
        ].sort((a, b) => a.min - b.min)
      });
    }
  };

  const [addingCategory, setAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const handleQuickAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const slug = newCatName.toLowerCase().replace(/ /g, '-');
      const { data, error } = await supabase.from('categories').insert([{ name: newCatName, slug }]).select().single();
      if (error) throw error;
      setCategories([...categories, data]);
      setFormData({ ...formData, category: data.name });
      setNewCatName('');
      setAddingCategory(false);
      toast.success('Category created and selected');
    } catch (err: any) {
      toast.error(`Fail: ${err.message}`);
    }
  };

  const removeBulkTier = (index: number) => {
    const newTiers = [...formData.bulk_pricing];
    newTiers.splice(index, 1);
    setFormData({ ...formData, bulk_pricing: newTiers });
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Category Selection</label>
                    <button 
                      type="button"
                      onClick={() => setAddingCategory(!addingCategory)} 
                      className="text-[10px] font-bold text-brand-pink underline uppercase tracking-widest hover:text-brand-dark"
                    >
                      {addingCategory ? 'Cancel' : '+ Quick Add'}
                    </button>
                  </div>
                  
                  {addingCategory ? (
                    <div className="flex gap-2 animate-in slide-in-from-top-2 duration-300">
                      <input 
                        type="text" 
                        placeholder="New Category Name..." 
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="flex-1 px-5 py-3 rounded-xl bg-gray-50 border border-brand-pink/20 outline-none font-bold text-sm"
                        autoFocus
                      />
                      <button 
                        type="button"
                        onClick={handleQuickAddCategory}
                        className="px-6 py-3 bg-brand-pink text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-pink-100"
                      >
                        Create
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
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
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                         <ChevronRight className="h-4 w-4 rotate-90" />
                      </div>
                    </div>
                  )}
                  {categories.length === 0 && !addingCategory && (
                    <p className="text-[9px] font-bold text-brand-pink uppercase tracking-widest italic mt-2 animate-pulse">
                      No categories found in live DB. Please use &apos;Quick Add&apos; to initialize.
                    </p>
                  )}
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

          {/* Pricing Controls - BULK & QUALITY */}
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

             <div className="space-y-10">
                {/* Quality Level Pricing Override */}
                <div>
                   <div className="flex items-center justify-between mb-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quality Price Overrides</label>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {formData.quality_levels.map((level: string) => (
                        <div key={level} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-brand-pink/20 transition-all group/tier">
                           <span className="flex-1 text-xs font-bold text-brand-dark truncate">{level}</span>
                           <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-100 group-focus-within/tier:border-brand-pink/30 group-focus-within/tier:ring-4 group-focus-within/tier:ring-brand-pink/5 transition-all shadow-sm">
                             <span className="text-[10px] font-black text-gray-400">+₹</span>
                             <input 
                               type="text"
                               inputMode="numeric"
                               value={formData.quality_prices?.[level] ?? 0}
                               onChange={(e) => handleQualityPriceChange(level, e.target.value)}
                               className="w-24 bg-transparent text-sm font-black text-brand-pink focus:outline-none"
                               placeholder="0"
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
                      <div className="flex items-center gap-2">
                         <div className="flex bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                           <input id="bulk_min" type="number" placeholder="Qty" className="w-14 px-3 py-1.5 bg-transparent text-[10px] font-bold outline-none border-r border-gray-100" />
                           <input id="bulk_disc" type="number" placeholder="%" className="w-12 px-3 py-1.5 bg-transparent text-[10px] font-bold outline-none" />
                         </div>
                         <button 
                           type="button" 
                           onClick={() => {
                             const min = (document.getElementById('bulk_min') as HTMLInputElement).value;
                             const disc = (document.getElementById('bulk_disc') as HTMLInputElement).value;
                             if (min && disc) {
                               handleAddBulkTier(min, disc);
                               (document.getElementById('bulk_min') as HTMLInputElement).value = '';
                               (document.getElementById('bulk_disc') as HTMLInputElement).value = '';
                             } else {
                               toast.error('Enter Qty and %');
                             }
                           }} 
                           className="p-1.5 bg-brand-cyan text-white rounded-xl shadow-lg shadow-cyan-100 hover:scale-110 transition-transform"
                         >
                            <PlusCircle className="h-4 w-4" />
                         </button>
                      </div>
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
               <PlusCircle className="w-32 h-32 text-brand-dark" />
            </div>
            <h2 className="text-xl font-extrabold text-brand-dark mb-8 flex items-center gap-3">
               <div className="h-3 w-3 bg-brand-pink rounded-full"></div>
               Manual Recommendations
            </h2>
            
            <div className="space-y-6">
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

        {/* Right Column: Customization & Images */}
        <div className="space-y-10">
          <section className="bg-brand-dark p-10 rounded-[40px] text-white overflow-hidden relative">
             <h2 className="text-xl font-bold mb-8 relative z-10">Studio Features</h2>
             
             <div className="space-y-8 relative z-10">
                <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Custom Fields</label>
                      <div className="flex gap-2">
                        <input id="new_custom_field" type="text" placeholder="Add field..." className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-[10px] outline-none focus:border-brand-pink/30 w-32" />
                        <button 
                          type="button" 
                          onClick={() => {
                            const input = document.getElementById('new_custom_field') as HTMLInputElement;
                            handleAddField('customization_fields', input.value);
                            input.value = '';
                          }} 
                          className="text-brand-pink hover:scale-110 transition-transform"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
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
                      <div className="flex gap-2">
                        <input id="new_quality_level" type="text" placeholder="Add tier..." className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-[10px] outline-none focus:border-brand-pink/30 w-32" />
                        <button 
                          type="button" 
                          onClick={() => {
                            const input = document.getElementById('new_quality_level') as HTMLInputElement;
                            handleAddField('quality_levels', input.value);
                            input.value = '';
                          }} 
                          className="text-brand-pink hover:scale-110 transition-transform"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
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
                  return (
                    <div key={idx} className="aspect-square relative rounded-2xl overflow-hidden border border-gray-100 group">
                      <img src={url} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <button 
                          type="button"
                          onClick={() => {
                            setFormData((p: any) => ({ 
                              ...p, 
                              images: (p.images || []).filter((_: any, i: number) => i !== idx)
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
                {(formData.images || []).length < 6 && (
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

             <h2 className="text-xl font-bold mb-4 mt-8 w-full text-left uppercase tracking-tighter">Canvas Wireframes (PNG Only)</h2>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 w-full text-left italic">Side-specific technical outlines</p>

             <div className="w-full grid grid-cols-2 gap-4 mb-6 text-left">
                {[
                  { key: 'front', label: 'Front View' },
                  { key: 'back', label: 'Back View' },
                  { key: 'side_l', label: 'Side Left' },
                  { key: 'side_r', label: 'Side Right' },
                ].map((side) => (
                  <div key={side.key} className="relative">
                    <label className="block text-[8px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-widest">{side.label}</label>
                    <div className="aspect-square relative rounded-2xl overflow-hidden border-2 border-dashed border-gray-100 hover:border-brand-pink/30 transition-all group bg-gray-50 flex flex-col items-center justify-center">
                      {formData.wireframe_images?.[side.key] ? (
                        <>
                          <img src={formData.wireframe_images[side.key]} alt={side.label} className="w-full h-full object-contain p-2" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 px-4 text-center">
                            <button 
                              type="button"
                              onClick={() => setEditingArea({ url: formData.wireframe_images[side.key], side: side.key })}
                              className="w-full py-1.5 bg-brand-pink text-white rounded-full text-[8px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg"
                            >
                              Define Area
                            </button>
                            <button 
                              type="button"
                              onClick={() => {
                                setFormData((p: any) => {
                                  const newWires = { ...p.wireframe_images };
                                  delete newWires[side.key];
                                  return { ...p, wireframe_images: newWires };
                                });
                              }}
                              className="w-full py-1.5 bg-red-400 text-white rounded-full text-[8px] font-black uppercase tracking-widest hover:bg-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/png" 
                            onChange={(e) => handleImageUpload(e, 'wireframe', side.key)} 
                            disabled={uploading}
                          />
                          {uploading ? (
                            <Loader2 className="h-6 w-6 text-brand-pink animate-spin" />
                          ) : (
                            <>
                              <ImageIcon className="h-6 w-6 text-gray-200 group-hover:text-brand-pink transition-colors" />
                              <span className="text-[7px] font-black text-gray-300 uppercase mt-2 group-hover:text-brand-pink transition-colors">Upload PNG</span>
                            </>
                          )}
                        </label>
                      )}
                    </div>
                  </div>
                ))}
             </div>

             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 px-4 italic">* High-end customizer works best with transparent PNG files.</p>
             
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

      {editingArea && (
        <DesignAreaSelector 
          imageUrl={editingArea.url}
          label={`${editingArea.side.toUpperCase()} View`}
          initialArea={formData.design_areas?.[editingArea.side]}
          onCancel={() => setEditingArea(null)}
          onSave={(area) => {
            const key = editingArea.side;
            setFormData({
              ...formData,
              design_areas: {
                ...(formData.design_areas || {}),
                [key]: area
              }
            });
            setEditingArea(null);
            toast.success(`Design area set for ${key} view`);
          }}
        />
      )}
    </div>
  );
}
