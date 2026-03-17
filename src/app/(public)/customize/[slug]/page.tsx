"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { useCart } from '@/lib/store/useCart';
import DesignerCanvas from '@/components/design/DesignerCanvas';
import DesignControls from '@/components/design/DesignControls';
import { ArrowLeft, Sparkles, ShoppingBag, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/lib/supabase/types';
import { mockProducts } from '@/lib/data/mockProducts';

export default function CustomizePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.slug as string; // Using slug as the param name now

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [customText, setCustomText] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Inter, sans-serif');
  const [fontSize, setFontSize] = useState(24);
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const [textRotation, setTextRotation] = useState(0);
  const [charSpacing, setCharSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.16);
  const [textShadow, setTextShadow] = useState({ color: 'rgba(0,0,0,0)', blur: 0, offsetX: 0, offsetY: 0 });
  
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPosition, setLogoPosition] = useState({ x: 50, y: 30 });
  const [logoScale, setLogoScale] = useState(5);
  const [logoRotation, setLogoRotation] = useState(0);

  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [isGrayscale, setIsGrayscale] = useState(false);

  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const [objects, setObjects] = useState<any[]>([]);
  
  const [isFinishing, setIsFinishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const canvasRef = React.useRef<any>(null);

  // Undo/Redo History Logic (V2.1)
  const [history, setHistory] = useState<any[][]>([[]]);
  const [historyStep, setHistoryStep] = useState(0);

  useEffect(() => {
    if (JSON.stringify(objects) !== JSON.stringify(history[historyStep])) {
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push([...objects]);
      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);
    }
  }, [objects]);

  const handleUndo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setObjects([...history[historyStep - 1]]);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setObjects([...history[historyStep + 1]]);
    }
  };

  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', id) 
        .single();

      if (error || !data) {
        const mockProduct = mockProducts.find(p => p.slug === id);
        if (mockProduct) {
          setProduct(mockProduct);
        }
        setLoading(false);
        return;
      }

      setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="h-12 w-12 text-brand-pink animate-spin" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Entering Studio...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const handleFinishDesign = () => {
    setIsFinishing(true);
    
    setTimeout(() => {
      addItem({
        id: `${product.id}-custom-${Date.now()}`,
        product: product,
        quantity: product.moq,
        quality_level: 'Premium',
        design_data: {
          color: selectedColor,
          text: customText,
          textColor: textColor,
          fontFamily: fontFamily,
          fontSize: fontSize,
          textPosition: textPosition,
          textRotation: textRotation,
          logoUrl: logoUrl,
          logoPosition: logoPosition,
          logoScale: logoScale,
          logoRotation: logoRotation,
          objects: objects
        },
        design_preview_url: product.images?.[0]
      });
      
      setIsFinishing(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        router.push('/products');
      }, 2000);
    }, 1500);
  };

  const handleTextUpdate = (update: { x?: number; y?: number; rotation?: number }) => {
    if (update.x !== undefined && update.y !== undefined) {
      setTextPosition({ x: update.x, y: update.y });
    }
    if (update.rotation !== undefined) {
      setTextRotation(Math.round(update.rotation));
    }
  };

  const handleLogoUpdate = (update: { x?: number; y?: number; scale?: number; rotation?: number }) => {
    if (update.x !== undefined && update.y !== undefined) {
      setLogoPosition({ x: update.x, y: update.y });
    }
    if (update.scale !== undefined) {
      setLogoScale(Math.round(update.scale * 10) / 10);
    }
    if (update.rotation !== undefined) {
      setLogoRotation(Math.round(update.rotation));
    }
  };

  const handleAddObject = (type: string, url?: string) => {
    const newObject = {
      id: `${type}-${Date.now()}`,
      type,
      url,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0
    };
    setObjects([...objects, newObject]);
  };

  const handleObjectUpdate = (id: string, update: any) => {
    setObjects(objects.map(obj => 
      obj.id === id ? { ...obj, ...update } : obj
    ));
  };

  const handleRemoveObject = (id: string) => {
    setObjects(objects.filter(obj => obj.id !== id));
  };

  const handleDownload = () => {
    canvasRef.current?.downloadDesign();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="h-20 border-b border-gray-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link 
          href={`/products/${product.slug}`}
          className="flex items-center gap-3 text-gray-500 font-bold hover:text-brand-pink transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Back to Product</span>
        </Link>

        <div className="flex flex-col items-center">
          <h1 className="text-sm font-black text-brand-dark uppercase tracking-widest">{product.name}</h1>
          <p className="text-[10px] text-brand-pink font-bold uppercase tracking-tighter italic">Pro Studio Mode</p>
        </div>

        <button 
          onClick={handleFinishDesign}
          disabled={isFinishing || isSuccess}
          className="bg-brand-dark text-white px-8 py-3 rounded-full text-sm font-bold hover:shadow-xl hover:shadow-gray-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
        >
          {isFinishing ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </>
          ) : isSuccess ? (
            <>
              <Check className="h-4 w-4 text-green-400" />
              Design Ready
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-brand-cyan" />
              Finish Design
            </>
          )}
        </button>
      </div>

      {/* Main Designer Area */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden">
        {/* Preview Canvas (Left) */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 flex flex-col items-center justify-center p-8 lg:p-20 relative">
          <div className="w-full max-w-lg">
            <DesignerCanvas 
              ref={canvasRef}
              productImage={product.images?.[0] || ''}
              selectedColor={selectedColor}
              customText={customText}
              textColor={textColor}
              fontFamily={fontFamily}
              fontSize={fontSize}
              textPosition={textPosition}
              textRotation={textRotation}
              onTextUpdate={handleTextUpdate}
              charSpacing={charSpacing}
              lineHeight={lineHeight}
              textShadow={textShadow}
              logoUrl={logoUrl}
              logoPosition={logoPosition}
              logoScale={logoScale}
              logoRotation={logoRotation}
              onLogoUpdate={handleLogoUpdate}
              brightness={brightness}
              contrast={contrast}
              isGrayscale={isGrayscale}
              isDrawingMode={isDrawingMode}
              objects={objects}
              onObjectUpdate={handleObjectUpdate}
            />
          </div>
          
          <div className="mt-12 flex items-center gap-12 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full border border-gray-100 flex items-center justify-center text-brand-pink">1</div>
              Custom Design
            </div>
            <div className="w-12 h-px bg-gray-200"></div>
            <div className="flex items-center gap-3 opacity-30">
              <div className="h-8 w-8 rounded-full border border-gray-100 flex items-center justify-center">2</div>
              Mockup Proof
            </div>
            <div className="w-12 h-px bg-gray-200"></div>
            <div className="flex items-center gap-3 opacity-30">
              <div className="h-8 w-8 rounded-full border border-gray-100 flex items-center justify-center">3</div>
              Production
            </div>
          </div>
        </div>

        {/* Design Controls (Right Sidebar) */}
        <div className="w-full lg:w-[450px] border-l border-gray-100 shadow-2xl relative z-10">
          <div className="flex-1 overflow-y-auto bg-white">
            <DesignControls 
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
              customText={customText}
              onTextChange={setCustomText}
              textColor={textColor}
              onTextColorChange={setTextColor}
              fontFamily={fontFamily}
              onFontChange={setFontFamily}
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              textPosition={textPosition}
              onTextPositionChange={setTextPosition}
              textRotation={textRotation}
              onTextRotationChange={setTextRotation}
              charSpacing={charSpacing}
              onCharSpacingChange={setCharSpacing}
              lineHeight={lineHeight}
              onLineHeightChange={setLineHeight}
              textShadow={textShadow}
              onTextShadowChange={setTextShadow}
              logoUrl={logoUrl}
              onLogoUpload={setLogoUrl}
              logoPosition={logoPosition}
              onLogoPositionChange={setLogoPosition}
              logoScale={logoScale}
              onLogoScaleChange={setLogoScale}
              logoRotation={logoRotation}
              onLogoRotationChange={setLogoRotation}
              brightness={brightness}
              onBrightnessChange={setBrightness}
              contrast={contrast}
              onContrastChange={setContrast}
              isGrayscale={isGrayscale}
              onGrayscaleChange={setIsGrayscale}
              isDrawingMode={isDrawingMode}
              onDrawingModeChange={setIsDrawingMode}
              objects={objects}
              onAddObject={handleAddObject}
              onObjectUpdate={handleObjectUpdate}
              onRemoveObject={handleRemoveObject}
              onDownload={handleDownload}
              onUndo={handleUndo}
              onRedo={handleRedo}
            />
          </div>
        </div>
      </div>

      {/* Success Modal Overlay */}
      {isSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/20 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-gray-100 flex flex-col items-center text-center max-w-sm animate-in zoom-in slide-in-from-bottom-12 duration-500">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8">
              <Check className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-black text-brand-dark mb-4 tracking-tight">Design Saved!</h2>
            <p className="text-gray-500 font-medium">Your custom creation has been added to your cart. Redirecting you to catalog...</p>
          </div>
        </div>
      )}
    </div>
  );
}
