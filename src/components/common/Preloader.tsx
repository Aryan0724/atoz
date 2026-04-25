'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.to(loaderRef.current, {
      yPercent: -100,
      duration: 1.5,
      ease: 'power4.inOut',
      delay: 0.8,
      onComplete: () => {
        if (loaderRef.current) {
          loaderRef.current.style.display = 'none';
        }
      }
    });
  }, []);

  return (
    <div ref={loaderRef} className="loader-overlay overflow-hidden">
      <div className="relative flex flex-col items-center">
        <div className="flex items-center gap-4 mb-4">
           <span className="w-12 h-[2px] bg-brand-gold"></span>
           <span className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-white">ATOZPRINTS</span>
           <span className="w-12 h-[2px] bg-brand-gold"></span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif text-white italic">Engineering <span className="text-brand-gold">Excellence.</span></h1>
      </div>
    </div>
  );
}
