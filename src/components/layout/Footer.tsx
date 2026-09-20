'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Instagram, Linkedin, Phone, MapPin, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

const Footer = () => {
  const pathname = usePathname();
  const [contactData, setContactData] = useState<any>(null);

  useEffect(() => {
    async function fetchContact() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('config')
          .eq('id', 'cms_pages')
          .single();
        if (data?.config?.contact) {
          setContactData(data.config.contact);
        }
      } catch (err) {
        console.error('Error fetching contact footer info:', err);
      }
    }
    fetchContact();
  }, []);

  const email = contactData?.info?.email || "printsatoz2@gmail.com";
  const phone = contactData?.info?.phone || "8279427956";
  const whatsapp = contactData?.info?.whatsapp || "918279427956";
  const address = contactData?.info?.address || "501 spectrum square appartment judge colony malekpet hyderabad 500036";
  
  const instagram = contactData?.socials?.instagram || "https://www.instagram.com/atoz_ptints/";
  const linkedin = contactData?.socials?.linkedin || "#";
  const twitter = contactData?.socials?.twitter || "#";

  const getWhatsappLink = (num: string) => {
    const cleanNum = num.replace(/[^0-9]/g, '');
    if (cleanNum.length === 10) {
      return `https://wa.me/91${cleanNum}`;
    }
    return `https://wa.me/${cleanNum}`;
  };

  const getTelLink = (num: string) => {
    return `tel:${num.replace(/\s+/g, '')}`;
  };

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/customize')) {
    return null;
  }

  return (
    <div className="bg-brand-darkBlue text-white footer-reveal-container">
      <footer className="flex flex-col justify-between pt-24 pb-12 px-6 md:px-12 relative overflow-hidden" id="contact">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
          {/* Left Column: Brand & Direct Contact */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative w-20 h-20">
              <Image 
                src="https://i.postimg.cc/BbgxQXMj/Whats-App-Image-2026-02-05-at-12-10-39.png" 
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            
            <div>
              <span className="text-brand-gold text-xs font-sans font-bold uppercase tracking-[0.4em] mb-4 block">
                Start a Project
              </span>
              <h2 className="text-4xl md:text-6xl mb-6 text-white/95 font-serif font-bold leading-tight">
                Let&apos;s Make <br /> <span className="italic text-brand-gold">History.</span>
              </h2>
              <a 
                href={`mailto:${email}`} 
                className="text-xl sm:text-2xl md:text-3xl border-b border-white/20 pb-2 hover:text-brand-gold hover:border-brand-gold transition-all font-sans font-light magnetic-target inline-block"
              >
                {email}
              </a>
            </div>

            <div className="space-y-4 text-slate-300 font-sans text-sm">
              <div className="flex items-center gap-3.5">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <a href={getTelLink(phone)} className="hover:text-brand-gold transition-colors">{phone}</a>
              </div>
              <div className="flex items-start gap-3.5">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-1" />
                <span className="leading-relaxed text-xs text-slate-400" dangerouslySetInnerHTML={{ __html: address.replace(/\n/g, '<br />') }} />
              </div>
              <div className="flex items-center gap-3.5">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-brand-gold transition-colors">{email}</a>
              </div>
              <div className="flex items-center gap-3.5">
                <svg className="w-4 h-4 fill-brand-gold shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.706 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <a href={getWhatsappLink(whatsapp)} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">{whatsapp}</a>
              </div>
            </div>
          </div>
          
          {/* Right Columns: Structured Navigation */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 pt-4">
            {/* Column 1: Explore Solutions */}
            <div>
              <span className="block text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-brand-gold mb-5">
                Explore
              </span>
              <ul className="text-sm font-sans text-slate-300 space-y-3">
                <li>
                  <Link href="/products" className="hover:text-brand-gold transition-colors inline-block">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/corporate" className="hover:text-brand-gold transition-colors inline-block">
                    Corporate Orders
                  </Link>
                </li>
                <li>
                  <Link href="/customize" className="hover:text-brand-gold transition-colors inline-block">
                    Custom Studio
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-brand-gold transition-colors inline-block">
                    Bulk Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/offers" className="hover:text-brand-gold transition-colors inline-block">
                    Offers & Packs
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-brand-gold transition-colors inline-block">
                    About AtoZ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Support & Logistics */}
            <div>
              <span className="block text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-brand-gold mb-5">
                Support
              </span>
              <ul className="text-sm font-sans text-slate-300 space-y-3">
                <li>
                  <Link href="/track-order" className="hover:text-brand-gold transition-colors inline-block">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-brand-gold transition-colors inline-block">
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-brand-gold transition-colors inline-block">
                    Contact Desk
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-brand-gold transition-colors inline-block">
                    Insights & FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="hover:text-brand-gold transition-colors inline-block">
                    Printing Knowledge
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal & Policies */}
            <div className="col-span-2 sm:col-span-1">
              <span className="block text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-brand-gold mb-5">
                Policies & Legal
              </span>
              <ul className="text-sm font-sans text-slate-300 space-y-3">
                <li>
                  <Link href="/refund" className="hover:text-brand-gold transition-colors inline-block font-semibold text-white">
                    Refund & Cancellation
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-brand-gold transition-colors inline-block">
                    Return Policy
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-brand-gold transition-colors inline-block">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-brand-gold transition-colors inline-block">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/legal" className="hover:text-brand-gold transition-colors inline-block">
                    Legal Framework
                  </Link>
                </li>
              </ul>

              {/* Social Channels */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <span className="block text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-slate-500 mb-3">
                  Follow Us
                </span>
                <div className="flex items-center gap-4 text-slate-300">
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors" title="Instagram">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors" title="LinkedIn">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href={twitter} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors" title="Twitter">
                    <span className="text-xs font-bold font-sans">𝕏</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-16 border-t border-white/10 mt-20">
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image 
                  src="https://i.postimg.cc/BbgxQXMj/Whats-App-Image-2026-02-05-at-12-10-39.png" 
                  alt="ATOZPRINTS"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl tracking-tight text-white leading-none">ATOZ.</span>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-1 h-1 bg-brand-gold rounded-full"></div>
                  <span className="text-[7px] font-sans font-bold uppercase tracking-[0.2em] text-brand-gold">Excellence</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-[10px] font-sans font-bold uppercase tracking-widest text-slate-500">
            <span>© 2026 ATOZPRINTS</span>
            <span className="text-white/15 hidden sm:inline">•</span>
            <Link href="/refund" className="hover:text-brand-gold transition-colors">Refund & Cancellation</Link>
            <span className="text-white/15 hidden sm:inline">•</span>
            <Link href="/returns" className="hover:text-brand-gold transition-colors">Returns</Link>
            <span className="text-white/15 hidden sm:inline">•</span>
            <Link href="/privacy" className="hover:text-brand-gold transition-colors">Privacy</Link>
            <span className="text-white/15 hidden sm:inline">•</span>
            <Link href="/terms" className="hover:text-brand-gold transition-colors">Terms</Link>
            <span className="text-white/15 hidden sm:inline">•</span>
            <Link href="/shipping" className="hover:text-brand-gold transition-colors">Shipping</Link>
            <span className="text-white/15 hidden sm:inline">•</span>
            <Link href="/legal" className="hover:text-brand-gold transition-colors">Legal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
