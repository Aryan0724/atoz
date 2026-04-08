"use client";

import React from 'react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '@/components/providers/AuthProvider';
import AdminGuard from './AdminGuard';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50/50">
        <AdminSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
