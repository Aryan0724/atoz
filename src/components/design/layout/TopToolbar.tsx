"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { CanvasObjectProperties } from '@/types/canvas';
import { 
  Type, Trash2, MoveUp, MoveDown, Layers, ChevronDown, 
  Bold, Italic, AlignLeft, AlignCenter, AlignRight, Sparkles, Loader2,
  Copy, Lock, Unlock, Eye, EyeOff
} from 'lucide-react';

interface TopToolbarProps {
  activeObject: CanvasObjectProperties | null;
  onUpdateActiveObject: (properties: Partial<CanvasObjectProperties>) => void;
  onDeleteActiveObject: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onRemoveBackground: () => Promise<boolean>;
  onDuplicate?: () => void;
  onLockToggle?: () => void;
  onSetTextShadow?: (options: { color: string; blur: number; offsetX: number; offsetY: number } | null) => void;
  onSetTextOutline?: (options: { color: string; width: number } | null) => void;
}

const fonts = [
  { name: 'Inter', family: "'Inter', sans-serif" },
  { name: 'Roboto', family: "'Roboto', sans-serif" },
  { name: 'Montserrat', family: "'Montserrat', sans-serif" },
  { name: 'Oswald', family: "'Oswald', sans-serif" },
  { name: 'Dancing Script', family: "'Dancing Script', cursive" },
  { name: 'Righteous', family: "'Righteous', cursive" },
  { name: 'Bebas Neue', family: "'Bebas Neue', sans-serif" },
];

const TopToolbar = ({
  activeObject,
  onUpdateActiveObject,
  onDeleteActiveObject,
  onBringForward,
  onSendBackward,
  onRemoveBackground,
  onDuplicate,
  onLockToggle,
  onSetTextShadow,
  onSetTextOutline
}: TopToolbarProps) => {
  const [isProcessing, setIsProcessing] = React.useState(false);

  if (!activeObject) return (
     <div className="h-14 border-b border-gray-100 bg-white flex items-center px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
        Select an element to edit
     </div>
  );

  const isText = activeObject.type.includes('text');
  const isImage = activeObject.type === 'image';

  return (
    <div className="min-h-14 h-auto md:h-14 border-b border-gray-100 bg-white flex flex-wrap md:flex-nowrap items-center px-4 py-2 md:py-0 gap-2 z-20 shadow-sm animate-in slide-in-from-top duration-300 overflow-x-auto no-scrollbar">
      
      {/* OBJECT TYPE LABEL */}
      <div className="px-3 py-1.5 bg-gray-50 rounded-lg text-[10px] font-black uppercase tracking-widest text-brand-dark mr-2 border border-gray-100">
        {activeObject.type.replace('i-', '')}
      </div>

      <div className="h-8 w-px bg-gray-100 mx-2" />

      <div className="h-8 w-px bg-gray-100 mx-2" />

      {/* COLOR PICKER - Available for all vector objects */}
      {!isImage && (
        <>
          <div className="relative w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 shadow-sm overflow-hidden shrink-0 hover:border-brand-pink transition-colors" title="Change Color">
            <input 
              type="color" 
              value={activeObject.fill || '#000000'} 
              onChange={(e) => onUpdateActiveObject({ fill: e.target.value })}
              className="absolute inset-[-10px] w-20 h-20 cursor-pointer opacity-0"
            />
            <div 
              className="w-full h-full pointer-events-none" 
              style={{ backgroundColor: activeObject.fill || '#000000' }} 
            />
          </div>
          <div className="h-8 w-px bg-gray-100 mx-2" />
        </>
      )}

      {/* TEXT SPECIFIC CONTACTUAL TOOLS */}
      {isText && (
        <>
          <div className="relative group">
            <button className="h-9 px-3 hover:bg-gray-50 rounded-lg flex items-center gap-2 border border-transparent hover:border-gray-100 transition-all">
              <span className="text-[11px] font-bold truncate max-w-[100px]" style={{ fontFamily: activeObject.fontFamily }}>
                {fonts.find(f => f.family === activeObject.fontFamily)?.name || 'Default'}
              </span>
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
               {fonts.map(f => (
                 <button
                   key={f.family}
                   onClick={() => onUpdateActiveObject({ fontFamily: f.family })}
                   className={cn(
                     "w-full text-left px-3 py-2 rounded-lg text-xs transition-colors hover:bg-pink-50 hover:text-brand-pink",
                     activeObject.fontFamily === f.family && "bg-pink-50 text-brand-pink"
                   )}
                   style={{ fontFamily: f.family }}
                 >
                   {f.name}
                 </button>
               ))}
            </div>
          </div>

          <div className="flex bg-gray-50 rounded-lg p-0.5">
             <button 
               onClick={() => onUpdateActiveObject({ fontSize: (activeObject.fontSize || 32) + 2 })}
               className="h-8 w-8 flex items-center justify-center font-bold text-gray-500 hover:text-brand-dark hover:bg-white rounded-md transition-all"
             >
               +
             </button>
             <div className="h-8 px-2 flex items-center text-xs font-black text-brand-pink bg-white rounded-md border border-gray-100 min-w-[32px] justify-center">
                {Math.round(activeObject.fontSize || 32)}
             </div>
             <button 
                onClick={() => onUpdateActiveObject({ fontSize: Math.max(8, (activeObject.fontSize || 32) - 2) })}
                className="h-8 w-8 flex items-center justify-center font-bold text-gray-500 hover:text-brand-dark hover:bg-white rounded-md transition-all"
             >
               -
             </button>
          </div>

           <div className="h-8 w-px bg-gray-100 mx-1" />

          {/* EFFECTS HUB */}
          <div className="relative group">
            <button className="h-9 px-3 hover:bg-gray-50 rounded-lg flex items-center gap-2 border border-transparent hover:border-gray-100 transition-all text-gray-500 hover:text-brand-pink">
              <Sparkles className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Effects</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-4">
               <div className="space-y-6">
                 {/* SHADOW SECTION */}
                 <div>
                   <div className="flex items-center justify-between mb-3">
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Shadow</span>
                     <button 
                       onClick={() => onSetTextShadow?.(activeObject.shadow ? null : { color: 'rgba(0,0,0,0.5)', blur: 10, offsetX: 5, offsetY: 5 })}
                       className={cn(
                         "text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all",
                         activeObject.shadow ? "bg-brand-pink text-white border-brand-pink" : "bg-gray-50 text-gray-400 border-gray-100"
                       )}
                     >
                       {activeObject.shadow ? 'ON' : 'OFF'}
                     </button>
                   </div>
                   
                   {activeObject.shadow && (
                     <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                       <div className="flex flex-col gap-1.5">
                         <div className="flex justify-between items-center text-[9px] font-bold text-gray-500 uppercase">
                           <span>Blur</span>
                           <span>{activeObject.shadow.blur}px</span>
                         </div>
                         <input 
                           type="range" min="0" max="50" step="1" 
                           value={activeObject.shadow.blur} 
                           onChange={(e) => onSetTextShadow?.({ ...activeObject.shadow!, blur: parseInt(e.target.value) })}
                           className="w-full h-1 bg-gray-100 rounded-full appearance-none accent-brand-pink"
                         />
                       </div>
                       <div className="flex flex-col gap-1.5">
                         <div className="flex justify-between items-center text-[9px] font-bold text-gray-500 uppercase">
                           <span>Offset</span>
                           <span>{activeObject.shadow.offsetX}px</span>
                         </div>
                         <input 
                           type="range" min="-30" max="30" step="1" 
                           value={activeObject.shadow.offsetX} 
                           onChange={(e) => onSetTextShadow?.({ ...activeObject.shadow!, offsetX: parseInt(e.target.value), offsetY: parseInt(e.target.value) })}
                           className="w-full h-1 bg-gray-100 rounded-full appearance-none accent-brand-pink"
                         />
                       </div>
                       <div className="flex gap-1 mt-2">
                         {['rgba(0,0,0,0.5)', '#E91E63', '#2196F3', '#4CAF50'].map(c => (
                           <button 
                             key={c}
                             onClick={() => onSetTextShadow?.({ ...activeObject.shadow!, color: c })}
                             className={cn(
                               "h-4 w-4 rounded-full border border-white shadow-sm ring-1 ring-black/5 transition-transform hover:scale-110",
                               activeObject.shadow?.color === c && "ring-2 ring-brand-pink ring-offset-1"
                             )}
                             style={{ backgroundColor: c }}
                           />
                         ))}
                       </div>
                     </div>
                   )}
                 </div>

                 <div className="h-px bg-gray-50" />

                 {/* OUTLINE SECTION */}
                 <div>
                   <div className="flex items-center justify-between mb-3">
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Outline</span>
                     <button 
                       onClick={() => onSetTextOutline?.(activeObject.strokeWidth ? null : { color: '#000000', width: 2 })}
                       className={cn(
                         "text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all",
                         activeObject.strokeWidth ? "bg-brand-pink text-white border-brand-pink" : "bg-gray-50 text-gray-400 border-gray-100"
                       )}
                     >
                       {activeObject.strokeWidth ? 'ON' : 'OFF'}
                     </button>
                   </div>

                   {activeObject.strokeWidth ? (
                     <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                       <div className="flex flex-col gap-1.5">
                         <div className="flex justify-between items-center text-[9px] font-bold text-gray-500 uppercase">
                           <span>Width</span>
                           <span>{activeObject.strokeWidth}px</span>
                         </div>
                         <input 
                           type="range" min="0" max="20" step="0.5" 
                           value={activeObject.strokeWidth} 
                           onChange={(e) => onSetTextOutline?.({ color: activeObject.stroke || '#000000', width: parseFloat(e.target.value) })}
                           className="w-full h-1 bg-gray-100 rounded-full appearance-none accent-black"
                         />
                       </div>
                       <div className="flex gap-1 mt-2">
                         {['#000000', '#FFFFFF', '#E91E63', '#FFEB3B'].map(c => (
                           <button 
                             key={c}
                             onClick={() => onSetTextOutline?.({ color: c, width: activeObject.strokeWidth || 2 })}
                             className={cn(
                               "h-4 w-4 rounded-full border border-white shadow-sm ring-1 ring-black/5 transition-transform hover:scale-110",
                               activeObject.stroke === c && "ring-2 ring-brand-pink ring-offset-1"
                             )}
                             style={{ backgroundColor: c }}
                           />
                         ))}
                       </div>
                     </div>
                   ) : null}
                 </div>
               </div>
            </div>
          </div>
        </>
      )}

      {/* IMAGE SPECIFIC TOOLS */}
      {isImage && (
        <button
          onClick={async () => {
            setIsProcessing(true);
            await onRemoveBackground();
            setIsProcessing(false);
          }}
          disabled={isProcessing}
          className="h-9 px-4 bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-cyan hover:text-white transition-all flex items-center gap-2"
        >
          {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
          BG REMOVAL
        </button>
      )}

      <div className="h-8 w-px bg-gray-100 mx-2" />

      {/* COMMON TOOLS (REORDER, DUPLICATE, LOCK) */}
      <div className="flex items-center gap-1">
        <button onClick={onBringForward} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-brand-dark" title="Bring to Front"><MoveUp className="h-4 w-4" /></button>
        <button onClick={onSendBackward} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-brand-dark" title="Send to Back"><MoveDown className="h-4 w-4" /></button>
        <button onClick={onDuplicate} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-brand-dark" title="Duplicate"><Copy className="h-4 w-4" /></button>
        <button onClick={onLockToggle} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-brand-dark" title="Toggle Lock">
          {activeObject.locked ? <Lock className="h-4 w-4 text-brand-pink" /> : <Unlock className="h-4 w-4" />}
        </button>
      </div>

      <div className="ml-auto flex items-center gap-3">
         <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Opacity</span>
            <input 
              type="range" min="0" max="1" step="0.1" value={activeObject.opacity ?? 1} 
              onChange={(e) => onUpdateActiveObject({ opacity: parseFloat(e.target.value) })}
              className="w-16 h-1 bg-gray-100 rounded-full appearance-none accent-brand-pink"
            />
         </div>
         <button 
           onClick={onDeleteActiveObject}
           className="h-9 w-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
         >
           <Trash2 className="h-4 w-4" />
         </button>
      </div>

    </div>
  );
};

export default TopToolbar;
