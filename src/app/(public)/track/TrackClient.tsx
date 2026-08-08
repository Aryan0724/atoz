"use client";

import React, { useState } from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import { Search, Package, Printer, ShieldCheck, Truck, CheckCircle2, ArrowRight, Loader2, Mail, AlertCircle, Box, Clock, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import Button from '@/components/common/Button';

const STATUS_STEPS = [
  { id: 'pending', label: 'Order Placed', icon: Package, desc: 'Order received & registered' },
  { id: 'confirmed', label: 'Confirmed', icon: CheckCircle2, desc: 'Artwork approved for print' },
  { id: 'in_production', label: 'Printing', icon: Printer, desc: 'High-precision production underway' },
  { id: 'dispatched', label: 'Dispatched', icon: Truck, desc: 'Handed over to delivery courier' },
  { id: 'delivered', label: 'Delivered', icon: ShieldCheck, desc: 'Safely arrived at your doorstep' }
];

export default function TrackClient() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = orderId.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanId || !cleanEmail) {
      setError("Please enter both your Order ID and Email address.");
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      // 1. Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*, profiles(*)')
        .eq('id', cleanId)
        .single();

      if (orderError || !orderData) {
        throw new Error("Order not found. Please double-check your Order ID.");
      }

      // Verify email
      const orderEmail = (orderData.shipping_address?.email || orderData.profiles?.email || '').toLowerCase().trim();
      if (cleanEmail && orderEmail && orderEmail !== cleanEmail) {
        throw new Error("The email address provided does not match the record for this Order ID.");
      }

      // 2. Fetch order items with products
      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*, product:products(*)')
        .eq('order_id', cleanId);

      setOrder({
        ...orderData,
        order_items: itemsData || []
      });
    } catch (err: any) {
      setError(err.message || "Unable to find order details. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 1;
      case 'confirmed': return 2;
      case 'in_production':
      case 'processing': return 3;
      case 'dispatched':
      case 'shipped':
      case 'out_for_delivery': return 4;
      case 'delivered': return 5;
      default: return 1;
    }
  };

  const currentStepIndex = order ? getStepIndex(order.status) : 0;

  return (
    <div className="bg-[#F9F9F7] min-h-screen pt-32 pb-24 relative overflow-hidden text-brand-dark selection:bg-brand-pink/10 selection:text-brand-pink">
      {/* Background Elements */}
      <div className="absolute top-0 inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-pink/5 blur-[150px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-cyan/5 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <SectionHeading 
            badge="Live Tracking"
            title="Track Your Order"
            subtitle="Monitor your custom prints live as they move through precision manufacturing and courier delivery."
            align="center"
            className="text-brand-dark"
          />
        </motion.div>

        {/* Search Form Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-gray-100"
        >
          <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_auto] gap-6 items-end">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Order Identifier</label>
                <div className="relative group">
                   <Package className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brand-pink transition-colors" />
                   <input 
                     type="text" 
                     placeholder="e.g. 12345678-..."
                     value={orderId}
                     onChange={(e) => setOrderId(e.target.value)}
                     required
                     className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-xs font-black tracking-wider focus:outline-none focus:border-brand-pink focus:bg-white transition-all shadow-inner font-mono"
                   />
                </div>
             </div>

             <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Recipient Email</label>
                <div className="relative group">
                   <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brand-pink transition-colors" />
                   <input 
                     type="email" 
                     placeholder="name@company.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                     className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-xs font-bold focus:outline-none focus:border-brand-pink focus:bg-white transition-all shadow-inner"
                   />
                </div>
             </div>

             <Button 
               type="submit" 
               disabled={loading}
               variant="primary"
               className="h-[52px] px-8 rounded-2xl shadow-xl shadow-pink-500/10 active:scale-95 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
             >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <span>Locate</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
             </Button>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-500 text-xs font-bold"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Tracking Details Display */}
        <AnimatePresence>
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="mt-12 space-y-8"
            >
              {/* Status Stepper Card */}
              <div className="bg-white rounded-[48px] p-10 md:p-14 shadow-2xl border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/5 rounded-full blur-3xl -mr-32 -mt-32" />
                
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                     <div>
                        <span className="text-[10px] font-black text-brand-pink uppercase tracking-[0.3em] mb-2 block">Live Production Status</span>
                        <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tight">
                          {order.status?.replace(/_/g, ' ')}
                        </h3>
                     </div>
                     <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Est. Arrival Date</span>
                        <span className="text-sm font-black text-brand-dark">
                          {order.estimated_delivery ? new Date(order.estimated_delivery).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '7–10 Working Days'}
                        </span>
                     </div>
                  </div>

                  {/* Stepper Steps */}
                  <div className="relative grid grid-cols-1 md:grid-cols-5 gap-6">
                    {STATUS_STEPS.map((step, idx) => {
                      const isActive = idx < currentStepIndex;
                      const isCurrent = idx === currentStepIndex - 1;
                      
                      return (
                        <div key={step.id} className="relative z-10 flex md:flex-col items-center gap-4 md:text-center">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-md",
                            isActive ? "bg-brand-pink text-white scale-105" : "bg-gray-100 text-gray-400"
                          )}>
                             {isActive ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
                          </div>
                          <div>
                            <h4 className={cn(
                              "text-[11px] font-black uppercase tracking-wider transition-colors",
                              isActive ? "text-brand-dark" : "text-gray-400"
                            )}>
                              {step.label}
                            </h4>
                            <p className="text-[9px] text-gray-400 mt-0.5 hidden md:block">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Logistics & Contents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Logistics Info */}
                 <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-xl">
                    <h4 className="text-xs font-black text-brand-dark uppercase tracking-widest mb-6 pb-4 border-b border-gray-50 flex items-center gap-2">
                      <Truck className="h-4 w-4 text-brand-pink" /> Courier & Delivery
                    </h4>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-400 uppercase tracking-wider">Order ID</span>
                          <span className="font-black text-brand-dark font-mono">#{order.id.slice(0, 8).toUpperCase()}</span>
                       </div>
                       <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-400 uppercase tracking-wider">Courier Partner</span>
                          <span className="font-bold text-brand-dark">{order.courier_name || 'Assigned upon dispatch'}</span>
                       </div>
                       <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-400 uppercase tracking-wider">Tracking Number</span>
                          <span className="font-black text-brand-pink font-mono">{order.tracking_number || 'Generated when shipped'}</span>
                       </div>
                       <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-400 uppercase tracking-wider">Payment</span>
                          <span className="font-bold text-brand-dark">{order.payment_method || 'Online'} ({order.payment_status === 'paid' ? 'Paid' : 'Pending'})</span>
                       </div>
                    </div>
                    {order.tracking_url && (
                      <a 
                        href={order.tracking_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-8 w-full py-4 bg-brand-dark text-white hover:bg-brand-pink rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all"
                      >
                         Live Courier Tracking <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                 </div>

                 {/* Order Contents */}
                 <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-xl">
                    <h4 className="text-xs font-black text-brand-dark uppercase tracking-widest mb-6 pb-4 border-b border-gray-50 flex items-center gap-2">
                      <Package className="h-4 w-4 text-brand-pink" /> Ordered Custom Items
                    </h4>
                    <div className="space-y-4">
                       {(order.order_items || []).map((item: any) => {
                         const product = item.product || {};
                         const img = item.design_preview_url || product.images?.[0];
                         return (
                           <div key={item.id} className="flex items-center gap-4 p-2 bg-gray-50 rounded-2xl border border-gray-100">
                              <div className="w-14 h-14 bg-white rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-gray-200">
                                {img ? (
                                  <img src={img} alt="Item" className="w-full h-full object-cover" />
                                ) : (
                                  <Package className="w-6 h-6 text-brand-pink" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <p className="text-xs font-black text-brand-dark truncate">{product.name || 'Custom Print Item'}</p>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qty: {item.quantity} · {item.quality_level || 'Standard'}</p>
                              </div>
                              <span className="text-xs font-black text-brand-dark">₹{(item.unit_price * item.quantity).toLocaleString()}</span>
                           </div>
                         );
                       })}
                       <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Price</span>
                          <span className="text-xl font-black text-brand-pink">₹{order.total_price?.toLocaleString()}</span>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
