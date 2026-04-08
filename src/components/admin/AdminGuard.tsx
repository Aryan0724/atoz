"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        console.log('[AdminGuard] Verifying session...');
        
        // DEMO BYPASS: Instant check
        if (typeof window !== 'undefined' && localStorage.getItem('atoz_demo_admin') === 'true') {
          console.log('[AdminGuard] Demo bypass.');
          setAuthorized(true);
          setLoading(false);
          return;
        }

        const fetchUserWithTimeout = async () => {
          const authPromise = supabase.auth.getUser();
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Auth Timeout')), 2000));
          return Promise.race([authPromise, timeoutPromise]) as Promise<any>;
        };

        const userResult = await fetchUserWithTimeout().catch(err => {
          console.warn('[AdminGuard] Auth fetch failed or timed out:', err);
          return { error: err, data: { user: null } };
        });

        const { data: { user }, error: authError } = userResult;

        if (authError || !user) {
          console.warn('[AdminGuard] No active session. Redirecting to login.');
          if (typeof window !== 'undefined') {
            window.location.replace('/login');
          }
          return;
        }

        const fetchProfileWithTimeout = async () => {
          const profilePromise = supabase.from('profiles').select('role').eq('id', user.id).single();
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Profile Timeout')), 2000));
          return Promise.race([profilePromise, timeoutPromise]) as Promise<any>;
        };

        const profileResult = await fetchProfileWithTimeout().catch(err => {
          console.warn('[AdminGuard] Profile fetch or timeout:', err);
          return { error: err, data: null };
        });

        const profile = profileResult.data;

        if (!profile || profile.role !== 'admin') {
          console.error(`[AdminGuard] Access denied. Role: ${profile?.role || 'none'}`);
          if (typeof window !== 'undefined') {
            window.location.replace('/');
          }
          return;
        }

        setAuthorized(true);
        setLoading(false);
      } catch (err) {
        console.error('[AdminGuard] Unexpected error:', err);
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
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">This should take less than 2 seconds</p>
        </div>
        
        <button 
          onClick={() => {
            // INSTANT LOGOUT ESCAPE HATCH
            console.log('[AdminGuard] Emergency Logout Triggered');
            if (typeof window !== 'undefined') {
              // 1. Clear everything locally first
              localStorage.removeItem('atoz_demo_admin');
              localStorage.removeItem('sb-fgtxaeyrsrtktazithwl-auth-token');
              // 2. Immediate redirect, don't wait for supabase
              window.location.replace('/');
              // 3. Attempt async signout as a background task
              supabase.auth.signOut().catch(() => {});
            }
          }}
          className="px-6 py-3 bg-white border border-gray-200 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-brand-pink hover:border-brand-pink/20 transition-all shadow-sm active:scale-95"
        >
          Cancel & Emergency Logout
        </button>
      </div>
    );
  }

  if (!authorized) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="h-8 w-8 text-brand-pink animate-spin" />
    </div>
  );
  return <>{children}</>;
}
