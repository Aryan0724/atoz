'use client';

import { useEffect } from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Admin Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-lg w-full bg-white rounded-3xl p-10 shadow-xl border border-gray-100 text-center">
        <div className="w-20 h-20 mx-auto bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
          <AlertOctagon className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-3">
          Admin Panel Error
        </h2>
        <p className="text-gray-500 text-sm font-medium mb-2 leading-relaxed">
          Something went wrong in the admin panel.
        </p>
        {error?.message && (
          <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100 text-left mb-6">
            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Error Detail:</p>
            <p className="text-xs font-mono text-red-500 break-all">{error.message}</p>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-pink transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/admin"
            className="w-full py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Admin Home
          </Link>
        </div>
      </div>
    </div>
  );
}
