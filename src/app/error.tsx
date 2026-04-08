'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Next.js Global Error Caught:', error);
  }, [error]);

  return (
    <div className="bg-brand-dark min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-red-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-lg w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 md:p-16 text-center shadow-2xl">
        <div className="w-24 h-24 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
          <AlertOctagon className="w-10 h-10 text-red-400" />
        </div>

        <h2 className="text-3xl font-black text-white tracking-tight mb-4 italic">System <span className="text-brand-pink">Fault</span> </h2>
        <p className="text-gray-400 font-medium mb-10 text-sm leading-relaxed">
          The canvas experienced an unexpected glitch. Don&apos;t worry, our architectural logs have recorded the occurrence.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => reset()}
            className="w-full py-4 bg-brand-pink text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-colors flex items-center justify-center gap-3 shadow-lg shadow-brand-pink/20"
          >
            <RotateCcw className="w-4 h-4" /> Try Recovery
          </button>
          
          <Link
            href="/"
            className="w-full py-4 bg-transparent text-white border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/5 transition-colors flex items-center justify-center gap-3"
          >
            <Home className="w-4 h-4" /> Return to Base
          </Link>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-[9px] font-black text-gray-500 uppercase tracking-widest text-left overflow-hidden">
          <p className="mb-2">Debug Trace:</p>
          <p className="font-mono text-red-400/70 truncate">{error.message || 'Unknown Execution Error'}</p>
        </div>
      </div>
    </div>
  );
}
