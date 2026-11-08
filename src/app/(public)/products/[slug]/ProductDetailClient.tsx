"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound, useRouter, useSearchParams } from 'next/navigation';
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
  RotateCw,
  Plus,
  Truck,
  ShoppingCart,
  X,
  Upload,
  PenTool,
  Star,
  User,
  Layout,
  Sparkles,
  Filter,
  Layers,
  Palette,
  ArrowRight
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
import { trackViewContent, trackAddToCart } from '@/lib/analytics/meta-pixel';
import { 
  getSubProductsForParent, 
  SubProductDesign, 
  getParentProductBySlug 
} from '@/lib/data/subProductsData';
import SubProductQuickModal from '@/components/products/SubProductQuickModal';
import SubProductCard from '@/components/products/SubProductCard';

export default function ProductDetailClient({ product: initialProduct }: { product: Product }) {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addItem } = useCart();

  const isVisitingCard = 
    initialProduct.slug?.includes('business-card') || 
    initialProduct.slug?.includes('visiting') || 
    initialProduct.name?.toLowerCase().includes('visiting card') || 
    initialProduct.name?.toLowerCase().includes('business card');

  const effectiveMoq = isVisitingCard ? Math.max(initialProduct.moq || 100, 100) : (initialProduct.moq || 1);
  const qtyStep = isVisitingCard ? 100 : 1;

  const searchParams = useSearchParams();
  const templateQueryParam = searchParams.get('template');
  
  // Available sub-products for this parent product
  const subProducts = useMemo(() => getSubProductsForParent(initialProduct.slug), [initialProduct.slug]);
  const parentProductInfo = useMemo(() => getParentProductBySlug(initialProduct.slug), [initialProduct.slug]);

  const [selectedProfessionFilter, setSelectedProfessionFilter] = useState('All');
  const [quickViewDesign, setQuickViewDesign] = useState<SubProductDesign | null>(null);
  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');

  const [product, setProduct] = useState<Product>(initialProduct);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState(initialProduct.quality_levels?.[0] || 'Standard');
  const [quantity, setQuantity] = useState(effectiveMoq);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const isTemplateForm = product.design_mode === 'template_form' || 
                        ['id-card', 'letter-head', 'business-card', 'wedding-card', 'custom-calendar', 'corporate-notebook', 'diary-with-logo', 'custom-pen'].some(s => product.slug?.includes(s));

  useEffect(() => {
    if (templateQueryParam !== null) {
      const idx = parseInt(templateQueryParam, 10);
      if (!isNaN(idx) && idx >= 0) {
        setSelectedTemplateIndex(idx);
      }
    }
  }, [templateQueryParam]);

  const currentSubProduct = useMemo(() => {
    if (subProducts.length === 0) return null;
    return subProducts[selectedTemplateIndex] || subProducts[0];
  }, [subProducts, selectedTemplateIndex]);

  const filteredSubProducts = useMemo(() => {
    if (selectedProfessionFilter === 'All') return subProducts;
    return subProducts.filter(p => p.profession.toLowerCase().includes(selectedProfessionFilter.toLowerCase()));
  }, [subProducts, selectedProfessionFilter]);

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
    
    // Meta Ads Tracking
    trackViewContent(initialProduct);
  }, [slug, initialProduct.category, initialProduct.id, initialProduct]);

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

  // Visiting card base price normalization:
  // E.g. If admin/catalog sets base_price = 440 (representing 100 cards), per-card rate is 4.40
  // If base_price is already unit rate (< 50, e.g. 4.40 or 4.99), use it directly
  const unitBasePrice = (isVisitingCard && (product.base_price || 0) >= 50)
    ? ((product.base_price || 0) / 100)
    : (product.base_price || 0);

  const rawQualityBonus = product.quality_prices?.[selectedQuality] || 0;
  const unitQualityBonus = (isVisitingCard && rawQualityBonus >= 50)
    ? (rawQualityBonus / 100)
    : rawQualityBonus;

  const currentUnitPrice = Number((unitBasePrice + unitQualityBonus).toFixed(2));
  const estimatedTotal = Math.round(quantity * currentUnitPrice);
  const displayStartingPrice = isVisitingCard 
    ? ((product.base_price || 0) >= 50 ? product.base_price : Math.round((product.base_price || 0) * 100))
    : product.base_price;

  const handleAddToCart = () => {
    const item = {
      id: `${product.id}-${selectedQuality}`,
      product: product,
      quantity: quantity,
      quality_level: selectedQuality,
      design_data: {},
      unitPrice: currentUnitPrice
    };
    
    addItem(item);
    
    // Meta Ads Tracking
    trackAddToCart(item);
    
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Image Gallery */}
          <div className="relative pt-6">
            <div className="aspect-[4/5] bg-gray-50 rounded-[40px] overflow-hidden shadow-sm border border-gray-100/50 p-8 sm:p-12 transition-all duration-500 relative flex items-center justify-center">
              {currentSubProduct ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image 
                    src={previewSide === 'back' && currentSubProduct.backImage ? currentSubProduct.backImage : currentSubProduct.frontImage} 
                    alt={currentSubProduct.name} 
                    fill 
                    className="object-contain p-2"
                    priority
                  />
                  {/* Side Switcher Badge on Image */}
                  {currentSubProduct.backImage && (
                    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                      <button
                        onClick={() => setPreviewSide(prev => prev === 'front' ? 'back' : 'front')}
                        className="px-3.5 py-2 bg-brand-darkBlue/90 backdrop-blur-md text-white text-[10px] font-sans font-bold uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 hover:bg-brand-blue transition-colors"
                      >
                        <RotateCw className="w-3.5 h-3.5 text-brand-gold" />
                        <span>View {previewSide === 'front' ? 'Back Side' : 'Front Side'}</span>
                      </button>
                    </div>
                  )}
                  {/* Active Design Tag */}
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 backdrop-blur-md text-brand-dark text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm border border-gray-100">
                    Template #{selectedTemplateIndex + 1}: {currentSubProduct.profession}
                  </div>
                </div>
              ) : product.images?.[selectedImageIndex] ? (
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

            {/* Thumbnail Gallery (fallback or additional images) */}
            {product.images && product.images.length > 1 && (
              <div className="mt-6 flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {product.images.map((image: string, index: number) => (
                  <button 
                    key={index}
                    onClick={() => {
                      setSelectedImageIndex(index);
                    }}
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
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-2xl border border-gray-100/50">
                <ShieldCheck className="h-5 w-5 text-brand-dark mb-2.5 opacity-40" />
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Quality Checked</span>
              </div>
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-2xl border border-gray-100/50">
                <RotateCcw className="h-5 w-5 text-brand-dark mb-2.5 opacity-40" />
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 lg:mt-0">
            <div className="text-xs font-sans font-bold text-brand-gold uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
              <span>{product.category}</span>
              <span className="h-px w-6 bg-brand-gold/40" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-brand-darkBlue mb-6 tracking-tight">
              {product.name}
            </h1>
            
            <div className="flex items-end gap-3 mb-8">
              <span className="text-xs font-sans text-slate-400 font-bold mb-1.5 uppercase tracking-wider">Starting from</span>
              <span className="text-4xl font-serif font-bold text-brand-darkBlue tracking-tight">₹{displayStartingPrice}</span>
              <span className="text-slate-500 font-sans font-medium mb-1.5 text-sm">
                {isVisitingCard ? `per 100 cards (₹${currentUnitPrice.toFixed(2)}/card)` : 'per unit'}
              </span>
            </div>

            <p className="text-base sm:text-lg text-slate-500 font-sans leading-relaxed mb-12 font-light border-l-2 border-brand-gold/40 pl-6">
              {product.description}
            </p>

            {/* Template Selection - Added for Dynamic Sub-Product Design Selection */}
            {(subProducts.length > 0 || (isTemplateForm && (product as any).color_variants?.length > 0)) && (
              <div className="mb-10 p-5 bg-gray-50/70 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-xs font-black text-brand-dark uppercase tracking-wider">
                      Choose Sub-Product / Design
                    </label>
                    {currentSubProduct && (
                      <span className="text-[11px] font-bold text-brand-pink truncate block mt-0.5">
                        {currentSubProduct.name}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-black text-brand-pink uppercase tracking-widest bg-brand-pink/10 px-2.5 py-1 rounded-md border border-brand-pink/20">
                    {(subProducts.length || (product as any).color_variants?.length)} Designs
                  </span>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {(subProducts.length > 0 ? subProducts : (product as any).color_variants).map((template: any, idx: number) => {
                    const isSelected = selectedTemplateIndex === idx;
                    const previewImg = template.frontImage || template.wireframe_images?.[0] || template.image_url;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedTemplateIndex(idx);
                          setPreviewSide('front');
                        }}
                        className={cn(
                          "relative w-28 shrink-0 rounded-xl overflow-hidden border-2 transition-all group/temp bg-white shadow-sm",
                          product.slug?.includes('id-card') || product.slug?.includes('wedding') ? "aspect-[2/3]" : "aspect-[3.5/2]",
                          isSelected 
                            ? "border-brand-pink ring-4 ring-brand-pink/15 shadow-md scale-102" 
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        {previewImg && (
                          <Image 
                            src={previewImg} 
                            alt={template.name}
                            fill
                            className="object-cover group-hover/temp:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className={cn(
                          "absolute inset-0 bg-brand-dark/40 flex items-center justify-center opacity-0 transition-opacity",
                          isSelected && "opacity-100 bg-brand-pink/20"
                        )}>
                          {isSelected && <Check className="w-5 h-5 text-white" />}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-1 bg-white/95 backdrop-blur-sm border-t border-gray-100">
                          <p className="text-[7.5px] font-black text-brand-dark uppercase truncate">{template.name}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {subProducts.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-gray-200/50 flex items-center justify-between">
                    <a 
                      href="#subproduct-designs"
                      className="text-[10px] font-black uppercase tracking-wider text-brand-pink hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Browse All {subProducts.length} Designs with Filter</span>
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Quality Options */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-bold text-brand-dark uppercase tracking-wider">
                  Select Quality Level
                </label>
                {product.category === 'Apparel' && (
                  <button 
                    onClick={() => setIsSizeChartOpen(true)}
                    className="text-xs font-sans font-bold text-brand-gold uppercase tracking-widest hover:underline flex items-center gap-1.5"
                  >
                    <div className="w-4 h-4 rounded-full border-2 border-brand-gold flex items-center justify-center text-[8px]">?</div>
                    Size Guide
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.quality_levels?.map((level: string) => {
                  const priceBonus = product.quality_prices?.[level] || 0;
                  return (
                    <button
                      key={level}
                      onClick={() => setSelectedQuality(level)}
                      className={`px-5 py-4 rounded-xl text-left transition-all relative overflow-hidden group/opt min-w-[120px] border-2 ${
                        selectedQuality === level
                          ? 'bg-brand-dark text-white border-brand-dark ring-4 ring-brand-dark/5 shadow-xl'
                          : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">{level}</span>
                        <span className="text-xs font-bold italic">
                          {priceBonus > 0 ? `+ ₹${priceBonus}` : 'Base Price'}
                        </span>
                      </div>
                      {selectedQuality === level && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-brand-gold rounded-full shadow-[0_0_8px_rgba(197,160,89,0.5)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-12">
              <label className="block text-[10px] font-sans font-bold text-slate-400 mb-5 uppercase tracking-[0.2em]">
                Quantity <span className="text-brand-gold italic ml-2"> (Min. {effectiveMoq} Units)</span>
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-8">
                <div className="inline-flex items-center border border-gray-100 rounded-xl p-1 bg-gray-50/50">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(effectiveMoq, prev - qtyStep))}
                    className="p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all text-brand-dark"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(effectiveMoq, parseInt(e.target.value) || effectiveMoq))}
                    className="w-16 text-center font-black text-xl focus:outline-none bg-transparent text-brand-dark italic"
                  />
                  <button 
                    onClick={() => setQuantity(prev => prev + qtyStep)}
                    className="p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all text-brand-dark"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-col">
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Unit Rate</div>
                  <div className="text-xl font-bold text-brand-dark italic">
                    ₹{currentUnitPrice} {isVisitingCard ? '/ card' : ''}
                  </div>
                </div>
                <div className="h-10 w-px bg-gray-100 hidden sm:block" />
                <div className="flex flex-col">
                  <div className="text-[9px] font-black text-brand-pink uppercase tracking-widest mb-1">Estimated Total</div>
                  <div className="text-3xl font-black text-brand-pink tracking-tighter italic">
                    ₹{estimatedTotal.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Tiers */}
            <div className="mb-12">
              <PricingTierTable 
                basePrice={currentUnitPrice} 
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
                {isTemplateForm ? 'Fill Details' : 'Customize Now'}
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

        {/* ─── PRINTASIA SUB-PRODUCT DESIGNS GALLERY SECTION ─── */}
        {subProducts.length > 0 && (
          <div id="subproduct-designs" className="mt-20 pt-16 border-t border-gray-100 scroll-mt-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-brand-pink/10 text-brand-pink text-[10px] font-black uppercase tracking-widest rounded-full border border-brand-pink/20 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 fill-current" />
                    PrintAsia Inspired Flow
                  </span>
                  <span className="text-xs font-bold text-gray-400">
                    {subProducts.length} Sub-Product Designs Available
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-brand-dark tracking-tight">
                  Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-cyan italic">Sub-Product Design</span>
                </h2>
                <p className="text-sm text-gray-500 font-medium mt-2 max-w-2xl leading-relaxed">
                  Select your profession or design preference below. Each sub-product features full front & back previews. Choose your design and proceed directly to personalize.
                </p>
              </div>

              {/* Upload Custom Design Option */}
              <button
                onClick={() => router.push(`/customize/${product.slug}?tab=uploads`)}
                className="px-5 py-3.5 bg-gray-100 hover:bg-brand-dark hover:text-white text-brand-dark rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 self-start md:self-auto shadow-sm"
              >
                <Upload className="w-4 h-4 text-brand-pink" />
                <span>Upload Custom Artwork</span>
              </button>
            </div>

            {/* Profession / Industry Filter Pills */}
            {parentProductInfo?.professions && parentProductInfo.professions.length > 1 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-brand-pink" />
                  <span className="text-xs font-black uppercase tracking-wider text-brand-dark">
                    Filter by Industry / Specialty
                  </span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
                  {parentProductInfo.professions.map((prof) => {
                    const isSelected = selectedProfessionFilter === prof;
                    const count = prof === 'All' 
                      ? subProducts.length 
                      : subProducts.filter(p => p.profession.toLowerCase().includes(prof.toLowerCase())).length;
                    return (
                      <button
                        key={prof}
                        onClick={() => setSelectedProfessionFilter(prof)}
                        className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-brand-dark text-white shadow-md ring-2 ring-brand-pink/30'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <span>{prof}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${
                          isSelected ? 'bg-brand-pink text-white' : 'bg-white text-gray-500'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSubProducts.map((design) => {
                const isCurrent = selectedTemplateIndex === design.templateIndex;
                return (
                  <SubProductCard
                    key={design.id}
                    design={design}
                    isSelected={isCurrent}
                    onQuickView={(d) => setQuickViewDesign(d)}
                    onSelectDesign={(d) => {
                      setSelectedTemplateIndex(d.templateIndex);
                      toast.success(`Selected "${d.name}"`);
                      setIsChoiceModalOpen(true);
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Product Specs area */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-brand-dark mb-12 tracking-tight">Product Details</h2>
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

        {/* Customer Intelligence (Reviews) */}
        <div className="mt-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-brand-pink/5 text-brand-pink font-black text-[9px] tracking-[0.3em] uppercase rounded-full mb-4 border border-brand-pink/10">
                <Star className="w-3 h-3 fill-current" />
                Verified Community Intelligence
              </div>
              <h2 className="text-4xl font-black text-brand-dark uppercase italic tracking-tighter leading-none">
                Customer <span className="text-brand-pink">Insights</span>
              </h2>
            </div>
            <div className="flex items-center gap-6">
               <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                     {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-brand-pink fill-current" />)}
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">4.9 Aggregate Score</p>
               </div>
               <button className="bg-brand-dark text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">
                  Write a Report
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Rahul S.", rating: 5, text: "The archival ink quality is insane. Colors are deep and exact. Perfect for our agency merch.", role: "Creative Director" },
              { name: "Ananya K.", rating: 5, text: "Fastest turnaround in India. We ordered 200 hoodies and they arrived in 3 days. Superb.", role: "Event Manager" },
              { name: "Vikram M.", rating: 4, text: "The online designer is very intuitive. Quality is top-notch. Highly recommended for startups.", role: "Founder" }
            ].map((review, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-[40px] p-10 border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-2xl transition-all group"
              >
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-dark shadow-sm group-hover:bg-brand-pink group-hover:text-white transition-all">
                       <User className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="text-[11px] font-black text-brand-dark uppercase tracking-widest">{review.name}</h4>
                       <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">{review.role}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-1 mb-6">
                    {[1,2,3,4,5].map(i => <Star key={i} className={cn("w-3 h-3 fill-current", i <= review.rating ? "text-brand-gold" : "text-gray-200")} />)}
                 </div>
                 <p className="text-sm text-gray-500 font-medium leading-relaxed italic uppercase tracking-wide">
                    &quot;{review.text}&quot;
                 </p>
                 <div className="mt-8 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-gold shadow-[0_0_8px_rgba(197,160,89,0.5)]" />
                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Verified Transaction</span>
                 </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-serif font-bold text-brand-darkBlue tracking-tight">You might also like</h2>
              <Link href="/products" className="text-brand-gold font-sans font-bold text-xs uppercase tracking-widest hover:underline">View Catalog</Link>
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
                   <div className="w-16 h-16 bg-brand-gold/15 rounded-3xl flex items-center justify-center text-brand-darkBlue mb-8">
                      <Zap className="w-8 h-8 text-brand-gold" />
                   </div>
                   <h2 className="text-3xl font-serif font-bold text-brand-darkBlue mb-4 tracking-tight">Start Designing</h2>
                   <p className="text-slate-400 font-sans font-bold uppercase text-[10px] tracking-widest mb-10">Choose how you want to start your design.</p>
                   
                   <div className="grid gap-4">
                      <button 
                        onClick={() => router.push(`/customize/${product.slug}?tab=uploads`)}
                        className="flex items-center gap-6 p-6 rounded-3xl bg-brand-base hover:bg-brand-darkBlue hover:text-white transition-all group text-left border border-brand-darkBlue/8"
                      >
                         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-gold shadow-sm group-hover:bg-white/20 group-hover:text-white transition-colors">
                            <Upload className="w-6 h-6 stroke-[2.2]" />
                         </div>
                         <div className="flex-1">
                            <h4 className="font-serif font-bold text-lg mb-1">Upload My Design</h4>
                            <p className="text-[10px] uppercase font-sans font-bold tracking-widest opacity-60">I have my own print-ready file</p>
                         </div>
                         <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-brand-gold" />
                      </button>

                      <button 
                        onClick={() => router.push(`/customize/${product.slug}?template=${selectedTemplateIndex}`)}
                        className="flex items-center gap-6 p-6 rounded-3xl bg-brand-base hover:bg-brand-darkBlue hover:text-white transition-all group text-left border border-brand-darkBlue/8"
                      >
                         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-gold shadow-sm group-hover:bg-white/20 group-hover:text-white transition-colors">
                            {isTemplateForm ? <Layout className="w-6 h-6 stroke-[2.2]" /> : <PenTool className="w-6 h-6 stroke-[2.2]" />}
                         </div>
                         <div className="flex-1">
                            <h4 className="font-bold text-lg mb-1 italic">{isTemplateForm ? 'Fill Detail Form' : 'Design Online'}</h4>
                            <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">
                              {isTemplateForm 
                                ? 'Enter details for professional layout' 
                                : 'Use our online design tool'}
                            </p>
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

      {/* Quick View Modal for Sub-Product Designs */}
      <SubProductQuickModal
        design={quickViewDesign}
        isOpen={Boolean(quickViewDesign)}
        onClose={() => setQuickViewDesign(null)}
      />
    </div>
  );
}
