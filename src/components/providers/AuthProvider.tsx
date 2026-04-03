"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        // If profile doesn't exist yet (e.g., first login), it might error
        if (error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        }
        return;
      }
      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const signOut = async () => {
    try {
      console.log('[Auth] Initiating sign out...');
      
      // 1. CLEAR LOCALLY FIRST (Immediate)
      if (typeof window !== 'undefined') {
        const keysToRemove: string[] = ['atoz_demo_admin'];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('supabase') || key.includes('sb-') || key.includes('atoz'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        sessionStorage.clear();
        
        // Optimistically set states to null to trigger UI updates immediately
        setUser(null);
        setProfile(null);
      }

      // 2. Official signOut with 3s Timeout
      const performSignOut = async () => {
        const signoutPromise = supabase.auth.signOut();
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Signout Timeout')), 3000));
        return Promise.race([signoutPromise, timeoutPromise]);
      };

      await performSignOut().catch(err => console.warn('[Auth] Network signout warn:', err));

    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      // 3. Force hard reload to home page, guaranteed to happen
      if (typeof window !== 'undefined') {
        window.location.replace('/');
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
