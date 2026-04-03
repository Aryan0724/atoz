"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Star, 
  Award, 
  PenTool, 
  ShoppingCart,
  Box,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/products/ProductCard';

// --- Hero Section ---
const Hero = ({ heroConfig }: { heroConfig: { title: string, subtitle: string, image: string } }) => {
  return (
    <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-24 overflow-hidden bg-gradient-to-br from-surface via-surface to-surface-variant/20">
      <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 py-1.5 px-3 bg-primary/10 text-primary font-bold text-xs tracking-widest uppercase rounded-full mb-8 border border-primary/20">
            <Star className="w-3.5 h-3.5 fill-current" />
            The Premium Choice for Brands
          </div>
          <h1 className="font-headline text-6xl md:text-7xl lg:text-8xl font-black text-on-surface leading-[0.9] tracking-tighter mb-8 italic" dangerouslySetInnerHTML={{ __html: heroConfig.title.replace(/\n/g, '<br/>') }}>
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant max-w-lg mb-12 leading-relaxed font-black uppercase tracking-widest italic opacity-60">
            {heroConfig.subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/products"
              className="bg-brand-dark text-white px-7 py-3 rounded-[16px] font-black text-xs uppercase tracking-[0.25em] shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:shadow-brand-pink/20 hover:bg-brand-pink hover:-translate-y-0.5 transition-all flex items-center gap-2.5 italic group"
            >
              Express Execution
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/register"
              className="bg-white text-brand-dark px-7 py-3 rounded-[16px] font-black text-xs uppercase tracking-[0.25em] border border-gray-100 shadow-md hover:shadow-gray-200 hover:border-gray-200 transition-all italic"
            >
              Portal Access
            </Link>
          </div>
          <div className="mt-16 flex items-center gap-12 border-t border-outline-variant/20 pt-8">
            <div className="glass-panel px-6 py-3 rounded-2xl border-white/40 shadow-sm transition-all hover:bg-brand-pink hover:text-white group">
              <div className="text-3xl font-black text-secondary group-hover:text-white">1.2M+</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-secondary/60 group-hover:text-white/60">Orders Shipped</div>
            </div>
            <div className="glass-panel px-6 py-3 rounded-2xl border-white/40 shadow-sm transition-all hover:bg-brand-cyan hover:text-white group">
              <div className="text-3xl font-black text-secondary group-hover:text-white">4.9/5</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-secondary/60 group-hover:text-white/60">Average Rating</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative lg:h-[700px] flex items-center justify-center"
        >
          <div className="absolute top-20 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]"></div>
          
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full aspect-square max-w-[600px]"
          >
            <div className="absolute inset-0 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/50 group">
              <Image 
                alt="High-fidelity product mockup" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src={heroConfig.image}
                fill
              />
              <div className="absolute top-8 right-8 glass-panel px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 z-10 transition-all hover:scale-105 bg-white/80 backdrop-blur-md">
                <div className="w-10 h-10 bg-brand-pink rounded-full flex items-center justify-center text-white">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-tighter opacity-50">Quality Status</div>
                  <div className="font-black text-sm uppercase tracking-widest italic">Premium Tier</div>
                </div>
              </div>
            </div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: -3 }}
              className="absolute -bottom-10 -left-10 glass-panel p-6 rounded-3xl shadow-2xl max-w-[240px] border-white/50 z-20 bg-brand-dark text-white"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-brand-pink rounded-lg text-white">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest underline decoration-brand-pink decoration-2 underline-offset-4">Dispatch Stats</span>
              </div>
              <p className="text-xs font-black uppercase tracking-widest italic opacity-80 leading-relaxed">Guaranteed 48hr Dispatch on Priority Deployments</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// --- Trust Bar ---
const TrustBar = () => {
  return (
    <section className="py-10 border-y border-outline-variant/10 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40 mb-8">Trusted by Global Industry Leaders</p>
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          <span className="text-2xl font-black font-headline tracking-tighter cursor-default lowercase italic">creative ad agency</span>
          <span className="text-2xl font-black font-headline tracking-tighter cursor-default lowercase italic">global tech corp</span>
          <span className="text-2xl font-black font-headline tracking-tighter cursor-default lowercase italic">elite design studio</span>
          <span className="text-2xl font-black font-headline tracking-tighter cursor-default lowercase italic">modern retail</span>
        </div>
      </div>
    </section>
  );
};

// --- Statistics ---
const Stats = () => {
  return (
    <section className="py-20 bg-brand-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
        {[
          { label: 'Orders Shipped Nationwide', value: '1.2M+', color: 'text-brand-pink' },
          { label: 'Curated Design Templates', value: '500+', color: 'text-white' },
          { label: 'Unique Premium Products', value: '250+', color: 'text-white' },
          { label: 'Customer Satisfaction', value: '4.9/5', color: 'text-brand-cyan' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-2"
          >
            <div className={cn("text-6xl font-black font-headline tracking-tighter italic", stat.color)}>{stat.value}</div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// --- Testimonials ---
const Testimonials = () => {
  const testimonials = [
    {
      name: "Rohit Sharma",
      role: "D2C Brand Founder",
      content: "\"The quality of prints on hoodies is unmatched. AtoZ has been my backend partner for 2 years, and they never miss a deadline.\"",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop"
    },
    {
      name: "Ananya Iyer",
      role: "Corporate Gifting Lead",
      content: "\"Finding a reliable source for high-quality corporate swag was hard until we found AtoZ. Their bulk dashboard is seamless.\"",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop"
    },
    {
      name: "Vikram Malhotra",
      role: "Independent Artist",
      content: "\"As an artist, color accuracy is everything. The direct-to-garment printing quality here is the best I've seen in the industry.\"",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <span className="text-brand-pink font-black text-[10px] uppercase tracking-widest border-b-2 border-brand-pink/20 pb-1 italic">Intelligence Reports</span>
          <h2 className="font-headline text-5xl font-black mt-6 tracking-tight italic">Trusted by <span className="text-brand-pink italic">Creators</span> & Brands</h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto font-black uppercase text-[10px] tracking-widest italic opacity-60">Join thousands of entrepreneurs who have scaled their dream brands with AtoZ Print&apos;s precision manufacturing.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-2xl shadow-gray-100 hover:border-brand-pink/20 transition-all group"
            >
              <div className="flex gap-1 text-brand-pink mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />)}
              </div>
              <p className="text-lg font-bold leading-relaxed mb-8 text-brand-dark italic opacity-80">{t.content}</p>
              <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                <div className="relative w-12 h-12">
                  <Image className="rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" src={t.avatar} alt={t.name} fill />
                </div>
                <div>
                  <div className="font-black text-sm uppercase tracking-tight italic">{t.name}</div>
                  <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Features Section ---
const Features = () => {
  const features = [
    { title: "White Label", icon: <ShieldCheck className="w-8 h-8" />, desc: "Ship products under your own brand. No mention of AtoZ Print anywhere on the package.", color: "pink" },
    { title: "Print on Demand", icon: <Box className="w-8 h-8" />, desc: "No inventory risks. We print items only after you make a sale. Start small, scale fast.", color: "cyan" },
    { title: "Fast Fulfillment", icon: <Zap className="w-8 h-8" />, desc: "Industry-leading turnaround. Most orders are printed and shipped within 48-72 hours.", color: "pink" },
    { title: "Global Reach", icon: <Globe className="w-8 h-8" />, desc: "We deliver to over 19,000+ pin codes with premium logistics partners and carbon-neutral shipping.", color: "cyan" },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 text-center mb-16">
        <h2 className="font-headline text-5xl font-black mb-6 italic tracking-tighter uppercase leading-none">Why Choose <span className="text-brand-pink italic">AtoZ Print?</span></h2>
        <p className="text-gray-400 max-w-2xl mx-auto font-black uppercase text-[10px] tracking-widest italic opacity-60">Scale your business with our robust infrastructure designed for speed, quality, and extreme reliability.</p>
      </div>
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 bg-white rounded-[32px] group border border-transparent hover:border-brand-pink/20 transition-all hover:shadow-2xl hover:shadow-gray-200"
          >
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
              f.color === "pink" ? "bg-brand-pink/10 text-brand-pink" : "bg-brand-cyan/10 text-brand-cyan"
            )}>
              {f.icon}
            </div>
            <h3 className="font-headline text-xl font-black mb-4 mt-6 italic tracking-tight uppercase">{f.title}</h3>
            <p className="text-[10px] font-black text-gray-400 leading-relaxed uppercase tracking-widest opacity-80">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// --- Categories Section ---
const Categories = ({ products }: { products: any[] }) => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-brand-pink font-black text-[10px] uppercase tracking-widest border-b-2 border-brand-pink/20 pb-1 italic">Top Selections</span>
            <h2 className="font-headline text-5xl font-black mt-6 tracking-tight italic uppercase leading-none">Premium <span className="text-brand-pink italic">Gear</span> Deployment</h2>
            <p className="text-gray-400 mt-4 font-black uppercase text-[10px] tracking-widest italic opacity-60">Select your base asset and initiate design customization.</p>
          </div>
          <Link href="/products" className="group flex items-center gap-3 text-brand-dark font-black uppercase text-xs tracking-widest hover:text-brand-pink transition-all italic">
            Catalog Intel
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 overflow-x-auto pb-8 md:pb-0 scrollbar-hide snap-x">
          {products.map((p, idx) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="min-w-[280px] md:min-w-0 snap-center"
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Steps Section ---
const Steps = () => {
  const steps = [
    { title: "Pick a Product", icon: <PenTool />, desc: "Choose from our wide catalog of premium apparel, tech, or lifestyle products.", number: "01", bg: "bg-brand-cyan", href: "/products" },
    { title: "Add Your Design", icon: <Award />, desc: "Use our intuitive design tool to upload your artwork or create something entirely new.", number: "02", bg: "bg-brand-pink" },
    { title: "Place Your Order", icon: <ShoppingCart />, desc: "Order a single sample or start a storefront. We handle bulk and single orders with ease.", number: "03", bg: "bg-brand-cyan" },
    { title: "We Ship Directly", icon: <Truck />, desc: "We print, quality check, and ship it directly to your customer or office with tracking.", number: "04", bg: "bg-brand-pink" },
  ];

  return (
    <section className="py-24 bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-24">
          <h2 className="font-headline text-5xl font-black mb-6 italic tracking-tighter uppercase leading-none">4 Simple Steps to <span className="text-brand-pink italic">Execution</span></h2>
          <div className="w-24 h-1 bg-brand-pink mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-4 gap-12 relative">
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-white/5 z-0"></div>
          {steps.map((s, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative z-10 text-center"
            >
              {s.href ? (
                <Link href={s.href} className="group cursor-pointer block">
                  <div className={cn("w-24 h-24 flex items-center justify-center rounded-3xl mx-auto mb-8 shadow-2xl border border-white/10 relative overflow-hidden transition-transform group-hover:scale-105 group-hover:shadow-brand-pink/20", s.bg)}>
                    <span className="text-5xl font-black opacity-20">{s.number}</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {React.cloneElement(s.icon as React.ReactElement, { className: "w-8 h-8" })}
                    </div>
                  </div>
                  <h3 className="font-headline text-xl font-black mb-4 group-hover:text-brand-pink transition-colors italic tracking-tight uppercase leading-none">{s.title}</h3>
                </Link>
              ) : (
                <>
                  <div className={cn("w-24 h-24 flex items-center justify-center rounded-3xl mx-auto mb-8 shadow-2xl border border-white/10 relative overflow-hidden", s.bg)}>
                    <span className="text-5xl font-black opacity-20">{s.number}</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {React.cloneElement(s.icon as React.ReactElement, { className: "w-8 h-8" })}
                    </div>
                  </div>
                  <h3 className="font-headline text-xl font-black mb-4 italic tracking-tight uppercase leading-none">{s.title}</h3>
                </>
              )}
              <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] leading-relaxed italic">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Email Signup ---
const EmailSignup = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="bg-gray-50 p-12 md:p-20 rounded-[48px] border border-gray-100 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl shadow-gray-100">
          <div className="max-w-xl text-center lg:text-left">
            <div className="w-16 h-16 bg-brand-pink/10 rounded-2xl flex items-center justify-center text-brand-pink mb-8 mx-auto lg:mx-0">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="font-headline text-4xl md:text-5xl font-black mb-6 tracking-tight italic uppercase leading-none">Stay Ahead of the <span className="text-brand-pink italic">Curve</span></h2>
            <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] italic opacity-80">Get early access to new product drops, printing tech updates, and exclusive bulk-order discounts.</p>
          </div>
          
          <div className="w-full max-w-md">
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your work email" 
                className="w-full pl-8 pr-40 py-6 rounded-[24px] bg-white border border-gray-100 focus:outline-none focus:ring-4 focus:ring-brand-pink/10 focus:border-brand-pink/20 transition-all font-bold text-brand-dark shadow-xl shadow-gray-100"
                required
              />
              <button 
                type="submit" 
                className="absolute right-3 top-3 bottom-3 px-8 rounded-xl bg-brand-dark text-white font-black text-[10px] uppercase tracking-widest hover:bg-brand-pink transition-all shadow-lg active:scale-95 italic"
              >
                Join Now
              </button>
            </form>
            <p className="mt-4 text-[9px] uppercase tracking-widest font-black text-gray-300 text-center lg:text-left italic">No spam. Just high-fidelity updates. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Call to Action ---
const CTA = () => {
  return (
    <section className="py-20 mb-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="bg-brand-dark rounded-[48px] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)]">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-pink/10 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-cyan/10 rounded-full blur-[100px]"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-headline text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter italic uppercase">Ready to Build Your <span className="text-brand-pink italic">Printing Empire?</span></h2>
            <p className="text-xl md:text-2xl text-white/40 font-black uppercase text-[10px] tracking-widest italic mb-12">Join 10,000+ businesses and creators who trust AtoZ Print for their premium custom merchandise.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className="bg-white text-brand-dark px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl italic">
                Create Account
              </Link>
              <Link href="/login" className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all italic">
                Secure Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function HomePageClient({ products, heroConfig }: { products: any[], heroConfig: { title: string, subtitle: string, image: string } }) {
  return (
    <div className="min-h-screen bg-white">
      <Hero heroConfig={heroConfig} />
      <TrustBar />
      <Stats />
      <Testimonials />
      <Features />
      <Categories products={products} />
      <Steps />
      <EmailSignup />
      <CTA />
    </div>
  );
}
