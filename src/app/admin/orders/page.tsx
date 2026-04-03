"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  MoreVertical,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Activity
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
  shipping_address: any;
  user_id: string;
  profiles?: {
    full_name: string;
    email: string;
  };
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
      const fetchPromise = supabase
        .from('orders')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(50);

      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000));
      
      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders, using mock data:', err);
      // Fallback for Demo
      setOrders([
        { id: 'ORD-1001', created_at: new Date().toISOString(), total_price: 15600, status: 'processing', user_id: '1', profiles: { full_name: 'Aditya Raj', email: 'aditya@example.com' }, shipping_address: {} },
        { id: 'ORD-1002', created_at: new Date(Date.now() - 86400000).toISOString(), total_price: 8400, status: 'shipped', user_id: '2', profiles: { full_name: 'Priya Sharma', email: 'priya@example.com' }, shipping_address: {} },
        { id: 'ORD-1003', created_at: new Date(Date.now() - 172800000).toISOString(), total_price: 22000, status: 'pending', user_id: '3', profiles: { full_name: 'Rohan Mehra', email: 'rohan@example.com' }, shipping_address: {} },
        { id: 'ORD-1004', created_at: new Date(Date.now() - 259200000).toISOString(), total_price: 5900, status: 'delivered', user_id: '4', profiles: { full_name: 'Sneha Kapur', email: 'sneha@example.com' }, shipping_address: {} }
      ] as any);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast.error('Failed to update status');
    } else {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Activity className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle2 className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'processing': return 'text-brand-cyan bg-cyan-50 border-cyan-100';
      case 'shipped': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'delivered': return 'text-green-600 bg-green-50 border-green-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.profiles?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.profiles?.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || o.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <header className="mb-12">
        <Breadcrumbs items={[{ label: 'Admin' }, { label: 'Orders' }]} />
        <h1 className="text-4xl font-black text-brand-dark tracking-tighter mb-2">Order <span className="text-brand-pink">Fullfillment</span></h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Managing {orders.length} Customer Orders</p>
      </header>

      {/* Toolbar */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by Order ID, Customer Name, or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-pink/20 focus:outline-none font-medium text-sm transition-all"
          />
        </div>
        <div className="flex gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-gray-500 focus:outline-none focus:bg-white focus:border-brand-pink/20 transition-all appearance-none cursor-pointer pr-12 min-w-[160px]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          <button className="px-6 py-4 bg-brand-dark text-white rounded-2xl flex items-center gap-2 text-sm font-bold hover:shadow-xl hover:shadow-gray-200 transition-all">
            <Filter className="h-4 w-4" />
            Advanced
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-[48px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Order & Customer</th>
                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-10 py-8 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-12 w-12 text-brand-pink animate-spin" />
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Syncing Orders...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-10 py-32 text-center text-gray-400 font-medium">
                     No orders matching your criteria were found.
                   </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-gray-50/30 transition-colors">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-brand-lightGray rounded-2xl flex items-center justify-center text-brand-dark font-black tracking-tighter">
                           #{order.id.slice(-4).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-dark text-sm mb-1">{order.profiles?.full_name}</h4>
                          <span className="text-[10px] font-black text-gray-400 tracking-wider uppercase">{order.profiles?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                       <span className="text-xs font-bold text-gray-500">{new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </td>
                    <td className="px-8 py-8">
                       <span className="font-black text-brand-dark">₹{order.total_price.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-8">
                       <div className={cn(
                         "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-tighter",
                         getStatusColor(order.status)
                       )}>
                         {getStatusIcon(order.status)}
                         {order.status}
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex items-center justify-end gap-3">
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-[10px] font-bold text-gray-500 focus:outline-none focus:border-brand-pink/30 hover:border-gray-300 transition-colors outline-none cursor-pointer"
                          >
                             <option value="pending">Pending</option>
                             <option value="processing">Processing</option>
                             <option value="shipped">Shipped</option>
                             <option value="delivered">Delivered</option>
                          </select>
                          <Link 
                            href={`/admin/orders/${order.id}`}
                            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-brand-pink hover:border-brand-pink/20 transition-all shadow-sm block"
                          >
                             <Eye className="h-4 w-4" />
                          </Link>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer info */}
        <div className="px-10 py-8 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Page 1 of 1</p>
           <div className="flex items-center gap-3">
              <button disabled className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 disabled:opacity-30">
                 <ChevronLeft className="h-5 w-5" />
              </button>
              <button disabled className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 disabled:opacity-30">
                 <ChevronRight className="h-5 w-5" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

