import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import HomePageClient from '@/components/home/HomePageClient';
import { mockProducts } from '@/lib/data/mockProducts';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AtoZ Prints – Custom Printing Services Across India',
  description: 'India’s trusted online printing partner offering T-shirts, mugs, business cards & more.',
  openGraph: {
    title: 'AtoZ Prints – Custom Printing Services Across India',
    description: 'India’s trusted online printing partner offering T-shirts, mugs, business cards & more.',
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop'],
  }
};

export const revalidate = 600; // Faster revalidation (10 mins) for CMS responsiveness

async function getSiteConfig() {
  const supabase = createClient();
  const { data } = await supabase.from('site_settings').select('config').eq('id', 'global').single();
  return (data as any)?.config || {};
}

async function getTopProducts() {
  const supabase = createClient();
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8);

  if (error || !products || products.length === 0) {
    return mockProducts.slice(0, 8);
  }
  return products;
}

async function getBlogs() {
  const supabase = createClient();
  const { data } = await supabase
    .from('cms_content')
    .select('*')
    .eq('type', 'Blog')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(3);
  return data || [];
}

export default async function HomePage() {
  // Parallel fetch for speed
  const [config, products, blogs] = await Promise.all([
    getSiteConfig(),
    getTopProducts(),
    getBlogs()
  ]);

  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-brand-base"><Loader2 className="w-12 h-12 animate-spin text-brand-gold" /></div>}>
      <HomePageClient products={products} config={config} blogs={blogs} />
    </Suspense>
  );
}
