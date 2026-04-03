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
        // Log start for agent observability
        console.log('[AdminGuard] Verifying session...');
        
        // DEMO BYPASS: Check local storage for preview session
        if (typeof window !== 'undefined' && localStorage.getItem('atoz_demo_admin') === 'true') {
          console.log('[AdminGuard] Demo bypass detected.');
          setAuthorized(true);
          return;
        }

        const fetchUserWithTimeout = async () => {
          const authPromise = supabase.auth.getUser();
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Auth Timeout')), 3000));
          return Promise.race([authPromise, timeoutPromise]) as Promise<any>;
        };

        const userResult = await fetchUserWithTimeout().catch(err => ({ error: err, data: { user: null } }));
        const { data: { user }, error: authError } = userResult;

        if (authError || !user) {
          console.warn('[AdminGuard] No active session found. Redirecting to login.');
          router.push('/login');
          return;
        }

        const fetchProfileWithTimeout = async () => {
           const profilePromise = supabase.from('profiles').select('role').eq('id', user.id).single();
           const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Profile Timeout')), 3000));
           return Promise.race([profilePromise, timeoutPromise]) as Promise<any>;
        };

        const profileResult = await fetchProfileWithTimeout().catch(err => ({ error: err, data: null }));
        const profile = profileResult.data;

        if (!profile || profile.role !== 'admin') {
          console.error(`[AdminGuard] Access denied. User role: ${profile?.role || 'none'}`);
          router.push('/dashboard');
          return;
        }

        setAuthorized(true);
      } catch (err) {
        console.error('[AdminGuard] Critical error during verification:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <Loader2 className="h-12 w-12 text-brand-pink animate-spin" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Verifying Admin Access...</p>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
