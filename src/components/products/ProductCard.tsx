"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/supabase/types';
import { ShoppingBag, Eye, Zap, X, Heart } from 'lucide-react';
import { useWishlist } from '@/lib/store/useWishlist';
import { toast } from 'sonner';
import Button from '@/components/common/Button';

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
  const { isFavorite, toggleFavorite } = useWishlist();
  const isFav = isFavorite(product.id);
  const gradient = product.category ? (categoryGradients[product.category] || 'from-gray-400 to-gray-600') : 'from-gray-400 to-gray-600';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-500 hover:border-brand-pink/20 hover:shadow-soft relative"
    >

      <div
        className="block cursor-pointer"
        onClick={() => { window.location.href = `/products/${product.slug}`; }}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && (window.location.href = `/products/${product.slug}`)}
      >
        <div className="aspect-[4/5] bg-gray-50 relative overflow-hidden p-6">
          {product.images && product.images.length > 0 && !imgError ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-700 group-hover:scale-102"
              priority
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center text-white p-6`}>
              <span className="text-4xl font-black opacity-20 mb-2 tracking-tighter">{product.name.charAt(0)}</span>
            </div>
          )}
          
          {/* MOQ Badge - Minimal */}
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-white/80 backdrop-blur-md border border-gray-100 text-brand-dark text-[10px] font-bold uppercase tracking-tight z-10 shadow-sm">
            Min. {product.moq} Units
          </div>

          {/* Action Buttons - Subtle Top Right */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col gap-2">
            <button 
              onClick={async (e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                const added = await toggleFavorite(product.id);
                if (added) toast.success(`${product.name} saved!`);
              }}
              className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all group/heart cursor-pointer border border-gray-100"
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-brand-pink text-brand-pink' : 'text-gray-400'}`} />
            </button>            
          </div>
        </div>

        <div className="p-6">
          <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2 flex items-center gap-2">
             {product.category || 'Product'}
             <div className="h-0.5 w-4 bg-gray-100" />
          </div>
          
          <h3 className="text-base font-bold text-brand-dark mb-4 transition-colors line-clamp-1 tracking-tight">
            {product.name}
          </h3>
          
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight mb-0.5">Starting from</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-brand-dark tracking-tight">₹{product.base_price}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link 
                href={`/customize/${product.slug}?autoOpen=uploads`}
                className="h-10 px-4 rounded-lg bg-brand-pink/5 border border-brand-pink/10 flex items-center justify-center text-brand-pink hover:bg-brand-pink hover:text-white transition-all duration-300 font-black text-[9px] uppercase tracking-widest"
                title="Import & Edit"
                onClick={(e) => e.stopPropagation()}
              >
                Direct Import
              </Link>
              <div className="h-10 w-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-brand-dark group-hover:text-white group-hover:border-brand-dark transition-all duration-300">
                <ShoppingBag className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal Overlay */}
      <AnimatePresence>
        {isQuickViewOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickViewOpen(false)}
              className="fixed inset-0 bg-brand-dark/20 backdrop-blur-sm z-[1001]"
            />
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl bg-white rounded-[32px] shadow-2xl z-[1002] overflow-hidden flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setIsQuickViewOpen(false)}
                className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors z-20"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <div className="w-full md:w-1/2 bg-gray-50 aspect-square relative p-12">
                 <Image 
                    src={product.images?.[0] || ''} 
                    alt={product.name} 
                    fill 
                    className="object-contain p-12" 
                 />
              </div>

              <div className="w-full md:w-1/2 p-10 flex flex-col">
                <div className="text-[10px] font-bold text-brand-pink uppercase tracking-widest mb-4">
                  {product.category}
                </div>
                <h2 className="text-3xl font-bold text-brand-dark mb-6 tracking-tight">
                  {product.name}
                </h2>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-2xl font-bold text-brand-dark tracking-tighter">₹{product.base_price}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">/ unit</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-10 line-clamp-4">
                  {product.description}
                </p>

                <div className="mt-auto flex flex-col gap-3">
                  <Link href={`/customize/${product.slug}`} className="w-full">
                    <Button variant="primary" className="w-full py-4 text-[10px] tracking-widest uppercase">
                       Custom Design Studio
                    </Button>
                  </Link>
                  <Link href={`/products/${product.slug}`} className="w-full">
                    <Button variant="secondary" className="w-full py-4 text-[10px] tracking-widest uppercase border-gray-100">
                      Explore Full Details
                    </Button>
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
