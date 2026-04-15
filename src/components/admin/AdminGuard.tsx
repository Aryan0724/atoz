"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // DEMO BYPASS: Instant check
        if (typeof window !== 'undefined' && localStorage.getItem('atoz_demo_admin') === 'true') {
          setAuthorized(true);
          return;
        }

        // Step 1: Get current user (5s timeout)
        const authResult = await Promise.race([
          supabase.auth.getUser(),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Auth timeout')), 5000))
        ]).catch(() => ({ data: { user: null }, error: new Error('Auth failed') }));

        const { data: { user }, error: authError } = authResult as any;

        if (authError || !user) {
          router.replace('/login');
          return;
        }

        // Step 2: Check role in profiles table (5s timeout)
        const profileResult = await Promise.race([
          supabase.from('profiles').select('role').eq('id', user.id).single(),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Profile timeout')), 5000))
        ]).catch(() => ({ data: null, error: new Error('Profile failed') }));

        const { data: profile } = profileResult as any;

        if (!profile || profile.role !== 'admin') {
          router.replace('/');
          return;
        }

        setAuthorized(true);
      } catch (err) {
        console.error('[AdminGuard] Unexpected error:', err);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 px-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-brand-pink animate-spin" />
          <p className="text-sm font-black text-brand-dark uppercase tracking-widest">Verifying Admin Access...</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Checking your credentials</p>
        </div>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('atoz_demo_admin');
              supabase.auth.signOut().finally(() => {
                window.location.replace('/login');
              });
            }
          }}
          className="px-6 py-3 bg-white border border-gray-200 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-brand-pink hover:border-brand-pink/20 transition-all shadow-sm active:scale-95"
        >
          Cancel &amp; Go to Login
        </button>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
