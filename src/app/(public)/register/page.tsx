"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { ArrowLeft, Github, Chrome, Loader2, AlertCircle, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: fullName,
              role: 'customer'
            }
          ]);
        
        if (profileError && !profileError.message.includes('duplicate key')) {
          console.error('Profile creation error:', profileError);
        }
      }

      toast.success('Account created! Please check your email for verification.');
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      const getURL = () => {
        let url = typeof window !== 'undefined' && window.location.origin
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL ?? '/';
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
      <div className="hidden lg:flex lg:w-1/2 bg-brand-dark relative overflow-hidden flex-col justify-between p-20">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-brand-pink/20 rounded-full blur-[120px] animate-pulse" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[100px]" />
           <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
           <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
              <ArrowLeft className="w-5 h-5" />
           </div>
           <span className="font-bold tracking-tight">Return to Storefront</span>
        </Link>
        
        <div className="relative z-10">
           <motion.div 
             initial={{ opacity: 0, x: -30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 1 }}
           >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-brand-pink text-[10px] font-black uppercase tracking-[0.2em] mb-10">
                 <Sparkles className="w-3.5 h-3.5" />
                 India&apos;s #1 Print Engine
              </div>
              <h1 className="text-7xl font-black text-white tracking-tighter italic leading-[0.95] mb-12">
                 Join the <br/>
                 <span className="text-brand-pink underline decoration-brand-pink/30 decoration-8 underline-offset-8">Printing Revolution.</span>
              </h1>
              <div className="grid grid-cols-2 gap-8">
                 <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <ShieldCheck className="w-8 h-8 text-brand-lime mb-4" />
                    <h3 className="text-white font-black uppercase text-xs tracking-widest mb-2">Secure Platform</h3>
                    <p className="text-white/40 text-sm font-bold leading-relaxed">Enterprise-grade security for your brand assets and orders.</p>
                 </div>
                 <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <Zap className="w-8 h-8 text-cyan-400 mb-4" />
                    <h3 className="text-white font-black uppercase text-xs tracking-widest mb-2">Rapid Fulfillment</h3>
                    <p className="text-white/40 text-sm font-bold leading-relaxed">Lightning-fast processing from design to doorstep.</p>
                 </div>
              </div>
           </motion.div>
        </div>

        <div className="relative z-10 text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">
           © 2024 AtoZ Prints Global
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-gray-50/30">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-white p-8 lg:p-14 rounded-[48px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-gray-100"
        >
          <div className="text-center mb-12">
            <div className="relative h-12 w-40 mx-auto mb-10">
               <Image src="/logo.png" alt="Logo" fill className="object-contain mix-blend-multiply" />
            </div>
            <h2 className="text-4xl font-black text-brand-dark tracking-tighter italic uppercase mb-4">Start Your Empire</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Unlock exclusive creator tools and bulk rates</p>
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

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
               <input 
                 type="text" 
                 required
                 value={fullName}
                 onChange={(e) => setFullName(e.target.value)}
                 className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:bg-white focus:border-brand-pink focus:ring-4 focus:ring-brand-pink/5 outline-none transition-all font-bold text-brand-dark placeholder:text-gray-300 shadow-inner" 
                 placeholder="Enter your name" 
               />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Work Email</label>
               <input 
                 type="email" 
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:bg-white focus:border-brand-pink focus:ring-4 focus:ring-brand-pink/5 outline-none transition-all font-bold text-brand-dark placeholder:text-gray-300 shadow-inner" 
                 placeholder="name@company.com" 
               />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Secure Password</label>
               <input 
                 type="password" 
                 required
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="••••••••" 
                 className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[20px] focus:bg-white focus:border-brand-pink focus:ring-4 focus:ring-brand-pink/5 outline-none transition-all font-bold text-brand-dark placeholder:text-gray-300 shadow-inner" 
               />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-6 bg-brand-dark text-white rounded-[24px] text-xl font-black uppercase tracking-widest hover:bg-brand-pink shadow-2xl shadow-brand-dark/20 transition-all active:scale-95 disabled:opacity-50 mt-4 italic"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-12">
            <div className="relative flex items-center justify-center mb-8">
               <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
               </div>
               <span className="relative px-6 bg-white text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Direct Connect</span>
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
            Already a member? <Link href="/login" className="text-brand-pink hover:underline uppercase tracking-widest ml-1">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
