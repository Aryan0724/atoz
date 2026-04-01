"use client";

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  ArrowLeft, 
  Calendar, 
  Download, 
  Filter,
  Package,
  Layers,
  IndianRupee,
  Activity,
  ChevronRight,
  Target
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function OrderAnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState({
    totalRevenue: 0,
    orderCount: 0,
    aov: 0,
    topProducts: [] as any[],
    revenueByDay: [] as any[],
    statusBreakdown: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*, products(name, category, base_price)');

      if (error || !orders) {
        setLoading(false);
        return;
      }

      // Calculations
      const revenue = orders.reduce((acc, o) => acc + (o.total_price || 0), 0);
      const aov = orders.length > 0 ? revenue / orders.length : 0;

      // Top Products logic
      const productCounts: any = {};
      orders.forEach(o => {
        const name = o.products?.name || 'Unknown';
        productCounts[name] = (productCounts[name] || 0) + 1;
      });
      const topProducts = Object.entries(productCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 5);

      // Revenue by Day (Last 7 days)
      const days: any = {};
      orders.forEach(o => {
        const date = new Date(o.created_at).toLocaleDateString();
        days[date] = (days[date] || 0) + (o.total_price || 0);
      });
      const revenueByDay = Object.entries(days).map(([date, amount]) => ({ date, amount })).slice(-7);

      setData({
        totalRevenue: revenue,
        orderCount: orders.length,
        aov: aov,
        topProducts,
        revenueByDay,
        statusBreakdown: [] // Handled separately if needed
      });
      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto min-h-screen bg-gray-50/30">
      {/* Header */}
      <header className="mb-12">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-brand-pink mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Dashboard</span>
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-brand-dark tracking-tighter mb-2">Order <span className="text-brand-pink">Measurements</span></h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Deep dive into performance metrics</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-bold text-gray-600 tracking-tight">Last 30 Days</span>
             </div>
             <button className="p-2.5 bg-brand-pink text-white rounded-xl shadow-lg hover:shadow-pink-200 transition-all">
                <Download className="h-5 w-5" />
             </button>
          </div>
        </div>
      </header>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
         {[
           { label: 'Total Revenue', value: `₹${data.totalRevenue.toLocaleString()}`, icon: <IndianRupee />, color: 'pink' },
           { label: 'Total Orders', value: data.orderCount.toString(), icon: <Package />, color: 'cyan' },
           { label: 'Avg. Order Value', value: `₹${Math.round(data.aov).toLocaleString()}`, icon: <Target />, color: 'dark' },
         ].map((m, idx) => (
           <motion.div 
             key={m.label}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: idx * 0.1 }}
             className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 relative group overflow-hidden"
           >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-6",
                m.color === 'pink' ? "bg-pink-50 text-brand-pink" : 
                m.color === 'cyan' ? "bg-cyan-50 text-brand-cyan" : "bg-gray-100 text-brand-dark"
              )}>
                {m.icon}
              </div>
              <h3 className="text-4xl font-black text-brand-dark mb-1 tracking-tighter">{m.value}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{m.label}</p>
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity translate-x-1/2 -translate-y-1/2"></div>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* Top Selling Products */}
         <div className="bg-white p-10 rounded-[48px] shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-10">
               <h2 className="text-xl font-bold text-brand-dark">Top Performance Products</h2>
               <Filter className="h-4 w-4 text-gray-300" />
            </div>
            
            <div className="space-y-8">
               {data.topProducts.map((p, idx) => (
                 <div key={p.name} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-black text-gray-400 group-hover:bg-brand-pink/10 group-hover:text-brand-pink transition-colors">
                          0{idx + 1}
                       </div>
                       <div>
                          <h4 className="font-bold text-brand-dark text-sm">{p.name}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Premium Grade</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="text-right">
                          <span className="block font-black text-brand-dark text-sm">{p.count}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Units Sold</span>
                       </div>
                       <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-brand-pink transition-colors" />
                    </div>
                 </div>
               ))}
               {data.topProducts.length === 0 && (
                 <div className="text-center py-12 text-gray-400 italic">No sales data available.</div>
               )}
            </div>
         </div>

         {/* Revenue Growth Placeholder (SVG Chart) */}
         <div className="bg-brand-dark p-10 rounded-[48px] shadow-2xl text-white relative overflow-hidden">
            <h2 className="text-2xl font-black mb-8 relative z-10">Revenue <span className="text-brand-pink">Velocity</span></h2>
            
            {/* Visual Chart Placeholder */}
            <div className="h-64 relative z-10 flex items-end justify-between gap-4 py-8">
               {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-4">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      className="w-full max-w-[40px] bg-white/10 group relative rounded-2xl overflow-hidden hover:bg-brand-pink/40 transition-colors"
                    >
                       <div className="absolute bottom-0 left-0 w-full bg-brand-pink/20 h-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.div>
                    <span className="text-[10px] font-black text-white/20 uppercase">Day {i+1}</span>
                 </div>
               ))}
            </div>
            
            <div className="mt-8 flex items-center justify-between relative z-10 border-t border-white/5 pt-8">
               <div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Weekly Growth</p>
                  <div className="flex items-center gap-2">
                     <TrendingUp className="h-4 w-4 text-brand-pink" />
                     <span className="text-2xl font-black">+24.5%</span>
                  </div>
               </div>
               <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-all">
                  Full Report
               </button>
            </div>
            
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(233,30,99,0.1),transparent)]"></div>
         </div>
      </div>

      {/* Actionable Insights */}
      <section className="mt-12 mb-12">
         <div className="bg-white p-12 rounded-[48px] border border-gray-100 shadow-sm overflow-hidden relative">
            <div className="flex flex-col md:flex-row gap-12 items-center">
               <div className="w-20 h-20 bg-brand-cyan/10 rounded-3xl flex items-center justify-center text-brand-cyan">
                  <Activity className="h-10 w-10" />
               </div>
               <div className="flex-1">
                  <h3 className="text-2xl font-black text-brand-dark mb-2">Performance Insight</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">
                     Your Average Order Value has increased by <span className="text-brand-pink font-bold">12%</span> compared to last month. 
                     High-margin products like <span className="text-brand-dark font-bold font-headline uppercase tracking-tighter">Premium Hoodies</span> are driving this growth.
                  </p>
               </div>
               <button className="px-8 py-4 bg-brand-dark text-white rounded-2xl font-black hover:scale-105 transition-all shadow-xl">
                  Optimize Catalog
               </button>
            </div>
         </div>
      </section>
    </div>
  );
}
