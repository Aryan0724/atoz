"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User as UserIcon, ShoppingBag, Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/store/useCart';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import Button from '@/components/common/Button';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setOpen, getItemCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const { user, profile, signOut } = useAuth();

  const navLinks = [
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/category' },
    { name: 'Prices', href: '/pricing' },
    { name: 'Offers', href: '/offers' },
    { name: 'Blog', href: '/blogs' },
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('atoz_demo_admin');
    }
    await signOut();
    setIsMenuOpen(false);
  };

  const cartCount = mounted ? getItemCount() : 0;

  return (
    <nav className="sticky top-0 w-full z-100 bg-white border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-3">
            <div className="relative h-9 w-9">
              <Image
                src="/logo.png"
                alt="AtoZ Print"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-lg font-bold tracking-tighter text-brand-dark hidden sm:block">AtoZ Print</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[13px] font-bold uppercase tracking-widest transition-all relative py-1",
                  pathname === link.href
                    ? "text-brand-pink"
                    : "text-gray-400 hover:text-brand-dark"
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
                  "flex items-center transition-all duration-300 overflow-hidden bg-gray-50 rounded-lg",
                  isSearchOpen ? "w-64 px-4 py-2 border border-brand-pink/10" : "w-0 p-0"
                )}
              >
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm w-full focus:outline-none font-bold italic text-brand-dark placeholder:text-gray-300"
                  autoFocus={isSearchOpen}
                />
              </form>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={cn(
                  "p-2.5 transition-colors",
                  isSearchOpen ? "text-brand-pink" : "text-gray-400 hover:text-brand-dark"
                )}
              >
                {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              </button>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="p-2.5 text-gray-400 hover:text-brand-dark transition-colors relative"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-brand-pink text-white text-[9px] font-black flex items-center justify-center rounded-lg shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {mounted && user ? (
              <div className="flex items-center gap-8 border-l border-gray-100 pl-8 h-10">
                <Link
                  href={profile?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-3 group px-4 py-1.5 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                   <div className="w-8 h-8 rounded-lg bg-brand-dark text-white flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-md shadow-brand-dark/10">
                      <UserIcon className="h-4 w-4" />
                   </div>
                   <div className="flex flex-col text-left">
                      <span className="text-[11px] font-black uppercase tracking-widest text-brand-dark leading-tight">Dashboard</span>
                      <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter leading-none">{profile?.role || 'User'}</span>
                   </div>
                </Link>
                
                <div className="h-6 w-px bg-gray-100 opacity-50" />

                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="primary" size="sm" className="px-6">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open mobile cart"
              className="p-2 text-on-surface hover:text-brand-pink transition-colors relative"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-brand-pink text-white text-[10px] flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="p-2 rounded-md text-on-surface hover:text-brand-pink focus:outline-none"
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
                  pathname === link.href ? "text-brand-pink bg-brand-pink/5 font-bold" : "text-on-surface hover:bg-surface"
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
                    className="flex items-center gap-3 px-4 py-4 bg-surface rounded-xl text-on-surface font-semibold"
                  >
                    <UserIcon className="h-5 w-5 text-brand-pink" />
                    {profile?.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-4 text-red-500 font-semibold hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full"
                >
                  <Button variant="primary" className="w-full py-4 text-lg">
                    Sign In
                  </Button>
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
