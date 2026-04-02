"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface IconifyTabProps {
  onAddSvgGraphic: (svg: string, name: string) => void;
}

const ICON_SETS = [
  { id: 'mdi', label: 'Material' },
  { id: 'lucide', label: 'Lucide' },
  { id: 'tabler', label: 'Tabler' },
  { id: 'ph', label: 'Phosphor' },
  { id: 'ri', label: 'Remix' },
  { id: 'game-icons', label: 'Games' },
  { id: 'emojione-monotone', label: 'Emoji' },
  { id: 'noto', label: 'Noto' },
];

const POPULAR_SEARCHES = ['star', 'heart', 'fire', 'crown', 'lightning', 'skull', 'diamond', 'rocket', 'flower', 'paw'];

const IconifyTab = ({ onAddSvgGraphic }: IconifyTabProps) => {
  const [query, setQuery] = useState('');
  const [activeSet, setActiveSet] = useState('mdi');
  const [icons, setIcons] = useState<{ name: string; body: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingIcon, setAddingIcon] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const searchIcons = useCallback(async (searchQuery: string, prefix: string) => {
    setLoading(true);
    try {
      const q = searchQuery.trim() || 'popular';
      const url = `https://api.iconify.design/search?query=${encodeURIComponent(q)}&prefix=${prefix}&limit=48`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.icons?.length > 0) {
        // Fetch SVG bodies for each icon
        const iconNames: string[] = data.icons;
        const svgResults: { name: string; body: string }[] = [];
        
        // Batch fetch (Iconify supports fetching multiple icons at once)
        const iconList = iconNames.map(n => n.split(':')[1]).filter(Boolean).join(',');
        const svgRes = await fetch(`https://api.iconify.design/${prefix}.json?icons=${iconList}`);
        const svgData = await svgRes.json();
        
        for (const fullName of iconNames) {
          const shortName = fullName.split(':')[1];
          if (shortName && svgData.icons?.[shortName]) {
            const body = svgData.icons[shortName].body;
            svgResults.push({ name: shortName, body });
          }
        }
        
        setIcons(svgResults);
      } else {
        setIcons([]);
      }
    } catch (err) {
      console.error('Iconify fetch failed:', err);
      setIcons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      searchIcons(query, activeSet);
    }, 400);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [query, activeSet, searchIcons]);

  const handleAddIcon = async (icon: { name: string; body: string }) => {
    setAddingIcon(icon.name);
    try {
      const viewBox = '0 0 24 24';
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100" height="100">${icon.body}</svg>`;
      onAddSvgGraphic(svgString, icon.name);
      toast.success(`${icon.name} added!`);
    } catch {
      toast.error('Failed to add icon');
    } finally {
      setAddingIcon(null);
    }
  };

  return (
    <div className="p-4 space-y-3 animate-in fade-in duration-200">
      {/* Icon Set Selector */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {ICON_SETS.map(set => (
          <button
            key={set.id}
            onClick={() => setActiveSet(set.id)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              activeSet === set.id
                ? 'bg-[#5b5b42] text-white shadow-sm'
                : 'bg-[#f0f0e8] text-gray-500 hover:bg-[#e4e4d8]'
            }`}
          >
            {set.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search 200,000+ icons..."
          className="w-full bg-[#f3f3f3] border-none rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-1 focus:ring-[#5b5b42] transition-all outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Popular searches */}
      {!query && (
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SEARCHES.map(term => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-2 py-1 bg-[#f7f7f2] hover:bg-[#e4e4d8] rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-wide transition-all"
            >
              {term}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="h-8 w-8 text-[#5b5b42] animate-spin" />
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Loading icons...</p>
        </div>
      ) : icons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <span className="text-4xl">🔍</span>
          <p className="text-xs text-gray-400 font-bold">No icons found. Try a different search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {icons.map((icon) => (
            <button
              key={icon.name}
              onClick={() => handleAddIcon(icon)}
              disabled={addingIcon === icon.name}
              title={icon.name}
              className="aspect-square flex flex-col items-center justify-center gap-1 bg-[#f7f7f2] hover:bg-white border border-transparent hover:border-[#5b5b42]/25 rounded-xl transition-all hover:shadow-sm group p-2"
            >
              {addingIcon === icon.name ? (
                <Loader2 className="h-5 w-5 text-[#5b5b42] animate-spin" />
              ) : (
                <div
                  className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform [&_svg]:w-full [&_svg]:h-full [&_path]:fill-[#5b5b42] [&_rect]:fill-[#5b5b42] [&_circle]:fill-[#5b5b42]"
                  dangerouslySetInnerHTML={{
                    __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">${icon.body}</svg>`
                  }}
                />
              )}
              <span className="text-[7px] text-gray-400 font-bold truncate w-full text-center">{icon.name}</span>
            </button>
          ))}
        </div>
      )}

      <p className="text-[9px] text-gray-300 text-center font-bold pt-1">Powered by Iconify • 200,000+ Open Source Icons</p>
    </div>
  );
};

export default IconifyTab;
