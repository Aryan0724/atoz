"use client";

import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-brand-dark min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-pink/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-cyan/10 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center">
        <div className="relative mb-12">
           <div className="text-[150px] md:text-[200px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-gray-800 to-gray-900 select-none tracking-tighter">
             404
           </div>
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-700">
               <Search className="w-16 h-16 text-brand-pink" />
             </div>
           </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6 italic">
          Design <span className="text-brand-pink">Not Found</span>
        </h1>
        
        <p className="text-gray-400 text-lg font-medium mb-12 max-w-md mx-auto leading-relaxed">
          The canvas you&apos;re looking for seems to have been erased. It might have been moved or doesn&apos;t exist anymore.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            href="/"
            className="w-full sm:w-auto px-8 py-4 bg-brand-pink text-white rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-3 shadow-lg shadow-brand-pink/20"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
