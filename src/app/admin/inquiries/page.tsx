"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase/client';
import { 
  MessageSquare, 
  Clock, 
  User, 
  Package, 
  ExternalLink, 
  CheckCircle2, 
  Eye, 
  Search,
  Filter,
  ArrowRight,
  MoreVertical,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Inquiry {
  id: string;
  user_id: string | null;
  product_id: string;
  message: string;
  design_state: any;
  status: 'new' | 'viewed' | 'responded' | 'converted';
  created_at: string;
  product?: {
    name: string;
    slug: string;
  };
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'responded'>('all');

  useEffect(() => {
    fetchInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('design_inquiries')
        .select(`
          *,
          product:products (name, slug)
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setInquiries(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('design_inquiries')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Inquiry marked as ${status}`);
      fetchInquiries();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tighter italic mb-2">Design <span className="text-brand-pink">Inquiries</span></h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Review and respond to custom design requests from your customers.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
           {(['all', 'new', 'responded'] as const).map(f => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={cn(
                 "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                 filter === f ? "bg-white text-brand-dark shadow-sm ring-1 ring-black/5" : "text-gray-400 hover:text-brand-dark"
               )}
             >
               {f}
             </button>
           ))}
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-gray-50 rounded-[32px] border border-gray-100" />
          ))}
        </div>
      ) : inquiries.length === 0 ? (
        <div className="py-20 flex flex-col items-center text-center bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
           <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6 font-black italic">!</div>
           <h3 className="text-xl font-black text-brand-dark tracking-tight mb-2">No Inquiries Found</h3>
           <p className="text-sm text-gray-400 max-w-xs font-medium">When customers send messages from the Design Studio, they&apos;ll appear here for review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inquiries.map((inquiry) => (
            <div 
              key={inquiry.id}
              className={cn(
                "group bg-white rounded-[32px] border border-gray-100 p-6 flex flex-col gap-5 hover:shadow-2xl hover:shadow-brand-dark/5 transition-all duration-500 relative overflow-hidden ring-1 ring-black/5",
                inquiry.status === 'new' && "border-brand-pink/20"
              )}
            >
              {inquiry.status === 'new' && (
                <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-brand-pink/10 text-brand-pink px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse">
                  <div className="w-1 h-1 bg-brand-pink rounded-full" /> New Request
                </div>
              )}

              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-dark shrink-0">
                    <User className="h-5 w-5" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-brand-dark italic truncate">Design Concept Request</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Clock className="h-2.5 w-2.5" /> {format(new Date(inquiry.created_at), 'MMM d, h:mm a')}
                    </p>
                 </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                 <p className="text-sm text-gray-600 font-medium line-clamp-3 leading-relaxed">
                    &quot;{inquiry.message}&quot;
                 </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Product Context</span>
                    <p className="text-xs font-bold text-brand-dark truncate max-w-[120px]">{inquiry.product?.name || 'Unknown Product'}</p>
                 </div>
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={() => window.open(`/customize/${inquiry.product?.slug}?inquiry=${inquiry.id}`, '_blank')}
                      title="View Original Design Canvas"
                      className="p-2.5 bg-brand-dark text-white rounded-xl hover:bg-brand-pink transition-all shadow-lg shadow-brand-dark/10"
                    >
                       <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(inquiry.id, inquiry.status === 'responded' ? 'converted' : 'responded')}
                      className={cn(
                        "p-2.5 rounded-xl transition-all border",
                        inquiry.status === 'responded' ? "bg-green-50 border-green-200 text-green-600" : "bg-white border-gray-100 text-gray-400 hover:text-brand-dark hover:border-brand-dark"
                      )}
                    >
                       <CheckCircle2 className="h-4 w-4" />
                    </button>
                 </div>
              </div>

              {/* Decorative bar */}
              <div className={cn(
                "absolute bottom-0 left-0 right-0 h-1",
                inquiry.status === 'new' ? "bg-brand-pink" : (inquiry.status === 'responded' ? "bg-green-500" : "bg-gray-200")
              )} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
