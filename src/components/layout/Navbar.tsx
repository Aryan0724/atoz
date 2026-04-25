'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ShoppingBag, LogOut, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/store/useCart';
import { useAuth } from '@/components/providers/AuthProvider';

const Navbar = () => {
  const pathname = usePathname();
  const { setOpen, getItemCount } = useCart();
  const { user, profile, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = mounted ? getItemCount() : 0;

  return (
    <nav 
      id="navbar"
      className={cn(
        "fixed w-full z-[100] top-0 left-0 transition-all duration-500 ease-in-out border-b border-transparent",
        isScrolled && "bg-brand-base/85 backdrop-blur-xl border-brand-darkBlue/5 h-[90px]"
      )}
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-12">
        <div className={cn(
          "flex justify-between items-center h-28 transition-all duration-500",
          isScrolled && "h-[90px]"
        )}>
          {/* Navbar Logo */}
          <Link href="/" className="group flex items-center gap-3 magnetic-target">
            <div className="relative w-14 h-14 transition-transform duration-300 group-hover:scale-110">
              <Image 
                src="https://i.postimg.cc/BbgxQXMj/Whats-App-Image-2026-02-05-at-12-10-39.png" 
                alt="ATOZPRINTS"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-serif font-bold text-3xl tracking-tight text-brand-darkBlue">ATOZ.</span>
          </Link>

          <div className="hidden lg:flex items-center gap-10 font-sans font-medium text-sm uppercase tracking-widest text-brand-darkBlue">
            <Link href="/" className={cn("nav-link transition-colors magnetic-target", pathname === '/' ? 'text-brand-gold' : 'hover:text-brand-gold')}>
              Home
            </Link>
            <Link href="/about" className={cn("nav-link transition-colors magnetic-target", pathname === '/about' ? 'text-brand-gold' : 'hover:text-brand-gold')}>
              About Us
            </Link>
            <Link href="/products" className={cn("nav-link transition-colors magnetic-target", pathname.startsWith('/products') ? 'text-brand-gold' : 'hover:text-brand-gold')}>
              Products
            </Link>
            <Link href="/contact" className={cn("nav-link transition-colors magnetic-target", pathname === '/contact' ? 'text-brand-gold' : 'hover:text-brand-gold')}>
              Contact Us
            </Link>
            <Link href="/faq" className={cn("nav-link transition-colors magnetic-target", pathname === '/faq' ? 'text-brand-gold' : 'hover:text-brand-gold')}>
              FAQs
            </Link>

            {/* Legal Dropdown */}
            <div className="relative group h-full flex items-center cursor-pointer magnetic-target">
              <span className="hover:text-brand-gold transition-colors flex items-center gap-1 py-6">
                Legal <ChevronDown className="w-3 h-3 mt-0.5 transition-transform duration-300 group-hover:rotate-180" />
              </span>
              
              <div className="absolute top-full left-0 w-full h-4 bg-transparent" />

              <div className="absolute top-[calc(100%-1rem)] right-0 w-56 bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(11,17,32,0.15)] border border-brand-darkBlue/5 rounded-2xl overflow-hidden legal-menu p-2 origin-top-right">
                <Link href="/privacy" className="block px-6 py-4 text-[11px] uppercase tracking-widest hover:bg-brand-base hover:text-brand-gold rounded-xl transition-colors font-bold text-brand-darkBlue">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block px-6 py-4 text-[11px] uppercase tracking-widest hover:bg-brand-base hover:text-brand-gold rounded-xl transition-colors font-bold text-brand-darkBlue">
                  Terms & Conditions
                </Link>
              </div>
            </div>
            
            {/* Cart Icon */}
            <button
              onClick={() => setOpen(true)}
              className="p-2.5 text-brand-darkBlue hover:text-brand-gold transition-colors relative magnetic-target"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-brand-gold text-white text-[9px] font-black flex items-center justify-center rounded-lg shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {mounted && user ? (
              <div className="flex items-center gap-6 border-l border-brand-darkBlue/5 pl-6">
                <Link
                  href={profile?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-3 group px-4 py-1.5 rounded-xl hover:bg-brand-base transition-all duration-300 magnetic-target"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-darkBlue text-white flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-darkBlue leading-tight">Dashboard</span>
                  </div>
                </Link>
                
                <button
                  onClick={() => signOut()}
                  className="p-2 text-brand-darkBlue/30 hover:text-red-500 transition-all magnetic-target"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="ml-6 px-10 py-4 bg-brand-darkBlue text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-gold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 magnetic-target shadow-md">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle (Simplified for now) */}
          <div className="lg:hidden flex items-center gap-4">
             <button
              onClick={() => setOpen(true)}
              className="p-2.5 text-brand-darkBlue relative"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-brand-gold text-white text-[9px] font-black flex items-center justify-center rounded-lg shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
            <Link href="/login" className="p-2.5 text-brand-darkBlue">
              <UserIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
