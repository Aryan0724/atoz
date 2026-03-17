"use client";

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Package, 
  ArrowRight, 
  ShoppingBag, 
  Truck,
  Mail,
  Receipt
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OrderSuccessPage() {
  // In a real app, we'd fetch the order ID from URL params or state
  const mockOrderNumber = `AZP-${Math.random().toString(36).toUpperCase().substring(2, 10)}`;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
       <div className="max-w-xl w-full">
          <div className="relative mb-12 flex justify-center">
             <div className="absolute inset-0 bg-brand-pink/20 rounded-full blur-[80px] scale-75 animate-pulse"></div>
             <div className="relative h-32 w-32 bg-brand-pink text-white rounded-[40px] flex items-center justify-center shadow-2xl shadow-pink-200">
                <CheckCircle2 className="h-16 w-16" />
             </div>
             
             {/* Floating elements */}
             <div className="absolute -top-4 -right-4 h-12 w-12 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center animate-bounce duration-700 delay-100">
                <Package className="h-6 w-6 text-brand-cyan" />
             </div>
             <div className="absolute -bottom-4 -left-4 h-12 w-12 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center animate-bounce duration-700">
                <Truck className="h-6 w-6 text-brand-pink" />
             </div>
          </div>

          <h1 className="text-5xl font-black text-brand-dark tracking-tighter mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Order <span className="text-brand-pink">Received!</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-10">Your customized prints are heading to production</p>

          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 space-y-8 mb-12 text-left relative overflow-hidden">
             <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Order Reference</label>
                <p className="text-2xl font-black text-brand-dark font-mono tracking-tighter">{mockOrderNumber}</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex gap-4">
                   <div className="h-10 w-10 bg-brand-lightGray rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-brand-pink" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Confirmation Email</p>
                      <p className="text-sm font-bold text-gray-600">Sent to your registered email address.</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="h-10 w-10 bg-brand-lightGray rounded-xl flex items-center justify-center shrink-0">
                      <Receipt className="h-5 w-5 text-brand-cyan" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Invoice Details</p>
                      <p className="text-sm font-bold text-gray-600">Available in your dashboard history.</p>
                   </div>
                </div>
             </div>

             <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Est. Delivery</p>
                   <p className="text-sm font-black text-brand-dark">7-10 Working Days</p>
                </div>
                <Link href="/dashboard" className="text-xs font-black text-brand-pink uppercase tracking-widest hover:underline flex items-center gap-2">
                   Track Order <ArrowRight className="h-3 w-3" />
                </Link>
             </div>

             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link 
               href="/products" 
               className="w-full sm:w-auto px-10 py-5 bg-brand-dark text-white rounded-full font-black text-sm hover:shadow-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
             >
                <ShoppingBag className="h-5 w-5" />
                Continue Shopping
             </Link>
             <Link 
               href="/dashboard" 
               className="w-full sm:w-auto px-10 py-5 bg-white text-brand-dark border border-gray-100 rounded-full font-black text-sm hover:bg-gray-50 transition-all"
             >
                Go to Dashboard
             </Link>
          </div>
       </div>
    </div>
  );
}
