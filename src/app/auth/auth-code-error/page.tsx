"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-12 rounded-[48px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-gray-100 text-center"
      >
        <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mx-auto mb-8">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-black text-brand-dark tracking-tighter italic uppercase mb-4">
          Auth Failed
        </h1>
        
        <p className="text-gray-400 font-bold text-sm leading-relaxed mb-10 uppercase tracking-widest italic">
          We encountered an issue while verifying your secure login. This could be due to an expired session or internal provider error.
        </p>

        <div className="space-y-4">
          <Link 
            href="/login"
            className="flex items-center justify-center gap-3 w-full py-5 bg-brand-dark text-white rounded-[24px] text-sm font-black uppercase tracking-widest hover:bg-brand-pink transition-all shadow-xl shadow-brand-dark/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
          
          <Link 
            href="/"
            className="flex items-center justify-center w-full py-5 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-brand-dark transition-colors"
          >
            Storefront
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
