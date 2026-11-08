"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  RotateCw, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Eye, 
  Zap, 
  Layers,
  Star
} from 'lucide-react';
import { SubProductDesign } from '@/lib/data/subProductsData';

interface SubProductCardProps {
  design: SubProductDesign;
  onQuickView: (design: SubProductDesign) => void;
  onSelectDesign?: (design: SubProductDesign) => void;
  isSelected?: boolean;
}

export default function SubProductCard({
  design,
  onQuickView,
  onSelectDesign,
  isSelected = false
}: SubProductCardProps) {
  const router = useRouter();
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [imgError, setImgError] = useState(false);

  const hasBack = Boolean(design.backImage);
  const displayImage = activeSide === 'back' && design.backImage ? design.backImage : design.frontImage;

  const handleToggleSide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasBack) {
      setActiveSide(prev => (prev === 'front' ? 'back' : 'front'));
    }
  };

  const handleProceed = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectDesign) {
      onSelectDesign(design);
    } else {
      router.push(`/customize/${design.parentProductSlug}?template=${design.templateIndex}`);
    }
  };

  const displayPrice = `₹ ${Math.round(design.startingPrice * (design.moq || 100))}/-`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
        isSelected 
          ? 'border-brand-gold ring-2 ring-brand-gold/30 shadow-lg' 
          : 'border-brand-darkBlue/8 hover:border-brand-gold/60 shadow-[0_2px_12px_rgba(11,17,32,0.03)] hover:shadow-[0_16px_36px_rgba(11,17,32,0.1)]'
      }`}
    >
      {/* Top Media / Preview Container */}
      <div className="relative aspect-[3.5/2.2] bg-brand-base p-3 overflow-hidden flex items-center justify-center border-b border-brand-darkBlue/8">
        {/* Popular / Trending Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {design.isPopular && (
            <span className="px-2.5 py-0.5 bg-brand-darkBlue text-brand-gold text-[8.5px] font-sans font-bold uppercase tracking-wider rounded-md shadow-xs flex items-center gap-1 border border-brand-gold/30">
              <Sparkles className="w-2.5 h-2.5 fill-current" /> Bestseller
            </span>
          )}
          {design.isTrending && (
            <span className="px-2.5 py-0.5 bg-brand-gold text-brand-darkBlue text-[8.5px] font-sans font-bold uppercase tracking-wider rounded-md shadow-xs">
              Trending
            </span>
          )}
        </div>

        {/* Action icons top right */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1">
          {hasBack && (
            <button
              onClick={handleToggleSide}
              className="px-2 py-1 rounded-lg bg-white/95 backdrop-blur-md shadow-xs border border-brand-darkBlue/10 text-slate-700 hover:text-brand-darkBlue hover:bg-white transition-all text-[9px] font-sans font-bold flex items-center gap-1 uppercase tracking-tight"
              title="Flip front / back"
            >
              <RotateCw className="w-3 h-3 text-brand-gold" />
              <span>{activeSide === 'front' ? 'Back' : 'Front'}</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(design);
            }}
            className="p-1.5 rounded-lg bg-white/95 backdrop-blur-md shadow-xs border border-brand-darkBlue/10 text-slate-700 hover:text-brand-darkBlue hover:bg-white transition-all"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Product preview image with smooth hover zoom */}
        <div 
          onClick={() => onQuickView(design)}
          className="relative w-full h-full cursor-pointer flex items-center justify-center"
        >
          {!imgError ? (
            <Image
              src={displayImage}
              alt={design.name}
              fill
              className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="text-xs font-serif font-bold text-slate-400 italic flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-300" />
              {design.name}
            </div>
          )}
        </div>

        {/* Side Indicator Overlay */}
        {hasBack && (
          <div className="absolute bottom-2 left-2.5 text-[8.5px] font-sans font-bold text-slate-500 uppercase tracking-widest bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded border border-brand-darkBlue/10">
            {activeSide === 'front' ? 'Front Side' : 'Back Side'}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Sub-Product / Design Name */}
          <h3 
            onClick={() => onQuickView(design)}
            className="font-serif font-bold text-brand-darkBlue text-base line-clamp-1 mb-1.5 cursor-pointer hover:text-brand-gold transition-colors tracking-tight"
            title={design.name}
          >
            {design.name}
          </h3>

          {/* Ratings & Reviews */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center text-brand-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span className="text-[10px] font-sans font-semibold text-slate-400">
              (34 Reviews)
            </span>
            <span className="text-[10px] text-slate-300">•</span>
            <span className="text-[10px] font-sans font-medium text-slate-500">
              {design.profession}
            </span>
          </div>

          {/* Price Wrapper (PrintAsia style) */}
          <div className="mb-3 pt-2.5 border-t border-brand-darkBlue/8">
            <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider block">
              Starting at:
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-serif font-bold text-brand-darkBlue tracking-tight">
                {displayPrice}
              </span>
              <span className="text-[10px] font-sans text-slate-400 font-medium">
                (per {design.moq || 100} units)
              </span>
            </div>
          </div>

          {/* Three Guarantee Checkmarks (PrintAsia Signature Feature) */}
          <div className="space-y-1.5 mb-4 text-[11px] font-sans font-medium text-slate-700 bg-brand-base/80 p-2.5 rounded-xl border border-brand-darkBlue/6">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-brand-gold shrink-0 stroke-[2.5]" />
              <span>Door Delivery All India</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-brand-gold shrink-0 stroke-[2.5]" />
              <span>Editable Online</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-brand-gold shrink-0 stroke-[2.5]" />
              <span>Premium Quality</span>
            </div>
          </div>
        </div>

        {/* Primary CTA (PrintAsia text: "Customize & Order Now") */}
        <button
          onClick={handleProceed}
          className={`w-full py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
            isSelected 
              ? 'bg-brand-gold text-brand-darkBlue shadow-brand-gold/30 ring-2 ring-brand-gold' 
              : 'bg-brand-darkBlue hover:bg-brand-blue text-white shadow-brand-darkBlue/15 hover:shadow-brand-blue/20'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-brand-gold" />
          <span>Customize & Order Now</span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-gold group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
