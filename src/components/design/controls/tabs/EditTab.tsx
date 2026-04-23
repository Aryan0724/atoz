import React, { useState } from 'react';
import { Trash2, Trash, Pencil, ArrowLeft, ArrowRight, Sparkles, Loader2, Lock, Unlock, MoveUp, MoveDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CanvasObjectProperties } from '@/types/canvas';

interface EditTabProps {
  activeObject: CanvasObjectProperties | null;
  onUpdateActiveObject: (properties: Partial<CanvasObjectProperties>) => void;
  onDeleteActiveObject: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
}

import { designerFonts } from '@/lib/fontUtils';

const EditTab = ({ 
  activeObject, 
  onUpdateActiveObject, 
  onDeleteActiveObject, 
  onBringForward, 
  onSendBackward,
}: EditTabProps) => {
  const [activeFontCategory, setActiveFontCategory] = useState<string>('All');

  if (!activeObject) return null;

  const fontCategories = ['All', 'Sans-Serif', 'Serif', 'Handwritten', 'Display'];
  const filteredFonts = activeFontCategory === 'All' 
    ? designerFonts 
    : designerFonts.filter(f => f.category === activeFontCategory);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
         <div>
           <h3 className="text-xl font-black text-brand-dark tracking-tight capitalize">Edit {activeObject.type.replace('i-', '')}</h3>
           <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Properties Panel</p>
         </div>
         <button 
           onClick={onDeleteActiveObject}
           className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
         >
           <Trash2 className="h-4 w-4" />
         </button>
      </div>

      {/* TEXT CONTROLS */}
      {(activeObject.type === 'i-text' || activeObject.type === 'text') && (
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
               <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Typography</label>
               <div className="flex gap-2">
                  {fontCategories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveFontCategory(cat)}
                      className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md transition-all",
                        activeFontCategory === cat ? "bg-brand-pink text-white" : "text-gray-400 hover:text-brand-dark"
                      )}
                    >
                      {cat === 'Handwritten' ? 'Script' : cat}
                    </button>
                  ))}
               </div>
            </div>
            <div className="grid grid-cols-2 gap-2 h-44 overflow-y-auto no-scrollbar pb-2 pr-1">
              {filteredFonts.map((f) => (
                <button
                  key={f.family}
                  onClick={() => onUpdateActiveObject({ fontFamily: f.family })}
                  className={cn(
                    "px-3 py-2.5 rounded-xl border text-left transition-all text-sm truncate",
                    activeObject.fontFamily === f.family ? "border-brand-pink bg-pink-50 text-brand-pink shadow-sm scale-[1.02]" : "border-gray-50 hover:border-brand-pink/30 text-gray-600 bg-gray-50/50 hover:bg-white"
                  )}
                  style={{ fontFamily: f.family }}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4 mt-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Text Color</label>
              <div className="w-6 h-6 rounded border border-gray-200 shadow-sm" style={{ backgroundColor: activeObject.fill }} />
            </div>
            <div className="flex flex-wrap gap-2">
              {['#FFFFFF', '#000000', '#E91E63', '#2563eb', '#dc2626', '#D4AF37', '#14532d'].map(color => (
                 <button 
                   key={color}
                   onClick={() => onUpdateActiveObject({ fill: color })}
                   className={cn(
                     "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                     activeObject.fill === color ? "border-brand-pink ring-2 ring-brand-pink/20 scale-110" : "border-gray-200"
                   )}
                   style={{ backgroundColor: color }}
                 />
              ))}
            </div>
          </section>

          <section className="space-y-4">
             <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Text Alignment</label>
             <div className="flex gap-2">
                {['left', 'center', 'right'].map((align) => (
                   <button 
                     key={align}
                     onClick={() => onUpdateActiveObject({ textAlign: align })}
                     className={cn(
                        "flex-1 py-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all",
                        activeObject.textAlign === align ? "bg-brand-dark text-white border-brand-dark shadow-lg shadow-gray-200" : "bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-300"
                     )}
                   >
                     {align}
                   </button>
                ))}
             </div>
          </section>

          <section>
             <div className="flex justify-between items-center mb-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Font Size</label>
               <span className="text-xs font-black text-brand-pink bg-pink-50 px-3 py-1 rounded-full">{activeObject.fontSize}px</span>
             </div>
             <input
               type="range"
               min="8"
               max="200"
               value={activeObject.fontSize || 32}
               onChange={(e) => onUpdateActiveObject({ fontSize: parseInt(e.target.value) })}
               className="w-full accent-brand-pink h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
             />
          </section>
        </div>
      )}

      {/* IMAGE CONTROLS */}
      {activeObject.type === 'image' && (
        <div className="space-y-8">


           <section>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Visual Filters</label>
              <div className="space-y-8">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-dark">Grayscale</span>
                    <button 
                      onClick={() => onUpdateActiveObject({ _isGrayscale: !activeObject._isGrayscale })}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all relative p-1",
                        activeObject._isGrayscale ? "bg-brand-pink" : "bg-gray-200"
                      )}
                    >
                       <div className={cn(
                         "w-4 h-4 rounded-full bg-white shadow-sm transition-all",
                         activeObject._isGrayscale ? "translate-x-6" : "translate-x-0"
                       )} />
                    </button>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-brand-dark">Brightness</span>
                      <span className="text-[10px] font-black text-gray-400">{activeObject._brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={activeObject._brightness || 0}
                      onChange={(e) => onUpdateActiveObject({ _brightness: parseInt(e.target.value) })}
                      className="w-full accent-brand-dark h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                    />
                 </div>
              </div>
           </section>
        </div>
      )}

      {/* COMMON CONTROLS */}
      <div className="pt-8 border-t border-gray-100">
         <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Object Operations</h4>
         <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onBringForward}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 hover:bg-white border border-gray-100 hover:border-brand-dark rounded-xl text-xs font-bold text-gray-600 transition-all"
            >
              <MoveUp className="h-4 w-4" />
              Bring to Front
            </button>
            <button 
              onClick={onSendBackward}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 hover:bg-white border border-gray-100 hover:border-brand-dark rounded-xl text-xs font-bold text-gray-600 transition-all"
            >
              <MoveDown className="h-4 w-4" />
              Send to Back
            </button>
         </div>
      </div>
    </div>
  );
};

export default EditTab;
