"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound, useRouter } from 'next/navigation';
import { useCart } from '@/lib/store/useCart';
import { 
  Check, 
  ChevronRight, 
  Minus,
  Loader2,
  Calendar,
  Zap,
  Info,
  ShieldCheck,
  RotateCcw,
  Plus,
  Truck,
  ShoppingCart,
  X,
  Upload,
  PenTool
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/products/ProductCard';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SizeChart from '@/components/products/SizeChart';
import PricingTierTable from '@/components/products/PricingTierTable';
import { mockProducts } from '@/lib/data/mockProducts';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/lib/supabase/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Button from '@/components/common/Button';

export default function ProductDetailClient({ product: initialProduct }: { product: Product }) {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product>(initialProduct);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState(initialProduct.quality_levels?.[0] || 'Standard');
  const [quantity, setQuantity] = useState(initialProduct.moq || 1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        // 1. Fetch curated recommendations first
        const { data: curatedIds } = await supabase
          .from('product_recommendations')
          .select('recommended_product_id, sort_order')
          .eq('product_id', initialProduct.id)
          .order('sort_order', { ascending: true });

        let curatedProducts: Product[] = [];
        if (curatedIds && curatedIds.length > 0) {
          const { data: products } = await supabase
            .from('products')
            .select('*')
            .in('id', curatedIds.map(r => r.recommended_product_id));
          
          if (products) {
            // Maintain the manual sort order
            curatedProducts = curatedIds
              .map(r => products.find(p => p.id === r.recommended_product_id))
              .filter(p => !!p) as Product[];
          }
        }

        // 2. Fallback to category logic if less than 4
        let finalRelated = [...curatedProducts];
        if (finalRelated.length < 4) {
          const { data: categoryData } = await supabase
            .from('products')
            .select('*')
            .eq('category', initialProduct.category)
            .neq('id', initialProduct.id)
            .not('id', 'in', `(${finalRelated.map(p => p.id).join(',') || '00000000-0000-0000-0000-000000000000'})`)
            .limit(4 - finalRelated.length);
          
          if (categoryData) {
            finalRelated = [...finalRelated, ...categoryData];
          }
        }

        // 3. Last fallback to mock data if still empty (for dev/first-migration)
        if (finalRelated.length === 0) {
          const related = mockProducts
            .filter(p => p.category === initialProduct.category && p.slug !== slug)
            .slice(0, 4);
          setRelatedProducts(related as any);
        } else {
          setRelatedProducts(finalRelated);
        }
      } catch (err) {
        console.error("Failed to fetch related products:", err);
      }
    };

    fetchRelatedData();
  }, [slug, initialProduct.category, initialProduct.id]);

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
        <Breadcrumbs 
          items={[
            { label: 'Products', href: '/products' }, 
            { label: product.name }
          ]} 
          className="mb-0"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Image Gallery */}
          <div className="relative">
            <div className="aspect-[4/5] bg-gray-50 rounded-[40px] overflow-hidden shadow-sm border border-gray-100/50 p-12 transition-all duration-500">
              {product.images?.[selectedImageIndex] ? (
                <Image 
                  src={product.images[selectedImageIndex]} 
                  alt={product.name} 
                  fill 
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium italic">
                  {product.name} Preview High Quality
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="mt-6 flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {product.images.map((image: string, index: number) => (
                  <button 
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all p-2 bg-gray-50",
                      selectedImageIndex === index ? "border-brand-pink shadow-md" : "border-transparent hover:border-gray-200"
                    )}
                  >
                    <Image 
                      src={image} 
                      alt={`${product.name} ${index + 1}`} 
                      fill 
                      className="object-contain" 
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Feature Badges */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-2xl border border-gray-100/50">
                <Truck className="h-5 w-5 text-brand-dark mb-2.5 opacity-40" />
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Express Logistics</span>
              </div>
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-2xl border border-gray-100/50">
                <ShieldCheck className="h-5 w-5 text-brand-dark mb-2.5 opacity-40" />
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Quality Audited</span>
              </div>
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-2xl border border-gray-100/50">
                <RotateCcw className="h-5 w-5 text-brand-dark mb-2.5 opacity-40" />
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Batch Returns</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 lg:mt-0">
            <div className="text-sm font-bold text-brand-pink uppercase tracking-widest mb-4">
              {product.category}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-dark mb-6 tracking-tight">
              {product.name}
            </h1>
            
            <div className="flex items-end gap-3 mb-8">
              <span className="text-sm text-gray-400 font-bold mb-1.5 uppercase tracking-tight">Starting from</span>
              <span className="text-4xl font-bold text-brand-dark tracking-tighter">₹{product.base_price}</span>
              <span className="text-gray-400 font-medium mb-1.5 text-sm">per unit</span>
            </div>

            <p className="text-lg text-gray-500 leading-relaxed mb-12 font-medium border-l-2 border-brand-pink/30 pl-8">
              {product.description}
            </p>

            {/* Quality Options */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-bold text-brand-dark uppercase tracking-wider">
                  Select Quality Level
                </label>
                {product.category === 'Apparel' && (
                  <button 
                    onClick={() => setIsSizeChartOpen(true)}
                    className="text-xs font-bold text-brand-pink uppercase tracking-widest hover:underline flex items-center gap-1.5"
                  >
                    <div className="w-4 h-4 rounded-full border-2 border-brand-pink flex items-center justify-center text-[8px]">?</div>
                    Size Guide
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {product.quality_levels?.map((level: string) => {
                  const priceBonus = product.quality_prices?.[level] || 0;
                  return (
                    <button
                      key={level}
                      onClick={() => setSelectedQuality(level)}
                      className={`px-5 py-4 rounded-xl text-left transition-all relative overflow-hidden group/opt min-w-[140px] border-2 ${
                        selectedQuality === level
                          ? 'bg-brand-dark text-white border-brand-dark ring-4 ring-brand-dark/5'
                          : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">{level}</span>
                        <span className="text-xs font-bold italic">
                          {priceBonus > 0 ? `+ ₹${priceBonus}` : 'Base Price'}
                        </span>
                      </div>
                      {selectedQuality === level && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-brand-pink rounded-full shadow-[0_0_8px_rgba(233,30,99,0.5)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-12">
              <label className="block text-[10px] font-black text-gray-400 mb-5 uppercase tracking-widest">
                Unit Volume <span className="text-brand-pink italic ml-2"> (Min. {product.moq} Units)</span>
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-8">
                <div className="inline-flex items-center border border-gray-100 rounded-xl p-1 bg-gray-50/50">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(product.moq || 1, prev - 1))}
                    className="p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all text-brand-dark"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(product.moq || 1, parseInt(e.target.value) || (product.moq || 1)))}
                    className="w-16 text-center font-black text-xl focus:outline-none bg-transparent text-brand-dark italic"
                  />
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all text-brand-dark"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-col">
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Unit Rate</div>
                  <div className="text-xl font-bold text-brand-dark italic">
                    ₹{product.base_price + (product.quality_prices?.[selectedQuality] || 0)}
                  </div>
                </div>
                <div className="h-10 w-px bg-gray-100 hidden sm:block" />
                <div className="flex flex-col">
                  <div className="text-[9px] font-black text-brand-pink uppercase tracking-widest mb-1">Estimated Total</div>
                  <div className="text-3xl font-black text-brand-pink tracking-tighter italic">
                    ₹{(quantity * (product.base_price + (product.quality_prices?.[selectedQuality] || 0))).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Tiers */}
            <div className="mb-12">
              <PricingTierTable 
                basePrice={product.base_price + (product.quality_prices?.[selectedQuality] || 0)} 
                currentQuantity={quantity}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Button 
                onClick={() => setIsChoiceModalOpen(true)}
                variant="primary"
                size="lg"
                className="w-full flex items-center justify-center gap-3 py-6 rounded-xl"
                leftIcon={<Zap className="h-4 w-4 text-brand-pink" />}
              >
                Configure Project
              </Button>
              <Button 
                onClick={handleAddToCart}
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center gap-3 py-6 rounded-xl border-gray-200 text-gray-500 hover:border-brand-dark hover:text-brand-dark"
                leftIcon={<ShoppingCart className="h-4 w-4 opacity-50" />}
              >
                Add to Cart
              </Button>
            </div>

            {/* Delivery Info */}
            <div className="mt-12 bg-gray-50/50 border border-gray-100 p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Truck className="w-16 h-16 text-brand-dark" />
              </div>
              <div className="relative z-10 flex items-start gap-5">
                <div className="p-3 bg-white rounded-xl shadow-soft border border-gray-100 text-brand-pink">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark text-lg mb-1 tracking-tight">
                    Estimated Delivery: {new Date(Date.now() + (parseInt(product.delivery_days?.toString() || '7') || 7) * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
                  </h4>
                  <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest">
                    Standard production & fulfillment lead time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specs area */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-brand-dark mb-12 tracking-tight">Product Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-brand-pink rounded-full"></div>
                Customization Fields
              </h3>
              <ul className="space-y-4">
                {product.customization_fields?.map((field: string, idx: number) => (
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
                {product.packaging_options?.map((opt: string, idx: number) => (
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
              <h2 className="text-3xl font-bold text-brand-dark tracking-tight">You might also like</h2>
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

      <SizeChart 
        isOpen={isSizeChartOpen} 
        onClose={() => setIsSizeChartOpen(false)} 
        category={product.category || 'Product'}
      />

      {/* Design Choice Modal */}
      <AnimatePresence>
        {isChoiceModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsChoiceModalOpen(false)}
               className="absolute inset-0 bg-brand-dark/20 backdrop-blur-md"
             />
             <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden"
             >
                <button 
                  onClick={() => setIsChoiceModalOpen(false)}
                  className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>

                <div className="p-10 pt-12">
                   <div className="w-16 h-16 bg-brand-pink/10 rounded-3xl flex items-center justify-center text-brand-pink mb-8">
                      <Zap className="w-8 h-8" />
                   </div>
                   <h2 className="text-3xl font-bold text-brand-dark mb-4 tracking-tight">Setup Your Project</h2>
                   <p className="text-gray-500 font-semibold uppercase text-[10px] tracking-widest mb-10 opacity-70">Choose how you want to initiate your customization process.</p>
                   
                   <div className="grid gap-4">
                      <button 
                        onClick={() => router.push(`/customize/${product.slug}?tab=uploads`)}
                        className="flex items-center gap-6 p-6 rounded-3xl bg-gray-50 hover:bg-brand-pink hover:text-white transition-all group text-left border border-gray-100"
                      >
                         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-pink shadow-sm group-hover:bg-white/20 group-hover:text-white transition-colors">
                            <Upload className="w-6 h-6" />
                         </div>
                         <div className="flex-1">
                            <h4 className="font-bold text-lg mb-1">Import & Edit</h4>
                            <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Upload your existing design asset</p>
                         </div>
                         <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </button>

                      <button 
                        onClick={() => router.push(`/customize/${product.slug}`)}
                        className="flex items-center gap-6 p-6 rounded-3xl bg-gray-50 hover:bg-brand-dark hover:text-white transition-all group text-left border border-gray-100"
                      >
                         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-cyan shadow-sm group-hover:bg-white/20 group-hover:text-white transition-colors">
                            <PenTool className="w-6 h-6" />
                         </div>
                         <div className="flex-1">
                            <h4 className="font-bold text-lg mb-1">Make from Scratch</h4>
                            <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Start a new blank design project</p>
                         </div>
                         <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </button>
                   </div>
                </div>

                <div className="p-6 bg-gray-50 text-center border-t border-gray-100">
                   <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">AtoZ Prints Design Studio v2.0</p>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
