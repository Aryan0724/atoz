"use client";

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { RotateCcw, Move3d } from 'lucide-react';

interface ThreeDPreviewProps {
  productImage: string;
  designDataUrl?: string | null;
  productName?: string;
  onClose?: () => void;
}

const ThreeDPreview: React.FC<ThreeDPreviewProps> = ({
  productImage,
  designDataUrl,
  productName = 'Product',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };

    setRotateY(prev => Math.max(-45, Math.min(45, prev + dx * 0.4)));
    setRotateX(prev => Math.max(-30, Math.min(30, prev - dy * 0.4)));
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleReset = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Auto gentle rotation when idle
  const [autoRotate, setAutoRotate] = useState(true);
  useEffect(() => {
    if (isDragging) { setAutoRotate(false); return; }
    // Resume auto-rotate after 3 seconds of no interaction
    const timer = setTimeout(() => setAutoRotate(true), 3000);
    return () => clearTimeout(timer);
  }, [isDragging, rotateX, rotateY]);

  useEffect(() => {
    if (!autoRotate) return;
    let frame: number;
    let angle = rotateY;
    const animate = () => {
      angle += 0.15;
      if (angle > 15) angle = -15;
      setRotateY(angle);
      setRotateX(Math.sin(angle * 0.05) * 3);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [autoRotate]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
      {/* Instruction */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-500 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-gray-100 shadow-sm pointer-events-none">
        <Move3d className="h-3.5 w-3.5" />
        Drag to Rotate
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="absolute top-2 right-2 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-all shadow-sm border border-gray-100"
        title="Reset rotation"
      >
        <RotateCcw className="h-4 w-4 text-gray-500" />
      </button>

      {/* 3D Container */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: '1200px' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          className="relative transition-transform duration-75 ease-out"
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transformStyle: 'preserve-3d',
            width: '100%',
            maxWidth: '360px',
            aspectRatio: '1',
          }}
        >
          {/* Product Image */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={productImage}
              alt={productName}
              fill
              className="object-cover pointer-events-none"
              draggable={false}
            />
          </div>

          {/* Design Overlay */}
          {designDataUrl && (
            <div
              className="absolute inset-[15%] pointer-events-none"
              style={{
                backgroundImage: `url(${designDataUrl})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                mixBlendMode: 'multiply',
                opacity: 0.9,
              }}
            />
          )}

          {/* Highlight / rim light effect */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: `linear-gradient(${135 + rotateY}deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)`,
            }}
          />
        </div>
      </div>

      {/* Shadow */}
      <div
        className="absolute bottom-4 w-48 h-4 rounded-full mx-auto bg-black/10 blur-xl transition-all duration-75"
        style={{
          transform: `translateX(${rotateY * 1.5}px) scaleX(${1 - Math.abs(rotateY) * 0.008})`,
        }}
      />
    </div>
  );
};

export default ThreeDPreview;
