import { Metadata, ResolvingMetadata } from 'next';
import { supabase } from '@/lib/supabase/client';
import ProductDetailClient from './ProductDetailClient';
import { mockProducts } from '@/lib/data/mockProducts';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  let product = null;

  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('slug', params.slug)
      .single();
    product = data;
  } catch (e) {
    console.warn('Metadata fetch failed, falling back to mock data:', e);
  }

  if (!product) {
    product = mockProducts.find(p => p.slug === params.slug);
  }

  if (!product) return {
    title: 'Product Not Found | A to Z Prints'
  };

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${product.name} | A to Z Prints`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Premium Custom Printing`,
      description: product.description,
      images: product.images?.[0] ? [product.images[0], ...previousImages] : previousImages,
      url: `https://atozprints.com/products/${params.slug}`,
      siteName: 'A to Z Prints',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [product.images[0]] : [],
    }
  };
}

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
