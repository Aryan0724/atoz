"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Move, Maximize, Check } from 'lucide-react';

interface DesignArea {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface DesignAreaSelectorProps {
  imageUrl: string;
  initialArea?: DesignArea;
  onSave: (area: DesignArea) => void;
  onCancel: () => void;
  label: string;
}

export default function DesignAreaSelector({
  imageUrl,
  initialArea = { x: 150, y: 120, w: 200, h: 320 },
  onSave,
  onCancel,
  label
}: DesignAreaSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [area, setArea] = useState<DesignArea>(initialArea);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const CANVAS_SIZE = 500; // Designer uses a 500x625 grid internally

  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'resize') => {
    e.preventDefault();
    if (type === 'move') setIsDragging(true);
    else setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging && !isResizing) return;

      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;

      if (isDragging) {
        setArea(prev => ({
          ...prev,
          x: Math.max(0, Math.min(CANVAS_SIZE - prev.w, prev.x + dx)),
          y: Math.max(0, Math.min(625 - prev.h, prev.y + dy))
        }));
      } else if (isResizing) {
        setArea(prev => ({
          ...prev,
          w: Math.max(20, Math.min(CANVAS_SIZE - prev.x, prev.w + dx)),
          h: Math.max(20, Math.min(625 - prev.y, prev.h + dy))
        }));
      }
      setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, startPos]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/90 backdrop-blur-xl p-8">
      <div className="max-w-4xl w-full flex flex-col bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <header className="p-8 border-b border-gray-100 flex items-center justify-between">
           <div>
              <h2 className="text-2xl font-black text-brand-dark tracking-tighter italic">Define <span className="text-brand-pink">Print Area</span></h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label} — Drag to position, pull corner to resize</p>
           </div>
           <div className="flex items-center gap-3">
              <button 
                onClick={onCancel}
                className="px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all font-italic"
              >
                Cancel
              </button>
              <button 
                onClick={() => onSave(area)}
                className="px-8 py-2.5 bg-brand-pink text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-pink-200 transition-all active:scale-95 flex items-center gap-2 italic"
              >
                <Check className="h-4 w-4" />
                Done
              </button>
           </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-12 bg-[#f7f7f2]">
           <div 
             className="relative bg-white shadow-2xl rounded-2xl overflow-hidden ring-1 ring-black/5" 
             style={{ width: 400, height: 500 }} // Scaled display 4/5
           >
              <img src={imageUrl} alt="Mockup" className="w-full h-full object-contain opacity-50" />
              
              {/* Scaled Selection Overlay (Internal 500x625 -> Display 400x500) */}
              <div 
                className="absolute border-2 border-brand-pink bg-brand-pink/10 shadow-[0_0_20px_rgba(233,30,99,0.2)] rounded-lg group isolate"
                style={{
                  left: `${(area.x / 500) * 100}%`,
                  top: `${(area.y / 625) * 100}%`,
                  width: `${(area.w / 500) * 100}%`,
                  height: `${(area.h / 625) * 100}%`
                }}
              >
                 <div 
                   onMouseDown={(e) => handleMouseDown(e, 'move')}
                   className="absolute inset-0 cursor-move flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                    <Move className="h-6 w-6 text-brand-pink drop-shadow-sm" />
                 </div>
                 <div 
                   onMouseDown={(e) => handleMouseDown(e, 'resize')}
                   className="absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize flex items-center justify-center bg-brand-pink text-white rounded-tl-xl shadow-lg"
                 >
                    <Maximize className="h-4 w-4" />
                 </div>
                 
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-dark text-white text-[9px] font-black px-3 py-1 rounded-full whitespace-nowrap shadow-xl">
                    {area.w}px × {area.h}px
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
