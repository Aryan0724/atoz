"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { ArrowLeft, Github, Chrome, Loader2, AlertCircle, Fingerprint, Lock, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (user) {
        // Fetch profile to verify role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) {
          // If no profile found but user exists, they might be an admin without a profile row yet
          // or a newly registered user whose profile creation failed.
          // For security, we require a profile row.
          await supabase.auth.signOut();
          throw new Error('Your account profile could not be verified. Please contact support.');
        }

        if (profile?.role !== role) {
          await supabase.auth.signOut();
          throw new Error(`This account is not registered as a ${role.charAt(0).toUpperCase() + role.slice(1)}`);
        }

        // Successful login with correct role
        router.push(role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      const getURL = () => {
        let url =
          process?.env?.NEXT_PUBLIC_SITE_URL ??
          process?.env?.NEXT_PUBLIC_VERCEL_URL ??
          window.location.origin;
        // Make sure to include `https://` when not localhost.
        url = url.includes('http') ? url : `https://${url}`;
        // Make sure to include a trailing `/`.
        url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
        return url;
      };

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${getURL()}auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Visual Side - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-dark relative overflow-hidden flex-col justify-between p-20 text-white">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-[20%] right-[-10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-pink/10 rounded-full blur-[100px]" />
           <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
           <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
              <ArrowLeft className="w-5 h-5" />
           </div>
           <span className="font-bold tracking-tight">Storefront</span>
        </Link>
        
        <div className="relative z-10">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8 }}
           >
              <div className="w-16 h-16 rounded-2xl bg-brand-pink flex items-center justify-center mb-8 shadow-2xl shadow-brand-pink/20">
                 <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-6xl font-black tracking-tighter italic leading-[0.9] mb-8">
                 Access Personal <br/>
                 <span className="text-white/40">Studio.</span>
              </h1>
              <p className="text-xl text-white/50 font-bold max-w-md leading-relaxed mb-12 italic">
                 Manage your custom collections, track production, and scale your brand identity.
              </p>
              
              <div className="flex items-center gap-6">
                 <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                       <div key={i} className="w-12 h-12 rounded-full border-4 border-brand-dark bg-gray-800 flex items-center justify-center text-[10px] font-black">
                          {String.fromCharCode(64 + i)}B
                       </div>
                    ))}
                 </div>
                 <div className="text-xs font-black uppercase tracking-widest text-white/40">
                    Trusted by <span className="text-brand-pink">5k+</span> creators
                 </div>
              </div>
           </motion.div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">
           <ShieldCheck className="w-4 h-4" />
           Encrypted Session
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-gray-50/30">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-lg bg-white p-8 lg:p-14 rounded-[48px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-gray-100"
        >
          <div className="text-center mb-12">
            <div className="relative h-12 w-40 mx-auto mb-10">
               <Image src="/logo.png" alt="Logo" fill className="object-contain mix-blend-multiply" />
            </div>
            <h2 className="text-4xl font-black text-brand-dark tracking-tighter italic uppercase mb-4">Welcome Back</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">Continue your creative journey</p>
          </div>

          <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl mb-10 border border-gray-100 shadow-inner">
             <button 
               onClick={() => setRole('customer')}
               className={cn(
                 "flex-1 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all",
                 role === 'customer' 
                   ? "bg-white text-brand-dark shadow-sm border border-gray-100" 
                   : "text-gray-400 hover:text-brand-dark"
               )}
             >
                Customer Login
             </button>
             <button 
               onClick={() => setRole('admin')}
               className={cn(
                 "flex-1 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all",
                 role === 'admin' 
                   ? "bg-white text-brand-pink shadow-sm border border-gray-100" 
                   : "text-gray-400 hover:text-brand-pink"
               )}
             >
                Admin Gateway
             </button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-black uppercase tracking-tight"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Registered Email</label>
               <input 
                 type="text" 
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full px-6 py-3.5 bg-gray-50 border border-transparent rounded-[20px] focus:bg-white focus:border-brand-pink focus:ring-4 focus:ring-brand-pink/5 outline-none transition-all font-bold text-brand-dark placeholder:text-gray-300 shadow-inner" 
                 placeholder="name@company.com" 
               />
            </div>

            <div className="space-y-2">
               <div className="flex items-center justify-between ml-2 mr-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Password</label>
                  <Link href="/forgot-password" hidden className="text-[10px] font-black text-brand-pink uppercase tracking-widest hover:underline">Reset?</Link>
               </div>
               <input 
                 type="password" 
                 required
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="••••••••" 
                 className="w-full px-6 py-3.5 bg-gray-50 border border-transparent rounded-[20px] focus:bg-white focus:border-brand-pink focus:ring-4 focus:ring-brand-pink/5 outline-none transition-all font-bold text-brand-dark placeholder:text-gray-300 shadow-inner" 
               />
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4.5 bg-brand-dark text-white rounded-[24px] text-lg font-black uppercase tracking-widest hover:bg-brand-pink shadow-2xl shadow-brand-dark/20 transition-all active:scale-95 disabled:opacity-50 italic flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                  <>
                    <Fingerprint className="w-6 h-6" />
                    Sign In
                  </>
                )}
              </button>


            </div>
          </form>

          <div className="mt-12">
            <div className="relative flex items-center justify-center mb-8">
               <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
               </div>
               <span className="relative px-6 bg-white text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Quick Access</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleOAuthLogin('google')}
                className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all font-bold text-sm"
              >
                <Chrome className="h-5 w-5 text-red-500" />
                Google
              </button>
              <button 
                onClick={() => handleOAuthLogin('github')}
                className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all font-bold text-sm"
              >
                <Github className="h-5 w-5 text-gray-900" />
                GitHub
              </button>
            </div>
          </div>
          
          <p className="mt-12 text-center text-sm font-bold text-gray-400">
            New to the platform? <Link href="/register" className="text-brand-pink hover:underline uppercase tracking-widest ml-1 italic">Join Now</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
