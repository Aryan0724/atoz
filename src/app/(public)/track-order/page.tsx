"use client";

import React, { useState } from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import { Search, Package, CheckCircle2, Factory, ShieldCheck, MapPin, Box } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    setIsSearching(true);
    // Simulate API fetch
    setTimeout(() => {
      setOrderData({
        id: orderId,
        status: 'In Transit',
        orderDate: 'Oct 12, 2023',
        estimateDelivery: 'Oct 18, 2023',
        currentLocation: 'Hub- Bengaluru, India',
        steps: [
          { label: 'Order Confirmed', time: 'Oct 12, 10:30 AM', completed: true },
          { label: 'Design Approved', time: 'Oct 12, 02:45 PM', completed: true },
          { label: 'In Production', time: 'Oct 13, 11:00 AM', completed: true },
          { label: 'Quality Checked', time: 'Oct 14, 09:15 AM', completed: true },
          { label: 'Shipped', time: 'Oct 14, 04:30 PM', completed: true, active: true },
          { label: 'Out for Delivery', time: 'Pending', completed: false },
          { label: 'Delivered', time: 'Pending', completed: false },
        ]
      });
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeading 
          badge="Live Status"
          title="Track Your Impressions"
          subtitle="Enter your order ID found in your confirmation email to see real-time production and shipping status."
          align="center"
        />

        <div className="mt-16 bg-brand-lightGray rounded-[48px] p-8 md:p-12 border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-100">
          <form onSubmit={handleTrack} className="relative flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-grow">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Enter Order ID (e.g. AZ-99210)" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                className="w-full pl-16 pr-8 py-5 rounded-full bg-white border border-transparent focus:border-brand-pink/20 outline-none font-bold text-brand-dark transition-all shadow-sm"
              />
            </div>
            <button 
              type="submit"
              disabled={isSearching}
              className="px-10 py-5 bg-brand-dark text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-brand-pink transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSearching ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Locating...
                </>
              ) : (
                "Trace Order"
              )}
            </button>
          </form>

          {orderData ? (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-white rounded-3xl border border-gray-50">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Current Status</p>
                  <h3 className="text-2xl font-black text-brand-pink flex items-center gap-3">
                    <Package className="h-6 w-6" />
                    {orderData.status}
                  </h3>
                </div>
                <div className="flex gap-12">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Expected By</p>
                    <p className="font-bold text-brand-dark">{orderData.estimateDelivery}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Carrier</p>
                    <p className="font-bold text-brand-dark">AtoZ Express</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                {orderData.steps.map((step: any, idx: number) => (
                  <div key={idx} className="relative pl-12">
                    <div className={cn(
                      "absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-brand-lightGray z-10 transition-colors duration-500",
                      step.completed ? "bg-brand-pink" : "bg-gray-200",
                      step.active && "animate-pulse bg-brand-pink"
                    )}>
                      {step.completed && <div className="h-4 w-4 text-white absolute -left-[2px] -top-[2px]"><CheckCircle2 className="h-4 w-4" /></div>}
                    </div>
                    <div>
                      <h4 className={cn(
                        "font-black text-sm uppercase tracking-widest",
                        step.completed ? "text-brand-dark" : "text-gray-300"
                      )}>
                        {step.label}
                      </h4>
                      <p className="text-xs font-bold text-gray-400 mt-1">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 pt-12 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="flex items-start gap-4">
                   <div className="p-3 bg-cyan-50 rounded-2xl">
                     <MapPin className="h-5 w-5 text-brand-cyan" />
                   </div>
                   <div>
                     <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Last Logged At</p>
                     <p className="text-sm font-bold text-brand-dark">{orderData.currentLocation}</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-4">
                   <div className="p-3 bg-pink-50 rounded-2xl">
                     <ShieldCheck className="h-5 w-5 text-brand-pink" />
                   </div>
                   <div>
                     <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Verified Shipment</p>
                     <p className="text-sm font-bold text-brand-dark">Electronic Proof of Delivery Active</p>
                   </div>
                 </div>
              </div>
            </div>
          ) : !isSearching && orderId && (
             <div className="text-center py-20 bg-white rounded-[40px] animate-in fade-in zoom-in duration-300">
                <Box className="h-16 w-16 text-gray-100 mx-auto mb-6" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Waiting for trace command...</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
