"use client";

import React, { useState } from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import { Search, Package, Printer, ShieldCheck, Truck, CheckCircle2, ArrowRight, Loader2, Mail, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import Button from '@/components/common/Button';

const STATUS_STEPS = [
  { id: 'pending', label: 'Order Placed', icon: Package, desc: 'Initial registration complete' },
  { id: 'processing', label: 'Printing', icon: Printer, desc: 'Your design is being materialized' },
  { id: 'shipped', label: 'Quality Audit', icon: ShieldCheck, desc: 'Final 5-step inspection' },
  { id: 'delivered', label: 'Dispatched', icon: Truck, desc: 'In transit to your location' }
];

export default function TrackClient() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !email) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('id', orderId)
        .eq('email', email)
        .single();

      if (error || !data) {
        throw new Error("Order not found. Please verify your credentials.");
      }

      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? 
    (order.status === 'delivered' ? 4 : 
     order.status === 'shipped' ? 3 : 
     order.status === 'processing' ? 2 : 1) 
    : 0;

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
            badge="Intelligence Portal"
            title="Track Your Order"
            subtitle="Monitor your premium prints as they journey through our precision engineering pipeline."
            align="center"
            className="text-brand-dark"
          />
        </motion.div>

        {/* Search Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-gray-100"
        >
          <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-6 items-end">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Order Identifier</label>
                <div className="relative group">
                   <Package className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brand-pink transition-colors" />
                   <input 
                     type="text" 
                     placeholder="Order UUID"
                     value={orderId}
                     onChange={(e) => setOrderId(e.target.value)}
                     className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black text-brand-dark focus:ring-4 focus:ring-brand-pink/10 outline-none transition-all"
                     required
                   />
                </div>
             </div>

             <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Protocol</label>
                <div className="relative group">
                   <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brand-pink transition-colors" />
                   <input 
                     type="email" 
                     placeholder="your@email.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black text-brand-dark focus:ring-4 focus:ring-brand-pink/10 outline-none transition-all"
                     required
                   />
                </div>
             </div>

             <button 
               type="submit" 
               disabled={loading}
               className="bg-brand-dark hover:bg-black text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
             >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Inject Intel"}
             </button>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-8 p-6 bg-red-50 rounded-2xl flex items-center gap-4 text-red-600 border border-red-100"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-xs font-black uppercase tracking-wider">{error}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {order && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="mt-12 space-y-8"
            >
              {/* Status Stepper */}
              <div className="bg-white rounded-[48px] p-10 md:p-16 shadow-2xl border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/5 rounded-full blur-3xl -mr-32 -mt-32" />
                
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-20">
                     <div>
                        <span className="text-[10px] font-black text-brand-pink uppercase tracking-[0.3em] mb-2 block">Current Pulse Status</span>
                        <h3 className="text-4xl font-black text-brand-dark uppercase italic tracking-tighter leading-none">
                          {order.status === 'delivered' ? 'Mission Complete' : 'In Production'}
                        </h3>
                     </div>
                     <div className="bg-gray-50 px-8 py-4 rounded-3xl border border-gray-100">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Estimated Arrival</span>
                        <span className="text-sm font-black text-brand-dark uppercase">
                          {order.estimated_delivery ? new Date(order.estimated_delivery).toLocaleDateString() : 'Analyzing...'}
                        </span>
                     </div>
                  </div>

                  <div className="relative flex flex-col md:flex-row justify-between gap-12">
                    {/* Progress Bar (Desktop) */}
                    <div className="absolute top-7 left-0 right-0 h-1 bg-gray-100 hidden md:block">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(currentStepIndex / 4) * 100}%` }}
                         className="h-full bg-brand-pink shadow-[0_0_10px_rgba(233,30,99,0.5)]"
                         transition={{ duration: 1.5, ease: "easeOut" }}
                       />
                    </div>

                    {STATUS_STEPS.map((step, idx) => {
                      const isActive = idx < currentStepIndex;
                      const isCurrent = idx === currentStepIndex - 1;
                      
                      return (
                        <div key={step.id} className="relative z-10 flex md:flex-col items-center gap-6 md:gap-4 md:text-center flex-1">
                          <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-xl",
                            isActive ? "bg-brand-pink text-white scale-110" : "bg-gray-50 text-gray-300 scale-100"
                          )}>
                             {isActive ? <CheckCircle2 className="w-7 h-7" /> : <step.icon className="w-6 h-6" />}
                          </div>
                          <div>
                            <h4 className={cn(
                              "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                              isActive ? "text-brand-dark" : "text-gray-300"
                            )}>
                              {step.label}
                            </h4>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1 hidden md:block">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl">
                    <h4 className="text-[11px] font-black text-brand-dark uppercase tracking-[0.3em] mb-8 pb-4 border-b border-gray-50">Logistical Metadata</h4>
                    <div className="space-y-6">
                       <div className="flex justify-between">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocol ID</span>
                          <span className="text-[10px] font-black text-brand-dark">#{order.id.slice(0, 8)}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Courier Entity</span>
                          <span className="text-[10px] font-black text-brand-dark uppercase">{order.courier_name || 'Allocating...'}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tracking Key</span>
                          <span className="text-[10px] font-black text-brand-pink tracking-widest uppercase">{order.tracking_number || 'Pending...'}</span>
                       </div>
                    </div>
                    {order.tracking_url && (
                      <a 
                        href={order.tracking_url} 
                        target="_blank" 
                        className="mt-10 w-full py-4 bg-gray-50 hover:bg-brand-pink hover:text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                      >
                         Live Courier Tracking <ArrowRight className="w-3 h-3" />
                      </a>
                    )}
                 </div>

                 <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl">
                    <h4 className="text-[11px] font-black text-brand-dark uppercase tracking-[0.3em] mb-8 pb-4 border-b border-gray-50">Payload Contents</h4>
                    <div className="space-y-6">
                       {order.order_items?.map((item: any) => (
                         <div key={item.id} className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-brand-pink">
                               <Package className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                               <p className="text-[10px] font-black text-brand-dark uppercase truncate max-w-[150px]">{item.products?.name}</p>
                               <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                            </div>
                            <span className="text-[10px] font-black text-brand-dark">₹{item.price}</span>
                         </div>
                       ))}
                       <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aggregate Total</span>
                          <span className="text-xl font-black text-brand-dark italic tracking-tighter leading-none">₹{order.total_amount}</span>
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
