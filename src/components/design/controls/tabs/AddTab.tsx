import React, { useState } from 'react';
import { Type, Upload, Loader2, Search, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { uploadFile } from '@/lib/supabase/storage';

interface AddTabProps {
  onAddText: (text: string) => void;
  onAddImage: (url: string) => void;
  onAddShape: (type: 'circle' | 'rect' | 'triangle') => void;
  onTabChange: (tab: any) => void;
}

const shapes = [
  { name: 'Circle', type: 'circle' as const, icon: <div className="h-6 w-6 rounded-full border-2 border-brand-pink" /> },
  { name: 'Square', type: 'rect' as const, icon: <div className="h-6 w-6 border-2 border-brand-pink" /> },
  { name: 'Triangle', type: 'triangle' as const, icon: <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-brand-pink" /> },
];

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

const AddTab = ({ onAddText, onAddImage, onAddShape, onTabChange }: AddTabProps) => {
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockImages, setStockImages] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  React.useEffect(() => {
    if (UNSPLASH_ACCESS_KEY) {
      fetchTrendingImages();
    }
  }, []);

  const fetchTrendingImages = async () => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos?per_page=12&order_by=popular&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      setStockImages(data || []);
    } catch (error) {
      console.error('Failed to fetch trending images:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `upload-${Date.now()}-${file.name}`;
      const publicUrl = await uploadFile('designs', fileName, file);
      if (publicUrl) {
        onAddImage(publicUrl);
        onTabChange('edit'); // switch to edit mode once added
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (!UNSPLASH_ACCESS_KEY) {
      toast.error('Unsplash API key is missing. Please add NEXT_PUBLIC_UNSPLASH_ACCESS_KEY to your .env file.');
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=12&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      setStockImages(data.results || []);
      if (data.results?.length === 0) {
        toast.info('No images found for your search.');
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Failed to fetch images from Unsplash.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8 pb-8">
      <h3 className="text-xl font-black text-brand-dark tracking-tight">Add Elements</h3>
      
      {/* Stock Images Search */}
      <section className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Stock Images</h4>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search premium photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/20 transition-all font-medium"
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-pink transition-colors"
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </button>
        </form>

        {stockImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-hide">
            {stockImages.map((img) => (
              <button
                key={img.id}
                onClick={() => {
                  onAddImage(img.urls.regular);
                  onTabChange('edit');
                }}
                className="relative aspect-square rounded-lg overflow-hidden group hover:ring-2 hover:ring-brand-pink transition-all bg-gray-100"
              >
                <img 
                  src={img.urls.small} 
                  alt={img.alt_description}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Custom Layers</h4>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onAddText("Double click to edit")}
            className="bg-gray-50 hover:bg-brand-pink/5 hover:border-brand-pink/30 border border-transparent rounded-2xl p-4 flex flex-col items-center justify-center transition-all group"
          >
            <div className="h-10 w-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Type className="h-5 w-5 text-brand-pink" />
            </div>
            <span className="font-bold text-[11px] text-brand-dark">Add Text</span>
          </button>

          <label className="bg-gray-50 hover:bg-brand-pink/5 hover:border-brand-pink/30 border border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center transition-all group cursor-pointer">
            {uploading ? (
              <Loader2 className="h-10 w-10 text-brand-pink animate-spin" />
            ) : (
              <>
                <div className="h-10 w-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="h-5 w-5 text-brand-pink" />
                </div>
                <span className="font-bold text-brand-dark text-[11px]">Upload</span>
              </>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
          </label>
        </div>
      </section>

      <section>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Basic Shapes</h4>
        <div className="grid grid-cols-3 gap-3">
          {shapes.map((s) => (
            <button
              key={s.name}
              onClick={() => onAddShape(s.type)}
              className="flex flex-col items-center justify-center h-20 bg-gray-50 rounded-2xl hover:bg-pink-50 hover:text-brand-pink transition-all group border border-transparent hover:border-brand-pink/20"
            >
              <div className="group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <span className="text-[9px] font-bold uppercase mt-2">{s.name}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AddTab;

