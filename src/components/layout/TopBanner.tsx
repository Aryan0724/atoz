import React from 'react';
import { createClient } from '@/lib/supabase/server';

export default async function TopBanner() {
  const supabase = createClient();
  let bannerText = "Free Express Shipping on Corporate Orders Above ₹50,000 | Limited Time Offer";
  let isActive = true;

  try {
    const { data } = await supabase.from('site_settings').select('config').eq('id', 'global').single();
    if ((data as any)?.config?.topBanner) {
      bannerText = (data as any).config.topBanner.text || bannerText;
      isActive = (data as any).config.topBanner.isActive !== false;
    }
  } catch (err) {
    // Silent fail to defaults
  }

  if (!isActive) return null;

  return (
    <div className="bg-secondary text-white py-2 text-center text-[10px] sm:text-xs font-bold tracking-widest uppercase px-4 z-[60] relative">
      {bannerText}
    </div>
  );
}
