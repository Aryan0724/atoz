"use client";

import React, { useState } from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import { Search, ArrowRight, ShieldCheck, Zap, Sparkles, TrendingUp, Info, Calculator, Tag, Copy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryIcon } from '@/lib/data/icons';
import { toast } from 'sonner';

export default function PricingClient({ 
  initialCategories, 
  initialCoupons = [] 
}: { 
  initialCategories: any[], 
  initialCoupons?: any[] 
}) {
  const [activeTab, setActiveTab] = useState(initialCategories[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Estimator State
  const [estCategory, setEstCategory] = useState(initialCategories[0]?.id || '');
  const selectedCatObj = initialCategories.find(c => c.id === estCategory) || initialCategories[0] || { items: [] };
  const [estProduct, setEstProduct] = useState(selectedCatObj.items?.[0]?.name || '');
  const [estQty, setEstQty] = useState<number>(50);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const activeCategory = initialCategories.find(c => c.id === activeTab);

  const calculateEstimate = () => {
    const product = selectedCatObj.items?.find((i: any) => i.name === estProduct);
    if (!product || !product.tiers || !product.tiers.length) return 0;
    
    let unitPrice = product.tiers[0];
    const headers = activeCategory?.headers || [];
    
    headers.forEach((h: string, idx: number) => {
      const match = h.match(/\d+/);
      if (match) {
        const minVal = parseInt(match[0]);
        if (estQty >= minVal) {
          unitPrice = product.tiers[idx] ?? unitPrice;
        }
      }
    });
    
    return unitPrice * estQty;
  };

  if (!initialCategories || initialCategories.length === 0) {
     return <div className="min-h-screen pt-32 pb-24 flex justify-center text-gray-500">No pricing data configured.</div>;
  }

  return (
    <div className="bg-[#F9F9F7] min-h-screen pt-40 pb-24 relative overflow-hidden text-brand-dark selection:bg-brand-pink/10 selection:text-brand-pink">
      {/* Premium Background elements */}
      <div className="absolute top-0 inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-pink/5 blur-[150px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-olive/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <SectionHeading 
            badge="Enterprise Transparency"
            title="Smarter Bulk Pricing"
            subtitle="Premium quality at industrial scale. Transparent pricing for every order size."
            align="center"
            className="text-brand-dark"
          />
        </motion.div>

        {/* New Prominent Discounts Section (TOP ATTRACTION) */}
        {initialCoupons.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-12 bg-brand-dark rounded-[48px] p-8 md:p-12 shadow-2xl relative overflow-hidden group border border-white/5"
          >
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-pink/10 rounded-full blur-[150px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-cyan/5 rounded-full blur-[120px] -ml-48 -mb-48" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-brand-pink/10 text-brand-pink font-black text-[10px] tracking-[0.3em] uppercase rounded-full mb-4 border border-brand-pink/20">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    High-Fidelity Offer Zone
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-[0.9] py-2">
                    Active <span className="text-brand-pink">Incentives</span>
                  </h2>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Total Active Intel</p>
                  <p className="text-4xl font-black text-white">{initialCoupons.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialCoupons.map((coupon) => (
                  <div 
                    key={coupon.code}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 hover:bg-white/10 transition-all group/coupon relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                           <div className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-pink">
                            {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% Discount` : `₹${coupon.discount_value} Savings`}
                          </span>
                        </div>
                        <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{coupon.code}</h4>
                      </div>
                      <button 
                        onClick={() => handleCopy(coupon.code)}
                        className="h-12 w-12 md:h-14 md:w-14 shrink-0 bg-white/5 hover:bg-brand-pink rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all shadow-2xl group-hover/coupon:scale-110 active:scale-95 ml-4"
                      >
                        {copiedCode === coupon.code ? <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" /> : <Copy className="h-5 w-5 md:h-6 md:w-6" />}
                      </button>
                    </div>
                    <p className="text-xs text-white/50 font-bold leading-relaxed uppercase tracking-wider mb-6 relative z-10">
                      {coupon.description || `Apply this code at checkout to secure your ${coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`} enterprise-tier deduction.`}
                    </p>
                    {coupon.min_order_value > 0 && (
                      <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                         <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Eligibility Threshold</span>
                         <span className="text-[10px] font-black text-brand-pink uppercase tracking-widest">₹{coupon.min_order_value}+</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Dynamic Controls Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 bg-white border border-gray-100 p-3 rounded-[32px] shadow-soft overflow-hidden"
        >
          <div className="flex overflow-x-auto no-scrollbar w-full md:w-auto p-1 gap-2.5">
            {initialCategories.map((cat) => {
              const Icon = getCategoryIcon(cat.icon || cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={cn(
                    "flex items-center gap-3 px-8 py-5 text-[11px] font-black uppercase tracking-[0.25em] rounded-[16px] whitespace-nowrap transition-all duration-700 relative isolate group",
                    activeTab === cat.id 
                      ? "text-white" 
                      : "text-gray-400 hover:text-brand-dark"
                  )}
                >
                  {activeTab === cat.id && (
                    <motion.div 
                      layoutId="activeTabPricing"
                      className="absolute inset-0 bg-brand-dark rounded-[16px] shadow-2xl shadow-brand-dark/10 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={cn(
                    "w-4 h-4 transition-transform duration-500",
                    activeTab === cat.id ? "text-brand-pink" : "group-hover:scale-125"
                  )} />
                  {cat.name}
                </button>
              );
            })}
          </div>
          <div className="relative w-full md:w-80 group px-2 pb-2 md:p-0 mr-4">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 h-4 w-4 group-focus-within:text-brand-pink transition-colors" />
            <input 
              type="text" 
              placeholder="Filter products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink focus:bg-white transition-all outline-none text-brand-dark placeholder:text-gray-300"
            />
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Pricing Experience */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98, x: 20 }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                className="grid grid-cols-1 md:grid-cols-1 gap-6"
              >
                {activeCategory?.items
                   ?.filter((item: any) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                   .map((item: any, idx: number) => (
                    <motion.div 
                      key={item.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group relative bg-white border border-gray-100 rounded-[40px] p-8 md:p-10 transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/50 overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                        <div>
                          <h3 className="text-2xl font-black text-brand-dark tracking-tight group-hover:text-brand-pink transition-colors">{item.name}</h3>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                             <TrendingUp className="h-3 w-3 text-brand-pink" /> Volume-Based Pricing
                          </p>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Baseline</span>
                            <span className="text-xl font-black text-brand-dark">₹{item.tiers[0]}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {item.tiers.map((price: number, pi: number) => (
                          <div key={pi} className={cn(
                            "relative overflow-hidden flex flex-col items-center justify-center p-6 rounded-3xl border transition-all duration-500",
                            pi === item.tiers.length - 1 
                              ? "bg-pink-50/50 border-brand-pink/30 scale-105 shadow-md shadow-pink-100/50" 
                              : "bg-gray-50 hover:bg-white hover:border-gray-200 border-transparent shadow-sm"
                          )}>
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">{activeCategory.headers[pi]} {item.unit}</span>
                             <div className="flex items-start gap-1">
                                <span className="text-sm font-black text-brand-pink mt-1">₹</span>
                                <span className="text-3xl font-black text-brand-dark tracking-tighter">{price}</span>
                             </div>
                             <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">Per {item.unit?.slice(0, -1) || 'Unit'}</span>
                             
                             {pi === item.tiers.length - 1 && (
                               <div className="absolute top-2 right-2 flex h-5 w-5 bg-brand-pink rounded-full items-center justify-center animate-pulse">
                                 <Sparkles className="h-3 w-3 text-white" />
                               </div>
                             )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Premium Estimator Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
               initial={{ opacity: 0, x: 30 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.3 }}
               className="bg-white rounded-[48px] p-10 shadow-2xl border border-gray-100 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/5 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-olive/5 rounded-full blur-[80px] -ml-20 -mb-20" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-4 bg-brand-pink rounded-3xl shadow-lg shadow-pink-200">
                    <Calculator className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tighter leading-none">Smart Estimator</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-pink block mt-1">Real-time quote</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Select Category</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-brand-dark focus:ring-4 focus:ring-brand-pink/10 outline-none appearance-none transition-all cursor-pointer"
                        value={estCategory}
                        onChange={(e) => {
                          setEstCategory(e.target.value);
                          const newCat = initialCategories.find(c => c.id === e.target.value);
                          if (newCat) setEstProduct(newCat.items?.[0]?.name || '');
                        }}
                      >
                        {initialCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 rotate-90" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Select Product</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-brand-dark focus:ring-4 focus:ring-brand-pink/10 outline-none appearance-none transition-all cursor-pointer"
                        value={estProduct}
                        onChange={(e) => setEstProduct(e.target.value)}
                      >
                        {selectedCatObj?.items?.map((p: any) => <option key={p.name} value={p.name}>{p.name}</option>)}
                      </select>
                      <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 rotate-90" />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order Quantity</label>
                       <span className="bg-brand-dark text-white text-[11px] font-black px-4 py-1 rounded-full">{estQty} {selectedCatObj?.items?.[0]?.unit || 'Units'}</span>
                    </div>
                    <div className="relative px-2">
                       <input 
                        type="range" 
                        min="10" 
                        max="1000" 
                        step="10"
                        value={estQty}
                        onChange={(e) => setEstQty(Number(e.target.value))}
                        className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-10 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-brand-pink" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Projected Investment</p>
                  </div>
                  <div className="flex items-end gap-3">
                    <motion.span 
                      key={calculateEstimate()}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-6xl font-black text-brand-dark tracking-tighter leading-none"
                    >
                      ₹{calculateEstimate().toLocaleString()}
                    </motion.span>
                    <span className="text-sm text-brand-pink font-black mb-1 uppercase tracking-widest">+ 18% GST</span>
                  </div>
                </div>

                <Link href="/products" className="mt-12 w-full py-6 bg-brand-dark hover:bg-black text-white text-xs font-black uppercase tracking-[0.25em] rounded-3xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl active:scale-95">
                  Start Designing <ArrowRight className="h-4 w-4 text-brand-pink" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Premium Trust Grid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-12 md:p-20 bg-white border border-gray-100 rounded-[60px] shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-pink/[0.02] rounded-full blur-[100px] -mr-64 -mt-64" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            <div className="space-y-6">
              <div className="h-16 w-16 bg-pink-50 rounded-3xl flex items-center justify-center text-brand-pink">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h4 className="text-2xl font-black text-brand-dark tracking-tight leading-loose">Premium Assurance</h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Every unit undergoes 5 levels of quality checks before dispatch. We use archival-grade inks and premium materials only.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="h-16 w-16 bg-olive-50/50 rounded-3xl flex items-center justify-center text-brand-olive" style={{ backgroundColor: 'rgba(91,91,66,0.05)' }}>
                <Zap className="h-8 w-8" />
              </div>
              <h4 className="text-2xl font-black text-brand-dark tracking-tight">Rapid Fulfillment</h4>
              <p className="text-sm text-gray-500 font-medium leading-loose">
                Proprietary automation allows us to offer 48-hour dispatch for specific catalog items. Track your journey in real-time.
              </p>
            </div>

            <div className="space-y-6">
               <div className="h-16 w-16 bg-pink-50 rounded-3xl flex items-center justify-center text-brand-pink">
                 <Sparkles className="h-8 w-8" />
               </div>
               <h4 className="text-2xl font-black text-brand-dark tracking-tight">Bulk Specialists</h4>
               <p className="text-sm text-gray-500 font-medium leading-relaxed">
                 From 10 items to 10,000, our infrastructure manages production with pinpoint accuracy on every single piece.
               </p>
            </div>
          </div>

          <div className="mt-20 pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10">
             <div className="flex items-center gap-10">
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-brand-dark tracking-tight">100%</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">SLA Compliance</span>
                </div>
                <div className="w-px h-10 bg-gray-100" />
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-brand-dark tracking-tight">19k+</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Pin Codes</span>
                </div>
             </div>
             <motion.div 
               whileHover={{ y: -5 }}
               className="bg-brand-dark text-white px-10 py-7 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10 group border border-white/5"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand-pink/30 transition-colors" />
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-14 w-14 rounded-2xl border-4 border-brand-dark bg-gray-800 overflow-hidden relative shadow-2xl transform hover:-translate-y-2 transition-transform duration-500">
                      <Image src={`https://i.pravatar.cc/150?u=${i+200}`} fill alt="Client" className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="h-px md:h-12 w-12 md:w-px bg-white/10" />
                <div className="text-center md:text-left">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-pink mb-2">Priority Corporate Business Unit</p>
                   <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <p className="text-3xl font-black tracking-tighter italic">+91 91523 01844</p>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/50 border border-white/5">24/7 Priority</span>
                   </div>
                </div>
                <ArrowRight className="h-6 w-6 text-brand-pink group-hover:translate-x-2 transition-transform hidden md:block" />
             </motion.div>
          </div>
        </motion.div>

        {/* GST & Terms Note */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="mt-12 flex items-start gap-4 p-8 bg-white/50 rounded-[32px] border border-gray-100"
        >
          <Info className="h-5 w-5 text-gray-300 shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest leading-loose">
             Prices are exclusive of 18% GST. Designing, delivery, and handling charges may apply. Minimum Order Quantity (MOQ) depends on individual product lines. Standard SLA is 7-10 business days.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
