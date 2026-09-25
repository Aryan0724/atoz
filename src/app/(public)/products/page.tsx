import { Metadata } from 'next';
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { mockProducts } from '@/lib/data/mockProducts';
import ProductsContent from './ProductsContent';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Elite Catalog | A to Z Prints',
  description: 'Explore our curated collection of professional-grade customizable gear. From high-end apparel to luxury corporate gifting solutions.',
  openGraph: {
    title: 'Custom Product Catalog | Premium Printing',
    description: 'Bespoke custom printing for brands that demand perfection. High-quality materials and stunning detail.',
  }
};

export default async function ProductsPage() {
  const supabase = createClient();
  
  // Initial fetch on server side
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  // Merge Supabase products with mock products (so newly configured products like Bill Book appear seamlessly)
  const dbSlugs = new Set(((products || []) as any[]).map(p => p.slug));
  const finalProducts = [
    ...(products || []),
    ...mockProducts.filter(mp => !dbSlugs.has(mp.slug) && mp.is_active !== false)
  ];

  return (
    <Suspense fallback={
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <Loader2 className="h-12 w-12 text-brand-pink animate-spin" />
           <span className="text-xs font-black text-gray-400 uppercase tracking-widest italic animate-pulse">Initializing Gear...</span>
        </div>
      </div>
    }>
      <ProductsContent initialProducts={finalProducts} />
    </Suspense>
  );
}
