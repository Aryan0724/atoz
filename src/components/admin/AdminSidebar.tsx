"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  ExternalLink,
  ChevronRight,
  Zap,
  Layout,
  LogOut,
  Clock,
  FileText,
  PenTool,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/AuthProvider';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { signOut } = useAuth();
  const handleLogout = async () => {
    // Proactively clear the demo flag if it exists
    if (typeof window !== 'undefined') {
      localStorage.removeItem('atoz_demo_admin');
    }
    await signOut();
  };

  const menuItems = [
    { name: 'Overview', href: '/admin', icon: <BarChart3 className="h-5 w-5" /> },
    { name: 'Products', href: '/admin/products', icon: <Package className="h-5 w-5" /> },
    { name: 'Categories', href: '/admin/categories', icon: <Layout className="h-5 w-5" /> },
    { name: 'Orders', href: '/admin/orders', icon: <ShoppingBag className="h-5 w-5" /> },
    { name: 'Inquiries', href: '/admin/inquiries', icon: <Zap className="h-5 w-5" /> },
    { name: 'Customers', href: '/admin/customers', icon: <Users className="h-5 w-5" /> },
    { name: 'Coupons', href: '/admin/coupons', icon: <Tag className="h-5 w-5" /> },
    { name: 'Abandoned Carts', href: '/admin/analytics/abandoned', icon: <Clock className="h-5 w-5" /> },
    { name: 'Website Content', href: '/admin/cms', icon: <FileText className="h-5 w-5" /> },
    { name: 'Blogs', href: '/admin/blogs', icon: <PenTool className="h-5 w-5" /> },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="relative h-10 w-32">
            <Image 
              src="/logo.png" 
              alt="A to Z Prints" 
              fill 
              className="object-contain mix-blend-multiply" 
            />
          </div>
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">Admin</span>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between group p-3 rounded-xl transition-all duration-200 w-full",
                  isActive 
                    ? "bg-brand-dark text-white" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-brand-dark"
                )}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    isActive ? "bg-white/10" : "bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-brand-pink"
                  )}>
                    {item.icon}
                  </div>
                  <span className="font-bold text-[13px] tracking-tight">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/40" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 pt-0 space-y-3">
        <Link 
          href="/"
          className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-brand-dark transition-all duration-300 border border-gray-100"
        >
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 group-hover:text-gray-500">Storefront</span>
            <span className="text-xs font-bold text-brand-dark group-hover:text-white transition-colors">A to Z Prints</span>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-gray-300 group-hover:text-brand-pink transition-colors" />
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-4 bg-red-50/50 rounded-2xl group hover:bg-red-500 transition-all duration-300 border border-red-100"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 group-hover:bg-white/20 transition-colors">
              <LogOut className="h-3.5 w-3.5 text-red-500 group-hover:text-white transition-colors" />
            </div>
            <span className="text-xs font-bold text-red-500 group-hover:text-white transition-colors">Logout</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
