"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Trash2, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCart } from '@/lib/store/useCart';
import { cn } from '@/lib/utils';

const CartDrawer = () => {
  const { items, isOpen, setOpen, removeItem, updateQuantity, getTotalPrice, getItemCount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-pink-100 rounded-xl flex items-center justify-center text-brand-pink">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-brand-dark">
              Your Cart {mounted && `(${getItemCount()})`}
            </h2>
          </div>
          <button 
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
          {!mounted ? (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <div className="h-8 w-8 border-2 border-brand-pink/30 border-t-brand-pink rounded-full animate-spin"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-brand-pink/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center border border-gray-100 shadow-inner">
                  <ShoppingBag className="h-10 w-10 text-gray-200" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-brand-dark mb-3 tracking-tight">Your cart is empty</h3>
              <p className="text-gray-400 font-medium mb-10 max-w-[240px]">Customize your first high-quality print to see it appear here.</p>
              <button 
                onClick={() => setOpen(false)}
                className="group px-10 py-5 bg-brand-dark text-white font-black rounded-full hover:shadow-2xl hover:bg-brand-pink transition-all flex items-center gap-3"
              >
                Start Designing
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-24 h-24 bg-gray-100 rounded-2xl relative overflow-hidden flex-shrink-0">
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
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-brand-dark truncate">{item.product.name}</h4>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-brand-pink font-bold uppercase tracking-wider mb-2">
                       {item.quality_level} Quality
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center border border-gray-100 rounded-full px-2 py-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-brand-pink transition-colors disabled:opacity-30"
                          disabled={item.quantity <= item.product.moq}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-brand-pink transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-bold text-brand-dark">₹{(item.product.base_price || 0) * item.quantity}</span>
                    </div>
                    {item.quantity < item.product.moq && (
                       <p className="text-[10px] text-red-500 font-bold mt-2 uppercase tracking-tight">
                         Min. Order is {item.product.moq} units
                       </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {mounted && items.length > 0 && (
          <div className="p-6 border-t border-gray-100 space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-black text-2xl text-brand-dark">₹{getTotalPrice()}</span>
            </div>
            <p className="text-sm text-gray-400">
              Taxes and shipping calculated at checkout.
            </p>
            <Link 
              href="/checkout"
              onClick={() => setOpen(false)}
              className="w-full bg-brand-pink text-white flex items-center justify-center py-5 rounded-3xl font-black text-xl hover:shadow-2xl hover:shadow-pink-200 transition-all active:scale-95 group"
            >
              Checkout
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button 
              onClick={() => setOpen(false)}
              className="w-full text-center text-gray-400 font-bold hover:text-brand-dark transition-colors py-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
