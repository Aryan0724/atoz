"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Overview', href: '/admin', icon: <BarChart3 className="h-5 w-5" /> },
    { name: 'Products', href: '/admin/products', icon: <Package className="h-5 w-5" /> },
    { name: 'Orders', href: '/admin/orders', icon: <ShoppingBag className="h-5 w-5" /> },
    { name: 'Customers', href: '/admin/customers', icon: <Users className="h-5 w-5" /> },
    { name: 'Settings', href: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-brand-dark rounded-xl flex items-center justify-center text-white">
            <Settings className="h-6 w-6" />
          </div>
          <span className="text-xl font-black text-brand-dark tracking-tighter">Admin <span className="text-brand-pink">Console</span></span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between group p-3.5 rounded-2xl transition-all duration-200",
                  isActive 
                    ? "bg-brand-pink text-white shadow-xl shadow-pink-100" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-brand-dark"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-xl transition-colors",
                    isActive ? "bg-white/20" : "bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-brand-pink"
                  )}>
                    {item.icon}
                  </div>
                  <span className="font-bold text-sm tracking-tight">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-white/50" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 pt-0">
        <Link 
          href="/"
          className="flex items-center justify-between p-4 bg-brand-lightGray rounded-3xl group hover:bg-brand-dark transition-all duration-300"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-400">Storefront</span>
            <span className="text-sm font-bold text-brand-dark group-hover:text-white transition-colors">A to Z Prints</span>
          </div>
          <ExternalLink className="h-4 w-4 text-gray-300 group-hover:text-brand-pink transition-colors" />
        </Link>
      </div>
    </aside>
  );
}
