"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { ArrowLeft, Github, Chrome, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-brand-lightGray flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center text-brand-pink font-bold hover:scale-105 transition-all mb-8">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
        <div className="h-10 w-48 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center font-bold text-brand-pink text-xl italic mx-auto mb-6">
          A to Z Prints
        </div>
        <h2 className="text-center text-3xl font-black text-brand-dark tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Sign in to manage your brand and orders.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-12 px-10 shadow-2xl rounded-[40px] border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in zoom-in duration-300">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-pink/50 outline-none transition-all" 
                placeholder="name@company.com" 
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Password</label>
                <Link href="/forgot-password" hidden className="text-sm font-bold text-brand-pink hover:underline">
                  Forgot?
                </Link>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="mt-2 block w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-pink/50 outline-none transition-all" 
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center items-center py-5 px-4 bg-brand-pink rounded-2xl shadow-lg shadow-pink-200 text-lg font-black text-white hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400 font-bold uppercase tracking-widest text-xs">Or continue with</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleOAuthLogin('google')}
                className="w-full inline-flex justify-center py-4 px-4 rounded-2xl shadow-sm bg-white border border-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all active:scale-95"
              >
                <Chrome className="h-5 w-5 mr-3 text-red-500" />
                Google
              </button>
              <button 
                onClick={() => handleOAuthLogin('github')}
                className="w-full inline-flex justify-center py-4 px-4 rounded-2xl shadow-sm bg-white border border-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all active:scale-95"
              >
                <Github className="h-5 w-5 mr-3 text-gray-900" />
                GitHub
              </button>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-sm font-bold text-gray-500">
              Don&apos;t have an account? <Link href="/register" className="text-brand-pink hover:underline">Create for free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
