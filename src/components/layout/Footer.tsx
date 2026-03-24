"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Footer = () => {
  return (
    <footer className="bg-secondary text-on-primary/70 pt-24 pb-12 overflow-hidden relative">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Info */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-12 w-12 bg-white rounded-xl p-2 shadow-lg">
                <Image 
                  src="https://lh3.googleusercontent.com/aida/ADBb0uieUJFbF7eBfo3s9pG1y2TlX8vEgBOlDc2r6osyyhQrpBhPJBb2OrYNpTpNBlnZYUNuwT9vKX9oH1Ju5DNO8RVLbkQKEM7pP1hX4igIK40j4AOLet64Ox8MQ3sPlzwva8m9YHQm8QZdAoN1M9Emnxt_4w7tNfYSjaZmJUmtDOwV9zJqNiIkPppyantJzHBApTVu9gR6sUF1UYCMnTIU2DpWGGZcntcWxx6vdpWvXIHBjlB0izvN6V_n579yAkT-QrLXPowqLSITtw" 
                  alt="AtoZ Print" 
                  fill 
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white font-headline">AtoZ Print</span>
            </Link>
            <p className="text-on-primary/60 leading-relaxed font-medium">
              Transforming your digital visions into premium physical impressions. From custom apparel to corporate gifting, we define the standard of high-fidelity printing.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-500 hover:-translate-y-1 group"
                >
                  <Icon className="h-5 w-5 text-on-primary/50 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-8 tracking-tight">Curation</h4>
            <ul className="space-y-4">
              <li><Link href="/products" className="hover:text-primary transition-all duration-300 font-medium">Product Catalog</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-all duration-300 font-medium">Design Atelier</Link></li>
              <li><Link href="/bulk" className="hover:text-primary transition-all duration-300 font-medium">Enterprise Orders</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-all duration-300 font-medium">Our Philosophy</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-8 tracking-tight">Concierge</h4>
            <ul className="space-y-4">
              <li><Link href="/contact" className="hover:text-primary transition-all duration-300 font-medium">Client Support</Link></li>
              <li><Link href="/shipping" className="hover:text-primary transition-all duration-300 font-medium">Logistics Details</Link></li>
              <li><Link href="/returns" className="hover:text-primary transition-all duration-300 font-medium">Satisfaction Policy</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-all duration-300 font-medium">Common Queries</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-8">
            <h4 className="text-white font-bold text-lg tracking-tight">Stay Impactful</h4>
            <p className="text-on-primary/60 font-medium">Get curated design inspiration and exclusive offers.</p>
            <form 
              onSubmit={(e) => { e.preventDefault(); toast.success('Welcome to the Atelier!'); }} 
              className="relative group lg:max-w-xs"
            >
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-bold placeholder:text-on-primary/30"
                required
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                <Mail className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm font-bold text-on-primary/40 tracking-tight">
            © {new Date().getFullYear()} ATOZ PRINT. ENGINEERED FOR IMPRESSIONS.
          </p>
          <div className="flex space-x-12 text-xs font-bold uppercase tracking-widest text-on-primary/40">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Legal Framework</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
