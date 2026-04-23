"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Type, LayoutGrid, Square, Upload, Sparkles, FolderHeart, Image as ImageIcon, HelpCircle, Layout as LayoutIcon, Palette, Star, Layers, Grid, Image
} from 'lucide-react';

export type SidebarTab = 'product' | 'uploads' | 'ai' | 'text' | 'library' | 'graphics' | 'shutterstock' | 'iconify' | 'layers' | 'patterns' | 'unsplash' | 'pexels' | 'data' | 'pages';

interface SidebarRailProps {
  activeTab: SidebarTab | null;
  onTabChange: (tab: SidebarTab) => void;
  designMode?: string;
}

const navItems: { id: SidebarTab; icon: React.ReactNode; label: string; mode?: string }[] = [
  { id: 'product', icon: <Palette className="h-5 w-5" />, label: 'Product' },
  { id: 'data', icon: <Grid className="h-5 w-5" />, label: 'Data', mode: 'vdp' },
  { id: 'pages', icon: <LayoutIcon className="h-5 w-5" />, label: 'Pages', mode: 'multipage' },
  { id: 'patterns', icon: <Grid className="h-5 w-5" />, label: 'Patterns' },
  { id: 'text', icon: <Type className="h-5 w-5" />, label: 'Text' },
  { id: 'graphics', icon: <Square className="h-5 w-5" />, label: 'Elements' },
  { id: 'layers', icon: <Layers className="h-5 w-5" />, label: 'Layers' },
  { id: 'library', icon: <Sparkles className="h-5 w-5" />, label: 'Filters' },
  { id: 'iconify', icon: <FolderHeart className="h-5 w-5" />, label: 'Icons' },
  { id: 'unsplash', icon: <ImageIcon className="h-5 w-5" />, label: 'Stock' },
  { id: 'uploads', icon: <Upload className="h-5 w-5" />, label: 'Upload' },
  { id: 'ai', icon: <Sparkles className="h-5 w-5 opacity-40" />, label: 'AI' },
] as any[];

const SidebarRail = ({ activeTab, onTabChange, designMode = 'standard' }: SidebarRailProps) => {
  if (designMode === 'intake_form') return null;

  const filteredItems = navItems.filter(item => {
    if (!item.mode) return true;
    return item.mode === designMode;
  });
  return (
    <div className="w-[78px] shrink-0 bg-white/70 backdrop-blur-3xl border-r border-white/20 flex flex-col items-center py-2 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)] ring-1 ring-black/5">
       <div className="w-full flex flex-col gap-1">
         {filteredItems.map((item: any) => (
           <button
             key={item.id}
             onClick={() => onTabChange(item.id)}
             className={cn(
               "w-full py-4 flex flex-col items-center justify-center gap-1.5 transition-all relative group",
               activeTab === item.id 
                ? "text-brand-olive bg-gray-50 font-bold" 
                : "text-gray-500 hover:text-brand-dark hover:bg-gray-50/50"
             )}
           >
             {activeTab === item.id && (
               <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-brand-olive rounded-r-sm shadow-[1px_0_8px_rgba(91,91,66,0.3)]" />
             )}
             <div className={cn(
               "transition-transform duration-200",
               activeTab === item.id ? "scale-105" : "group-hover:scale-105"
             )}>
               {item.icon}
             </div>
             <span className="text-[10px] text-center leading-tight tracking-tight">
               {item.label}
             </span>
           </button>
         ))}
       </div>
       
       <div className="mt-auto pb-4 w-full flex flex-col items-center gap-2">
         <button 
           className="w-full py-4 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-brand-dark transition-all"
           title="Help & Support"
         >
           <HelpCircle className="h-5 w-5" />
           <span className="text-[10px] text-center leading-tight tracking-tight">Help</span>
         </button>
       </div>
    </div>
  );
};

export default SidebarRail;
