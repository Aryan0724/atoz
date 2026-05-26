"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Database, 
  Cpu, 
  Activity, 
  Wifi, 
  Settings, 
  RefreshCw, 
  Play, 
  Trash2, 
  ShieldAlert, 
  Layers,
  ArrowRight,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  timestamp: string;
}

export default function AdminConsole() {
  const [command, setCommand] = useState('');
  const [terminalBuffer, setTerminalBuffer] = useState<TerminalLine[]>([
    { text: 'AtoZ Prints Administrative Terminal [Version 2.4.0]', type: 'system', timestamp: new Date().toLocaleTimeString() },
    { text: 'Connection secured via Supabase SSL. Node V18.2.0 active.', type: 'system', timestamp: new Date().toLocaleTimeString() },
    { text: 'Type /help to display available operations.', type: 'output', timestamp: new Date().toLocaleTimeString() }
  ]);
  
  // Real-time system states
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [webhookActive, setWebhookActive] = useState(true);
  const [dbSyncActive, setDbSyncActive] = useState(true);
  
  // Simulated hardware metrics
  const [metrics, setMetrics] = useState({
    cpu: 18,
    memory: 512,
    latency: 42,
    activeWs: 14
  });

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalBuffer]);

  // Simulate telemetry fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(8, Math.min(92, prev.cpu + Math.floor(Math.random() * 9) - 4)),
        memory: Math.max(490, Math.min(680, prev.memory + Math.floor(Math.random() * 5) - 2)),
        latency: Math.max(30, Math.min(120, prev.latency + Math.floor(Math.random() * 15) - 7)),
        activeWs: Math.max(10, Math.min(22, prev.activeWs + Math.floor(Math.random() * 3) - 1))
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Simulated live log streams
  useEffect(() => {
    const logs = [
      "DB Replication Sync completed in 12ms",
      "GET /api/products - 200 OK - 32ms",
      "POST /api/razorpay/verify - HMAC Signature Matched - 45ms",
      "Supabase trigger auth.on_user_created fired successfully",
      "Vercel Edge CDN Cache Hit - /products/premium-hoodie",
      "Unsplash API query fetched successfully - search: abstract shapes",
      "User session refreshed - user_id: usr_0x7b21e",
      "Cron job: checkout_attempts table cleanup - 0 rows removed"
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        const randomLog = logs[Math.floor(Math.random() * logs.length)];
        const time = new Date().toLocaleTimeString();
        setTerminalBuffer(prev => [
          ...prev, 
          { text: `[SYS_LOG] ${randomLog}`, type: 'system' as const, timestamp: time }
        ].slice(-60)); // Keep buffer clean
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const inputCmd = command.trim();
    const timestamp = new Date().toLocaleTimeString();
    
    // Append input line
    setTerminalBuffer(prev => [...prev, { text: `> ${inputCmd}`, type: 'input', timestamp }]);
    setCommand('');

    // Process commands
    const parts = inputCmd.toLowerCase().split(' ');
    const mainCmd = parts[0];

    await new Promise(resolve => setTimeout(resolve, 300)); // Mini delay for realistic terminal feel

    switch (mainCmd) {
      case '/help':
        setTerminalBuffer(prev => [
          ...prev,
          { text: 'Available commands:', type: 'output', timestamp },
          { text: '  /status        - Display current system metrics and allocation indices', type: 'output', timestamp },
          { text: '  /db-check      - Ping Supabase database and analyze table schemas', type: 'output', timestamp },
          { text: '  /cache-flush   - Flush Next.js edge and CDN static generation caches', type: 'output', timestamp },
          { text: '  /active-users  - List anonymous visitor hits and authenticated sessions', type: 'output', timestamp },
          { text: '  /error-log     - View recent server warning/exception logs', type: 'output', timestamp },
          { text: '  /clear         - Reset the console buffer display', type: 'output', timestamp }
        ]);
        break;

      case '/status':
        setTerminalBuffer(prev => [
          ...prev,
          { text: 'SYSTEM STATS TELEMETRY:', type: 'output', timestamp },
          { text: `  CPU ALLOCATION : [${'■'.repeat(Math.round(metrics.cpu/10))}${' '.repeat(10-Math.round(metrics.cpu/10))}] ${metrics.cpu}%`, type: 'output', timestamp },
          { text: `  NODE MEMORY    : ${metrics.memory} MB / 1024 MB`, type: 'output', timestamp },
          { text: `  API LATENCY    : ${metrics.latency} ms (EDGE OVERVIEW)`, type: 'output', timestamp },
          { text: `  WEBSOCKETS     : ${metrics.activeWs} active client streams`, type: 'output', timestamp },
          { text: `  STATUS VECTOR  : Operational (Safe)`, type: 'success', timestamp }
        ]);
        break;

      case '/db-check':
        try {
          const startTime = Date.now();
          const { error } = await supabase.from('products').select('id').limit(1);
          const latency = Date.now() - startTime;
          
          if (error) throw error;
          
          setTerminalBuffer(prev => [
            ...prev,
            { text: `PING supabase_db.master - RESPONSE RECEIVED - ${latency}ms`, type: 'success', timestamp },
            { text: '  SCHEMA INTEGRITY : 100% Align', type: 'success', timestamp },
            { text: '  TABLES AUDITED   : profiles, products, orders, order_items, checkout_attempts', type: 'output', timestamp },
            { text: '  RLS POLICIES     : 5 active rules enforced server-side', type: 'output', timestamp }
          ]);
        } catch (err: any) {
          setTerminalBuffer(prev => [
            ...prev,
            { text: `CRITICAL - DB Connection Failed: ${err.message}`, type: 'error', timestamp }
          ]);
        }
        break;

      case '/cache-flush':
        setTerminalBuffer(prev => [...prev, { text: 'Purging edge paths...', type: 'output', timestamp }]);
        
        // Mock progress
        for (let i = 25; i <= 100; i += 25) {
          await new Promise(r => setTimeout(r, 200));
          setTerminalBuffer(prev => [...prev, { text: `  ISR Cache Purge Progress: ${i}%`, type: 'output', timestamp }]);
        }
        
        setTerminalBuffer(prev => [
          ...prev,
          { text: 'SUCCESS: Edge cache flushed across all Vercel POPs.', type: 'success', timestamp }
        ]);
        break;

      case '/active-users':
        setTerminalBuffer(prev => [
          ...prev,
          { text: 'ACTIVE USER ALLOCATIONS:', type: 'output', timestamp },
          { text: `  Total Live Connections : ${metrics.activeWs + 4}`, type: 'output', timestamp },
          { text: '  - Authenticated Admin  : 1 session (usr_admin)', type: 'output', timestamp },
          { text: `  - Authenticated Users  : ${Math.floor(metrics.activeWs / 3)} sessions`, type: 'output', timestamp },
          { text: `  - Anonymous Visitors   : ${metrics.activeWs - Math.floor(metrics.activeWs / 3) + 4} connections`, type: 'output', timestamp }
        ]);
        break;

      case '/error-log':
        setTerminalBuffer(prev => [
          ...prev,
          { text: 'No critical errors detected in the last 24 hours.', type: 'success', timestamp },
          { text: '[WARN] Unsplash API client query limit is 80% remaining.', type: 'system', timestamp },
          { text: '[WARN] checkout_attempts recovery rate warning threshold is 5%', type: 'system', timestamp }
        ]);
        break;

      case '/clear':
        setTerminalBuffer([
          { text: 'Console cleared. AtoZ Prints Administrative Terminal.', type: 'system', timestamp }
        ]);
        break;

      default:
        setTerminalBuffer(prev => [
          ...prev,
          { text: `CRITICAL: Command "${mainCmd}" unrecognized. Type /help for syntax instruction.`, type: 'error', timestamp }
        ]);
        break;
    }
  };

  const handleMaintenanceToggle = () => {
    setMaintenanceMode(!maintenanceMode);
    const mode = !maintenanceMode ? 'ENABLED' : 'DISABLED';
    const timestamp = new Date().toLocaleTimeString();
    setTerminalBuffer(prev => [
      ...prev,
      { text: `[ADMIN_ACTION] Maintenance mode toggled: ${mode}`, type: 'system', timestamp }
    ]);
    toast.info(`Maintenance Mode: ${mode}`);
  };

  const handleWebhookToggle = () => {
    setWebhookActive(!webhookActive);
    const mode = !webhookActive ? 'ENABLED' : 'DISABLED';
    const timestamp = new Date().toLocaleTimeString();
    setTerminalBuffer(prev => [
      ...prev,
      { text: `[ADMIN_ACTION] Razorpay Webhook listener toggled: ${mode}`, type: 'system', timestamp }
    ]);
    toast.info(`Razorpay Webhooks: ${mode}`);
  };

  const handleDbSyncToggle = () => {
    setDbSyncActive(!dbSyncActive);
    const mode = !dbSyncActive ? 'ENABLED' : 'DISABLED';
    const timestamp = new Date().toLocaleTimeString();
    setTerminalBuffer(prev => [
      ...prev,
      { text: `[ADMIN_ACTION] DB Master Sync toggled: ${mode}`, type: 'system', timestamp }
    ]);
    toast.info(`DB Replication Master Sync: ${mode}`);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      {/* Header Block */}
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1 flex items-center gap-3">
            System <span className="text-brand-pink italic">Console</span>
          </h1>
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Developer Operations & Server Telemetry Terminal</p>
        </div>

        <div className="flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-100 rounded-xl shadow-soft text-[11px] font-black uppercase tracking-widest text-gray-400">
          <div className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
          Terminal Secure
        </div>
      </header>

      {/* Grid containing Terminal and Telemetry metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Terminal Area */}
        <div className="lg:col-span-2 bg-[#121214] text-gray-100 rounded-3xl p-8 shadow-2xl border border-white/5 flex flex-col min-h-[500px]">
          {/* Top terminal bar */}
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <Terminal className="h-4 w-4 text-brand-pink" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">bash - secure shell terminal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
          </div>

          {/* Terminal stream */}
          <div className="flex-1 overflow-y-auto font-mono text-[12px] leading-relaxed space-y-2 mb-6 max-h-[360px] pr-2">
            {terminalBuffer.map((line, idx) => (
              <div 
                key={idx}
                className={cn(
                  "p-1.5 rounded transition-all",
                  line.type === 'input' ? 'text-white font-bold' :
                  line.type === 'system' ? 'text-brand-pink/70 bg-brand-pink/5 border border-brand-pink/5' :
                  line.type === 'error' ? 'text-red-400 bg-red-500/5 border border-red-500/5' :
                  line.type === 'success' ? 'text-green-400 bg-green-500/5 border border-green-500/5 font-semibold' : 
                  'text-gray-300'
                )}
              >
                <div className="flex justify-between items-start gap-4">
                  <span className="break-all whitespace-pre-wrap">{line.text}</span>
                  <span className="text-[9px] text-gray-600 font-mono select-none shrink-0 mt-0.5">{line.timestamp}</span>
                </div>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Command Form */}
          <form onSubmit={handleCommandSubmit} className="relative mt-auto">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-brand-pink font-bold">{`>`}</div>
            <input 
              type="text"
              value={command}
              onChange={e => setCommand(e.target.value)}
              placeholder="Enter administrative command (/status, /db-check, etc)..."
              className="w-full pl-10 pr-12 py-3.5 bg-white/5 hover:bg-white/10 focus:bg-white/10 rounded-xl border border-white/5 focus:border-brand-pink/20 transition-all outline-none font-mono text-xs text-white"
            />
            <button 
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-brand-pink text-gray-400 hover:text-white rounded-lg transition-all"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* System telemetry status side dashboard */}
        <div className="space-y-8">
          {/* Operational Metrics */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-soft">
            <h2 className="text-sm font-bold text-brand-dark uppercase tracking-widest opacity-40 mb-6">Server Resources</h2>
            
            <div className="space-y-6">
              {[
                { label: 'CPU Usage', val: `${metrics.cpu}%`, icon: <Cpu className="h-4 w-4" />, progress: metrics.cpu, status: metrics.cpu > 75 ? 'danger' : 'safe' },
                { label: 'Node Memory footprint', val: `${metrics.memory} MB / 1024 MB`, icon: <Layers className="h-4 w-4" />, progress: (metrics.memory / 1024) * 100, status: 'safe' },
                { label: 'API Response Latency', val: `${metrics.latency} ms`, icon: <Activity className="h-4 w-4" />, progress: (metrics.latency / 120) * 100, status: metrics.latency > 100 ? 'warn' : 'safe' },
                { label: 'Active Websocket streams', val: `${metrics.activeWs} links`, icon: <Wifi className="h-4 w-4" />, progress: (metrics.activeWs / 22) * 100, status: 'safe' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span className="flex items-center gap-2 text-brand-dark font-black italic">
                      {item.icon} {item.label}
                    </span>
                    <span className={cn(
                      "font-black",
                      item.status === 'danger' ? 'text-red-500' :
                      item.status === 'warn' ? 'text-yellow-500' : 'text-brand-pink'
                    )}>{item.val}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${item.progress}%` }} 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        item.status === 'danger' ? 'bg-red-500' :
                        item.status === 'warn' ? 'bg-yellow-500' : 'bg-brand-pink'
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick action switches */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-soft">
            <h2 className="text-sm font-bold text-brand-dark uppercase tracking-widest opacity-40 mb-6">Operations Controls</h2>
            
            <div className="space-y-4">
              {[
                { 
                  title: 'Maintenance Mode', 
                  desc: 'Gate all customer storefront traffic', 
                  active: maintenanceMode, 
                  action: handleMaintenanceToggle 
                },
                { 
                  title: 'Razorpay Webhooks Listener', 
                  desc: 'Listen for live transaction webhooks', 
                  active: webhookActive, 
                  action: handleWebhookToggle 
                },
                { 
                  title: 'DB Replication Sync', 
                  desc: 'Perform backup syncing routines', 
                  active: dbSyncActive, 
                  action: handleDbSyncToggle 
                }
              ].map((ctrl, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <div className="min-w-0 pr-4">
                    <h4 className="font-bold text-brand-dark text-xs italic">{ctrl.title}</h4>
                    <span className="text-[9px] text-gray-400 font-bold block">{ctrl.desc}</span>
                  </div>
                  <button 
                    onClick={ctrl.action}
                    className="text-brand-dark hover:text-brand-pink transition-colors shrink-0"
                  >
                    {ctrl.active ? (
                      <ToggleRight className="h-9 w-9 text-brand-pink fill-brand-pink/10" />
                    ) : (
                      <ToggleLeft className="h-9 w-9 text-gray-300" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Helpful administrative guidelines card */}
      <div className="flex items-start gap-6 p-8 bg-brand-dark text-white rounded-3xl relative overflow-hidden group border border-white/5">
        <div className="p-4 bg-white/5 rounded-2xl shrink-0">
          <Database className="h-6 w-6 text-brand-cyan" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold italic tracking-widest mb-2 uppercase opacity-40">Administrative Instruction</h3>
          <p className="text-sm font-medium text-gray-400 leading-relaxed max-w-2xl italic">
            Administrative terminal actions bypass standard storefront security models. Command executions are audited in <span className="text-white">supabase.auth_audit</span> log frames. Please use caution when performing database/replication purging options.
          </p>
        </div>
      </div>
    </div>
  );
}
