"use client";

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { SidebarTab } from './SidebarRail';
import { CanvasObjectProperties } from '@/types/canvas';
import { canvasTemplates, templateCategories } from '@/lib/data/canvasTemplates';
import { iconLibrary, iconCategories } from '@/lib/data/icons';
import { podGraphics, podGraphicCategories } from '@/lib/data/podGraphics';
import { toast } from 'sonner';
import IconifyTab from '@/components/design/controls/tabs/IconifyTab';
import { 
  Type, Loader2, Upload, Plus, Search, LayoutGrid, X, Sparkles, Check, ChevronRight, Grid, Image as ImageIcon, Shapes, Wand2, History, RefreshCcw, Download, Trash2, ArrowRight, Layers, Lock, Unlock, Eye, EyeOff, Minus, ShieldAlert
} from 'lucide-react';
import StockTab from '@/components/design/controls/tabs/StockTab';
import VdpDataTab from '@/components/design/controls/tabs/VdpDataTab';
import { aiStylePills, aiSubjectIdeas } from '@/lib/data/AiPrompts';

// ─────────────────────────────────────────────────────────
// Color palette data
// ─────────────────────────────────────────────────────────
const colorPalettes = [
  {
    name: 'Classic',
    colors: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#9E9E9E', '#616161', '#212121', '#000000'],
  },
  {
    name: 'Brand Pink',
    colors: ['#FCE4EC', '#F48FB1', '#E91E63', '#C2185B', '#880E4F', '#FFB300', '#FF6F00'],
  },
  {
    name: 'Ocean',
    colors: ['#E0F7FA', '#80DEEA', '#00BCD4', '#0097A7', '#006064', '#1565C0', '#0D47A1'],
  },
  {
    name: 'Forest',
    colors: ['#F1F8E9', '#AED581', '#8BC34A', '#558B2F', '#1B5E20', '#4CAF50', '#2E7D32'],
  },
  {
    name: 'Sunset',
    colors: ['#FFF3E0', '#FFCC80', '#FFA726', '#E65100', '#BF360C', '#D81B60', '#880E4F'],
  },
  {
    name: 'Royal',
    colors: ['#EDE7F6', '#B39DDB', '#7E57C2', '#4527A0', '#1A237E', '#D4AF37', '#B8860B'],
  },
  {
    name: 'Neon',
    colors: ['#CCFFCC', '#00FF41', '#39FF14', '#FF073A', '#FF6EC7', '#FFFF00', '#00FFFF'],
  },
];

const fontList = [
  { name: 'Bebas Neue', family: "'Bebas Neue', sans-serif", style: 'Display', sample: 'DISPLAY' },
  { name: 'Righteous', family: "'Righteous', cursive", style: 'Stylized', sample: 'Stylized' },
  { name: 'Lobster', family: "'Lobster', cursive", style: 'Script', sample: 'Script' },
  { name: 'Pacifico', family: "'Pacifico', cursive", style: 'Script', sample: 'Pacifico' },
  { name: 'Dancing Script', family: "'Dancing Script', cursive", style: 'Script', sample: 'Dancing' },
  { name: 'Caveat', family: "'Caveat', cursive", style: 'Handwritten', sample: 'Handwritten' },
  { name: 'Oswald', family: "'Oswald', sans-serif", style: 'Bold', sample: 'OSWALD' },
  { name: 'Montserrat', family: "'Montserrat', sans-serif", style: 'Modern', sample: 'Montserrat' },
  { name: 'Inter', family: "'Inter', sans-serif", style: 'Clean', sample: 'Clean' },
  { name: 'Roboto', family: "'Roboto', sans-serif", style: 'Modern', sample: 'Roboto' },
  { name: 'Open Sans', family: "'Open Sans', sans-serif", style: 'Readable', sample: 'Open Sans' },
  { name: 'Lora', family: "'Lora', serif", style: 'Elegant', sample: 'Lora' },
  { name: 'Playfair Display', family: "'Playfair Display', serif", style: 'Elegant', sample: 'Playfair' },
  { name: 'Merriweather', family: "'Merriweather', serif", style: 'Editorial', sample: 'Merriweather' },
];

const textStyles = [
  { label: 'Add a heading', text: 'Heading Text', fontSize: 64, fontWeight: 'black', fontFamily: "'Oswald', sans-serif", description: 'Bold & prominent' },
  { label: 'Add a subheading', text: 'Subheading', fontSize: 42, fontWeight: 'bold', fontFamily: "'Montserrat', sans-serif", description: 'Medium weight' },
  { label: 'Add body text', text: 'Body paragraph text here', fontSize: 24, fontWeight: 'normal', fontFamily: "'Open Sans', sans-serif", description: 'Small & readable' },
  { label: 'Add a quote', text: '"Inspiring quote goes here."', fontSize: 28, fontWeight: 'bold', fontFamily: "'Lora', serif", description: 'Italic serif' },
  { label: 'Add a label', text: 'LABEL TEXT', fontSize: 18, fontWeight: 'bold', fontFamily: "'Bebas Neue', sans-serif", description: 'All caps label' },
];

const podTextPhrases = [
  { text: 'EST. 2024', font: "'Bebas Neue', sans-serif", desc: 'Established badge' },
  { text: 'ORIGINAL', font: "'Oswald', sans-serif", desc: 'Brand stamp' },
  { text: 'MADE WITH LOVE', font: "'Pacifico', cursive", desc: 'Warm script' },
  { text: 'LIMITED EDITION', font: "'Bebas Neue', sans-serif", desc: 'Exclusivity' },
  { text: 'SINCE 1994', font: "'Montserrat', sans-serif", desc: 'Heritage date' },
  { text: 'HANDCRAFTED', font: "'Oswald', sans-serif", desc: 'Artisan phrase' },
  { text: 'YOUR NAME', font: "'Lobster', cursive", desc: 'Name script' },
  { text: '— No. 01 —', font: "'Lora', serif", desc: 'Numbered edition' },
  { text: 'PREMIUM QUALITY', font: "'Bebas Neue', sans-serif", desc: 'Quality mark' },
  { text: 'DESIGNED IN INDIA', font: "'Montserrat', sans-serif", desc: 'Origin tag' },
  { text: '100% ORIGINAL', font: "'Oswald', sans-serif", desc: 'Authenticity' },
  { text: 'TEAM SPIRIT', font: "'Righteous', cursive", desc: 'Group wear' },
];

const shapeDefinitions = [
  { type: 'rect' as const, label: 'Rectangle', preview: <div className="w-10 h-7 border-2 border-current" /> },
  { type: 'circle' as const, label: 'Circle', preview: <div className="w-8 h-8 border-2 border-current rounded-full" /> },
  { type: 'star' as const, label: 'Star', preview: <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17 5.8 21.3l2.4-7.4L2 9.4h7.6z"/></svg> },
  { type: 'heart' as const, label: 'Heart', preview: <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg> },
  { type: 'triangle' as const, label: 'Triangle', preview: <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[24px] border-b-current" /> },
  { type: 'line' as const, label: 'Divider', preview: <div className="w-10 h-0 border-t-2 border-current" /> },
];

const photoCategories = ['Streetwear', 'Textures', 'Vintage', 'Gradients', 'Typography'];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-gray-400 mb-3 mt-6 first:mt-0">{children}</p>
);

const PillTab = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all",
      active ? "bg-[#5b5b42] text-white shadow-sm" : "bg-[#f0f0e8] text-gray-500 hover:bg-[#e4e4d8]"
    )}
  >
    {children}
  </button>
);

interface SidebarPanelProps {
  activeTab: SidebarTab | null;
  onClose: () => void;
  productColor: string;
  onProductColorChange: (color: string) => void;
  onAddText: (text: string) => void;
  onAddImage: (url: string) => void;
  onAddShape: (type: 'circle' | 'rect' | 'triangle' | 'star' | 'heart' | 'line') => void;
  onAddIcon: (iconName: string) => void;
  onAddSvgGraphic: (svg: string, name: string) => void;
  onLoadTemplate?: (json: any) => void;
  onUpdateObject?: (id: string, props: Partial<CanvasObjectProperties>) => void;
  layers: any[];
  selectedQuality?: string;
  onQualityChange?: (quality: string) => void;
  productCategory?: string;
  qualityLevels?: string[];
  basePrice?: number;
  productId?: string;
  activeObject?: CanvasObjectProperties | null;
  onSelectionCleared?: () => void;
  onLockAllObjects?: (lock: boolean) => void;
  onAddPattern?: (url: string) => void;
  onClearDesign?: () => void;
  qualityPrices?: Record<string, number>;
  colorVariants?: { name: string, hex: string, image_url: string }[];
  designMode?: string;
  vdpData?: { headers: string[], rows: any[] } | null;
  vdpRowIndex?: number;
  onVdpDataLoaded?: (headers: string[], rows: any[]) => void;
  onVdpRowChange?: (index: number) => void;
  onVdpClear?: () => void;
  pageData?: any[];
  currentPageIndex?: number;
  onPageChange?: (index: number) => void;
}

const SidebarPanel = ({ 
  activeTab, 
  onClose,
  productColor,
  onProductColorChange,
  onAddText,
  onAddImage,
  onAddShape,
  onAddIcon,
  onAddSvgGraphic,
  onLoadTemplate,
  onUpdateObject,
  activeObject,
  onSelectionCleared,
  onLockAllObjects,
  onClearDesign,
  onAddPattern,
  layers,
  selectedQuality,
  onQualityChange,
  productCategory = 'Apparel',
  qualityLevels = ['Standard', 'Premium', 'Luxury'],
  basePrice = 0,
  productId = '',
  qualityPrices = {},
  colorVariants = [],
  designMode = 'standard',
  vdpData = null,
  vdpRowIndex = 0,
  onVdpDataLoaded,
  onVdpRowChange,
  onVdpClear,
  pageData = [],
  currentPageIndex = 0,
  onPageChange
}: SidebarPanelProps) => {
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const catLower = productCategory.toLowerCase();
  const isBottle = catLower.includes('bottle') || catLower.includes('mug') || catLower.includes('drinkware');
  const isPrint = catLower.includes('print') || catLower.includes('canvas');
  const isStationery = catLower.includes('stationery');
  const isApparel = catLower.includes('apparel');
  const isLifestyle = catLower.includes('lifestyle');
  const isCorporate = catLower.includes('corporate');

  const availableTemplateCats = React.useMemo(() => {
    return templateCategories.filter(cat => {
      if (cat === 'All') return true;
      if (isBottle) return ['Drinkware', 'Minimal', 'Art', 'Vintage'].includes(cat);
      if (isPrint) return ['Art', 'Minimal', 'Vintage'].includes(cat);
      if (isStationery) return ['Stationery', 'Minimal', 'Corporate'].includes(cat);
      if (isApparel) return ['Apparel', 'Streetwear', 'Vintage', 'Sports'].includes(cat);
      if (isLifestyle) return ['Lifestyle', 'Minimal', 'Vintage'].includes(cat);
      if (isCorporate) return ['Corporate', 'Minimal', 'Stationery'].includes(cat);
      return ['Minimal', 'Vintage', 'Art'].includes(cat);
    });
  }, [isBottle, isPrint, isStationery, isApparel, isLifestyle, isCorporate]);

  const availableGraphicCats = React.useMemo(() => {
    return podGraphicCategories.filter(cat => {
      if (isBottle) return ['Shapes', 'Decorative', 'Nature', 'Popular'].includes(cat);
      if (isPrint) return ['Nature', 'Decorative', 'Vintage', 'Shapes', 'Popular'].includes(cat);
      return ['Streetwear & Y2K', 'Vintage', 'Animals', 'Popular', 'Shapes'].includes(cat);
    });
  }, [isBottle, isPrint]);
  
  const defaultTemplateCat = isBottle ? 'Drinkware' : (isStationery ? 'Stationery' : (isApparel ? 'Apparel' : (isLifestyle ? 'Lifestyle' : (isCorporate ? 'Corporate' : 'Minimal'))));
  const defaultGraphicCat = isBottle ? 'Shapes' : (isPrint ? 'Nature' : 'Popular');

  const [activeTemplateCat, setActiveTemplateCat] = useState(defaultTemplateCat);
  const [activeIconCat, setActiveIconCat] = useState(iconCategories[0].name);
  const [activeGraphicCat, setActiveGraphicCat] = useState(defaultGraphicCat);
  const [activePhotoCat, setActivePhotoCat] = useState(photoCategories[0]);
  const [customColor, setCustomColor] = useState('#E91E63');
  const [activePalette, setActivePalette] = useState(colorPalettes[0].name);

  // AI Generator State
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [aiHistory, setAiHistory] = useState<{ url: string, prompt: string }[]>([]);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a prompt first!");
      return;
    }

    setIsGenerating(true);
    try {
      const style = aiStylePills.find(s => s.id === selectedStyle);
      const fullPrompt = style ? `${aiPrompt}, ${style.suffix}` : aiPrompt;
      const seed = Math.floor(Math.random() * 1000000);
      
      let width = 1024;
      let height = 1024;
      const cat = productCategory?.toLowerCase() || '';
      
      if (cat.includes('tshirt') || cat.includes('t-shirt') || cat.includes('hoodie')) {
        width = 768;
        height = 1024;
      } else if (cat.includes('mug') || cat.includes('bottle') || cat.includes('drinkware')) {
        width = 1024;
        height = 512;
      } else if (cat.includes('diary') || cat.includes('notebook') || cat.includes('stationery')) {
        width = 768;
        height = 1024;
      } else if (cat.includes('phone') || cat.includes('case')) {
        width = 512;
        height = 1024;
      }

      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
      
      const img = new Image();
      img.src = imageUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      setGeneratedImage(imageUrl);
      setAiHistory(prev => [{ url: imageUrl, prompt: aiPrompt }, ...prev].slice(0, 10));
      toast.success("AI Image Generated!");
    } catch (err) {
      console.error("AI Generation failed:", err);
      toast.error("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
    if (!availableTemplateCats.includes(activeTemplateCat)) {
      setActiveTemplateCat(availableTemplateCats.includes('All') ? 'All' : availableTemplateCats[0]);
    }
    if (!availableGraphicCats.includes(activeGraphicCat)) {
      setActiveGraphicCat(availableGraphicCats[0]);
    }
  }, [availableTemplateCats, availableGraphicCats, activeTemplateCat, activeGraphicCat]);

  const [textCurveAmount, setTextCurveAmount] = useState(0);

  React.useEffect(() => {
    if (activeObject?.type?.includes('text')) {
      setTextCurveAmount(activeObject._curve || 0);
    }
  }, [activeObject]);

  const handleCurveChange = (amount: number) => {
    setTextCurveAmount(amount);
    if (activeObject?.id && activeObject?.type?.includes('text')) {
      onUpdateObject?.(activeObject.id, { _curve: amount });
    }
  };

  const [dynamicColors, setDynamicColors] = useState<string[]>([]);

  if (!activeTab) return null;

  const handleLocalFileUpload = (file: File) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        onAddImage(dataUrl);
        setUploadedFiles(prev => [dataUrl, ...prev].slice(0, 12));
        toast.success('Image added to canvas!');
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const currentTitle: Record<string, string> = {
    'product': 'Product Settings',
    'uploads': 'My Uploads',
    'ai': 'AI Generator',
    'text': 'Text',
    'library': 'Filters',
    'graphics': 'Elements',
    'shutterstock': 'Quick Photos',
    'iconify': 'Icon Library',
    'unsplash': 'Stock Photos',
    'pexels': 'Stock Photos',
    'data': 'Data Import (VDP)',
    'pages': 'Pages (Multipage)',
  };

  const filteredTemplates = (activeTemplateCat === 'All' 
    ? canvasTemplates.filter(t => availableTemplateCats.includes(t.category)) 
    : canvasTemplates.filter(t => t.category === activeTemplateCat))
    .filter(t => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSyncColors = () => {
    const colors = new Set<string>();
    layers.forEach(l => {
      if (l.fill && typeof l.fill === 'string') colors.add(l.fill);
    });
    if (colors.size > 0) {
      setDynamicColors(Array.from(colors));
      setActivePalette('Dynamic');
      toast.success('Palette synced from design!');
    } else {
      toast.error('No colored elements found to sync.');
    }
  };

  const currentIconCat = iconCategories.find(c => c.name === activeIconCat);

  return (
    <div className="w-full md:w-[340px] shrink-0 bg-white/80 backdrop-blur-2xl border-r border-white/20 flex flex-col z-30 shadow-[4px_0_24px_rgba(0,0,0,0.04)] relative isolate ring-1 ring-black/5">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-gray-100/50 flex-shrink-0 bg-white/40">
        <h3 className="text-sm font-black text-[#1a1a1a] uppercase tracking-[0.15em]">{currentTitle[activeTab] || activeTab}</h3>
        <button onClick={onClose} className="p-1.5 hover:bg-white/60 rounded-full transition-colors border border-transparent hover:border-gray-100 shadow-sm">
          <X className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ─── TEXT TAB ───────────────────────────────────────── */}
        {activeTab === 'text' && (
          <div className="p-4 space-y-2">
            {textStyles.map((style) => (
              <button
                key={style.label}
                onClick={() => {
                  onAddText(style.text);
                  toast.success('Text added!');
                }}
                className="w-full text-left p-4 bg-[#f7f7f2] hover:bg-white border border-transparent hover:border-[#5b5b42]/20 rounded-xl transition-all group hover:shadow-sm"
              >
                <span
                  className="block text-[#1a1a1a] truncate"
                  style={{ fontFamily: style.fontFamily, fontSize: Math.min(style.fontSize / 2.5, 28), fontWeight: style.fontWeight as any }}
                >
                  {style.label.replace('Add a ', '').replace('Add ', '')}
                </span>
                <span className="text-[9px] text-gray-400 uppercase tracking-widest mt-1 block">{style.description}</span>
              </button>
            ))}

            <SectionLabel>Quick Text Phrases</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {podTextPhrases.map((p) => (
                <button
                  key={p.text}
                  onClick={() => onAddText(p.text)}
                  className="p-2.5 bg-[#f7f7f2] hover:bg-white border border-transparent hover:border-[#5b5b42]/20 rounded-xl text-left transition-all group hover:shadow-sm"
                >
                  <span className="block text-[10px] font-black text-[#1a1a1a] truncate" style={{ fontFamily: p.font }}>{p.text}</span>
                  <span className="text-[8px] text-gray-400 block mt-0.5">{p.desc}</span>
                </button>
              ))}
            </div>

            <SectionLabel>Curved Text</SectionLabel>
            <div className="bg-[#f7f7f2] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-600">Arc Amount</span>
                <span className="text-[11px] font-black text-[#5b5b42]">{textCurveAmount > 0 ? `+${textCurveAmount}` : textCurveAmount}°</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={textCurveAmount}
                onChange={(e) => handleCurveChange(Number(e.target.value))}
                className="w-full accent-[#5b5b42] h-1.5 rounded-full cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-bold text-gray-400">
                <span>◡ Concave</span>
                <span>— Straight —</span>
                <span>◠ Convex</span>
              </div>
              <button
                onClick={() => {
                  onAddText('Curved Text Here');
                  toast.success('Text added! Select it then adjust the arc.');
                }}
                className="w-full py-2 bg-[#5b5b42] text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-[#3d3d2d] transition-colors"
              >
                Add Curved Text
              </button>
            </div>

            <SectionLabel>Font Styles</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {fontList.map((f) => (
                <button
                  key={f.family}
                  onClick={() => onAddText(f.sample)}
                  className="p-3 bg-[#f7f7f2] hover:bg-white border border-transparent hover:border-[#5b5b42]/20 rounded-xl text-left transition-all group hover:shadow-sm"
                >
                  <span className="block text-base text-[#1a1a1a] truncate" style={{ fontFamily: f.family }}>
                    {f.sample}
                  </span>
                  <span className="text-[9px] text-gray-400 block mt-0.5 uppercase tracking-wide">{f.style}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── STOCK TAB (UNSPLASH/PEXELS) ─────────── */}
        {(activeTab === 'unsplash' || activeTab === 'pexels') && (
          <StockTab 
            onAddImage={onAddImage} 
            onClose={onClose} 
            provider={activeTab === 'unsplash' ? 'unsplash' : 'pexels'}
          />
        )}

        {/* ─── GRAPHICS / ELEMENTS TAB ────────────────────────── */}
        {activeTab === 'graphics' && (
          <div className="p-4 space-y-1">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search elements..."
                className="w-full bg-[#f3f3f3] border-none rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-1 focus:ring-[#5b5b42] transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <SectionLabel>Shapes</SectionLabel>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {shapeDefinitions.map((s) => (
                <button
                  key={s.type}
                  onClick={() => onAddShape(s.type)}
                  className="aspect-square flex flex-col items-center justify-center gap-1.5 bg-[#f7f7f2] hover:bg-white border border-transparent hover:border-[#5b5b42]/25 rounded-xl transition-all group hover:shadow-sm text-[#5b5b42]"
                >
                  <div className="group-hover:scale-110 transition-transform">{s.preview}</div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wide">{s.label}</span>
                </button>
              ))}
            </div>

            <SectionLabel>Vector Graphics</SectionLabel>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1.5 mb-2">
              {availableGraphicCats.map(cat => (
                <PillTab key={cat} active={activeGraphicCat === cat} onClick={() => setActiveGraphicCat(cat)}>
                  {cat}
                </PillTab>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {podGraphics
                .filter(g => g.category === activeGraphicCat)
                .filter(g => !searchQuery || g.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((graphic) => (
                  <button
                    key={graphic.id}
                    onClick={() => {
                      onAddSvgGraphic(graphic.svg, graphic.name);
                      toast.success(`${graphic.name} added to canvas!`);
                    }}
                    title={graphic.name}
                    className="flex flex-col items-center justify-center p-3 h-24 bg-[#f7f7f2] hover:bg-white border border-transparent hover:border-[#5b5b42]/25 rounded-xl transition-all hover:shadow-sm"
                  >
                    <div className="w-12 h-12 flex items-center justify-center mb-1" dangerouslySetInnerHTML={{ __html: graphic.svg }} />
                    <span className="text-[9px] text-gray-500 font-bold truncate w-full text-center tracking-wide">{graphic.name}</span>
                  </button>
                ))}
            </div>

            <SectionLabel>Icons</SectionLabel>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1.5 mb-2">
              {iconCategories.map(cat => (
                <PillTab key={cat.name} active={activeIconCat === cat.name} onClick={() => setActiveIconCat(cat.name)}>
                  {cat.name}
                </PillTab>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {currentIconCat?.icons
                .filter(name => !searchQuery || name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((iconName) => {
                  const pathData = iconLibrary[iconName];
                  if (!pathData) return null;
                  return (
                    <button
                      key={iconName}
                      onClick={() => {
                        onAddIcon(iconName);
                        toast.success(`${iconName} icon added!`);
                      }}
                      title={iconName}
                      className="aspect-square flex flex-col items-center justify-center gap-1 bg-[#f7f7f2] hover:bg-white border border-transparent hover:border-[#5b5b42]/25 rounded-xl transition-all hover:shadow-sm group"
                    >
                      <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-[#5b5b42] fill-none group-hover:stroke-[#1a1a1a] transition-colors" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={pathData} />
                      </svg>
                      <span className="text-[8px] text-gray-400 font-bold truncate w-full text-center px-1">{iconName}</span>
                    </button>
                  );
                })}
            </div>

            <div className="flex items-center justify-between mb-2">
              <SectionLabel>Color Palettes</SectionLabel>
              <button 
                onClick={handleSyncColors}
                className="text-[9px] font-black text-brand-pink hover:underline uppercase tracking-tighter flex items-center gap-1"
              >
                <RefreshCcw className="h-2.5 w-2.5" /> Sync from Design
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1.5 mb-2">
              {dynamicColors.length > 0 && (
                <PillTab active={activePalette === 'Dynamic'} onClick={() => setActivePalette('Dynamic')}>
                  ✨ Dynamic
                </PillTab>
              )}
              {colorPalettes.map(p => (
                <PillTab key={p.name} active={activePalette === p.name} onClick={() => setActivePalette(p.name)}>
                  {p.name}
                </PillTab>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap mb-6">
              {(activePalette === 'Dynamic' ? dynamicColors : (colorPalettes.find(p => p.name === activePalette)?.colors || [])).map(color => (
                <button
                  key={color}
                  onClick={() => onProductColorChange(color)}
                  style={{ backgroundColor: color }}
                  className={cn(
                    "w-9 h-9 rounded-full border-2 transition-all hover:scale-110 shadow-sm",
                    productColor === color ? "border-[#5b5b42] ring-2 ring-[#5b5b42]/20 scale-110" : "border-white"
                  )}
                  title={color}
                />
              ))}
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="h-9 w-full cursor-pointer rounded-xl border border-gray-200"
                />
              </div>
              <button
                onClick={() => onProductColorChange(customColor)}
                className="px-4 py-2 bg-[#5b5b42] text-white text-[10px] font-black rounded-lg uppercase tracking-wider hover:bg-[#3d3d2d] transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* ─── UPLOADS TAB ────────────────────────────────────── */}
        {activeTab === 'uploads' && (
          <div className="p-4 space-y-4">
            <label className="w-full py-10 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#f7f7f2] transition-all group">
              <div className="h-14 w-14 bg-[#f0f0e8] rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                {uploading ? <Loader2 className="h-7 w-7 text-[#5b5b42] animate-spin" /> : <Upload className="h-7 w-7 text-[#5b5b42]" />}
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-[#1a1a1a]">Click to upload</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">PNG, JPG, SVG, WEBP</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleLocalFileUpload(e.target.files[0])} />
            </label>

            {uploadedFiles.length > 0 && (
              <>
                <SectionLabel>Recent Uploads ({uploadedFiles.length})</SectionLabel>
                <div className="grid grid-cols-2 gap-2">
                  {uploadedFiles.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => onAddImage(url)}
                      className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-[#5b5b42] transition-all group relative"
                    >
                      <img src={url} alt="upload" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                        <Plus className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── AI TAB ─────────────────────────────────────────── */}
        {activeTab === 'ai' && (
          <div className="p-4 space-y-4">
            <div className="p-5 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-purple-100 rounded-[28px] shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-purple-200/20 blur-3xl rounded-full" />
              
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-xs font-black text-purple-900 uppercase tracking-widest italic">AI Studio</span>
              </div>

              <div className="relative z-10">
                <textarea
                  className="w-full bg-white/80 backdrop-blur-sm border border-purple-100 rounded-2xl py-3.5 px-4 text-sm resize-none h-28 focus:ring-2 focus:ring-purple-400 outline-none transition-all placeholder:text-gray-400 shadow-inner"
                  placeholder="Describe your vision (e.g., 'A vintage cosmic jellyfish in neon colors')..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
                
                <div className="mt-4 space-y-3">
                  <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest ml-1">Select a Style</p>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {aiStylePills.map(style => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(selectedStyle === style.id ? null : style.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[9px] font-black whitespace-nowrap transition-all border",
                          selectedStyle === style.id 
                            ? "bg-purple-600 text-white border-purple-600 shadow-md scale-105" 
                            : "bg-white text-purple-600 border-purple-100 hover:border-purple-300"
                        )}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleAiGenerate}
                  disabled={isGenerating}
                  className="w-full mt-5 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-[11px] rounded-2xl uppercase tracking-[0.2em] shadow-lg shadow-purple-200 hover:shadow-purple-300 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 italic"
                >
                  {isGenerating ? (
                    <><RefreshCcw className="h-4 w-4 animate-spin" /> Weaving Magic...</>
                  ) : (
                    <><Wand2 className="h-4 w-4" /> Generate Masterpiece</>
                  )}
                </button>
              </div>
            </div>

            {generatedImage && (
              <div className="group relative aspect-square rounded-[28px] overflow-hidden border-4 border-white shadow-2xl ring-1 ring-purple-100 animate-in zoom-in-95 duration-500">
                <img src={generatedImage} alt="AI Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-2 translate-y-2 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                   <p className="text-[10px] text-white/90 font-medium line-clamp-1 italic">&quot;{aiPrompt}&quot;</p>
                   <div className="flex gap-2">
                     <button 
                       onClick={() => onAddImage(generatedImage)}
                       className="flex-1 py-2.5 bg-white text-black text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                     >
                       <Plus className="h-3.5 w-3.5" /> Add to Canvas
                     </button>
                     <button 
                       onClick={() => window.open(generatedImage, '_blank')}
                       className="p-2.5 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 transition-colors"
                     >
                       <Download className="h-3.5 w-3.5" />
                     </button>
                   </div>
                </div>
              </div>
            )}

            {aiHistory.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <SectionLabel>Recent Creations</SectionLabel>
                  <button onClick={() => setAiHistory([])} className="text-[9px] font-black text-gray-300 hover:text-red-400 uppercase tracking-widest transition-colors mb-2">Clear</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {aiHistory.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => onAddImage(item.url)}
                      className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-purple-400 transition-all shadow-sm"
                    >
                      <img src={item.url} alt="History" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-purple-900/20 transition-all flex items-center justify-center">
                        <Plus className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <SectionLabel>Inspiration</SectionLabel>
            <div className="flex flex-col gap-2">
              {aiSubjectIdeas.slice(0, 3).map((idea, i) => (
                <button
                  key={i}
                  onClick={() => setAiPrompt(idea)}
                  className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-purple-200 hover:shadow-sm transition-all group group-hover:scale-102"
                >
                  <span className="text-[10px] font-bold text-gray-500 group-hover:text-purple-700 transition-colors line-clamp-1">&quot;{idea}&quot;</span>
                  <ArrowRight className="h-3 w-3 text-gray-300 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>

            <SectionLabel>AI Toolbox</SectionLabel>
            {[
              { label: 'Style Transfer', desc: 'Apply artistic styles to your photos', emoji: '🎨', available: false, action: 'Coming Soon' },
            ].map(feat => (
              <button 
                key={feat.label} 
                className="w-full flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group text-left disabled:opacity-50"
              >
                <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-purple-50 transition-colors">
                  {feat.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{feat.label}</p>
                  <p className="text-[9px] text-gray-400 font-medium leading-relaxed mt-0.5">{feat.desc}</p>
                </div>
                <div className={cn(
                  "text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter",
                  feat.available ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-50"
                )}>
                  {feat.action}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ─── DATA TAB (VDP) ────────────────────────────────── */}
        {activeTab === 'data' && (
          <VdpDataTab 
            currentData={vdpData}
            currentRowIndex={vdpRowIndex}
            onDataLoaded={onVdpDataLoaded || (() => {})}
            onRowChange={onVdpRowChange || (() => {})}
            onClear={onVdpClear || (() => {})}
          />
        )}

        {/* ─── PAGES TAB (MULTIPAGE) ─────────────────────────── */}
        {activeTab === 'pages' && (
          <div className="p-5 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <SectionLabel>Calendar Pages</SectionLabel>
              <button className="text-[9px] font-black text-brand-pink uppercase tracking-widest flex items-center gap-1.5 bg-brand-pink/5 px-3 py-1.5 rounded-lg">
                <Plus className="h-3 w-3" /> Add Page
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {pageData.map((page, index) => (
                <button 
                  key={index} 
                  onClick={() => onPageChange?.(index)}
                  className={cn(
                    "aspect-[4/5] rounded-[24px] border-2 transition-all relative group overflow-hidden bg-gray-50 flex flex-col",
                    currentPageIndex === index ? "border-brand-pink shadow-lg shadow-brand-pink/10" : "border-transparent hover:border-gray-200"
                  )}
                >
                  <div className="absolute top-2 left-2 z-10 w-6 h-6 bg-white/90 backdrop-blur-md rounded-lg flex items-center justify-center text-[10px] font-black text-brand-dark shadow-sm">
                    {index + 1}
                  </div>
                  {page && page.objects && page.objects.length > 0 ? (
                    <div className="w-full h-full flex items-center justify-center bg-brand-dark/5">
                      <Layers className="h-6 w-6 text-brand-dark/20" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-white flex items-center justify-center text-[8px] font-bold text-gray-300 uppercase tracking-widest italic">
                      Empty
                    </div>
                  )}
                  {index === 0 && <div className="absolute bottom-2 left-0 right-0 text-center text-[8px] font-bold text-brand-pink uppercase tracking-widest">Cover</div>}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all" />
                </button>
              ))}
            </div>

            <div className="p-6 bg-brand-olive/5 rounded-[32px] border border-brand-olive/10 flex gap-4 items-center">
               <div className="w-10 h-10 bg-brand-olive rounded-xl flex items-center justify-center shrink-0">
                  <LayoutGrid className="h-5 w-5 text-white" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-brand-olive uppercase tracking-tight italic">Page Manager</p>
                  <p className="text-[9px] font-medium text-gray-500 leading-tight">Manage layout for each month individually.</p>
               </div>
            </div>
          </div>
        )}

        {/* ─── PRODUCT SETTINGS TAB ──────────────────────────── */}
        {activeTab === 'product' && (
          <div className="p-5 space-y-6">
            <div className="space-y-4">
              <SectionLabel>Product Quality</SectionLabel>
              <div className="grid grid-cols-1 gap-2">
                {qualityLevels.map((q, idx) => {
                  // Robust bonus calculation: use the prop if available, otherwise calculate using multipliers
                  const multipliers = [1, 1.2, 1.5, 2];
                  const m = multipliers[idx] || 1;
                  const fallbackBonus = Math.round(basePrice * m) - basePrice;
                  
                  // Priority: qualityPrices map (synced with DB) > fallback calculation
                  const bonus = qualityPrices[q] !== undefined ? qualityPrices[q] : fallbackBonus;
                  const bonusStr = bonus > 0 ? `+ ₹${bonus}` : '+ ₹0';

                  const descriptions: Record<string, string> = {
                     'Basic': 'Standard everyday use',
                     'Standard': 'Durable, cost-effective',
                     'Premium': 'Soft-touch, high density',
                     'Luxury': 'Ultra-soft, heavy fabric'
                  };

                  return (
                  <button
                    key={q}
                    onClick={() => onQualityChange?.(q)}
                    className={cn(
                      "flex items-center justify-between p-3.5 rounded-xl border-2 transition-all text-left",
                      selectedQuality === q 
                        ? "border-brand-olive bg-[#f7f7f2]" 
                        : "border-gray-100 hover:border-gray-200"
                    )}
                  >
                    <div>
                      <p className="text-xs font-black text-[#1a1a1a]">{q}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{descriptions[q] || 'Upgraded materials'}</p>
                    </div>
                    <span className="text-[10px] font-black text-brand-olive whitespace-nowrap">{bonusStr}</span>
                  </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <SectionLabel>Surface Color</SectionLabel>
              <div className="grid grid-cols-5 gap-3">
                {(colorVariants.length > 0 
                  ? colorVariants.map(v => v.hex)
                  : [
                  '#FFFFFF', '#000000', '#2D3436', '#636E72', '#B2BEC3',
                  '#D63031', '#E84393', '#6C5CE7', '#0984E3', '#00B894',
                  '#FDCB6E', '#E17055', '#55E6C1', '#25CCF7', '#5B5B42'
                ]).map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => onProductColorChange(color)}
                    className={cn(
                      "aspect-square rounded-full border-2 transition-all relative group",
                      productColor === color ? "border-brand-olive scale-110" : "border-gray-100 hover:scale-110"
                    )}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {productColor === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className={cn("h-3 w-3", color === '#FFFFFF' ? "text-black" : "text-white")} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 italic">
               <p className="text-[10px] text-gray-500 leading-relaxed">
                  * Pricing is estimated based on the selected quality level and print area coverage.
               </p>
            </div>
          </div>
        )}

        {/* ─── SHUTTERSTOCK / QUICK PHOTOS ────────────────────── */}
        {activeTab === 'shutterstock' && (
          <div className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search high-quality photos..."
                className="w-full bg-[#f3f3f3] border-none rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-1 focus:ring-[#5b5b42] outline-none"
              />
            </div>
            <p className="text-[10px] text-gray-400 font-bold text-center py-2 text-brand-pink underline italic">Premium Search Engine Powered by AI</p>
            <StockTab onAddImage={onAddImage} onClose={onClose} />
          </div>
        )}

        {/* ─── ICONIFY TAB ─────────────────────────────────────── */}
        {activeTab === 'iconify' && (
          <IconifyTab onAddSvgGraphic={onAddSvgGraphic} />
        )}

        {/* ─── LAYERS TAB ──────────────────────────────────────── */}
        {activeTab === 'layers' && (
          <div className="p-4 space-y-3">
             <div className="flex items-center justify-between mb-2">
                <SectionLabel>Scene Hierarchy</SectionLabel>
                <div className="flex items-center gap-2">
                   <button onClick={() => onLockAllObjects?.(true)} className="text-[8px] font-black uppercase text-gray-400 hover:text-brand-pink transition-colors">Lock All</button>
                   <div className="h-2 w-px bg-gray-200" />
                   <button onClick={() => onClearDesign?.()} className="text-[8px] font-black uppercase text-gray-400 hover:text-red-500 transition-colors">Clear</button>
                </div>
             </div>

            {layers.length === 0 ? (
              <div className="py-20 text-center bg-white/30 rounded-3xl border border-dashed border-gray-200/50">
                <Layers className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No active layers</p>
              </div>
            ) : (
              <div className="space-y-2">
                {layers.map((layer) => (
                  <div 
                    key={layer.id}
                    className={cn(
                      "group p-3 bg-white/40 hover:bg-white/80 border border-gray-100/50 rounded-2xl flex items-center gap-3 transition-all cursor-pointer shadow-sm hover:shadow-md hover:border-brand-pink/20 hover:-translate-y-0.5",
                      activeObject?.id === layer.id && "ring-2 ring-brand-pink ring-offset-2 bg-white shadow-lg border-brand-pink/30 translate-y-0"
                    )}
                    onClick={() => {
                        onUpdateObject?.(layer.id, {}); 
                    }}
                  >
                    <div className="w-10 h-10 bg-gray-50/50 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-gray-100 group-hover:border-brand-pink/20 transition-colors">
                      <div className="text-gray-300 group-hover:text-brand-pink transition-colors capitalize text-[8px] font-black">
                         {layer.type === 'i-text' ? <Type className="h-4 w-4" /> : (layer.type === 'image' ? <ImageIcon className="h-4 w-4" /> : <Shapes className="h-4 w-4" />)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-brand-dark uppercase truncate tracking-tight">{layer.name}</p>
                      <p className="text-[8px] text-brand-pink/60 font-black uppercase tracking-widest">{layer.type.replace('i-', '')}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onUpdateObject?.(layer.id, { locked: !layer.locked }); }}
                        className={cn("p-1.5 rounded-lg transition-all", layer.locked ? "text-brand-pink bg-pink-50 opacity-100" : "text-gray-400 hover:bg-gray-100")}
                      >
                        {layer.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-[9px] text-gray-400 font-bold uppercase text-center mt-6 tracking-tighter italic">Scene graph renders in real-time</p>
          </div>
        )}

        {/* ─── FILTERS TAB ─────────────────────────────────────── */}
        {activeTab === 'library' && (
          <div className="p-4 space-y-4">
             <SectionLabel>Elite FX Presets</SectionLabel>
             <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'none', name: 'Original', preview: '🖼️', props: { _isGrayscale: false, _brightness: 0, _contrast: 0 } },
                  { id: 'noir', name: 'Noir', preview: '🌑', props: { _isGrayscale: true, _brightness: 0, _contrast: 0 } },
                  { id: 'vivid', name: 'Vivid', preview: '🌈', props: { _isGrayscale: false, _brightness: 10, _contrast: 30 } },
                  { id: 'warm', name: 'Warm', preview: '🌅', props: { _isGrayscale: false, _brightness: 5, _contrast: 10 } },
                  { id: 'cold', name: 'Cold', preview: '❄️', props: { _isGrayscale: false, _brightness: 0, _contrast: 15 } },
                  { id: 'bright', name: 'Bright', preview: '✨', props: { _isGrayscale: false, _brightness: 30, _contrast: 0 } },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      if (activeObject?.id && activeObject.type === 'image') {
                        onUpdateObject?.(activeObject.id, f.props);
                        toast.success(`${f.name} filter applied!`);
                      } else {
                        toast.error('Select an image to apply filters.');
                      }
                    }}
                    className="group bg-white/40 hover:bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all hover:shadow-xl hover:border-brand-pink/20"
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform">{f.preview}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">{f.name}</span>
                  </button>
                ))}
             </div>
             
             <div className="mt-8 p-4 bg-brand-pink/5 rounded-3xl border border-brand-pink/10">
                <p className="text-[9px] text-brand-pink font-black uppercase tracking-[0.2em] mb-2 text-center">Pro Enhancement Tips</p>
                <ul className="text-[8px] text-gray-500 font-bold space-y-1.5 uppercase tracking-tighter list-disc px-4 italic">
                  <li>Use Noir for high-contrast B&W prints</li>
                  <li>Vivid works best for colorful photos</li>
                  <li>Bright helps clean up dark uploads</li>
                </ul>
             </div>
          </div>
        )}

        {/* ─── PATTERNS TAB ─────────────────────────────────────── */}
        {activeTab === 'patterns' && (
          <div className="p-4 space-y-4">
             <div className="relative mb-3">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
               <input
                 type="text"
                 placeholder="Search infinite patterns (e.g. 'Floral', 'Batik')..."
                 className="w-full bg-[#f3f3f3] border-none rounded-xl py-2.5 pl-9 pr-4 text-[11px] font-bold focus:ring-1 focus:ring-[#5b5b42] outline-none transition-all"
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     const query = (e.target as HTMLInputElement).value;
                     const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(query + ' seamless high-resolution repeatable textile pattern design')}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random()*100000)}`;
                     onAddPattern?.(url);
                     toast.success("AI Pattern Generated & Applied!");
                   }
                 }}
               />
               <p className="text-[8px] text-gray-400 font-bold uppercase mt-2 ml-1 tracking-tighter italic">Press Enter to Generate AI Pattern for FREE</p>
             </div>

             <SectionLabel>Curated High-Res Patterns</SectionLabel>
             <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[400px] no-scrollbar">
                {[
                  { id: 'floral_vibe', name: 'Vintage Floral', preview: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?w=400&q=80' },
                  { id: 'abstract_geo', name: 'Abstract Geo', preview: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80' },
                  { id: 'indi_block', name: 'Indian Block Print', preview: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&q=80' },
                  { id: 'minimal_lines', name: 'Minimal Lines', preview: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&q=80' },
                  { id: 'luxury_marble', name: 'Luxury Marble', preview: 'https://images.unsplash.com/photo-1618221639243-7f311f42702b?w=400&q=80' },
                  { id: 'retro_waves', name: 'Retro Waves', preview: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&q=80' },
                  { id: 'cyber_tech', name: 'Cyber Tech', preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=80' },
                  { id: 'boho_chic', name: 'Boho Chic', preview: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400&q=80' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onAddPattern?.(p.preview);
                      toast.success(`Applied ${p.name} pattern!`);
                    }}
                    className="group bg-white/40 hover:bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all hover:shadow-xl hover:border-brand-pink/20"
                  >
                    <div className="w-full aspect-square rounded-xl overflow-hidden shadow-inner border border-black/5">
                       <img src={p.preview} alt={p.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">{p.name}</span>
                  </button>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarPanel;
