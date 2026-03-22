"use client";

import React, { useState } from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import { CheckCircle2, Info, Calculator, Search, ArrowRight, ShieldCheck, Zap, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  {
    id: 'diaries',
    name: "Diaries",
    icon: "📖",
    items: [
      { name: "Premium Leather Diary", tiers: [550, 525, 490, 450], unit: "Units" },
      { name: "Hard Cover Diary", tiers: [600, 580, 550, 520], unit: "Units" },
      { name: "A5 Soft Cover Wiro Diary", tiers: [250, 220, 190, 160], unit: "Units" },
      { name: "A5 Hard Cover Wiro Diary", tiers: [400, 380, 350, 320], unit: "Units" },
    ],
    headers: ["10+", "20+", "50+", "100+"]
  },
  {
    id: 'bill-books',
    name: "Bill Books",
    icon: "📝",
    items: [
      { name: "A5 Bill Book", tiers: [450, 420, 400], unit: "Sets" },
      { name: "A5 Receipt Book", tiers: [450, 420, 400], unit: "Sets" },
      { name: "A5 Voucher Book", tiers: [450, 420, 400], unit: "Sets" },
      { name: "A4 GST Bill Book", tiers: [900, 840, 800], unit: "Sets" },
    ],
    headers: ["5", "10", "20"]
  },
  {
    id: 'stationary',
    name: "Stationary",
    icon: "✉️",
    items: [
      { name: "Letterheads (A4)", tiers: [600, 1000, 1800, 3500, 6000], unit: "Units" },
    ],
    headers: ["50", "100", "200", "500", "1000"]
  },
  {
    id: 'apparel',
    name: "Apparel",
    icon: "👕",
    items: [
      { name: "Premium Cotton T-Shirt", tiers: [650, 620, 600], unit: "Units" },
    ],
    headers: ["1-10", "11-20", "21-50"]
  }
];

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState(categories[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estimator State
  const [estCategory, setEstCategory] = useState(categories[0].id);
  const selectedCatObj = categories.find(c => c.id === estCategory) || categories[0];
  const [estProduct, setEstProduct] = useState(selectedCatObj.items[0].name);
  const [estQty, setEstQty] = useState<number>(50);

  const calculateEstimate = () => {
    const product = selectedCatObj.items.find(i => i.name === estProduct);
    if (!product) return 0;
    
    let unitPrice = product.tiers[0];
    if (product.tiers.length >= 4) {
      if (estQty >= 100) unitPrice = product.tiers[3];
      else if (estQty >= 50) unitPrice = product.tiers[2];
      else if (estQty >= 20) unitPrice = product.tiers[1];
    } else if (product.tiers.length === 3) {
      if (estQty >= 20) unitPrice = product.tiers[2];
      else if (estQty >= 10) unitPrice = product.tiers[1];
    }
    
    return unitPrice * estQty;
  };

  const activeCategory = categories.find(c => c.id === activeTab);

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-24 relative overflow-hidden text-white selection:bg-brand-pink/30 selection:text-white">
      {/* Cinematic Background elements */}
      <div className="absolute top-0 inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-pink/10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-cyan/5 blur-[120px]" />
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
            subtitle="Premium quality at industrial scale. Cinematic pricing for every order size."
            align="center"
            className="text-white"
          />
        </motion.div>

        {/* Dynamic Controls Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 backdrop-blur-2xl border border-white/10 p-3 rounded-[32px] overflow-hidden"
        >
          <div className="flex overflow-x-auto no-scrollbar w-full md:w-auto p-1 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={cn(
                  "flex items-center gap-3 px-6 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-2xl whitespace-nowrap transition-all duration-500 relative group",
                  activeTab === cat.id 
                    ? "bg-brand-pink text-white shadow-[0_0_30px_rgba(233,30,99,0.4)] scale-100" 
                    : "text-gray-400 hover:text-white hover:bg-white/5 scale-95"
                )}
              >
                <span className="text-xl group-hover:scale-125 transition-transform duration-300">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80 group px-2 pb-2 md:p-0 mr-4">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4 group-focus-within:text-brand-pink transition-colors" />
            <input 
              type="text" 
              placeholder="Filter products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink/50 transition-all outline-none"
            />
          </div>
        </motion.div>

        {/* Main Grid: Tables vs Estimator */}
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
                  .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item, idx) => (
                    <motion.div 
                      key={item.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group relative bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md border border-white/5 rounded-[40px] p-8 md:p-10 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
                    >
                      {/* Decorative elements inside card */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                        <div>
                          <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-brand-pink transition-colors">{item.name}</h3>
                          <p className="text-xs text-brand-cyan/60 font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                             <TrendingUp className="h-3 w-3" /> Volume-Based Pricing
                          </p>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Baseline Rate</span>
                            <span className="text-xl font-black text-white">₹{item.tiers[0]}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {item.tiers.map((price, pi) => (
                          <div key={pi} className={cn(
                            "relative overflow-hidden flex flex-col items-center justify-center p-6 rounded-3xl border border-white/5 transition-all duration-500",
                            pi === item.tiers.length - 1 ? "bg-brand-pink/20 border-brand-pink/30 scale-105 shadow-[0_0_20px_rgba(233,30,99,0.1)]" : "bg-white/5 hover:bg-white/[0.08]"
                          )}>
                             <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">{activeCategory.headers[pi]} {item.unit}</span>
                             <div className="flex items-start gap-1">
                                <span className="text-sm font-black text-brand-cyan mt-1">₹</span>
                                <span className="text-3xl font-black text-white tracking-tighter">{price}</span>
                             </div>
                             <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-2">Per {item.unit.slice(0, -1)}</span>
                             
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
          <div className="lg:col-span-4">
            <motion.div 
               initial={{ opacity: 0, x: 30 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.3 }}
               className="sticky top-32 bg-brand-pink rounded-[48px] p-10 shadow-[0_30px_90px_rgba(233,30,99,0.3)] border border-white/20 relative overflow-hidden group"
            >
              {/* Animated Inner Glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-dark/20 rounded-full blur-[80px] -ml-20 -mb-20" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-4 bg-brand-dark rounded-3xl shadow-xl">
                    <Calculator className="h-7 w-7 text-brand-cyan" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tighter leading-none">Smart Estimator</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#900e3d] block mt-1">Real-time calculations</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#900e3d] uppercase tracking-[0.2em]">Select Category</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-brand-dark/10 border border-brand-dark/10 rounded-2xl px-6 py-4 text-sm font-black text-brand-dark focus:ring-4 focus:ring-brand-dark/10 outline-none appearance-none transition-all cursor-pointer"
                        value={estCategory}
                        onChange={(e) => {
                          setEstCategory(e.target.value);
                          const newCat = categories.find(c => c.id === e.target.value);
                          if (newCat) setEstProduct(newCat.items[0].name);
                        }}
                      >
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-dark/50 rotate-90" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#900e3d] uppercase tracking-[0.2em]">Select Product</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-brand-dark/10 border border-brand-dark/10 rounded-2xl px-6 py-4 text-sm font-black text-brand-dark focus:ring-4 focus:ring-brand-dark/10 outline-none appearance-none transition-all cursor-pointer"
                        value={estProduct}
                        onChange={(e) => setEstProduct(e.target.value)}
                      >
                        {selectedCatObj?.items.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                      </select>
                      <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-dark/50 rotate-90" />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                       <label className="text-[10px] font-black text-[#900e3d] uppercase tracking-[0.2em]">Order Quantity</label>
                       <span className="bg-brand-dark text-white text-[11px] font-black px-4 py-1 rounded-full">{estQty} {selectedCatObj.items[0].unit}</span>
                    </div>
                    <div className="relative px-2">
                       <input 
                        type="range" 
                        min="10" 
                        max="1000" 
                        step="10"
                        value={estQty}
                        onChange={(e) => setEstQty(Number(e.target.value))}
                        className="w-full h-2 bg-brand-dark/10 rounded-lg appearance-none cursor-pointer accent-brand-dark"
                      />
                      <div className="flex justify-between mt-2 px-1">
                          <span className="text-[9px] font-bold text-[#900e3d]">10</span>
                          <span className="text-[9px] font-bold text-[#900e3d]">500</span>
                          <span className="text-[9px] font-bold text-[#900e3d]">1000+</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-10 border-t border-brand-dark/10">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-brand-dark" />
                    <p className="text-[10px] font-black text-[#900e3d] uppercase tracking-[0.2em]">Projected Investment</p>
                  </div>
                  <div className="flex items-end gap-3">
                    <motion.span 
                      key={calculateEstimate()}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-6xl font-black text-white tracking-tighter leading-none"
                    >
                      ₹{calculateEstimate().toLocaleString()}
                    </motion.span>
                    <span className="text-sm text-[#900e3d] font-black mb-1 uppercase tracking-widest">+ 18% GST</span>
                  </div>
                </div>

                <Link href="/products" className="mt-12 w-full py-6 bg-brand-dark hover:bg-black text-white text-xs font-black uppercase tracking-[0.25em] rounded-3xl transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] active:scale-95">
                  Start Designing <ArrowRight className="h-4 w-4 text-brand-cyan" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Cinematic Trust Grid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-12 md:p-20 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[60px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[100px] -mr-64 -mt-64" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            <div className="space-y-6">
              <div className="h-16 w-16 bg-brand-pink/10 rounded-3xl flex items-center justify-center text-brand-pink">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h4 className="text-2xl font-black text-white tracking-tight leading-loose">Premium Assurance</h4>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                Every unit undergoes 5 levels of quality checks before dispatch. We use archival-grade inks and premium-weight papers only.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="h-16 w-16 bg-brand-cyan/10 rounded-3xl flex items-center justify-center text-brand-cyan">
                <Zap className="h-8 w-8" />
              </div>
              <h4 className="text-2xl font-black text-white tracking-tight">Rapid Fulfillment</h4>
              <p className="text-sm text-gray-400 font-medium leading-loose">
                Proprietary automation allows us to offer 48-hour dispatch for specific catalog items. Track your branding journey in real-time.
              </p>
            </div>

            <div className="space-y-6">
               <div className="h-16 w-16 bg-white/5 rounded-3xl flex items-center justify-center text-brand-pink">
                 <Sparkles className="h-8 w-8" />
               </div>
               <h4 className="text-2xl font-black text-white tracking-tight">Bulk Specialists</h4>
               <p className="text-sm text-gray-400 font-medium leading-relaxed">
                 From 10 items to 10,000, our infrastructure manages high-concurrency production with pinpoint accuracy on every single piece.
               </p>
            </div>
          </div>

          <div className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
             <div className="flex items-center gap-10">
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-white tracking-tight">100%</span>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">SLA Compliance</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-white tracking-tight">19k+</span>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Pin Codes</span>
                </div>
             </div>
             
             <div className="bg-brand-pink/10 border border-brand-pink/20 px-8 py-5 rounded-3xl flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-12 w-12 rounded-2xl border-2 border-brand-dark bg-gray-800 overflow-hidden relative">
                      <Image src={`https://i.pravatar.cc/150?u=${i+100}`} fill alt="Client" />
                    </div>
                  ))}
                </div>
                <div>
                   <p className="text-xs font-black text-white uppercase tracking-wider mb-1">Corporate Hotline</p>
                   <p className="text-xl font-black text-brand-pink tracking-tight">+91 98XXX XXXXX</p>
                </div>
             </div>
          </div>
        </motion.div>

        {/* GST & Terms Note */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="mt-12 flex items-start gap-4 p-8 bg-white/[0.01] rounded-[32px] border border-white/5"
        >
          <Info className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest leading-loose">
             Prices are exclusive of 18% GST. Designing, delivery, and handling charges may apply. Minimum Order Quantity (MOQ) depends on individual product lines. Standard SLA is 7-10 business days for bulk manufacturing.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
