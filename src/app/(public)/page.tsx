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
  Smartphone, 
  ShoppingCart,
  Star,
  Award,
  PenTool,
  AppWindow,
  Box,
  Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Hero Section ---
const Hero = () => {
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
          <h1 className="font-headline text-6xl md:text-7xl lg:text-8xl font-black text-on-surface leading-[0.9] tracking-tighter mb-8">
            Your <span className="text-primary italic">Design</span>.<br/>Our Impression.
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-lg mb-12 leading-relaxed font-medium">
            Elevate your brand identity with high-fidelity custom merchandise. From boutique startups to Fortune 500s, we deliver retail-ready excellence.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link 
              href="/customize"
              className="ink-gradient text-white px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center gap-2"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/pricing"
              className="bg-white text-on-surface px-10 py-5 rounded-xl font-bold text-lg border border-outline-variant/30 hover:bg-surface-variant/10 transition-all"
            >
              View Bulk Pricing
            </Link>
          </div>
          <div className="mt-16 flex items-center gap-12 border-t border-outline-variant/20 pt-8">
            <div className="glass-panel px-6 py-3 rounded-2xl border-white/40 shadow-sm">
              <div className="text-3xl font-black text-secondary">1.2M+</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-secondary/60">Orders Shipped</div>
            </div>
            <div className="glass-panel px-6 py-3 rounded-2xl border-white/40 shadow-sm">
              <div className="text-3xl font-black text-secondary">4.9/5</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-secondary/60">Average Rating</div>
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5Ef6_VFGAD6gOJv_6Rfel_EdW5rMsw7bMgAtMtXC0EPoQzsLQBnXrZ9pOdDjaFUUwGu8s5X9RyKspiEE30ffCViuMmSBNs07AjREht2NqqlLbrqUlaeP5XDYLykEoRL3jn6IlTfd-zcmfnapE11X648DuolW14ucqv4PQoUK1xbVnONNwZaVmvB_PlD2P6Du8kswSs8vPPvfE00zx7BKa4UH3SeqLprjzOjUqP5ICPWI3I9L-QFwAzTIHOQ06PoEcBJBx7bvka1A"
                fill
              />
              <div className="absolute top-8 right-8 glass-panel px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 z-10 transition-all hover:scale-105">
                <div className="w-10 h-10 ink-gradient rounded-full flex items-center justify-center text-white">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-tighter opacity-50">Quality Status</div>
                  <div className="font-bold text-sm">Premium Print</div>
                </div>
              </div>
            </div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: -3 }}
              className="absolute -bottom-10 -left-10 glass-panel p-6 rounded-3xl shadow-2xl max-w-[240px] border-white/50 z-20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Delivery</span>
              </div>
              <p className="text-sm font-bold text-on-surface">Guaranteed 48hr Dispatch on Priority Orders</p>
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
          <span className="text-2xl font-black font-headline tracking-tighter cursor-default">CREATIVE AD AGENCY</span>
          <span className="text-2xl font-black font-headline tracking-tighter cursor-default">GLOBAL TECH CORP</span>
          <span className="text-2xl font-black font-headline tracking-tighter cursor-default">ELITE DESIGN STUDIO</span>
          <span className="text-2xl font-black font-headline tracking-tighter cursor-default">MODERN RETAIL</span>
        </div>
      </div>
    </section>
  );
};

// --- Statistics ---
const Stats = () => {
  return (
    <section className="py-20 bg-secondary text-white relative overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
        {[
          { label: 'Orders Shipped Nationwide', value: '1.2M+', color: 'text-primary' },
          { label: 'Curated Design Templates', value: '500+', color: 'text-white' },
          { label: 'Unique Premium Products', value: '250+', color: 'text-white' },
          { label: 'Customer Satisfaction', value: '4.9/5', color: 'text-primary' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-2"
          >
            <div className={cn("text-6xl font-black font-headline tracking-tighter", stat.color)}>{stat.value}</div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">{stat.label}</p>
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
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5l_OyMg65XMmSCDU3vwTDv6BjwE0abmSXuoJhiNCpGphetKUO5R_s98u5DV7PRLoXlxaFUmj6HhK3-ix6M4SOi--RUurTcjx8uLpyVjbzVGZEmH4XHXQxiyTlB6YZNSdygthwmCcGt8jvI10sHphP-U75wIsEsAD8Vbj_eS7lkeUV8pcRTGFHRBl4rlkQtpdAc3IrmdJ_RDmFDqB2FaBLMr2nyZSlocNIZrb-nhTcar4xSU1KpxAU6q-NVmvVEFbp-u2wn2eRmj8"
    },
    {
      name: "Ananya Iyer",
      role: "Corporate Gifting Lead",
      content: "\"Finding a reliable source for high-quality corporate swag was hard until we found AtoZ. Their bulk dashboard is seamless.\"",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuxDLzSIu2gEvBe1AkHD-Tx83PNWT9XKxBWQIQYvSiyXVcgChEYDyOuZs1BQxkiFWUlPn9TIWuhGlPXRbu8BHLX-jJoUIM7LnnRdzSCP8gOJn_kx4JFzNfSKAPqbqhPeZqpGbpkTwAHb_PurBi2QKKZYlPlCCZ-L-gq6hf-gOwoCAS8ts8SnmPHXVForK18jcSTg4zYkIMbGIaMDr6VZlxXt5_KJ7fkH7-L8CdkGwvnLjVtuaca0jE_bFdmTw7cj5oCuGbPLvkr4k"
    },
    {
      name: "Vikram Malhotra",
      role: "Independent Artist",
      content: "\"As an artist, color accuracy is everything. The direct-to-garment printing quality here is the best I've seen in the industry.\"",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAH7bYS8t8Lvj8NGyrZQKyfqWfAUX7mPDmxF4F06HrN4Yk2WbX2-3SDrAH-2GN3TWcDfAlo-MvWP6T_6Mhw5LutyXrbrT-oByrj0iArjhb4GJjmCNPtxefdpQuAXHwzSQlcr10KJvLIt_kt7hgPXIst63XYCx4uf7M6lT6KaTQA3rAVwuWuLDN8i9C629QNSvjSPjNbAzzW-Q2U8B1MhPkBWQfG3HeO8U93bIDm5FAjEY186un61PpdrIV88LR3yet46Db5Fy2Zswg"
    }
  ];

  return (
    <section className="py-24 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <span className="text-primary font-bold text-xs uppercase tracking-widest border-b-2 border-primary/20 pb-1">Social Proof</span>
          <h2 className="font-headline text-5xl font-black mt-6 tracking-tight">Trusted by Creators & Brands</h2>
          <p className="text-on-surface-variant mt-4 max-w-xl mx-auto font-medium">Join thousands of entrepreneurs who have scaled their dream brands with AtoZ Print&apos;s precision manufacturing.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="depth-card bg-white p-10 rounded-3xl border border-outline-variant/10"
            >
              <div className="flex gap-1 text-primary mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-lg font-medium leading-relaxed mb-8 text-on-surface">{t.content}</p>
              <div className="flex items-center gap-4 pt-6 border-t border-outline-variant/10">
                <div className="relative w-12 h-12">
                  <Image className="rounded-full object-cover" src={t.avatar} alt={t.name} fill />
                </div>
                <div>
                  <div className="font-bold text-sm">{t.name}</div>
                  <div className="text-xs text-on-surface-variant">{t.role}</div>
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
    { title: "White Label", icon: <ShieldCheck className="w-8 h-8" />, desc: "Ship products under your own brand. No mention of AtoZ Print anywhere on the package.", color: "primary" },
    { title: "Print on Demand", icon: <Box className="w-8 h-8" />, desc: "No inventory risks. We print items only after you make a sale. Start small, scale fast.", color: "secondary" },
    { title: "Fast Fulfillment", icon: <Zap className="w-8 h-8" />, desc: "Industry-leading turnaround. Most orders are printed and shipped within 48-72 hours.", color: "primary" },
    { title: "Global Reach", icon: <Globe className="w-8 h-8" />, desc: "We deliver to over 19,000+ pin codes with premium logistics partners and carbon-neutral shipping.", color: "secondary" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="font-headline text-5xl font-black mb-6">Why Choose AtoZ Print?</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto font-medium">Scale your business with our robust infrastructure designed for speed, quality, and extreme reliability.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="depth-card p-8 bg-surface rounded-3xl group"
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:text-white",
                f.color === "primary" ? "bg-primary/10 text-primary group-hover:ink-gradient" : "bg-secondary/10 text-secondary group-hover:bg-secondary"
              )}>
                {f.icon}
              </div>
              <h3 className="font-headline text-xl font-bold mb-4 mt-6">{f.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Categories Section ---
const Categories = () => {
  const cats = [
    { 
      name: "Premium Cotton T-Shirt", 
      tag: "Apparel", 
      price: "$12.99", 
      min: "50 Units", 
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5Ef6_VFGAD6gOJv_6Rfel_EdW5rMsw7bMgAtMtXC0EPoQzsLQBnXrZ9pOdDjaFUUwGu8s5X9RyKspiEE30ffCViuMmSBNs07AjREht2NqqlLbrqUlaeP5XDYLykEoRL3jn6IlTfd-zcmfnapE11X648DuolW14ucqv4PQoUK1xbVnONNwZaVmvB_PlD2P6Du8kswSs8vPPvfE00zx7BKa4UH3SeqLprjzOjUqP5ICPWI3I9L-QFwAzTIHOQ06PoEcBJBx7bvka1A" 
    },
    { 
      name: "Matte Ceramic Mug", 
      tag: "Drinkware", 
      price: "$5.49", 
      min: "100 Units", 
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1vfD7DXX0OZnt_m-2rcp4EojUJYf6Lsu2vylypR7ex7c8iCrjXZ9sNY3u7ZKGXbKCe5vebH9jNNT8_j8dnZkORSw_PZv_gm8G4jdXXBZr-CNdU10LOobWsPx9v322wIBBbMtR0Hm_DPD871REPznLTLHvz73Myp0ZpwnFvTp2Ff8-YT2t_ERA5wDTa2bkZOzfXKS-nPlYjJEMpvcJnGsTVHoDptwDPGPXwwdErdm_NH-0rx36hd8HPBKFFQ7XDhfQDB5s8QFiY3k" 
    },
    { 
      name: "Corporate Hardcover Notebook", 
      tag: "Stationery", 
      price: "$8.99", 
      min: "50 Units", 
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvIkmGSRBqel8aMnTy44Pc9FD4skKQ5D6rDPva2R2JKHxmAGGot1mQT4PMvAqVefSUmOs3ts2SQ0yf1A7gmZjh_1kDR_Ohl0wWRiU3AQGaOpE4UfzCs8eoRGx30MXiLbfdejxMvIC4tB_ytIC8VYTJP4gzQ6cTroznW9yKWWIH1rbWD_N3_VCpn0su7c2fYyMnlXXOAk5_SnJBj5kWu95ip8i6iC6BSTfqLuLf8_uQCgiKhjPoFMOliITk8npJzxz3ZrcHkbVjOuQ" 
    },
    { 
      name: "Tech Accessories Pouch", 
      tag: "Lifestyle", 
      price: "$14.49", 
      min: "50 Units", 
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEHM5NkWZ9aprNWm7h5dGologeU_E3rtcaagk7z12SRH8HPcXVrr85Pbsa02U-y6PVAMypVWWdUJ5X2HS0AkhYqCXd8YECMaR0xsda2Cv1W1rKpmZTTuSLuBtCL1Yl-dKc5R0cEqMLeOxZ6lHRhTYUkrGbxdRIbuKgA1P9BLOxDjUJXb864ul4KWb61kwJlU1w71DpasrhanAOpG9xMWLNAdTft5jq9La5if5I9M2KesWBwz9ynfmY1HELpU7QNBAonwNbjU3beP8" 
    },
  ];

  return (
    <section className="py-24 bg-surface-variant/10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-primary font-bold text-xs uppercase tracking-widest border-b-2 border-primary/20 pb-1">Top Categories</span>
            <h2 className="font-headline text-5xl font-black mt-6 tracking-tight">Premium Corporate Gifts</h2>
          </div>
          <Link href="/products" className="group flex items-center gap-3 text-on-surface font-bold hover:text-primary transition-all">
            View Entire Catalog
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cats.map((p, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="depth-card bg-white p-4 rounded-3xl"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-square mb-6 bg-surface">
                <Image className="w-full h-full object-cover" src={p.img} alt={p.name} fill />
                <div className="absolute top-4 left-4 glass-panel px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest z-10">
                  Min. {p.min}
                </div>
              </div>
              <div className="px-2 pb-2">
                <span className="text-primary font-bold text-[10px] uppercase tracking-widest">{p.tag}</span>
                <h4 className="font-headline text-xl font-extrabold mb-4">{p.name}</h4>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-on-surface-variant font-medium">Starting from</span>
                    <div className="text-lg font-black">{p.price}</div>
                  </div>
                  <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
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
    { title: "Pick a Product", icon: <PenTool />, desc: "Choose from our wide catalog of premium apparel, tech, or lifestyle products.", number: "01", bg: "bg-secondary" },
    { title: "Add Your Design", icon: <Award />, desc: "Use our intuitive design tool to upload your artwork or create something entirely new.", number: "02", bg: "bg-primary" },
    { title: "Place Your Order", icon: <ShoppingCart />, desc: "Order a single sample or start a storefront. We handle bulk and single orders with ease.", number: "03", bg: "bg-secondary" },
    { title: "We Ship Directly", icon: <Truck />, desc: "We print, quality check, and ship it directly to your customer or office with tracking.", number: "04", bg: "bg-primary" },
  ];

  return (
    <section className="py-24 bg-on-surface text-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-24">
          <h2 className="font-headline text-5xl font-black mb-6">4 Simple Steps to Success</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-4 gap-12 relative">
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-white/10 z-0"></div>
          {steps.map((s, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative z-10 text-center"
            >
              <div className={cn("w-24 h-24 flex items-center justify-center rounded-3xl mx-auto mb-8 shadow-2xl border border-white/10 relative overflow-hidden", s.bg)}>
                <span className="text-5xl font-black opacity-20">{s.number}</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  {React.cloneElement(s.icon as React.ReactElement, { className: "w-8 h-8" })}
                </div>
              </div>
              <h3 className="font-headline text-xl font-bold mb-4">{s.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Call to Action ---
const CTA = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="ink-gradient rounded-[3rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-[0_50px_100px_rgba(233,30,99,0.3)]">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/30 rounded-full blur-[100px]"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-headline text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">Ready to Build Your <span className="text-secondary">Printing Empire?</span></h2>
            <p className="text-xl md:text-2xl text-white/80 font-medium mb-12">Join 10,000+ businesses and creators who trust AtoZ Print for their premium custom merchandise.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/login" className="bg-white text-on-surface px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl">
                Create Free Account
              </Link>
              <Link href="/contact" className="bg-secondary/20 backdrop-blur-md border border-white/20 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all">
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface selection:bg-primary selection:text-white">
      <Hero />
      <TrustBar />
      <Stats />
      <Testimonials />
      <Features />
      <Categories />
      <Steps />
      <CTA />
    </div>
  );
}
