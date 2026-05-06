"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  ChevronRight, 
  Zap, 
  Award, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Target,
  ArrowUpRight,
  Star,
  PenTool,
  Printer,
  PackageCheck,
  Leaf,
  ChevronDown,
  ExternalLink,
  Plus
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '@/lib/supabase/client';

gsap.registerPlugin(ScrollTrigger);

interface HomePageClientProps {
  config?: any;
  products?: any[];
  blogs?: any[];
}

export default function HomePageClient({ config: initialConfig, products = [], blogs = [] }: HomePageClientProps) {
  const [config, setConfig] = useState(initialConfig);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    // Refresh config from client side if needed, or just use initial
    const fetchLatest = async () => {
      const { data } = await supabase.from('site_settings').select('config').eq('id', 'global').single();
      if (data?.config) setConfig(data.config);
    };
    fetchLatest();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Hero Animations
      gsap.to('.hero-text', {
        y: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'expo.out',
        delay: 0.5
      });

      gsap.to('.hero-reveal', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.8
      });

      gsap.to('.hero-img', {
        scale: 1,
        duration: 2,
        ease: 'power2.out'
      });

      gsap.to('.hero-badge', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 1.5,
        ease: 'back.out(1.7)'
      });

      // 2. Scroll Reveals
      const revealItems = gsap.utils.toArray('.reveal-title, .reveal-text, .reveal-item');
      revealItems.forEach((item: any) => {
        gsap.fromTo(item, 
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
            }
          }
        );
      });

      // Word by word reveal for philosophy
      const phil = document.querySelector('.reveal-philosophy');
      if (phil) {
        const words = phil.textContent?.split(' ') || [];
        phil.innerHTML = words.map(w => `<span class='phil-word opacity-20 transition-opacity duration-500'>${w} </span>`).join('');
        
        gsap.to('.phil-word', {
          opacity: 1,
          stagger: 0.02,
          scrollTrigger: {
            trigger: phil,
            start: 'top 70%',
            end: 'bottom 40%',
            scrub: true
          }
        });
      }

      // 3. Stats Counter
      const counters = gsap.utils.toArray('.counter');
      counters.forEach((counter: any) => {
        const target = parseInt(counter.getAttribute('data-target') || '0');
        gsap.to(counter, {
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: counter,
            start: 'top 90%',
          }
        });
      });

      // 4. Stat Bars
      gsap.to('.stat-bar', {
        width: '100%',
        duration: 1.5,
        ease: 'power4.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.stat-card',
          start: 'top 80%',
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [config]);

  // Comparison Slider Logic
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const pos = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(pos, 0), 100));
  };

  return (
    <div ref={containerRef} className="bg-brand-base font-sans selection:bg-brand-blue selection:text-white">
      
      {/* 1. HERO SECTION (RESTORED DESIGN) */}
      <section className="relative min-h-[90vh] pt-32 pb-20 flex flex-col justify-center overflow-hidden bg-brand-base">
        <div className="absolute -right-[10%] top-[10%] w-[900px] h-[900px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-[1800px] mx-auto px-6 md:px-12 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 relative z-20 pt-10">
            <div className="hero-reveal opacity-0 translate-y-10 flex items-center gap-4 mb-10">
              <span className="h-px w-24 bg-brand-blue"></span>
              <span className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-brand-blue">Corporate Excellence • Est. 2015</span>
            </div>
            
            <h1 
              className="text-huge font-serif font-bold text-brand-darkBlue mb-12 leading-super-tight flex flex-col"
              dangerouslySetInnerHTML={{ __html: (config?.hero?.title && config.hero.title !== "Your Design. Our Impression.") ? config.hero.title : "Printing <span class='italic text-brand-gold font-medium'>Redefined</span> <br/> For Leaders." }}
            >
            </h1>

            <div className="overflow-hidden">
              <p className="hero-text block transform translate-y-full text-xl md:text-2xl text-slate-500 max-w-lg leading-relaxed font-sans font-light border-l border-brand-gold pl-6 mb-12">
                {config?.hero?.subtitle || "Bespoke corporate printing and gifting solutions. We engineer tactile experiences that command absolute respect."}
              </p>
            </div>

            <div className="hero-reveal opacity-0 translate-y-10 flex flex-wrap gap-6">
              <Link href="/products" className="magnetic-target px-12 py-5 bg-brand-darkBlue text-white rounded-full text-sm font-sans font-bold uppercase tracking-widest hover:bg-brand-blue transition-colors shadow-2xl">
                View Catalogue
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[70vh] flex items-center justify-center mt-10 lg:mt-0">
            <div className="w-full h-full relative image-reveal-wrapper rounded-2xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(11,17,32,0.3)]">
              <Image 
                src={config?.hero?.image || "https://i.postimg.cc/7LrQBPK1/image.png"} 
                alt="Premium Stationery"
                fill
                className="object-cover hero-img scale-125"
                priority
              />
              
              <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white opacity-0 hero-badge transform translate-y-10 transition-all duration-1000">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-serif italic text-2xl">Premium Excellence</h4>
                    <p className="text-xs font-sans uppercase tracking-widest text-white/70 mt-1">Industrial Grade Quality</p>
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
          <div className="flex items-center justify-center md:justify-start [&_span]:mx-12 animate-marquee whitespace-nowrap">
            <span className="text-5xl font-serif italic text-brand-darkBlue">Luxury Business Cards</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">Premium Packaging</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">Corporate Gifting</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">Event Stationery</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">Custom Diaries</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">ID Solutions</span>
            {/* Duplicate for seamless loop */}
            <span className="text-5xl font-serif italic text-brand-darkBlue">Luxury Business Cards</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">Premium Packaging</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">Corporate Gifting</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">Event Stationery</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">Custom Diaries</span>
            <span className="text-5xl font-serif italic text-brand-darkBlue">ID Solutions</span>
          </div>
        </div>
      </div>

      {/* 3. MANIFESTO / PHILOSOPHY (Dynamic About) */}
      {(config?.about?.description || true) && (
        <section id="manifesto" className="py-40 px-6 md:px-12 bg-brand-darkBlue text-brand-base relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
          <div className="max-w-[1400px] mx-auto text-center relative z-10">
            <span className="text-brand-gold text-xs font-sans font-bold uppercase tracking-widest mb-12 block">Our Philosophy</span>
            
            <p className="text-3xl md:text-5xl lg:text-6xl font-serif leading-[1.3] opacity-80 mb-24 max-w-5xl mx-auto reveal-text reveal-philosophy">
              {config?.about?.description || "In a world of fleeting digital impressions, we believe in the absolute permanence of the tactile. We don't just print; we engineer legacies through ink, paper, and obsessive precision."}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/10 pt-20">
              <div className="reveal-item">
                <span className="block text-5xl md:text-6xl font-serif italic text-brand-gold mb-2">50+</span>
                <span className="text-xs font-sans uppercase tracking-widest text-slate-400">Min Order</span>
              </div>
              <div className="reveal-item">
                <span className="block text-5xl md:text-6xl font-serif italic text-brand-gold mb-2">PAN</span>
                <span className="text-xs font-sans uppercase tracking-widest text-slate-400">India Delivery</span>
              </div>
              <div className="reveal-item">
                <span className="block text-5xl md:text-6xl font-serif italic text-brand-gold mb-2">05</span>
                <span className="text-xs font-sans uppercase tracking-widest text-slate-400">Days Turnaround</span>
              </div>
              <div className="reveal-item">
                <span className="block text-5xl md:text-6xl font-serif italic text-brand-gold mb-2">10k+</span>
                <span className="text-xs font-sans uppercase tracking-widest text-slate-400">Happy Clients</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. FOUNDER STORY (DYNAMIC) */}
      {config?.about?.founderStory?.content && (
        <section className="py-40 bg-white px-6 md:px-12 overflow-hidden">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden reveal-item">
                <Image 
                  src={config.about.founderStory.image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"}
                  alt="Founder"
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-110"
                />
              </div>
              <div className="space-y-12">
                <div className="reveal-title">
                  <span className="text-brand-gold text-xs font-sans font-bold uppercase tracking-widest mb-6 block">The Visionary</span>
                  <h2 className="text-5xl md:text-7xl font-serif text-brand-darkBlue mb-8 leading-tight">
                    {config.about.founderStory.title || "The Story Behind the Brand"}
                  </h2>
                </div>
                <div className="space-y-8 reveal-text">
                  <p className="text-xl text-slate-600 leading-relaxed font-sans font-light">
                    {config.about.founderStory.content}
                  </p>
                  <div className="pt-8 border-t border-brand-blue/10">
                     <p className="text-brand-darkBlue font-serif italic text-3xl">Richa Jain</p>
                     <p className="text-brand-gold text-xs font-sans font-bold uppercase tracking-[0.3em] mt-2">Founder & CEO</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. SERVICES BENTO GRID */}
      <section className="py-40 px-6 md:px-12 bg-brand-base">
        <div className="max-w-[1800px] mx-auto">
          <div className="mb-24 text-center md:text-left">
            <h2 className="text-5xl md:text-8xl font-serif text-brand-darkBlue reveal-title">Comprehensive <br/> <span className="italic text-brand-gold">Mastery.</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[450px]">
            <div className="md:col-span-8 group relative rounded-[2rem] overflow-hidden bg-white shadow-xl border border-brand-blue/5 reveal-item">
              <div className="absolute inset-0 p-12 flex flex-col justify-between z-20">
                <div className="w-16 h-16 bg-brand-base rounded-full flex items-center justify-center">
                  <PenTool className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <h3 className="text-4xl font-serif mb-4 text-brand-darkBlue group-hover:text-brand-gold transition-colors">Bespoke Design Studio</h3>
                  <p className="text-lg font-sans text-slate-500 max-w-md">Architecting your brand&apos;s visual language from vectorization to intricate foil stamping.</p>
                </div>
              </div>
              <Image src="https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop" alt="Design" fill className="object-cover opacity-10 group-hover:opacity-20 group-hover:scale-105 transition-all duration-700" />
            </div>

            <div className="md:col-span-4 md:row-span-2 group relative rounded-[2rem] overflow-hidden bg-brand-darkBlue text-white shadow-2xl reveal-item flex flex-col justify-between p-12">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-8">
                  <Printer className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="text-4xl font-serif mb-6">Heidelberg Offset</h3>
                <p className="text-slate-300 font-light leading-relaxed">German engineering meets artistic precision. We deliver Pantone-perfect color accuracy and crisp text.</p>
              </div>
              <div className="relative z-10 mt-auto pt-8 border-t border-white/10">
                <span className="block text-6xl font-serif text-brand-gold mb-2">CMYK</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400">Color Calibration</span>
              </div>
            </div>

            <div className="md:col-span-4 group relative rounded-[2rem] overflow-hidden bg-white shadow-xl border border-brand-blue/5 reveal-item p-12">
               <div className="flex flex-col h-full justify-between relative z-10">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                    <PackageCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-serif mb-2 text-brand-darkBlue">Global Logistics</h3>
                    <p className="text-sm font-sans text-slate-600">End-to-end kitting & dropshipping.</p>
                  </div>
               </div>
               <Image src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" alt="Logistics" fill className="object-cover opacity-10" />
            </div>

            <div className="md:col-span-4 group relative rounded-[2rem] overflow-hidden bg-white shadow-xl border border-brand-blue/5 reveal-item p-12">
              <div className="flex flex-col h-full justify-between relative z-10">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h3 className="text-3xl font-serif mb-2 text-brand-darkBlue">Eco-Luxe</h3>
                  <p className="text-sm font-sans text-slate-600">Recycled cotton papers & soy-based inks.</p>
                </div>
              </div>
              <Image src="https://i.postimg.cc/SQnb5RyY/image.png" alt="Sustainability" fill className="object-cover opacity-10" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. CURATED ESSENTIALS (DYNAMIC PRODUCTS) */}
      <section className="py-40 px-6 md:px-12 bg-white">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24">
            <div className="reveal-title">
              <span className="text-brand-gold text-xs font-sans font-bold uppercase tracking-[0.4em] mb-4 block">The Selection</span>
              <h2 className="text-5xl md:text-8xl font-serif text-brand-darkBlue">Curated <br/> <span className="italic text-brand-gold">Essentials.</span></h2>
            </div>
            <Link href="/products" className="group flex items-center gap-4 text-brand-darkBlue font-sans font-bold uppercase tracking-widest text-xs reveal-text">
              View Full Catalogue <div className="w-12 h-12 rounded-full border border-brand-darkBlue flex items-center justify-center group-hover:bg-brand-darkBlue group-hover:text-white transition-all"><ArrowUpRight className="w-5 h-5" /></div>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {(products.length > 0 ? products : [
              { id: '1', name: "Luxe Business Cards", price: 1499, image: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=2000&auto=format&fit=crop" },
              { id: '2', name: "Executive Leather Diary", price: 899, image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=2000&auto=format&fit=crop" },
              { id: '3', name: "Premium Onboarding Kit", price: 3499, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop" },
              { id: '4', name: "Sustainable Packaging", price: 499, image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=2000&auto=format&fit=crop" },
              { id: '5', name: "Corporate Letterheads", price: 1299, image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2000&auto=format&fit=crop" },
              { id: '6', name: "Minimalist ID Cards", price: 299, image: "https://images.unsplash.com/photo-1598301257982-0cf014dcc523?q=80&w=2000&auto=format&fit=crop" },
              { id: '7', name: "Branded Ceramic Mugs", price: 450, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2000&auto=format&fit=crop" },
              { id: '8', name: "Premium Tech Swag", price: 2499, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2000&auto=format&fit=crop" }
            ]).map((product: any, idx: number) => {
              // Intelligent image mapping for broken/placeholder DB images
              let finalImage = product.image_url || (product.images && product.images[0]) || product.image;
              
              const premiumMappings: Record<string, string> = {
                'business card': 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=2000&auto=format&fit=crop',
                'diary': 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=2000&auto=format&fit=crop',
                'notebook': 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=2000&auto=format&fit=crop',
                'kit': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop',
                'packaging': 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=2000&auto=format&fit=crop',
                'box': 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=2000&auto=format&fit=crop',
                'letterhead': 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2000&auto=format&fit=crop',
                'branding': 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2000&auto=format&fit=crop',
                'id card': 'https://images.unsplash.com/photo-1598301257982-0cf014dcc523?q=80&w=2000&auto=format&fit=crop',
                'mug': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2000&auto=format&fit=crop',
                'bottle': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2000&auto=format&fit=crop',
                'apparel': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2000&auto=format&fit=crop',
                'wedding': 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=2000&auto=format&fit=crop',
                'calendar': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2000&auto=format&fit=crop'
              };

              // Overwrite if it's a known product type but has a likely placeholder image
              // (Detecting current placeholder by its repetition in your screenshot)
              const isLikelyPlaceholder = !finalImage || finalImage.includes('signature') || finalImage.includes('placeholder');
              
              if (isLikelyPlaceholder) {
                const name = product.name.toLowerCase();
                for (const [key, val] of Object.entries(premiumMappings)) {
                  if (name.includes(key)) {
                    finalImage = val;
                    break;
                  }
                }
              }

              return (
                <Link key={idx} href={`/products/${product.id || '#'}`} className="group reveal-item">
                  <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 shadow-xl bg-brand-base">
                    <Image 
                      src={finalImage || "https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=2000&auto=format&fit=crop"} 
                      alt={product.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-all duration-1000" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-darkBlue/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                      <button className="w-full py-4 bg-white text-brand-darkBlue rounded-full text-xs font-bold uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        Customize Now
                      </button>
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif text-brand-darkBlue mb-2 group-hover:text-brand-gold transition-colors">{product.name}</h3>
                  <p className="text-brand-gold font-sans font-bold text-lg">
                    {product.price || product.base_price ? `From ₹${product.price || product.base_price}` : 'Quote on Request'}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. IMPACT & STATS SECTION */}
      <section className="relative py-40 bg-brand-charcoal text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-32">
            <div>
              <span className="text-brand-gold text-xs font-sans font-bold uppercase tracking-[0.4em] mb-4 block">The ROI of Excellence</span>
              <h2 className="text-5xl md:text-7xl font-serif reveal-title">Measuring <br/> <span className="italic text-brand-gold">Impact.</span></h2>
            </div>
            <p className="md:max-w-md text-slate-400 font-sans leading-relaxed text-lg mt-8 md:mt-0 reveal-text">
              Premium printing is an investment, not an expense. We help brands elevate their perception.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-20 mb-40">
            {[
              { val: 400, label: "Brand Recall", sign: "%", desc: "Physical touchpoints increase memory retention significantly." },
              { val: 85, label: "Client Retention", sign: "%", desc: "Premium onboarding kits reduce churn and increase loyalty." },
              { val: 3, label: "Perceived Value", sign: "x", desc: "High-quality packaging allows brands to command higher prices." }
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-6xl md:text-8xl font-serif text-white counter" data-target={stat.val}>0</span>
                  <span className="text-4xl text-brand-gold">{stat.sign}</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-brand-gold w-0 stat-bar"></div>
                </div>
                <h4 className="text-xl font-serif italic">{stat.label}</h4>
                <p className="text-sm text-slate-400 mt-2 font-sans">{stat.desc}</p>
              </div>
            ))}
          </div>

          {/* Comparison Slider */}
          <div 
            ref={sliderRef}
            className="relative h-[80vh] w-full rounded-[2rem] overflow-hidden group shadow-2xl border border-white/10 select-none cursor-ew-resize"
            onMouseMove={handleSliderMove}
            onTouchMove={handleSliderMove}
          >
            {/* After (Premium) */}
            <div className="absolute inset-0">
               <Image src="https://i.postimg.cc/7LrQBPK1/image.png" alt="Premium" fill className="object-cover" />
               <div className="absolute bottom-10 right-10 text-right">
                  <h3 className="text-5xl font-serif italic text-white drop-shadow-2xl">After</h3>
                  <p className="text-brand-gold text-lg font-sans uppercase tracking-widest">Premium Finish</p>
               </div>
            </div>

            {/* Before (Standard) */}
            <div 
              className="absolute inset-0 overflow-hidden border-r-2 border-white"
              style={{ width: `${sliderPos}%` }}
            >
               <div className="absolute inset-0 w-[100vw] h-full">
                  <Image src="https://i.postimg.cc/bJ9X0S82/image.png" alt="Standard" fill className="object-cover" />
               </div>
               <div className="absolute bottom-10 left-10 text-left">
                  <h3 className="text-5xl font-serif italic text-white drop-shadow-2xl">Before</h3>
                  <p className="text-white/70 text-lg font-sans uppercase tracking-widest">Standard Quality</p>
               </div>
            </div>

            {/* Handle */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white/50 flex items-center justify-center"
              style={{ left: `${sliderPos}%` }}
            >
               <div className="w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center -translate-x-1/2">
                  <ArrowRight className="w-4 h-4 text-brand-dark" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PREMIUM CONFIGURATOR (ESTIMATOR) */}
      <section id="calculator" className="py-40 px-6 md:px-12 bg-[#0F1014] text-white relative border-t border-white/5">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col items-center mb-24 text-center">
            <span className="text-brand-gold text-xs font-sans font-bold uppercase tracking-[0.4em] mb-6">Project Estimator</span>
            <h2 className="text-5xl md:text-7xl font-serif reveal-title">Tailor Your <span className="italic text-white/50">Experience.</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-16 p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm reveal-item">
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-widest text-slate-400 mb-6">Select Item</label>
                <div className="flex flex-wrap gap-4">
                  {['Business Card', 'Diary', 'Welcome Kit', 'Calendar', 'Gift Box'].map((item) => (
                    <button key={item} className="px-6 py-3 rounded-full border border-white/20 hover:border-brand-gold hover:text-brand-gold transition-all text-sm font-sans">
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-xs font-sans font-bold uppercase tracking-widest text-slate-400">Quantity</label>
                  <span className="text-2xl font-serif text-brand-gold">500</span>
                </div>
                <input type="range" min="50" max="5000" step="50" defaultValue="500" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold" />
              </div>
            </div>

            <div className="flex flex-col justify-center reveal-item">
               <div className="p-12 rounded-[2.5rem] bg-brand-gold text-brand-darkBlue shadow-2xl">
                  <h4 className="text-xl font-sans font-bold uppercase tracking-widest mb-8">Estimated Investment</h4>
                  <div className="flex items-baseline gap-2 mb-10">
                    <span className="text-7xl md:text-9xl font-serif">₹1,500</span>
                    <span className="text-xl font-sans font-medium">approx.</span>
                  </div>
                  <Link href="/products" className="w-full py-6 bg-brand-darkBlue text-white font-sans font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-4 hover:bg-white hover:text-brand-darkBlue transition-all">
                    Start Your Project <ArrowRight className="w-5 h-5" />
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. THE COLLECTIVE (DYNAMIC TEAM) */}
      {config?.about?.team?.length > 0 && (
        <section className="py-40 px-6 md:px-12 bg-white">
          <div className="max-w-[1800px] mx-auto text-center">
            <h2 className="text-5xl md:text-8xl font-serif text-brand-darkBlue mb-24 reveal-title">The <span className="italic text-brand-gold">Collective.</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {config.about.team.map((member: any, idx: number) => (
                <div key={idx} className="group reveal-item">
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-8">
                    <Image 
                      src={member.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop"} 
                      alt={member.name} 
                      fill 
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                    />
                  </div>
                  <h4 className="text-2xl font-serif text-brand-darkBlue">{member.name}</h4>
                  <p className="text-brand-gold font-sans font-bold uppercase tracking-widest text-[10px] mt-2">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. LATEST INTELLIGENCE (ESSENTIAL CMS BLOGS) */}
      {blogs.length > 0 && (
        <section className="py-40 px-6 md:px-12 bg-brand-base border-t border-brand-blue/5">
          <div className="max-w-[1800px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24">
              <div className="reveal-title">
                <span className="text-brand-gold text-xs font-sans font-bold uppercase tracking-[0.4em] mb-4 block">Editorial</span>
                <h2 className="text-5xl md:text-8xl font-serif text-brand-darkBlue">Latest <br/> <span className="italic text-brand-blue/30">Intelligence.</span></h2>
              </div>
              <Link href="/faq" className="group flex items-center gap-4 text-brand-darkBlue font-sans font-bold uppercase tracking-widest text-xs reveal-text">
                Browse All Insights <div className="w-12 h-12 rounded-full border border-brand-darkBlue flex items-center justify-center group-hover:bg-brand-darkBlue group-hover:text-white transition-all"><ArrowUpRight className="w-5 h-5" /></div>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {blogs.slice(0, 3).map((blog, idx) => (
                <Link key={idx} href={`/faq?blog=${blog.id}`} className="group reveal-item">
                  <div className="relative aspect-video rounded-[2rem] overflow-hidden mb-8 shadow-xl">
                    <Image src={blog.image_url || "https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=2074&auto=format&fit=crop"} alt={blog.title} fill className="object-cover group-hover:scale-110 transition-all duration-1000" />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-4 py-1 bg-brand-gold/10 text-brand-gold text-[10px] font-black uppercase tracking-widest rounded-full">{blog.category || 'Insights'}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest" suppressHydrationWarning>
                      {new Date(blog.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-3xl font-serif text-brand-darkBlue group-hover:text-brand-gold transition-colors leading-tight mb-6">{blog.title}</h3>
                  <div className="flex items-center gap-2 text-brand-blue font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. DYNAMIC FAQ SECTION */}
      <section id="faq" className="py-40 px-6 md:px-12 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-8xl font-serif text-brand-darkBlue reveal-title">Curiosity <br/> <span className="italic text-brand-gold font-medium">Answered.</span></h2>
          </div>
          <div className="space-y-4">
            {(config?.home_faq?.items || [
               { q: "What is the minimum turnaround time?", a: "Standard turnaround is 5-7 business days, though express options are available for selected products." },
               { q: "Do you offer PAN India delivery?", a: "Yes, we have a robust logistics network that delivers to over 19,000 pin codes across India." },
               { q: "Can I request a physical sample?", a: "Certainly. We provide samples for bulk orders to ensure material and print quality meets your expectations." },
               { q: "Do you provide design assistance?", a: "Our in-house studio provides expert guidance on structural design and print-ready artwork optimization." }
            ]).map((item: any, idx: number) => (
              <div 
                key={idx} 
                className={`border border-brand-blue/5 rounded-[2rem] overflow-hidden transition-all duration-500 ${activeFaq === idx ? 'bg-brand-blue/5 border-brand-blue/20' : 'bg-white hover:bg-brand-base'}`}
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-10 py-10 flex justify-between items-center text-left"
                >
                  <span className="text-2xl md:text-3xl font-serif text-brand-darkBlue">{item.q}</span>
                  <div className={`w-12 h-12 rounded-full border border-brand-darkBlue flex items-center justify-center transition-transform duration-500 ${activeFaq === idx ? 'rotate-45 bg-brand-darkBlue text-white' : ''}`}>
                    <Plus className="w-6 h-6" />
                  </div>
                </button>
                <div className={`transition-all duration-700 ease-in-out px-10 overflow-hidden ${activeFaq === idx ? 'max-h-96 pb-10' : 'max-h-0'}`}>
                  <p className="text-lg text-slate-500 font-sans leading-relaxed max-w-3xl">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="relative py-40 bg-brand-darkBlue text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="text-left reveal-item">
              <h2 className="text-5xl md:text-7xl font-serif text-white mb-8">Ready to <span className="italic text-brand-gold">Transform</span> Your Brand?</h2>
              <p className="text-xl text-slate-400 font-sans mb-12 max-w-lg">
                {config?.home_cta?.description || "Join 10,000+ businesses delivering excellence with AtoZ Prints. Get started with your custom project today."}
              </p>
              <Link href="/products" className="inline-flex items-center gap-6 px-12 py-5 bg-brand-gold text-brand-darkBlue rounded-full text-lg font-sans font-bold uppercase tracking-widest hover:bg-white transition-all shadow-2xl hover:scale-105 transform">
                Start designing <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
            <div className="relative aspect-square rounded-[3rem] overflow-hidden reveal-item">
               <Image src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=2070&auto=format&fit=crop" alt="CTA" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
