import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import CustomizeClient from './CustomizeClient';
import { mockProducts } from '@/lib/data/mockProducts';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient();
  let cleanSlug = params.slug.trim();
  if (cleanSlug.endsWith('-')) cleanSlug = cleanSlug.slice(0, -1);

  const { data: productData } = await supabase
    .from('products')
    .select('name, description, images, slug')
    .eq('slug', cleanSlug)
    .single();

  const mockProduct = mockProducts.find(p => p.slug === cleanSlug || (cleanSlug === 'id-card-custom' && p.slug === 'id-card') || (cleanSlug === 'business-card-custom' && p.slug === 'business-card') || (cleanSlug === 'wedding-card-custom' && p.slug === 'wedding-card') || (cleanSlug === 'letter-head-custom' && p.slug === 'letter-head'));
  
  const product = mockProduct ? { ...(mockProduct as any), ...(productData as any) } : productData;

  if (!product) return {};

  const isTemplateForm = (product as any).design_mode === 'template_form' || 
                        ['id-card', 'letter-head', 'business-card', 'wedding-card', 'custom-calendar', 'corporate-notebook', 'diary-with-logo', 'custom-pen'].includes(product.slug);

  return {
    title: isTemplateForm ? `Fill Details for ${product.name}` : `Customize ${product.name}`,
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

  const { data: productData, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', cleanSlug)
    .single();

  const mockProduct = mockProducts.find(p => p.slug === cleanSlug || (cleanSlug === 'id-card-custom' && p.slug === 'id-card') || (cleanSlug === 'business-card-custom' && p.slug === 'business-card') || (cleanSlug === 'wedding-card-custom' && p.slug === 'wedding-card') || (cleanSlug === 'letter-head-custom' && p.slug === 'letter-head'));
  
  const product = mockProduct ? { ...(mockProduct as any), ...(productData as any) } : productData;

  if (error && !mockProduct) {
    if (error) console.error('Supabase Product Fetch Error:', error);
    return notFound();
  }

  return <CustomizeClient product={product} />;
}
