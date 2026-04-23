"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white/70 pt-24 pb-16 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand Info */}
          <div className="space-y-10">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image
                  src="/logo.png"
                  alt="AtoZ Print"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold tracking-tighter text-white">AtoZ Print</span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed font-medium max-w-sm">
              High-quality printing for your business. From clothes to packaging, we provide the best printing services for you.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-pink hover:border-brand-pink transition-all group"
                >
                  <Icon className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-10 uppercase tracking-widest italic opacity-50">Products</h4>
            <ul className="space-y-5">
              <li><Link href="/products" className="text-sm hover:text-brand-pink transition-all font-bold italic">All Products</Link></li>
              <li><Link href="/category" className="text-sm hover:text-brand-pink transition-all font-bold italic">Categories</Link></li>
              <li><Link href="/corporate" className="text-sm hover:text-brand-pink transition-all font-bold italic text-brand-pink">Corporate / Bulk</Link></li>
              <li><Link href="/blogs" className="text-sm hover:text-brand-pink transition-all font-bold italic">Intelligence / Blog</Link></li>
              <li><Link href="/about" className="text-sm hover:text-brand-pink transition-all font-bold italic">About Us</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-10 uppercase tracking-widest italic opacity-50">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/track" className="text-sm hover:text-brand-pink transition-all font-bold italic text-brand-cyan">Track Order</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-brand-pink transition-all font-bold italic">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-sm hover:text-brand-pink transition-all font-bold italic">Shipping Policy</Link></li>
              <li><Link href="/terms" className="text-sm hover:text-brand-pink transition-all font-bold italic">Terms & Privacy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-8">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest italic opacity-50">Email List</h4>
            <p className="text-sm text-white/50 font-medium">Get updates on new products and deals.</p>
            <form
              onSubmit={(e) => { e.preventDefault(); toast.success('Thanks for joining!'); }}
              className="relative group lg:max-w-xs"
            >
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-brand-pink/50 transition-all font-bold placeholder:text-white/20 italic"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-2 h-10 w-10 bg-brand-pink text-white rounded-lg flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-brand-pink/20"
              >
                <Mail className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">
            © {new Date().getFullYear()} ATOZ PRINT. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-10 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
            <Link href="/privacy" className="hover:text-brand-pink transition-colors italic">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-pink transition-colors italic">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
