"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/supabase/types';
import { ShoppingBag, Eye, Zap } from 'lucide-react';

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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute inset-x-0 bottom-0 p-6 z-20 pointer-events-none"
              >
                <div className="w-full bg-brand-dark/90 backdrop-blur-lg text-white py-4 rounded-2xl flex items-center justify-center gap-2 shadow-2xl shadow-brand-dark/40 border border-white/10">
                  <Zap className="w-4 h-4 text-brand-lime" />
                  <span className="text-sm font-black tracking-widest uppercase">Customize Now</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick View Button - Subtle Top Right */}
          <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg hover:bg-brand-pink hover:text-white transition-all cursor-pointer">
              <Eye className="w-5 h-5" />
            </div>
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
    </motion.div>
  );
};

export default ProductCard;
