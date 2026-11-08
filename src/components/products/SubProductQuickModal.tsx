"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  RotateCw, 
  Check, 
  ArrowRight, 
  Zap, 
  Truck, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  Upload,
  Star
} from 'lucide-react';
import { SubProductDesign, getParentProductBySlug } from '@/lib/data/subProductsData';
import { useCart } from '@/lib/store/useCart';
import { toast } from 'sonner';

interface SubProductQuickModalProps {
  design: SubProductDesign | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectDesign?: (design: SubProductDesign) => void;
}

const PRINTING_SIDES = [
  { id: 'single', name: 'Single Side Printing', addOn: 0 },
  { id: 'double', name: 'Double Side Printing', addOn: 1.0 }
];

const PAPER_OPTIONS = [
  { id: 'matt', name: 'Premium Matt Finish (350 GSM)', addOn: 0, tag: 'Most Popular' },
  { id: 'pearl', name: 'Pearl Dot Texture (300 GSM)', addOn: 0.75, tag: 'Textured' },
  { id: 'metallic', name: 'Metallic Texture Shimmer', addOn: 1.5, tag: 'Luxury' },
  { id: 'linen', name: 'Fine Linen Texture (400 GSM)', addOn: 2.0, tag: 'Executive' }
];

const CORNER_OPTIONS = [
  { id: 'standard', name: 'Standard Square Corners', addOn: 0 },
  { id: 'rounded', name: 'Rounded Corners', addOn: 0.75 }
];

export default function SubProductQuickModal({ design, isOpen, onClose, onSelectDesign }: SubProductQuickModalProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  
  // Configuration Options
  const [selectedSideOption, setSelectedSideOption] = useState(PRINTING_SIDES[1]); // default double side
  const [selectedPaper, setSelectedPaper] = useState(PAPER_OPTIONS[0]);
  const [selectedCorner, setSelectedCorner] = useState(CORNER_OPTIONS[0]);
  const [quantity, setQuantity] = useState(100);

  if (!isOpen || !design) return null;

  const parentProduct = getParentProductBySlug(design.parentProductSlug);
  const hasBack = Boolean(design.backImage);
  const currentImage = activeSide === 'back' && design.backImage ? design.backImage : design.frontImage;

  // Rate calculations
  const baseUnitRate = design.startingPrice >= 50 ? design.startingPrice / 100 : design.startingPrice;
  const unitRate = Number((baseUnitRate + selectedSideOption.addOn + selectedPaper.addOn + selectedCorner.addOn).toFixed(2));
  const effectiveQty = Math.max(design.moq || 100, quantity);
  const totalPrice = Math.round(effectiveQty * unitRate);

  const handleProceedToCustomize = () => {
    onClose();
    if (onSelectDesign) {
      onSelectDesign(design);
    } else {
      router.push(`/customize/${design.parentProductSlug}?template=${design.templateIndex}`);
    }
  };

  const handleUploadArtwork = () => {
    onClose();
    router.push(`/customize/${design.parentProductSlug}?tab=uploads&template=${design.templateIndex}`);
  };

  const handleQuickAddToCart = () => {
    addItem({
      id: `${design.id}-${selectedPaper.name}-${selectedCorner.name}`,
      product: {
        id: design.id,
        name: `${design.name} (${selectedPaper.name}, ${selectedCorner.name})`,
        slug: design.slug,
        base_price: unitRate,
        category: design.category,
        images: [design.frontImage, ...(design.backImage ? [design.backImage] : [])],
        moq: design.moq
      } as any,
      quantity: effectiveQty,
      quality_level: selectedPaper.name,
      design_data: {
        templateId: design.id,
        templateIndex: design.templateIndex,
        designName: design.name,
        profession: design.profession,
        printingSide: selectedSideOption.name,
        paperTexture: selectedPaper.name,
        corners: selectedCorner.name
      }
    });

    toast.success('Custom design configured and added to your bag!');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-brand-darkBlue/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-4xl rounded-[28px] shadow-2xl overflow-hidden border border-brand-darkBlue/10 z-10 flex flex-col md:flex-row max-h-[92vh]"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 shadow-md text-slate-500 hover:text-brand-darkBlue hover:bg-brand-base transition-all z-20"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Preview Section */}
          <div className="md:w-1/2 bg-brand-base p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-brand-darkBlue/8 overflow-y-auto">
            <div>
              {/* Badge & Profession */}
              <div className="flex items-center gap-2 mb-3.5 flex-wrap">
                <span className="px-3 py-1 bg-brand-gold/15 text-brand-darkBlue text-[10px] font-sans font-bold uppercase tracking-wider rounded-full border border-brand-gold/30">
                  {design.profession}
                </span>
                <span className="px-3 py-1 bg-white text-slate-600 text-[10px] font-sans font-semibold uppercase tracking-wider rounded-full border border-brand-darkBlue/10">
                  {design.styleTag}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-sans font-bold text-brand-gold bg-white px-2.5 py-1 rounded-full border border-brand-darkBlue/6">
                  <Star className="w-3 h-3 fill-current text-brand-gold" /> 4.9 (34 Reviews)
                </span>
              </div>

              {/* Main Image Container */}
              <div className="relative aspect-[3.5/2.2] bg-white rounded-2xl overflow-hidden shadow-md border border-brand-darkBlue/8 p-2 flex items-center justify-center group">
                <Image 
                  src={currentImage} 
                  alt={design.name} 
                  fill 
                  className="object-contain p-2 transition-all duration-300"
                  priority
                />

                {/* Side indicator badge */}
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-brand-darkBlue/90 backdrop-blur-md text-white text-[10px] font-sans font-bold uppercase tracking-wider rounded-lg shadow-sm">
                  {activeSide === 'front' ? 'Front Side View' : 'Back Side View'}
                </div>
              </div>

              {/* Front / Back Toggle Buttons */}
              {hasBack && (
                <div className="mt-3.5 flex items-center justify-center gap-2">
                  <button 
                    onClick={() => setActiveSide('front')}
                    className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition-all flex items-center gap-2 ${
                      activeSide === 'front' 
                        ? 'bg-brand-darkBlue text-white shadow-sm' 
                        : 'bg-white text-slate-600 border border-brand-darkBlue/10 hover:bg-brand-base'
                    }`}
                  >
                    Front Side
                  </button>
                  <button 
                    onClick={() => setActiveSide('back')}
                    className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition-all flex items-center gap-2 ${
                      activeSide === 'back' 
                        ? 'bg-brand-darkBlue text-white shadow-sm' 
                        : 'bg-white text-slate-600 border border-brand-darkBlue/10 hover:bg-brand-base'
                    }`}
                  >
                    <RotateCw className="w-3 h-3 text-brand-gold" /> Back Side
                  </button>
                </div>
              )}
            </div>

            {/* Quality Checklist */}
            <div className="mt-6 pt-5 border-t border-brand-darkBlue/8 space-y-2">
              <div className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-slate-400 mb-2">A to Z Prints Quality Guarantee</div>
              <div className="flex items-center gap-2 text-xs font-sans font-medium text-slate-700">
                <Check className="w-4 h-4 text-brand-gold shrink-0 stroke-[2.5]" />
                <span>Door Delivery All India (Free Shipping above ₹499)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-sans font-medium text-slate-700">
                <Check className="w-4 h-4 text-brand-gold shrink-0 stroke-[2.5]" />
                <span>Editable Online (Add Logo, Phone, Address, QR)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-sans font-medium text-slate-700">
                <Check className="w-4 h-4 text-brand-gold shrink-0 stroke-[2.5]" />
                <span>Premium Quality 350+ GSM Cardstock</span>
              </div>
            </div>
          </div>

          {/* Right Configuration & Action Section */}
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-[0.25em] mb-1">
                Customizable Design
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-darkBlue tracking-tight mb-2">
                {design.name}
              </h2>
              <p className="text-xs font-sans text-slate-500 leading-relaxed font-normal mb-5">
                {design.description}
              </p>

              {/* Price Banner */}
              <div className="p-4 bg-brand-darkBlue text-white rounded-2xl mb-5 flex items-center justify-between border border-brand-gold/20 shadow-md">
                <div>
                  <span className="text-[10px] font-sans font-bold text-brand-gold uppercase tracking-widest block">Unit Rate</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-serif font-bold tracking-tight text-white">₹{unitRate.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-300 font-sans">/ card</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-sans font-semibold text-slate-300 uppercase tracking-widest block">Total ({effectiveQty} Units)</span>
                  <span className="text-2xl font-serif font-bold text-brand-gold tracking-tight">₹{totalPrice.toLocaleString()}/-</span>
                </div>
              </div>

              {/* 1. Printing Side */}
              <div className="mb-4">
                <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                  1. Printing Side
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRINTING_SIDES.map((side) => (
                    <button
                      key={side.id}
                      onClick={() => setSelectedSideOption(side)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedSideOption.id === side.id 
                          ? 'border-brand-gold bg-brand-gold/15 text-brand-darkBlue ring-1 ring-brand-gold font-bold' 
                          : 'border-brand-darkBlue/10 hover:border-brand-darkBlue/30 bg-white text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-sans font-bold">{side.name}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{side.addOn > 0 ? `+ ₹${side.addOn}/card` : 'Standard Included'}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Choose Paper Finish */}
              <div className="mb-4">
                <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                  2. Choose Paper Texture / Finish
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PAPER_OPTIONS.map((paper) => (
                    <button
                      key={paper.id}
                      onClick={() => setSelectedPaper(paper)}
                      className={`p-2.5 rounded-xl border text-left transition-all relative ${
                        selectedPaper.id === paper.id 
                          ? 'border-brand-gold bg-brand-gold/15 text-brand-darkBlue ring-1 ring-brand-gold font-bold' 
                          : 'border-brand-darkBlue/10 hover:border-brand-darkBlue/30 bg-white text-slate-700'
                      }`}
                    >
                      <div className="text-[11px] font-sans font-bold truncate">{paper.name}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{paper.addOn > 0 ? `+ ₹${paper.addOn}/card` : 'Included'}</div>
                      {paper.tag && (
                        <span className="absolute top-1 right-1 text-[7.5px] font-sans font-bold uppercase tracking-wider text-brand-darkBlue bg-brand-gold/30 px-1 py-0.2 rounded">
                          {paper.tag}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Corners & Quantity */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                    3. Corners
                  </label>
                  <select
                    value={selectedCorner.id}
                    onChange={(e) => {
                      const opt = CORNER_OPTIONS.find(c => c.id === e.target.value) || CORNER_OPTIONS[0];
                      setSelectedCorner(opt);
                    }}
                    className="w-full bg-white border border-brand-darkBlue/10 text-xs font-sans font-bold text-brand-darkBlue rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-gold shadow-xs"
                  >
                    {CORNER_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.addOn > 0 ? `(+₹${c.addOn})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                    4. Quantity
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[100, 200, 500, 1000].map((qty) => (
                      <button
                        key={qty}
                        onClick={() => setQuantity(qty)}
                        className={`flex-1 py-2 rounded-xl text-xs font-sans font-bold transition-all ${
                          quantity === qty 
                            ? 'bg-brand-darkBlue text-white shadow-xs' 
                            : 'bg-brand-base text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {qty}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-brand-darkBlue/8">
              <button 
                onClick={handleProceedToCustomize}
                className="w-full py-4 bg-brand-darkBlue hover:bg-brand-blue text-white rounded-2xl font-sans font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Zap className="w-4 h-4 text-brand-gold" />
                <span>Customize & Order Now</span>
                <ArrowRight className="w-4 h-4 text-brand-gold" />
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button 
                  onClick={handleUploadArtwork}
                  className="py-2.5 bg-brand-base hover:bg-slate-200 text-brand-darkBlue rounded-xl font-sans font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Upload My Artwork</span>
                </button>
                <button 
                  onClick={handleQuickAddToCart}
                  className="py-2.5 bg-brand-gold hover:bg-brand-goldLight text-brand-darkBlue rounded-xl font-sans font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Check className="w-3.5 h-3.5 text-brand-darkBlue stroke-[2.5]" />
                  <span>Quick Add to Bag</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans font-semibold uppercase tracking-wider pt-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-brand-gold" /> Fast Door Delivery Across India
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" /> 100% Quality Satisfaction
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
