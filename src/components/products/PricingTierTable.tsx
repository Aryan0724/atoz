"use client";

import React from 'react';
import { TrendingDown, Info, Check } from 'lucide-react';
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
  const defaultTiers: Tier[] = [
    { min_quantity: 50,  price: basePrice },
    { min_quantity: 100, price: Math.round(basePrice * 0.9) },
    { min_quantity: 250, price: Math.round(basePrice * 0.85) },
    { min_quantity: 500, price: Math.round(basePrice * 0.8) },
  ];

  const activeTiers = tiers || defaultTiers;
  const savingPct = Math.round((1 - activeTiers[activeTiers.length - 1].price / activeTiers[0].price) * 100);

  return (
    <div className="bg-gray-50/70 rounded-[28px] p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-xs font-black text-brand-dark uppercase tracking-widest flex items-center gap-2">
          <TrendingDown className="h-3.5 w-3.5 text-brand-pink" />
          Bulk Pricing Tiers
        </h4>
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
          <Info className="h-3 w-3" />
          GST Extra
        </div>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {activeTiers.map((tier, idx) => {
          const isActive = currentQuantity >= tier.min_quantity &&
            (idx === activeTiers.length - 1 || currentQuantity < activeTiers[idx + 1].min_quantity);
          const discountPct = idx > 0 ? Math.round((1 - tier.price / activeTiers[0].price) * 100) : 0;

          return (
            <div
              key={idx}
              className={cn(
                "relative rounded-[18px] p-4 border transition-all duration-300 flex flex-col gap-2",
                isActive
                  ? "bg-brand-dark text-white border-brand-dark shadow-lg shadow-brand-dark/20 -translate-y-1"
                  : "bg-white text-brand-dark border-gray-100 hover:border-brand-pink/30 hover:shadow-md"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-brand-cyan rounded-full flex items-center justify-center shadow-md">
                  <Check className="w-3 h-3 text-brand-dark" strokeWidth={3} />
                </div>
              )}

              {/* Quantity label */}
              <div className={cn(
                "text-[9px] font-black uppercase tracking-[0.15em]",
                isActive ? "text-brand-cyan" : "text-brand-pink"
              )}>
                {tier.min_quantity}+ units
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-0.5">
                <span className={cn("text-xs font-bold opacity-60", isActive ? "text-white" : "text-brand-dark")}>₹</span>
                <span className="text-2xl font-black tracking-tighter leading-none">{tier.price}</span>
              </div>

              {/* Per unit label */}
              <div className={cn("text-[8px] font-bold uppercase tracking-widest leading-tight", isActive ? "text-white/50" : "text-gray-400")}>
                per unit
              </div>

              {/* Discount badge */}
              {discountPct > 0 && (
                <div className={cn(
                  "text-[8px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full w-fit",
                  isActive ? "bg-brand-pink text-white" : "bg-brand-pink/10 text-brand-pink"
                )}>
                  Save {discountPct}%
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-center gap-3 text-[10px] font-bold text-gray-400">
        <div className="h-px flex-1 bg-gray-200" />
        <span>Save up to {savingPct}% on bulk orders</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
    </div>
  );
}
