"use client";

import React, { useState } from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import { Briefcase, Zap, Globe, Users, ArrowRight, CheckCircle2, MessageSquare, Send, Building2, Layers, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import { toast } from 'sonner';

const SOLUTIONS = [
  {
    icon: Building2,
    title: "Corporate Identity",
    desc: "Consistent branding across apparel, stationery, and premium gifts for your global workforce."
  },
  {
    icon: Zap,
    title: "Event Propulsion",
    desc: "Rapid fulfillment for conferences, launches, and summits. 48-hour delivery on core items."
  },
  {
    icon: Globe,
    title: "Dropshipping API",
    desc: "Inject our production intelligence directly into your store with our high-fidelity API."
  }
];

export default function CorporateClient() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Inquiry Protocol Initiated. An account strategist will contact you shortly.");
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen pt-40 pb-24 relative text-brand-dark selection:bg-brand-pink/10 selection:text-brand-pink">
      {/* Premium Hero Section */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 xl:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 py-2 px-5 bg-brand-dark text-white font-black text-[10px] tracking-[0.3em] uppercase rounded-full mb-8 shadow-2xl">
              <Layers className="w-4 h-4 text-brand-pink" />
              Enterprise Tier
            </div>
            <h1 className="text-5xl lg:text-6xl xl:text-8xl font-black text-brand-dark leading-[0.95] uppercase italic tracking-tighter mb-10 break-words">
              Bulk <br />
              <span className="text-brand-pink">Intelligence</span>
            </h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl mb-12 uppercase tracking-wide">
              Scale your brand architecture with industrial-grade printing solutions. Optimized for high-volume corporate fulfillment.
            </p>
            
            <div className="flex flex-wrap gap-6">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-brand-pink">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">SLA Guaranteed</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-brand-pink">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Global Logistics</span>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="bg-brand-dark rounded-[60px] p-12 md:p-16 shadow-2xl relative overflow-hidden border border-white/5"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/20 rounded-full blur-3xl -mr-32 -mt-32" />
             <div className="relative z-10">
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-8 leading-none">Inquiry <br />Protocol</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Entity Name</label>
                         <input type="text" placeholder="Company Name" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:ring-4 focus:ring-brand-pink/20 outline-none transition-all" required />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Work Email</label>
                         <input type="email" placeholder="corporate@entity.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:ring-4 focus:ring-brand-pink/20 outline-none transition-all" required />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Project Scale</label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:ring-4 focus:ring-brand-pink/20 outline-none appearance-none cursor-pointer transition-all">
                         <option className="bg-brand-dark">100 - 500 Units</option>
                         <option className="bg-brand-dark">500 - 2,500 Units</option>
                         <option className="bg-brand-dark">2,500 - 10,000+ Units</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Mission Requirements</label>
                      <textarea rows={4} placeholder="Describe your branding objectives..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:ring-4 focus:ring-brand-pink/20 outline-none transition-all resize-none"></textarea>
                   </div>
                   <button 
                     type="submit" 
                     disabled={loading}
                     className="w-full bg-brand-pink hover:bg-white hover:text-brand-dark text-white py-6 rounded-3xl font-black uppercase text-[11px] tracking-[0.3em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
                   >
                      {loading ? "Transmitting..." : "Initiate Briefing"} <Send className="w-4 h-4" />
                   </button>
                </form>
             </div>
          </motion.div>
        </div>

        {/* Solutions Grid */}
        <div className="mt-40">
           <SectionHeading 
             badge="High-Fidelity Solutions"
             title="The Enterprise Layer"
             subtitle="Optimized production paths for modern brand architectures."
             align="left"
           />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
              {SOLUTIONS.map((solution, idx) => (
                <motion.div 
                  key={solution.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-[48px] p-12 border border-transparent hover:border-brand-pink/20 transition-all group"
                >
                   <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-brand-dark mb-10 group-hover:bg-brand-pink group-hover:text-white transition-all">
                      <solution.icon className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-black text-brand-dark uppercase italic tracking-tighter leading-none mb-6">{solution.title}</h3>
                   <p className="text-sm text-gray-500 font-medium leading-relaxed uppercase tracking-wider">
                      {solution.desc}
                   </p>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Brand Showcase Mockup */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-40 bg-brand-dark rounded-[60px] p-20 text-center relative overflow-hidden"
        >
           <div className="absolute inset-0 bg-gradient-to-b from-brand-pink/10 to-transparent" />
           <div className="relative z-10 max-w-2xl mx-auto">
              <Sparkles className="w-12 h-12 text-brand-pink mx-auto mb-10 animate-pulse" />
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-10">
                Unlock Industrial <br /> <span className="text-brand-pink">Precision</span>
              </h2>
              <p className="text-white/40 text-sm font-bold uppercase tracking-[0.3em] leading-loose mb-12">
                 Join 500+ global entities that rely on AtoZ Prints for their physical brand presence.
              </p>
              <div className="flex justify-center gap-10 opacity-20 filter grayscale invert">
                 <Building2 className="w-12 h-12" />
                 <Users className="w-12 h-12" />
                 <Globe className="w-12 h-12" />
                 <Briefcase className="w-12 h-12" />
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
