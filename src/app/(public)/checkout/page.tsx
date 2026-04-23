"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/store/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  Check, 
  ChevronRight,
  ShieldCheck,
  Truck,
  Zap,
  Package,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { createOrder } from '@/lib/supabase/orderActions';
import { useAuth } from '@/components/providers/AuthProvider';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { trackInitiateCheckout, trackPurchase } from '@/lib/analytics/meta-pixel';

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
  const [promoCode, setPromoCode] = useState('');
  const [promoData, setPromoData] = useState<any>(null); // real coupon from DB
  const [isPromoValid, setIsPromoValid] = useState<boolean | null>(null);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'Online' | 'COD'>('Online');

  const { user } = useAuth();

  const [attemptIds, setAttemptIds] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    if (user) {
      loadUserProfile();
    }
    
    // Meta Ads Tracking - Initiate Checkout
    if (items.length > 0) {
      trackInitiateCheckout(getTotalPrice(), items.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Track checkout attempts for abandoned cart analytics
  useEffect(() => {
    const recordAttempts = async () => {
      if (items.length > 0 && mounted) {
        // We only want to record once per mount/items change
        const attempts = items.map(item => ({
          user_id: user?.id || null,
          product_id: item.product.id,
          quantity: item.quantity,
          quality_level: item.quality_level,
          total_price: (item.product.base_price || 0) * item.quantity,
          status: 'pending'
        }));

        const { data, error } = await supabase
          .from('checkout_attempts')
          .insert(attempts)
          .select('id');

        if (data) {
          setAttemptIds(data.map(d => d.id));
        }
      }
    };
    
    if (mounted && items.length > 0 && attemptIds.length === 0) {
      recordAttempts();
    }
  }, [mounted, items, user, attemptIds]);

  const loadUserProfile = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (profile) {
        const address = profile.addresses?.[0] || {};
        setFormData(prev => ({
          ...prev,
          fullName: profile.full_name || prev.fullName,
          email: profile.email || prev.email,
          phone: profile.phone || prev.phone,
          address: address.street || prev.address,
          city: address.city || prev.city,
          state: address.state || prev.state,
          pincode: address.pincode || prev.pincode,
        }));
      }
    } catch (err) {
      console.error('Failed to load profile for checkout:', err);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    router.push('/products');
    return null;
  }

  const subtotal = getTotalPrice();
  // Calculate promo discount from real DB data or fallback
  const promoDiscountPct = promoData?.discount_type === 'percentage' ? promoData.discount_value : 0;
  const promoDiscountFixed = promoData?.discount_type === 'fixed' ? promoData.discount_value : 0;
  const promoDiscount = isPromoValid
    ? promoDiscountFixed > 0
      ? Math.min(promoDiscountFixed, subtotal)
      : Math.round(subtotal * (promoDiscountPct / 100))
    : 0;
  const baseShipping = subtotal > 5000 ? 0 : 250;
  const shipping = shippingMethod === 'express' ? baseShipping + 500 : baseShipping;
  const tax = Math.round((subtotal - promoDiscount) * 0.18);
  const total = subtotal - promoDiscount + shipping + tax;

  const handlePromoApply = async () => {
    if (!promoCode.trim()) return;
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !data) {
        setIsPromoValid(false);
        setPromoData(null);
        toast.error('Invalid or expired promo code.');
        return;
      }
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setIsPromoValid(false);
        setPromoData(null);
        toast.error('This promo code has expired.');
        return;
      }
      if (data.min_order_amount && subtotal < data.min_order_amount) {
        setIsPromoValid(false);
        setPromoData(null);
        toast.error(`Min order of ₹${data.min_order_amount} required for this code.`);
        return;
      }
      setIsPromoValid(true);
      setPromoData(data);
      toast.success(`${data.code} applied! ${data.description}`);
    } catch {
      setIsPromoValid(false);
      toast.error('Could not validate promo code.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      const res = await loadRazorpayScript();

      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setIsProcessing(false);
        return;
      }

      const result = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });

      if (!result.ok) {
        toast.error("Server error generating order. Please try again.");
        setIsProcessing(false);
        return;
      }

      const orderData = await result.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock',
        amount: orderData.amount,
        currency: orderData.currency,
        name: "A to Z Prints",
        description: "Premium Print Checkout",
        order_id: orderData.mock ? undefined : orderData.id,
        handler: async function (response: any) {
          try {
            if (attemptIds.length > 0) {
              await supabase
                .from('checkout_attempts')
                .update({ status: 'successful' })
                .in('id', attemptIds);
            }

            for (const item of items) {
              await createOrder({
                user_id: user?.id || null,
                product_id: item.product.id,
                quantity: item.quantity,
                quality_level: item.quality_level,
                design_data: item.design_data,
                design_preview_url: item.design_preview_url,
                total_price: item.unitPrice ? item.unitPrice * item.quantity : (item.product.base_price || 0) * item.quantity,
                shipping_address: formData as any,
                payment_method: 'Online',
                payment_status: 'paid',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
              });
            }
            
            trackPurchase(response.razorpay_order_id || 'manual', total, items);
            clearCart();
            router.push('/checkout/success');
          } catch (err) {
            console.error('Failed to record order to DB:', err);
            toast.error("Payment succeeded, but failed to save order to Database.");
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#e81cff",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      
      paymentObject.on('payment.failed', function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
      });

      paymentObject.open();
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Order placement failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlaceCODOrder = async () => {
    setIsProcessing(true);
    try {
      for (const item of items) {
        await createOrder({
          user_id: user?.id || null,
          product_id: item.product.id,
          quantity: item.quantity,
          quality_level: item.quality_level,
          design_data: item.design_data,
          design_preview_url: item.design_preview_url,
          total_price: item.unitPrice ? item.unitPrice * item.quantity : (item.product.base_price || 0) * item.quantity,
          shipping_address: formData as any,
          payment_method: 'COD',
          payment_status: 'pending_cod',
        });
      }
      clearCart();
      router.push('/checkout/success');
    } catch (err) {
      toast.error('Failed to place COD order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: 'shipping', label: 'Shipping', icon: <MapPin className="h-5 w-5" /> },
    { id: 'review', label: 'Review', icon: <ShoppingBag className="h-5 w-5" /> },
    { id: 'payment', label: 'Payment', icon: <CreditCard className="h-5 w-5" /> },
  ];

  return (
    <div className="bg-white min-h-screen pb-24 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-brand-pink/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-brand-cyan/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="mb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-brand-pink font-black text-[10px] uppercase tracking-[0.3em] hover:translate-x-1 transition-transform mb-8 group">
             <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center group-hover:bg-brand-pink group-hover:text-white transition-all">
                <ArrowLeft className="h-4 w-4" />
             </div>
             Back to Store
          </Link>
          <div className="flex items-end gap-4">
             <h1 className="text-6xl font-black text-brand-dark tracking-tighter leading-none uppercase">Check<span className="text-brand-pink underline-offset-8 decoration-8 decoration-brand-pink/10 underline">out</span></h1>
             <div className="h-2 w-20 bg-brand-pink rounded-full mb-2"></div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8 space-y-12">
            <div className="relative">
               <div className="absolute top-1/2 left-0 w-full h-px bg-gray-100 -translate-y-1/2" />
               <div className="relative flex justify-between items-center px-4">
                  {steps.map((s, idx) => {
                    const isActive = step === s.id;
                    const isCompleted = steps.findIndex(x => x.id === step) > idx;

                    return (
                        <div key={s.id} className="relative z-10 flex flex-col items-center">
                          <button 
                            onClick={() => (isCompleted || isActive) && setStep(s.id as Step)}
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border-2",
                              isActive ? "bg-brand-dark text-white border-brand-dark scale-110 shadow-xl shadow-brand-dark/10" : 
                              isCompleted ? "bg-brand-pink text-white border-brand-pink shadow-lg shadow-brand-pink/10" : "bg-white text-gray-300 border-gray-100"
                            )}
                          >
                             {isCompleted ? <Check className="w-5 h-5" /> : s.icon}
                          </button>
                          <span className={cn(
                            "absolute top-14 text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-colors",
                            isActive ? "text-brand-dark" : "text-gray-300"
                          )}>{s.label}</span>
                       </div>
                    );
                  })}
               </div>
            </div>

            <motion.div 
              layout
              className="mt-20 bg-white/40 backdrop-blur-xl border border-gray-100 rounded-[48px] p-8 lg:p-14 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]"
            >
              <AnimatePresence mode="wait">
                {step === 'shipping' && (
                  <motion.div 
                    key="shipping"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-brand-pink/10 flex items-center justify-center">
                          <MapPin className="text-brand-pink w-6 h-6" />
                       </div>
                       <div>
                          <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Shipping Details</h2>
                          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Where should we send your order?</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       <div className="sm:col-span-2 space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                          <input 
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full px-8 py-5 rounded-[24px] bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-bold text-brand-dark shadow-inner"
                            placeholder="Recipient's Name" 
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Work Email</label>
                          <input 
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-8 py-5 rounded-[24px] bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-bold text-brand-dark shadow-inner"
                            placeholder="name@gmail.com" 
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                          <input 
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-8 py-5 rounded-[24px] bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-bold text-brand-dark shadow-inner"
                            placeholder="+91 Phone Number" 
                          />
                       </div>
                       <div className="sm:col-span-2 space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Delivery Address</label>
                          <textarea 
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-8 py-5 rounded-[24px] bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-bold text-brand-dark shadow-inner resize-none"
                            placeholder="Street, Landmark, Business Center..." 
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                          <input 
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-8 py-5 rounded-[24px] bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-bold text-brand-dark shadow-inner"
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pincode</label>
                          <input 
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className="w-full px-8 py-5 rounded-[24px] bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-bold text-brand-dark shadow-inner"
                          />
                       </div>
                    </div>

                    {/* Shipping Method Selector */}
                    <div className="space-y-6 pt-10 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                         <Truck className="w-5 h-5 text-brand-pink" />
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipping Method</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                          onClick={() => setShippingMethod('standard')}
                          className={cn(
                            "group p-6 rounded-[32px] border-2 transition-all text-left",
                            shippingMethod === 'standard' ? "border-brand-pink bg-pink-50/20" : "border-gray-50 bg-gray-50/50 hover:border-gray-200"
                          )}
                        >
                           <div className="flex items-center justify-between mb-4">
                              <div className={cn("w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors", shippingMethod === 'standard' ? "border-brand-pink bg-brand-pink text-white" : "border-gray-300 group-hover:border-brand-pink")}>
                                 {shippingMethod === 'standard' && <Check className="w-4 h-4" />}
                              </div>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Standard</span>
                           </div>
                           <div className="font-black text-brand-dark text-lg uppercase italic leading-tight">Standard Shipping</div>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">7-10 Working Days</p>
                        </button>
                        <button 
                          onClick={() => setShippingMethod('express')}
                          className={cn(
                            "group p-6 rounded-[32px] border-2 transition-all text-left relative overflow-hidden",
                            shippingMethod === 'express' ? "border-brand-cyan bg-cyan-50/20" : "border-gray-50 bg-gray-50/50 hover:border-gray-200"
                          )}
                        >
                           <div className="absolute top-0 right-0 px-3 py-1.5 bg-brand-cyan text-white text-[8px] font-black uppercase tracking-widest rounded-bl-2xl">Urgent</div>
                           <div className="flex items-center justify-between mb-4">
                              <div className={cn("w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors", shippingMethod === 'express' ? "border-brand-cyan bg-brand-cyan text-white" : "border-gray-300 group-hover:border-brand-cyan")}>
                                 {shippingMethod === 'express' && <Check className="w-4 h-4" />}
                              </div>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Express</span>
                           </div>
                           <div className="font-black text-brand-dark text-lg uppercase italic leading-tight">Express Delivery</div>
                           <p className="text-[10px] text-brand-cyan font-black uppercase tracking-widest mt-2">3-5 Working Days (+₹500)</p>
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => setStep('review')}
                      disabled={!formData.email || !formData.fullName || !formData.address}
                      className="w-full py-5 bg-brand-dark text-white font-black rounded-2xl text-base uppercase tracking-[0.2em] hover:bg-brand-pink shadow-xl shadow-brand-dark/10 transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:grayscale italic group"
                    >
                      Step Two: Review
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}

                {step === 'review' && (
                  <motion.div 
                    key="review"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 flex items-center justify-center">
                          <ShoppingBag className="text-brand-cyan w-6 h-6" />
                       </div>
                       <div>
                          <h2 className="text-2xl font-black text-brand-dark italic uppercase tracking-tight">Order Review</h2>
                          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Check your items before payment</p>
                       </div>
                    </div>
                    
                    <div className="space-y-8">
                       {items.map((item) => (
                         <div key={item.id} className="group relative flex gap-8 p-8 rounded-[32px] bg-gray-50/50 border border-gray-100 hover:border-brand-pink/20 transition-all">
                           <div className="w-32 h-32 relative rounded-[24px] overflow-hidden shadow-2xl flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                             <Image 
                               src={item.design_preview_url || item.product.images?.[0] || ''} 
                               alt={item.product.name} 
                               fill 
                               className="object-cover" 
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                           </div>
                           <div className="flex-1 min-w-0 py-2">
                              <h4 className="font-black text-brand-dark text-2xl tracking-tight mb-2 uppercase italic">{item.product.name}</h4>
                              <div className="flex flex-wrap gap-2 mb-6">
                                 <span className="px-4 py-1.5 bg-white border border-gray-100 rounded-full text-[10px] font-black text-brand-pink uppercase tracking-[0.1em] shadow-sm">
                                   {item.quality_level} Class
                                 </span>
                                 {item.design_data?.color && (
                                   <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] shadow-sm">
                                     Tone: <div className="h-2.5 w-2.5 rounded-full border border-gray-200" style={{ backgroundColor: item.design_data.color }}></div>
                                   </div>
                                 )}
                              </div>
                              <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                                 <div className="text-gray-400 font-black text-xs uppercase tracking-widest">Quantity: <span className="text-brand-dark text-lg ml-1">{item.quantity}</span></div>
                                 <div className="font-black text-2xl text-brand-dark tracking-tighter italic">₹{(item.product.base_price || 0) * item.quantity}</div>
                              </div>
                           </div>
                         </div>
                       ))}
                    </div>

                       <div className="flex flex-col sm:flex-row gap-5 pt-8">
                        <button 
                          onClick={() => setStep('shipping')}
                          className="px-6 py-3 border-2 border-gray-100 text-brand-dark/40 font-black rounded-2xl hover:bg-gray-50 hover:text-brand-dark hover:border-gray-200 transition-all uppercase tracking-[0.2em] text-[9px] italic"
                        >
                          Edit Details
                        </button>
                        <button 
                          onClick={() => setStep('payment')}
                          className="flex-1 px-8 py-5 bg-brand-dark text-white font-black rounded-2xl text-base uppercase tracking-[0.2em] hover:bg-brand-pink shadow-xl shadow-brand-dark/10 hover:shadow-brand-pink/20 transition-all flex items-center justify-center gap-4 italic group"
                        >
                          Step Three: Payment
                          <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                     </div>
                  </motion.div>
                )}

                {step === 'payment' && (
                  <motion.div 
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-brand-lime/10 flex items-center justify-center">
                          <CreditCard className="text-brand-lime w-6 h-6" />
                       </div>
                       <div>
                          <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Secure Payment</h2>
                          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Safe and secure payment gateway</p>
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       {/* Razorpay Option */}
                       <button
                         onClick={() => setSelectedPaymentMethod('Online')}
                         className={cn(
                           "w-full p-8 rounded-[32px] border-2 transition-all text-left relative overflow-hidden group",
                           selectedPaymentMethod === 'Online' ? "border-brand-pink bg-pink-50/20" : "border-gray-100 bg-gray-50/50 hover:border-gray-200"
                         )}
                       >
                         <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                                 <CreditCard className="h-7 w-7 text-brand-pink" />
                               </div>
                               <div>
                                  <h4 className="font-black text-brand-dark text-lg tracking-tight uppercase">Pay Online</h4>
                                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest">UPI · Card · Netbanking · Wallet</p>
                               </div>
                            </div>
                            <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                              selectedPaymentMethod === 'Online' ? "border-brand-pink bg-brand-pink" : "border-gray-300"
                            )}>
                              {selectedPaymentMethod === 'Online' && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                         </div>
                         <CreditCard className="absolute -right-8 -bottom-8 h-32 w-32 text-brand-pink opacity-[0.04]" />
                       </button>

                       {/* Cash on Delivery Option */}
                       <button
                         onClick={() => setSelectedPaymentMethod('COD')}
                         className={cn(
                           "w-full p-8 rounded-[32px] border-2 transition-all text-left relative overflow-hidden group",
                           selectedPaymentMethod === 'COD' ? "border-amber-400 bg-amber-50/20" : "border-gray-100 bg-gray-50/50 hover:border-gray-200"
                         )}
                       >
                         <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                                 <Package className="h-7 w-7 text-amber-500" />
                               </div>
                               <div>
                                  <h4 className="font-black text-brand-dark text-lg tracking-tight uppercase">Cash on Delivery</h4>
                                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Pay when you receive your order</p>
                               </div>
                            </div>
                            <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                              selectedPaymentMethod === 'COD' ? "border-amber-400 bg-amber-400" : "border-gray-300"
                            )}>
                              {selectedPaymentMethod === 'COD' && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                         </div>
                       </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                       <button 
                         onClick={() => setStep('review')}
                         className="px-8 py-4 border-2 border-gray-100 text-brand-dark font-black rounded-2xl hover:bg-gray-50 transition-all uppercase tracking-[0.2em] text-[10px]"
                       >
                         Review Items
                       </button>
                       <button 
                         onClick={selectedPaymentMethod === 'COD' ? handlePlaceCODOrder : handlePlaceOrder}
                         disabled={isProcessing}
                         className={cn(
                           "flex-1 px-10 py-5 font-black text-lg rounded-2xl hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-4 disabled:opacity-50 italic group text-white",
                           selectedPaymentMethod === 'COD'
                             ? "bg-amber-500 shadow-amber-500/20 hover:bg-amber-400"
                             : "bg-brand-pink shadow-brand-pink/10 hover:shadow-brand-pink/20"
                         )}
                       >
                         {isProcessing ? (
                           <>
                             <div className="h-5 w-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                             Processing...
                           </>
                         ) : selectedPaymentMethod === 'COD' ? (
                           <>
                             <Package className="h-5 w-5" />
                             Confirm COD Order (₹{total.toLocaleString()})
                           </>
                         ) : (
                           <>
                             <Check className="h-6 w-6 group-hover:scale-110 transition-transform" />
                             Pay Now (₹{total.toLocaleString()})
                           </>
                         )}
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="lg:col-span-4 mt-16 lg:mt-0">
             <div className="bg-brand-dark rounded-[48px] p-12 text-white sticky top-32 shadow-[0_50px_100px_rgba(0,0,0,0.2)] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                
                <h3 className="text-3xl font-black mb-12 flex items-center justify-between italic tracking-tight">
                  Summary
                  <Package className="h-6 w-6 text-brand-pink opacity-50" />
                </h3>

                <div className="space-y-8 font-bold text-[10px] uppercase tracking-[0.2em] mb-12 border-t border-white/5 pt-12">
                   <div className="flex justify-between items-center text-white/60">
                      <span>Subtotal</span>
                      <span className="text-white font-black tracking-tight">₹{subtotal.toLocaleString()}</span>
                   </div>
                 {isPromoValid && promoData && (
                     <div className="flex justify-between items-center text-brand-pink">
                        <span>Discount ({promoData.code})</span>
                        <span className="font-black tracking-tight">-₹{promoDiscount.toLocaleString()}</span>
                     </div>
                   )}
                   <div className="flex justify-between items-center text-white/60">
                      <span>Shipping ({shippingMethod})</span>
                      <span className={cn("font-black tracking-tight", shipping === 0 ? "text-brand-lime" : "text-white")}>
                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                      </span>
                   </div>
                   <div className="flex justify-between items-center text-white/60">
                      <span>GST (18%)</span>
                      <span className="text-white font-black tracking-tight">₹{tax.toLocaleString()}</span>
                   </div>
                   <div className="pt-10 border-t border-white/10 flex flex-col gap-3">
                       <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-brand-pink animate-pulse" />
                          <span className="text-brand-pink/60 text-[9px] font-black uppercase tracking-[0.25em]">Grand Total</span>
                       </div>
                       <div className="flex justify-between items-end">
                          <div className="flex items-baseline gap-1">
                             <span className="text-brand-cyan text-xl font-black mb-1">₹</span>
                             <span className="text-5xl font-black tracking-tighter leading-none text-white drop-shadow-2xl">
                                {total.toLocaleString()}
                             </span>
                          </div>
                          <div className="text-right pb-1">
                             <span className="text-[8px] text-white/20 font-black tracking-[0.3em] block">SECURE PAYMENT</span>
                             <span className="text-[10px] text-brand-pink font-black tracking-widest">INR</span>
                          </div>
                       </div>
                    </div>
                </div>

                {/* Promo Code Input */}
                <div className="mb-12">
                   <div className="flex gap-2">
                     <input 
                       type="text" 
                       placeholder="PROMO CODE" 
                       value={promoCode}
                       onChange={(e) => setPromoCode(e.target.value)}
                       className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 flex-1 text-xs font-black placeholder:text-white/20 text-white focus:bg-white/20 transition-all outline-none"
                     />
                     <button 
                       onClick={handlePromoApply}
                       className="bg-brand-pink text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-brand-pink transition-all"
                     >
                       Apply
                     </button>
                   </div>
                </div>

                <div className="space-y-8 pt-10 border-t border-white/10">
                   <div className="flex items-center gap-4 group/item">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover/item:bg-brand-pink/20 transition-all border border-white/5">
                        <ShieldCheck className="h-6 w-6 text-brand-pink" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest leading-normal">Safe & Secure</p>
                         <p className="text-[9px] text-white/30 font-bold tracking-tight mt-0.5">Your payment is protected</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 group/item">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover/item:bg-brand-cyan/20 transition-all border border-white/5">
                        <Truck className="h-6 w-6 text-brand-cyan" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest leading-normal">Fast Delivery</p>
                         <p className="text-[9px] text-white/30 font-bold tracking-tight mt-0.5">Est Delivery: 3-5 Working Days</p>
                      </div>
                   </div>
                </div>
                
                <div className="mt-12 pt-10 border-t border-white/10 text-center">
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40">
                      <Zap className="w-3 h-3 text-brand-pink" />
                      Auto-Processing Enabled
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
