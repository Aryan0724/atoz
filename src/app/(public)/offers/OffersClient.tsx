"use client";

import React, { useState } from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import { Tag, Copy, CheckCircle2, Sparkles, Zap, ShieldCheck, ArrowRight, Gift, Percent, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';

export default function OffersClient({ initialCoupons }: { initialCoupons: any[] }) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon ${code} copied successfully!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="bg-[#F9F9F7] min-h-screen pt-40 pb-24 relative overflow-hidden text-brand-dark selection:bg-brand-pink/10 selection:text-brand-pink">
      {/* Premium Background Elements */}
      <div className="absolute top-0 inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-pink/5 blur-[150px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-cyan/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <SectionHeading 
            badge="Exclusive Incentives"
            title="The Deal Matrix"
            subtitle="Unlock industrial-grade savings with our active incentive protocols. Premium printing, optimized for your budget."
            align="center"
            className="text-brand-dark"
          />
        </motion.div>

        {initialCoupons.length === 0 ? (
          <div className="mt-20 text-center py-32 bg-white rounded-[48px] border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
              <Zap className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tight">No Active Protocols</h3>
            <p className="text-gray-400 mt-4 font-medium">All current offers have been fully allocated. Check back soon for new incentives.</p>
            <Link href="/products" className="mt-10 inline-flex items-center gap-3 text-sm font-black text-brand-pink uppercase tracking-widest hover:translate-x-2 transition-transform">
              Explore Catalog Intelligence <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Featured Offer (Latest) */}
            <div className="lg:col-span-12">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="bg-brand-dark rounded-[60px] p-12 md:p-20 shadow-2xl relative overflow-hidden group border border-white/5"
               >
                  <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-pink/10 rounded-full blur-[160px] -mr-64 -mt-64 group-hover:bg-brand-pink/20 transition-colors duration-1000" />
                  
                  <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                      <div className="inline-flex items-center gap-3 py-2 px-5 bg-brand-pink text-white font-black text-[10px] tracking-[0.3em] uppercase rounded-full mb-8 shadow-xl shadow-brand-pink/20">
                        <Sparkles className="w-4 h-4 fill-white" />
                        Priority Intelligence
                      </div>
                      <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.9] uppercase italic tracking-tighter mb-8 py-2">
                        The Master <br />
                        <span className="text-brand-pink">Protocol</span>
                      </h2>
                      <p className="text-lg text-white/50 font-medium leading-relaxed max-w-md mb-10 uppercase tracking-wide italic">
                        Our primary tier incentive for bulk enterprise solutions. Secure massive deductions on your next high-volume run.
                      </p>
                      
                      <div className="flex flex-wrap gap-4">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex-1 min-w-[240px]">
                           <span className="text-[10px] font-black text-brand-pink uppercase tracking-[0.3em] mb-2 block">Deduction Tier</span>
                           <div className="flex items-end gap-2">
                              <span className="text-6xl font-black text-white tracking-tighter italic">
                                {initialCoupons[0].discount_type === 'percentage' ? `${initialCoupons[0].discount_value}%` : `₹${initialCoupons[0].discount_value}`}
                              </span>
                              <span className="text-sm font-black text-white/30 uppercase tracking-widest mb-2">Off Total</span>
                           </div>
                        </div>
                        <div 
                          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex-1 min-w-[280px] flex items-center justify-between group/code cursor-pointer transition-all hover:bg-white/10" 
                          onClick={() => handleCopy(initialCoupons[0].code)}
                        >
                           <div className="flex-1 min-w-0 pr-4">
                              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 block">Access Code</span>
                              <span className="text-3xl md:text-4xl font-black text-white tracking-widest truncate block">{initialCoupons[0].code}</span>
                           </div>
                           <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-2xl bg-brand-pink flex items-center justify-center text-white shadow-xl group-hover/code:scale-110 transition-transform">
                              {copiedCode === initialCoupons[0].code ? <CheckCircle2 className="w-7 h-7 md:w-8 md:h-8" /> : <Copy className="w-7 h-7 md:w-8 md:h-8" />}
                           </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative aspect-square hidden md:block">
                       <div className="absolute inset-0 bg-brand-pink/20 rounded-full blur-[100px] animate-pulse" />
                       <div className="relative h-full w-full flex items-center justify-center">
                          <Gift className="w-48 h-48 text-brand-pink opacity-20" />
                          <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />
                          <div className="absolute inset-8 border-2 border-dashed border-brand-pink/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                       </div>
                    </div>
                  </div>
               </motion.div>
            </div>

            {/* Other Offers Grid */}
            {initialCoupons.slice(1).map((coupon, idx) => (
              <div key={coupon.code} className="lg:col-span-4">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + (idx * 0.1) }}
                  className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/5 rounded-full blur-3xl group-hover:bg-brand-pink/10 transition-colors" />
                  
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 bg-gray-50 rounded-3xl text-brand-dark group-hover:bg-brand-pink group-hover:text-white transition-all">
                      <Percent className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                       <Clock className="w-3 h-3" /> Limited Intel
                    </div>
                  </div>

                  <h3 className="text-4xl font-black text-brand-dark tracking-tighter uppercase italic leading-none mb-4">
                     {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`} OFF
                  </h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-10 leading-relaxed">
                    {coupon.description || `Secure your ${coupon.discount_value}${coupon.discount_type === 'percentage' ? '%' : ''} deduction on all catalog items with this code.`}
                  </p>

                  <div 
                    onClick={() => handleCopy(coupon.code)}
                    className="w-full bg-gray-50 hover:bg-brand-dark group/code rounded-3xl p-6 flex items-center justify-between transition-all cursor-pointer border border-transparent hover:border-white/10"
                  >
                    <div>
                       <span className="text-[8px] font-black text-gray-300 group-hover/code:text-white/40 uppercase tracking-[0.2em] mb-1 block">Click to Inject</span>
                       <span className="text-xl font-black text-brand-dark group-hover/code:text-white tracking-widest">{coupon.code}</span>
                    </div>
                    <div className="text-gray-300 group-hover/code:text-brand-pink">
                       {copiedCode === coupon.code ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </div>
                  </div>
                  
                  {coupon.min_order_value > 0 && (
                    <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between">
                       <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Min Value</span>
                       <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest">₹{coupon.min_order_value}</span>
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        )}

        {/* Global Assurance Grid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 p-12 md:p-20 bg-white border border-gray-100 rounded-[60px] shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-pink/[0.02] rounded-full blur-[100px] -mr-64 -mt-64" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            <div className="space-y-6">
              <div className="h-16 w-16 bg-pink-50 rounded-3xl flex items-center justify-center text-brand-pink">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h4 className="text-2xl font-black text-brand-dark tracking-tight leading-none uppercase italic">Verified Logic</h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                All incentive codes are cryptographically verified and refreshed daily to ensure maximum deduction potential.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="h-16 w-16 bg-brand-dark/5 rounded-3xl flex items-center justify-center text-brand-dark">
                <Zap className="h-8 w-8" />
              </div>
              <h4 className="text-2xl font-black text-brand-dark tracking-tight leading-none uppercase italic">Instant Injection</h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Apply codes directly at checkout for real-time order value optimization. No complex workflows required.
              </p>
            </div>

            <div className="space-y-6">
               <div className="h-16 w-16 bg-pink-50 rounded-3xl flex items-center justify-center text-brand-pink">
                 <Sparkles className="h-8 w-8" />
               </div>
               <h4 className="text-2xl font-black text-brand-dark tracking-tight leading-none uppercase italic">Elite Tiers</h4>
               <p className="text-sm text-gray-500 font-medium leading-relaxed">
                 Join our Matrix to unlock even higher-fidelity incentives tailored specifically for your brand architecture.
               </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="mt-20 flex flex-col items-center text-center">
           <h3 className="text-3xl font-black text-brand-dark uppercase italic tracking-tighter mb-8">Ready to Optimize?</h3>
           <Link href="/products">
              <button className="bg-brand-dark text-white px-12 py-7 rounded-[40px] text-xs font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-2xl active:scale-95 flex items-center gap-4">
                 Go To Catalog <ArrowRight className="w-4 h-4 text-brand-pink" />
              </button>
           </Link>
        </div>
      </div>
    </div>
  );
}
