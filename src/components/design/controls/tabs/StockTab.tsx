"use client";

import React, { useState, useEffect } from 'react';
import { Search, Loader2, Plus, Image as ImageIcon, ExternalLink, Download } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface StockPhoto {
  id: string;
  url: string;
  thumb: string;
  user: string;
  userLink: string;
}

interface StockTabProps {
  onAddImage: (url: string) => void;
  onClose?: () => void;
}

const PEXELS_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY || ''; // User should add this to env

export default function StockTab({ onAddImage, onClose }: StockTabProps) {
  const [query, setQuery] = useState('');
  const [photos, setPhotos] = useState<StockPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Default popular searches
  const popularTags = ['Nature', 'Streetwear', 'Abstract', 'Vintage', 'Minimal', 'Textures'];

  const searchPexels = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    if (!PEXELS_KEY) {
      toast.error("Please add NEXT_PUBLIC_PEXELS_API_KEY to your .env.local file to enable stock search.");
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=20`, {
        headers: {
          Authorization: PEXELS_KEY
        }
      });

      if (!response.ok) throw new Error('Failed to fetch from Pexels');

      const data = await response.json();
      const formatted = data.photos.map((p: any) => ({
        id: p.id.toString(),
        url: p.src.large,
        thumb: p.src.medium,
        user: p.photographer,
        userLink: p.photographer_url
      }));

      setPhotos(formatted);
    } catch (err) {
      console.error(err);
      toast.error("Search failed. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchPexels(query);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 space-y-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search millions of photos..."
            className="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-olive transition-all outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <div className="flex flex-wrap gap-2">
          {popularTags.map(tag => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag);
                searchPexels(tag);
              }}
              className="px-3 py-1.5 bg-gray-50 hover:bg-brand-olive/10 text-gray-500 hover:text-brand-olive rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20 no-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
             <Loader2 className="h-8 w-8 text-brand-pink animate-spin" />
             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Searching Libraries...</p>
          </div>
        ) : photos.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
                <img 
                  src={photo.thumb} 
                  alt={photo.user}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                   <p className="text-[8px] font-bold text-white truncate">by {photo.user}</p>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                   <div className="bg-white rounded-full p-2 text-brand-dark shadow-xl scale-90 group-hover:scale-100 transition-transform">
                      <Plus className="h-4 w-4" />
                   </div>
                </div>
                <button 
                  onClick={() => {
                    onAddImage(photo.url);
                    toast.success('Photo added to canvas!');
                  }}
                  className="absolute inset-0 z-10"
                />
              </div>
            ))}
          </div>
        ) : hasSearched ? (
          <div className="text-center py-20">
             <ImageIcon className="h-12 w-12 text-gray-100 mx-auto mb-4" />
             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No results found</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
             <div className="w-16 h-16 bg-brand-olive/5 rounded-3xl flex items-center justify-center mb-4">
                <ImageIcon className="h-8 w-8 text-brand-olive/40" />
             </div>
             <h4 className="text-[11px] font-black text-brand-dark uppercase tracking-widest mb-1 italic">High Resolution Stock</h4>
             <p className="text-[10px] text-gray-400 font-bold leading-relaxed">Search over 3 million stock photos from the Pexels library directly on your canvas.</p>
             
             {!PEXELS_KEY && (
               <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100 text-left">
                  <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mb-1 italic">Setup Required</p>
                  <p className="text-[9px] text-orange-400 font-bold leading-tight uppercase">Add `NEXT_PUBLIC_PEXELS_API_KEY` to your environment to enable live search.</p>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
