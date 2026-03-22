"use client";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ProductCard from '@/components/products/ProductCard';
import { Search, ChevronDown, Loader2, Filter, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/lib/supabase/types';
import { mockProducts } from '@/lib/data/mockProducts';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

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

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setProducts(mockProducts);
      } else {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

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

  return (
    <div className="bg-white min-h-screen pb-20 overflow-x-hidden">
      {/* Hero Section - Cinematic */}
      <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Mesh/Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
           <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-100/50 rounded-full blur-[120px] animate-pulse" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-50/50 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="flex flex-col lg:flex-row lg:items-end justify-between gap-10"
          >
            <div className="max-w-3xl">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-pink/5 border border-brand-pink/10 text-brand-pink text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  Premium Catalog
               </div>
               <h1 className="text-5xl lg:text-7xl font-black text-brand-dark tracking-tighter mb-8 italic leading-[0.95]">
                  Curated <span className="text-brand-pink underline decoration-brand-pink decoration-wavy decoration-8 underline-offset-8">Masterpieces</span> <br/>
                  For Your Brand.
               </h1>
               <p className="text-xl text-gray-400 font-bold max-w-2xl leading-relaxed">
                  Discover a selection of high-end customizable gear, engineered for excellence and designed to make your brand stand out from the crowd.
               </p>
            </div>
            <div className="flex items-center gap-4">
               <div className="h-20 w-px bg-gray-100 hidden lg:block mx-10" />
               <div className="flex flex-col">
                  <span className="text-4xl font-black text-brand-dark italic tracking-tighter">{products.length}+</span>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Products</span>
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumbs items={[{ label: 'Catalog' }]} />

        {/* Dynamic Filters & Search Section */}
        <div className="mt-16 mb-20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-gray-100/80">
            <div className="flex items-center gap-4">
               <h2 className="text-2xl font-black text-brand-dark tracking-tight uppercase">Refine Catalog</h2>
               <div className="h-1.5 w-12 bg-brand-pink/30 rounded-full" />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 lg:max-w-3xl justify-end">
               <div className="relative w-full sm:max-w-sm">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                  <input
                    type="text"
                    placeholder="Search masterworks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-4 focus:ring-brand-pink/10 focus:bg-white focus:border-brand-pink transition-all font-bold text-brand-dark placeholder:text-gray-300"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
               </div>
               
               <div className="relative w-full sm:w-auto min-w-[200px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-brand-dark text-white font-black py-4 pl-8 pr-14 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-dark/10 cursor-pointer shadow-xl shadow-brand-dark/20 text-sm tracking-widest uppercase"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
               </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all duration-300",
                  selectedCategory === cat 
                    ? "bg-brand-pink text-white shadow-2xl shadow-pink-200" 
                    : "bg-white text-brand-dark hover:bg-gray-50 border border-gray-100"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Listing */}
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-6">
             <div className="relative">
                <div className="h-16 w-16 border-4 border-brand-pink/10 border-t-brand-pink rounded-full animate-spin"></div>
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-brand-pink animate-pulse" />
             </div>
             <p className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] italic">Constructing Selection...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-40 text-center"
          >
            <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-[40px] bg-gray-50/50 border border-gray-100 mb-10 shadow-inner group">
              <div className="absolute inset-0 bg-brand-pink/5 rounded-full blur-2xl group-hover:bg-brand-pink/10 transition-colors" />
              <Search className="relative h-12 w-12 text-gray-200" />
            </div>
            <h3 className="text-4xl font-black text-brand-dark mb-4 tracking-tighter uppercase italic">Nil Result.</h3>
            <p className="text-gray-400 font-bold mb-12 max-w-sm mx-auto leading-relaxed uppercase text-xs tracking-widest">Your search did not yield any masterpieces. Adjust your refine criteria.</p>
            <button 
              onClick={() => {setSelectedCategory('All'); setSearchQuery('');}}
              className="px-10 py-5 bg-brand-dark text-white font-black rounded-3xl hover:bg-brand-pink transition-all shadow-xl shadow-brand-dark/10"
            >
              Reset Selection
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <Loader2 className="h-12 w-12 text-brand-pink animate-spin" />
           <span className="text-xs font-black text-gray-400 uppercase tracking-widest italic animate-pulse">Initializing Gear...</span>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
