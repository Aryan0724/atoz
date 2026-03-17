"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/store/useCart';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  Check, 
  ChevronRight,
  ShieldCheck,
  Truck
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { createOrder } from '@/lib/supabase/orderActions';

type Step = 'shipping' | 'review' | 'payment';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    router.push('/products');
    return null;
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 5000 ? 0 : 250;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Create orders for each item in cart
      // In a real app, we might have a single order with multiple items (order_items table)
      // but the current schema has 1 product per order record.
      for (const item of items) {
        await createOrder({
          product_id: item.product.id,
          quantity: item.quantity,
          quality_level: item.quality_level,
          design_data: item.design_data,
          design_preview_url: item.design_preview_url,
          total_price: (item.product.base_price || 0) * item.quantity,
          shipping_address: formData as any,
        });
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearCart();
      router.push('/checkout/success');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Order placement failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Checkout Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-brand-pink font-bold hover:translate-x-1 transition-transform mb-6">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Checkout</h1>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Main Checkout Flow (Left) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Stepper */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
              {[
                { id: 'shipping', label: 'Shipping', icon: <MapPin className="h-5 w-5" /> },
                { id: 'review', label: 'Review', icon: <ShoppingBag className="h-5 w-5" /> },
                { id: 'payment', label: 'Payment', icon: <CreditCard className="h-5 w-5" /> },
              ].map((s, idx) => (
                <React.Fragment key={s.id}>
                   <div className={cn(
                     "flex items-center gap-3 transition-colors",
                     step === s.id ? "text-brand-pink" : "text-gray-400"
                   )}>
                     <div className={cn(
                       "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                       step === s.id ? "bg-pink-50 text-brand-pink shadow-lg shadow-pink-100 scale-110" : "bg-gray-50"
                     )}>
                       {s.icon}
                     </div>
                     <span className="text-sm font-bold uppercase tracking-widest hidden sm:inline">{s.label}</span>
                   </div>
                   {idx < 2 && <div className="flex-1 h-px bg-gray-100 mx-4"></div>}
                </React.Fragment>
              ))}
            </div>

            {/* Step Content */}
            <div className="bg-white p-8 lg:p-12 rounded-[40px] shadow-sm border border-gray-100">
              {step === 'shipping' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-2xl font-bold text-brand-dark mb-8 flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-brand-pink" />
                    Shipping Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                       <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Full Name</label>
                       <input 
                         name="fullName"
                         value={formData.fullName}
                         onChange={handleInputChange}
                         className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-bold text-brand-dark"
                         placeholder="John Doe" 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Email</label>
                       <input 
                         name="email"
                         type="email"
                         value={formData.email}
                         onChange={handleInputChange}
                         className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-bold text-brand-dark"
                         placeholder="john@example.com" 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Phone</label>
                       <input 
                         name="phone"
                         value={formData.phone}
                         onChange={handleInputChange}
                         className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-bold text-brand-dark"
                         placeholder="+91 98765 43210" 
                       />
                    </div>
                    <div className="sm:col-span-2">
                       <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Address</label>
                       <textarea 
                         name="address"
                         value={formData.address}
                         onChange={handleInputChange}
                         rows={3}
                         className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-bold text-brand-dark"
                         placeholder="Street name, landmark..." 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">City</label>
                       <input 
                         name="city"
                         value={formData.city}
                         onChange={handleInputChange}
                         className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-bold text-brand-dark"
                         placeholder="Bangalore" 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Pincode</label>
                       <input 
                         name="pincode"
                         value={formData.pincode}
                         onChange={handleInputChange}
                         className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-bold text-brand-dark"
                         placeholder="560001" 
                       />
                    </div>
                  </div>
                  <button 
                    onClick={() => setStep('review')}
                    className="mt-12 w-full sm:w-auto px-12 py-5 bg-brand-dark text-white font-bold rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    Continue to Review
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}

              {step === 'review' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <h2 className="text-2xl font-bold text-brand-dark mb-8 flex items-center gap-3">
                    <ShoppingBag className="h-6 w-6 text-brand-pink" />
                    Review Your Order
                  </h2>
                  
                  <div className="space-y-6 mb-12">
                     {items.map((item) => (
                       <div key={item.id} className="flex gap-6 p-6 rounded-3xl bg-gray-50/50 border border-gray-100">
                         <div className="w-24 h-24 relative rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                           <Image 
                            src={item.design_preview_url || item.product.images?.[0] || ''} 
                            alt={item.product.name} 
                            fill 
                            className="object-cover" 
                           />
                         </div>
                         <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-brand-dark text-lg mb-1">{item.product.name}</h4>
                            <div className="flex flex-wrap gap-2 mb-3">
                               <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-black text-brand-pink uppercase tracking-widest">
                                 {item.quality_level} Quality
                               </span>
                               {item.design_data?.color && (
                                 <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                                   Color: <div className="h-2 w-2 rounded-full border border-gray-200" style={{ backgroundColor: item.design_data.color }}></div>
                                 </div>
                               )}
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-gray-400 font-bold">Qty: {item.quantity}</span>
                               <span className="font-black text-brand-dark">₹{(item.product.base_price || 0) * item.quantity}</span>
                            </div>
                         </div>
                       </div>
                     ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                     <button 
                       onClick={() => setStep('shipping')}
                       className="px-12 py-5 border-2 border-gray-100 text-brand-dark font-bold rounded-2xl hover:bg-gray-50 transition-all"
                     >
                       Edit Shipping
                     </button>
                     <button 
                       onClick={() => setStep('payment')}
                       className="flex-1 px-12 py-5 bg-brand-dark text-white font-bold rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                     >
                       Proceed to Payment
                       <ChevronRight className="h-5 w-5" />
                     </button>
                  </div>
                </div>
              )}

              {step === 'payment' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <h2 className="text-2xl font-bold text-brand-dark mb-8 flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-brand-pink" />
                    Payment Method
                  </h2>
                  
                  <div className="space-y-6 mb-12">
                     <div className="p-8 rounded-[32px] border-2 border-brand-pink bg-pink-50/20 relative group overflow-hidden">
                        <div className="relative z-10 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <CreditCard className="h-7 w-7 text-brand-pink" />
                              </div>
                              <div>
                                 <h4 className="font-black text-brand-dark tracking-tight">Razorpay Secure Checkout</h4>
                                 <p className="text-gray-500 text-sm font-medium">UPI, Cards, Netbanking & Wallets</p>
                              </div>
                           </div>
                           <div className="h-6 w-6 rounded-full border-2 border-brand-pink flex items-center justify-center">
                              <div className="h-3 w-3 bg-brand-pink rounded-full"></div>
                           </div>
                        </div>
                        {/* Decorative Background Icon */}
                        <CreditCard className="absolute -right-8 -bottom-8 h-40 w-40 text-brand-pink opacity-[0.03] rotate-12" />
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                     <button 
                       onClick={() => setStep('review')}
                       className="px-12 py-5 border-2 border-gray-100 text-brand-dark font-bold rounded-2xl hover:bg-gray-50 transition-all"
                     >
                       Back to Review
                     </button>
                     <button 
                       onClick={handlePlaceOrder}
                       disabled={isProcessing}
                       className="flex-1 px-12 py-5 bg-brand-pink text-white font-black text-xl rounded-2xl hover:shadow-2xl hover:shadow-pink-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                     >
                       {isProcessing ? (
                         <>
                           <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                           Securing Payment...
                         </>
                       ) : (
                         <>
                           <Check className="h-6 w-6" />
                           Pay ₹{total.toLocaleString()} & Place Order
                         </>
                       )}
                     </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary (Right) */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
             <div className="bg-brand-dark rounded-[40px] p-10 text-white sticky top-32 shadow-2xl shadow-gray-200">
                <h3 className="text-2xl font-bold mb-10 flex items-center gap-3">
                  Summary
                  <div className="h-1.5 w-10 bg-brand-pink rounded-full"></div>
                </h3>

                <div className="space-y-6 text-gray-400 font-bold text-sm mb-12">
                   <div className="flex justify-between items-center">
                      <span>Subtotal</span>
                      <span className="text-white">₹{subtotal.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span>Shipping</span>
                      <span className="text-white">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span>GST (18%)</span>
                      <span className="text-white">₹{tax.toLocaleString()}</span>
                   </div>
                   <div className="pt-6 border-t border-white/10 flex justify-between items-center text-xl text-white">
                      <span>Order Total</span>
                      <span className="font-black text-3xl text-brand-cyan tracking-tighter">₹{total.toLocaleString()}</span>
                   </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-white/10">
                   <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-pink/20 transition-colors">
                        <ShieldCheck className="h-5 w-5 text-brand-pink" />
                      </div>
                      <p className="text-[11px] font-medium leading-relaxed">Secure transaction backed by SSL & Razorpay.</p>
                   </div>
                   <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-cyan/20 transition-colors">
                        <Truck className="h-5 w-5 text-brand-cyan" />
                      </div>
                      <p className="text-[11px] font-medium leading-relaxed">Insured shipping with real-time tracking.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
