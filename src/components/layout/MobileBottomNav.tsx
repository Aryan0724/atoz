"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, ShoppingCart, User as UserIcon } from 'lucide-react';
import { useCart } from '@/lib/store/useCart';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { setOpen, getItemCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setHasSession(!!data.session);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const cartCount = mounted ? getItemCount() : 0;

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Products', href: '/products', icon: ShoppingBag },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 z-50 pb-safe">
      <nav className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 min-w-[64px] min-h-[44px]", // 44x44px min touch target
                isActive ? "text-brand-pink" : "text-gray-400 hover:text-brand-dark transition-colors"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold tracking-wider">{item.name}</span>
            </Link>
          );
        })}

        {/* Cart Item - Trigger Drawer */}
        <button 
          onClick={() => setOpen(true)}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400 hover:text-brand-dark transition-colors relative min-w-[64px] min-h-[44px]"
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5" strokeWidth={2} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 h-4 w-4 bg-brand-pink text-white text-[10px] flex items-center justify-center rounded-full font-black shadow-sm">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-wider">Cart</span>
        </button>

        {/* Profile/Login */}
        <Link 
          href={hasSession ? "/dashboard" : "/login"}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full space-y-1 min-w-[64px] min-h-[44px]",
            pathname.includes('/dashboard') || pathname.includes('/login') ? "text-brand-pink" : "text-gray-400 hover:text-brand-dark transition-colors"
          )}
        >
          <UserIcon className="h-5 w-5" strokeWidth={pathname.includes('/dashboard') ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-wider">
            {hasSession ? "Profile" : "Login"}
          </span>
        </Link>
      </nav>
    </div>
  );
}
