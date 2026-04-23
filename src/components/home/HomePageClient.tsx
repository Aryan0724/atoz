"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Star, 
  Award, 
  PenTool, 
  ShoppingCart,
  Box,
  Mail,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/products/ProductCard';
import Button from '@/components/common/Button';
import TrustBadges from '@/components/common/TrustBadges';

// --- Hero Section ---
const Hero = ({ hero }: { hero: any }) => {
  const title = hero?.title || "Your Design.\nOur Impression.";
  const subtitle = hero?.subtitle || "Get high-quality custom products for your brand.";
  
  const rawImage = hero?.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop";
  const images = Array.isArray(rawImage) ? (rawImage.length > 0 ? rawImage : ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop"]) : [rawImage];
  
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-24 overflow-hidden bg-gradient-to-br from-surface via-surface to-surface-variant/20">
      <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 py-1.5 px-3 bg-brand-pink/10 text-brand-pink font-bold text-[10px] tracking-widest uppercase rounded-lg mb-8 border border-brand-pink/20">
            <Star className="w-3.5 h-3.5 fill-current" />
            Top Choice for Businesses
          </div>
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-black text-on-surface leading-[1.05] tracking-tight mb-8 max-w-2xl italic uppercase">
            {title.split(/\\n|\n/).map((line: string, i: number) => (
              <React.Fragment key={i}>
                {line}
                {i < title.split(/\\n|\n/).length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p className="text-lg text-on-surface-variant/90 max-w-lg mb-12 leading-relaxed font-bold uppercase tracking-tight">
            {subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/products">
              <Button variant="primary" size="lg" className="px-10 rounded-xl" rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}>
                Browse Catalog
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="px-10 rounded-xl">
                Partner with Us
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative lg:h-[700px] flex items-center justify-center"
        >
          <div className="absolute top-20 right-0 w-80 h-80 bg-brand-pink/10 rounded-full blur-[100px]"></div>
          
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full aspect-square max-w-[600px]"
          >
            <div className="absolute inset-0 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/50 group">
              {images.map((img, idx) => (
                <Image 
                  key={idx}
                  alt={`Product preview ${idx}`} 
                  className={cn(
                    "w-full h-full object-cover transition-all duration-1000 absolute inset-0",
                    idx === currentImageIndex ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
                  )} 
                  src={img}
                  fill
                  priority={idx === 0}
                />
              ))}
              <div className="absolute top-6 right-6 glass-panel px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 z-10 transition-all hover:scale-105 bg-white/90 backdrop-blur-md border border-white/50">
                <div className="w-9 h-9 bg-brand-pink rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-pink/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-brand-pink/60">Quality Status</div>
                  <div className="font-black text-xs uppercase tracking-widest text-brand-dark">Premium Tier</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// --- Trust Bar ---
const TrustBar = ({ logos }: { logos?: string[] }) => {
  const defaultLogos = ['creative ad agency', 'global tech corp', 'elite design studio', 'modern retail'];
  const displayLogos = logos || defaultLogos;

  return (
    <section className="py-12 border-y border-gray-100 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <p className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 mb-10">Our Trusted Partners</p>
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-opacity duration-700">
          {displayLogos.map((logo, idx) => (
            <span key={idx} className="text-xl font-bold font-headline tracking-tighter cursor-default lowercase opacity-60">{logo}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Statistics ---
const Stats = ({ stats }: { stats?: any[] }) => {
  const defaultStats = [
    { label: 'Orders Shipped Nationwide', value: '1.2M+', color: 'text-brand-pink' },
    { label: 'Curated Design Templates', value: '500+', color: 'text-white' },
    { label: 'Unique Premium Products', value: '250+', color: 'text-white' },
    { label: 'Customer Satisfaction', value: '4.9/5', color: 'text-brand-dark bg-white inline-block px-2 rounded' },
  ];
  const displayStats = stats || defaultStats;

  return (
    <section className="py-20 bg-brand-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
        {displayStats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-2"
          >
            <div className={cn("text-6xl font-bold font-headline tracking-tighter", stat.color)}>{stat.value}</div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// --- Testimonials ---
const Testimonials = ({ testimonials, heading }: { testimonials?: any[], heading?: string }) => {
  const defaultTestimonials = [
    {
      name: "Rohit Sharma",
      role: "D2C Brand Founder",
      content: "\"The quality of prints on hoodies is unmatched. AtoZ has been my backend partner for 2 years.\"",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop"
    },
  ];
  const displayTestimonials = testimonials || defaultTestimonials;
  const displayHeading = heading || "Trusted by many <span className=\"text-brand-pink\">Businesses</span>";

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <span className="text-brand-pink font-bold text-[10px] uppercase tracking-widest border-b-2 border-brand-pink/20 pb-1">Reviews</span>
          <h2 
            className="font-headline text-5xl font-bold mt-6 tracking-tight"
            dangerouslySetInnerHTML={{ __html: displayHeading }}
          />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {displayTestimonials.map((t, idx) => (
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
              <p className="text-lg font-bold leading-relaxed mb-8 text-brand-dark opacity-80">{t.content}</p>
              <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                <div className="relative w-12 h-12">
                  <Image className="rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" src={t.avatar || '/placeholder.png'} alt={t.name} fill />
                </div>
                <div>
                  <div className="font-bold text-sm uppercase tracking-tight">{t.name}</div>
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
const Features = ({ features }: { features?: any[] }) => {
  const defaultFeatures = [
    { title: "White Label", icon: <ShieldCheck className="w-8 h-8" />, desc: "Ship products under your own brand.", color: "pink" },
    { title: "Print on Demand", icon: <Box className="w-8 h-8" />, desc: "No inventory risks. Scale fast.", color: "cyan" },
  ];
  const displayFeatures = features || defaultFeatures;

  const getIcon = (iconName: string) => {
    if (iconName === 'Zap') return <Zap className="w-8 h-8" />;
    if (iconName === 'Box') return <Box className="w-8 h-8" />;
    if (iconName === 'Globe') return <Globe className="w-8 h-8" />;
    return <ShieldCheck className="w-8 h-8" />;
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 text-center mb-16">
        <h2 className="font-headline text-5xl font-bold mb-6 tracking-tighter uppercase leading-none">Why Choose <span className="text-brand-pink">AtoZ Print?</span></h2>
      </div>
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayFeatures.map((f, idx) => (
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
              f.color === "pink" ? "bg-brand-pink/10 text-brand-pink" : 
              f.color === "cyan" ? "bg-brand-cyan/10 text-brand-cyan" : "bg-brand-dark/10 text-brand-dark"
            )}>
              {typeof f.icon === 'string' ? getIcon(f.icon) : f.icon}
            </div>
            <h3 className="font-headline text-xl font-bold mb-4 mt-6 tracking-tight uppercase">{f.title}</h3>
            <div className="text-[10px] font-semibold text-gray-400 leading-relaxed uppercase tracking-widest opacity-80">{f.desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

import BlogSection from '@/components/home/BlogSection';

export default function HomePageClient({ products, config }: { products: any[], config: any }) {
  return (
    <div className="min-h-screen bg-white">
      <Hero hero={config?.hero} />
      <TrustBar logos={config?.trustLogos} />
      <Stats stats={config?.stats} />
      <Testimonials 
        testimonials={config?.testimonials} 
        heading={config?.testimonialsHeading} 
      />
      <TrustBadges />
      
      <BlogSection />
      
      {/* Products & other sections remain with default styling but could further be dynamicized */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-16">
            <h2 className="font-headline text-5xl font-black italic tracking-tighter uppercase">Fresh <span className="text-brand-pink">Drops</span></h2>
            <Link href="/products" className="text-xs font-black uppercase tracking-widest text-brand-dark hover:text-brand-pink transition-all">All Assets →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((p, idx) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Intelligence CTA */}
      <section className="py-24 bg-gray-50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-20 items-center">
           <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
           >
              <span className="text-brand-pink font-black text-[10px] uppercase tracking-[0.3em] mb-6 block">Enterprise Tier Solutions</span>
              <h2 className="text-5xl md:text-7xl font-black text-brand-dark uppercase italic tracking-tighter leading-none mb-10">
                Corporate <br /> <span className="text-brand-pink">Ecosystems</span>
              </h2>
              <p className="text-lg text-gray-400 font-bold uppercase tracking-wide leading-relaxed mb-12">
                 From 500 units to 50,000. Our industrial pipeline is optimized for massive corporate fulfillment with pinpoint precision.
              </p>
              <Link href="/corporate">
                 <Button variant="primary" size="lg" className="rounded-xl px-12">
                    Inquire for Bulk
                 </Button>
              </Link>
           </motion.div>
           <div className="relative">
              <div className="absolute inset-0 bg-brand-pink/10 rounded-full blur-[100px] -z-10" />
              <div className="bg-brand-dark rounded-[48px] p-12 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/20 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-brand-pink/30 transition-colors" />
                 <div className="relative z-10 grid grid-cols-2 gap-8">
                    {[
                      { label: "SLA Guaranteed", val: "100%" },
                      { label: "Fulfillment Speed", val: "48hr" },
                      { label: "QC Audits", val: "5-Step" },
                      { label: "Global Reach", val: "19k+" }
                    ].map(s => (
                      <div key={s.label}>
                         <div className="text-4xl font-black text-brand-pink italic tracking-tighter mb-1">{s.val}</div>
                         <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">{s.label}</div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* CTA remain for now but use config if available */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto bg-brand-dark rounded-[60px] p-20 text-center relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-80 h-80 bg-brand-pink/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
           <h2 className="font-headline text-5xl md:text-7xl font-black text-white italic uppercase leading-none tracking-tighter mb-8">Bring Your Vision to <br /> <span className="text-brand-pink">Life With Us</span></h2>
           <Link href="/register">
             <Button variant="secondary" size="lg" className="px-16 bg-white text-brand-dark hover:bg-brand-pink hover:text-white transition-all transform hover:scale-110">
               Get Started
             </Button>
           </Link>
        </div>
      </section>
    </div>
  );
}
