"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { SidebarTab } from './SidebarRail';
import { CanvasObjectProperties } from '../DesignerCanvas';
import { canvasTemplates } from '@/lib/data/canvasTemplates';
import { uploadFile } from '@/lib/supabase/storage';
import toast from 'react-hot-toast';
import { 
  Type, Loader2, Upload, Plus, Search, LayoutGrid, Layers, Lock, Unlock, Eye, EyeOff, Square,
  Heart, Star, Smile, Sparkles, Flame, Cloud, Ghost, Sun, Moon, Zap, Trophy, Target, 
  Crown, Gift, Bell, Camera, Coffee, Palette, Music, Plane, Anchor, X, MousePointer2, Settings2, Info
} from 'lucide-react';

const curvedTextPresets = [
  { name: 'Surfing the Wave', preview: 'SURFING THE WAVE', style: 'wavy' },
  { name: 'Sarcasm University', preview: 'SARCASM UNIVERSITY', style: 'arc' },
  { name: 'Progress over Perfection', preview: 'Progress over Perfection', style: 'arch' },
  { name: 'Wholeness', preview: 'WHOLENESS', style: 'curve' },
  { name: 'Art Lover Boutique', preview: 'PRINTS MADE WITH LOVE', style: 'circle' },
  { name: 'It\'s a New Day', preview: 'IT\'S A NEW DAY', style: 'banner' },
];

const shapesList = [
  { type: 'star', icon: <Star className="h-10 w-10 fill-brand-olive/20 text-brand-olive" /> },
  { type: 'heart', icon: <Heart className="h-10 w-10 fill-brand-olive/20 text-brand-olive" /> },
  { type: 'line', icon: <div className="w-12 h-1 bg-brand-olive" /> },
  { type: 'triangle', icon: <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[34px] border-b-brand-olive" /> },
  { type: 'circle', icon: <div className="w-10 h-10 border-2 border-brand-olive rounded-full bg-brand-olive/10" /> },
  { type: 'rect', icon: <div className="w-10 h-10 border-2 border-brand-olive rounded-sm bg-brand-olive/10" /> },
];

interface SidebarPanelProps {
  activeTab: SidebarTab | null;
  onClose: () => void;
  productColor: string;
  onProductColorChange: (color: string) => void;
  onAddText: (text: string) => void;
  onAddImage: (url: string) => void;
  onAddShape: (type: 'circle' | 'rect' | 'triangle' | 'star' | 'heart' | 'line') => void;
  onAddIcon: (iconName: string) => void;
  onLoadTemplate?: (json: any) => void;
  onUpdateObject?: (id: string, props: Partial<CanvasObjectProperties>) => void;
  layers: any[];
}

const ProductColorButton = ({ color, name, active, onClick }: { color: string, name: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-10 h-10 rounded-full border-2 transition-all p-0.5",
      active ? "border-brand-olive scale-110 shadow-lg" : "border-transparent hover:border-gray-200"
    )}
    title={name}
  >
    <div className="w-full h-full rounded-full border border-black/5" style={{ backgroundColor: color }} />
  </button>
);

const SectionHeader = ({ title, showBadge = false, onShowMore }: { title: string, showBadge?: boolean, onShowMore?: () => void }) => (
  <div className="flex items-center justify-between mb-4 mt-6 first:mt-0">
    <div className="flex items-center gap-2">
      <h4 className="text-sm font-black text-brand-dark tracking-tight">{title}</h4>
      {showBadge && (
        <span className="px-1.5 py-0.5 bg-[#f0f0e8] text-[#5b5b42] text-[8px] font-bold uppercase rounded">Editable</span>
      )}
    </div>
    <div className="flex items-center gap-4">
      <button className="text-brand-dark hover:opacity-70 transition-opacity">
        <Plus className="h-4 w-4" />
      </button>
      <button onClick={onShowMore} className="text-[11px] font-bold text-brand-olive hover:underline tracking-tight">Show more</button>
    </div>
  </div>
);

const ItemGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-3 gap-2">
    {children}
  </div>
);

const GridItem = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="aspect-square bg-[#f9f9f9] border border-[#e1e1e1] rounded-lg flex items-center justify-center hover:bg-white hover:border-brand-olive transition-all group overflow-hidden relative"
    style={{ backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px' }}
  >
    <div className="group-hover:scale-105 transition-transform">
      {children}
    </div>
  </button>
);

const SidebarPanel = ({ 
  activeTab, 
  onClose,
  productColor,
  onProductColorChange,
  onAddText,
  onAddImage,
  onAddShape,
  onAddIcon,
  onLoadTemplate,
  onUpdateObject,
  layers
}: SidebarPanelProps) => {
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  if (!activeTab) return null;

  const handleLocalFileUpload = (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
      toast.error('Please upload an image file (PNG, JPG, SVG)');
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        onAddImage(dataUrl);
        setUploadedFiles(prev => [dataUrl, ...prev].slice(0, 8));
        toast.success('Image uploaded!');
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const currentTitle = {
    'uploads': 'Upload',
    'ai': 'AI Image Generator',
    'text': 'Add Text',
    'library': 'My Library',
    'graphics': 'Graphics',
    'templates': 'My Templates',
    'shutterstock': 'Shutterstock'
  }[activeTab];

  return (
    <div className="w-full md:w-[360px] shrink-0 bg-white border-r border-gray-100 flex flex-col z-30 shadow-2xl relative">
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-xl font-black text-brand-dark tracking-tight">
          {currentTitle}
        </h3>
        <button 
          onClick={onClose} 
          className="p-1.5 hover:bg-gray-50 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
        {activeTab === 'graphics' && (
          <div className="space-y-2">
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Search Graphics..." 
                className="w-full bg-[#f3f3f3] border-none rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-brand-olive transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <SectionHeader title="Design Presets" />
            <ItemGrid>
               <GridItem onClick={() => onAddText('SKULL & ROSES')}>
                  <div className="text-[10px] font-black leading-none text-center px-2 text-gray-400">SKULL & ROSES</div>
               </GridItem>
               <GridItem onClick={() => onAddText('CYBERPUNK')}>
                  <div className="text-[10px] font-black leading-none text-center px-2 text-gray-400">CYBERPUNK</div>
               </GridItem>
               <GridItem onClick={() => onAddText('VINTAGE 1994')}>
                  <div className="text-[10px] font-black leading-none text-center px-2 text-gray-400">VINTAGE 1994</div>
               </GridItem>
               <GridItem onClick={() => onAddText('STREETWEAR')}>
                  <div className="text-[10px] font-black leading-none text-center px-2 text-gray-400">STREETWEAR</div>
               </GridItem>
               <GridItem onClick={() => onAddText('MINIMALIST')}>
                  <div className="text-[10px] font-black leading-none text-center px-2 text-gray-400">MINIMALIST</div>
               </GridItem>
               <GridItem onClick={() => onAddText('URBAN STYLE')}>
                  <div className="text-[10px] font-black leading-none text-center px-2 text-gray-400">URBAN STYLE</div>
               </GridItem>
            </ItemGrid>

            <SectionHeader title="Shapes" showBadge />
            <ItemGrid>
              {shapesList.map((s) => (
                <GridItem key={s.type} onClick={() => onAddShape(s.type as any)}>
                  {s.icon}
                </GridItem>
              ))}
            </ItemGrid>

            <SectionHeader title="Icons & Symbols" />
            <ItemGrid>
              {['🔥', '✨', '💀', '🛸', '⭐', '⚡', '🖤', '🌸', '👑'].map((emoji) => (
                <GridItem key={emoji} onClick={() => onAddText(emoji)}>
                   <div className="text-2xl leading-none text-center">{emoji}</div>
                </GridItem>
              ))}
            </ItemGrid>

            <SectionHeader title="Curved Text" showBadge />
            <ItemGrid>
              {curvedTextPresets.map((p) => (
                <GridItem key={p.name} onClick={() => onAddText(p.preview)}>
                   <div className="text-[10px] font-black leading-none text-center px-2">{p.preview}</div>
                </GridItem>
              ))}
            </ItemGrid>

            <SectionHeader title="Text elements" showBadge />
            <ItemGrid>
              {['HAPPY', 'BRIDE', 'I\'M WITH HIM'].map((text) => (
                <GridItem key={text} onClick={() => onAddText(text)}>
                   <div className="text-[10px] font-black leading-none text-center px-1">{text}</div>
                </GridItem>
              ))}
            </ItemGrid>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-4">
             <button 
                onClick={() => onAddText("Add Heading")}
                className="w-full p-6 bg-[#f3f3f3] rounded-xl text-left hover:bg-white hover:ring-1 hover:ring-brand-olive transition-all group"
              >
                <span className="text-3xl font-black text-brand-dark block">Add a heading</span>
              </button>
              <button 
                onClick={() => onAddText("Add Subheading")}
                className="w-full p-4 bg-[#f3f3f3] rounded-xl text-left hover:bg-white hover:ring-1 hover:ring-brand-olive transition-all group"
              >
                <span className="text-xl font-bold text-brand-dark block">Add a subheading</span>
              </button>
              <button 
                onClick={() => onAddText("Add body text")}
                className="w-full p-3 bg-[#f3f3f3] rounded-xl text-left hover:bg-white hover:ring-1 hover:ring-brand-olive transition-all group"
              >
                <span className="text-base font-medium text-brand-dark block">Add a body text</span>
              </button>
          </div>
        )}

        {activeTab === 'uploads' && (
          <div className="space-y-6">
            <label className="w-full py-12 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-[#f9f9f9] transition-all">
              <div className="h-14 w-14 bg-[#f0f0e8] rounded-2xl flex items-center justify-center">
                <Upload className="h-7 w-7 text-brand-olive" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-brand-dark">Click here to upload</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">PNG, JPG, SVG supported</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleLocalFileUpload(e.target.files[0])} />
            </label>

            {uploadedFiles.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-6">
                {uploadedFiles.map((url, i) => (
                  <GridItem key={i} onClick={() => onAddImage(url)}>
                    <img src={url} alt="upload" className="w-full h-full object-cover" />
                  </GridItem>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Shutterstock Tab */}
        {activeTab === 'shutterstock' && (
          <div className="space-y-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search high-quality images..." 
                className="w-full bg-[#f3f3f3] border-none rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-brand-olive transition-all"
              />
              <Search className="absolute right-4 top-3 h-4 w-4 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
               <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Coming Soon</p>
               <p className="text-xs text-blue-800">Direct integration with Shutterstock library is being finalized.</p>
            </div>
          </div>
        )}
        {(activeTab === 'ai' || activeTab === 'library' || activeTab === 'templates') && (
          <div className="py-20 flex flex-col items-center justify-center text-center px-6">
             <div className="h-20 w-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
                <Sparkles className="h-10 w-10 text-gray-200" />
             </div>
             <h4 className="text-lg font-black text-brand-dark tracking-tight mb-2">Coming Soon</h4>
             <p className="text-xs text-gray-400 font-medium">We're working on making this feature available for you.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarPanel;
