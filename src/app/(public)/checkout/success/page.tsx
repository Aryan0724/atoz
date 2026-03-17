"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Package, Box, MapPin, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage() {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }, []);

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-pink"></div>
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-brand-pink/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-brand-cyan/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <div className="w-24 h-24 bg-green-50 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-green-100 animate-in zoom-in duration-700">
          <Check className="h-12 w-12 text-green-500" />
        </div>

        <h1 className="text-5xl lg:text-6xl font-black text-brand-dark mb-6 tracking-tight">
           Order <span className="text-brand-pink">Received!</span>
        </h1>
        
        <p className="text-xl text-gray-500 mb-12 max-w-lg mx-auto font-medium leading-relaxed">
          Thank you for choosing AtoZ Prints. Your custom designs are now being reviewed by our art team.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
           <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex flex-col items-center gap-4 group hover:bg-white hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-brand-pink group-hover:text-white transition-colors">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 text-center">Estimated Arrival</p>
                <p className="text-lg font-bold text-brand-dark">Mar 22 - Mar 25</p>
              </div>
           </div>
           <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex flex-col items-center gap-4 group hover:bg-white hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-brand-cyan group-hover:text-white transition-colors">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 text-center">What&apos;s Next?</p>
                <p className="text-lg font-bold text-brand-dark">Quality Assurance</p>
              </div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
           <Link 
            href="/products" 
            className="w-full sm:w-auto px-10 py-5 bg-brand-dark text-white font-bold rounded-full hover:shadow-2xl hover:shadow-gray-200 transition-all active:scale-95 group"
           >
             Continue Shopping
             <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
           </Link>
           <Link 
            href="/dashboard" 
            className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-gray-100 text-brand-dark font-bold rounded-full hover:bg-gray-50 transition-all active:scale-95"
           >
             Track My Order
           </Link>
        </div>

        <div className="mt-20 flex items-center justify-center gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          <div className="flex items-center gap-3">
             <div className="h-1 w-1 rounded-full bg-brand-pink"></div>
             Premium Print
          </div>
          <div className="flex items-center gap-3">
             <div className="h-1 w-1 rounded-full bg-brand-pink"></div>
             Eco-Packaging
          </div>
          <div className="flex items-center gap-3">
             <div className="h-1 w-1 rounded-full bg-brand-pink"></div>
             Express Ship
          </div>
        </div>
      </div>
    </div>
  );
}
