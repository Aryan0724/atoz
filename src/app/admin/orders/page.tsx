"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Search, Filter, Eye, Clock, CheckCircle2,
  Truck, AlertCircle, MoreVertical, Loader2, ExternalLink,
  ChevronLeft, ChevronRight, Activity, Factory, Send, Package,
  ShieldAlert, RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

type Order = {
  id: string;
  created_at: string;
  total_price: number;
  status: string;
  payment_method?: string;
  payment_status?: string;
  shipping_address: any;
  user_id?: string;
  profiles?: {
    full_name: string;
    email: string;
  };
  order_items?: Array<{
    id: string;
    design_preview_url?: string;
    product?: {
      name: string;
      images: string[];
    };
  }>;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    
    try {
      // 1. Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(100);

      if (ordersError) throw ordersError;

      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        return;
      }

      // 2. Fetch order items with products for thumbnails
      const orderIds = ordersData.map(o => o.id);
      const { data: itemsData } = await supabase
        .from('order_items')
        .select('id, order_id, design_preview_url, product:products(name, images)')
        .in('order_id', orderIds);

      const itemsMap: Record<string, any[]> = {};
      (itemsData || []).forEach((item: any) => {
        if (!itemsMap[item.order_id]) {
          itemsMap[item.order_id] = [];
        }
        itemsMap[item.order_id].push(item);
      });

      const combined = ordersData.map(o => ({
        ...o,
        order_items: itemsMap[o.id] || []
      }));

      setOrders(combined);
    } catch (err: any) {
      console.warn('Error fetching orders, using mock data:', err.message);
      // Fallback for Demo
      setOrders([
        { id: '11111111-1111-4111-a111-111111111111', created_at: new Date().toISOString(), total_price: 15600, status: 'processing', payment_method: 'Online', payment_status: 'paid', shipping_address: { fullName: 'Aditya Raj', email: 'aditya@example.com' } },
        { id: '22222222-2222-4222-a222-222222222222', created_at: new Date(Date.now() - 86400000).toISOString(), total_price: 8400, status: 'shipped', payment_method: 'Online', payment_status: 'paid', shipping_address: { fullName: 'Priya Sharma', email: 'priya@example.com' } },
        { id: '33333333-3333-4333-a333-333333333333', created_at: new Date(Date.now() - 172800000).toISOString(), total_price: 22000, status: 'pending', payment_method: 'COD', payment_status: 'pending_cod', shipping_address: { fullName: 'Rohan Mehra', email: 'rohan@example.com' } },
      ] as any);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    let extraUpdates: any = {};
    if (newStatus === 'pending') {
      const order = orders.find(o => o.id === orderId);
      if (order?.status === 'pending_approval') {
        const days = prompt("Enter estimated delivery days for this approved order:", "7");
        if (days === null) return;
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + (parseInt(days) || 7));
        extraUpdates.estimated_delivery = deliveryDate.toISOString();
      }
    }

    // Optimistic Update
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus, ...extraUpdates } : o));

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, ...extraUpdates })
        .eq('id', orderId);

      if (error) throw error;
      toast.success(`Order status updated to ${newStatus}.`);
    } catch (err: any) {
      console.warn('[Demo Mode] Database sync skipped. Keeping local change.', err.message);
      toast.info(`Status updated locally`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending_approval': return <ShieldAlert className="h-4 w-4" />;
      case 'pending':          return <Clock className="h-4 w-4" />;
      case 'confirmed':        return <CheckCircle2 className="h-4 w-4" />;
      case 'in_production':   return <Factory className="h-4 w-4" />;
      case 'dispatched':      return <Send className="h-4 w-4" />;
      case 'out_for_delivery': return <Truck className="h-4 w-4" />;
      case 'delivered':       return <Package className="h-4 w-4" />;
      case 'cancelled':       return <AlertCircle className="h-4 w-4" />;
      default:                return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending_approval': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'pending':          return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'confirmed':        return 'bg-sky-50 text-sky-600 border-sky-100';
      case 'in_production':   return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'dispatched':      return 'bg-violet-50 text-violet-600 border-violet-100';
      case 'out_for_delivery': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'delivered':       return 'bg-green-50 text-green-600 border-green-100';
      case 'cancelled':       return 'bg-red-50 text-red-600 border-red-100';
      default:                return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const filteredOrders = orders.filter(order => {
    const custName = order.profiles?.full_name || order.shipping_address?.fullName || '';
    const custEmail = order.profiles?.email || order.shipping_address?.email || '';
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      custName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      custEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10 pb-20 p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <Breadcrumbs items={[{ label: 'Admin' }, { label: 'Orders' }]} className="mb-4" />
           <h1 className="text-4xl font-black text-brand-dark mb-2">Orders Management</h1>
           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
             Monitor customer transactions, custom print files, and fulfillment
           </p>
        </div>
        <button 
          onClick={() => fetchOrders()} 
          className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-brand-dark rounded-2xl text-xs font-bold hover:bg-gray-50 transition-all self-start md:self-auto shadow-sm"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin text-brand-pink")} />
          Refresh
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by order ID, customer name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent focus:border-brand-pink/20 rounded-2xl text-xs font-bold outline-none transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Filter className="h-4 w-4 text-gray-400 shrink-0" />
          {['all', 'pending', 'confirmed', 'in_production', 'dispatched', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                statusFilter === status 
                  ? "bg-brand-dark text-white shadow-md shadow-brand-dark/10" 
                  : "bg-gray-50 text-gray-400 hover:text-brand-dark"
              )}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID & Design</th>
                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Payment</th>
                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-10 py-8 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-12 w-12 text-brand-pink animate-spin" />
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Live Orders...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                   <td colSpan={7} className="px-10 py-32 text-center text-gray-400 font-medium">
                     No orders matching your criteria were found.
                   </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const custName = order.profiles?.full_name || order.shipping_address?.fullName || 'Guest Customer';
                  const custEmail = order.profiles?.email || order.shipping_address?.email || 'N/A';
                  const firstItem = order.order_items?.[0];
                  const itemImg = firstItem?.design_preview_url || firstItem?.product?.images?.[0];

                  return (
                    <tr key={order.id} className="group hover:bg-gray-50/40 transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center shrink-0">
                            {itemImg ? (
                              <img src={itemImg} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-black text-xs text-gray-400">#{order.id.slice(-4).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <span className="font-black text-brand-dark text-sm block font-mono">#{order.id.slice(0, 8).toUpperCase()}</span>
                            <span className="text-[10px] font-bold text-gray-400">{order.order_items?.length || 1} Item(s)</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <h4 className="font-bold text-brand-dark text-sm mb-0.5">{custName}</h4>
                          <span className="text-[10px] font-medium text-gray-400 block">{custEmail}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-xs font-bold text-gray-500">
                           {new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                         <span className="font-black text-brand-dark text-base">₹{order.total_price?.toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex flex-col gap-1">
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest",
                              order.payment_method === 'COD' ? "text-amber-600" : "text-brand-pink"
                            )}>
                              {order.payment_method || 'Online'}
                            </span>
                            <span className={cn(
                              "text-[9px] font-bold uppercase tracking-tighter",
                              order.payment_status === 'paid' ? "text-green-600" : "text-orange-500"
                            )}>
                              {order.payment_status}
                            </span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className={cn(
                           "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-tighter",
                           getStatusColor(order.status)
                         )}>
                           {getStatusIcon(order.status)}
                           {order.status?.replace(/_/g, ' ')}
                         </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <select 
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-[10px] font-bold text-gray-600 focus:outline-none focus:border-brand-pink/30 hover:border-gray-300 transition-colors cursor-pointer"
                            >
                               <option value="pending_approval">Pending Approval</option>
                               <option value="pending">Pending</option>
                               <option value="confirmed">Confirmed</option>
                               <option value="in_production">In Production</option>
                               <option value="dispatched">Dispatched</option>
                               <option value="out_for_delivery">Out for Delivery</option>
                               <option value="delivered">Delivered</option>
                               <option value="cancelled">Cancelled</option>
                            </select>
                            <Link 
                              href={`/admin/orders/${order.id}`}
                              className="p-2.5 bg-brand-dark text-white rounded-xl hover:bg-brand-pink transition-all shadow-sm flex items-center justify-center"
                              title="View Order Details & Design"
                            >
                               <Eye className="h-4 w-4" />
                            </Link>
                         </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
