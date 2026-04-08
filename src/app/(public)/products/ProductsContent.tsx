"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import SectionHeading from '@/components/common/SectionHeading';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ProductCard from '@/components/products/ProductCard';
import { Search, ChevronDown, Filter, X, Sparkles, LayoutGrid, Shirt, Coffee, PenTool, Star, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/supabase/types';
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

export default function ProductsContent({ initialProducts }: { initialProducts: Product[] }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>(initialProducts);
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

  return (
    <div className="bg-white min-h-screen pb-20 overflow-x-hidden pt-32">
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumbs items={[{ label: 'Catalog' }]} />

        <div className="mt-16 flex flex-col lg:flex-row gap-12">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-32 h-fit">
            <div className="flex items-center gap-3 mb-8">
              <Filter className="w-5 h-5 text-brand-pink" />
              <h2 className="text-xl font-black text-brand-dark tracking-tight uppercase">Refine</h2>
            </div>

            <div className="space-y-10">
              {/* Search Within Categories */}
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Search</h3>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input
                    type="text"
                    placeholder="Find gear..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-pink/30 focus:outline-none transition-all text-sm font-bold"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Category</h3>
                <div className="space-y-2">
                  {[
                    { name: 'All', icon: LayoutGrid },
                    { name: 'Apparel', icon: Shirt },
                    { name: 'Drinkware', icon: Coffee },
                    { name: 'Stationery', icon: PenTool },
                    { name: 'Lifestyle', icon: Star },
                    { name: 'Corporate Gifting', icon: Briefcase },
                  ].map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                        selectedCategory === cat.name 
                          ? "bg-brand-dark text-white shadow-lg shadow-gray-200" 
                          : "text-gray-500 hover:bg-gray-50 hover:text-brand-dark"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <cat.icon className={cn("w-4 h-4", selectedCategory === cat.name ? "text-brand-cyan" : "text-gray-300 group-hover:text-brand-pink")} />
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <div className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded-md transition-all",
                        selectedCategory === cat.name ? "bg-brand-cyan text-brand-dark" : "bg-gray-100 text-gray-400 group-hover:bg-brand-pink/10 group-hover:text-brand-pink"
                      )}>
                        {getCategoryCount(cat.name)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Sort By</h3>
                <div className="space-y-2">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all",
                        sortBy === opt.value 
                          ? "bg-gray-100 text-brand-dark" 
                          : "text-gray-500 hover:bg-gray-50 hover:text-brand-dark"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Mobile Header (Search & Filter Trigger) */}
            <div className="lg:hidden mb-12 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-pink focus:bg-white transition-all text-sm font-bold"
                />
              </div>
              <button 
                onClick={() => setIsFilterVisible(true)}
                className="p-4 bg-brand-dark text-white rounded-2xl shadow-xl shadow-brand-dark/20"
              >
                <Filter className="w-6 h-6" />
              </button>
            </div>

            {/* Selected Filters Chips */}
            {(selectedCategory !== 'All' || searchQuery) && (
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Active:</span>
                {selectedCategory !== 'All' && (
                  <button 
                    onClick={() => setSelectedCategory('All')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-brand-pink/10 text-brand-pink rounded-lg text-xs font-bold border border-brand-pink/20"
                  >
                    {selectedCategory}
                    <X className="w-3 h-3" />
                  </button>
                )}
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-brand-cyan/10 text-brand-cyan rounded-lg text-xs font-bold border border-brand-cyan/20"
                  >
                    &quot;{searchQuery}&quot;
                    <X className="w-3 h-3" />
                  </button>
                )}
                <button 
                  onClick={() => {setSelectedCategory('All'); setSearchQuery('');}}
                  className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-brand-pink transition-colors ml-2"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product Listing */}
            {filteredProducts.length > 0 ? (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
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

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {isFilterVisible && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterVisible(false)}
                className="fixed inset-0 bg-brand-dark/20 backdrop-blur-sm z-[100] lg:hidden"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-x-0 bottom-0 bg-white rounded-t-[40px] z-[101] p-8 lg:hidden max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-brand-dark tracking-tight uppercase">Filter & Sort</h2>
                  <button 
                    onClick={() => setIsFilterVisible(false)}
                    className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-10 pb-12">
                   {/* Mobile Categories */}
                   <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Category</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: 'All', icon: LayoutGrid },
                        { name: 'Apparel', icon: Shirt },
                        { name: 'Drinkware', icon: Coffee },
                        { name: 'Stationery', icon: PenTool },
                        { name: 'Lifestyle', icon: Star },
                        { name: 'Corporate Gifting', icon: Briefcase },
                      ].map((cat) => (
                        <button
                          key={cat.name}
                          onClick={() => {setSelectedCategory(cat.name); setIsFilterVisible(false);}}
                          className={cn(
                            "flex items-center justify-between px-4 py-4 rounded-2xl text-xs font-bold transition-all border",
                            selectedCategory === cat.name 
                              ? "bg-brand-dark text-white border-brand-dark" 
                              : "bg-white text-gray-500 border-gray-100"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <cat.icon className={cn("w-4 h-4", selectedCategory === cat.name ? "text-brand-cyan" : "text-gray-300")} />
                            {cat.name}
                          </div>
                          <span className={cn(
                            "text-[9px] font-black px-2 py-0.5 rounded-md",
                            selectedCategory === cat.name ? "bg-brand-cyan text-brand-dark" : "bg-gray-100 text-gray-400"
                          )}>
                            {getCategoryCount(cat.name)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Sort */}
                  <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Sort By</h3>
                    <div className="space-y-3">
                      {sortOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {setSortBy(opt.value); setIsFilterVisible(false);}}
                          className={cn(
                            "w-full text-left px-6 py-4 rounded-2xl text-sm font-bold transition-all border-2",
                            sortBy === opt.value 
                              ? "border-brand-pink bg-pink-50/50 text-brand-pink" 
                              : "border-gray-50 text-gray-500"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsFilterVisible(false)}
                    className="w-full py-5 bg-brand-dark text-white font-black rounded-2xl shadow-xl shadow-brand-dark/20 text-lg uppercase tracking-widest"
                  >
                    Show Results
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
