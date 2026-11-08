"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionHeading from '@/components/common/SectionHeading';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ProductCard from '@/components/products/ProductCard';
import SubProductsBrowser from '@/components/products/SubProductsBrowser';
import PrintAsiaCategoryGrid from '@/components/products/PrintAsiaCategoryGrid';
import { 
  Search, 
  ChevronDown, 
  Filter, 
  X, 
  Sparkles, 
  LayoutGrid, 
  Shirt, 
  Coffee, 
  PenTool, 
  Star, 
  Briefcase, 
  Tag, 
  Layers, 
  ArrowRight,
  Palette,
  CheckCircle2,
  SlidersHorizontal,
  Grid3X3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/supabase/types';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import TrustBadges from '@/components/common/TrustBadges';
import { 
  PARENT_PRODUCTS, 
  getParentProductBySlug,
  PrintAsiaCategoryItem,
  PRINTASIA_CATEGORIES 
} from '@/lib/data/subProductsData';

const categories = ['All', 'Apparel', 'Drinkware', 'Stationery', 'Lifestyle', 'Corporate Gifting'];
const sortOptions = [
  { label: 'Featured Selection', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ProductsContent({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const hasSpecificProduct = Boolean(searchParams.get('product') || searchParams.get('industry'));
  const rawView = searchParams.get('view');
  const initialView = rawView ? rawView : hasSpecificProduct ? 'designs' : 'categories';
  const initialProductSlug = searchParams.get('product') || 'business-card-custom';
  const initialIndustry = searchParams.get('industry') || 'All';
  
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeViewMode, setActiveViewMode] = useState<'categories' | 'designs' | 'catalog'>(
    initialView === 'catalog' ? 'catalog' : initialView === 'designs' ? 'designs' : 'categories'
  );
  const [selectedParentSlug, setSelectedParentSlug] = useState<string>(initialProductSlug);
  const [selectedIndustry, setSelectedIndustry] = useState<string>(initialIndustry);
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState<string | undefined>(
    searchParams.get('industry') || undefined
  );
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('featured');
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Sync with URL search params
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
    const view = searchParams.get('view');
    const prod = searchParams.get('product');
    const ind = searchParams.get('industry');

    if (prod) setSelectedParentSlug(prod);
    if (ind) {
      setSelectedIndustry(ind);
      setSelectedCategoryTitle(ind);
    }

    if (view === 'catalog') {
      setActiveViewMode('catalog');
    } else if (view === 'designs' || prod || ind) {
      setActiveViewMode('designs');
    } else if (view === 'categories') {
      setActiveViewMode('categories');
    }
  }, [searchParams]);

  const getCategoryCount = (category: string) => {
    if (category === 'All') return products.length;
    return products.filter(p => p.category === category).length;
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        (p.description?.toLowerCase().includes(query) ?? false)
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.base_price || 0) - (b.base_price || 0));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.base_price || 0) - (a.base_price || 0));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleSelectCategory = (cat: PrintAsiaCategoryItem) => {
    setSelectedParentSlug(cat.parentProductSlug);
    setSelectedIndustry(cat.professionFilter || 'All');
    setSelectedCategoryTitle(cat.title);
    setActiveViewMode('designs');

    const params = new URLSearchParams(window.location.search);
    params.set('view', 'designs');
    params.set('product', cat.parentProductSlug);
    if (cat.professionFilter) {
      params.set('industry', cat.professionFilter);
    } else {
      params.delete('industry');
    }
    router.replace(`/products?${params.toString()}`, { scroll: false });
  };

  const handleBackToCategories = () => {
    setActiveViewMode('categories');
    setSelectedIndustry('All');
    setSelectedCategoryTitle(undefined);

    const params = new URLSearchParams(window.location.search);
    params.set('view', 'categories');
    params.delete('product');
    params.delete('industry');
    router.replace(`/products?${params.toString()}`, { scroll: false });
  };

  const handleSwitchToProductDesigns = (productSlug: string) => {
    setActiveViewMode('designs');
    setSelectedParentSlug(productSlug);
    setSelectedIndustry('All');
    setSelectedCategoryTitle(undefined);
    const params = new URLSearchParams(window.location.search);
    params.set('view', 'designs');
    params.set('product', productSlug);
    params.delete('industry');
    router.replace(`/products?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-brand-base min-h-screen pb-24 overflow-x-hidden pt-32 relative font-sans">
      {/* Decorative ambient lighting matching Homepage / About */}
      <div className="absolute top-[8%] left-[5%] w-80 h-80 bg-brand-gold/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[18%] right-[5%] w-96 h-96 bg-brand-blue/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Breadcrumbs 
          items={
            activeViewMode === 'designs' && selectedCategoryTitle
              ? [{ label: 'Catalog', href: '/products?view=categories' }, { label: selectedCategoryTitle }]
              : [{ label: 'Catalog' }]
          } 
        />

        {/* ─── SINGLE AUTHORITATIVE EDITORIAL HERO SECTION ─── */}
        <div className="mt-8 mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-brand-darkBlue/10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-brand-gold" />
              <span className="text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-brand-gold">
                Bespoke Print Catalogue • Est. 2015
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-brand-darkBlue tracking-tight leading-tight">
              Products & <span className="italic text-brand-gold font-normal">Sub-Product Designs.</span>
            </h1>

            <p className="text-slate-500 font-sans text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
              Select any profession or product line below to explore ready-to-print designs, personalize your details online, and order with door delivery across India.
            </p>
          </div>

          {/* View Mode Toggle Pill Buttons */}
          <div className="inline-flex p-1.5 bg-white/90 border border-brand-darkBlue/10 rounded-2xl shadow-sm backdrop-blur-md shrink-0 self-start lg:self-auto gap-1">
            <button
              onClick={() => {
                setActiveViewMode('categories');
                const p = new URLSearchParams(window.location.search);
                p.set('view', 'categories');
                router.replace(`/products?${p.toString()}`, { scroll: false });
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition-all ${
                activeViewMode === 'categories'
                  ? 'bg-brand-darkBlue text-white shadow-md'
                  : 'text-slate-600 hover:text-brand-darkBlue hover:bg-black/5'
              }`}
            >
              <Grid3X3 className={`w-4 h-4 ${activeViewMode === 'categories' ? 'text-brand-gold' : 'text-slate-400'}`} />
              <span>Product Categories</span>
            </button>

            <button
              onClick={() => {
                setActiveViewMode('designs');
                const p = new URLSearchParams(window.location.search);
                p.set('view', 'designs');
                router.replace(`/products?${p.toString()}`, { scroll: false });
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition-all ${
                activeViewMode === 'designs'
                  ? 'bg-brand-darkBlue text-white shadow-md'
                  : 'text-slate-600 hover:text-brand-darkBlue hover:bg-black/5'
              }`}
            >
              <Palette className={`w-4 h-4 ${activeViewMode === 'designs' ? 'text-brand-gold' : 'text-slate-400'}`} />
              <span>Sub-Product Designs</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-sans font-bold ${
                activeViewMode === 'designs' ? 'bg-brand-gold text-brand-darkBlue' : 'bg-brand-base text-slate-500'
              }`}>
                120+
              </span>
            </button>

            <button
              onClick={() => {
                setActiveViewMode('catalog');
                const p = new URLSearchParams(window.location.search);
                p.set('view', 'catalog');
                router.replace(`/products?${p.toString()}`, { scroll: false });
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition-all ${
                activeViewMode === 'catalog'
                  ? 'bg-brand-darkBlue text-white shadow-md'
                  : 'text-slate-600 hover:text-brand-darkBlue hover:bg-black/5'
              }`}
            >
              <LayoutGrid className={`w-4 h-4 ${activeViewMode === 'catalog' ? 'text-brand-gold' : 'text-slate-400'}`} />
              <span>All Products Overview</span>
            </button>
          </div>
        </div>

        {/* ─── CONDITIONAL VIEW 1: PRODUCT CATEGORIES GRID ─── */}
        {activeViewMode === 'categories' ? (
          <div>
            <PrintAsiaCategoryGrid
              onSelectCategory={handleSelectCategory}
              selectedCategoryId={selectedCategoryTitle?.toLowerCase()}
            />

            {/* Quick Teaser: Featured Sub-Product Designs Gallery */}
            <div className="mt-20 pt-14 border-t border-brand-darkBlue/10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-px w-6 bg-brand-gold" />
                    <span className="text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-brand-gold">
                      Ready-To-Print Templates
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-brand-darkBlue tracking-tight">
                    Trending Sub-Product <span className="italic text-brand-gold font-normal">Designs.</span>
                  </h3>
                  <p className="text-slate-500 font-sans text-xs sm:text-sm mt-1.5">
                    Choose any template below to customize online or upload your print files.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveViewMode('designs');
                    const p = new URLSearchParams(window.location.search);
                    p.set('view', 'designs');
                    router.replace(`/products?${p.toString()}`, { scroll: false });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-darkBlue hover:bg-brand-blue text-white rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-colors shadow-md self-start sm:self-auto"
                >
                  <span>Explore All 120+ Designs</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-gold" />
                </button>
              </div>

              <SubProductsBrowser
                initialParentSlug={selectedParentSlug}
                initialProfession={selectedIndustry}
                initialCategoryTitle={selectedCategoryTitle}
                showAllCategoriesTabs={true}
              />
            </div>
          </div>
        ) : activeViewMode === 'designs' ? (
          /* ─── CONDITIONAL VIEW 2: SUB-PRODUCTS DESIGNS GALLERY ─── */
          <div>
            <SubProductsBrowser 
              initialParentSlug={selectedParentSlug}
              initialProfession={selectedIndustry}
              initialCategoryTitle={selectedCategoryTitle}
              showAllCategoriesTabs={true}
              onBackToCategories={handleBackToCategories}
            />
          </div>
        ) : (
          /* ─── CONDITIONAL VIEW 3: ALL PRODUCTS CATALOG OVERVIEW ─── */
          <div>
            {/* ACTIVE DISCOUNTS BANNER */}
            <div className="relative overflow-hidden bg-brand-darkBlue text-white rounded-[32px] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 group">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/15 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-blue/20 blur-[100px] rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left w-full">
                <div className="w-16 h-16 bg-brand-gold text-brand-darkBlue rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-gold/20 rotate-3 group-hover:-rotate-3 transition-transform">
                  <Tag className="h-8 w-8 stroke-[2.5]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                    <span className="px-3.5 py-1 bg-white/10 text-brand-gold text-[10px] font-sans font-bold uppercase tracking-[0.25em] rounded-full border border-brand-gold/30">Active Tiered Savings</span>
                    <span className="px-3.5 py-1 bg-white/10 text-slate-300 text-[10px] font-sans font-bold uppercase tracking-[0.25em] rounded-full border border-white/15">Bulk Invoices</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                    Unlock <span className="italic text-brand-gold font-normal">Volume Discounts</span> automatically.
                  </h2>
                  <p className="text-slate-300 font-sans font-light mt-3 max-w-xl text-sm md:text-base leading-relaxed">
                    Whether you&apos;re stocking up on luxury visiting cards, corporate letterheads, or branded apparel, our smart cart automatically applies institutional discounts as your quantity increases.
                  </p>
                </div>
              </div>
              
              <div className="relative z-10 shrink-0 w-full md:w-auto">
                 <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                       <p className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-widest mb-1">Order 50+</p>
                       <p className="text-2xl font-serif font-bold text-white italic">15% OFF</p>
                    </div>
                    <div>
                       <p className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-widest mb-1">Order 200+</p>
                       <p className="text-2xl font-serif font-bold text-brand-gold italic">30% OFF</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="mt-14 flex flex-col lg:flex-row gap-12">
              {/* Desktop Filter Sidebar */}
              <aside className="hidden lg:block w-64 shrink-0 sticky top-36 h-fit">
                <div className="flex items-center gap-3 mb-8">
                  <Filter className="w-4 h-4 text-brand-gold" />
                  <h2 className="text-lg font-serif font-bold text-brand-darkBlue tracking-tight uppercase">Refine Catalogue</h2>
                </div>

                <div className="space-y-8">
                  {/* Search Within Categories */}
                  <div>
                    <h3 className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-[0.25em] mb-3">Search Products</h3>
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search product lines..."
                        aria-label="Filter products by name or description"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-darkBlue/10 rounded-xl text-xs font-sans font-medium text-brand-darkBlue placeholder-slate-400 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div>
                    <h3 className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-[0.25em] mb-3">Department</h3>
                    <div className="space-y-1">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-sans font-semibold transition-all ${
                            selectedCategory === category
                              ? 'bg-brand-darkBlue text-white shadow-sm'
                              : 'text-slate-600 hover:text-brand-darkBlue hover:bg-white'
                          }`}
                        >
                          <span>{category}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            selectedCategory === category ? 'bg-brand-gold text-brand-darkBlue font-bold' : 'text-slate-400'
                          }`}>
                            {getCategoryCount(category)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <h3 className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-[0.25em] mb-3">Sort Order</h3>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-brand-darkBlue/10 rounded-xl text-xs font-sans font-semibold text-brand-darkBlue appearance-none focus:outline-none focus:border-brand-gold cursor-pointer shadow-xs"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </aside>

              {/* Mobile Filter Toggle Button */}
              <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-2xl border border-brand-darkBlue/10 shadow-xs mb-6">
                <span className="text-xs font-sans font-bold text-brand-darkBlue uppercase tracking-wider">
                  {filteredProducts.length} Products Found
                </span>
                <button
                  onClick={() => setIsFilterVisible(!isFilterVisible)}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-darkBlue text-white rounded-xl text-xs font-sans font-bold"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Filter Options</span>
                </button>
              </div>

              {/* Products Grid */}
              <div className="flex-1">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-brand-darkBlue/15">
                    <p className="text-lg font-serif font-bold text-brand-darkBlue">No products match your criteria</p>
                    <p className="text-xs font-sans text-slate-500 mt-1">Try clearing your filters or search keywords</p>
                    <button
                      onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                      className="mt-4 px-6 py-2.5 bg-brand-darkBlue text-white rounded-full text-xs font-sans font-bold hover:bg-brand-blue shadow-sm"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSwitchToDesigns={handleSwitchToProductDesigns}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-20 -mx-4 sm:-mx-6 lg:-mx-8">
          <TrustBadges />
        </div>
      </div>
    </div>
  );
}
