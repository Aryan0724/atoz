"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
        <div className="col-span-1 lg:col-span-2">
          <div className="relative h-20 w-48 mb-6 -ml-4">
            <Image 
              src="/logo.png" 
              alt="AtoZ Print" 
              fill 
              className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" 
            />
          </div>
          <p className="text-gray-400 mb-6 max-w-sm font-medium leading-relaxed">
            AtoZ Print is a complete printing and corporate gifting solutions provider offering premium-quality customized products for businesses, corporates, events, and individuals across India.
          </p>
          <div className="flex space-x-4 mb-8">
            <a href="#" className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-pink transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-pink transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-pink transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
          
          <div className="mt-8 border-t border-white/5 pt-8">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Stay Impactful</h4>
            <p className="text-xs text-gray-500 mb-4">Get exclusive offers and print design tips directly in your inbox.</p>
            <form onSubmit={(e) => { e.preventDefault(); toast.success('Subscribed successfully!'); }} className="flex gap-2 max-w-sm">
              <input 
                type="email" 
                placeholder="email@company.com" 
                required
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-pink transition-colors flex-grow"
              />
              <button 
                type="submit"
                className="bg-brand-pink text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-white hover:text-brand-pink transition-all"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4">
            <li><Link href="/products" className="hover:text-brand-pink transition-colors">Shop Products</Link></li>
            <li><Link href="/services" className="hover:text-brand-pink transition-colors">Design Services</Link></li>
            <li><Link href="/pricing" className="hover:text-brand-pink transition-colors">Bulk Pricing</Link></li>
            <li><Link href="/about" className="hover:text-brand-pink transition-colors">Our Story</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Customer Support</h4>
          <ul className="space-y-4">
            <li><Link href="/contact" className="hover:text-brand-pink transition-colors">Contact Us</Link></li>
            <li><Link href="/track-order" className="hover:text-brand-pink transition-colors">Track Order</Link></li>
            <li><Link href="/shipping" className="hover:text-brand-pink transition-colors">Shipping Policy</Link></li>
            <li><Link href="/returns" className="hover:text-brand-pink transition-colors">Returns & Refunds</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Contact Info</h4>
          <ul className="space-y-4">
            <li className="flex items-start">
              <MapPin className="h-5 w-5 text-brand-pink mr-3 flex-shrink-0" />
              <span>123 Business Hub, Sector 62, Noida, UP 201301</span>
            </li>
            <li className="flex items-center">
              <Phone className="h-5 w-5 text-brand-pink mr-3 flex-shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center">
              <Mail className="h-5 w-5 text-brand-pink mr-3 flex-shrink-0" />
              <span>support@atozprint.in</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-500 mb-4 md:mb-0">
          © {new Date().getFullYear()} AtoZ Print – All Rights Reserved.
        </p>
        <div className="flex space-x-6 text-sm text-gray-500">
          <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
