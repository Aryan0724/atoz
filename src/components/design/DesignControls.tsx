"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CanvasObjectProperties } from './DesignerCanvas';
import { uploadFile } from '@/lib/supabase/storage';
import { 
  Type, Palette, Image as ImageIcon, Upload, Trash2, Loader2, 
  Layers, Pencil, ArrowLeft, ArrowRight, Download, PlusSquare, Settings2, Grid, MoveUp, MoveDown, Sparkles, Eye, EyeOff, Lock, Unlock
} from 'lucide-react';

const productColors = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
  { name: 'Navy', hex: '#1e3a8a' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Forest Green', hex: '#14532d' },
  { name: 'Heather Gray', hex: '#94a3b8' },
  { name: 'Brand Pink', hex: '#E91E63' },
];

const shapes = [
  { name: 'Circle', type: 'circle' as const, icon: <div className="h-6 w-6 rounded-full border-2 border-brand-pink" /> },
  { name: 'Square', type: 'rect' as const, icon: <div className="h-6 w-6 border-2 border-brand-pink" /> },
  { name: 'Triangle', type: 'triangle' as const, icon: <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-brand-pink" /> },
];

const fonts = [
  { name: 'Inter', family: "'Inter', sans-serif" },
  { name: 'Roboto', family: "'Roboto', sans-serif" },
  { name: 'Open Sans', family: "'Open Sans', sans-serif" },
  { name: 'Lato', family: "'Lato', sans-serif" },
  { name: 'Montserrat', family: "'Montserrat', sans-serif" },
  { name: 'Oswald', family: "'Oswald', sans-serif" },
  { name: 'Playfair Display', family: "'Playfair Display', serif" },
  { name: 'Merriweather', family: "'Merriweather', serif" },
  { name: 'Lora', family: "'Lora', serif" },
  { name: 'Dancing Script', family: "'Dancing Script', cursive" },
  { name: 'Pacifico', family: "'Pacifico', cursive" },
  { name: 'Caveat', family: "'Caveat', cursive" },
  { name: 'Righteous', family: "'Righteous', cursive" },
  { name: 'Bebas Neue', family: "'Bebas Neue', sans-serif" },
  { name: 'Lobster', family: "'Lobster', cursive" },
];

interface DesignControlsProps {
  productColor: string;
  onProductColorChange: (color: string) => void;
  activeObject: CanvasObjectProperties | null;
  onUpdateActiveObject: (properties: Partial<CanvasObjectProperties>) => void;
  onUpdateObjectById?: (id: string, properties: Partial<CanvasObjectProperties>) => void;
  onAddText: (text: string) => void;
  onAddImage: (url: string) => void;
  onAddShape: (type: 'circle' | 'rect' | 'triangle') => void;
  onDeleteActiveObject: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onDownload: () => void;
  onRemoveBackground: () => Promise<boolean>;
  layers: any[];
}

const DesignControls = ({
  productColor,
  onProductColorChange,
  activeObject,
  onUpdateActiveObject,
  onUpdateObjectById,
  onAddText,
  onAddImage,
  onAddShape,
  onDeleteActiveObject,
  onBringForward,
  onSendBackward,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onDownload,
  onRemoveBackground,
  layers
}: DesignControlsProps) => {
  const [activeTab, setActiveTab] = useState<'add' | 'edit' | 'product' | 'layers'>('add');
  const [uploading, setUploading] = useState(false);

  // Auto-switch to edit tab when an object is selected
  useEffect(() => {
    if (activeObject) {
      setActiveTab('edit');
    } else if (activeTab === 'edit') {
      setActiveTab('add');
    }
  }, [activeObject]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `upload-${Date.now()}-${file.name}`;
      const publicUrl = await uploadFile('designs', fileName, file);
      if (publicUrl) {
        onAddImage(publicUrl);
        setActiveTab('edit'); // switch to edit mode once added
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Dynamic Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar relative z-10 shrink-0">
        {[
          { id: 'add', icon: <PlusSquare className="h-5 w-5" />, label: 'Add' },
          { id: 'edit', icon: <Settings2 className="h-5 w-5" />, label: 'Edit' },
          { id: 'layers', icon: <Layers className="h-5 w-5" />, label: 'Layers' },
          { id: 'product', icon: <Palette className="h-5 w-5" />, label: 'Product' },
        ].map((tab) => {
          const disabled = tab.id === 'edit' && !activeObject;
          return (
            <button 
              key={tab.id}
              disabled={disabled}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 min-w-[70px] flex flex-col items-center py-5 transition-all relative",
                activeTab === tab.id ? "text-brand-pink" : "text-gray-400 hover:text-brand-dark",
                disabled && "opacity-30 cursor-not-allowed hover:text-gray-400"
              )}
            >
              {tab.icon}
              <span className="text-[9px] font-black uppercase tracking-widest mt-2">{tab.label}</span>
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-brand-pink rounded-t-full shadow-[0_-2px_10px_rgba(233,30,99,0.5)]"></span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-24">
        
        {/* ADD TAB */}
        {activeTab === 'add' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
            <h3 className="text-xl font-black text-brand-dark tracking-tight">Add Elements</h3>
            
            <section className="space-y-3">
              <button 
                onClick={() => onAddText("Double click to edit")}
                className="w-full bg-gray-50 hover:bg-brand-pink/5 hover:border-brand-pink/30 border border-transparent rounded-2xl p-6 flex flex-col items-center justify-center transition-all group"
              >
                <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Type className="h-6 w-6 text-brand-pink" />
                </div>
                <span className="font-bold text-sm text-brand-dark">Add Custom Text</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Rich Typography</span>
              </button>
            </section>

            <section className="space-y-3">
              <label className="relative w-full bg-gray-50 hover:bg-brand-pink/5 hover:border-brand-pink/30 border border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center transition-all group cursor-pointer">
                {uploading ? (
                  <Loader2 className="h-8 w-8 text-brand-pink animate-spin" />
                ) : (
                  <>
                    <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="h-6 w-6 text-brand-pink" />
                    </div>
                    <span className="font-bold text-brand-dark text-sm">Upload Image</span>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">PNG, JPG, SVG</span>
                  </>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </section>

            <section>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Basic Shapes</h4>
              <div className="grid grid-cols-3 gap-3">
                {shapes.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => onAddShape(s.type)}
                    className="flex flex-col items-center justify-center h-24 bg-gray-50 rounded-2xl hover:bg-pink-50 hover:text-brand-pink transition-all group border border-transparent hover:border-brand-pink/20"
                  >
                    <div className="group-hover:scale-110 transition-transform">
                      {s.icon}
                    </div>
                    <span className="text-[9px] font-bold uppercase mt-3">{s.name}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* EDIT TAB (Contextual) */}
        {activeTab === 'edit' && activeObject && (
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
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Font Family</label>
                  <div className="grid grid-cols-2 gap-2 h-40 overflow-y-auto no-scrollbar pb-2 pr-1">
                    {fonts.map((f) => (
                      <button
                        key={f.family}
                        onClick={() => onUpdateActiveObject({ fontFamily: f.family })}
                        className={cn(
                          "px-3 py-2 rounded-xl border text-left transition-all text-[11px] truncate",
                          activeObject.fontFamily === f.family ? "border-brand-pink bg-pink-50 text-brand-pink shadow-sm" : "border-gray-100 hover:border-brand-pink/30 text-gray-600 bg-gray-50 hover:bg-white"
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

                  <div className="flex items-center justify-between mb-4 mt-8 w-full">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Stroke / Outline</label>
                     <div className="flex gap-2 items-center">
                       <input 
                         type="range" min="0" max="10" value={activeObject.strokeWidth || 0}
                         onChange={(e) => onUpdateActiveObject({ strokeWidth: parseInt(e.target.value) })}
                         className="w-16 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                       />
                       <span className="text-[10px] font-bold text-brand-pink w-3">{activeObject.strokeWidth || 0}</span>
                     </div>
                  </div>
                  <div className="flex w-full mb-3 gap-2 overflow-x-auto no-scrollbar pb-2">
                     {['transparent', '#000000', '#FFFFFF', '#E91E63', '#2563eb', '#dc2626', '#14532d', '#D4AF37'].map(color => (
                        <button 
                          key={`stroke-${color}`}
                          onClick={() => onUpdateActiveObject({ stroke: color === 'transparent' ? '' : color })}
                          className={cn(
                             "shrink-0 w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center",
                             (activeObject.stroke === color || (color === 'transparent' && !activeObject.stroke)) ? "border-brand-pink ring-2 ring-brand-pink/20 scale-110" : "border-gray-200"
                          )}
                          style={{ backgroundColor: color === 'transparent' ? '#f9fafb' : color }}
                        >
                          {color === 'transparent' && <span className="text-[10px] font-black text-gray-400">Ø</span>}
                        </button>
                      ))}
                  </div>

                  <div className="flex items-center justify-between mb-2 mt-6 w-full">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Drop Shadow</label>
                     <div className="flex gap-2 items-center">
                       <input 
                         type="range" min="0" max="25" value={activeObject.shadow?.blur || 0}
                         onChange={(e) => {
                           const val = parseInt(e.target.value);
                           onUpdateActiveObject({ 
                             shadow: val === 0 ? undefined : { color: activeObject.shadow?.color || 'rgba(0,0,0,0.4)', blur: val, offsetX: activeObject.shadow?.offsetX || val/2, offsetY: activeObject.shadow?.offsetY || val/2 } 
                           });
                         }}
                         className="w-16 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                       />
                       <span className="text-[10px] font-bold text-brand-pink w-3">{activeObject.shadow?.blur || 0}</span>
                     </div>
                  </div>
                  {activeObject.shadow?.blur && activeObject.shadow.blur > 0 && (
                    <>
                      <div className="flex items-center justify-between mb-2 mt-4 w-full">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Shadow Color</label>
                        <div className="flex gap-2">
                          {['#000000', '#FFFFFF', '#E91E63', '#2563eb'].map(color => (
                            <button
                              key={`shadow-color-${color}`}
                              onClick={() => onUpdateActiveObject({ shadow: { ...activeObject.shadow!, color: color } })}
                              className={cn(
                                "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                                activeObject.shadow?.color === color ? "border-brand-pink ring-2 ring-brand-pink/20 scale-110" : "border-gray-200"
                              )}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2 mt-4 w-full">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Offset X</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="range" min="-20" max="20" value={activeObject.shadow?.offsetX || 0}
                            onChange={(e) => onUpdateActiveObject({ shadow: { ...activeObject.shadow!, offsetX: parseInt(e.target.value) } })}
                            className="w-16 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                          />
                          <span className="text-[10px] font-bold text-brand-pink w-3">{activeObject.shadow?.offsetX || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2 mt-4 w-full">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Offset Y</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="range" min="-20" max="20" value={activeObject.shadow?.offsetY || 0}
                            onChange={(e) => onUpdateActiveObject({ shadow: { ...activeObject.shadow!, offsetY: parseInt(e.target.value) } })}
                            className="w-16 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                          />
                          <span className="text-[10px] font-bold text-brand-pink w-3">{activeObject.shadow?.offsetY || 0}</span>
                        </div>
                      </div>
                    </>
                  )}
                </section>

                <section className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Font Size</span>
                      <span className="text-xs font-bold text-brand-pink">{Math.round(activeObject.fontSize || 0)}</span>
                    </div>
                    <input 
                      type="range" min="10" max="200" value={activeObject.fontSize || 32}
                      onChange={(e) => onUpdateActiveObject({ fontSize: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Letter Spacing</span>
                      <span className="text-xs font-bold text-brand-pink">{activeObject.charSpacing || 0}</span>
                    </div>
                    <input 
                      type="range" min="-100" max="800" value={activeObject.charSpacing || 0}
                      onChange={(e) => onUpdateActiveObject({ charSpacing: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                    />
                  </div>

                  <div>
                     <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Curve Text</span>
                       <span className="text-xs font-bold text-brand-pink">{activeObject._curve || 0}</span>
                     </div>
                     <input 
                       type="range" min="-100" max="100" value={activeObject._curve || 0}
                       onChange={(e) => onUpdateActiveObject({ _curve: parseInt(e.target.value) })}
                       className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                     />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Line Height</span>
                      <span className="text-xs font-bold text-brand-pink">{activeObject.lineHeight?.toFixed(1) || 1.2}</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="3" step="0.1" value={activeObject.lineHeight || 1.16}
                      onChange={(e) => onUpdateActiveObject({ lineHeight: parseFloat(e.target.value) })}
                      className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                    />
                  </div>
                </section>
              </div>
            )}

            {/* IMAGE CONTROLS */}
            {activeObject.type === 'image' && (
              <div className="space-y-8">
                <section className="mb-2">
                  <button
                    onClick={async () => {
                      setUploading(true);
                      const success = await onRemoveBackground();
                      setUploading(false);
                      if (!success) alert("Failed to remove background. Please check API Key in .env.local");
                    }}
                    disabled={uploading}
                    className="w-full bg-gradient-to-r from-brand-cyan to-blue-500 hover:opacity-90 disabled:opacity-50 text-white font-black text-[11px] rounded-xl py-4 shadow-xl shadow-cyan-500/20 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} 
                    {uploading ? 'Processing AI...' : 'Remove Background (AI)'}
                  </button>
                </section>
                <section>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Opacity</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" min="0" max="1" step="0.05" value={activeObject.opacity ?? 1}
                      onChange={(e) => onUpdateActiveObject({ opacity: parseFloat(e.target.value) })}
                      className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                    />
                    <span className="text-xs font-bold text-brand-pink min-w-[30px]">{Math.round((activeObject.opacity ?? 1) * 100)}%</span>
                  </div>
                </section>

                <section className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark border-b border-gray-100 pb-2">Image Filters</h4>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Grayscale Mode</span>
                    <button 
                      onClick={() => onUpdateActiveObject({ _isGrayscale: !activeObject._isGrayscale })}
                      className={cn(
                        "w-12 h-6 rounded-full transition-colors relative",
                        activeObject._isGrayscale ? "bg-brand-pink" : "bg-gray-300"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full bg-white absolute top-1 transition-transform shadow-sm",
                        activeObject._isGrayscale ? "left-7" : "left-1"
                      )} />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Brightness</span>
                      <span className="text-xs font-bold text-brand-pink">{activeObject._brightness || 0}</span>
                    </div>
                    <input 
                      type="range" min="-100" max="100" value={activeObject._brightness || 0}
                      onChange={(e) => onUpdateActiveObject({ _brightness: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                    />
                  </div>

                  <div>
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contrast</span>
                        <span className="text-xs font-bold text-brand-pink">{activeObject._contrast || 0}</span>
                     </div>
                     <input 
                        type="range" min="-100" max="100" value={activeObject._contrast || 0}
                        onChange={(e) => onUpdateActiveObject({ _contrast: parseInt(e.target.value) })}
                        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                     />
                  </div>
                </section>
              </div>
            )}

            {/* SHAPE CONTROLS */}
            {['circle', 'rect', 'triangle'].includes(activeObject.type) && (
              <div className="space-y-8">
                <section>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Shape Color</label>
                  <div className="grid grid-cols-5 gap-3">
                    {['#E91E63', '#000000', '#FFFFFF', '#2563eb', '#dc2626', '#14532d', '#94a3b8', '#D4AF37', '#6366f1', '#10b981'].map(color => (
                        <button 
                          key={color}
                          onClick={() => onUpdateActiveObject({ fill: color })}
                          className={cn(
                            "aspect-square rounded-full border-2 transition-transform hover:scale-110 shadow-sm",
                            activeObject.fill === color ? "border-brand-pink ring-2 ring-brand-pink/20 scale-110" : "border-gray-200"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                  </div>
                </section>
                <section>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Opacity</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" min="0" max="1" step="0.05" value={activeObject.opacity ?? 1}
                      onChange={(e) => onUpdateActiveObject({ opacity: parseFloat(e.target.value) })}
                      className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                    />
                    <span className="text-xs font-bold text-brand-pink min-w-[30px]">{Math.round((activeObject.opacity ?? 1) * 100)}%</span>
                  </div>
                </section>
              </div>
            )}

            {/* LAYER ORDERING (Global for Any Selection) */}
            <section className="pt-6 border-t border-gray-100 space-y-3">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Layer Position</h4>
               <div className="grid grid-cols-2 gap-3">
                 <button 
                   onClick={onBringForward}
                   className="flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl hover:bg-brand-pink/10 hover:text-brand-pink text-[10px] font-bold transition-colors"
                 >
                   <MoveUp className="h-4 w-4" /> Bring Forward
                 </button>
                 <button 
                   onClick={onSendBackward}
                   className="flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl hover:bg-gray-200 text-[10px] font-bold transition-colors"
                 >
                   <MoveDown className="h-4 w-4" /> Send Backward
                 </button>
               </div>
            </section>
          </div>
        )}

        {/* LAYERS TAB */}
        {activeTab === 'layers' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-brand-dark tracking-tight">Layers</h3>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{layers.length} Objects</span>
             </div>
             
             {layers.length === 0 ? (
                 <div className="text-center py-10">
                     <Layers className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Canvas is empty</p>
                 </div>
             ) : (
                <div className="space-y-2">
                    {layers.map((layer, index) => {
                       const isSelected = activeObject?.id === layer.id;
                       return (
                          <div 
                             key={layer.id || index}
                             className={cn(
                                "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer",
                                isSelected ? "bg-pink-50 border-brand-pink/30 shadow-sm" : "bg-white border-gray-100 hover:border-brand-pink/30 hover:bg-gray-50"
                             )}
                          >
                             <div className="flex items-center gap-3">
                                {layer.type.includes('text') ? <Type className="h-4 w-4 text-brand-pink" /> 
                                : layer.type === 'image' ? <ImageIcon className="h-4 w-4 text-brand-cyan" /> 
                                : <Grid className="h-4 w-4 text-brand-dark" />}
                                
                                <span className={cn(
                                   "text-[11px] font-bold truncate max-w-[150px]",
                                   isSelected ? "text-brand-pink" : "text-gray-600"
                                )}>
                                   {layer.type.includes('text') ? `"${layer.text}"` : layer.type}
                                 </span>
                              </div>
                              <div className="flex items-center gap-1.5 ml-auto">
                                 {isSelected && <span className="text-[9px] font-black tracking-widest text-brand-pink uppercase mr-2">Active</span>}
                                 {onUpdateObjectById && (
                                    <>
                                       <button 
                                          title="Toggle Visibility"
                                          onClick={(e) => { e.stopPropagation(); onUpdateObjectById(layer.id, { visible: layer.visible === false ? true : false }); }}
                                          className={cn("p-1.5 rounded border transition-all hover:scale-110", layer.visible === false ? "bg-gray-100 border-gray-200 text-gray-400" : "bg-white border-gray-100 text-brand-dark hover:border-brand-pink/30")}
                                       >
                                          {layer.visible === false ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                       </button>
                                       <button 
                                          title="Lock/Unlock Layer"
                                          onClick={(e) => { e.stopPropagation(); onUpdateObjectById(layer.id, { locked: !layer.locked }); }}
                                          className={cn("p-1.5 rounded border transition-all hover:scale-110", layer.locked ? "bg-pink-50 border-brand-pink/30 text-brand-pink" : "bg-white border-gray-100 text-gray-400 hover:text-brand-dark hover:border-brand-pink/30")}
                                       >
                                          {layer.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                                       </button>
                                    </>
                                 )}
                              </div>
                           </div>
                       )
                    })}
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center mt-6">
                       Top item is at the front
                    </p>
                </div>
             )}
          </div>
        )}

        {/* PRODUCT TAB */}
        {activeTab === 'product' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-xl font-black text-brand-dark tracking-tight mb-6">Product Options</h3>
            <div className="grid grid-cols-4 gap-4">
              {productColors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => onProductColorChange(color.hex)}
                  className={cn(
                    "group relative aspect-square rounded-2xl flex items-center justify-center transition-all",
                    productColor === color.hex ? "ring-4 ring-brand-pink/20 scale-105" : "hover:scale-105 shadow-sm"
                  )}
                  style={{ backgroundColor: color.hex, border: color.hex === '#FFFFFF' ? '1px solid #e5e7eb' : 'none' }}
                >
                  {productColor === color.hex && (
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      ['#FFFFFF', '#Heather Gray'].includes(color.name) ? "bg-brand-pink" : "bg-white"
                    )} />
                  )}
                </button>
              ))}
            </div>
            <p className="text-[10px] font-bold text-gray-400 mt-6 text-center leading-relaxed">Changing product color applies to the physical production and shipping unit.</p>
          </div>
        )}
      </div>

      {/* Persistent Bottom Action Bar */}
      <div className="absolute bottom-0 w-full p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 flex items-center justify-between z-20">
         <div className="flex bg-gray-100 rounded-full p-1">
             <button 
                onClick={onUndo}
                disabled={!canUndo}
                className="p-2.5 rounded-full hover:bg-white text-gray-500 disabled:opacity-30 transition-all hover:shadow-sm"
             >
                <ArrowLeft className="h-4 w-4" />
             </button>
             <button 
                onClick={onRedo}
                disabled={!canRedo}
                className="p-2.5 rounded-full hover:bg-white text-gray-500 disabled:opacity-30 transition-all hover:shadow-sm"
             >
                <ArrowRight className="h-4 w-4" />
             </button>
         </div>
         
         <button 
             onClick={onDownload}
             className="flex items-center gap-2 bg-brand-dark hover:bg-black text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
         >
             <Download className="h-4 w-4 text-brand-cyan" /> Export HQ
         </button>
      </div>

    </div>
  );
};

export default DesignControls;
