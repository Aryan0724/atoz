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

      {/* NEW WIREFRAME SECTION - CENTRAL & SPACIOUS */}
      <section className="mt-16 bg-white p-8 sm:p-12 rounded-[50px] border border-gray-100 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-50 rounded-full blur-[100px] -z-10"></div>

        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 rounded-full mb-4">
             <Sparkles className="h-3 w-3 text-indigo-600" />
             <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest leading-none">Studio Experience</span>
          </div>
          <h2 className="text-3xl font-black text-brand-dark mb-2 tracking-tighter">Canvas <span className="text-indigo-600">Wireframe</span> Center</h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Prepare your technical product outlines with AI or manual uploads</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* Wireframe Preview Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-black text-brand-dark uppercase tracking-wider">Preview Inventory</h3>
               <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{formData.wireframe_images.length}/4 Slots Filled</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {formData.wireframe_images.map((url, idx) => (
                  <div key={idx} className="aspect-square relative rounded-[32px] overflow-hidden border border-gray-100 group bg-gray-50/50 p-4 transition-all hover:shadow-2xl hover:shadow-indigo-100 hover:border-indigo-100">
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
                         Remove Outline
                       </button>
                    </div>
                    <div className="absolute top-4 left-4 px-3 py-1 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {idx === 0 ? 'Front' : idx === 1 ? 'Back' : 'Side View'}
                    </div>
                  </div>
                ))}
                {formData.wireframe_images.length < 4 && (
                  <label className="aspect-square rounded-[32px] border-2 border-dashed border-gray-100 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all flex flex-col items-center justify-center cursor-pointer group">
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
                        <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
                        <span className="text-[10px] font-black text-indigo-400 uppercase animate-pulse">Processing...</span>
                      </div>
                    ) : (
                      <>
                        <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                           <ImageIcon className="h-6 w-6 text-gray-200 group-hover:text-indigo-400 transition-colors" />
                        </div>
                        <span className="text-[10px] font-black text-gray-300 uppercase mt-4 tracking-widest group-hover:text-indigo-900 transition-colors">Upload Manual Outline</span>
                      </>
                    )}
                  </label>
                )}
            </div>
          </div>

          {/* AI WIREFRAME STUDIO - NEW DESIGN */}
          <div className="p-8 sm:p-10 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[40px] text-white shadow-2xl relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl mt-10 mr-10"></div>
             
             <div className="flex items-center gap-4 mb-10">
               <div className="p-4 bg-white/10 rounded-[24px] backdrop-blur-md">
                 <Sparkles className="h-6 w-6 text-indigo-200" />
               </div>
               <div>
                  <h3 className="text-xl font-black uppercase tracking-wider mb-1">AI Studio</h3>
                  <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest opacity-80 italic">Instant technical outlines from text</p>
               </div>
             </div>

             <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Outline Description</label>
                  <textarea 
                    className="w-full bg-white/10 border border-white/10 rounded-3xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-white/20 outline-none transition-all placeholder:text-white/30 text-white min-h-[140px]"
                    placeholder="Describe your wireframe: e.g., 'Plain hoodie, front view, flat mockup, transparent background'..."
                    id="ai-mockup-prompt"
                  />
                </div>
                
                <div className="flex gap-2 pb-4 overflow-x-auto no-scrollbar">
                   {['Front View', 'Back View', 'Side View', 'Ghost Mockup', 'Isolated'].map(v => (
                     <button 
                       key={v}
                       type="button"
                       onClick={() => {
                         const el = document.getElementById('ai-mockup-prompt') as HTMLTextAreaElement;
                         el.value = (el.value ? el.value + ', ' : '') + v;
                       }}
                       className="px-4 py-2 bg-white/10 text-white rounded-full text-[9px] font-black border border-white/10 hover:bg-white hover:text-indigo-900 transition-all whitespace-nowrap"
                     >
                       + {v}
                     </button>
                   ))}
                </div>

                <button 
                  type="button"
                  onClick={async () => {
                    const prompt = (document.getElementById('ai-mockup-prompt') as HTMLTextAreaElement).value;
                    if (!prompt) {
                      toast.error("Please describe the mockup first!");
                      return;
                    }
                    
                    setUploading(true);
                    try {
                      const seed = Math.floor(Math.random() * 1000000);
                      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ', centered product on white background, studio lighting, high resolution, 8k')}?width=1024&height=1024&nologo=true&seed=${seed}`;
                      
                      toast.info("Step 1/2: Generating mockup...");
                      
                      const img = new Image();
                      img.src = url;
                      await Promise.race([
                        new Promise((resolve) => { img.onload = resolve; }),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Generation Timeout')), 60000))
                      ]);

                      toast.info("Step 2/2: Processing background...");
                      
                      const removeBgWithTimeout = async () => {
                        const requestPromise = fetch('/api/remove-bg', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ imageUrl: url })
                        });
                        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Removal Timeout')), 20000));
                        return Promise.race([requestPromise, timeoutPromise]) as Promise<Response>;
                      };

                      try {
                        const response = await removeBgWithTimeout();
                        const result = await response.json();
                        if (result.imageUrl) {
                          setFormData(p => ({ ...p, wireframe_images: [...p.wireframe_images, result.imageUrl] }));
                          toast.success("AI Outline Added!");
                        } else {
                          throw new Error('Processing failed');
                        }
                      } catch (pErr) {
                        console.warn("[Admin] Processing failed, using original:", pErr);
                        setFormData(p => ({ ...p, wireframe_images: [...p.wireframe_images, url] }));
                        toast.warning("Added mockup (Skipped background removal).");
                      }
                    } catch (err: any) {
                      console.error("[Admin] AI Generation failed:", err);
                      if (err.message === 'Generation Timeout') {
                         toast.error("The image generator is taking too long. Try a simpler prompt!");
                      } else {
                         toast.error("Generation failed. Check your connection or retry.");
                      }
                    } finally {
                      setUploading(false);
                    }
                  }}
                  disabled={uploading}
                  className="w-full py-5 bg-white text-indigo-900 text-[11px] font-black uppercase tracking-widest rounded-[24px] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                  Launch Studio Engine
                </button>
             </div>
          </div>
        </div>
      </section>

      <div className="mt-20 border-t border-gray-100 pt-16 text-center">
         <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-10">Confirming Final Portfolio details</p>
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
