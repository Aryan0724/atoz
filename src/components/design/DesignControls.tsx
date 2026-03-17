"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Type, Palette, Image as ImageIcon, Upload, Trash2, Loader2, SlidersHorizontal, Box, Layers, Pencil, ArrowLeft, ArrowRight, Download } from 'lucide-react';

const colors = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
  { name: 'Navy', hex: '#1e3a8a' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Forest Green', hex: '#14532d' },
  { name: 'Heather Gray', hex: '#94a3b8' },
  { name: 'Brand Pink', hex: '#E91E63' },
];

const textColors = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
];
import { uploadFile } from '@/lib/supabase/storage';

interface DesignControlsProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  customText: string;
  onTextChange: (text: string) => void;
  textColor: string;
  onTextColorChange: (color: string) => void;
  fontFamily: string;
  onFontChange: (font: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  textPosition: { x: number; y: number };
  onTextPositionChange: (pos: { x: number; y: number }) => void;
  textRotation: number;
  onTextRotationChange: (rot: number) => void;
  logoUrl: string | null;
  onLogoUpload: (url: string | null) => void;
  logoPosition: { x: number; y: number };
  onLogoPositionChange: (pos: { x: number; y: number }) => void;
  logoScale: number;
  onLogoScaleChange: (scale: number) => void;
  logoRotation: number;
  onLogoRotationChange: (rot: number) => void;
  // Advanced Typography (V2.1)
  charSpacing: number;
  onCharSpacingChange: (spacing: number) => void;
  lineHeight: number;
  onLineHeightChange: (height: number) => void;
  textShadow: { color: string; blur: number; offsetX: number; offsetY: number };
  onTextShadowChange: (shadow: { color: string; blur: number; offsetX: number; offsetY: number }) => void;
  // Image Filters (V2.1)
  brightness: number;
  onBrightnessChange: (val: number) => void;
  contrast: number;
  onContrastChange: (val: number) => void;
  isGrayscale: boolean;
  onGrayscaleChange: (val: boolean) => void;
  // Modes
  isDrawingMode: boolean;
  onDrawingModeChange: (val: boolean) => void;
  // Actions (V2.1)
  onDownload: () => void;
  onUndo: () => void;
  onRedo: () => void;
  // New V2 Props
  objects?: any[];
  onAddObject?: (type: string, url?: string) => void;
  onObjectUpdate?: (id: string, update: any) => void;
  onRemoveObject?: (id: string) => void;
}

const fonts = [
  { name: 'Classic Serif', family: "'Playfair Display', serif" },
  { name: 'Modern Sans', family: "'Outfit', sans-serif" },
  { name: 'Elegant Script', family: "'Dancing Script', cursive" },
  { name: 'Minimalist', family: "'Outfit', sans-serif" },
];

const patterns = [
  { name: 'Geometric', url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=200&auto=format' },
  { name: 'Abstract Wave', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200&auto=format' },
  { name: 'Minimalist Dot', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=200&auto=format' },
  { name: 'Cyberpunk', url: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=200&auto=format' },
];

const shapes = [
  { name: 'Circle', type: 'circle', icon: <div className="h-6 w-6 rounded-full border-2 border-brand-pink" /> },
  { name: 'Square', type: 'rect', icon: <div className="h-6 w-6 border-2 border-brand-pink" /> },
  { name: 'Triangle', type: 'triangle', icon: <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-brand-pink" /> },
];

const DesignControls = ({
  selectedColor,
  onColorChange,
  customText,
  onTextChange,
  textColor,
  onTextColorChange,
  fontFamily,
  onFontChange,
  fontSize,
  onFontSizeChange,
  textPosition,
  onTextPositionChange,
  textRotation,
  onTextRotationChange,
  logoUrl,
  onLogoUpload,
  logoPosition,
  onLogoPositionChange,
  logoScale,
  onLogoScaleChange,
  logoRotation,
  onLogoRotationChange,
  charSpacing,
  onCharSpacingChange,
  lineHeight,
  onLineHeightChange,
  textShadow,
  onTextShadowChange,
  brightness,
  onBrightnessChange,
  contrast,
  onContrastChange,
  isGrayscale,
  onGrayscaleChange,
  isDrawingMode,
  onDrawingModeChange,
  onDownload,
  onUndo,
  onRedo,
  objects = [],
  onAddObject,
  onObjectUpdate,
  onRemoveObject
}: DesignControlsProps) => {
  const [activeTab, setActiveTab] = React.useState<'color' | 'text' | 'logo' | 'graphics' | 'layout'>('color');
  const [uploading, setUploading] = React.useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `logo-${Date.now()}-${file.name}`;
      const publicUrl = await uploadFile('designs', fileName, file);
      onLogoUpload(publicUrl);
    } catch (error) {
      console.error('Logo upload failed:', error);
      alert('Failed to upload logo to storage');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Dynamic Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
        {[
          { id: 'color', icon: <Palette className="h-5 w-5" />, label: 'Color' },
          { id: 'text', icon: <Type className="h-5 w-5" />, label: 'Text' },
          { id: 'logo', icon: <Upload className="h-5 w-5" />, label: 'Logo' },
          { id: 'graphics', icon: <ImageIcon className="h-5 w-5" />, label: 'Graphics' },
          { id: 'layout', icon: <SlidersHorizontal className="h-5 w-5" />, label: 'Studio' },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 min-w-[70px] flex flex-col items-center py-5 transition-all relative",
              activeTab === tab.id ? "text-brand-pink" : "text-gray-400 hover:text-brand-dark"
            )}
          >
            {tab.icon}
            <span className="text-[9px] font-black uppercase tracking-widest mt-2">{tab.label}</span>
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-brand-pink rounded-t-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
        {activeTab === 'color' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-xl font-bold text-brand-dark mb-6">Product Appearance</h3>
            <div className="grid grid-cols-4 gap-4">
              {colors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => onColorChange(color.hex)}
                  className={cn(
                    "group relative aspect-square rounded-2xl flex items-center justify-center transition-all",
                    selectedColor === color.hex ? "ring-4 ring-brand-pink/20 scale-105" : "hover:scale-105 shadow-sm"
                  )}
                  style={{ backgroundColor: color.hex, border: color.hex === '#FFFFFF' ? '1px solid #e5e7eb' : 'none' }}
                >
                  {selectedColor === color.hex && (
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      ['#FFFFFF', '#Heather Gray'].includes(color.name) ? "bg-brand-pink" : "bg-white"
                    )} />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-10">
            <h3 className="text-xl font-bold text-brand-dark">Pro Typography</h3>
            
            <section>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Content</label>
              <input 
                type="text" 
                value={customText}
                onChange={(e) => onTextChange(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-bold text-brand-dark"
                placeholder="Type your text..."
              />
            </section>

            <section>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Font Family</label>
              <div className="grid grid-cols-1 gap-2">
                {fonts.map((f) => (
                  <button
                    key={f.family}
                    onClick={() => onFontChange(f.family)}
                    className={cn(
                      "px-4 py-3 rounded-xl border text-left transition-all",
                      fontFamily === f.family ? "border-brand-pink bg-pink-50 text-brand-pink" : "border-gray-100 hover:border-brand-pink/30 text-gray-600"
                    )}
                    style={{ fontFamily: f.family }}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Font Size</label>
                <span className="text-xs font-bold text-brand-pink">{fontSize}px</span>
              </div>
              <input 
                type="range" min="12" max="64" value={fontSize}
                onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
                className="w-full accent-brand-pink"
              />
            </section>

            {/* Advanced Typography (V2.1) */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest">Letter Spacing</span>
                <span className="text-xs font-bold text-brand-pink">{charSpacing}</span>
              </div>
              <input 
                type="range" min="0" max="500" value={charSpacing}
                onChange={(e) => onCharSpacingChange(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-pink"
              />

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest">Line Height</span>
                <span className="text-xs font-bold text-brand-pink">{lineHeight.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0.5" max="3" step="0.1" value={lineHeight}
                onChange={(e) => onLineHeightChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-pink"
              />

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest">Text Shadow</span>
                <button 
                  onClick={() => onTextShadowChange(textShadow.blur > 0 ? { color: 'rgba(0,0,0,0)', blur: 0, offsetX: 0, offsetY: 0 } : { color: 'rgba(0,0,0,0.3)', blur: 5, offsetX: 2, offsetY: 2 })}
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all ${textShadow.blur > 0 ? 'bg-brand-pink text-white' : 'bg-gray-100 text-gray-400'}`}
                >
                  {textShadow.blur > 0 ? 'Shadow ON' : 'Shadow OFF'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logo' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-xl font-bold text-brand-dark mb-6">Brand Identity</h3>
            {logoUrl ? (
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 flex flex-col items-center">
                <div className="w-32 h-32 relative mb-6">
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-contain drop-shadow-md" />
                </div>
                <button 
                  onClick={() => onLogoUpload(null)}
                  className="flex items-center gap-2 text-red-500 font-bold text-sm hover:underline"
                >
                  <Trash2 className="h-4 w-4" />
                  Replace Artwork
                </button>
              </div>
            ) : (
              <label className="aspect-video bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-pink-50/30 hover:border-brand-pink transition-all group">
                {uploading ? <Loader2 className="h-8 w-8 text-brand-pink animate-spin" /> : (
                  <>
                    <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Upload className="h-8 w-8 text-brand-pink" />
                    </div>
                    <span className="font-bold text-brand-dark">Upload High-Res Logo</span>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2">PNG/SVG Preferred</span>
                  </>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </label>
            )}

            {(logoUrl || objects.some(o => o.type === 'image')) && (
              <div className="space-y-6 pt-10 border-t border-gray-100 mt-10">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Image Filters</h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest">Brightness</span>
                  <span className="text-xs font-bold text-brand-pink">{brightness}</span>
                </div>
                <input 
                  type="range" min="-100" max="100" value={brightness}
                  onChange={(e) => onBrightnessChange(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest">Contrast</span>
                  <span className="text-xs font-bold text-brand-pink">{contrast}</span>
                </div>
                <input 
                  type="range" min="-100" max="100" value={contrast}
                  onChange={(e) => onContrastChange(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-pink"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest">Grayscale</span>
                  <button 
                    onClick={() => onGrayscaleChange(!isGrayscale)}
                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all ${isGrayscale ? 'bg-brand-pink text-white' : 'bg-gray-100 text-gray-400'}`}
                  >
                    {isGrayscale ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'graphics' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
            <h3 className="text-xl font-bold text-brand-dark">Graphics Library</h3>
            
            <section>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Stock Patterns</label>
              <div className="grid grid-cols-2 gap-3">
                {patterns.map((p) => (
                  <button
                    key={p.url}
                    onClick={() => onAddObject?.('image', p.url)}
                    className="group relative h-24 rounded-2xl overflow-hidden border border-gray-100 hover:border-brand-pink transition-all"
                  >
                    <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/40 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                      <span className="text-white text-[10px] font-bold uppercase tracking-widest">Add Pattern</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Geometric Shapes</label>
              <div className="grid grid-cols-3 gap-3">
                {shapes.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => onAddObject?.(s.type)}
                    className="flex flex-col items-center justify-center h-20 bg-gray-50 rounded-2xl hover:bg-pink-50 hover:text-brand-pink transition-all group"
                  >
                    {s.icon}
                    <span className="text-[9px] font-bold uppercase mt-2">{s.name}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-12">
            <h3 className="text-xl font-bold text-brand-dark">Studio Tools</h3>
            
            {/* Drawing Mode (V2.1) */}
            <div className="bg-gray-50 rounded-[30px] p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Pencil className="h-4 w-4 text-brand-pink" />
                  <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest">Drawing Mode</span>
                </div>
                <button 
                  onClick={() => onDrawingModeChange(!isDrawingMode)}
                  className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full transition-all ${isDrawingMode ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20' : 'bg-white text-gray-400 border border-gray-100'}`}
                >
                  {isDrawingMode ? 'ON' : 'OFF'}
                </button>
              </div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter italic leading-relaxed">
                Sketch directly on the product using your cursor.
              </p>
            </div>

            {/* History & Export Actions (V2.1) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={onUndo}
                  className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:border-brand-pink transition-all text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-brand-pink"
                >
                  <ArrowLeft className="h-4 w-4 mb-1" />
                  Undo
                </button>
                <button 
                  onClick={onRedo}
                  className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:border-brand-pink transition-all text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-brand-pink"
                >
                   <ArrowRight className="h-4 w-4 mb-1" />
                   Redo
                </button>
              </div>
              <button 
                onClick={onDownload}
                className="flex flex-col items-center justify-center p-4 bg-brand-dark rounded-2xl shadow-xl shadow-brand-dark/20 hover:scale-105 active:scale-95 transition-all text-[9px] font-black uppercase tracking-widest text-white"
              >
                <Download className="h-5 w-5 mb-1 text-brand-cyan" />
                Export HQ
              </button>
            </div>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Box className="h-5 w-5 text-brand-pink" />
                <h4 className="font-black text-[10px] uppercase tracking-widest text-gray-400">Logo Positioning</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-2">
                    <span>Horizontal</span>
                    <span className="text-brand-pink">{logoPosition.x}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={logoPosition.x} onChange={(e) => onLogoPositionChange({...logoPosition, x: parseInt(e.target.value)})} className="w-full accent-brand-pink" />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-2">
                    <span>Vertical</span>
                    <span className="text-brand-pink">{logoPosition.y}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={logoPosition.y} onChange={(e) => onLogoPositionChange({...logoPosition, y: parseInt(e.target.value)})} className="w-full accent-brand-pink" />
                </div>
                <div>
                   <div className="flex justify-between text-[11px] font-bold mb-2">
                     <span>Scale</span>
                     <span className="text-brand-pink">{logoScale}x</span>
                   </div>
                   <input type="range" min="1" max="10" step="0.5" value={logoScale} onChange={(e) => onLogoScaleChange(parseFloat(e.target.value))} className="w-full accent-brand-pink" />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Type className="h-5 w-5 text-brand-pink" />
                <h4 className="font-black text-[10px] uppercase tracking-widest text-gray-400">Text Layout</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-2">
                    <span>Rotation</span>
                    <span className="text-brand-pink">{textRotation}°</span>
                  </div>
                  <input type="range" min="-180" max="180" value={textRotation} onChange={(e) => onTextRotationChange(parseInt(e.target.value))} className="w-full accent-brand-pink" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                   <button onClick={() => onTextPositionChange({x: 50, y: 50})} className="py-2 bg-gray-100 rounded-lg text-[10px] font-bold hover:bg-brand-pink hover:text-white transition-colors">Center</button>
                   <button onClick={() => onTextPositionChange({x: 50, y: 30})} className="py-2 bg-gray-100 rounded-lg text-[10px] font-bold hover:bg-brand-pink hover:text-white transition-colors">Top</button>
                   <button onClick={() => onTextPositionChange({x: 50, y: 70})} className="py-2 bg-gray-100 rounded-lg text-[10px] font-bold hover:bg-brand-pink hover:text-white transition-colors">Bottom</button>
                </div>
              </div>
            </section>

            {objects.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <ImageIcon className="h-5 w-5 text-brand-pink" />
                  <h4 className="font-black text-[10px] uppercase tracking-widest text-gray-400">Layer Controls</h4>
                </div>
                <div className="space-y-3">
                  {objects.map((obj, i) => (
                    <div key={obj.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-bold truncate max-w-[120px]">Layer {i+1}: {obj.type}</span>
                      <div className="flex items-center gap-2">
                        <button className="text-[10px] font-bold text-gray-400 hover:text-brand-pink">Top</button>
                        <button className="text-[10px] font-bold text-red-400 hover:text-red-500">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Footer Instructions */}
      <div className="p-8 bg-brand-lightGray rounded-t-[40px] border-t border-gray-100">
        <p className="text-[10px] font-black uppercase tracking-widest text-brand-pink mb-2">Studio Status</p>
        <p className="text-xs text-brand-dark font-medium leading-relaxed italic opacity-70">
          Precise control mode active. Design with confidence.
        </p>
      </div>
    </div>
  );
};

export default DesignControls;
