import { createClient } from '@/lib/supabase/server';
import PricingClient from './PricingClient';
import { mockPricingCategories } from '@/lib/data/mockProducts';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing | A to Z Prints',
  description: 'Transparent volume-based pricing for custom printing and corporate gifting. Get instant quotes for your bulk orders.',
};

export const revalidate = 600;

async function getPricingData() {
  const supabase = createClient();
  
  // Parallel fetch config, products, and active coupons
  const [configRes, productsRes, couponsRes] = await Promise.all([
    supabase.from('site_settings').select('config').eq('id', 'global').single(),
    supabase.from('products').select('*, categories(*)').order('created_at', { ascending: false }),
    supabase.from('coupons').select('*').eq('is_active', true).order('created_at', { ascending: false })
  ]);

  const config = (configRes.data as any)?.config || {};
  const products = productsRes.data || [];
  const coupons = couponsRes.data || [];

  // ... rest of the grouping logic ...
  const categoriesMap: Record<string, any> = {};
  
  products.forEach((p: any) => {
    const catName = p.categories?.name || 'Uncategorized';
    const catId = catName.toLowerCase().replace(/\s+/g, '-');
    if (!categoriesMap[catName]) {
      categoriesMap[catName] = {
        id: catId,
        name: catName,
        icon: catId,
        headers: config.pricing?.tiers?.map((t: any) => `${t.min}+`) || ['1+', '20+', '50+', '100+'],
        items: []
      };
    }

    const defaultTiers = [p.base_price, Math.round(p.base_price * 0.95), Math.round(p.base_price * 0.9), Math.round(p.base_price * 0.8)];
    const dynamicTiers = config.pricing?.tiers?.map((tier: any) => {
      const discounted = p.base_price * (1 - (tier.discount / 100));
      return Math.round(discounted);
    }) || defaultTiers;

    categoriesMap[catName].items.push({
      name: p.name,
      unit: 'Units',
      tiers: dynamicTiers
    });
  });

  const categories = Object.values(categoriesMap);
  return { 
    categories: categories.length > 0 ? categories : mockPricingCategories,
    coupons 
  };
}

export default async function PricingPage() {
  const { categories, coupons } = await getPricingData();

  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white"><Loader2 className="w-12 h-12 animate-spin text-brand-pink" /></div>}>
      <PricingClient initialCategories={categories} initialCoupons={coupons} />
    </Suspense>
  );
}
