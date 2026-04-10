"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Plus, Image as ImageIcon, ExternalLink, Download } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface StockPhoto {
  id: string;
  url: string;
  thumb: string;
  user: string;
  userLink: string;
  color?: string;
  downloadLocation?: string;
}

interface StockTabProps {
  onAddImage: (url: string) => void;
  onClose?: () => void;
  provider?: 'pexels' | 'unsplash';
}

const PEXELS_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY || '';
const UNSPLASH_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '';

export default function StockTab({ onAddImage, onClose, provider = 'pexels' }: StockTabProps) {
  const [query, setQuery] = useState('');
  const [photos, setPhotos] = useState<StockPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Optimization refs
  const cache = useRef<Record<string, StockPhoto[]>>({});
  const abortControllerRef = useRef<AbortController | null>(null);

  // Default popular searches
  const popularTags = ['Nature', 'Streetwear', 'Abstract', 'Vintage', 'Minimal', 'Textures'];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const searchPexels = async (searchQuery: string) => {
    if (!PEXELS_KEY) {
      toast.error("Please add NEXT_PUBLIC_PEXELS_API_KEY to your .env.local file to enable Pexels search.");
      return;
    }

    const cacheKey = `pexels:${searchQuery}`;
    if (cache.current[cacheKey]) {
      setPhotos(cache.current[cacheKey]);
      setHasSearched(true);
      return;
    }

    // Abort previous request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=24`, {
        headers: {
          Authorization: PEXELS_KEY
        },
        signal: abortControllerRef.current.signal
      });

      if (response.status === 429) {
        toast.error("Pexels rate limit exceeded. Please try again in a few minutes.");
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch from Pexels');

      const data = await response.json();
      const formatted = data.photos.map((p: any) => ({
        id: p.id.toString(),
        url: p.src.large,
        thumb: p.src.medium,
        user: p.photographer,
        userLink: p.photographer_url
      }));

      cache.current[cacheKey] = formatted;
      setPhotos(formatted);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error(err);
      toast.error("Pexels search failed. Check your API key or internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const searchUnsplash = async (searchQuery: string) => {
    if (!UNSPLASH_KEY) {
      toast.error("Please add NEXT_PUBLIC_UNSPLASH_ACCESS_KEY to your .env.local file to enable Unsplash search.");
      return;
    }

    const cacheKey = `unsplash:${searchQuery}`;
    if (cache.current[cacheKey]) {
      setPhotos(cache.current[cacheKey]);
      setHasSearched(true);
      return;
    }

    // Abort previous request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=24`,
        { 
          headers: {
            Authorization: `Client-ID ${UNSPLASH_KEY}`
          },
          signal: abortControllerRef.current.signal 
        }
      );

      if (response.status === 403) {
        toast.error("Unsplash rate limit exceeded. Please try again in an hour.");
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch from Unsplash');

      const data = await response.json();
      const formatted = data.results.map((p: any) => ({
        id: p.id,
        url: p.urls.regular,
        thumb: p.urls.small,
        user: p.user.name,
        userLink: p.user.links.html,
        color: p.color,
        downloadLocation: p.links.download_location || p.links.download
      }));

      cache.current[cacheKey] = formatted;
      setPhotos(formatted);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error(err);
      toast.error("Unsplash search failed. Check your API key or internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const triggerUnsplashDownload = async (photo: StockPhoto) => {
    if (provider !== 'unsplash' || !photo.downloadLocation || !UNSPLASH_KEY) return;
    
    try {
      await fetch(photo.downloadLocation, {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_KEY}`
        }
      });
    } catch (err) {
      console.warn('Failed to track Unsplash download:', err);
    }
  };

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    if (provider === 'unsplash') {
      searchUnsplash(searchQuery);
    } else {
      searchPexels(searchQuery);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const providerName = provider === 'pexels' ? 'Pexels' : 'Unsplash';

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 space-y-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder={`Search ${providerName}...`}
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
                performSearch(tag);
              }}
              className="px-3 py-1.5 bg-gray-50 hover:bg-brand-olive/10 text-gray-500 hover:text-brand-olive rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20 no-scrollbar">
        {loading && photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
             <Loader2 className="h-8 w-8 text-brand-pink animate-spin" />
             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Searching {providerName}...</p>
          </div>
        ) : photos.length > 0 ? (
          <div className="relative">
            {loading && (
              <div className="absolute inset-x-0 -top-2 flex justify-center z-10">
                <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-gray-100 flex items-center gap-2">
                  <Loader2 className="h-3 w-3 text-brand-pink animate-spin" />
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Updating...</span>
                </div>
              </div>
            )}
            <div className={cn("grid grid-cols-2 gap-3 transition-opacity", loading ? "opacity-50" : "opacity-100")}>
              {photos.map((photo) => (
                <div 
                  key={photo.id} 
                  className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                  style={{ backgroundColor: photo.color || '#f3f4f6' }}
                >
                  <img 
                    src={photo.thumb} 
                    alt={photo.user}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
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
                      triggerUnsplashDownload(photo);
                      toast.success('Photo added to canvas!');
                    }}
                    className="absolute inset-0 z-10"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : hasSearched ? (
          <div className="text-center py-20">
             <ImageIcon className="h-12 w-12 text-gray-100 mx-auto mb-4" />
             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No results found on {providerName}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
             <div className="w-16 h-16 bg-brand-olive/5 rounded-3xl flex items-center justify-center mb-4">
                <ImageIcon className="h-8 w-8 text-brand-olive/40" />
             </div>
             <h4 className="text-[11px] font-black text-brand-dark uppercase tracking-widest mb-1 italic">{providerName} Library</h4>
             <p className="text-[10px] text-gray-400 font-bold leading-relaxed">Search millions of high resolution stock photos from {providerName} directly on your canvas.</p>
             
             {((provider === 'pexels' && !PEXELS_KEY) || (provider === 'unsplash' && !UNSPLASH_KEY)) && (
               <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100 text-left">
                  <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mb-1 italic">Setup Required</p>
                  <p className="text-[9px] text-orange-400 font-bold leading-tight uppercase">
                    Add `NEXT_PUBLIC_{provider.toUpperCase()}_{provider === 'unsplash' ? 'ACCESS_KEY' : 'API_KEY'}` to your environment to enable live search.
                  </p>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
