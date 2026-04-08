"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight, Minus, Plus, Zap, Pencil, Upload, Package, ChevronRight } from 'lucide-react';
import { useCart } from '@/lib/store/useCart';
import { cn } from '@/lib/utils';

const DesignChoiceModal = ({ onClose, onConfirm }: { onClose: () => void; onConfirm: (choice: 'design' | 'import' | 'plain') => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden"
      onClick={e => e.stopPropagation()}
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] px-8 pt-8 pb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">Before you checkout…</h2>
        <p className="text-white/60 text-sm mt-1 font-medium">How would you like to proceed with your order?</p>
      </div>

      {/* Options */}
      <div className="p-6 space-y-3">
        <button
          onClick={() => onConfirm('design')}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-brand-pink bg-pink-50/50 hover:bg-pink-50 transition-all group text-left"
        >
          <div className="w-12 h-12 bg-brand-pink rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-lg shadow-pink-200">
            <Pencil className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-black text-brand-dark text-sm">Design Now</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Open the customizer and add your artwork</p>
          </div>
          <ChevronRight className="w-4 h-4 text-brand-pink opacity-60 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => onConfirm('import')}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-brand-dark/20 hover:bg-gray-50 transition-all group text-left"
        >
          <div className="w-12 h-12 bg-[#1a1a1a] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-lg shadow-gray-200">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-black text-brand-dark text-sm">Import a Design File</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Upload your own artwork (PNG, SVG, PDF)</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 opacity-60 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => onConfirm('plain')}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all group text-left"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Package className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex-1">
            <p className="font-black text-brand-dark text-sm">Order Plain Item</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">No design needed, plain bulk order</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 opacity-60 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="px-6 pb-6 text-center">
        <p className="text-[10px] text-gray-400 font-medium">You can always add or change your design later</p>
      </div>
    </motion.div>
  </motion.div>
);

const CartDrawer = () => {
  const { items, isOpen, setOpen, removeItem, updateQuantity, getTotalPrice, getItemCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const [showDesignModal, setShowDesignModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCheckoutClick = () => {
    setOpen(false);
    router.push('/checkout');
  };

  const handleDesignChoice = (choice: 'design' | 'import' | 'plain') => {
    setShowDesignModal(false);
    setOpen(false);

    if (choice === 'design') {
      const firstItem = items[0];
      if (firstItem) {
        router.push(`/customize/${firstItem.product.slug}`);
      } else {
        router.push('/products');
      }
    } else if (choice === 'import') {
      const firstItem = items[0];
      if (firstItem) {
        router.push(`/customize/${firstItem.product.slug}?tab=uploads`);
      } else {
        router.push('/products');
      }
    } else {
      router.push('/checkout');
    }
  };

  return (
    <>
      <AnimatePresence>
        {showDesignModal && (
          <DesignChoiceModal
            onClose={() => setShowDesignModal(false)}
            onConfirm={handleDesignChoice}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-dark/40 backdrop-blur-md z-[100] cursor-pointer"
              onClick={() => setOpen(false)}
            />

            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-white/90 backdrop-blur-2xl z-[101] shadow-[-20px_0_80px_rgba(0,0,0,0.1)] flex flex-col border-l border-white/20"
            >
              <div className="flex items-center justify-between px-8 py-10 border-b border-gray-100/50">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-brand-pink/10 rounded-[22px] flex items-center justify-center text-brand-pink shadow-inner">
                    <ShoppingBag className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-brand-dark tracking-tight">
                      Review Cart
                    </h2>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                      {getItemCount()} {getItemCount() === 1 ? 'Product' : 'Products'} added
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setOpen(false)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-100/80 rounded-2xl transition-all active:scale-90"
                >
                  <X className="h-7 w-7 text-brand-dark" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative mb-10"
                    >
                      <div className="absolute inset-0 bg-brand-pink/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="relative w-32 h-32 bg-gray-50/50 rounded-[40px] flex items-center justify-center border border-gray-100 shadow-xl overflow-hidden">
                         <ShoppingBag className="h-12 w-12 text-gray-200" />
                         <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-50">
                            <Zap className="w-6 h-6 text-brand-pink animate-bounce" />
                         </div>
                      </div>
                    </motion.div>
                    <h3 className="text-3xl font-black text-brand-dark mb-4 tracking-tighter italic uppercase underline decoration-brand-pink decoration-8 underline-offset-4">Empty Canvas</h3>
                    <p className="text-gray-400 font-bold mb-12 max-w-[280px] leading-relaxed">Your creativity is waiting. Add some high-end prints to your collection.</p>
                    <button 
                      onClick={() => setOpen(false)}
                      className="group px-12 py-6 bg-brand-dark text-white font-black rounded-3xl hover:shadow-[0_20px_40px_rgba(235,51,126,0.3)] hover:bg-brand-pink transition-all flex items-center gap-4"
                    >
                      Explore Catalog
                      <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-500" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {items.map((item, idx) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-6 group relative"
                      >
                        <div className="w-28 h-32 bg-gray-50 rounded-[28px] relative overflow-hidden flex-shrink-0 border border-gray-100 transition-transform duration-500 group-hover:scale-105 shadow-sm">
                          {item.design_preview_url ? (
                            <Image 
                              src={item.design_preview_url} 
                              alt={item.product.name} 
                              fill 
                              className="object-cover"
                            />
                          ) : (
                            <Image 
                              src={item.product.images?.[0] || ''} 
                              alt={item.product.name} 
                              fill 
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="text-lg font-black text-brand-dark group-hover:text-brand-pink transition-colors line-clamp-1 tracking-tight">
                                {item.product.name}
                              </h4>
                              <button 
                                onClick={() => removeItem(item.id)}
                                className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                               <div className="w-1.5 h-1.5 bg-brand-pink rounded-full animate-pulse" />
                               <p className="text-[10px] text-brand-pink font-black uppercase tracking-[0.15em]">
                                  {item.quality_level} Quality
                               </p>
                            </div>
                          </div>

                          <div className="flex items-end justify-between mt-4">
                            <div className="flex items-center bg-gray-50/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-1 shadow-inner">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-xl hover:text-brand-pink transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                disabled={item.quantity <= item.product.moq}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-3 text-sm font-black text-brand-dark min-w-[40px] text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-xl hover:text-brand-pink transition-all"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="text-right">
                               <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total</div>
                               <span className="text-xl font-black text-brand-dark tracking-tighter italic">₹{(item.product.base_price || 0) * item.quantity}</span>
                            </div>
                          </div>
                          {item.quantity < item.product.moq && (
                             <div className="mt-3 py-1 px-3 bg-red-50 text-[10px] text-red-500 font-black rounded-lg uppercase tracking-tight flex items-center gap-1.5 border border-red-100">
                               <Zap className="w-3 h-3" />
                               Min. Order is {item.product.moq} units
                             </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-10 bg-white border-t border-gray-100/50 space-y-8 shadow-[0_-20px_60px_rgba(0,0,0,0.04)]">
                  <div className="flex justify-between items-center bg-gray-50/80 p-8 rounded-[32px] border border-gray-100 shadow-inner">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Grand Total Cost</span>
                      <div className="flex items-baseline gap-1">
                         <span className="text-xl font-black text-brand-dark italic mb-1 tracking-tighter">₹</span>
                         <span className="text-4xl font-black text-brand-dark tracking-tighter italic leading-none">{getTotalPrice().toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="h-10 w-px bg-gray-200" />
                    <div className="text-right">
                      <span className="text-[10px] font-black text-brand-pink uppercase tracking-widest block mb-1">Impact Status</span>
                      <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest bg-brand-cyan/20 px-3 py-1.5 rounded-full ring-4 ring-brand-cyan/5">Standard Pack</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={handleCheckoutClick}
                      className="flex-1 bg-brand-dark text-white flex items-center justify-center py-6 rounded-[28px] font-black text-xl uppercase tracking-[0.2em] hover:bg-brand-pink shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:shadow-brand-pink/20 transition-all active:scale-95 group"
                    >
                      Process Checkout
                      <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-500 shrink-0" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;
