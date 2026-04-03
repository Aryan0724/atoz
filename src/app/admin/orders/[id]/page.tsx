"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Box,
  ChevronRight,
  ExternalLink,
  Printer,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const fetchPromise = supabase
          .from('orders')
          .select('*, profiles(*), products(*)')
          .eq('id', id)
          .single();

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 3500)
        );

        const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

        if (error || !data) throw new Error('not found');
        setOrder(data);
      } catch {
        // Mock fallback for demo mode
        const mockOrders: Record<string, any> = {
          'ORD-1001': {
            id: 'ORD-1001', status: 'processing', payment_status: 'paid',
            total_price: 15600, quantity: 50, quality_level: 'Premium',
            created_at: new Date().toISOString(),
            design_data: { color: '#FFFFFF', print_method: 'DTG' },
            design_preview_url: null,
            shipping_address: { line1: '12 MG Road', city: 'Bangalore', state: 'Karnataka', postal_code: '560001' },
            razorpay_payment_id: 'pay_demo_001',
            profiles: { full_name: 'Aditya Raj', email: 'aditya@example.com', company_name: 'Raj Enterprises', gst_number: '29AABCT1332L1ZB', created_at: new Date().toISOString() },
            products: { name: 'Custom Premium T-Shirt', slug: 'custom-premium-tshirt', category: 'Apparel', base_price: 299, delivery_days: '5–7 business days', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'] },
          },
          'ORD-1002': {
            id: 'ORD-1002', status: 'shipped', payment_status: 'paid',
            total_price: 8400, quantity: 30, quality_level: 'Standard',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            design_data: { color: '#000000', print_method: 'Screen Print' },
            design_preview_url: null,
            shipping_address: { line1: '45 Linking Road', city: 'Mumbai', state: 'Maharashtra', postal_code: '400050' },
            razorpay_payment_id: 'pay_demo_002',
            profiles: { full_name: 'Priya Sharma', email: 'priya@example.com', company_name: null, gst_number: null, created_at: new Date().toISOString() },
            products: { name: 'Branded Ceramic Mug', slug: 'branded-ceramic-mug', category: 'Drinkware', base_price: 249, delivery_days: '3–5 business days', images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400'] },
          },
          'ORD-1003': {
            id: 'ORD-1003', status: 'pending', payment_status: 'pending',
            total_price: 22000, quantity: 100, quality_level: 'Luxury',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            design_data: { color: '#003366', print_method: 'Embroidery' },
            design_preview_url: null,
            shipping_address: { line1: '7 Connaught Place', city: 'New Delhi', state: 'Delhi', postal_code: '110001' },
            razorpay_payment_id: null,
            profiles: { full_name: 'Rohan Mehra', email: 'rohan@example.com', company_name: 'Mehra Corp', gst_number: '07AABCM1234L1ZX', created_at: new Date().toISOString() },
            products: { name: 'Corporate Polo T-Shirt', slug: 'corporate-polo-tshirt', category: 'Apparel', base_price: 199, delivery_days: '7–10 business days', images: ['https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400'] },
          },
          'ORD-1004': {
            id: 'ORD-1004', status: 'delivered', payment_status: 'paid',
            total_price: 5900, quantity: 25, quality_level: 'Standard',
            created_at: new Date(Date.now() - 259200000).toISOString(),
            design_data: { color: '#FFFFFF', print_method: 'DTG' },
            design_preview_url: null,
            shipping_address: { line1: '88 Anna Salai', city: 'Chennai', state: 'Tamil Nadu', postal_code: '600002' },
            razorpay_payment_id: 'pay_demo_004',
            profiles: { full_name: 'Sneha Kapur', email: 'sneha@example.com', company_name: null, gst_number: null, created_at: new Date().toISOString() },
            products: { name: 'Custom Notebook', slug: 'custom-notebook', category: 'Stationery', base_price: 199, delivery_days: '3–5 business days', images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=400'] },
          },
        };

        const mockOrder = mockOrders[id as string];
        if (mockOrder) {
          setOrder(mockOrder);
        }
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchOrder();
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error(`Error updating status: ${error.message}`);
    } else {
      setOrder({ ...order, status: newStatus });
    }
    setUpdating(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-pink"></div>
    </div>
  );

  if (!order) return (
    <div className="text-center py-20 px-4">
      <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-6" />
      <h1 className="text-2xl font-bold text-brand-dark mb-4">Order Not Found</h1>
      <button onClick={() => router.back()} className="text-brand-pink font-bold hover:underline">Go Back</button>
    </div>
  );

  const statusColors: any = {
    pending: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    processing: 'bg-blue-50 text-blue-600 border-blue-100',
    shipped: 'bg-purple-50 text-purple-600 border-purple-100',
    delivered: 'bg-green-50 text-green-600 border-green-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100'
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <Breadcrumbs items={[
             { label: 'Admin' },
             { label: 'Orders', href: '/admin/orders' },
             { label: `Order #${(id as string).slice(0, 8)}` }
           ]} className="mb-4" />
           <h1 className="text-4xl font-black text-brand-dark mb-2">Order Details</h1>
           <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 font-mono tracking-tight">{order.id}</span>
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                statusColors[order.status]
              )}>
                {order.status}
              </span>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2 px-6 py-3 border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-colors">
              <Printer className="h-4 w-4" />
              Invoice
           </button>
           <div className="flex rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              {['pending', 'processing', 'shipped', 'delivered'].map((s) => (
                <button
                  key={s}
                  disabled={updating || order.status === s}
                  onClick={() => updateStatus(s)}
                  className={cn(
                    "px-4 py-3 text-[9px] font-black uppercase tracking-widest transition-all",
                    order.status === s ? "bg-brand-dark text-white" : "bg-white text-gray-400 hover:bg-gray-50"
                  )}
                >
                  {s}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Product & Design */}
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Package className="h-5 w-5 text-brand-pink" />
                   <h2 className="text-lg font-black text-brand-dark uppercase tracking-tight">Product Information</h2>
                </div>
                <Link href={`/admin/products/edit/${order.products.slug}`} className="text-xs font-bold text-brand-pink flex items-center gap-1 hover:underline">
                  View Product <ExternalLink className="h-3 w-3" />
                </Link>
             </div>
             
             <div className="p-10 flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-48 aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shrink-0">
                   <img src={order.products.images[0]} alt={order.products.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-6">
                   <div>
                      <h3 className="text-2xl font-black text-brand-dark mb-1">{order.products.name}</h3>
                      <p className="text-sm text-gray-400 font-medium">Category: {order.products.category}</p>
                   </div>
                   
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Quantity</p>
                         <p className="text-lg font-black text-brand-dark">{order.quantity} Units</p>
                      </div>
                      <div className="p-4 bg-brand-lightGray rounded-2xl border border-gray-100">
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Quality</p>
                         <p className="text-lg font-black text-brand-dark">{order.quality_level}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Base Price</p>
                         <p className="text-lg font-black text-brand-dark">₹{order.products.base_price}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total</p>
                         <p className="text-lg font-black text-brand-pink text-nowrap">₹{order.total_price}</p>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          <section className="bg-brand-dark rounded-[40px] text-white overflow-hidden shadow-2xl relative">
             <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                   <Box className="h-5 w-5 text-brand-pink" />
                   <h2 className="text-lg font-black uppercase tracking-tight">Design & Customization</h2>
                </div>
                {order.design_preview_url && (
                  <a href={order.design_preview_url} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-all rounded-full text-[10px] font-black uppercase tracking-widest">
                    <Download className="h-3 w-3" />
                     Download Logo
                  </a>
                )}
             </div>

             <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                <div className="aspect-square bg-white/5 rounded-[40px] border border-white/10 flex items-center justify-center p-12 overflow-hidden group">
                   {order.design_preview_url ? (
                     <img src={order.design_preview_url} alt="Design Preview" className="w-full h-full object-contain drop-shadow-2xl transition-transform group-hover:scale-110 duration-500" />
                   ) : (
                     <div className="text-center">
                        <Package className="h-12 w-12 text-white/20 mx-auto mb-4" />
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">No Logo Uploaded</p>
                     </div>
                   )}
                </div>

                <div className="space-y-8">
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 block">Custom Selection Data</label>
                      <div className="space-y-3">
                         {Object.entries(order.design_data || {}).map(([key, value]: [string, any]) => (
                           <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{key.replace('_', ' ')}</span>
                              <span className="text-xs font-black">{value}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="p-6 bg-brand-pink/10 rounded-3xl border border-brand-pink/20">
                      <p className="text-[10px] font-black text-brand-pink uppercase tracking-widest mb-2">Production Note</p>
                      <p className="text-xs text-white/70 leading-relaxed font-medium">Verify transparency of logo files and color matching with the selected quality tier before starting the print run.</p>
                   </div>
                </div>
             </div>

             <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
          </section>
        </div>

        {/* Right: Customer & Logistics */}
        <div className="space-y-10 text-nowrap">
          <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                <User className="h-5 w-5 text-brand-pink" />
                <h2 className="text-lg font-black text-brand-dark uppercase tracking-tight">Customer</h2>
             </div>
             <div className="p-8 space-y-6">
                <div>
                   <h3 className="text-xl font-black text-brand-dark mb-1">{order.profiles.full_name}</h3>
                   <p className="text-sm text-gray-400 font-medium">{order.profiles.company_name || 'Individual Customer'}</p>
                </div>
                
                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                      <Clock className="h-4 w-4 text-gray-300" />
                      {order.profiles.gst_number || 'No GST Registered'}
                   </div>
                   <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                      <Calendar className="h-4 w-4 text-gray-300" />
                      Customer since {new Date(order.profiles.created_at).toLocaleDateString()}
                   </div>
                </div>
                
                <button className="w-full py-4 bg-gray-50 hover:bg-brand-pink hover:text-white transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500">
                   View Profile History
                </button>
             </div>
          </section>

          <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-brand-pink" />
                <h2 className="text-lg font-black text-brand-dark uppercase tracking-tight">Logistics</h2>
             </div>
             <div className="p-8 space-y-6">
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Shipping Address</p>
                   <p className="text-sm font-bold text-brand-dark leading-relaxed">
                      {order.shipping_address?.line1}<br />
                      {order.shipping_address?.city}, {order.shipping_address?.state}<br />
                      {order.shipping_address?.postal_code}, India
                   </p>
                </div>

                <div className="flex items-center gap-4 p-5 bg-brand-lightGray rounded-2xl border border-gray-100">
                   <Truck className="h-6 w-6 text-brand-pink shrink-0" />
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estimated Delivery</p>
                      <p className="text-sm font-black text-brand-dark">{order.products.delivery_days}</p>
                   </div>
                </div>
             </div>
          </section>

          <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-brand-pink" />
                <h2 className="text-lg font-black text-brand-dark uppercase tracking-tight">Payment</h2>
             </div>
             <div className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</span>
                   <span className={cn(
                     "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                     order.payment_status === 'paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                   )}>
                     {order.payment_status}
                   </span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gateway</span>
                   <span className="text-sm font-black text-brand-dark">Razorpay</span>
                </div>
                <div className="pt-4 border-t border-gray-50">
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Transaction ID</p>
                   <p className="text-xs font-bold text-brand-dark font-mono truncate">{order.razorpay_payment_id || 'N/A'}</p>
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
