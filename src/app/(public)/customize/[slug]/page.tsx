"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { useCart } from '@/lib/store/useCart';
import DesignerCanvas, { CanvasObjectProperties, DesignerCanvasRef } from '@/components/design/DesignerCanvas';
import DesignControls from '@/components/design/DesignControls';
import { ArrowLeft, Sparkles, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/lib/supabase/types';
import { mockProducts } from '@/lib/data/mockProducts';
import { cn } from '@/lib/utils';

export default function CustomizePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  
  const canvasRef = useRef<DesignerCanvasRef>(null);
  const [activeObject, setActiveObject] = useState<CanvasObjectProperties | null>(null);
  const [layers, setLayers] = useState<any[]>([]);
  const [isOutOfBounds, setIsOutOfBounds] = useState(false);
  const [isLowQuality, setIsLowQuality] = useState(false);

  const [isFinishing, setIsFinishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [activeView, setActiveView] = useState<'front' | 'back'>('front');
  const [viewData, setViewData] = useState<{ front: any, back: any }>({ front: null, back: null });
  const [showMockup, setShowMockup] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Undo/Redo State
  const [history, setHistory] = useState<any[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const isHistoryUpdate = useRef(false);

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
      setTotalPrice(data.base_price || 0);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // Live Price Calculation
  useEffect(() => {
    if (!product) return;
    let base = product.base_price || 0;
    
    // Check if objects exist on front/back
    const hasFrontDesign = (activeView === 'front' && layers.length > 0) || (activeView !== 'front' && viewData.front?.objects?.length > 0);
    const hasBackDesign = (activeView === 'back' && layers.length > 0) || (activeView !== 'back' && viewData.back?.objects?.length > 0);
    
    if (hasFrontDesign) base += 5; // $5 for front printing
    if (hasBackDesign) base += 5; // $5 for back printing
    
    setTotalPrice(base);
  }, [layers, viewData, activeView, product]);

  // Initial History Save
  useEffect(() => {
    if (!loading && history.length === 0) {
      setTimeout(() => {
        handleHistoryChange();
      }, 500);
    }
  }, [loading]);

  const handleHistoryChange = () => {
    if (isHistoryUpdate.current) return;
    const json = canvasRef.current?.getJson();
    if (!json) return;
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyStep + 1);
      newHistory.push(json);
      if (newHistory.length > 30) newHistory.shift();
      return newHistory;
    });
    setHistoryStep(prev => Math.min(prev + 1, 29));
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      isHistoryUpdate.current = true;
      const prevStep = historyStep - 1;
      setHistoryStep(prevStep);
      canvasRef.current?.loadJson(history[prevStep]);
      
      setTimeout(() => {
        isHistoryUpdate.current = false;
        setActiveObject(null);
        handleObjectsUpdated();
      }, 50);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      isHistoryUpdate.current = true;
      const nextStep = historyStep + 1;
      setHistoryStep(nextStep);
      canvasRef.current?.loadJson(history[nextStep]);
      
      setTimeout(() => {
        isHistoryUpdate.current = false;
        setActiveObject(null);
        handleObjectsUpdated();
      }, 50);
    }
  };

  const handleObjectsUpdated = () => {
    const freshLayers = canvasRef.current?.getLayers() || [];
    setLayers(freshLayers);
  };

  const handleViewChange = (newView: 'front' | 'back') => {
    if (newView === activeView) return;
    
    // Save current view state
    const currentJson = canvasRef.current?.getJson();
    setViewData(prev => ({ ...prev, [activeView]: currentJson }));
    
    // Switch to new view state
    setActiveView(newView);
    setHistory([]);
    setHistoryStep(-1);
    
    setTimeout(() => {
       canvasRef.current?.loadJson(viewData[newView] || { objects: [], background: "" });
       setActiveObject(null);
       handleObjectsUpdated();
    }, 50);
  };

  const handleFinishDesign = () => {
    setIsFinishing(true);
    
    // Save the final JSON design object for manufacturing / rendering later
    const finalDesignJson = canvasRef.current?.getJson();
    const finalViewData = { ...viewData, [activeView]: finalDesignJson };
    
    setTimeout(() => {
      addItem({
        id: `${product!.id}-custom-${Date.now()}`,
        product: product!,
        quantity: product!.moq,
        quality_level: 'Premium',
        design_data: {
          color: selectedColor,
          canvasState: finalViewData
        },
        design_preview_url: product!.images?.[0]
      });
      
      setIsFinishing(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        // The cart drawer is automatically opened by the `addItem` Zustand action!
      }, 2000);
    }, 1500);
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="h-12 w-12 text-brand-pink animate-spin" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Entering Studio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white overflow-hidden max-h-screen">
      {/* Header */}
      <div className="h-20 shrink-0 border-b border-gray-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md relative z-50">
        <Link 
          href={`/products/${product.slug}`}
          className="flex items-center gap-3 text-gray-500 font-bold hover:text-brand-pink transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Back</span>
        </Link>

        <div className="flex flex-col items-center">
          <h1 className="text-sm font-black text-brand-dark uppercase tracking-widest">{product.name}</h1>
          <p className="text-[10px] text-brand-pink font-bold uppercase tracking-tighter italic">
            Pro Studio Mode • ${totalPrice.toFixed(2)}
          </p>
        </div>

        <button 
          onClick={handleFinishDesign}
          disabled={isFinishing || isSuccess}
          className="bg-brand-dark text-white px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-bold hover:shadow-xl hover:shadow-gray-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
        >
          {isFinishing ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </>
          ) : isSuccess ? (
            <>
              <Check className="h-4 w-4 text-green-400" />
              Ready
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
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Preview Canvas (Top/Left) */}
        <div className="flex-1 min-h-[55vh] lg:min-h-0 overflow-y-auto bg-gray-50/50 flex flex-col items-center justify-center p-4 lg:p-12 relative w-full lg:h-full">

          {/* Warnings Banner */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 flex flex-col gap-2 w-full max-w-sm pointer-events-none transition-all">
            {isOutOfBounds && (
              <div className="bg-orange-500/95 backdrop-blur-sm text-white px-5 py-2.5 flex items-center justify-center text-[11px] font-black tracking-wide uppercase rounded-full shadow-2xl border border-orange-400/50 animate-in slide-in-from-top-4 fade-in">
                ⚠️ Outside Safe Print Zone
              </div>
            )}
            {isLowQuality && (
              <div className="bg-red-500/95 backdrop-blur-sm text-white px-5 py-2.5 flex items-center justify-center text-[11px] font-black tracking-wide uppercase rounded-full shadow-2xl border border-red-400/50 animate-in slide-in-from-top-4 fade-in">
                ⚠️ Image DPI Too Low
              </div>
            )}
          </div>

          <div className="flex bg-white rounded-full p-1 shadow-sm border border-gray-100 mb-6 z-30">
            <button
              onClick={() => handleViewChange('front')}
              className={cn(
                "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                activeView === 'front' ? "bg-brand-dark text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              Front
            </button>
            <button
              onClick={() => handleViewChange('back')}
              className={cn(
                "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                activeView === 'back' ? "bg-brand-dark text-white shadow-md" : "text-gray-500 hover:bg-gray-50",
                !product.images?.[1] && "opacity-50 cursor-not-allowed hidden"
              )}
            >
              Back
            </button>
          </div>

          <button 
             onClick={() => setShowMockup(!showMockup)}
             className={cn(
               "absolute top-6 right-6 z-40 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all shadow-sm",
               showMockup ? "bg-brand-pink text-white border-brand-pink shadow-brand-pink/20" : "bg-white text-gray-400 border-gray-200 hover:border-brand-pink/30 hover:text-brand-pink"
             )}
          >
             <Sparkles className="h-4 w-4" />
             {showMockup ? "Edit View" : "Realistic Preview"}
          </button>

          <div className="w-full max-w-lg h-full max-h-[70vh] flex items-center justify-center relative">
            
            {showMockup && (
              <div className="absolute inset-0 pointer-events-none z-10 mix-blend-multiply opacity-50 bg-black/10 rounded-2xl" />
            )}

            <DesignerCanvas 
              ref={canvasRef}
              productImage={showMockup 
                ? (product.images?.[2] || product.images?.[0] || '') 
                : (activeView === 'front' ? (product.images?.[0] || '') : (product.images?.[1] || product.images?.[0] || ''))
              }
              onObjectSelected={setActiveObject}
              onSelectionCleared={() => setActiveObject(null)}
              onObjectModified={setActiveObject}
              onObjectsUpdated={handleObjectsUpdated}
              onHistoryChange={handleHistoryChange}
              onOutOfBoundsWarning={setIsOutOfBounds}
              onLowQualityWarning={setIsLowQuality}
            />
          </div>
          
          <div className="hidden lg:flex mt-12 items-center gap-12 text-gray-400 font-bold text-[10px] uppercase tracking-widest shrink-0">
            <div className="flex items-center gap-3 text-brand-pink">
              <div className="h-6 w-6 rounded-full border border-brand-pink flex items-center justify-center shadow-sm bg-white">1</div>
              Freeform Canvas
            </div>
            <div className="w-12 h-px bg-gray-200"></div>
            <div className="flex items-center gap-3 opacity-40">
              <div className="h-6 w-6 rounded-full border border-gray-200 flex items-center justify-center">2</div>
              Layer Management
            </div>
          </div>
        </div>

        {/* Design Controls (Right/Bottom) */}
        <div className="w-full lg:w-[450px] flex-1 lg:flex-none border-t lg:border-t-0 lg:border-l border-gray-100 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)] lg:shadow-2xl relative z-40 bg-white overflow-hidden flex flex-col">
          <DesignControls 
            productColor={selectedColor}
            onProductColorChange={setSelectedColor}
            
            activeObject={activeObject}
            onUpdateActiveObject={(props) => canvasRef.current?.updateActiveObject(props)}
            
            onAddText={(text) => canvasRef.current?.addText(text)}
            onAddImage={(url) => canvasRef.current?.addImage(url)}
            onAddShape={(type) => canvasRef.current?.addShape(type)}
            onUpdateObjectById={(id, props) => canvasRef.current?.updateObjectById(id, props)}
            
            onDeleteActiveObject={() => canvasRef.current?.deleteActiveObject()}
            onBringForward={() => canvasRef.current?.bringForward()}
            onSendBackward={() => canvasRef.current?.sendBackward()}
            
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyStep > 0}
            canRedo={historyStep < history.length - 1}
            
            onDownload={() => canvasRef.current?.downloadDesign()}
            onRemoveBackground={async () => {
              if (canvasRef.current && canvasRef.current.removeImageBackground) {
                return await canvasRef.current.removeImageBackground();
              }
              return false;
            }}
            layers={layers}
          />
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
            <p className="text-gray-500 font-medium leading-relaxed">Your professional studio creation has been added to your cart. Redirecting you to catalog...</p>
          </div>
        </div>
      )}
    </div>
  );
}
