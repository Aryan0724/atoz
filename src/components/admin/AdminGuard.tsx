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

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          console.warn('[AdminGuard] No active session found. Redirecting to login.');
          router.push('/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role !== 'admin') {
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
