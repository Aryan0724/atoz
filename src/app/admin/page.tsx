"use client";

import React, { useEffect, useState } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpRight as TrendUp, 
  Clock,
  Plus
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    recentOrders: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      
      const [
        { count: productCount },
        { count: orderCount },
        { count: userCount },
        { data: recentOrders }
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('orders')
          .select('*, products(name)')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      setStats({
        totalProducts: productCount || 0,
        totalOrders: orderCount || 0,
        totalUsers: userCount || 0,
        recentOrders: recentOrders || []
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: '₹1,24,500', icon: <DollarSign className="h-6 w-6" />, trend: '+12.5%', color: 'pink' },
    { label: 'Total Orders', value: stats.totalOrders.toString(), icon: <ShoppingBag className="h-6 w-6" />, trend: '+8.2%', color: 'cyan' },
    { label: 'Active Products', value: stats.totalProducts.toString(), icon: <Package className="h-6 w-6" />, trend: '+2', color: 'dark' },
    { label: 'Total Customers', value: stats.totalUsers.toString(), icon: <Users className="h-6 w-6" />, trend: '+14', color: 'pink' },
  ];

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tighter mb-2">Performance <span className="text-brand-pink">Overview</span></h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">A to Z Prints Business Intelligence</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-sm font-bold text-gray-500">
           <Activity className="h-4 w-4 text-green-500" />
           System Live
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-2xl hover:shadow-gray-100 transition-all duration-500">
             <div className={cn(
               "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
               stat.color === 'pink' ? "bg-pink-50 text-brand-pink" : 
               stat.color === 'cyan' ? "bg-cyan-50 text-brand-cyan" : "bg-gray-100 text-brand-dark"
             )}>
                {stat.icon}
             </div>
             <h3 className="text-4xl font-black text-brand-dark mb-1 tracking-tighter">{stat.value}</h3>
             <div className="flex items-center justify-between">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
               <span className="flex items-center text-[10px] font-black text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                 <TrendUp className="h-3 w-3 mr-1" />
                 {stat.trend}
               </span>
             </div>
             {/* Decorative Background */}
             <div className={cn(
               "absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2 transition-opacity group-hover:opacity-20",
               stat.color === 'pink' ? "bg-brand-pink" : 
               stat.color === 'cyan' ? "bg-brand-cyan" : "bg-brand-dark"
             )}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white p-10 rounded-[48px] shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-10 border-b border-gray-50 pb-6">
              <h2 className="text-xl font-bold text-brand-dark">Latest Orders</h2>
              <button className="text-xs font-bold uppercase tracking-widest text-brand-pink hover:underline">Manage All</button>
           </div>
           
           <div className="space-y-6">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-3xl hover:bg-gray-50 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-brand-pink font-bold">
                         {order.products?.name?.charAt(0) || 'O'}
                      </div>
                      <div>
                         <h4 className="font-bold text-brand-dark text-sm">{order.products?.name}</h4>
                         <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            <Clock className="h-3 w-3" />
                            {new Date(order.created_at).toLocaleDateString()}
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="block font-black text-brand-dark text-sm">₹{order.total_price.toLocaleString()}</span>
                      <span className="text-[10px] font-black text-brand-cyan uppercase tracking-tighter bg-cyan-50 px-2 py-0.5 rounded-full">
                        {order.status}
                      </span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-brand-dark p-12 rounded-[48px] text-white shadow-2xl shadow-gray-200 relative overflow-hidden">
           <div className="relative z-10">
             <h2 className="text-2xl font-black mb-10 border-b border-white/5 pb-6">Quick <span className="text-brand-pink">Actions</span></h2>
             <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Add Product', icon: <Plus className="h-5 w-5" />, color: 'pink', action: () => router.push('/admin/products') },
                  { label: 'Upload Asset', icon: <Package className="h-5 w-5" />, color: 'cyan', action: () => {} },
                  { label: 'Order Report', icon: <Activity className="h-5 w-5" />, color: 'white', action: () => {} },
                  { label: 'User Support', icon: <Users className="h-5 w-5" />, color: 'pink', action: () => {} },
                ].map((action) => (
                  <button 
                    key={action.label}
                    onClick={action.action}
                    className="flex flex-col items-center justify-center p-8 rounded-[32px] bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-center group"
                  >
                    <div className={cn(
                      "mb-4 p-4 rounded-2xl group-hover:scale-110 transition-transform",
                      action.color === 'pink' ? "text-brand-pink bg-brand-pink/10" :
                      action.color === 'cyan' ? "text-brand-cyan bg-brand-cyan/10" : "text-white bg-white/10"
                    )}>
                      {action.icon}
                    </div>
                    <span className="text-sm font-bold tracking-tight">{action.label}</span>
                  </button>
                ))}
             </div>
           </div>
           
           {/* Abstract Decoration */}
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-pink/10 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2"></div>
        </div>
      </div>
    </div>
  );
}
