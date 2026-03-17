"use client";

import React from 'react';
import { Truck } from 'lucide-react';

export default function TopBanner() {
  return (
    <div className="bg-brand-dark text-white py-2.5 px-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em]">
        <div className="flex items-center gap-3 animate-slide-right">
          <Truck className="h-3.5 w-3.5 text-brand-cyan" />
          <span>Free Express Shipping on Orders Above ₹4,999</span>
          <div className="hidden md:flex items-center gap-3 before:content-['|'] before:mx-3 before:opacity-30">
            <span>Special Diwali Offer: Extra 10% Off on Bulk Orders</span>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-brand-pink/10 via-transparent to-brand-cyan/10 pointer-events-none"></div>
    </div>
  );
}
