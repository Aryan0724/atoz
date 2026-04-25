'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ChevronDown, 
  Plus, 
  Quote
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SplitType from 'split-type';
import { supabase } from '@/lib/supabase/client';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [cmsData, setCmsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('site_settings')
        .select('config')
        .eq('id', 'cms_pages')
        .single();
      
      if (data?.config?.about) {
        setCmsData(data.config.about);
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

      // Hero image parallax
      gsap.to(".parallax-img", { 
        yPercent: 20, 
        ease: "none", 
        scrollTrigger: { trigger: ".parallax-img", start: "top bottom", end: "bottom top", scrub: true } 
      });

      // Timeline reveal
      gsap.to(".timeline-line-fill", {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline-container",
          start: "top center",
          end: "bottom center",
          scrub: 0.5
        }
      });

      // Process reveal
      gsap.to(".process-line-fill", {
        height: "100%", ease: "none",
        scrollTrigger: { trigger: ".process-line-center", start: "top center", end: "bottom center", scrub: 0.5 }
      });

    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  if (loading) return <div className="min-h-screen bg-brand-base flex items-center justify-center"><div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" /></div>;

  const data = cmsData || {
    hero: {
      title: "The Architects of Legacy.",
      subtitle: "We don't just put ink on paper. We translate corporate identity into tangible assets that carry weight, texture, and authority."
    },
    philosophy: [
      { title: "Obsessive Precision", desc: "In our world, a millimeter is a mile. We obsess over the grain direction, the ink density, and the foil alignment." },
      { title: "Tangible Authority", desc: "Digital is fleeting. Print is permanent. We create assets that sit on desks, stay in pockets, and remain in minds." },
      { title: "Future Heritage", desc: "We combine old-world letterpress soul with new-world digital speed. Creating artifacts today that will define your corporate history tomorrow." }
    ],
    timeline: [
      { year: '2015', title: 'Inception', desc: 'Started as a boutique design studio in New Delhi with a single vintage Heidelberg and a vision for uncompromised quality.', img: 'https://images.unsplash.com/photo-1560416313-414b33c856a9?q=80&w=1974&auto=format&fit=crop' },
      { year: '2018', title: 'Expansion', desc: 'Integrated end-to-end logistics. Began serving pan-India corporate giants with seamless kitting solutions.', img: 'https://images.unsplash.com/photo-1598301257982-0cf014dcc523?q=80&w=2070&auto=format&fit=crop' },
      { year: '2022', title: 'Eco-Luxe', desc: 'Launched our sustainable line. Zero-plastic packaging and recycled materials became a core offering.', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b09?q=80&w=2074&auto=format&fit=crop' },
      { year: '2026', title: 'The Future', desc: 'Integrating AI-driven design personalization and expanding our global footprint to 15 countries.', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop' }
    ],
    team: [
      { name: 'Rajesh Verma', role: 'Founder', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop' },
      { name: 'Priya Malhotra', role: 'Design Head', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop' },
      { name: 'Amit Singh', role: 'Production', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop' },
      { name: 'Sneha Kapoor', role: 'Relations', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop' }
    ],
    quote: {
      text: "We don't build for the transaction. We build for the legacy. Every print that leaves our press is a testament to permanence in a temporary world.",
      author: "Rajesh Verma",
      role: "Founder, ATOZPRINTS"
    }
  };

  return (
    <div ref={containerRef} className="bg-brand-base">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] pt-32 flex flex-col justify-center overflow-hidden bg-brand-base">
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px] animate-float"></div>
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-[1800px] mx-auto px-6 md:px-12 w-full z-10 text-center">
          <div className="hero-reveal mb-8 flex justify-center">
            <span className="px-6 py-2 border border-brand-darkBlue/20 rounded-full text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-brand-darkBlue bg-white/50 backdrop-blur-sm">Est. 2015</span>
          </div>
          
          <h1 className="text-huge font-serif font-bold text-brand-darkBlue mb-12 leading-super-tight reveal-title" dangerouslySetInnerHTML={{ __html: data.hero.title }}>
          </h1>

          <div className="overflow-hidden flex justify-center">
            <p className="hero-text block text-xl md:text-3xl text-slate-500 max-w-3xl leading-relaxed font-sans font-light">
              {data.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* 2. PHILOSOPHY */}
      <section className="min-h-[150vh] bg-brand-darkBlue text-white relative flex flex-col lg:flex-row" id="philosophy">
        {/* Sticky Title */}
        <div className="w-full lg:w-1/2 h-screen sticky top-0 flex flex-col justify-center px-6 md:px-24 border-r border-white/10 hidden lg:flex">
          <span className="text-brand-gold text-xs font-sans font-bold uppercase tracking-[0.4em] mb-8">Our DNA</span>
          <h2 className="text-7xl font-serif leading-none mb-12">The <br /> Philosophy.</h2>
          <div className="w-24 h-1 bg-brand-gold"></div>
        </div>

        {/* Scrollable Content */}
        <div className="w-full lg:w-1/2 py-32 px-6 md:px-24 flex flex-col gap-[30vh]">
          {data.philosophy.map((phil: any, idx: number) => (
            <div key={idx} className="philosophy-card border-b border-white/10 pb-16">
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-brand-gold font-serif text-3xl">0{idx + 1}.</span>
                <h3 className="text-4xl font-serif text-white">{phil.title}</h3>
              </div>
              <p className="text-xl text-slate-400 font-sans leading-relaxed max-w-md pl-12">
                {phil.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TIMELINE */}
      <section className="py-40 px-6 md:px-12 bg-brand-base relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-40">
            <h2 className="text-6xl md:text-8xl font-serif text-brand-darkBlue reveal-title">A Decade of <br /> <span className="italic text-brand-gold">Evolution.</span></h2>
          </div>

          <div className="relative timeline-container">
            <div className="timeline-line-bg absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-brand-darkBlue/10 -translate-x-1/2"></div>
            <div className="timeline-line-fill absolute left-0 md:left-1/2 top-0 w-[2px] bg-brand-gold -translate-x-1/2 shadow-[0_0_15px_#C5A059]"></div>

            {data.timeline.map((item: any, idx: number) => (
              <div key={idx} className={cn("relative flex flex-col md:flex-row items-center justify-between mb-48 group", idx % 2 !== 0 ? "md:flex-row-reverse" : "")}>
                <div className={cn("md:w-5/12 text-left pl-8 md:pl-0", idx % 2 !== 0 ? "md:pl-20" : "md:text-right md:pr-20")}>
                  <h3 className="text-8xl font-serif text-brand-darkBlue/10 mb-2 font-bold">{item.year}</h3>
                  <h4 className="text-3xl font-serif text-brand-darkBlue mb-4">{item.title}</h4>
                  <p className="text-slate-500 font-sans text-lg leading-relaxed">{item.desc}</p>
                </div>
                <div className="absolute left-0 md:left-1/2 w-6 h-6 bg-brand-base border-4 border-brand-darkBlue/20 rounded-full -translate-x-[11px] md:-translate-x-1/2 z-20 hidden md:block group-[.active]:bg-brand-gold group-[.active]:border-brand-gold"></div>
                <div className={cn("md:w-5/12 mb-10 md:mb-0 pl-8 md:pl-0", idx % 2 !== 0 ? "md:pr-20" : "md:pl-20")}>
                  <div className="h-72 w-full rounded-2xl overflow-hidden shadow-2xl">
                    <Image src={item.img || "https://images.unsplash.com/photo-1560416313-414b33c856a9?q=80&w=1974&auto=format&fit=crop"} alt={item.title} fill className="object-cover" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE PROCESS */}
      <section className="py-40 bg-[#0F1014] text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          <h2 className="text-5xl md:text-7xl font-serif mb-24 text-center">The <span className="italic text-brand-gold">Craft.</span></h2>
          
          <div className="relative">
            <div className="process-line-center absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2 hidden md:block"></div>
            <div className="process-line-fill absolute left-1/2 top-0 w-[2px] bg-brand-gold -translate-x-1/2 shadow-[0_0_15px_#C5A059] hidden md:block"></div>

            {[
              { num: '01', title: 'Consultation', desc: 'We begin by deconstructing your brand ethos. Understanding not just what you want to print, but what you want to whisper, speak, or shout to your audience.' },
              { num: '02', title: 'Architecture', desc: 'Our design engineers create structural prototypes. We select papers that feel like skin, foils that catch light like jewelry, and textures that demand touch.', right: true },
              { num: '03', title: 'Production', desc: 'Where German engineering meets artisanal soul. Precision Heidelberg offset printing for color accuracy, followed by hand-finishing for that human touch.' },
              { num: '04', title: 'Kitting', desc: 'The assembly of complex welcome kits. Adding personalized notes, securing gifts, and ensuring the unboxing experience is nothing short of theatrical.', right: true },
              { num: '05', title: 'Deployment', desc: 'Our logistics network spans the continent. Whether shipping to a single warehouse or dropshipping to 10,000 individual employee homes, we ensure pristine arrival.' }
            ].map((step, idx) => (
              <div key={idx} className={cn("relative flex flex-col md:flex-row items-center justify-between mb-32 group", step.right ? "md:flex-row-reverse" : "")}>
                <div className={cn("md:w-5/12", step.right ? "md:pl-12 text-left" : "md:pr-12 text-right")}>
                  <div className="bg-white/5 backdrop-blur-sm p-10 rounded-2xl relative border border-white/5 hover:border-brand-gold transition-all duration-500">
                    <span className="text-8xl font-serif text-white/5 absolute -top-10 left-0 md:-left-6 z-0">{step.num}</span>
                    <div className="relative z-10">
                      <h3 className="text-3xl font-serif text-white mb-4">{step.title}</h3>
                      <p className="text-slate-400 font-sans text-lg leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
                <div className="w-6 h-6 bg-[#0F1014] border-2 border-brand-gold rounded-full z-20 absolute left-1/2 -translate-x-1/2 hidden md:block"></div>
                <div className="md:w-5/12 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ATELIER PARALLAX */}
      <section className="relative h-[80vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1598520106830-8c45c2035460?q=80&w=2070&auto=format&fit=crop" alt="Machinery" fill className="object-cover parallax-img scale-110" />
          <div className="absolute inset-0 bg-brand-darkBlue/70"></div>
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl px-6">
          <span className="text-brand-gold text-xs font-sans font-bold uppercase tracking-[0.4em] mb-6 block">The Machinery</span>
          <h2 className="text-6xl md:text-9xl font-serif mb-8 reveal-title">10,000 sq ft <br /> <span className="italic text-white/50">of Innovation.</span></h2>
          <p className="text-xl font-sans text-white/80 leading-relaxed reveal-text">
            From vintage letterpresses to state-of-the-art Heidelberg offset machines. Our facility is where artisanal soul meets industrial might.
          </p>
        </div>
      </section>

      {/* 6. TEAM / ALCHEMISTS */}
      <section className="py-40 px-6 md:px-12 bg-brand-base" id="team">
        <div className="max-w-[1600px] mx-auto">
          <span className="text-brand-gold text-xs font-sans font-bold uppercase tracking-[0.4em] mb-16 block">The Alchemists</span>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div className="space-y-4">
              {data.team.map((member: any, idx: number) => (
                <div 
                  key={idx} 
                  className="py-12 cursor-pointer group relative border-t border-brand-darkBlue/10 transition-all duration-300 hover:pl-8"
                  onMouseEnter={() => setActiveTeamIndex(idx)}
                >
                  <div className="flex justify-between items-end relative z-10">
                    <h3 className={cn("text-4xl md:text-6xl font-serif transition-colors duration-300", activeTeamIndex === idx ? "text-brand-gold" : "text-brand-darkBlue")}>{member.name}</h3>
                    <span className="text-sm font-sans uppercase tracking-widest text-slate-400">{member.role}</span>
                  </div>
                </div>
              ))}
              <div className="border-t border-brand-darkBlue/10" />
            </div>

            <div className="relative h-[700px] w-full hidden lg:block sticky top-32">
              {data.team.map((member: any, idx: number) => (
                <div 
                  key={idx} 
                  className={cn("absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]", activeTeamIndex === idx ? "opacity-100 scale-100" : "opacity-0 scale-110 pointer-events-none")}
                >
                  <Image src={member.img || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop"} alt="Team" fill className="object-cover rounded-2xl shadow-2xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. QUOTE SECTION */}
      <section className="py-40 px-6 md:px-12 bg-white flex items-center justify-center border-t border-brand-darkBlue/5">
        <div className="max-w-4xl text-center">
          <Quote className="w-12 h-12 text-brand-gold mx-auto mb-8 opacity-50" />
          <h2 className="text-4xl md:text-6xl font-serif text-brand-darkBlue leading-tight mb-12">
            &quot;{data.quote.text}&quot;
          </h2>
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 mb-4 overflow-hidden rounded-full grayscale">
               <Image src={data.quote.img || data.team[0]?.img || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop"} alt={data.quote.author} fill className="object-cover" />
            </div>
            <span className="font-bold font-sans text-brand-darkBlue uppercase tracking-widest text-sm">{data.quote.author}</span>
            <span className="text-slate-400 text-xs uppercase tracking-widest mt-1">{data.quote.role}</span>
          </div>
        </div>
      </section>

      {/* 8. MAP SECTION */}
      <section className="py-40 bg-[#08090D] overflow-hidden relative">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <h2 className="text-5xl md:text-7xl font-serif text-white">Global <span className="italic text-brand-gold">Reach.</span></h2>
            <p className="text-slate-400 font-sans max-w-sm mt-6 md:mt-0">Connecting brands to people through a seamless pan-India logistics network.</p>
          </div>

          <div className="relative w-full h-[80vh] bg-gradient-to-b from-[#1a1d26] to-[#0B1120] rounded-[2rem] border border-white/5 overflow-hidden flex items-center justify-center group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 font-serif font-black text-[15vw] whitespace-nowrap pointer-events-none select-none">PAN INDIA</div>
            <div className="absolute inset-0 opacity-20 invert grayscale transition-transform duration-1000 group-hover:scale-105">
               <Image src="https://upload.wikimedia.org/wikipedia/commons/8/80/India_location_map.svg" alt="Map" fill className="object-contain" />
            </div>
            
            {/* Map Nodes Placeholder logic */}
            <div className="relative w-full max-w-3xl h-full">
              <div className="absolute top-[28%] left-[32%] flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 border border-brand-gold/50 rounded-full animate-ping"></div>
                  <div className="w-2 h-2 bg-brand-gold rounded-full shadow-[0_0_10px_#C5A059]"></div>
                </div>
                <div className="text-white font-sans text-xs font-bold tracking-widest">NEW DELHI <span className="text-brand-gold">HQ</span></div>
              </div>
              <div className="absolute top-[60%] left-[20%] flex items-center gap-4">
                 <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
                 <div className="text-slate-400 font-sans text-[10px] tracking-widest uppercase">Mumbai</div>
              </div>
              <div className="absolute top-[75%] left-[38%] flex items-center gap-4">
                 <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
                 <div className="text-slate-400 font-sans text-[10px] tracking-widest uppercase">Bangalore</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
