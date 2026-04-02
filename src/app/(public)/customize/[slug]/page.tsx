import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import CustomizeClient from './CustomizeClient';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient();
  let cleanSlug = params.slug.trim();
  if (cleanSlug.endsWith('-')) cleanSlug = cleanSlug.slice(0, -1);

  const { data: productData } = await supabase
    .from('products')
    .select('name, description, images')
    .eq('slug', cleanSlug)
    .single();

  const product = productData as any;

  if (!product) return {};

  return {
    title: `Customize ${product.name}`,
    description: product.description || `Design and customize your own ${product.name} at AtoZ Prints.`,
    openGraph: {
      images: product.images && product.images.length > 0 ? [{ url: product.images[0] }] : [],
    },
    twitter: {
      card: "summary_large_image",
      images: product.images && product.images.length > 0 ? [product.images[0]] : [],
    }
  };
}

export default async function CustomizePage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  
  // Normalize slug: remove trailing hyphens or whitespace
  let cleanSlug = params.slug.trim();
  if (cleanSlug.endsWith('-')) {
    cleanSlug = cleanSlug.slice(0, -1);
  }

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', cleanSlug)
    .single();

  if (error || !product) {
    if (error) console.error('Supabase Product Fetch Error:', error);
    return notFound();
  }

  return <CustomizeClient product={product} />;
}
