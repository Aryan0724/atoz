import { Metadata, ResolvingMetadata } from 'next';
import { supabase } from '@/lib/supabase/client';
import ProductDetailClient from './ProductDetailClient';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .single();

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
