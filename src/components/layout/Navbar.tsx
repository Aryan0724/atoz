"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User as UserIcon, ShoppingCart, Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/store/useCart';
import { usePathname, useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { useAuth } from '@/components/providers/AuthProvider';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setOpen, getItemCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const { user, profile, signOut } = useAuth();

  const navLinks = [
    { name: 'Products', href: '/products' },
    { name: 'Services', href: '/services' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About Us', href: '/about' },
  ];

  // Avoid hydration mismatch and setup Auth listener
  React.useEffect(() => {
    setMounted(true);
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
    // Proactively clear the demo flag if it exists
    if (typeof window !== 'undefined') {
      localStorage.removeItem('atoz_demo_admin');
    }
    await signOut();
    setIsMenuOpen(false);
  };

  const cartCount = mounted ? getItemCount() : 0;

  return (
    <nav className="sticky top-0 w-full z-50 glass-panel border-b border-outline-variant/10 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-3">
            <div className="relative h-10 w-10">
              <Image
                src="/logo.png"
                alt="AtoZ Print"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-black tracking-tighter font-headline text-on-surface hidden sm:block">AtoZ Print</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-bold tracking-tight transition-all relative group py-1",
                  pathname === link.href
                    ? "text-primary border-b-2 border-primary"
                    : "text-on-surface/70 hover:text-primary"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Icons and CTA */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="relative flex items-center">
              <form
                onSubmit={handleSearch}
                className={cn(
                  "flex items-center transition-all duration-300 overflow-hidden bg-surface-variant/20 rounded-full",
                  isSearchOpen ? "w-64 px-4 py-1.5 border border-primary/20" : "w-0 p-0"
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
                  isSearchOpen ? "text-primary" : "text-on-surface hover:text-primary"
                )}
              >
                {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </button>
            </div>

            <button
              onClick={() => setOpen(true)}
              aria-label="Open cart"
              className="p-2 text-on-surface hover:text-primary transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </button>

            {mounted && user ? (
              <div className="flex items-center gap-6 border-l border-outline-variant/20 pl-6">
                <Link
                  href={profile?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 hover:rotate-6">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-black text-on-surface group-hover:text-primary transition-colors tracking-tight italic">Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-on-surface/40 hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-brand-dark text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] shadow-2xl hover:bg-brand-pink hover:shadow-brand-pink/20 transition-all duration-300 hover:-translate-y-0.5 italic">
                Sign In
              </Link>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open mobile cart"
              className="p-2 text-on-surface hover:text-primary transition-colors relative"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="p-2 rounded-md text-on-surface hover:text-primary focus:outline-none"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-outline-variant/10 shadow-xl animate-in slide-in-from-top-2 duration-300 ease-out z-40">
          <div className="px-4 pt-4 pb-8 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 text-lg font-medium rounded-xl transition-all",
                  pathname === link.href ? "text-primary bg-primary/5 font-bold" : "text-on-surface hover:bg-surface"
                )}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-6 px-4 space-y-3">
              {mounted && user ? (
                <>
                  <Link
                    href={profile?.role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-4 bg-surface rounded-xl text-on-surface font-bold"
                  >
                    <UserIcon className="h-5 w-5 text-primary" />
                    {profile?.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
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
                  className="block w-full ink-gradient text-white text-center px-6 py-4 rounded-xl text-lg font-bold hover:shadow-lg transition-all"
                >
                  Sign In
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
