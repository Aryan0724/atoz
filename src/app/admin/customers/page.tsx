"use client";

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Calendar, 
  ShoppingBag, 
  ChevronRight,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

type Customer = {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  role: string;
  _stats?: {
    order_count: number;
    total_spent: number;
  };
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    
    // Fetch profiles
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
      return;
    }

    // Fetch order stats for each customer (Simulated for now, optimization would use a view)
    const customersWithStats = await Promise.all((profiles || []).map(async (profile) => {
      const { data: orders } = await supabase
        .from('orders')
        .select('total_price')
        .eq('user_id', profile.id);
      
      return {
        ...profile,
        _stats: {
          order_count: orders?.length || 0,
          total_spent: orders?.reduce((sum, o) => sum + (o.total_price || 0), 0) || 0
        }
      };
    }));

    setCustomers(customersWithStats);
    setLoading(false);
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || c.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-brand-dark tracking-tighter mb-2">Customer <span className="text-brand-pink">Insights</span></h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Managing {customers.length} Registered Users</p>
      </header>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-10 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:outline-none font-medium text-sm transition-all shadow-inner"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-gray-500 focus:outline-none focus:bg-white focus:border-brand-pink/20 transition-all cursor-pointer min-w-[150px]"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="admin">Admins / Staff</option>
        </select>
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-32 flex flex-col items-center justify-center gap-4">
             <Loader2 className="h-12 w-12 text-brand-pink animate-spin" />
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Compiling Customer Directory...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="col-span-full py-32 text-center text-gray-400 font-medium">
             No users found.
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-white p-8 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-100 transition-all duration-500 group relative overflow-hidden">
               <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 rounded-3xl bg-brand-lightGray flex items-center justify-center text-2xl font-black text-brand-dark uppercase tracking-tighter">
                     {customer.full_name?.charAt(0) || customer.email?.charAt(0)}
                  </div>
                  {customer.role === 'admin' && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-brand-dark text-[10px] font-black text-white uppercase tracking-widest rounded-full">
                       <ShieldCheck className="h-3 w-3" />
                       Staff
                    </div>
                  )}
               </div>

               <h3 className="text-xl font-black text-brand-dark mb-1 tracking-tight truncate group-hover:text-brand-pink transition-colors">{customer.full_name || 'Anonymous User'}</h3>
               <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-8">
                  <Mail className="h-3.5 w-3.5" />
                  {customer.email}
               </div>

               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-gray-50 rounded-3xl">
                     <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Orders</span>
                     <span className="text-lg font-black text-brand-dark">{customer._stats?.order_count}</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-3xl">
                     <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Spent</span>
                     <span className="text-lg font-black text-brand-dark font-mono">₹{customer._stats?.total_spent.toLocaleString()}</span>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     <Calendar className="h-3.5 w-3.5" />
                     Since {new Date(customer.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </div>
                  <button className="p-3 bg-brand-lightGray rounded-2xl text-brand-dark group-hover:bg-brand-pink group-hover:text-white transition-all shadow-sm">
                     <ChevronRight className="h-5 w-5" />
                  </button>
               </div>

               {/* Decorative background circle */}
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-pink/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
