import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import CustomizeClient from './CustomizeClient';

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
