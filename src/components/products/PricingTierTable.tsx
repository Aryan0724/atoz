"use client";

import React from 'react';
import { TrendingDown, Info, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tier {
  min_quantity: number;
  price: number;
}

interface PricingTierTableProps {
  basePrice: number;
  tiers?: Tier[];
  currentQuantity: number;
}

export default function PricingTierTable({ basePrice, tiers, currentQuantity }: PricingTierTableProps) {
  // Default tiers if none provided (e.g., 5%, 10%, 15% off)
  const defaultTiers: Tier[] = [
    { min_quantity: 50, price: basePrice },
    { min_quantity: 100, price: Math.round(basePrice * 0.9) },
    { min_quantity: 250, price: Math.round(basePrice * 0.85) },
    { min_quantity: 500, price: Math.round(basePrice * 0.8) },
  ];

  const activeTiers = tiers || defaultTiers;

  // Find current price based on quantity
  const currentTierPrice = [...activeTiers].reverse().find(t => currentQuantity >= t.min_quantity)?.price || basePrice;

  return (
    <div className="bg-brand-lightGray/30 rounded-[32px] p-8 border border-gray-100 shadow-inner">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-sm font-black text-brand-dark uppercase tracking-widest flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-brand-pink" />
          Bulk Pricing Tiers
        </h4>
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <Info className="h-3 w-3" />
          GST Extra
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {activeTiers.map((tier, idx) => {
          const isSelected = currentQuantity >= tier.min_quantity && 
                             (idx === activeTiers.length - 1 || currentQuantity < activeTiers[idx + 1].min_quantity);
          
          return (
            <div 
              key={idx} 
              className={`relative p-5 rounded-3xl transition-all duration-500 border group flex flex-col justify-between min-h-[140px] ${
                isSelected 
                ? 'bg-brand-dark text-white border-brand-dark shadow-2xl shadow-brand-dark/20 -translate-y-1' 
                : 'bg-white text-brand-dark border-gray-100 hover:border-brand-pink/30 hover:shadow-xl hover:shadow-gray-100'
              }`}
            >
              <div>
                <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isSelected ? 'text-brand-cyan' : 'text-brand-pink'}`}>
                  {tier.min_quantity}+ Units
                </div>
                <div className="text-2xl font-black tracking-tighter mb-1">₹{tier.price}</div>
                <div className={`text-[10px] font-medium opacity-60 ${isSelected ? 'text-white' : 'text-gray-400'}`}>per unit</div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className={cn(
                  "w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  isSelected ? "bg-brand-pink text-white" : "bg-brand-dark text-white"
                )}>
                  Get Started
                </button>
              </div>
              
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-brand-cyan text-brand-dark text-[8px] font-black px-3 py-1 rounded-full ring-4 ring-white animate-pulse">
                  ACTIVE
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 text-xs font-bold text-gray-500">
        <div className="h-[1px] flex-1 bg-gray-100"></div>
        <span>Save up to {Math.round((1 - activeTiers[activeTiers.length-1].price / activeTiers[0].price) * 100)}% on Bulk</span>
        <div className="h-[1px] flex-1 bg-gray-100"></div>
      </div>
    </div>
  );
}
