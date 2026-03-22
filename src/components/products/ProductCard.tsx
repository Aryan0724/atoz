"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/supabase/types';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const categoryGradients: Record<string, string> = {
  'Apparel': 'from-pink-400 to-rose-500',
  'Drinkware': 'from-cyan-400 to-blue-500',
  'Stationery': 'from-amber-400 to-orange-500',
  'Lifestyle': 'from-emerald-400 to-teal-500',
  'Corporate Gifting': 'from-violet-400 to-purple-500',
  'Corporate': 'from-slate-400 to-gray-600',
  'Electronics': 'from-blue-400 to-indigo-500',
};

const ProductCard = ({ product }: ProductCardProps) => {
  const [imgError, setImgError] = useState(false);
  const gradient = product.category ? (categoryGradients[product.category] || 'from-gray-400 to-gray-600') : 'from-gray-400 to-gray-600';
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-100">
      <Link href={`/products/${product.slug}`} className="block relative">
        <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
          {product.images && product.images.length > 0 && !imgError ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center text-white p-6`}>
              <span className="text-6xl font-black opacity-30 mb-2">{product.name.charAt(0)}</span>
              <span className="text-sm font-bold text-center opacity-70">{product.name}</span>
            </div>
          )}
          
          {/* MOQ Badge */}
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-brand-dark text-white text-[10px] font-bold uppercase tracking-wider z-10">
            Min. {product.moq} Units
          </div>
        </div>

        <div className="p-6">
          <div className="text-xs font-bold text-brand-pink uppercase tracking-widest mb-2">
            {product.category || 'Uncategorized'}
          </div>
          <h3 className="text-xl font-bold text-brand-dark mb-2 group-hover:text-brand-pink transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-6">
            <div>
              <span className="text-sm text-gray-400 block mb-1">Starting from</span>
              <span className="text-2xl font-black text-brand-dark">₹{product.base_price}</span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-brand-lightGray flex items-center justify-center group-hover:bg-brand-pink group-hover:text-white transition-all duration-300">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
