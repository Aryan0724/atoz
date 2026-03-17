"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      if (!user) {
        router.push('/login');
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user && !loading) {
          router.push('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-lightGray">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-brand-pink animate-spin" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Securing Connection...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
