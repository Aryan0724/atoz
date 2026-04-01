"use client";

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { SidebarTab } from './SidebarRail';
import { CanvasObjectProperties } from '@/types/canvas';
import { canvasTemplates, templateCategories } from '@/lib/data/canvasTemplates';
import { iconLibrary, iconCategories } from '@/lib/data/icons';
import { podGraphics, podGraphicCategories } from '@/lib/data/podGraphics';
import { toast } from 'sonner';
import { 
  Type, Loader2, Upload, Plus, Search, LayoutGrid, Layers, Lock, Unlock, Eye, EyeOff,
  X, Sparkles, Check, ChevronRight, Grid, Image as ImageIcon, Shapes
} from 'lucide-react';

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

// Graphic phrases commonly used on merchandise
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

// Design accent shapes — commonly used in print design
const shapeDefinitions = [
  { type: 'rect' as const, label: 'Rectangle', preview: <div className="w-10 h-7 border-2 border-current" /> },
  { type: 'circle' as const, label: 'Circle', preview: <div className="w-8 h-8 border-2 border-current rounded-full" /> },
  { type: 'star' as const, label: 'Star', preview: <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17 5.8 21.3l2.4-7.4L2 9.4h7.6z"/></svg> },
  { type: 'heart' as const, label: 'Heart', preview: <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg> },
  { type: 'triangle' as const, label: 'Triangle', preview: <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[24px] border-b-current" /> },
  { type: 'line' as const, label: 'Divider', preview: <div className="w-10 h-0 border-t-2 border-current" /> },
];

const photoCategories = ['Streetwear', 'Textures', 'Vintage', 'Gradients', 'Typography'];
const unsplashPhotos: Record<string, { url: string; thumb: string }[]> = {
  'Streetwear': [
    { url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=200&q=60' },
    { url: 'https://images.unsplash.com/photo-1523398002811-999aa8d9512e?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1523398002811-999aa8d9512e?w=200&q=60' },
    { url: 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=200&q=60' },
    { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=60' },
  ],
  'Textures': [
    { url: 'https://images.unsplash.com/photo-1600161474147-38e24baef762?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1600161474147-38e24baef762?w=200&q=60' },
    { url: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=200&q=60' },
    { url: 'https://images.unsplash.com/photo-1463130456064-9b16ac427ba6?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1463130456064-9b16ac427ba6?w=200&q=60' },
    { url: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=200&q=60' },
  ],
  'Vintage': [
    { url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=200&q=60' },
    { url: 'https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?w=200&q=60' },
    { url: 'https://images.unsplash.com/photo-1478059299873-f04771b0db7a?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1478059299873-f04771b0db7a?w=200&q=60' },
    { url: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=200&q=60' },
  ],
  'Gradients': [
    { url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=200&q=60' },
    { url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200&q=60' },
    { url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&q=60' },
    { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=60' },
  ],
  'Typography': [
    { url: 'https://images.unsplash.com/photo-1516315720917-231cb9ac11f1?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1516315720917-231cb9ac11f1?w=200&q=60' },
    { url: 'https://images.unsplash.com/photo-1555617260-2640243be129?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1555617260-2640243be129?w=200&q=60' },
    { url: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=200&q=60' },
    { url: 'https://images.unsplash.com/photo-1490578474895-699bc4e34711?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1490578474895-699bc4e34711?w=200&q=60' },
  ],
};

// ─────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────
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
  layers,
  selectedQuality,
  onQualityChange,
  productCategory = 'Apparel',
  qualityLevels = ['Standard', 'Premium', 'Luxury'],
  basePrice = 0
}: SidebarPanelProps) => {
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // Configure defaults based on product category
  const catLower = productCategory.toLowerCase();
  const isBottle = catLower.includes('bottle') || catLower.includes('mug') || catLower.includes('drinkware');
  const isPrint = catLower.includes('print') || catLower.includes('canvas');
  const isStationery = catLower.includes('stationery');
  const isApparel = catLower.includes('apparel');
  const isLifestyle = catLower.includes('lifestyle');
  const isCorporate = catLower.includes('corporate');

  // Filter available categories based on product type
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

  React.useEffect(() => {
    if (!availableTemplateCats.includes(activeTemplateCat)) {
      setActiveTemplateCat(availableTemplateCats.includes('All') ? 'All' : availableTemplateCats[0]);
    }
    if (!availableGraphicCats.includes(activeGraphicCat)) {
      setActiveGraphicCat(availableGraphicCats[0]);
    }
  }, [availableTemplateCats, availableGraphicCats, activeTemplateCat, activeGraphicCat]);

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
    'library': 'Photos',
    'graphics': 'Elements',
    'templates': 'Templates',
    'shutterstock': 'Quick Photos',
  };

  const filteredTemplates = activeTemplateCat === 'All' 
    ? canvasTemplates.filter(t => availableTemplateCats.includes(t.category)) 
    : canvasTemplates.filter(t => t.category === activeTemplateCat);

  const currentIconCat = iconCategories.find(c => c.name === activeIconCat);

  return (
    <div className="w-full md:w-[340px] shrink-0 bg-white border-r border-gray-100 flex flex-col z-30 shadow-xl relative">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-gray-100 flex-shrink-0 bg-white">
        <h3 className="text-base font-black text-[#1a1a1a] tracking-tight">{currentTitle[activeTab] || activeTab}</h3>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
          <X className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* ─── TEMPLATES TAB ──────────────────────────────────── */}
        {activeTab === 'templates' && (
          <div className="p-4 space-y-4">
            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {availableTemplateCats.map(cat => (
                <PillTab key={cat} active={activeTemplateCat === cat} onClick={() => setActiveTemplateCat(cat)}>
                  {cat}
                </PillTab>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {filteredTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onLoadTemplate?.(t.json);
                    toast.success(`"${t.name}" template applied!`);
                  }}
                  className="group bg-[#f7f7f2] hover:bg-white border border-transparent hover:border-[#5b5b42]/20 rounded-xl overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="aspect-square flex flex-col items-center justify-center gap-2 p-3 group-hover:scale-105 transition-transform">
                    <span className="text-4xl">{t.preview}</span>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-wide">{t.name}</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">{(t as any).category}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

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

        {/* ─── GRAPHICS / ELEMENTS TAB ────────────────────────── */}
        {activeTab === 'graphics' && (
          <div className="p-4 space-y-1">
            {/* Search */}
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

            {/* Shapes section */}
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

            {/* Premium Vector Graphics for POD */}
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


            {/* Vector Icons */}
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

            {/* Color Palette */}
            <SectionLabel>Color Palettes</SectionLabel>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1.5 mb-2">
              {colorPalettes.map(p => (
                <PillTab key={p.name} active={activePalette === p.name} onClick={() => setActivePalette(p.name)}>
                  {p.name}
                </PillTab>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {(colorPalettes.find(p => p.name === activePalette)?.colors || []).map(color => (
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

        {/* ─── LIBRARY / PHOTOS TAB ───────────────────────────── */}
        {activeTab === 'library' && (
          <div className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search photos..."
                className="w-full bg-[#f3f3f3] border-none rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-1 focus:ring-[#5b5b42] outline-none"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {photoCategories.map(cat => (
                <PillTab key={cat} active={activePhotoCat === cat} onClick={() => setActivePhotoCat(cat)}>
                  {cat}
                </PillTab>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(unsplashPhotos[activePhotoCat] || []).map((photo, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onAddImage(photo.url);
                    toast.success('Photo added to canvas!');
                  }}
                  className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-[#5b5b42] transition-all group relative"
                >
                  <img
                    src={photo.thumb}
                    alt={`${activePhotoCat} ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-1.5">
                      <Plus className="h-4 w-4 text-[#5b5b42]" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── AI TAB ─────────────────────────────────────────── */}
        {activeTab === 'ai' && (
          <div className="p-4 space-y-4">
            <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-black text-purple-800">AI Image Generator</span>
              </div>
              <p className="text-xs text-purple-600 mb-4">Describe what you want to create and our AI will generate it for you.</p>
              <textarea
                className="w-full bg-white border border-purple-200 rounded-xl py-3 px-4 text-sm resize-none h-24 focus:ring-1 focus:ring-purple-400 outline-none"
                placeholder="A vintage logo with mountains and a sun..."
              />
              <button className="w-full mt-3 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-[11px] rounded-xl uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" /> Generate (Coming Soon)
              </button>
            </div>

            <SectionLabel>AI-Powered Features</SectionLabel>
            {[
              { label: 'Background Remover', desc: 'Remove bg from any image', emoji: '✂️', available: true },
              { label: 'Style Transfer', desc: 'Apply artistic styles', emoji: '🎨', available: false },
              { label: 'Upscale Image', desc: 'Enhance image resolution', emoji: '🔍', available: false },
              { label: 'Text to Logo', desc: 'Generate logo from text', emoji: '⚡', available: false },
            ].map(feat => (
              <div key={feat.label} className="flex items-center gap-3 p-3 bg-[#f7f7f2] rounded-xl">
                <span className="text-2xl">{feat.emoji}</span>
                <div className="flex-1">
                  <p className="text-xs font-black text-[#1a1a1a]">{feat.label}</p>
                  <p className="text-[10px] text-gray-400">{feat.desc}</p>
                </div>
                {feat.available ? (
                  <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">Ready</span>
                ) : (
                  <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase">Soon</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ─── PRODUCT SETTINGS TAB ──────────────────────────── */}
        {activeTab === 'product' && (
          <div className="p-5 space-y-6">
            <div className="space-y-4">
              <SectionLabel>Product Quality</SectionLabel>
              <div className="grid grid-cols-1 gap-2">
                {qualityLevels.map((q, index) => {
                  const multipliers = [1, 1.2, 1.5, 2];
                  const multiplier = multipliers[Math.max(0, index)] || 1;
                  const price = Math.round(basePrice * multiplier);
                  const bonus = price - basePrice;
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
                {[
                  '#FFFFFF', '#000000', '#2D3436', '#636E72', '#B2BEC3',
                  '#D63031', '#E84393', '#6C5CE7', '#0984E3', '#00B894',
                  '#FDCB6E', '#E17055', '#55E6C1', '#25CCF7', '#5B5B42'
                ].map((color) => (
                  <button
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
            <p className="text-[10px] text-gray-400 font-bold text-center py-2">Premium Photo Library — Integration Coming Soon</p>
            
            {/* Show some curated samples from multiple categories */}
            <SectionLabel>Curated Picks</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(unsplashPhotos).flat().slice(0, 8).map((photo, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onAddImage(photo.url);
                    toast.success('Photo added to canvas!');
                  }}
                  className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-[#5b5b42] transition-all group relative"
                >
                  <img src={photo.thumb} alt={`photo-${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-1.5">
                      <Plus className="h-4 w-4 text-[#5b5b42]" />
                    </div>
                  </div>
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
