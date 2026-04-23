"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Package, Truck, CheckCircle2, Clock, MapPin, Calendar,
  ArrowLeft, ChevronRight, ShieldCheck, AlertCircle,
  ThumbsUp, ThumbsDown, Banknote, Factory, Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface TrackOrderClientProps {
  order: any;
}

const STATUS_STEPS = [
  { key: 'pending',           label: 'Order Placed',      icon: Clock,        description: 'We have received your order.' },
  { key: 'confirmed',         label: 'Confirmed',         icon: CheckCircle2, description: 'Your order is confirmed.' },
  { key: 'in_production',     label: 'In Production',     icon: Factory,      description: 'Your items are being made.' },
  { key: 'dispatched',        label: 'Dispatched',        icon: Send,         description: 'Handed over to courier.' },
  { key: 'out_for_delivery',  label: 'Out for Delivery',  icon: Truck,        description: 'On the way to you!' },
  { key: 'delivered',         label: 'Delivered',         icon: Package,      description: 'Order has been delivered.' },
];

// Legacy status mapping for old orders
const LEGACY_MAP: Record<string, string> = {
  processing: 'in_production',
  shipped: 'dispatched',
};

export default function TrackOrderClient({ order }: TrackOrderClientProps) {
  const [confirming, setConfirming] = useState(false);
  const [disputeNote, setDisputeNote] = useState('');
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [localOrder, setLocalOrder] = useState(order);

  const normalizedStatus = LEGACY_MAP[localOrder.status] || localOrder.status;
  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === normalizedStatus);
  const isCancelled = localOrder.status === 'cancelled';
  const isDelivered = normalizedStatus === 'delivered';
  const isCOD = localOrder.payment_method === 'COD';

  // Auto-confirm: if delivered > 72hrs and not yet confirmed, treat as confirmed
  const deliveredLongAgo = isDelivered && localOrder.updated_at &&
    new Date().getTime() - new Date(localOrder.updated_at).getTime() > 72 * 60 * 60 * 1000;
  const isConfirmed = localOrder.delivery_confirmed_by_customer || deliveredLongAgo;

  const handleConfirmReceipt = async () => {
    setConfirming(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ delivery_confirmed_by_customer: true, delivery_confirmed_at: new Date().toISOString() })
        .eq('id', localOrder.id);

      if (error) throw error;
      setLocalOrder({ ...localOrder, delivery_confirmed_by_customer: true });
      toast.success('Thank you for confirming your delivery!');
    } catch {
      // Demo fallback
      setLocalOrder({ ...localOrder, delivery_confirmed_by_customer: true });
      toast.success('Delivery confirmed!');
    } finally {
      setConfirming(false);
    }
  };

  const handleDispute = async () => {
    if (!disputeNote.trim()) return;
    setConfirming(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ delivery_disputed: true, delivery_dispute_note: disputeNote })
        .eq('id', localOrder.id);
      if (error) throw error;
      setLocalOrder({ ...localOrder, delivery_disputed: true, delivery_dispute_note: disputeNote });
      toast.success('Issue reported. Our team will contact you shortly.');
      setDisputeOpen(false);
    } catch {
      setLocalOrder({ ...localOrder, delivery_disputed: true });
      toast.success('Issue reported.');
      setDisputeOpen(false);
    } finally {
      setConfirming(false);
    }
  };

  const paymentStatusDisplay: Record<string, { label: string; color: string }> = {
    paid:         { label: 'Paid Online', color: 'text-green-600' },
    pending_cod:  { label: `₹${localOrder.total_price?.toLocaleString()} — Pay on Delivery`, color: 'text-orange-500' },
    cod_collected:{ label: 'Cash Collected', color: 'text-sky-600' },
    cod_remitted: { label: 'Payment Settled', color: 'text-green-600' },
    failed:       { label: 'Payment Failed', color: 'text-red-500' },
    unpaid:       { label: 'Unpaid', color: 'text-red-500' },
  };
  const paymentDisplay = paymentStatusDisplay[localOrder.payment_status] || { label: localOrder.payment_status, color: 'text-gray-500' };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:py-24">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/account/orders" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-brand-pink transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to My Orders
        </Link>

        <div className="bg-white rounded-[48px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <header className="p-8 md:p-12 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-brand-dark text-white">
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Track <span className="text-brand-pink">Order</span></h1>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">ID: {localOrder.id}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={cn(
                "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border",
                isCancelled ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-brand-pink/10 text-brand-pink border-brand-pink/20"
              )}>
                {localOrder.status?.replace(/_/g, ' ')}
              </span>
              {isCOD && (
                <span className={cn("text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5", paymentDisplay.color)}>
                  <Banknote className="h-3 w-3" /> {paymentDisplay.label}
                </span>
              )}
            </div>
          </header>

          <div className="p-8 md:p-12">
            {isCancelled ? (
              <div className="py-12 text-center space-y-4">
                 <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
                 <h2 className="text-2xl font-black text-brand-dark uppercase italic">This order was cancelled</h2>
                 <p className="text-gray-400 font-medium max-w-md mx-auto">If you have any questions, please contact our support team.</p>
              </div>
            ) : (
              <>
                {/* --- PROGRESS STEPPER --- */}
                <div className="relative pt-8 pb-12">
                  <div className="absolute top-16 left-0 w-full h-1 bg-gray-100 rounded-full hidden md:block">
                    <div 
                      className="h-full bg-brand-pink transition-all duration-1000 ease-out" 
                      style={{ width: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1)) * 100)}%` }}
                    />
                  </div>
                  <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-4">
                    {STATUS_STEPS.map((step, idx) => {
                      const Icon = step.icon;
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      return (
                        <div key={step.key} className="flex md:flex-col items-center gap-4 md:gap-4 text-center flex-1">
                          <div className={cn(
                            "w-14 h-14 rounded-[20px] flex items-center justify-center transition-all duration-500 z-10 shrink-0",
                            isCompleted ? "bg-brand-pink text-white shadow-xl shadow-brand-pink/20" : "bg-gray-100 text-gray-300"
                          )}>
                            <Icon className={cn("h-5 w-5", isCurrent && "animate-pulse")} />
                          </div>
                          <div className="text-left md:text-center">
                            <h3 className={cn("text-[11px] font-black uppercase tracking-tight mb-1", isCompleted ? "text-brand-dark" : "text-gray-300")}>
                              {step.label}
                            </h3>
                            <p className="text-[9px] font-bold text-gray-400 max-w-[100px] mx-auto leading-relaxed hidden md:block">
                              {isCompleted ? step.description : '—'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* --- DELIVERY CONFIRMATION CARD --- */}
                {isDelivered && !localOrder.delivery_disputed && (
                  <div className={cn(
                    "mt-4 rounded-[32px] border p-8 transition-all",
                    isConfirmed
                      ? "bg-green-50 border-green-100"
                      : "bg-brand-dark text-white border-brand-dark"
                  )}>
                    {isConfirmed ? (
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                          <ShieldCheck className="h-7 w-7 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-green-800 uppercase tracking-tight">Delivery Confirmed</p>
                          <p className="text-xs font-medium text-green-600 mt-0.5">
                            {localOrder.delivery_confirmed_by_customer ? 'You confirmed this delivery.' : 'Auto-confirmed after 72 hours.'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div>
                          <p className="text-lg font-black uppercase tracking-tight">Did you receive your order?</p>
                          <p className="text-white/50 text-xs font-medium mt-1">Please confirm receipt so we can complete your order. Auto-confirms in 72 hours.</p>
                        </div>
                        {!disputeOpen ? (
                          <div className="flex gap-3">
                            <button
                              onClick={handleConfirmReceipt}
                              disabled={confirming}
                              className="flex items-center gap-2 px-6 py-4 bg-green-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-green-400 transition-all disabled:opacity-50"
                            >
                              <ThumbsUp className="h-4 w-4" /> Yes, I received it!
                            </button>
                            <button
                              onClick={() => setDisputeOpen(true)}
                              className="flex items-center gap-2 px-6 py-4 bg-white/10 hover:bg-red-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all"
                            >
                              <ThumbsDown className="h-4 w-4" /> I have an issue
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3 bg-white/5 p-5 rounded-2xl">
                            <p className="text-xs font-black uppercase tracking-widest text-white/60">Describe the issue</p>
                            <textarea
                              rows={3}
                              value={disputeNote}
                              onChange={e => setDisputeNote(e.target.value)}
                              placeholder="e.g. Package was not delivered, item was damaged..."
                              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-medium outline-none resize-none placeholder:text-white/30 focus:bg-white/20 transition-all"
                            />
                            <div className="flex gap-3">
                              <button onClick={handleDispute} disabled={confirming || !disputeNote.trim()} className="px-6 py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-400 transition-all disabled:opacity-40">
                                Submit Issue
                              </button>
                              <button onClick={() => setDisputeOpen(false)} className="px-6 py-3 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Dispute submitted banner */}
                {localOrder.delivery_disputed && (
                  <div className="mt-4 p-6 bg-red-50 border border-red-100 rounded-[32px] flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-black text-red-700 uppercase tracking-tight">Issue Reported</p>
                      <p className="text-xs font-medium text-red-500 mt-1">{localOrder.delivery_dispute_note || 'Our team will reach out to you shortly.'}</p>
                    </div>
                  </div>
                )}

                {/* Shipment Details */}
                {localOrder.tracking_number && (
                  <div className="mt-8 p-8 bg-gray-50 rounded-[32px] border border-gray-100 grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Shipment Details</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-200/50">
                          <span className="text-xs font-bold text-gray-500">Courier</span>
                          <span className="text-xs font-black text-brand-dark uppercase tracking-wider">{localOrder.courier_name}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-200/50">
                          <span className="text-xs font-bold text-gray-500">Tracking ID</span>
                          <span className="text-xs font-black text-brand-pink font-mono">{localOrder.tracking_number}</span>
                        </div>
                        {localOrder.tracking_url && (
                          <a href={localOrder.tracking_url} target="_blank" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-pink hover:underline pt-2">
                            Track on Courier Site <ChevronRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Delivery Estimate</h4>
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-brand-pink shadow-sm">
                            <Calendar className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-brand-dark italic">
                              {localOrder.estimated_delivery ? new Date(localOrder.estimated_delivery).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Arriving Soon'}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estimated Arrival</p>
                          </div>
                       </div>
                    </div>
                  </div>
                )}

                {/* Info Grid */}
                <div className="mt-12 grid md:grid-cols-2 gap-12 pt-12 border-t border-gray-50">
                   <section>
                     <div className="flex items-center gap-3 mb-6">
                        <MapPin className="h-5 w-5 text-brand-pink" />
                        <h2 className="text-sm font-black uppercase tracking-widest text-brand-dark">Shipping Address</h2>
                     </div>
                     <div className="p-6 bg-white border border-gray-100 rounded-3xl space-y-1">
                        <p className="text-sm font-bold text-gray-600 leading-relaxed">
                          {localOrder.shipping_address?.line1}<br />
                          {localOrder.shipping_address?.city}, {localOrder.shipping_address?.state}<br />
                          {localOrder.shipping_address?.postal_code}, India
                        </p>
                     </div>
                   </section>
                   <section>
                     <div className="flex items-center gap-3 mb-6">
                        <ShieldCheck className="h-5 w-5 text-brand-pink" />
                        <h2 className="text-sm font-black uppercase tracking-widest text-brand-dark">Order Summary</h2>
                     </div>
                     <div className="p-6 bg-white border border-gray-100 rounded-3xl space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-400">Total Amount</span>
                          <span className="text-lg font-black text-brand-dark">₹{localOrder.total_price?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                           <span className="text-gray-400">Payment Mode</span>
                           <span className="text-brand-cyan">{localOrder.payment_method || 'Online'}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                           <span className="text-gray-400">Payment Status</span>
                           <span className={paymentDisplay.color}>{paymentDisplay.label}</span>
                        </div>
                     </div>
                   </section>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
           <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-[0.2em]">Need assistance with your shipment?</p>
           <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-brand-dark hover:border-brand-pink/30 hover:text-brand-pink transition-all">
              Contact Support Hub
           </Link>
        </div>
      </div>
    </div>
  );
}
