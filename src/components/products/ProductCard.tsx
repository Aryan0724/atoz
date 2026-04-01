"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/supabase/types';
import { ShoppingBag, Eye, Zap, X } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const categoryGradients: Record<string, string> = {
  'Apparel': 'from-rose-400 to-pink-600',
  'Drinkware': 'from-sky-400 to-blue-600',
  'Stationery': 'from-orange-400 to-amber-600',
  'Lifestyle': 'from-teal-400 to-emerald-600',
  'Corporate Gifting': 'from-indigo-400 to-violet-600',
  'Corporate': 'from-slate-500 to-gray-700',
  'Electronics': 'from-blue-500 to-indigo-700',
};

const ProductCard = ({ product }: ProductCardProps) => {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const gradient = product.category ? (categoryGradients[product.category] || 'from-gray-400 to-gray-600') : 'from-gray-400 to-gray-600';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-[32px] overflow-hidden border border-gray-100/80 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] relative card-premium"
    >

      <Link href={`/products/${product.slug}`} className="block">
        <div className="aspect-[4/5] bg-gray-50 relative overflow-hidden p-8">
          {product.images && product.images.length > 0 && !imgError ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-700 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center text-white p-6`}>
              <span className="text-7xl font-black opacity-20 mb-2">{product.name.charAt(0)}</span>
              <span className="text-sm font-bold text-center opacity-60 tracking-wider uppercase">{product.name}</span>
            </div>
          )}
          
          {/* MOQ Badge - Glassmorphism */}
          <div className="absolute top-5 left-5 px-4 py-2 rounded-2xl glass-morphism text-brand-dark text-[10px] font-black uppercase tracking-[0.15em] z-10">
            Min. {product.moq} Units
          </div>


          {/* Hover Overlay Action */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-x-0 bottom-0 p-8 z-20 pointer-events-none"
              >
                <div className="w-full bg-brand-dark/95 backdrop-blur-2xl text-white py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border border-white/20">
                  <Zap className="w-5 h-5 text-brand-cyan animate-pulse" />
                  <span className="text-xs font-black tracking-[0.25em] uppercase italic">Custom Studio</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick View Button - Subtle Top Right */}
          <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsQuickViewOpen(true); }}
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg hover:bg-brand-pink hover:text-white transition-all cursor-pointer border border-gray-100"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-7">
          <div className="flex items-center gap-2 mb-3">
             <div className="h-1.5 w-6 bg-brand-pink/30 rounded-full group-hover:w-10 group-hover:bg-brand-pink transition-all duration-500" />
             <div className="text-[10px] font-black text-brand-pink/70 uppercase tracking-[0.2em]">
                {product.category || 'Uncategorized'}
             </div>
          </div>
          
          <h3 className="text-xl font-bold text-brand-dark mb-4 group-hover:text-brand-pink transition-colors line-clamp-1 tracking-tight">
            {product.name}
          </h3>
          
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Starting from</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-black text-brand-dark">₹</span>
                <span className="text-2xl font-black text-brand-dark tracking-tight">{product.base_price}</span>
              </div>
            </div>
            
            <div className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-brand-dark group-hover:bg-brand-pink group-hover:text-white group-hover:border-brand-pink group-hover:shadow-lg group-hover:shadow-pink-200 transition-all duration-500">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </div>
        </div>
      </Link>

      {/* Quick View Modal Overlay */}
      <AnimatePresence>
        {isQuickViewOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickViewOpen(false)}
              className="fixed inset-0 bg-brand-dark/40 backdrop-blur-md z-[1001]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-4xl bg-white rounded-[40px] shadow-2xl z-[1002] overflow-hidden flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setIsQuickViewOpen(false)}
                className="absolute top-6 right-6 p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-1/2 bg-gray-50 aspect-square relative p-12">
                 <Image 
                    src={product.images?.[0] || ''} 
                    alt={product.name} 
                    fill 
                    className="object-contain p-8" 
                 />
              </div>

              <div className="w-full md:w-1/2 p-10 flex flex-col">
                <div className="text-[10px] font-black text-brand-pink uppercase tracking-widest mb-4">
                  {product.category}
                </div>
                <h2 className="text-3xl font-black text-brand-dark mb-6 tracking-tight">
                  {product.name}
                </h2>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-sm font-bold text-gray-400">From</span>
                  <span className="text-3xl font-black text-brand-dark tracking-tighter">₹{product.base_price}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">/ unit</span>
                </div>
                <p className="text-gray-500 font-medium leading-relaxed mb-10 line-clamp-4">
                  {product.description}
                </p>

                <div className="mt-auto space-y-3">
                  <Link 
                    href={`/customize/${product.slug}`}
                    className="flex items-center justify-center gap-3 w-full py-5 bg-brand-dark text-white font-black rounded-2xl hover:bg-brand-pink transition-all shadow-xl shadow-brand-dark/10 text-xs uppercase tracking-[0.2em] italic"
                  >
                    <Zap className="h-4 w-4 text-brand-cyan" />
                    Custom Design Studio
                  </Link>
                  <Link 
                    href={`/products/${product.slug}`}
                    className="flex items-center justify-center gap-3 w-full py-5 bg-white border border-gray-100 text-brand-dark/40 font-black rounded-2xl hover:border-brand-pink hover:text-brand-pink transition-all text-[10px] uppercase tracking-[0.2em] italic"
                  >
                    Explore Full Details
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCard;
