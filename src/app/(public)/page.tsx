import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import HomePageClient from '@/components/home/HomePageClient';
import { mockProducts } from '@/lib/data/mockProducts';

export const metadata: Metadata = {
  title: 'A to Z Prints | Premium Custom Printing & Corporate Gifting',
  description: 'Design and order high-quality custom apparel, drinkware, and stationery. From startup swag to corporate gifting, we bring your vision to life with precision printing.',
  openGraph: {
    title: 'A to Z Prints | Professional Custom Gear',
    description: 'Expertly crafted custom apparel, accessories and stationery for brands that matter.',
    images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1200&auto=format&fit=crop'],
  }
};

export const revalidate = 3600; // Revalidate every hour

async function getTopProducts() {
  const supabase = createClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8);

  if (error || !products || products.length === 0) {
    console.error('Error fetching homepage products:', error);
    return mockProducts.slice(0, 8);
  }

  return products;
}

const defaultHero = {
  title: "Your Design.\nOur Impression.",
  subtitle: "Elevate your brand identity with high-fidelity custom merchandise. From boutique startups to Fortune 500s, we deliver retail-ready excellence.",
  image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop"
};

export default async function HomePage() {
  const supabase = createClient();
  const products = await getTopProducts();
  
  let heroConfig = defaultHero;
  try {
    const { data } = await supabase.from('site_settings').select('config').eq('id', 'global').single();
    if ((data as any)?.config?.hero) {
      heroConfig = (data as any).config.hero;
    }
  } catch (err) {
    console.warn("Hero CMS error (fallback applied):", err);
  }

  return <HomePageClient products={products} heroConfig={heroConfig} />;
}
