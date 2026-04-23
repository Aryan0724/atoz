"use client";

import React from 'react';
import { Ticket } from 'lucide-react';
import { toast } from 'sonner';

interface CouponCardProps {
  coupon: any;
}

export default function CouponCard({ coupon }: CouponCardProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(coupon.code);
    toast.success(`Code ${coupon.code} copied to clipboard!`);
  };

  return (
    <div className="relative p-8 rounded-[32px] bg-brand-dark text-white overflow-hidden group border border-white/5 shadow-2xl shadow-brand-dark/20">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
      
      <div className="relative z-10">
        <div className="text-[10px] font-black text-brand-cyan uppercase tracking-widest mb-2 italic">{coupon.description}</div>
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-4xl font-black italic tracking-tighter">
            {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
          </span>
          <span className="text-xs font-bold text-white/40 uppercase tracking-widest">OFF</span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group/code relative">
           <code className="text-lg font-black text-brand-pink tracking-[0.2em]">{coupon.code}</code>
           <button 
             onClick={copyToClipboard}
             className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
           >
             Copy
           </button>
        </div>
        
        {coupon.min_order_amount > 0 && (
          <p className="mt-4 text-[9px] font-bold text-white/30 uppercase tracking-widest italic">
            Valid on orders above ₹{coupon.min_order_amount}
          </p>
        )}
      </div>
    </div>
  );
}
