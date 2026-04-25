'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { 
  PenTool, 
  Printer, 
  PackageCheck, 
  Leaf, 
  ArrowRight, 
  ChevronDown,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/products/ProductCard';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger, Draggable);

export default function HomePageClient({ products, config }: { products: any[], config?: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [qty, setQty] = useState(500);
  const [productPrice, setProductPrice] = useState(2);
  const [total, setTotal] = useState(1000);

  useEffect(() => {
    // Initial Animations
    const ctx = gsap.context(() => {
      // Hero reveal
      const tl = gsap.timeline();
      tl.to(".hero-text", { y: 0, duration: 1.5, stagger: 0.1, ease: "power4.out" }, 0.5)
        .to(".hero-reveal", { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power3.out" }, "-=0.8")
        .to(".hero-badge", { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=1");

      // Title reveals
      const titles = document.querySelectorAll('.reveal-title');
      titles.forEach(title => {
        gsap.set(title, { opacity: 1 }); // Ensure visibility during splitting
        const splitTitle = new SplitType(title as HTMLElement, { types: 'lines,words' });
        gsap.from(splitTitle.words, { 
          y: 50, 
          opacity: 0, 
          duration: 1.2, 
          stagger: 0.05, 
          ease: "power3.out", 
          scrollTrigger: { trigger: title, start: "top 85%" } 
        });
      });

      // Manifesto reveal
      const manifestoText = document.getElementById('manifesto-text');
      if (manifestoText) {
        const splitManifesto = new SplitType(manifestoText, { types: 'words' });
        gsap.from(splitManifesto.words, {
          opacity: 0.1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: manifestoText,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
          }
        });
      }

      // Stats counters
      const counters = document.querySelectorAll('.counter');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || '0');
        gsap.to(counter, {
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
          scrollTrigger: { trigger: counter, start: "top 90%" }
        });
      });

      // Stat bars
      gsap.utils.toArray<HTMLElement>('.stat-bar').forEach(bar => {
        gsap.to(bar, {
          width: '100%',
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: { trigger: bar, start: "top 90%" }
        });
      });

      // Image Comparison Slider
      const handle = document.getElementById('compare-handle');
      const beforeWrapper = document.getElementById('before-wrapper');
      const container = document.getElementById('compare-container');

      if (handle && beforeWrapper && container) {
        Draggable.create(handle, {
          type: "x",
          bounds: container,
          onDrag: function() {
            const progress = (this.x / container.offsetWidth) * 100;
            gsap.set(beforeWrapper, { width: `${progress}%` });
          }
        });
        // Set initial position
        gsap.set(handle, { x: container.offsetWidth / 2 });
        gsap.set(beforeWrapper, { width: '50%' });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    setTotal(qty * productPrice);
  }, [qty, productPrice]);

  return (
    <div ref={containerRef} className="bg-brand-base">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center overflow-hidden bg-brand-base">
        <div className="absolute -right-[10%] top-[10%] w-[900px] h-[900px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-[1800px] mx-auto px-6 md:px-12 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 relative z-20 pt-10">
            <div className="hero-reveal opacity-0 translate-y-10 flex items-center gap-4 mb-10">
              <span className="h-px w-24 bg-brand-blue"></span>
              <span className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-brand-blue">Corporate Excellence • Est. 2015</span>
            </div>
            
            <h1 className="text-huge font-serif font-bold text-brand-darkBlue mb-12 leading-super-tight flex flex-col">
              <div className="overflow-hidden py-2"><span className="hero-text block transform translate-y-full">Printing</span></div>
              <div className="overflow-hidden py-2"><span className="hero-text block transform translate-y-full italic text-brand-gold font-medium">Redefined</span></div>
              <div className="overflow-hidden py-2"><span className="hero-text block transform translate-y-full">For Leaders.</span></div>
            </h1>

            <div className="overflow-hidden">
              <p className="hero-text block transform translate-y-full text-xl md:text-2xl text-slate-500 max-w-lg leading-relaxed font-sans font-light border-l border-brand-gold pl-6 mb-12">
                Bespoke corporate printing and gifting solutions. We engineer tactile experiences that command absolute respect.
              </p>
            </div>

            <div className="hero-reveal opacity-0 translate-y-10 flex flex-wrap gap-6">
              <Link href="/products" className="magnetic-target px-12 py-5 bg-brand-darkBlue text-white rounded-full text-sm font-sans font-bold uppercase tracking-widest hover:bg-brand-blue transition-colors shadow-2xl">
                View Catalogue
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[70vh] flex items-center justify-center mt-10 lg:mt-0">
            <div className="w-full h-full relative image-reveal-wrapper rounded-[2rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(11,17,32,0.3)]">
              <Image 
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=2070&auto=format&fit=crop" 
                alt="Premium Stationery"
                fill
                className="object-cover hero-img"
              />
              
              <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white opacity-0 hero-badge transform translate-y-10 transition-all duration-1000">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-serif italic text-2xl">The Executive Set</h4>
                    <p className="text-xs font-sans uppercase tracking-widest text-white/70 mt-1">Italian Leatherette</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE SCROLL MARQUEE */}
      <div className="py-12 border-y border-brand-blue/10 bg-white overflow-hidden relative z-20">
        <div className="w-full inline-flex flex-nowrap overflow-hidden">
          <div className="flex items-center justify-center md:justify-start [&_span]:mx-8 animate-marquee whitespace-nowrap">
            <span className="text-5xl font-serif italic text-brand-darkBlue">Luxury Business Cards</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">Premium Packaging</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">Corporate Gifting</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">Event Stationery</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">Custom Diaries</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">ID Solutions</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">Welcome Kits</span>
            {/* Duplicate */}
            <span className="text-5xl font-serif italic text-brand-darkBlue">Luxury Business Cards</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">Premium Packaging</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">Corporate Gifting</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">Event Stationery</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">Custom Diaries</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">ID Solutions</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">Welcome Kits</span>
          </div>
        </div>
      </div>

      {/* 3. THE MANIFESTO */}
      <section id="manifesto" className="py-40 px-6 md:px-12 bg-brand-darkBlue text-brand-base relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="max-w-[1400px] mx-auto text-center relative z-10">
          <span className="text-brand-gold text-xs font-sans font-bold uppercase tracking-widest mb-12 block">Our Philosophy</span>
          
          <p id="manifesto-text" className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.2] opacity-80 mb-24">
            Your brand isn&apos;t just a logo. It is the weight of the paper. The brilliance of the foil. The texture of the grain. We engineer impressions that linger long after the meeting ends. Excellence is not an act, but a habit.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/10 pt-20">
            <div className="reveal-stat">
              <span className="block text-5xl md:text-6xl font-serif italic text-brand-gold mb-2">50+</span>
              <span className="text-xs font-sans uppercase tracking-widest text-slate-400">Min Order</span>
            </div>
            <div className="reveal-stat">
              <span className="block text-5xl md:text-6xl font-serif italic text-brand-gold mb-2">PAN</span>
              <span className="text-xs font-sans uppercase tracking-widest text-slate-400">India Delivery</span>
            </div>
            <div className="reveal-stat">
              <span className="block text-5xl md:text-6xl font-serif italic text-brand-gold mb-2">05</span>
              <span className="text-xs font-sans uppercase tracking-widest text-slate-400">Days Turnaround</span>
            </div>
            <div className="reveal-stat">
              <span className="block text-5xl md:text-6xl font-serif italic text-brand-gold mb-2">10k</span>
              <span className="text-xs font-sans uppercase tracking-widest text-slate-400">Happy Clients</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXPANDED CAPABILITIES (PREMIUM BENTO GRID) */}
      <section id="services" className="py-40 px-6 md:px-12 bg-brand-base">
        <div className="max-w-[1800px] mx-auto">
          <div className="mb-24 text-center md:text-left">
            <div className="overflow-hidden">
              <h2 className="text-6xl md:text-8xl font-serif text-brand-darkBlue reveal-title">Comprehensive <br /> <span className="italic text-brand-gold">Mastery.</span></h2>
            </div>
            <div className="overflow-hidden mt-6">
              <p className="text-lg font-sans text-slate-500 max-w-xl reveal-text">Integrating artisanal craftsmanship with industrial scale.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-[400px]">
            {/* Design Studio (Large) */}
            <div className="md:col-span-8 bento-card relative rounded-[2rem] overflow-hidden bg-white shadow-lg border border-brand-blue/5 group cursor-pointer">
              <div className="absolute inset-0 p-12 flex flex-col justify-between z-20">
                <div className="w-16 h-16 bg-brand-base rounded-full flex items-center justify-center">
                  <PenTool className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <h3 className="text-4xl md:text-5xl font-serif mb-4 text-brand-darkBlue group-hover:text-brand-gold transition-colors">Bespoke Design Studio</h3>
                  <p className="text-lg font-sans text-slate-500 max-w-md group-hover:text-brand-darkBlue transition-colors">Architecting your brand&apos;s visual language from vectorization to intricate foil stamping.</p>
                </div>
              </div>
              <Image 
                src="https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop" 
                alt="Design Studio"
                fill
                className="object-cover opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 mix-blend-multiply ml-auto w-2/3"
              />
            </div>

            {/* Offset Printing (Tall) */}
            <div className="md:col-span-4 md:row-span-2 bento-card relative rounded-[2rem] overflow-hidden bg-brand-darkBlue text-white shadow-lg group cursor-pointer flex flex-col justify-between p-12">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-8">
                  <Printer className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="text-4xl font-serif mb-6">Heidelberg Offset</h3>
                <p className="text-sm font-sans leading-relaxed text-slate-300">
                  German engineering meets artistic precision. We deliver Pantone-perfect color accuracy and crisp text, ensuring flawless runs whether it&apos;s 50 or 50,000 units.
                </p>
              </div>
              <div className="relative z-10 mt-auto pt-8 border-t border-white/10">
                <span className="block text-6xl font-serif text-brand-gold mb-2">CMYK</span>
                <span className="text-xs uppercase tracking-widest text-slate-400">Color Calibration</span>
              </div>
            </div>

            {/* Logistics (Small) */}
            <div className="md:col-span-4 bento-card relative rounded-[2rem] overflow-hidden bg-[#F0F0EE] shadow-md border border-brand-blue/5 group cursor-pointer p-12">
              <div className="flex flex-col h-full justify-between relative z-10">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <PackageCheck className="w-6 h-6 text-brand-darkBlue" />
                </div>
                <div>
                  <h3 className="text-3xl font-serif mb-2 text-brand-darkBlue">Global Logistics</h3>
                  <p className="text-sm font-sans text-slate-600">End-to-end kitting & dropshipping.</p>
                </div>
              </div>
              <Image 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
                alt="Logistics"
                fill
                className="object-cover opacity-20"
              />
            </div>

            {/* Sustainability (Medium) */}
            <div className="md:col-span-4 bento-card relative rounded-[2rem] overflow-hidden bg-white shadow-md border border-brand-blue/5 group cursor-pointer p-12">
              <div className="flex flex-col h-full justify-between relative z-10">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h3 className="text-3xl font-serif mb-2 text-brand-darkBlue">Eco-Luxe</h3>
                  <p className="text-sm font-sans text-slate-600">Recycled cotton papers & soy-based inks.</p>
                </div>
              </div>
              <Image 
                src="https://i.postimg.cc/SQnb5RyY/image.png" 
                alt="Sustainability"
                fill
                className="object-cover opacity-20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. CURATED ESSENTIALS (DYNAMIC PRODUCTS) */}
      <section id="catalogue" className="relative py-40 px-6 md:px-12 bg-white border-t border-brand-blue/5">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col items-center text-center mb-32">
            <span className="text-brand-gold font-sans font-bold tracking-[0.4em] text-xs uppercase mb-6">The Collection</span>
            <div className="overflow-hidden">
              <h2 className="text-6xl md:text-8xl leading-none mb-6 text-brand-darkBlue font-serif reveal-title">
                Curated <span className="italic text-brand-blue/30">Essentials</span>
              </h2>
            </div>
            <p className="text-slate-400 font-sans max-w-2xl reveal-text">Handpicked items that define corporate elegance. Explore our complete range of premium customizable assets.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-20 text-center">
             <Link href="/products" className="group inline-flex items-center gap-4 text-brand-darkBlue font-sans font-bold uppercase tracking-widest hover:text-brand-gold transition-colors">
                View All Products <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
             </Link>
          </div>
        </div>
      </section>

      {/* 6. IMPACT & STATS SECTION */}
      <section id="impact" className="relative py-40 bg-brand-charcoal text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        {/* Alive Background Orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-brand-blue/20 rounded-full blur-[80px] animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-gold/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-32">
            <div>
              <span className="text-brand-gold text-xs font-sans font-bold uppercase tracking-[0.4em] mb-4 block">The ROI of Excellence</span>
              <h2 className="text-display font-serif reveal-title">Measuring <br /> <span className="italic text-brand-gold">Impact.</span></h2>
            </div>
            <p className="md:max-w-md text-slate-400 font-sans leading-relaxed text-lg mt-8 md:mt-0 reveal-text">
              Premium printing is an investment, not an expense. We help brands elevate their perception, commanding higher trust and value in the market.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-20">
            <div className="stat-card">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-6xl md:text-8xl font-serif text-white counter" data-target="400">0</span>
                <span className="text-4xl text-brand-gold">%</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-brand-gold w-0 stat-bar"></div>
              </div>
              <h4 className="text-xl font-serif italic">Brand Recall</h4>
              <p className="text-sm text-slate-400 mt-2 font-sans">Physical touchpoints increase memory retention significantly compared to digital ads.</p>
            </div>
            <div className="stat-card">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-6xl md:text-8xl font-serif text-white counter" data-target="85">0</span>
                <span className="text-4xl text-brand-gold">%</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-brand-gold w-0 stat-bar"></div>
              </div>
              <h4 className="text-xl font-serif italic">Client Retention</h4>
              <p className="text-sm text-slate-400 mt-2 font-sans">Premium onboarding kits reduce churn and increase employee/client loyalty.</p>
            </div>
            <div className="stat-card">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-6xl md:text-8xl font-serif text-white counter" data-target="3">0</span>
                <span className="text-4xl text-brand-gold">x</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-brand-gold w-0 stat-bar"></div>
              </div>
              <h4 className="text-xl font-serif italic">Perceived Value</h4>
              <p className="text-sm text-slate-400 mt-2 font-sans">High-quality packaging allows brands to command higher price points.</p>
            </div>
          </div>

          {/* Comparison Slider */}
          <div className="mt-40 relative h-[80vh] w-full rounded-[2rem] overflow-hidden group shadow-2xl border border-white/10 select-none">
            <div className="compare-container relative w-full h-full" id="compare-container">
              <div className="compare-image-after absolute inset-0">
                 <Image src="https://i.postimg.cc/7LrQBPK1/image.png" alt="Premium" fill className="object-cover" />
                 <div className="absolute bottom-10 right-10 text-right z-10 pointer-events-none">
                     <h3 className="text-5xl font-serif italic text-white drop-shadow-xl">After</h3>
                     <p className="text-brand-gold text-lg font-sans uppercase tracking-widest drop-shadow-md">Premium Finish</p>
                 </div>
              </div>

              <div className="compare-image-before-wrapper absolute top-0 left-0 h-full overflow-hidden z-10 border-r-2 border-white" id="before-wrapper">
                 <div className="relative w-screen h-full">
                    <Image src="https://i.postimg.cc/bJ9X0S82/image.png" alt="Standard" fill className="object-cover" />
                 </div>
                 <div className="absolute bottom-10 left-10 text-left z-10 pointer-events-none">
                     <h3 className="text-5xl font-serif italic text-white drop-shadow-xl">Before</h3>
                     <p className="text-white/70 text-lg font-sans uppercase tracking-widest drop-shadow-md">Standard Quality</p>
                 </div>
              </div>

              <div className="compare-handle absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center z-20 cursor-ew-resize shadow-2xl" id="compare-handle">
                <div className="flex gap-1">
                  <ArrowRight className="w-4 h-4 text-brand-darkBlue rotate-180" />
                  <ArrowRight className="w-4 h-4 text-brand-darkBlue" />
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-sm font-sans uppercase tracking-widest text-slate-500 mt-8">Drag to Compare</p>
        </div>
      </section>

      {/* 7. PREMIUM CONFIGURATOR */}
      <section id="calculator" className="py-40 px-6 md:px-12 bg-[#0F1014] text-white relative border-t border-white/5">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col items-center mb-24 text-center">
            <span className="text-brand-gold text-xs font-sans font-bold uppercase tracking-[0.4em] mb-6">Project Estimator</span>
            <h2 className="text-5xl md:text-7xl font-serif reveal-title">Tailor Your <span className="italic text-white/50">Experience.</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-16 p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm">
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-widest text-slate-400 mb-6">Select Item</label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { name: 'Business Card', price: 2 },
                    { name: 'Diary', price: 350 },
                    { name: 'Welcome Kit', price: 950 },
                    { name: 'Calendar', price: 150 },
                    { name: 'Gift Box', price: 600 }
                  ].map((item) => (
                    <button 
                      key={item.name}
                      onClick={() => setProductPrice(item.price)}
                      className={cn(
                        "px-6 py-3 rounded-full border transition-all text-sm font-sans",
                        productPrice === item.price 
                          ? "border-brand-gold text-brand-gold bg-brand-gold/10" 
                          : "border-white/20 text-white hover:border-brand-gold hover:text-brand-gold"
                      )}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-xs font-sans font-bold uppercase tracking-widest text-slate-400">Quantity</label>
                  <span className="text-2xl font-serif text-brand-gold">{qty}</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="5000" 
                  step="50" 
                  value={qty} 
                  onChange={(e) => setQty(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center p-12 rounded-[2.5rem] bg-brand-gold text-brand-darkBlue relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">Estimated Total</span>
                <div className="text-8xl md:text-9xl font-serif font-bold leading-none mb-8">
                  ₹{total.toLocaleString()}
                </div>
                <p className="text-brand-darkBlue/60 font-sans max-w-xs mb-12 italic">
                  *Prices are indicative and subject to material selection and finish requirements.
                </p>
                <Link href="/contact" className="inline-flex items-center gap-4 bg-brand-darkBlue text-white px-10 py-5 rounded-full font-sans font-bold uppercase tracking-widest hover:bg-brand-blue transition-all">
                  Request Formal Quote <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section id="faq" className="py-40 px-6 md:px-12 bg-brand-base">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-8xl font-serif text-brand-darkBlue reveal-title">Curiosity <br /> <span className="italic text-brand-gold">Answered.</span></h2>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "What is the minimum turnaround time?", a: "Standard turnaround is 5-7 business days, though express options are available for selected products." },
              { q: "Do you offer PAN India delivery?", a: "Yes, we have a robust logistics network that delivers to over 19,000 pin codes across India." },
              { q: "Can I request a physical sample?", a: "Certainly. We provide samples for bulk orders to ensure material and print quality meets your expectations." },
              { q: "Do you provide design assistance?", a: "Our in-house studio provides expert guidance on structural design and print-ready artwork optimization." }
            ].map((item, idx) => (
              <AccordionItem key={idx} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function AccordionItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={cn("accordion-item border-b border-brand-darkBlue/10 py-8 transition-all cursor-pointer", isOpen && "active")} onClick={() => setIsOpen(!isOpen)}>
      <div className="flex justify-between items-center group">
        <h3 className="text-2xl md:text-3xl font-serif text-brand-darkBlue group-hover:text-brand-gold transition-colors">{question}</h3>
        <Plus className={cn("w-6 h-6 text-brand-gold transition-transform duration-500", isOpen && "rotate-45")} />
      </div>
      <div className={cn("accordion-content mt-6", isOpen && "opacity-100 max-h-[500px]")}>
        <p className="text-lg text-slate-500 font-sans max-w-3xl leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}
