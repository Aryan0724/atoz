import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function TopBanner() {
  const supabase = createClient();
  let bannerText = "Free Express Shipping on Corporate Orders Above ₹50,000";
  let isActive = true;
  let activeCoupon = null;

  try {
    const [settingsRes, couponRes] = await Promise.all([
      supabase.from('site_settings').select('config').eq('id', 'global').single(),
      supabase.from('coupons').select('code, discount_value, discount_type').eq('is_active', true).order('created_at', { ascending: false }).limit(1).single()
    ]);

    if ((settingsRes.data as any)?.config?.topBanner) {
      bannerText = (settingsRes.data as any).config.topBanner.text || bannerText;
      isActive = (settingsRes.data as any).config.topBanner.isActive !== false;
    }

    if (couponRes.data) {
      activeCoupon = couponRes.data;
    }
  } catch (err) {
    // Silent fail
  }

  if (!isActive) return null;

  return (
    <div className="bg-brand-dark text-white py-2.5 overflow-hidden border-b border-white/5 relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-pink/20 via-transparent to-brand-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-6 relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-pink animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
            {bannerText}
          </span>
        </div>
        
        {activeCoupon && (
          <>
            <div className="hidden md:block w-px h-3 bg-white/20" />
            <Link 
              href="/pricing" 
              className="hidden md:flex items-center gap-2 group/btn"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 group-hover/btn:text-white transition-colors">
                Use Code: <span className="text-brand-pink font-black italic">{activeCoupon.code}</span>
              </span>
              <ArrowRight className="w-3 h-3 text-brand-pink group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
