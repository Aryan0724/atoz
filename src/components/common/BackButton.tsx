'use client';

import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
    >
      <ArrowLeft className="w-4 h-4" /> Go Back
    </button>
  );
}
