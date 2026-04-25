'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <div className="bg-brand-darkBlue text-white footer-reveal-container">
      <footer className="min-h-screen flex flex-col justify-between pt-32 pb-12 px-6 md:px-12 relative overflow-hidden" id="contact">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
          <div className="md:col-span-8">
            <div className="relative w-24 h-24 mb-10">
              <Image 
                src="https://i.postimg.cc/BbgxQXMj/Whats-App-Image-2026-02-05-at-12-10-39.png" 
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-brand-gold text-xs font-sans font-bold uppercase tracking-[0.4em] mb-8 block">Start a Project</span>
            <h2 className="text-display leading-[0.8] mb-12 text-white/90 font-serif font-bold">
              Let&apos;s Make <br /> <span className="italic text-brand-gold">History.</span>
            </h2>
            <a href="mailto:hello@atozprints.in" className="text-2xl md:text-4xl border-b border-white/20 pb-4 hover:text-brand-gold hover:border-brand-gold transition-all font-sans font-light magnetic-target inline-block">
              hello@atozprints.in
            </a>
          </div>
          
          <div className="md:col-span-4 flex flex-col justify-end space-y-16">
            <div className="grid grid-cols-2 gap-12">
              <div>
                <span className="block text-[10px] font-sans font-bold uppercase tracking-widest text-slate-500 mb-6">HQ</span>
                <p className="text-base font-sans text-slate-300 leading-relaxed">
                  12, Okhla Industrial Estate<br />
                  Phase III, New Delhi<br />
                  India 110020
                </p>
              </div>
              <div>
                <span className="block text-[10px] font-sans font-bold uppercase tracking-widest text-slate-500 mb-6">Connect</span>
                <ul className="text-base font-sans text-slate-300 space-y-4">
                  <li><a href="#" className="hover:text-brand-gold transition-colors magnetic-target inline-block">Instagram</a></li>
                  <li><a href="#" className="hover:text-brand-gold transition-colors magnetic-target inline-block">LinkedIn</a></li>
                  <li><a href="#" className="hover:text-brand-gold transition-colors magnetic-target inline-block">Behance</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end pt-24 border-t border-white/5 mt-auto">
          <div className="mb-8 md:mb-0">
            <h3 className="text-[15vw] leading-none font-serif font-bold text-white/5 select-none pointer-events-none">ATOZ.</h3>
          </div>
          <div className="flex gap-8 text-[10px] font-sans font-bold uppercase tracking-widest text-slate-600">
            <span>© {new Date().getFullYear()} ATOZPRINTS</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
