"use client";

import React from 'react';
import Image from 'next/image';
import { 
  Sparkles, 
  Target, 
  Award, 
  Zap, 
  ShieldCheck, 
  Users2,
  CheckCircle2,
  ArrowRight,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { label: "Corporate Clients", value: "500+", icon: <Users2 className="h-5 w-5" /> },
    { label: "Products in Catalog", value: "50+", icon: <Zap className="h-5 w-5" /> },
    { label: "Service Locations", value: "PAN India", icon: <Target className="h-5 w-5" /> },
    { label: "Quality Standards", value: "ISO Ready", icon: <Award className="h-5 w-5" /> },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cyan/10 rounded-full text-brand-cyan text-[10px] font-black uppercase tracking-widest mb-8">
              <Sparkles className="h-3 w-3" />
              Quality Printing
           </div>
           <h1 className="text-6xl md:text-8xl font-black text-brand-dark tracking-tighter mb-8 leading-[0.9]">
             Printing <span className="text-brand-pink italic">solutions</span> <br />
             for your <span className="underline decoration-brand-cyan/30">Business.</span>
           </h1>
           <p className="text-xl text-gray-400 font-medium max-w-2xl leading-relaxed">
             AtoZ Print is a complete printing and corporate gifting solutions provider offering premium-quality customized products for businesses, corporates, events, and individuals across India.
           </p>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-pink/5 to-transparent -z-10 rotate-12 transform translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-brand-cyan/5 -z-10 blur-3xl rounded-full translate-y-20"></div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-y border-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="p-12 bg-brand-lightGray rounded-[48px] space-y-6">
            <Target className="h-12 w-12 text-brand-pink" />
            <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tight">Our Mission</h2>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              To deliver high-quality, affordable, and reliable printing solutions that empower businesses to grow their physical presence.
            </p>
          </div>
          <div className="p-12 bg-brand-dark rounded-[48px] space-y-6 text-white shadow-2xl shadow-brand-dark/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            <Globe className="h-12 w-12 text-brand-cyan animate-pulse-slow relative z-10" />
            <h2 className="text-3xl font-black uppercase tracking-tight relative z-10">Our Vision</h2>
            <p className="text-lg text-gray-200 font-medium leading-relaxed relative z-10">
              To become one of India&apos;s most trusted and preferred print brands, recognized for excellence and transparency.
            </p>
          </div>

          <div className="p-12 bg-white border border-gray-100 rounded-[48px] space-y-6">
            <ShieldCheck className="h-12 w-12 text-brand-pink" />
            <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tight">Our Values</h2>
            <ul className="space-y-3">
              {['Quality', 'Reliability', 'Transparency', 'Customer Satisfaction'].map((val) => (
                <li key={val} className="flex items-center gap-3 text-lg font-bold text-gray-500">
                  <CheckCircle2 className="h-5 w-5 text-brand-cyan" />
                  {val}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
           <div className="relative group">
              <div className="aspect-square bg-white rounded-[64px] overflow-hidden rotate-3 group-hover:rotate-0 transition-transform duration-700 shadow-2xl border border-gray-100 p-4">
                 <div className="relative w-full h-full rounded-[48px] overflow-hidden">
                    <Image 
                      src="https://images.unsplash.com/photo-1598425237654-4fc758e50a93?q=80&w=2000&auto=format&fit=crop" 
                      alt="Premium Printing Facility"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-pink/10 rounded-full blur-3xl -z-10 group-hover:bg-brand-pink/20 transition-colors" />
           </div>

           <div className="space-y-8">
              <h2 className="text-4xl font-black text-brand-dark tracking-tight">Why Choose Us?</h2>
              <p className="text-lg text-gray-500 leading-relaxed font-medium">
                At AtoZ Print, we combine a wide product range with full customization options to give your brand the edge it deserves. Our unique selling proposition lies in our fast turnaround time and consistent quality across all product categories.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                 <div className="p-8 border border-gray-100 rounded-3xl space-y-3">
                    <Zap className="h-8 w-8 text-brand-pink" />
                    <h3 className="font-black text-brand-dark uppercase tracking-tight text-sm">Fast Delivery</h3>
                    <p className="text-xs text-gray-400 font-medium">Standard delivery in 5-10 working days PAN India.</p>
                 </div>
                 <div className="p-8 border border-gray-100 rounded-3xl space-y-3">
                    <Sparkles className="h-8 w-8 text-brand-cyan" />
                    <h3 className="font-black text-brand-dark uppercase tracking-tight text-sm">Easy Customization</h3>
                    <p className="text-xs text-gray-400 font-medium">Logo, Name, Text, and Color options on every product.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-brand-dark py-24">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center group">
                   <div className="inline-flex p-4 rounded-2xl bg-white/5 text-brand-pink mb-6 group-hover:bg-brand-pink group-hover:text-white transition-all transform group-hover:scale-110">
                      {stat.icon}
                   </div>
                   <div className="text-5xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">{stat.label}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Execution Pillars Section (Target Audience) */}
      <section className="max-w-7xl mx-auto px-6 py-32 text-center">
         <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tight mb-16 underline decoration-brand-cyan/20 decoration-8 underline-offset-8">Who We Serve</h2>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "Corporates", desc: "Premium joined kits and official stationary.", icon: <Users2 /> },
              { title: "SMEs", desc: "Affordable branding and promotional gear.", icon: <Target /> },
              { title: "Events", desc: "Customized lanyards, menus, and invites.", icon: <Sparkles /> },
              { title: "Individuals", desc: "Personalized gifts with professional touch.", icon: <Zap /> }
            ].map((pillar, idx) => (
              <div key={idx} className="p-10 border border-gray-100 rounded-[48px] hover:shadow-2xl hover:shadow-gray-100 transition-all flex flex-col items-center group glass-morphism bg-white/40">
                 <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center text-brand-dark mb-6 group-hover:bg-brand-dark group-hover:text-white transition-all animate-float">
                    {React.cloneElement(pillar.icon as React.ReactElement, { className: "h-6 w-6" })}
                 </div>
                 <h3 className="text-lg font-black text-brand-dark mb-2">{pillar.title}</h3>
                 <p className="text-gray-400 font-medium text-xs leading-relaxed">{pillar.desc}</p>
              </div>

            ))}
         </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
         <div className="bg-brand-pink p-12 md:p-24 rounded-[64px] relative overflow-hidden flex flex-col items-center text-center text-white">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 max-w-3xl">Get Premium Quality Prints for Your Organization Today.</h2>
            <div className="flex flex-wrap items-center justify-center gap-6">
               <Link href="/products" className="px-12 py-5 bg-white text-brand-pink rounded-full font-black text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
                  Browse Catalog
                  <ArrowRight className="h-5 w-5" />
               </Link>
               <Link href="/contact" className="px-12 py-5 bg-brand-dark text-white rounded-full font-black text-lg hover:bg-white hover:text-brand-dark transition-all">
                  Get a Quote
               </Link>
            </div>
         </div>
      </section>

      {/* Founder Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 bg-gray-50/50 rounded-[64px] mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-16 items-center">
           <div className="relative group">
              <div className="aspect-[4/5] bg-white rounded-[48px] overflow-hidden shadow-2xl border border-gray-100 p-3">
                 <div className="relative w-full h-full rounded-[40px] overflow-hidden">
                    <Image 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2000&auto=format&fit=crop" 
                      alt="Richa Jain - Founder"
                      fill
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                 </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-brand-pink text-white p-8 rounded-3xl shadow-xl">
                 <div className="text-sm font-black uppercase tracking-widest mb-1">Richa Jain</div>
                 <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Founder & CEO</div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink/10 rounded-full text-brand-pink text-[10px] font-black uppercase tracking-widest">
                 Founder Story
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tight leading-[1.1]">
                Visionary leadership, <br/>
                <span className="text-brand-pink italic">creative heart.</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-500 font-medium leading-relaxed">
                 <p>
                    Richa Jain started AtoZ Prints with a simple yet powerful goal: to make premium-quality printing accessible to every brand in India. With a background in digital arts and a keen eye for business logistics, she noticed a massive gap between the high-end requirements of corporate giants and the limited capabilities of local vendors.
                 </p>
                 <p>
                    In 2018, she launched the company with a single desktop printer and a firm belief that every brand, regardless of its size, deserves to look its absolute best. What started as a small home-based studio has now evolved into a tech-driven manufacturing powerhouse, trusted by over 500+ corporate partners and thousands of independent creators across the nation.
                 </p>
                 <p className="italic text-brand-dark font-bold border-l-4 border-brand-pink pl-6">
                    &quot;At AtoZ, we aren&apos;t just printing on products; we are printing your brand&apos;s future. Our mission is to ensure that your vision is delivered with the precision it deserves.&quot;
                 </p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
