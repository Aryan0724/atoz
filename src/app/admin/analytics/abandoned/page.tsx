"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase/client';
import { 
  BarChart3, 
  Clock, 
  ShoppingCart, 
  Mail, 
  ChevronRight, 
  AlertCircle,
  Eye,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import SectionHeading from '@/components/common/SectionHeading';

export default function AbandonedCartsPage() {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('checkout_attempts')
        .select(`
          *,
          products:product_id (name, slug, images, base_price)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttempts(data || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load checkout attempts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, []);

  const filteredAttempts = attempts.filter(att => 
    att.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    att.products?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed': 
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" /> Converted</span>;
      case 'abandoned': 
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5"><XCircle className="h-3 w-3" /> Lost</span>;
      default: 
        return <span className="bg-brand-pink/10 text-brand-pink px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5 animate-pulse"><Clock className="h-3 w-3" /> At Risk</span>;
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <header className="mb-12 flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1 flex items-center gap-3">
               Abandoned <span className="text-brand-pink italic">Carts</span>
            </h1>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">High-Intent Drop-off Monitor</p>
         </div>
         <button 
           onClick={fetchAttempts}
           className="px-5 py-2.5 bg-white rounded-xl border border-gray-100 shadow-soft hover:shadow-md transition-all text-gray-400 hover:text-brand-dark flex items-center gap-2 group"
         >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            <span className="text-[11px] font-black uppercase tracking-widest group-hover:block">Refresh Hub</span>
         </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {[
            { label: 'Pending Carts', val: attempts.filter(a => a.status === 'pending').length, color: 'text-brand-pink', bg: 'bg-white' },
            { label: 'Lost Value', val: `₹${attempts.filter(a => a.status !== 'completed').reduce((acc, a) => acc + (a.cart_total || 0), 0).toLocaleString()}`, color: 'text-brand-dark', bg: 'bg-white' },
            { label: 'Recovery Rate', val: attempts.length ? `${Math.round((attempts.filter(a => a.status === 'completed').length / attempts.length) * 100)}%` : '0%', color: 'text-brand-dark', bg: 'bg-white' },
            { label: 'Total Attempts', val: attempts.length, color: 'text-brand-dark', bg: 'bg-white' }
          ].map((stat, i) => (
            <div key={i} className={cn("p-8 rounded-2xl border border-gray-100 shadow-soft", stat.bg)}>
               <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 italic">{stat.label}</p>
               <h3 className={cn("text-3xl font-bold tracking-tight italic", stat.color)}>{stat.val}</h3>
            </div>
          ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden mb-12">
         <div className="p-6 border-b border-gray-50 bg-gray-50/20 flex items-center gap-6">
            <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
               <input 
                 type="text"
                 placeholder="Search activity log..."
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
                 className="w-full pl-12 pr-6 py-3.5 bg-white rounded-xl border border-gray-100 focus:border-brand-pink/20 transition-all outline-none font-bold text-sm text-brand-dark italic placeholder:text-gray-200"
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-gray-50/50">
                     <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Identity / Timing</th>
                     <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Asset Interest</th>
                     <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status Vector</th>
                     <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Operational Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {filteredAttempts.map((att) => (
                     <tr key={att.id} className="group hover:bg-gray-50/30 transition-colors">
                        <td className="px-8 py-6">
                           <div className="flex flex-col gap-1">
                              <span className={cn("text-sm font-bold italic", att.user_email ? "text-brand-dark" : "text-gray-300 italic")}>
                                 {att.user_email || "Anonymous Visitor"}
                              </span>
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter flex items-center gap-1.5 opacity-60">
                                 <Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(att.created_at))} ago
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gray-50 rounded-lg border border-gray-100 p-1 shrink-0 overflow-hidden">
                                 <img src={att.products?.images?.[0]} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                 <span className="text-xs font-bold text-brand-dark truncate leading-tight italic">{att.products?.name}</span>
                                 <span className="text-[10px] font-black text-brand-pink uppercase tracking-widest italic">₹{att.cart_total?.toLocaleString()}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           {getStatusBadge(att.status)}
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 bg-white rounded-lg border border-gray-100 hover:border-brand-pink text-brand-pink transition-all shadow-sm">
                                 <Eye className="h-3.5 w-3.5" />
                              </button>
                              <button className="p-2 bg-white rounded-lg border border-gray-100 hover:border-brand-dark text-brand-dark transition-all shadow-sm">
                                 <Mail className="h-3.5 w-3.5" />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
                  {filteredAttempts.length === 0 && (
                     <tr>
                        <td colSpan={4} className="px-8 py-20 text-center">
                           <div className="flex flex-col items-center gap-4 opacity-30">
                              <AlertCircle className="h-10 w-10 text-gray-400" />
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dataset Empty</p>
                           </div>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <div className="flex items-start gap-6 p-8 bg-brand-dark text-white rounded-3xl relative overflow-hidden group border border-white/5">
         <div className="p-4 bg-white/5 rounded-2xl shrink-0">
            <Mail className="h-6 w-6 text-brand-pink" />
         </div>
         <div className="flex-1">
            <h3 className="text-sm font-bold italic tracking-widest mb-2 uppercase opacity-40">Intelligence Strategy</h3>
            <p className="text-sm font-medium text-gray-400 leading-relaxed max-w-2xl italic">
               Priority recovery outreach should be initiated within <span className="text-white">60 minutes</span> of signal loss. High-value enterprise logs (Above ₹50,000) are recommended for manual partner concierge.
            </p>
         </div>
      </div>
    </div>
  );
}
