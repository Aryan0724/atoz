"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) {
        console.error('Auth callback error:', error.message);
      }
      router.push('/dashboard');
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-lightGray">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 text-brand-pink animate-spin" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Finalizing secure login...</p>
      </div>
    </div>
  );
}
