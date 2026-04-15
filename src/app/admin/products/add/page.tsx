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
  ShieldAlert,
  ChevronRight,
  CheckCircle2,
  Settings,
  Layout,
  Tag,
  ShoppingBag
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
  const [currentStep, setCurrentStep] = useState(1);
  
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
    wireframe_images: ['', '', '', ''], // [Front, Back, Left, Right]
    quality_levels: ['Standard', 'Premium'],
    quality_prices: {} as Record<string, number>,
    bulk_pricing: [] as { min: number; discount: number }[],
    customization_fields: ['Logo', 'Text Color'],
    packaging_options: ['Standard Box'],
    supported_views: ['front', 'back', 'left', 'right'],
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'gallery' | 'wireframe' = 'gallery', index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const publicUrl = await uploadFile('products', fileName, file);
      
      if (type === 'wireframe' && index !== undefined) {
        setFormData(prev => {
          const newWires = [...prev.wireframe_images];
          newWires[index] = publicUrl;
          return { ...prev, wireframe_images: newWires };
        });
        toast.success('Wireframe uploaded');
      } else {
        setFormData(prev => ({ ...prev, images: [...prev.images, publicUrl] }));
        toast.success('Gallery image uploaded');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (formData.images.length === 0) {
      toast.error('Please upload at least one product image in the Marketing step');
      setCurrentStep(4);
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category in the Identity step');
      setCurrentStep(1);
      return;
    }
    
    setLoading(true);
    try {
      // Clean up wireframe_images to ensure it's a valid array for DB
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert([{
          ...formData,
          wireframe_images: formData.wireframe_images.filter(img => img !== '') // Keep only uploaded ones or just keep array
        }])
        .select()
        .single();

      if (productError) throw productError;

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

  const steps = [
    { id: 1, label: 'Identity', icon: <Tag className="h-4 w-4" /> },
    { id: 2, label: 'Commerce', icon: <ShoppingBag className="h-4 w-4" /> },
    { id: 3, label: 'Design Studio', icon: <Layout className="h-4 w-4" /> },
    { id: 4, label: 'Marketing', icon: <ImageIcon className="h-4 w-4" /> },
  ];

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
    setFormData({ ...formData, quality_prices: { ...formData.quality_prices, [level]: price } });
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

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto pb-32">
      <Link 
        href="/admin/products"
        className="inline-flex items-center gap-2 text-gray-400 font-bold text-sm mb-8 hover:text-brand-pink transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black text-brand-dark tracking-tighter mb-2 italic">Product <span className="text-brand-pink">Wizard</span></h1>
           <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Step {currentStep} of 4: {steps.find(s => s.id === currentStep)?.label}</p>
        </div>
        
        {/* Step Indicator */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
           {steps.map((step) => (
             <button
               key={step.id}
               onClick={() => setCurrentStep(step.id)}
               className={cn(
                 "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                 currentStep === step.id ? "bg-brand-dark text-white shadow-lg shadow-gray-200" : "text-gray-400 hover:bg-gray-50"
               )}
             >
               {step.icon}
               <span className="hidden sm:inline">{step.label}</span>
             </button>
           ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* STEP 1: IDENTITY */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-100/50">
                    <h2 className="text-xl font-black text-brand-dark mb-8 flex items-center gap-3 italic uppercase tracking-tighter">
                      <div className="h-6 w-1 bg-brand-pink rounded-full"></div>
                      Product Identity
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Title</label>
                        <input 
                          type="text" required value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-bold text-brand-dark shadow-inner text-sm"
                          placeholder="e.g. Premium Cotton T-Shirt"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">URL Slug</label>
                          <input 
                            type="text" required value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-medium text-gray-400 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Category</label>
                          <select 
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all border border-gray-100 outline-none font-bold text-brand-dark appearance-none cursor-pointer text-sm"
                          >
                             <option value="">Select Category</option>
                             {categories.map(cat => (
                               <option key={cat.id} value={cat.name}>{cat.name}</option>
                             ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Description</label>
                        <textarea 
                          rows={6} required value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-medium text-gray-600 text-sm shadow-inner"
                          placeholder="What makes this product special?"
                        />
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* STEP 2: COMMERCE */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-100/50">
                    <h2 className="text-xl font-black text-brand-dark mb-8 flex items-center gap-3 italic uppercase tracking-tighter">
                      <div className="h-6 w-1 bg-brand-cyan rounded-full"></div>
                      Pricing & Availability
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Base Price (₹)</label>
                        <input 
                          type="number" value={formData.base_price}
                          onChange={(e) => setFormData({ ...formData, base_price: parseInt(e.target.value) || 0 })}
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-black text-brand-dark text-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Min. Order Qty</label>
                        <input 
                          type="number" value={formData.moq}
                          onChange={(e) => setFormData({ ...formData, moq: parseInt(e.target.value) || 1 })}
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-bold text-brand-dark text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Delivery Lead Time</label>
                        <input 
                          type="text" value={formData.delivery_days}
                          onChange={(e) => setFormData({ ...formData, delivery_days: e.target.value })}
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-bold text-brand-dark text-sm"
                          placeholder="e.g. 10-14 Working Days"
                        />
                      </div>
                    </div>

                    <div className="space-y-8">
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4 ml-1">Quality Level Sur-charges</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {formData.quality_levels.map((level) => (
                              <div key={level} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <span className="text-[11px] font-bold text-brand-dark truncate pr-2">{level}</span>
                                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                                  <span className="text-[10px] font-black text-gray-300">+₹</span>
                                  <input 
                                    type="number" value={formData.quality_prices?.[level] || 0}
                                    onChange={(e) => handleQualityPriceChange(level, parseInt(e.target.value) || 0)}
                                    className="w-16 bg-transparent text-xs font-black text-brand-pink outline-none"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                       </div>

                       <div>
                          <div className="flex items-center justify-between mb-4 px-1">
                             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bulk Discount Tiers</label>
                             <button type="button" onClick={handleAddBulkTier} className="text-[10px] font-black text-brand-cyan flex items-center gap-1.5 bg-brand-cyan/5 px-3 py-1.5 rounded-lg hover:bg-brand-cyan hover:text-white transition-all">
                                <PlusCircle className="h-3.5 w-3.5" /> Add Tier
                             </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             {formData.bulk_pricing.map((tier, i) => (
                               <div key={i} className="flex items-center justify-between p-5 bg-brand-dark text-white rounded-[24px] relative group overflow-hidden shadow-lg">
                                 <div className="relative z-10 flex gap-6 italic">
                                   <div><span className="text-[8px] block opacity-40 uppercase mb-1">Qty</span><span className="text-xl font-black">{tier.min}+</span></div>
                                   <div><span className="text-[8px] block opacity-40 uppercase mb-1">Discount</span><span className="text-xl font-black text-brand-cyan">{tier.discount}%</span></div>
                                 </div>
                                 <button onClick={() => {
                                   const newTiers = [...formData.bulk_pricing];
                                   newTiers.splice(i, 1);
                                   setFormData({...formData, bulk_pricing: newTiers});
                                 }} className="p-2 bg-white/10 hover:bg-red-500 rounded-xl transition-all relative z-10 opacity-0 group-hover:opacity-100">
                                   <Trash2 className="h-4 w-4" />
                                 </button>
                                 <div className="absolute top-0 right-0 w-16 h-16 bg-brand-cyan/10 blur-2xl rounded-full" />
                               </div>
                             ))}
                             {formData.bulk_pricing.length === 0 && (
                               <div className="sm:col-span-2 p-10 border-2 border-dashed border-gray-100 rounded-3xl text-center">
                                 <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No bulk discounts established</p>
                               </div>
                             )}
                          </div>
                       </div>
                    </div>
                  </section>
                </div>
              )}

              {/* STEP 3: DESIGN STUDIO (WIREFRAMES) */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-100/50">
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-xl font-black text-brand-dark flex items-center gap-3 italic uppercase tracking-tighter">
                          <div className="h-6 w-1 bg-brand-pink rounded-full"></div>
                          Canvas Studio Deployment
                       </h2>
                       <div className="px-4 py-2 bg-brand-pink/5 text-brand-pink text-[9px] font-black uppercase tracking-widest rounded-full border border-brand-pink/10 shadow-sm animate-pulse">SVG Required</div>
                    </div>
                    
                    {/* SVG Guide Box */}
                    <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl mb-8">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">How to get an SVG wireframe</p>
                      <ol className="text-[11px] text-blue-500 font-medium space-y-1 list-decimal list-inside">
                        <li>Find or create a flat product outline in Figma, Illustrator, or similar</li>
                        <li>Export as <strong>SVG</strong> (not PNG)</li>
                        <li>Set the product body fill to <code className="bg-blue-100 px-1 rounded">#ffffff</code> (white)</li>
                        <li>Keep outlines/shadows as dark colors</li>
                        <li>Open the .svg file in a text editor, copy the full code, paste below</li>
                      </ol>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                      {[
                        { label: 'Front View', idx: 0 },
                        { label: 'Back View', idx: 1 },
                        { label: 'Left Side', idx: 2 },
                        { label: 'Right Side', idx: 3 },
                      ].map((view) => {
                        const stored = formData.wireframe_images[view.idx] || '';
                        let svgText = '';
                        if (stored.startsWith('data:image/svg+xml')) {
                          try { svgText = decodeURIComponent(stored.split(',').slice(1).join(',')); } catch { svgText = stored; }
                        }
                        return (
                          <div key={view.idx} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">{view.label} — SVG Code</label>
                              {svgText && <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">✓ Loaded</span>}
                            </div>
                            {svgText && (
                              <div className="aspect-[3/4] rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden flex items-center justify-center p-4">
                                <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: svgText }} />
                              </div>
                            )}
                            <div className="relative">
                              <textarea
                                rows={svgText ? 4 : 8}
                                placeholder={`Paste SVG markup for ${view.label}...\n\n<svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg">\n  <path fill="#ffffff" stroke="#333" d="..."/>\n</svg>`}
                                value={svgText}
                                onChange={(e) => {
                                  const raw = e.target.value.trim();
                                  const newW = [...formData.wireframe_images];
                                  newW[view.idx] = raw ? `data:image/svg+xml,${encodeURIComponent(raw)}` : '';
                                  setFormData({ ...formData, wireframe_images: newW });
                                }}
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-brand-pink/30 focus:bg-white outline-none transition-all font-mono text-[11px] text-gray-600 resize-y"
                              />
                              {svgText && (
                                <button type="button" onClick={() => { const newW = [...formData.wireframe_images]; newW[view.idx] = ''; setFormData({ ...formData, wireframe_images: newW }); }} className="absolute top-3 right-3 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-[9px] font-black uppercase transition-colors">Clear</button>
                              )}
                            </div>
                            <p className="text-[9px] text-gray-400 font-medium px-1">Body paths must use <code className="bg-gray-100 px-1 rounded">#ffffff</code> fill — color picker recolors these automatically.</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Studio Info Box */}
                    <div className="p-8 bg-brand-dark rounded-[32px] text-white relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-10"><Zap className="w-24 h-24" /></div>
                       <div className="relative z-10">
                          <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">Studio Asset Requirements</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-2 text-[10px] font-bold text-gray-400 uppercase leading-relaxed">
                                <p>• SVG format with <span className="text-brand-cyan">white (#ffffff) body fill</span> paths.</p>
                                <p>• Black/dark strokes for outlines and details.</p>
                                <p>• Export from Figma, Illustrator, or similar tools.</p>
                             </div>
                             <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                <span className="text-[8px] font-black text-brand-cyan uppercase tracking-widest block mb-2">Quick tip:</span>
                                <code className="text-[10px] font-bold text-gray-300 italic block leading-tight">Open the exported .svg file in Notepad or VS Code, select all, copy, paste into the field above.</code>
                             </div>
                          </div>
                       </div>
                    </div>
                  </section>
                </div>
              )}


              {/* STEP 4: MARKETING & GALLERY */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-100/50">
                    <h2 className="text-xl font-black text-brand-dark mb-8 flex items-center gap-3 italic uppercase tracking-tighter">
                      <div className="h-6 w-1 bg-brand-pink rounded-full"></div>
                      Marketing & Portfolio
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                      {formData.images.map((url, idx) => (
                        <div key={idx} className="aspect-square relative rounded-2xl overflow-hidden border border-gray-100 group shadow-sm bg-gray-50">
                          <img src={url} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))} className="p-2 bg-white/10 hover:bg-red-500 rounded-xl text-white transition-all"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                      ))}
                      {formData.images.length < 8 && (
                        <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-brand-pink/30 hover:bg-brand-pink/5 transition-all flex flex-col items-center justify-center cursor-pointer group">
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'gallery')} />
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-white transition-all shadow-sm"><ImageIcon className="h-5 w-5 text-gray-300 group-hover:text-brand-pink" /></div>
                          <span className="text-[9px] font-black text-gray-300 group-hover:text-brand-pink uppercase tracking-widest">Add Product Photo</span>
                        </label>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Customization & Packaging</label>
                      </div>
                      <div className="flex flex-wrap gap-3">
                         {['customization_fields', 'packaging_options'].map((key) => (
                           <div key={key} className="flex flex-wrap gap-2">
                             {formData[key as keyof typeof formData].map((field, i) => (
                               <span key={i} className="px-4 py-2 bg-gray-50 text-brand-dark text-[10px] font-bold rounded-xl border border-gray-100 flex items-center gap-2 group hover:bg-white transiton-all">
                                 {field}
                                 <button onClick={() => removeField(key as any, i)} className="opacity-0 group-hover:opacity-100 text-red-500 transition-all"><X className="h-3 w-3" /></button>
                               </span>
                             ))}
                             <button type="button" onClick={() => handleAddField(key as any)} className="px-4 py-2 bg-white text-brand-pink text-[10px] font-black rounded-xl border border-dashed border-brand-pink/20 hover:border-brand-pink/50 transition-all">+ Add {key.split('_')[0]}</button>
                           </div>
                         ))}
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8">
             <button 
               onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
               disabled={currentStep === 1}
               className="px-8 py-4 text-gray-400 font-black text-[11px] uppercase tracking-widest hover:text-brand-dark transition-colors disabled:opacity-0"
             >Previous Step</button>
             
             {currentStep < 4 ? (
               <button 
                 onClick={() => setCurrentStep(prev => prev + 1)}
                 className="flex items-center gap-3 px-10 py-4 bg-brand-dark text-white rounded-[20px] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-brand-pink transition-all group italic"
               >
                 Next Section <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
               </button>
             ) : (
               <button 
                 onClick={handleSubmit} 
                 disabled={loading || uploading}
                 className="flex items-center gap-3 px-12 py-5 bg-brand-pink text-white rounded-[24px] font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl shadow-brand-pink/20 hover:-translate-y-1 transition-all group italic"
               >
                 {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                 Publish Inventory Portfolio
               </button>
             )}
          </div>
        </div>

        {/* Sidebar Mini Summary */}
        <div className="hidden lg:block space-y-6">
           <div className="bg-brand-dark text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden italic">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/20 blur-3xl rounded-full"></div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-4 relative z-10">Asset Summary</h3>
              <div className="space-y-4 relative z-10">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 underline">Wireframes</span>
                    <span className="text-[10px] font-black text-brand-cyan">{formData.wireframe_images.filter(img => img).length}/4</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 underline">Gallery Images</span>
                    <span className="text-[10px] font-black text-brand-cyan">{formData.images.length}/8</span>
                 </div>
                 <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
                    <span className="text-[10px] font-bold text-gray-400">Current Category</span>
                    <span className="text-[10px] font-black text-brand-pink uppercase tracking-tighter truncate max-w-[100px]">{formData.category || 'None'}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400">Base Price</span>
                    <span className="text-[10px] font-black text-white italic">₹{formData.base_price.toLocaleString()}</span>
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-100/50">
              <h3 className="text-[11px] font-black text-brand-dark uppercase tracking-widest mb-6 flex items-center gap-2 italic">
                 <Settings className="h-3 w-3 text-brand-pink" /> 
                 Wizard Guide
              </h3>
              <div className="space-y-6">
                 {steps.map((step) => (
                   <div key={step.id} className="flex gap-4 group">
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all", currentStep >= step.id ? "bg-brand-pink text-white" : "bg-gray-100 text-gray-300")}>
                        {currentStep > step.id ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-[10px] font-black">{step.id}</span>}
                      </div>
                      <div className="flex flex-col">
                         <span className={cn("text-[10px] font-black transition-colors", currentStep === step.id ? "text-brand-pink" : "text-gray-400")}>{step.label}</span>
                         <span className="text-[8px] font-bold text-gray-300 uppercase leading-tight mt-0.5">{step.id === 1 ? 'Configure basic metadata' : step.id === 2 ? 'Set prices and moq' : step.id === 3 ? 'Deploy design surfaces' : 'Finalize visuals'}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
