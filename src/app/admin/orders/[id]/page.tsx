"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { 
  ArrowLeft, Package, User, MapPin, Calendar, CreditCard, Clock,
  CheckCircle2, AlertCircle, Truck, Box, ChevronRight, ExternalLink,
  Printer, Download, DollarSign, ShieldAlert, ShieldCheck, Banknote,
  MessageSquare, ChevronDown, ArrowRight, Mail, Eye, RefreshCw
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
  const [sendingEmail, setSendingEmail] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [trackingInfo, setTrackingInfo] = useState({
    tracking_number: '',
    courier_name: '',
    estimated_delivery: '',
    tracking_url: ''
  });

  useEffect(() => {
    if (order) {
      setTrackingInfo({
        tracking_number: order.tracking_number || '',
        courier_name: order.courier_name || '',
        estimated_delivery: order.estimated_delivery ? new Date(order.estimated_delivery).toISOString().split('T')[0] : '',
        tracking_url: order.tracking_url || ''
      });
      setAdminNotes(order.admin_notes || '');
    }
  }, [order]);

  const updateTrackingInfo = async () => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update(trackingInfo)
        .eq('id', id);

      if (error) throw error;
      toast.success('Tracking information updated');
      setOrder({ ...order, ...trackingInfo });
    } catch (error: any) {
      console.warn('[Demo Mode] Tracking update skipped.', error.message);
      toast.info('Tracking updated locally');
      setOrder({ ...order, ...trackingInfo });
    } finally {
      setUpdating(false);
    }
  };

  const [customCreds, setCustomCreds] = useState({ email: '', password: '' });
  const [showCredsModal, setShowCredsModal] = useState(false);

  const shipWithShiprocket = async (overrideCreds?: { email?: string; password?: string }) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/shipping/ship-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: id,
          credentials: overrideCreds || (customCreds.email && customCreds.password ? customCreds : undefined)
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to ship order');
      }
      
      setShowCredsModal(false);
      toast.success(`Pushed to Shiprocket! Shipment ID: ${data.shipment_id || 'Created'}`);
      fetchOrder();
    } catch (error: any) {
      console.error('[Ship With Shiprocket Error]:', error);
      toast.error(error.message || 'Shiprocket Error');
      if (error.message?.toLowerCase().includes('auth') || error.message?.toLowerCase().includes('403') || error.message?.toLowerCase().includes('invalid')) {
        setShowCredsModal(true);
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleResendEmail = async () => {
    setSendingEmail(true);
    try {
      const res = await fetch('/api/orders/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send confirmation email');
      
      toast.success('Order confirmation email sent successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Could not send confirmation email');
    } finally {
      setSendingEmail(false);
    }
  };

  async function fetchOrder() {
    try {
      setLoading(true);
      // Fetch order with profiles
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .select('*, profiles(*)')
        .eq('id', id)
        .single();

      if (orderErr || !orderData) {
        throw new Error('Order not found in database');
      }

      // Fetch order items with products
      const { data: itemsData, error: itemsErr } = await supabase
        .from('order_items')
        .select('*, product:products(*)')
        .eq('order_id', id);

      if (itemsErr) {
        console.warn('[OrderDetail] Order items query error:', itemsErr);
      }

      setOrder({
        ...orderData,
        order_items: itemsData || []
      });
    } catch (fetchErr: any) {
      console.warn('[OrderDetail] Fetch failed, checking mock orders:', fetchErr.message);

      const mockOrders: Record<string, any> = {
        '11111111-1111-4111-a111-111111111111': {
          id: '11111111-1111-4111-a111-111111111111', status: 'processing', payment_status: 'paid',
          total_price: 15600, payment_method: 'Online',
          created_at: new Date().toISOString(),
          shipping_address: { fullName: 'Aditya Raj', email: 'aditya@example.com', phone: '9876543210', address: '12 MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
          razorpay_payment_id: 'pay_demo_001',
          profiles: { full_name: 'Aditya Raj', email: 'aditya@example.com', company_name: 'Raj Enterprises', gst_number: '29AABCT1332L1ZB' },
          order_items: [
            {
              id: 'item-1',
              quantity: 50,
              quality_level: 'Premium',
              unit_price: 299,
              design_preview_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
              design_data: { color: '#FFFFFF', print_method: 'DTG' },
              product: { name: 'Custom Premium T-Shirt', slug: 'custom-premium-tshirt', category: 'Apparel', base_price: 299, images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'] }
            }
          ]
        },
        '22222222-2222-4222-a222-222222222222': {
          id: '22222222-2222-4222-a222-222222222222', status: 'shipped', payment_status: 'paid',
          total_price: 8400, payment_method: 'Online',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          shipping_address: { fullName: 'Priya Sharma', email: 'priya@example.com', phone: '9876543211', address: '45 Linking Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400050' },
          razorpay_payment_id: 'pay_demo_002',
          profiles: { full_name: 'Priya Sharma', email: 'priya@example.com' },
          order_items: [
            {
              id: 'item-2',
              quantity: 30,
              quality_level: 'Standard',
              unit_price: 249,
              design_preview_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
              design_data: { color: '#000000', print_method: 'Screen Print' },
              product: { name: 'Branded Ceramic Mug', slug: 'branded-ceramic-mug', category: 'Drinkware', base_price: 249, images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400'] }
            }
          ]
        }
      };

      const mockOrder = mockOrders[id as string];
      if (mockOrder) {
        setOrder(mockOrder);
      } else {
        setOrder(null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const updateOrderField = async (fields: Record<string, any>) => {
    setUpdating(true);
    setOrder({ ...order, ...fields });
    try {
      const { error } = await supabase.from('orders').update(fields).eq('id', id);
      if (error) throw error;
      toast.success('Order updated!');
    } catch (err: any) {
      toast.info('Updated locally');
    } finally {
      setUpdating(false);
    }
  };

  const updateStatus = (newStatus: string) => updateOrderField({ status: newStatus });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-pink"></div>
    </div>
  );

  if (!order) return (
    <div className="text-center py-20 px-4 max-w-md mx-auto">
      <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-6" />
      <h1 className="text-2xl font-bold text-brand-dark mb-2">Order Not Found</h1>
      <p className="text-sm text-gray-500 mb-6">Could not find order ID: <span className="font-mono text-xs">{id}</span></p>
      <div className="flex gap-4 justify-center">
        <button onClick={() => router.push('/admin/orders')} className="px-6 py-3 bg-brand-dark text-white rounded-2xl text-xs font-bold hover:bg-gray-800 transition-all">All Orders</button>
        <button onClick={() => fetchOrder()} className="px-6 py-3 bg-gray-100 text-brand-dark rounded-2xl text-xs font-bold hover:bg-gray-200 transition-all flex items-center gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    </div>
  );

  const statusColors: any = {
    pending: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    pending_approval: 'bg-orange-50 text-orange-600 border-orange-100',
    confirmed: 'bg-sky-50 text-sky-600 border-sky-100',
    in_production: 'bg-blue-50 text-blue-600 border-blue-100',
    dispatched: 'bg-violet-50 text-violet-600 border-violet-100',
    out_for_delivery: 'bg-orange-50 text-orange-600 border-orange-100',
    delivered: 'bg-green-50 text-green-600 border-green-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100'
  };

  const isCOD = order.payment_method === 'COD';

  const lifecycleActions: Record<string, { label: string; next: string; color: string }[]> = {
    pending_approval: [{ label: 'Approve Order', next: 'pending', color: 'bg-emerald-600' }],
    pending: isCOD
      ? [{ label: 'Confirm COD Order', next: 'confirmed', color: 'bg-sky-500' }]
      : [{ label: 'Start Production', next: 'in_production', color: 'bg-blue-500' }],
    confirmed: [{ label: 'Start Production', next: 'in_production', color: 'bg-blue-500' }],
    in_production: [{ label: 'Mark Dispatched', next: 'dispatched', color: 'bg-violet-500' }],
    dispatched: [{ label: 'Out for Delivery', next: 'out_for_delivery', color: 'bg-orange-500' }],
    out_for_delivery: [{ label: 'Mark Delivered', next: 'delivered', color: 'bg-green-500' }],
    delivered: [],
    cancelled: [],
  };
  const nextActions = lifecycleActions[order.status] || [];

  const items = order.order_items && order.order_items.length > 0
    ? order.order_items
    : [
        {
          id: 'primary-item',
          quantity: order.quantity || 1,
          quality_level: order.quality_level || 'Standard',
          unit_price: order.total_price || 0,
          design_preview_url: order.design_preview_url,
          design_data: order.design_data,
          product: order.products || { name: 'Custom Print Item', slug: '', category: 'Custom', images: [] }
        }
      ];

  const customerName = order.profiles?.full_name || order.shipping_address?.fullName || 'Guest Customer';
  const customerEmail = order.profiles?.email || order.shipping_address?.email || 'N/A';
  const customerPhone = order.profiles?.phone || order.shipping_address?.phone || 'N/A';

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 p-6 md:p-10">
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
                statusColors[order.status] || 'bg-gray-50 text-gray-500'
              )}>
                {order.status?.replace(/_/g, ' ')}
              </span>
           </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
           <button 
             onClick={handleResendEmail}
             disabled={sendingEmail}
             className="flex items-center gap-2 px-5 py-3 border border-brand-pink/20 bg-brand-pink/5 hover:bg-brand-pink hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest text-brand-pink transition-all disabled:opacity-50"
             title="Send or resend order confirmation email to customer"
           >
              <Mail className="h-4 w-4" />
              {sendingEmail ? 'Sending Email...' : 'Send Confirmation Email'}
           </button>

           <button 
             onClick={() => window.print()}
             className="flex items-center gap-2 px-5 py-3 border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-colors"
           >
              <Printer className="h-4 w-4" /> Print / Invoice
           </button>

           {nextActions.map(action => (
             <button
               key={action.next}
               disabled={updating}
               onClick={() => updateStatus(action.next)}
               className={cn("flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white transition-all hover:opacity-90 disabled:opacity-50 shadow-lg", action.color)}
             >
               {action.label} <ArrowRight className="h-3.5 w-3.5" />
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Ordered Items & Final Design Previews */}
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-6">
            <h2 className="text-xl font-black text-brand-dark uppercase tracking-tight flex items-center gap-3">
              <Package className="h-6 w-6 text-brand-pink" />
              Ordered Items & Custom Designs ({items.length})
            </h2>

            {items.map((item: any, idx: number) => {
              const product = item.product || {};
              const designImg = item.design_preview_url || product.images?.[0];
              const designData = item.design_data || {};

              return (
                <div key={item.id || idx} className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden space-y-6">
                  {/* Product Header */}
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-pink block mb-1">Item #{idx + 1}</span>
                      <h3 className="text-2xl font-black text-brand-dark">{product.name || 'Custom Print Product'}</h3>
                      {product.category && <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{product.category}</p>}
                    </div>
                    {product.slug && (
                      <Link href={`/admin/products/edit/${product.slug}`} className="text-xs font-bold text-brand-pink flex items-center gap-1 hover:underline">
                        Edit Product <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>

                  {/* Product Details Grid */}
                  <div className="px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Quantity</p>
                      <p className="text-lg font-black text-brand-dark">{item.quantity} Units</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Quality Level</p>
                      <p className="text-lg font-black text-brand-dark">{item.quality_level || 'Standard'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Unit Price</p>
                      <p className="text-lg font-black text-brand-dark">₹{item.unit_price}</p>
                    </div>
                    <div className="p-4 bg-brand-pink/5 rounded-2xl border border-brand-pink/20">
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-pink mb-1">Subtotal</p>
                      <p className="text-lg font-black text-brand-pink">₹{(item.unit_price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Final Custom Design Preview Card */}
                  <div className="p-8 bg-brand-dark text-white rounded-[32px] mx-8 mb-8">
                    <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                      <div className="flex items-center gap-3">
                        <Box className="h-5 w-5 text-brand-pink" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-white">Client Custom Design</h4>
                      </div>
                      {designImg && (
                        <a 
                          href={designImg} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          download={`order_${order.id.slice(0,8)}_item_${idx+1}.png`}
                          className="flex items-center gap-2 px-4 py-2 bg-brand-pink text-white hover:bg-white hover:text-brand-dark transition-all rounded-full text-[10px] font-black uppercase tracking-widest"
                        >
                          <Download className="h-3.5 w-3.5" /> Download Design
                        </a>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      {/* Image Viewer */}
                      <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center p-6 overflow-hidden relative group">
                        {designImg ? (
                          <img 
                            src={designImg} 
                            alt={`Design for ${product.name}`} 
                            className="w-full h-full object-contain drop-shadow-2xl transition-transform group-hover:scale-105 duration-300"
                          />
                        ) : (
                          <div className="text-center p-6">
                            <Package className="h-12 w-12 text-white/20 mx-auto mb-3" />
                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">No custom preview available</p>
                          </div>
                        )}
                      </div>

                      {/* Design Metadata / Canvas Data */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Design Parameters</label>
                        
                        {designData.color && (
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                            <span className="text-xs font-bold text-white/70">Selected Base Color</span>
                            <div className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full border border-white/30 inline-block" style={{ backgroundColor: designData.color }}></span>
                              <span className="text-xs font-mono font-bold text-white">{designData.color}</span>
                            </div>
                          </div>
                        )}

                        {designData.vdpData && (
                          <div className="p-4 bg-brand-cyan/10 rounded-2xl border border-brand-cyan/20 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase tracking-widest text-brand-cyan">VDP Data Source</span>
                              <span className="text-xs font-black text-white">{designData.vdpData.rows?.length || 0} Records</span>
                            </div>
                            <button 
                              onClick={() => {
                                const v = designData.vdpData;
                                const csvContent = "data:text/csv;charset=utf-8," + v.headers.join(",") + "\n" + v.rows.map((r: any) => v.headers.map((h: any) => `"${r[h] || ''}"`).join(",")).join("\n");
                                const link = document.createElement("a");
                                link.setAttribute("href", encodeURI(csvContent));
                                link.setAttribute("download", `vdp_data_${order.id.slice(0,8)}.csv`);
                                link.click();
                              }}
                              className="w-full py-2 bg-brand-cyan text-brand-dark text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-colors"
                            >
                              Download VDP CSV
                            </button>
                          </div>
                        )}

                        {designData.canvasState && (
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/60 block">Canvas State Layers</span>
                              <span className="text-xs font-bold text-white/40">Fabric.js Vector Objects</span>
                            </div>
                            <button 
                              onClick={() => {
                                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(designData.canvasState, null, 2));
                                const link = document.createElement("a");
                                link.setAttribute("href", dataStr);
                                link.setAttribute("download", `canvas_data_${order.id.slice(0,8)}.json`);
                                link.click();
                              }}
                              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5"
                            >
                              <Download className="h-3 w-3" /> Export JSON
                            </button>
                          </div>
                        )}

                        <div className="p-4 bg-brand-pink/10 rounded-2xl border border-brand-pink/20">
                          <p className="text-[10px] font-black text-brand-pink uppercase tracking-widest mb-1">Production Quality Check</p>
                          <p className="text-xs text-white/70 leading-relaxed">Ensure high resolution (300 DPI) rendering before initiating printing on this garment/item.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Customer Details, Logistics, Payment */}
        <div className="space-y-8">
          {/* Customer Details */}
          <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                <User className="h-5 w-5 text-brand-pink" />
                <h2 className="text-lg font-black text-brand-dark uppercase tracking-tight">Customer Information</h2>
             </div>
             <div className="p-8 space-y-6">
                <div>
                   <h3 className="text-xl font-black text-brand-dark mb-1">{customerName}</h3>
                   <p className="text-sm text-gray-400 font-medium">{order.profiles?.company_name || 'Direct Retail Buyer'}</p>
                </div>
                
                <div className="space-y-3 pt-2 border-t border-gray-50">
                   <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="font-semibold select-all">{customerEmail}</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CreditCard className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="font-semibold">{customerPhone}</span>
                   </div>
                   {order.profiles?.gst_number && (
                     <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                        <span>GST: <strong className="font-mono">{order.profiles.gst_number}</strong></span>
                     </div>
                   )}
                </div>
             </div>
          </section>

          {/* Shipment & Logistics */}
          <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                <Truck className="h-5 w-5 text-brand-pink" />
                <h2 className="text-lg font-black text-brand-dark uppercase tracking-tight">Shipment Tracking</h2>
             </div>
             <div className="p-8 space-y-5">
                <div className="space-y-4">
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Courier Partner</label>
                      <input 
                        type="text" 
                        value={trackingInfo.courier_name}
                        onChange={(e) => setTrackingInfo({...trackingInfo, courier_name: e.target.value})}
                        placeholder="e.g. Shiprocket, BlueDart, Delhivery"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none text-xs font-bold transition-all"
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Tracking Number / AWB</label>
                      <input 
                        type="text" 
                        value={trackingInfo.tracking_number}
                        onChange={(e) => setTrackingInfo({...trackingInfo, tracking_number: e.target.value})}
                        placeholder="Enter tracking number"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none text-xs font-bold transition-all"
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Estimated Delivery</label>
                      <input 
                        type="date" 
                        value={trackingInfo.estimated_delivery}
                        onChange={(e) => setTrackingInfo({...trackingInfo, estimated_delivery: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none text-xs font-bold transition-all"
                      />
                   </div>
                </div>
                
                <div className="flex flex-col gap-3 pt-2">
                  <button 
                    onClick={updateTrackingInfo}
                    disabled={updating}
                    className="w-full py-4 bg-brand-dark text-white hover:bg-gray-800 transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 shadow-md"
                  >
                     {updating ? 'Saving...' : 'Update Tracking Info'}
                  </button>

                  <button 
                    onClick={() => shipWithShiprocket()}
                    disabled={updating || order.status === 'delivered' || order.status === 'cancelled'}
                    className="w-full py-4 bg-brand-pink text-white hover:bg-pink-600 transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-pink-200"
                  >
                     <Box className="h-4 w-4" />
                     {updating ? 'Processing...' : (order.tracking_number ? 'Re-push to Shiprocket' : 'Push to Shiprocket')}
                  </button>

                  {order.tracking_url && (
                    <a 
                      href={order.tracking_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-gray-100 text-brand-dark hover:bg-gray-200 transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View Live Shiprocket Tracking
                    </a>
                  )}
                </div>
             </div>
          </section>

          {/* Delivery Address */}
          <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-brand-pink" />
                <h2 className="text-lg font-black text-brand-dark uppercase tracking-tight">Delivery Address</h2>
             </div>
             <div className="p-8 space-y-4">
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-semibold text-brand-dark leading-relaxed">
                   <p className="font-bold text-base mb-1">{order.shipping_address?.fullName || customerName}</p>
                   <p>{order.shipping_address?.address || order.shipping_address?.line1 || 'No street address provided'}</p>
                   <p>{order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode || order.shipping_address?.postal_code}</p>
                   <p className="text-gray-500 font-normal mt-2">Phone: {order.shipping_address?.phone || customerPhone}</p>
                </div>
             </div>
          </section>

          {/* Payment Details */}
          <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-brand-pink" />
                <h2 className="text-lg font-black text-brand-dark uppercase tracking-tight">Payment Summary</h2>
             </div>
             <div className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
                   <span className="text-xl font-black text-brand-pink">₹{order.total_price?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Payment Status</span>
                   <span className={cn(
                     "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                     order.payment_status === 'paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                   )}>
                     {order.payment_status}
                   </span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Method</span>
                   <span className="text-sm font-black text-brand-dark">{order.payment_method === 'COD' ? 'Cash on Delivery (COD)' : 'Razorpay Online'}</span>
                </div>
                {order.razorpay_payment_id && (
                  <div className="pt-4 border-t border-gray-50">
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Payment ID</p>
                     <p className="text-xs font-bold text-brand-dark font-mono truncate">{order.razorpay_payment_id}</p>
                  </div>
                )}
             </div>
          </section>
        </div>
      </div>

      {/* Shiprocket Custom Credentials Modal */}
      {showCredsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] max-w-md w-full p-8 shadow-2xl border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 text-brand-pink flex items-center justify-center">
                  <Box className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-brand-dark">Shiprocket Login</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Connect your API User</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCredsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold px-2 py-1 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              If Shiprocket returns an auth error, enter your active <strong>Shiprocket API User</strong> credentials below to dispatch this order directly:
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">API User Email</label>
                <input 
                  type="email" 
                  value={customCreds.email}
                  onChange={(e) => setCustomCreds({ ...customCreds, email: e.target.value })}
                  placeholder="e.g. Printatoz954@gmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-brand-pink outline-none text-xs font-bold transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">API User Password</label>
                <input 
                  type="password" 
                  value={customCreds.password}
                  onChange={(e) => setCustomCreds({ ...customCreds, password: e.target.value })}
                  placeholder="Enter API User Password"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-brand-pink outline-none text-xs font-bold transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setShowCredsModal(false)}
                className="flex-1 py-3.5 bg-gray-100 text-brand-dark hover:bg-gray-200 rounded-2xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => shipWithShiprocket(customCreds)}
                disabled={updating || !customCreds.email || !customCreds.password}
                className="flex-1 py-3.5 bg-brand-pink text-white hover:bg-pink-600 rounded-2xl text-xs font-bold transition-all shadow-md shadow-pink-200 disabled:opacity-50"
              >
                {updating ? 'Authenticating...' : 'Ship with These'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
