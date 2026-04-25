'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Instagram, 
  Linkedin, 
  Twitter, 
  MessageCircle, 
  Calendar, 
  Mail,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SplitType from 'split-type';
import { supabase } from '@/lib/supabase/client';

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cmsData, setCmsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('site_settings')
        .select('config')
        .eq('id', 'cms_pages')
        .single();
      
      if (data?.config?.contact) {
        setCmsData(data.config.contact);
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

      // Reveal text
      const texts = document.querySelectorAll('.reveal-text');
      texts.forEach(text => {
        gsap.to(text, { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: "power3.out", 
          scrollTrigger: { trigger: text, start: "top 90%" } 
        });
      });

      // Channel cards reveal
      gsap.utils.toArray<HTMLElement>('.channel-card').forEach((card, i) => {
        gsap.from(card, {
          y: 50, 
          opacity: 0, 
          duration: 1, 
          delay: i * 0.1, 
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 90%" }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  if (loading) return <div className="min-h-screen bg-brand-base flex items-center justify-center"><div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" /></div>;

  const data = cmsData || {
    hero: { title: "Let's Engineer Your Legacy.", subtitle: "Get in Touch" },
    info: { 
      email: "hello@atozprints.in", 
      phone: "+91 98765 43210", 
      address: "12, Okhla Industrial Estate, Phase III, New Delhi, India 110020" 
    },
    socials: { instagram: "#", linkedin: "#", twitter: "#" }
  };

  return (
    <div ref={containerRef} className="bg-brand-base">
      {/* 1. HERO SECTION */}
      <section className="relative pt-48 pb-20 px-6 md:px-12 bg-brand-base overflow-hidden">
        {/* Floating Ambience */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none animate-float"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-[1800px] mx-auto text-center relative z-10">
          <span className="text-brand-gold text-xs font-sans font-bold uppercase tracking-[0.4em] mb-8 block reveal-text">{data.hero.subtitle}</span>
          <h1 className="text-huge font-serif font-bold text-brand-darkBlue leading-super-tight mb-8 reveal-title" dangerouslySetInnerHTML={{ __html: data.hero.title }}>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-sans max-w-2xl mx-auto leading-relaxed reveal-text">
            Ready to elevate your brand&apos;s physical presence? Fill out the form or reach us directly. Let&apos;s create something tangible.
          </p>
        </div>
      </section>

      {/* 2. SPLIT LAYOUT: INFO & FORM */}
      <section className="py-20 px-6 md:px-12 bg-brand-base">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            {/* Left: Contact Info (Sticky) */}
            <div className="lg:col-span-5 relative">
              <div className="lg:sticky lg:top-40">
                <h3 className="text-4xl font-serif text-brand-darkBlue mb-12">Direct Lines</h3>
                
                <div className="space-y-2">
                  <div className="contact-detail-row group cursor-pointer border-b border-brand-darkBlue/10 py-8 transition-all hover:pl-8 hover:border-brand-gold">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-slate-400 block mb-2">Email Support</span>
                    <a href={`mailto:${data.info.email}`} className="text-3xl md:text-5xl font-serif text-brand-darkBlue group-hover:text-brand-gold transition-colors break-words">{data.info.email}</a>
                  </div>

                  <div className="contact-detail-row group cursor-pointer border-b border-brand-darkBlue/10 py-8 transition-all hover:pl-8 hover:border-brand-gold">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-slate-400 block mb-2">Call Us</span>
                    <a href={`tel:${data.info.phone.replace(/\s+/g, '')}`} className="text-3xl md:text-5xl font-serif text-brand-darkBlue group-hover:text-brand-gold transition-colors">{data.info.phone}</a>
                  </div>

                  <div className="contact-detail-row group cursor-pointer py-8 transition-all hover:pl-8">
                    <span className="text-xs font-sans font-bold uppercase tracking-widest text-slate-400 block mb-2">Headquarters</span>
                    <p className="text-xl font-sans text-brand-darkBlue leading-relaxed group-hover:text-slate-600 transition-colors" dangerouslySetInnerHTML={{ __html: data.info.address.replace(/\n/g, '<br />') }}>
                    </p>
                  </div>
                </div>

                {/* Socials */}
                <div className="mt-16">
                  <span className="text-xs font-sans font-bold uppercase tracking-widest text-slate-400 block mb-6">Socials</span>
                  <div className="flex gap-6">
                    <a href={data.socials.instagram} className="w-12 h-12 rounded-full border border-brand-darkBlue/20 flex items-center justify-center hover:bg-brand-darkBlue hover:text-white transition-all magnetic-target"><Instagram className="w-5 h-5" /></a>
                    <a href={data.socials.linkedin} className="w-12 h-12 rounded-full border border-brand-darkBlue/20 flex items-center justify-center hover:bg-brand-darkBlue hover:text-white transition-all magnetic-target"><Linkedin className="w-5 h-5" /></a>
                    <a href={data.socials.twitter} className="w-12 h-12 rounded-full border border-brand-darkBlue/20 flex items-center justify-center hover:bg-brand-darkBlue hover:text-white transition-all magnetic-target"><Twitter className="w-5 h-5" /></a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: The Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-12 md:p-20 rounded-[3rem] shadow-2xl border border-brand-darkBlue/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px] -z-10"></div>
                
                <h3 className="text-4xl font-serif text-brand-darkBlue mb-16">Start a Project</h3>
                
                <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="form-group relative mb-12">
                      <input type="text" id="name" className="form-input w-full bg-transparent border-b border-brand-darkBlue/20 py-4 font-sans text-xl text-brand-darkBlue focus:outline-none focus:border-brand-gold transition-all peer" required />
                      <label htmlFor="name" className="form-label absolute left-0 top-4 text-xl text-slate-400 font-serif italic pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:font-sans peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-brand-gold peer-focus:not-italic peer-valid:-top-6 peer-valid:text-xs peer-valid:font-sans peer-valid:font-bold peer-valid:uppercase peer-valid:tracking-widest peer-valid:text-brand-gold peer-valid:not-italic">Your Name</label>
                    </div>
                    <div className="form-group relative mb-12">
                      <input type="text" id="company" className="form-input w-full bg-transparent border-b border-brand-darkBlue/20 py-4 font-sans text-xl text-brand-darkBlue focus:outline-none focus:border-brand-gold transition-all peer" required />
                      <label htmlFor="company" className="form-label absolute left-0 top-4 text-xl text-slate-400 font-serif italic pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:font-sans peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-brand-gold peer-focus:not-italic peer-valid:-top-6 peer-valid:text-xs peer-valid:font-sans peer-valid:font-bold peer-valid:uppercase peer-valid:tracking-widest peer-valid:text-brand-gold peer-valid:not-italic">Company Name</label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="form-group relative mb-12">
                      <input type="email" id="email" className="form-input w-full bg-transparent border-b border-brand-darkBlue/20 py-4 font-sans text-xl text-brand-darkBlue focus:outline-none focus:border-brand-gold transition-all peer" required />
                      <label htmlFor="email" className="form-label absolute left-0 top-4 text-xl text-slate-400 font-serif italic pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:font-sans peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-brand-gold peer-focus:not-italic peer-valid:-top-6 peer-valid:text-xs peer-valid:font-sans peer-valid:font-bold peer-valid:uppercase peer-valid:tracking-widest peer-valid:text-brand-gold peer-valid:not-italic">Email Address</label>
                    </div>
                    <div className="form-group relative mb-12">
                      <input type="tel" id="phone" className="form-input w-full bg-transparent border-b border-brand-darkBlue/20 py-4 font-sans text-xl text-brand-darkBlue focus:outline-none focus:border-brand-gold transition-all peer" required />
                      <label htmlFor="phone" className="form-label absolute left-0 top-4 text-xl text-slate-400 font-serif italic pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:font-sans peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-brand-gold peer-focus:not-italic peer-valid:-top-6 peer-valid:text-xs peer-valid:font-sans peer-valid:font-bold peer-valid:uppercase peer-valid:tracking-widest peer-valid:text-brand-gold peer-valid:not-italic">Phone Number</label>
                    </div>
                  </div>

                  <div className="form-group relative mb-12">
                    <label className="block text-xs font-sans font-bold uppercase tracking-widest text-slate-400 mb-6">I&apos;m interested in</label>
                    <div className="flex flex-wrap gap-4">
                      {['Corporate Gifting', 'Packaging', 'Stationery', 'Logistics'].map((interest) => (
                        <label key={interest} className="cursor-pointer">
                          <input type="checkbox" className="peer sr-only" />
                          <div className="px-6 py-3 rounded-full border border-brand-darkBlue/20 text-brand-darkBlue peer-checked:bg-brand-darkBlue peer-checked:text-white peer-checked:border-brand-darkBlue transition-all font-sans text-sm hover:border-brand-gold">
                            {interest}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group relative mb-12">
                    <input type="text" id="message" className="form-input w-full bg-transparent border-b border-brand-darkBlue/20 py-4 font-sans text-xl text-brand-darkBlue focus:outline-none focus:border-brand-gold transition-all peer" required />
                    <label htmlFor="message" className="form-label absolute left-0 top-4 text-xl text-slate-400 font-serif italic pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:font-sans peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-brand-gold peer-focus:not-italic peer-valid:-top-6 peer-valid:text-xs peer-valid:font-sans peer-valid:font-bold peer-valid:uppercase peer-valid:tracking-widest peer-valid:text-brand-gold peer-valid:not-italic">Tell us about your project</label>
                  </div>

                  <div className="pt-8">
                    <button type="submit" className="w-full py-6 bg-brand-darkBlue text-white font-sans font-bold uppercase tracking-[0.2em] rounded-full hover:bg-brand-gold transition-all duration-500 magnetic-target shadow-lg">
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INSTANT CHANNELS */}
      <section className="py-32 bg-brand-base border-t border-brand-darkBlue/5">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <h2 className="text-4xl font-serif text-brand-darkBlue mb-16 text-center">Instant <span className="italic text-brand-gold">Access.</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* WhatsApp */}
            <div className="channel-card p-10 rounded-3xl bg-white text-center group cursor-pointer border border-brand-darkBlue/10 transition-all hover:bg-brand-darkBlue hover:text-white">
              <div className="w-16 h-16 bg-brand-base rounded-full flex items-center justify-center mx-auto mb-6 text-brand-darkBlue group-hover:bg-brand-gold group-hover:text-brand-darkBlue transition-colors">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif mb-2">WhatsApp Priority</h3>
              <p className="text-sm font-sans text-slate-400 mb-6 group-hover:text-slate-300">Instant quotes & support</p>
              <a href="#" className="inline-block border-b border-current pb-1 text-xs font-bold uppercase tracking-widest">Chat Now</a>
            </div>
            
            {/* Schedule */}
            <div className="channel-card p-10 rounded-3xl bg-white text-center group cursor-pointer border border-brand-darkBlue/10 transition-all hover:bg-brand-darkBlue hover:text-white">
              <div className="w-16 h-16 bg-brand-base rounded-full flex items-center justify-center mx-auto mb-6 text-brand-darkBlue group-hover:bg-brand-gold group-hover:text-brand-darkBlue transition-colors">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif mb-2">Schedule Call</h3>
              <p className="text-sm font-sans text-slate-400 mb-6 group-hover:text-slate-300">Book a 15-min discovery</p>
              <a href="#" className="inline-block border-b border-current pb-1 text-xs font-bold uppercase tracking-widest">Book Slot</a>
            </div>

            {/* Email */}
            <div className="channel-card p-10 rounded-3xl bg-white text-center group cursor-pointer border border-brand-darkBlue/10 transition-all hover:bg-brand-darkBlue hover:text-white">
              <div className="w-16 h-16 bg-brand-base rounded-full flex items-center justify-center mx-auto mb-6 text-brand-darkBlue group-hover:bg-brand-gold group-hover:text-brand-darkBlue transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif mb-2">Bulk Inquiries</h3>
              <p className="text-sm font-sans text-slate-400 mb-6 group-hover:text-slate-300">For orders &gt;500 units</p>
              <a href="mailto:bulk@atozprint.in" className="inline-block border-b border-current pb-1 text-xs font-bold uppercase tracking-widest">Email Team</a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ TEASER */}
      <section className="py-24 bg-brand-gold text-brand-darkBlue text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-serif mb-6">Have quick questions?</h2>
          <p className="text-lg font-sans mb-10 opacity-80">Check our frequently asked questions for immediate answers regarding MOQ, Shipping, and Customization.</p>
          <Link href="/faq" className="inline-block border-b border-brand-darkBlue pb-1 font-bold font-sans uppercase tracking-widest hover:opacity-50 transition-opacity">Visit FAQ Center</Link>
        </div>
      </section>
    </div>
  );
}
