'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ShieldCheck, X } from 'lucide-react';

/**
 * DevAdminBypass
 * 
 * Only renders in development mode.
 * Provides a floating button to instantly set the demo admin flag
 * in localStorage and redirect to the admin panel — no login required.
 * This component renders nothing in production.
 */
export default function DevAdminBypass() {
  const router = useRouter();
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(true);

  // Only show in development and not when already in admin
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (pathname?.startsWith('/admin')) return;
    setShow(true);
  }, [pathname]);

  if (!show || !visible) return null;

  const handleBypass = () => {
    localStorage.setItem('atoz_demo_admin', 'true');
    router.push('/admin');
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={handleBypass}
        className="flex items-center gap-2 px-4 py-2.5 bg-brand-dark text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl border border-white/10 hover:bg-brand-pink transition-all"
        title="Dev: Enter Admin Panel without login"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-brand-pink" />
        Dev Admin Access
      </button>
      <button
        onClick={() => setVisible(false)}
        className="w-7 h-7 rounded-full bg-gray-900/80 text-white/50 hover:text-white flex items-center justify-center transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
