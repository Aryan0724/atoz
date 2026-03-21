"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User as UserIcon, ShoppingCart, Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/store/useCart';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setOpen, getItemCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const navLinks = [
    { name: 'Products', href: '/products' },
    { name: 'Services', href: '/services' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About Us', href: '/about' },
  ];

  // Avoid hydration mismatch and setup Auth listener
  React.useEffect(() => {
    setMounted(true);
    
    // Initial user check
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    setIsMenuOpen(false);
  };

  const cartCount = mounted ? getItemCount() : 0;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <div className="relative h-14 w-40">
              <Image 
                src="/logo.png" 
                alt="AtoZ Print" 
                fill 
                className="object-contain mix-blend-multiply"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={cn(
                  "text-sm font-semibold transition-colors relative",
                  pathname === link.href ? "text-brand-pink" : "text-brand-dark hover:text-brand-pink"
                )}
              >
                {link.name}
                {pathname === link.href && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-pink rounded-full animate-in slide-in-from-left duration-300"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Icons and CTA */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="relative flex items-center">
              <form 
                onSubmit={handleSearch}
                className={cn(
                  "flex items-center transition-all duration-300 overflow-hidden bg-brand-lightGray rounded-full",
                  isSearchOpen ? "w-64 px-4 py-1.5 border border-brand-pink/20" : "w-0 p-0"
                )}
              >
                <input 
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm w-full focus:outline-none font-medium"
                  autoFocus={isSearchOpen}
                />
              </form>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label={isSearchOpen ? "Close search bar" : "Open search bar"}
                className={cn(
                  "p-2 transition-colors",
                  isSearchOpen ? "text-brand-pink" : "text-brand-dark hover:text-brand-pink"
                )}
              >
                {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </button>
            </div>
            
            <button 
              onClick={() => setOpen(true)}
              aria-label="Open cart"
              className="p-2 text-brand-dark hover:text-brand-pink transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-brand-pink text-white text-[10px] flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </button>
            
            {mounted && user ? (
              <div className="flex items-center gap-4 border-l border-gray-100 pl-6">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                   <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-all">
                      <UserIcon className="h-4 w-4" />
                   </div>
                   <span className="text-sm font-bold text-brand-dark group-hover:text-brand-pink transition-colors">Dashboard</span>
                </Link>
              </div>
            ) : (
              <Link href="/login" className="bg-brand-pink text-white px-8 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-pink-200 transition-all duration-200 active:scale-95">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <button 
              onClick={() => setOpen(true)}
              aria-label="Open mobile cart"
              className="p-2 text-brand-dark hover:text-brand-pink transition-colors relative"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-brand-pink text-white text-[10px] flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="p-2 rounded-md text-brand-dark hover:text-brand-pink focus:outline-none"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-4 pb-8 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 text-lg font-medium rounded-xl transition-all",
                  pathname === link.href ? "text-brand-pink bg-pink-50" : "text-brand-dark hover:bg-gray-50"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-6 px-4 space-y-3">
              {mounted && user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-4 bg-gray-50 rounded-xl text-brand-dark font-bold"
                  >
                    <UserIcon className="h-5 w-5 text-brand-pink" />
                    My Dashboard
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-4 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                  <Link 
                    href="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full bg-brand-pink text-white text-center px-6 py-4 rounded-xl text-lg font-bold hover:shadow-lg transition-all"
                  >
                    Sign In to AtoZ Print
                  </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
