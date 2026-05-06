"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Move, Maximize, Check, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldMapping {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  align?: 'left' | 'center' | 'right';
  color?: string;
}

interface TemplateFieldMapperProps {
  imageUrl: string;
  fields: { id: string; label: string; type: string }[];
  initialMappings?: Record<string, FieldMapping>;
  onSave: (mappings: Record<string, FieldMapping>) => void;
  onCancel: () => void;
  label: string;
}

export default function TemplateFieldMapper({
  imageUrl,
  fields,
  initialMappings = {},
  onSave,
  onCancel,
  label
}: TemplateFieldMapperProps) {
  const [mappings, setMappings] = useState<Record<string, FieldMapping>>({});
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (canvasSize.w > 0 && canvasSize.h > 0 && Object.keys(initialMappings).length > 0 && Object.keys(mappings).length === 0) {
      const converted: Record<string, FieldMapping> = {};
      Object.keys(initialMappings).forEach(k => {
         const m = initialMappings[k];
         converted[k] = {
            ...m,
            x: (m.x / 100) * canvasSize.w,
            y: (m.y / 100) * canvasSize.h,
            w: (m.w / 100) * canvasSize.w,
            h: (m.h / 100) * canvasSize.h,
         };
      });
      setMappings(converted);
    }
  }, [canvasSize, initialMappings]);

  const handleMouseDown = (e: React.MouseEvent, fieldId: string, type: 'move' | 'resize') => {
    e.preventDefault();
    e.stopPropagation();
    setActiveField(fieldId);
    if (type === 'move') setIsDragging(true);
    else setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if ((!isDragging && !isResizing) || !activeField) return;

      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;

      setMappings(prev => {
        const field = prev[activeField];
        if (!field) return prev;

        if (isDragging) {
          return {
            ...prev,
            [activeField]: {
              ...field,
              x: Math.max(0, Math.min(canvasSize.w - field.w, field.x + dx)),
              y: Math.max(0, Math.min(canvasSize.h - field.h, field.y + dy))
            }
          };
        } else if (isResizing) {
          return {
            ...prev,
            [activeField]: {
              ...field,
              w: Math.max(20, Math.min(canvasSize.w - field.x, field.w + dx)),
              h: Math.max(10, Math.min(canvasSize.h - field.y, field.h + dy))
            }
          };
        }
        return prev;
      });

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
  }, [isDragging, isResizing, startPos, activeField]);

  const addFieldMapping = (fieldId: string) => {
    setMappings(prev => ({
      ...prev,
      [fieldId]: { id: fieldId, x: 100, y: 100, w: 150, h: 30, fontSize: 14, align: 'left', color: '#000000' }
    }));
    setActiveField(fieldId);
  };

  const removeFieldMapping = (fieldId: string) => {
    setMappings(prev => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
    if (activeField === fieldId) setActiveField(null);
  };

  const updateActiveField = (updates: Partial<FieldMapping>) => {
    if (!activeField) return;
    setMappings(prev => ({
      ...prev,
      [activeField]: { ...prev[activeField], ...updates }
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/90 backdrop-blur-xl p-8">
      <div className="max-w-6xl w-full flex flex-col bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 h-[90vh]">
        <header className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
           <div>
              <h2 className="text-2xl font-black text-brand-dark tracking-tighter italic">Map <span className="text-brand-pink">Template Fields</span></h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label} — Position form fields on the template</p>
           </div>
           <div className="flex items-center gap-3">
              <button 
                onClick={onCancel}
                className="px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all font-italic"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const percentageMappings: Record<string, FieldMapping> = {};
                  Object.keys(mappings).forEach(k => {
                     const m = mappings[k];
                     percentageMappings[k] = {
                        ...m,
                        x: (m.x / canvasSize.w) * 100,
                        y: (m.y / canvasSize.h) * 100,
                        w: (m.w / canvasSize.w) * 100,
                        h: (m.h / canvasSize.h) * 100,
                     };
                  });
                  onSave(percentageMappings);
                }}
                className="px-8 py-2.5 bg-brand-pink text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-pink-200 transition-all active:scale-95 flex items-center gap-2 italic"
              >
                <Check className="h-4 w-4" />
                Done
              </button>
           </div>
        </header>

        <div className="flex-1 flex overflow-hidden bg-[#f7f7f2]">
           {/* Sidebar: Fields List & Properties */}
           <div className="w-80 bg-white border-r border-gray-100 flex flex-col overflow-y-auto shrink-0">
             <div className="p-6">
                <h3 className="text-[11px] font-black text-brand-dark uppercase tracking-widest mb-4">Available Fields</h3>
                <div className="space-y-2">
                  {fields.map(f => {
                    const isMapped = !!mappings[f.id];
                    return (
                      <div key={f.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-brand-pink/30 transition-colors">
                        <div>
                          <span className="text-xs font-bold text-gray-700 block">{f.label}</span>
                          <span className="text-[9px] text-gray-400 uppercase tracking-widest">{f.type}</span>
                        </div>
                        {!isMapped ? (
                          <button onClick={() => addFieldMapping(f.id)} className="p-2 bg-white text-brand-pink rounded-lg shadow-sm hover:bg-brand-pink hover:text-white transition-all">
                            <Plus className="w-4 h-4" />
                          </button>
                        ) : (
                          <button onClick={() => removeFieldMapping(f.id)} className="p-2 bg-white text-red-500 rounded-lg shadow-sm hover:bg-red-500 hover:text-white transition-all">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {activeField && mappings[activeField] && (
                  <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                    <h3 className="text-[11px] font-black text-brand-dark uppercase tracking-widest mb-4 flex items-center justify-between">
                      Field Properties
                      <span className="text-brand-pink text-xs">{fields.find(f => f.id === activeField)?.label}</span>
                    </h3>
                                        <div className="space-y-3">
                       <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase">Font Size</label>
                            <input type="number" value={mappings[activeField].fontSize || 14} onChange={e => updateActiveField({ fontSize: parseInt(e.target.value) || 14 })} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-lg mt-1 outline-none focus:border-brand-pink/30 font-bold" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase">Weight</label>
                            <select value={mappings[activeField].fontWeight || 'normal'} onChange={e => updateActiveField({ fontWeight: e.target.value })} className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-100 rounded-lg mt-1 outline-none focus:border-brand-pink/30 font-bold">
                               <option value="normal">Normal</option>
                               <option value="bold">Bold</option>
                               <option value="900">Black</option>
                            </select>
                          </div>
                       </div>
                       
                       <div>
                         <label className="text-[10px] font-black text-gray-400 uppercase">Font Family</label>
                         <select value={mappings[activeField].fontFamily || 'Inter'} onChange={e => updateActiveField({ fontFamily: e.target.value })} className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-100 rounded-lg mt-1 outline-none focus:border-brand-pink/30 font-bold">
                            <option value="Inter">Inter (Sans)</option>
                            <option value="Outfit">Outfit (Round)</option>
                            <option value="Playfair Display">Playfair (Serif)</option>
                            <option value="Dancing Script">Dancing Script (Cursive)</option>
                            <option value="JetBrains Mono">JetBrains Mono (Mono)</option>
                         </select>
                       </div>

                       <div>
                         <label className="text-[10px] font-black text-gray-400 uppercase">Alignment</label>
                         <div className="flex gap-2 mt-1">
                            {['left', 'center', 'right'].map(align => (
                              <button key={align} onClick={() => updateActiveField({ align: align as any })} className={cn("flex-1 py-1.5 text-xs font-bold rounded-md border", mappings[activeField].align === align ? "bg-brand-pink text-white border-brand-pink" : "bg-white text-gray-500 border-gray-100")}>{align}</button>
                            ))}
                         </div>
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-gray-400 uppercase">Color</label>
                         <input type="color" value={mappings[activeField].color || '#000000'} onChange={e => updateActiveField({ color: e.target.value })} className="w-full h-8 mt-1 rounded cursor-pointer border-0 bg-transparent" />
                       </div>
                    </div>
                  </div>
                )}
             </div>
           </div>

           {/* Canvas Area */}
           <div className="flex-1 flex items-center justify-center p-12 overflow-auto" onClick={() => setActiveField(null)}>
              <div 
                className="relative bg-white shadow-2xl rounded-sm overflow-hidden ring-1 ring-black/5 shrink-0 inline-block max-w-full max-h-full" 
              >
                 <img 
                   src={imageUrl} 
                   alt="Mockup" 
                   className="max-w-[700px] max-h-[700px] pointer-events-none" 
                   onLoad={(e) => {
                     setCanvasSize({ w: e.currentTarget.width, h: e.currentTarget.height });
                   }}
                 />
                 
                 {Object.values(mappings).map((area) => (
                   <div 
                     key={area.id}
                     onClick={(e) => { e.stopPropagation(); setActiveField(area.id); }}
                     className={cn(
                       "absolute border-2 flex items-center justify-center overflow-hidden transition-colors cursor-pointer",
                       activeField === area.id ? "border-brand-pink bg-brand-pink/10 z-20 shadow-[0_0_20px_rgba(233,30,99,0.2)]" : "border-brand-cyan/50 bg-brand-cyan/5 z-10 hover:border-brand-cyan hover:bg-brand-cyan/20"
                     )}
                     style={{
                       left: `${(area.x / canvasSize.w) * 100}%`,
                       top: `${(area.y / canvasSize.h) * 100}%`,
                       width: `${(area.w / canvasSize.w) * 100}%`,
                       height: `${(area.h / canvasSize.h) * 100}%`
                     }}
                   >
                      <div className="text-[10px] font-black opacity-50 px-2 truncate flex flex-col items-center">
                        {fields.find(f => f.id === area.id)?.type === 'image' ? (
                           <>
                             <Plus className="w-4 h-4 mb-1" />
                             <span>{fields.find(f => f.id === area.id)?.label}</span>
                           </>
                        ) : (
                           fields.find(f => f.id === area.id)?.label || area.id
                        )}
                      </div>

                      {activeField === area.id && (
                        <>
                          <div 
                            onMouseDown={(e) => handleMouseDown(e, area.id, 'move')}
                            className="absolute inset-0 cursor-move"
                          />
                          <div 
                            onMouseDown={(e) => handleMouseDown(e, area.id, 'resize')}
                            className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-center justify-center bg-brand-pink text-white rounded-tl-lg shadow-lg z-30"
                          >
                             <Maximize className="h-3 w-3" />
                          </div>
                        </>
                      )}
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
