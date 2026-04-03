"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Trash2, Copy, FlipHorizontal, FlipVertical, MoveUp, MoveDown, Lock, Unlock, X, ChevronRight
} from 'lucide-react';
import { CanvasObjectProperties } from '@/types/canvas';

interface FloatingToolbarProps {
  activeObject: CanvasObjectProperties | null;
  onDelete: () => void;
  onDuplicate: () => void;
  onFlipH: () => void;
  onFlipV: () => void;
  onLock: () => void;
  onClose: () => void;
}

const FloatingToolbar = ({
  activeObject,
  onDelete,
  onDuplicate,
  onFlipH,
  onFlipV,
  onLock,
  onClose
}: FloatingToolbarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (activeObject) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [activeObject]);

  if (!activeObject) return null;

  // Calculate position: typically just above or to the side of the selection
  // In a real fabric app, we'd use canvas.getActiveObject().getBoundingRect()
  // For now, we'll position it at a fixed-ish hover spot near the selection coordinates
  const top = (activeObject.top || 100) - 60;
  const left = (activeObject.left || 100);

  return (
    <div 
      className={cn(
        "absolute z-[100] flex items-center gap-1.5 p-1.5 bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl transition-all duration-300 ease-out isolate ring-1 ring-black/5 pointer-events-auto scale-90 md:scale-100",
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
      )}
      style={{ 
        top: Math.max(20, top), 
        left: left,
        transform: `translateX(-50%) ${isVisible ? 'scale(1)' : 'scale(0.95)'}`
      }}
    >
      <div className="flex items-center gap-0.5 px-1 border-r border-gray-100 mr-1">
         <span className="text-[9px] font-black text-brand-pink uppercase tracking-widest">{activeObject.type.replace('i-', '')}</span>
      </div>

      <ToolbarButton onClick={onDuplicate} icon={<Copy className="h-3.5 w-3.5" />} label="Duplicate" />
      <ToolbarButton onClick={onFlipH} icon={<FlipHorizontal className="h-3.5 w-3.5" />} label="Flip H" />
      <ToolbarButton onClick={onDelete} icon={<Trash2 className="h-3.5 w-3.5" />} label="Delete" variant="danger" />
      
      <div className="w-px h-6 bg-gray-100 mx-0.5" />
      
      <button 
        onClick={onClose}
        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-brand-dark transition-all"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

interface ToolbarButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant?: 'default' | 'danger';
}

const ToolbarButton = ({ onClick, icon, label, variant = 'default' }: ToolbarButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "group relative p-2 rounded-xl transition-all flex items-center justify-center",
      variant === 'danger' 
        ? "hover:bg-red-50 text-gray-400 hover:text-red-500" 
        : "hover:bg-brand-olive/10 text-gray-400 hover:text-brand-olive"
    )}
    title={label}
  >
    {icon}
    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-dark text-white text-[8px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-black uppercase tracking-tighter shadow-lg">
      {label}
    </span>
  </button>
);

export default FloatingToolbar;
