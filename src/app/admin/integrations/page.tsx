"use client";

import React, { useState } from 'react';
import { 
  Zap, 
  Database, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCcw, 
  Globe, 
  HardDrive,
  FileCode,
  ShieldCheck,
  ChevronRight,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState([
    { id: 'supabase', name: 'Supabase DB', type: 'Database', status: 'connected', latency: '42ms', lastSync: '2m ago', icon: <Database /> },
    { id: 'printify', name: 'Printify API', type: 'Fulfillment', status: 'connected', latency: '124ms', lastSync: '1h ago', icon: <ExternalLink /> },
    { id: 'razorpay', name: 'Razorpay PG', type: 'Payment', status: 'connected', latency: '88ms', lastSync: 'Real-time', icon: <Zap /> },
    { id: 'sendgrid', name: 'SendGrid', type: 'Email', status: 'error', latency: '-', lastSync: '6h ago', icon: <Globe /> },
  ]);

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <header className="mb-12">
        <Breadcrumbs items={[{ label: 'Admin' }, { label: 'Integrations' }]} />
        <h1 className="text-4xl font-black text-brand-dark tracking-tighter mb-2">Systems <span className="text-brand-pink">Integrations</span></h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Managing {integrations.length} API Protocol Links</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 space-y-8">
            {integrations.map((conn) => (
              <div key={conn.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-100 transition-all group overflow-hidden relative">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <div className={cn(
                         "w-16 h-16 rounded-[28px] flex items-center justify-center transition-all group-hover:scale-110",
                         conn.status === 'connected' ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"
                       )}>
                          {React.cloneElement(conn.icon as React.ReactElement, { className: "h-8 w-8" })}
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-brand-dark tracking-tighter mb-1">{conn.name}</h3>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{conn.type} • API v3.0</span>
                       </div>
                    </div>
                    
                    <div className="text-right">
                       <div className={cn(
                         "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-2",
                         conn.status === 'connected' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                       )}>
                          {conn.status === 'connected' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                          {conn.status}
                       </div>
                       <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{conn.lastSync}</div>
                    </div>
                 </div>

                 <div className="mt-10 pt-8 border-t border-gray-50 grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Network Latency</span>
                       <div className="text-lg font-black text-brand-dark italic">{conn.latency}</div>
                    </div>
                    <div className="flex items-end justify-end">
                       <button className="px-6 py-3 bg-gray-50 hover:bg-brand-pink hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Configure Link</button>
                    </div>
                 </div>
              </div>
            ))}
         </div>

         <div className="space-y-10">
            <div className="bg-brand-dark p-12 rounded-[48px] text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
               <h3 className="text-xl font-black mb-10 flex items-center justify-between tracking-tight uppercase italic pb-6 border-b border-white/10">
                  Protocol <span className="text-brand-pink">Health</span>
                  <Activity className="h-5 w-5 text-brand-pink" />
               </h3>
               <div className="space-y-8">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        <span>API Uptime (24h)</span>
                        <span className="text-brand-pink">99.98%</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-pink w-[99.9%] rounded-full shadow-[0_0_10px_rgba(232,28,255,0.5)]" />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        <span>Fulfillment Sync</span>
                        <span className="text-brand-cyan">124 req/m</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-cyan w-[65%] rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                     </div>
                  </div>
               </div>
               <button className="w-full mt-12 py-5 bg-white text-brand-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-pink hover:text-white transition-all transform group-hover:translate-y-[-4px]">
                  Force System Sync
               </button>
            </div>

            <div className="p-10 bg-gray-50 rounded-[48px] border border-gray-100 space-y-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-pink shadow-sm">
                     <FileCode className="h-6 w-6" />
                  </div>
                  <div>
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Developer Hub</div>
                     <div className="text-lg font-black text-brand-dark tracking-tighter">Webhook Access</div>
                  </div>
               </div>
               <div className="p-6 bg-white border border-gray-100 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-black text-gray-300 uppercase">
                     <span>Endpoint Secret</span>
                     <ShieldCheck className="h-3 w-3" />
                  </div>
                  <div className="font-mono text-xs text-brand-dark font-bold break-all opacity-40">sk_live_51Msz...G5k0</div>
               </div>
               <button className="w-full py-4 text-brand-pink font-black text-[10px] uppercase tracking-widest hover:underline">Download SDK Package</button>
            </div>
         </div>
      </div>
    </div>
  );
}
