"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Search, 
  Briefcase, 
  Store, 
  Building2, 
  FileSpreadsheet, 
  Layers, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  PrintAsiaCategoryItem, 
  PRINTASIA_CATEGORIES 
} from '@/lib/data/subProductsData';

interface PrintAsiaCategoryGridProps {
  onSelectCategory: (category: PrintAsiaCategoryItem) => void;
  selectedCategoryId?: string;
  className?: string;
}

const GROUPS = [
  { id: 'All', label: 'All Products', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'Professionals', label: 'Professionals', icon: <Briefcase className="w-3.5 h-3.5" /> },
  { id: 'Retails & Services', label: 'Retails & Services', icon: <Store className="w-3.5 h-3.5" /> },
  { id: 'Business & Real Estate', label: 'Corporate & Real Estate', icon: <Building2 className="w-3.5 h-3.5" /> },
  { id: 'Stationery & Merch', label: 'Stationery & Merchandise', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
];

export default function PrintAsiaCategoryGrid({
  onSelectCategory,
  selectedCategoryId,
  className = ''
}: PrintAsiaCategoryGridProps) {
  const [activeGroup, setActiveGroup] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCategories = useMemo(() => {
    return PRINTASIA_CATEGORIES.filter((cat) => {
      const matchesGroup = activeGroup === 'All' || cat.group === activeGroup;
      const matchesSearch = searchQuery.trim() === '' || 
        cat.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        cat.tagline.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (cat.professionFilter && cat.professionFilter.toLowerCase().includes(searchQuery.toLowerCase().trim()));
      return matchesGroup && matchesSearch;
    });
  }, [activeGroup, searchQuery]);

  return (
    <section className={`w-full ${className}`}>
      {/* ─── CONTROLS TOOLBAR: CATEGORY GROUP TABS + SEARCH BAR ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pt-2">
        {/* Category Group Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar -mx-2 px-2 scroll-smooth">
          {GROUPS.map((g) => {
            const isSelected = activeGroup === g.id;
            const count = g.id === 'All' 
              ? PRINTASIA_CATEGORIES.length 
              : PRINTASIA_CATEGORIES.filter(c => c.group === g.id).length;

            return (
              <button
                key={g.id}
                onClick={() => setActiveGroup(g.id)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-sans font-bold transition-all duration-200 ${
                  isSelected
                    ? 'bg-brand-darkBlue text-white shadow-md shadow-brand-darkBlue/15 ring-1 ring-brand-darkBlue'
                    : 'bg-white text-slate-600 hover:text-brand-darkBlue hover:border-brand-gold/50 border border-brand-darkBlue/10 shadow-xs'
                }`}
              >
                <span className={isSelected ? 'text-brand-gold' : 'text-slate-400'}>
                  {g.icon}
                </span>
                <span>{g.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-bold ${
                  isSelected 
                    ? 'bg-brand-gold text-brand-darkBlue' 
                    : 'bg-brand-base text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full lg:w-80 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search e.g. Advocate, Doctor, CA..."
            aria-label="Search product categories"
            className="w-full pl-10 pr-8 py-2.5 rounded-full bg-white border border-brand-darkBlue/10 text-xs font-sans font-medium text-brand-darkBlue placeholder-slate-400 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-darkBlue text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ─── THE PRODUCT CATEGORIES GRID (PrintAsia Architecture) ─── */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-brand-darkBlue/15">
          <p className="text-base font-serif font-bold text-brand-darkBlue">No categories found matching &quot;{searchQuery}&quot;</p>
          <p className="text-xs font-sans text-slate-500 mt-1">Try another search term or reset filters</p>
          <button
            onClick={() => { setSearchQuery(''); setActiveGroup('All'); }}
            className="mt-4 px-5 py-2 rounded-full text-xs font-sans font-bold bg-brand-darkBlue text-white hover:bg-brand-blue transition-colors shadow-sm"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {filteredCategories.map((item) => {
            const isSelected = selectedCategoryId === item.id;
            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelectCategory(item)}
                className={`group relative bg-white border rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'border-brand-gold ring-2 ring-brand-gold/30 shadow-lg bg-brand-gold/[0.03]' 
                    : 'border-brand-darkBlue/8 hover:border-brand-gold/60 shadow-[0_2px_12px_rgba(11,17,32,0.03)] hover:shadow-[0_12px_28px_rgba(11,17,32,0.08)]'
                }`}
              >
                {/* Product Thumbnail / Icon */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3.5 flex items-center justify-center p-2 rounded-2xl bg-brand-base group-hover:bg-brand-gold/10 transition-colors duration-300">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Title */}
                <h3 className="font-serif font-bold text-sm sm:text-base text-brand-darkBlue group-hover:text-brand-gold transition-colors leading-snug line-clamp-1 mb-1">
                  {item.title}
                </h3>

                {/* Count Badge (<mark class="count">X Products</mark>) */}
                <div className="flex items-center justify-center mt-0.5">
                  <span className="text-xs font-sans text-slate-500 flex items-center gap-1">
                    <mark className="bg-brand-gold/15 text-brand-darkBlue font-bold px-2 py-0.5 rounded-full text-[11px] font-sans">
                      {item.count}
                    </mark>
                    <span className="text-[11px] font-medium text-slate-500">Designs</span>
                  </span>
                </div>

                {/* Tagline snippet */}
                <p className="text-[10px] font-sans text-slate-400 font-normal line-clamp-1 mt-1.5 px-1 group-hover:text-slate-600 transition-colors">
                  {item.tagline}
                </p>

                {/* Subtle Hover CTA Indicator */}
                <div className="mt-2.5 flex items-center gap-1 text-[10px] font-sans font-bold uppercase tracking-wider text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0">
                  <span>Explore Designs</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
