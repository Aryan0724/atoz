'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Search, 
  Plus, 
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SplitType from 'split-type';
import { supabase } from '@/lib/supabase/client';

gsap.registerPlugin(ScrollTrigger);



export default function FAQPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);
  const [cmsData, setCmsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('site_settings')
        .select('config')
        .eq('id', 'cms_pages')
        .single();
      
      if (data?.config?.faq) {
        setCmsData(data.config.faq);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
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

      // Reveal fade
      gsap.to('.reveal-fade', { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        ease: "power2.out", 
        scrollTrigger: { trigger: '.reveal-fade', start: "top 90%" } 
      });

    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  if (loading) return <div className="min-h-screen bg-brand-base flex items-center justify-center"><div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" /></div>;

  const data = cmsData || {
    hero: { title: "The Knowledge Base.", subtitle: "Support Center" },
    items: [
      { id: 1, category: 'ordering', q: "What is the Minimum Order Quantity (MOQ)?", a: "Standard MOQ is 50 units for most items." },
      { id: 2, category: 'design', q: "What file formats do you accept?", a: "Vector files (.AI, .EPS, .PDF) are preferred." }
    ]
  };

  const filteredFaqs = data.items.filter((faq: any) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div ref={containerRef} className="bg-brand-base">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[70vh] pt-40 pb-20 px-6 md:px-12 bg-brand-darkBlue text-white overflow-hidden flex flex-col justify-center items-center">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-brand-gold/10 rounded-full blur-[120px] animate-float"></div>
        
        <div className="relative z-10 w-full max-w-4xl text-center">
          <span className="text-brand-gold text-xs font-sans font-bold uppercase tracking-[0.4em] mb-8 block">{data.hero.subtitle}</span>
          <h1 className="text-huge font-serif font-bold text-white leading-super-tight mb-12 reveal-title" dangerouslySetInnerHTML={{ __html: data.hero.title }}>
          </h1>
          
          {/* Search Bar */}
          <div className="search-container max-w-2xl mx-auto reveal-fade relative">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-brand-gold w-6 h-6" />
            <input 
              type="text" 
              placeholder="Search for pricing, shipping, or materials..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 backdrop-blur-md px-20 py-6 text-xl text-white rounded-full focus:outline-none focus:border-brand-gold transition-all placeholder:text-white/40"
            />
          </div>
        </div>
      </section>

      {/* 2. FAQ CONTENT */}
      <section className="py-32 px-6 md:px-12 bg-brand-base relative">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            {/* Sidebar: Categories */}
            <div className="lg:col-span-3">
              <div className="sticky top-40 space-y-2">
                <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-400 mb-8 pl-6">Categories</h4>
                
                {[
                  { id: 'all', label: 'All Questions' },
                  { id: 'ordering', label: 'Ordering & Cost' },
                  { id: 'design', label: 'Design & Customization' },
                  { id: 'logistics', label: 'Shipping & Logistics' },
                  { id: 'sustainability', label: 'Sustainability' }
                ].map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "w-full text-left p-6 border-l-2 transition-all font-serif text-2xl",
                      activeCategory === cat.id 
                        ? "border-brand-gold text-brand-darkBlue bg-gradient-to-r from-brand-gold/5 to-transparent pl-10" 
                        : "border-brand-darkBlue/10 text-slate-400 hover:border-brand-gold hover:text-brand-darkBlue"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content: Accordions */}
            <div className="lg:col-span-9 space-y-4">
              {filteredFaqs.length > 0 ? filteredFaqs.map((faq: any, idx: number) => (
                <div 
                  key={faq.id} 
                  className={cn(
                    "faq-item py-8 px-6 border-b border-brand-darkBlue/10 transition-all cursor-pointer hover:bg-white hover:rounded-2xl hover:shadow-xl hover:border-brand-gold",
                    openId === faq.id && "bg-white rounded-2xl shadow-xl border-brand-gold"
                  )}
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-8">
                      <span className="text-brand-gold font-serif text-xl opacity-50">{String(idx + 1).padStart(2, '0')}</span>
                      <h3 className={cn("text-2xl md:text-3xl font-serif text-brand-darkBlue transition-colors", openId === faq.id && "text-brand-gold")}>{faq.q}</h3>
                    </div>
                    <Plus className={cn("w-6 h-6 text-brand-darkBlue transition-transform duration-500", openId === faq.id && "rotate-45 text-brand-gold")} />
                  </div>
                  <div className={cn("overflow-hidden transition-all duration-500", openId === faq.id ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0")}>
                    <div className="pt-8 pl-14 max-w-3xl">
                      <p className="text-lg font-sans text-slate-600 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center">
                  <p className="text-2xl font-serif text-slate-400">No questions found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CTA BANNER */}
      <section className="py-32 px-6 md:px-12 bg-white">
        <div className="max-w-[1600px] mx-auto bg-brand-darkBlue rounded-[3rem] p-16 md:p-32 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="relative z-10">
            <span className="text-brand-gold text-xs font-sans font-bold uppercase tracking-[0.3em] mb-6 block">Still Curious?</span>
            <h2 className="text-5xl md:text-7xl font-serif text-white mb-10">Cannot find what you&apos;re <br /> <span className="italic text-brand-gold">looking for?</span></h2>
            <p className="text-slate-400 font-sans text-lg max-w-xl mx-auto mb-12">Our team is ready to answer specific technical questions or discuss custom requirements.</p>
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <Link href="/contact" className="px-10 py-5 bg-brand-gold text-brand-darkBlue font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all magnetic-target">Contact Support</Link>
              <a href="tel:+919876543210" className="px-10 py-5 border border-white/20 text-white font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-brand-darkBlue transition-all magnetic-target">Call Us Now</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
