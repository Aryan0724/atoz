"use client";

import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith('/customize')) {
    return null;
  }

  return (
    <div className="fixed bottom-8 left-8 z-[100]">
      {isOpen && (
        <div className="mb-4 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-brand-dark p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-lg">AtoZ Support</h4>
                <p className="text-xs opacity-70">We&apos;re online and ready to help!</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <a 
              href="https://wa.me/91XXXXXXXXXX" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-green-50 text-green-700 rounded-2xl hover:bg-green-100 transition-colors group"
            >
              <div className="h-10 w-10 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">WhatsApp Us</p>
                <p className="text-[10px] opacity-70">Instant response</p>
              </div>
            </a>
            <a 
              href="mailto:support@atozprints.com"
              className="flex items-center gap-4 p-4 bg-blue-50 text-blue-700 rounded-2xl hover:bg-blue-100 transition-colors"
            >
              <div className="h-10 w-10 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Email Support</p>
                <p className="text-[10px] opacity-70">24h turnaround</p>
              </div>
            </a>
          </div>
          <div className="p-4 bg-gray-50 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AtoZ Prints Studio</p>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-16 w-16 bg-brand-pink text-white rounded-full shadow-2xl shadow-pink-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6 group-hover:rotate-12 transition-transform" />}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-cyan"></span>
        </span>
      </button>
    </div>
  );
}
