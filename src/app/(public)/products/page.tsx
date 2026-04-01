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

  // Fallback to mock products if none found in Supabase
  const finalProducts = (error || !products || products.length === 0) 
    ? mockProducts 
    : products;

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
