"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { useCart } from '@/lib/store/useCart';
import { 
  Check, 
  ChevronRight, 
  ShoppingCart, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Plus,
  Minus,
  Loader2
} from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { mockProducts } from '@/lib/data/mockProducts';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/lib/supabase/types';
import { toast } from 'react-hot-toast';

export default function ProductDetailClient() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      
      // Fetch current product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (productError || !productData) {
        // Fallback to mock data by slug
        const mockProduct = mockProducts.find(p => p.slug === slug);
        if (mockProduct) {
          setProduct(mockProduct);
          setSelectedQuality(mockProduct.quality_levels?.[0] || 'Standard');
          setQuantity(mockProduct.moq || 1);
          
          const related = mockProducts
            .filter(p => p.category === mockProduct.category && p.slug !== slug)
            .slice(0, 4);
          setRelatedProducts(related);
        }
        setLoading(false);
        return;
      }

      setProduct(productData);
      setSelectedQuality(productData.quality_levels?.[0] || 'Standard');
      setQuantity(productData.moq || 1);

      // Fetch related products from Supabase
      const { data: relatedData } = await supabase
        .from('products')
        .select('*')
        .eq('category', productData.category)
        .neq('id', productData.id)
        .limit(4);

      // If no related products in Supabase, try mock data
      if (!relatedData || relatedData.length === 0) {
        const related = mockProducts
          .filter(p => p.category === productData.category && p.slug !== slug)
          .slice(0, 4);
        setRelatedProducts(related);
      } else {
        setRelatedProducts(relatedData);
      }
      setLoading(false);
    };

    fetchProductData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-brand-pink animate-spin" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Product Details...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedQuality}`,
      product: product,
      quantity: quantity,
      quality_level: selectedQuality,
      design_data: {},
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center space-x-2 text-sm font-medium text-gray-400">
          <Link href="/" className="hover:text-brand-pink">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/products" className="hover:text-brand-pink">Products</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-brand-dark">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Image Gallery */}
          <div className="relative">
            <div className="aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              {product.images?.[0] ? (
                <Image 
                  src={product.images[0]} 
                  alt={product.name} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium italic">
                  {product.name} Preview High Quality
                </div>
              )}
            </div>
            
            {/* Feature Badges */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 bg-brand-lightGray rounded-2xl">
                <Truck className="h-6 w-6 text-brand-dark mb-2" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-brand-lightGray rounded-2xl">
                <ShieldCheck className="h-6 w-6 text-brand-dark mb-2" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Quality Guard</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-brand-lightGray rounded-2xl">
                <RotateCcw className="h-6 w-6 text-brand-dark mb-2" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Bulk Returns</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 lg:mt-0">
            <div className="text-sm font-black text-brand-pink uppercase tracking-widest mb-4">
              {product.category}
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-brand-dark mb-6">
              {product.name}
            </h1>
            
            <div className="flex items-end gap-3 mb-8">
              <span className="text-sm text-gray-400 font-bold mb-1.5 uppercase tracking-tighter">Starting from</span>
              <span className="text-4xl font-black text-brand-dark tracking-tighter">₹{product.base_price}</span>
              <span className="text-gray-400 font-medium mb-1.5 text-sm">per unit</span>
            </div>

            <p className="text-lg text-gray-500 leading-relaxed mb-10 border-l-4 border-brand-pink/20 pl-6">
              {product.description}
            </p>

            {/* Quality Options */}
            <div className="mb-10">
              <label className="block text-sm font-bold text-brand-dark mb-4 uppercase tracking-wider">
                Select Quality Level
              </label>
              <div className="flex flex-wrap gap-3">
                {product.quality_levels?.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedQuality(level)}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                      selectedQuality === level
                        ? 'bg-brand-dark text-white ring-4 ring-brand-dark/10'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-dark'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-12">
              <label className="block text-sm font-bold text-brand-dark mb-4 uppercase tracking-wider">
                Order Quantity <span className="text-brand-pink ml-2"> (Min. {product.moq} Units)</span>
              </label>
              <div className="flex items-center gap-6">
                <div className="inline-flex items-center border-2 border-gray-100 rounded-2xl p-1.5">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(product.moq || 1, prev - 1))}
                    className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="h-5 w-5 text-brand-dark" />
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(product.moq || 1, parseInt(e.target.value) || (product.moq || 1)))}
                    className="w-20 text-center font-bold text-xl focus:outline-none bg-transparent"
                  />
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-5 w-5 text-brand-dark" />
                  </button>
                </div>
                <div className="text-sm font-bold text-gray-400">
                   Total Estimate: <span className="text-brand-dark text-lg ml-1">₹{quantity * (product.base_price || 0)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-3 px-8 py-5 bg-brand-pink text-white font-bold text-lg rounded-full hover:shadow-2xl hover:shadow-pink-200 transform hover:-translate-y-1 transition-all"
              >
                <ShoppingCart className="h-6 w-6" />
                Add to Cart
              </button>
              <Link 
                href={`/customize/${product.slug}`}
                className="flex items-center justify-center gap-3 px-8 py-5 bg-brand-dark text-white font-bold text-lg rounded-full hover:shadow-2xl hover:shadow-gray-200 transform hover:-translate-y-1 transition-all"
              >
                <Sparkles className="h-6 w-6 text-brand-cyan" />
                Start Designing
              </Link>
            </div>

            {/* Delivery Info */}
            <div className="mt-12 bg-pink-50/50 p-6 rounded-3xl border border-pink-100">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-brand-pink/10 rounded-xl">
                  <Check className="h-5 w-5 text-brand-pink" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark mb-1">Estimated Delivery: {product.delivery_days} Days</h4>
                  <p className="text-sm text-gray-500">Includes printing time, quality check, and shipping across India.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specs area */}
        <div className="mt-24">
          <h2 className="text-3xl font-extrabold text-brand-dark mb-12">Product Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-brand-pink rounded-full"></div>
                Customization Fields
              </h3>
              <ul className="space-y-4">
                {product.customization_fields?.map((field, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-600 font-medium">
                    <Check className="h-5 w-5 text-brand-pink" />
                    {field}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-brand-cyan rounded-full"></div>
                Packaging Options
              </h3>
              <ul className="space-y-4">
                {product.packaging_options?.map((opt, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-600 font-medium">
                    <div className="h-2 w-2 rounded-full bg-brand-cyan"></div>
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-extrabold text-brand-dark">You might also like</h2>
              <Link href="/products" className="text-brand-pink font-bold hover:underline">View Catalog</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
