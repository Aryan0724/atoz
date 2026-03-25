"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { useCart } from '@/lib/store/useCart';
import DesignerCanvas, { CanvasObjectProperties, DesignerCanvasRef } from '@/components/design/DesignerCanvas';
import SidebarRail from '@/components/design/layout/SidebarRail';
import SidebarPanel from '@/components/design/layout/SidebarPanel';
import TopToolbar from '@/components/design/layout/TopToolbar';
import ThreeDPreview from '@/components/design/ThreeDPreview';
import {
  ArrowLeft, Check, Loader2, ChevronLeft, ChevronRight, Save, Share2, ShoppingCart, HelpCircle, Info, Upload, X, Layers, Palette, Type, Image as ImageIcon, Shapes, LayoutGrid, ZoomIn, ZoomOut, Maximize, MousePointer2, Hand, RotateCcw,
  Square, Sparkles, Eye, View, Move, Maximize2, Minimize2, Undo2, Redo2, Wand2, Search, AlertCircle, Plus, Clock, Monitor, Smartphone, Package, Heart
} from 'lucide-react';

export type SidebarTab = 'product' | 'uploads' | 'ai' | 'text' | 'library' | 'graphics' | 'templates' | 'shutterstock';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/lib/supabase/types';
import { mockProducts } from '@/lib/data/mockProducts';
import { cn } from '@/lib/utils';
import toast, { Toaster } from 'react-hot-toast';

// Mobile bottom tool items
const mobileTools: { id: SidebarTab; icon: React.ReactNode; label: string }[] = [
  { id: 'product', icon: <Palette className="h-5 w-5" />, label: 'Product' },
  { id: 'templates', icon: <LayoutGrid className="h-5 w-5" />, label: 'Templates' },
  { id: 'text', icon: <Type className="h-5 w-5" />, label: 'Text' },
  { id: 'graphics', icon: <Square className="h-5 w-5" />, label: 'Elements' },
  { id: 'uploads', icon: <Upload className="h-5 w-5" />, label: 'Upload' },
  { id: 'ai', icon: <Sparkles className="h-5 w-5" />, label: 'AI' },
];

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

  const [activeView, setActiveView] = useState<'front' | 'back' | 'side' | 'sleeve_l' | 'sleeve_r' | 'neck' | '3d'>('front');
  const [isPanning, setIsPanning] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [viewData, setViewData] = useState<{ front: any, back: any, side: any, sleeve_l: any, sleeve_r: any, neck: any }>({ front: null, back: null, side: null, sleeve_l: null, sleeve_r: null, neck: null });
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedQuality, setSelectedQuality] = useState<string>('Standard');
  const [designPreviews, setDesignPreviews] = useState<{ front: string; back: string }>({ front: '', back: '' });

  const [activeTab, setActiveTab] = useState<SidebarTab | null>('product');
  const [mobilePanel, setMobilePanel] = useState<SidebarTab | null>(null);
  const { addItem } = useCart();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', id) 
          .single();

        if (error || !data) throw new Error(error?.message || 'Product not found');
        setProduct(data);
        setTotalPrice(data.base_price || 0);
      } catch (err) {
        const mockProduct = mockProducts.find(p => p.slug === id);
        if (mockProduct) {
          setProduct(mockProduct);
          setTotalPrice(mockProduct.base_price || 0);
        } else {
          notFound();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    let base = product.base_price || 0;
    
    // Quality adjustments (INR values) using multipliers
    const qualityLevels = product.quality_levels || ['Standard', 'Premium', 'Luxury'];
    const qualityIndex = qualityLevels.indexOf(selectedQuality);
    const multipliers = [1, 1.2, 1.5, 2];
    const multiplier = multipliers[Math.max(0, qualityIndex) >= multipliers.length ? 0 : Math.max(0, qualityIndex)] || 1;
    
    // Apply quality multiplier to base price
    base = Math.round(base * multiplier);

    // Design adjustments
    const currentJson = canvasRef.current?.getJson();
    const currentObjects = currentJson?.objects || [];
    
    const hasFrontDesign = activeView === 'front' ? currentObjects.length > 0 : (viewData.front?.objects?.length > 0);
    const hasBackDesign = activeView === 'back' ? currentObjects.length > 0 : (viewData.back?.objects?.length > 0);
    
    if (hasFrontDesign) base += 50;
    if (hasBackDesign) base += 50;
    
    setTotalPrice(base);
  }, [layers, viewData, activeView, product, selectedQuality]);

  const handleUpdateObjectById = (id: string, props: Partial<CanvasObjectProperties>) => {
    canvasRef.current?.updateObjectById(id, props);
    handleObjectsUpdated();
  };

  const handleObjectsUpdated = () => {
    const freshLayers = canvasRef.current?.getLayers() || [];
    setLayers([...freshLayers]);
  };

  const handleViewChange = (newView: 'front' | 'back' | 'side' | 'sleeve_l' | 'sleeve_r' | 'neck' | '3d') => {
    if (newView === activeView) return;
    
    // Save current view data if it's a 2D view
    if (activeView !== '3d') {
      const currentJson = canvasRef.current?.getJson();
      setViewData(prev => ({ ...prev, [activeView]: currentJson }));
      
      // Capture design image for 3D preview (important for front/back sync)
      const currentDesign = canvasRef.current?.getDesignDataUrl() || '';
      if (activeView === 'front' || activeView === 'back') {
        console.log(`[Customizer] Captured ${activeView} design. Length: ${currentDesign.length}`);
        setDesignPreviews(prev => ({ ...prev, [activeView]: currentDesign }));
      }
    }
    
    setActiveView(newView);
    setIsPreviewMode(newView === '3d');
    
    // Load new view data if it's a 2D view
    if (newView !== '3d') {
      setTimeout(() => {
         canvasRef.current?.loadJson(viewData[newView as keyof typeof viewData] || { objects: [], background: "" });
         setActiveObject(null);
         handleObjectsUpdated();
      }, 50);
    } else {
      // If switching TO 3D, ensure we have the latest design captured for the current view
      const currentDesign = canvasRef.current?.getDesignDataUrl() || '';
      if (activeView === 'front' || activeView === 'back') {
        setDesignPreviews(prev => ({ ...prev, [activeView]: currentDesign }));
      }
    }
  };

  const handleFinishDesign = () => {
    // Check if there are any design elements
    const currentJson = canvasRef.current?.getJson();
    const currentObjects = currentJson?.objects || [];
    
    const hasFrontDesign = activeView === 'front' ? currentObjects.length > 0 : (viewData.front?.objects?.length > 0);
    const hasBackDesign = activeView === 'back' ? currentObjects.length > 0 : (viewData.back?.objects?.length > 0);
    const hasAnyDesign = hasFrontDesign || hasBackDesign;

    if (!hasAnyDesign) {
      toast.error("Please add a design element before saving!", {
        style: {
          background: '#1a1a1a',
          color: '#fff',
          fontSize: '11px',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }
      });
      return;
    }

    setIsFinishing(true);
    const finalDesignJson = canvasRef.current?.getJson();
    const finalViewData = { ...viewData, [activeView === '3d' ? 'front' : activeView]: finalDesignJson };
    const finalDesignPreview = canvasRef.current?.getDesignDataUrl() || '';
    
    setTimeout(() => {
      addItem({
        id: `${product!.id}-custom-${Date.now()}`,
        product: product!,
        quantity: product!.moq,
        quality_level: selectedQuality,
        design_data: { color: selectedColor, canvasState: finalViewData },
        design_preview_url: finalDesignPreview || product!.images?.[0]
      });
      setIsFinishing(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    }, 1500);
  };

  if (loading) return (
    <div className="h-screen bg-[#f7f7f2] flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 text-brand-olive animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5b5b42]">Loading Customizer...</p>
    </div>
  );

  if (!product) return notFound();

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#f7f7f2] overflow-hidden">
      {/* Toast notifications rendered inside the overlay */}
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      {/* TOP BAR - Matches Screenshot */}
      <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-50 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/products" className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-brand-dark transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="h-6 w-px bg-gray-100 mx-1" />
          <button className="p-2 text-gray-400 hover:text-brand-dark transition-colors"><Info className="h-5 w-5" /></button>
          <button onClick={() => canvasRef.current?.undo?.()} className="p-2 text-gray-400 hover:text-brand-dark transition-colors"><RotateCcw className="h-5 w-5 -scale-x-100" /></button>
          <button onClick={() => canvasRef.current?.redo?.()} className="p-2 text-gray-400 hover:text-brand-dark transition-colors"><RotateCcw className="h-5 w-5" /></button>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#f0f0e8] p-1 rounded-xl flex items-center">
            <button 
              onClick={() => { if (isPreviewMode) { handleViewChange('front'); } }}
              className={cn(
                "px-6 py-1.5 text-[11px] font-black rounded-lg tracking-tight uppercase transition-all",
                !isPreviewMode ? "bg-brand-olive text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >Edit</button>
            <button 
              onClick={() => { if (!isPreviewMode) { handleViewChange('3d'); } }}
              className={cn(
                "px-6 py-1.5 text-[11px] font-black rounded-lg tracking-tight uppercase transition-all",
                isPreviewMode ? "bg-brand-olive text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >Preview</button>
          </div>
          <button className="p-2 text-gray-400 hover:text-brand-dark transition-colors"><LayoutGrid className="h-5 w-5" /></button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDE RAIL - Hidden on Mobile */}
        <div className="hidden md:flex shrink-0">
          <SidebarRail activeTab={activeTab} onTabChange={(tab) => activeTab === tab ? setActiveTab(null) : setActiveTab(tab)} />
        </div>

        {/* SIDEBAR PANEL - Desktop */}
        <div className="hidden md:block">
          <SidebarPanel 
            activeTab={activeTab}
            onClose={() => setActiveTab(null)}
            productColor={selectedColor}
            onProductColorChange={setSelectedColor}
            selectedQuality={selectedQuality}
            onQualityChange={setSelectedQuality}
            onAddText={(text) => canvasRef.current?.addText(text)}
            onAddImage={(url) => canvasRef.current?.addImage(url)}
            onAddShape={(type) => canvasRef.current?.addShape(type)}
            onAddIcon={(iconName) => canvasRef.current?.addIcon(iconName)}
            onAddSvgGraphic={(svg, name) => canvasRef.current?.addSvgGraphic(svg, name)}
            onLoadTemplate={(json) => canvasRef.current?.loadJson(json)}
            onUpdateObject={handleUpdateObjectById}
            layers={layers}
            productCategory={product.category || "Apparel"}
            qualityLevels={product.quality_levels || ['Standard', 'Premium', 'Luxury']}
            basePrice={product.base_price || 0}
          />
        </div>

        {/* MAIN DESIGN AREA */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {/* CONTEXTUAL TOOLBAR */}
          <div className="absolute top-0 left-0 right-0 z-20 flex flex-wrap justify-center p-2 md:p-4 pointer-events-none">
            <div className="pointer-events-auto">
              <TopToolbar 
                activeObject={activeObject}
                onUpdateActiveObject={(props) => canvasRef.current?.updateActiveObject(props)}
                onDeleteActiveObject={() => canvasRef.current?.deleteActiveObject()}
                onBringForward={() => canvasRef.current?.bringForward()}
                onSendBackward={() => canvasRef.current?.sendBackward()}
                onRemoveBackground={() => canvasRef.current?.removeImageBackground?.() || Promise.resolve(false)}
                onDuplicate={() => canvasRef.current?.duplicateActiveObject()}
                onLockToggle={() => canvasRef.current?.toggleLock()}
                onSetTextShadow={(options) => canvasRef.current?.setTextShadow(options)}
                onSetTextOutline={(options) => canvasRef.current?.setTextOutline(options)}
              />
            </div>
          </div>

          {/* CANVAS STAGE */}
          <div className="flex-1 flex items-center justify-center pt-20 md:pt-16 pb-32 md:pb-28 px-2 md:px-8 relative overflow-hidden">
            {isOutOfBounds && (
              <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 bg-orange-500 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl animate-bounce">
                Outside Print Area
              </div>
            )}

            {activeView === '3d' ? (
              <div className="w-full max-w-2xl aspect-square relative">
                <ThreeDPreview
                  productImage={product.images?.[0] || ''}
                  productBackImage={product.images?.[1] || product.images?.[0] || ''}
                  frontDesign={designPreviews.front}
                  backDesign={designPreviews.back}
                  productName={product.name}
                  productColor={selectedColor}
                />
              </div>
            ) : (
              <div className="w-full max-w-2xl aspect-[4/5] flex items-center justify-center transition-all duration-700 ease-out">
                <DesignerCanvas 
                  ref={canvasRef}
                  productImage={activeView === 'front' ? (product.images?.[0] || '') : (activeView === 'back' ? (product.images?.[1] || product.images?.[0] || '') : (product.images?.[2] || product.images?.[0] || ''))}
                  productColor={selectedColor}
                  onObjectSelected={setActiveObject}
                  onSelectionCleared={() => setActiveObject(null)}
                  onObjectModified={setActiveObject}
                  onObjectsUpdated={handleObjectsUpdated}
                  onOutOfBoundsWarning={setIsOutOfBounds}
                  onLowQualityWarning={setIsLowQuality}
                />
              </div>
            )}

            {/* ZOOM CONTROLS - Bottom Left (Screenshot) */}
            <div className="absolute bottom-8 left-8 flex items-center gap-3 z-40 bg-white shadow-float border border-gray-100 rounded-2xl p-1.5 isolate">
              <div className="flex items-center gap-0.5">
                <button onClick={() => canvasRef.current?.zoomOut()} className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"><ZoomOut className="h-4 w-4" /></button>
                <div className="px-2 min-w-[50px] text-center"><span className="text-[11px] font-black text-brand-dark">{(Math.round((canvasRef.current as any)?.zoomLevel * 100 || 100))}%</span></div>
                <button onClick={() => canvasRef.current?.zoomIn()} className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"><ZoomIn className="h-4 w-4" /></button>
              </div>
              <div className="w-px h-6 bg-gray-100" />
              <button 
                onClick={() => {
                  const newMode = !isPanning;
                  setIsPanning(newMode);
                  canvasRef.current?.setPanning?.(newMode);
                }}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isPanning ? "bg-brand-olive text-white" : "text-gray-400 hover:text-brand-dark"
                )}
              >
                <Hand className="h-4 w-4" />
              </button>
            </div>

            {/* MULTI-VIEW SELECTOR - Center Bottom */}
            <div className="absolute bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40 overflow-x-auto max-w-[95vw] pb-2 no-scrollbar px-4">
               {[
                 { id: 'front', label: 'Front side' },
                 { id: 'back', label: 'Back side' },
                 { id: 'sleeve_l', label: 'Sleeve left' },
                 { id: 'sleeve_r', label: 'Sleeve right' },
                 { id: 'neck', label: 'Neck label inner' },
               ].filter(v => 
                 !product.supported_views || 
                 product.supported_views.includes(v.id) || 
                 (v.id === 'front' && product.supported_views.length === 0)
               ).map((v) => (
                 <button
                   key={v.id}
                   onClick={() => handleViewChange(v.id as any)}
                   className={cn(
                     "px-5 py-2 rounded-full text-[11px] font-black tracking-tight leading-none transition-all flex-shrink-0",
                     activeView === v.id 
                       ? "bg-brand-olive text-white shadow-[0_4px_12px_rgba(91,91,66,0.2)]" 
                       : "bg-white text-gray-500 hover:bg-gray-50 shadow-soft border border-gray-100"
                   )}
                 >
                   {v.label}
                 </button>
               ))}
            </div>

            {/* SAVE PRODUCT BUTTON - Bottom Right (Desktop) / Floating (Mobile) */}
            <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-40">
               <div className="flex flex-col items-end gap-1.5 md:gap-2">
                 <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-gray-100 flex flex-col items-end shadow-sm">
                    <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedQuality} Quality</span>
                    <span className="text-sm md:text-xl font-black text-brand-dark tracking-tighter">₹{totalPrice}</span>
                 </div>
                 <button 
                   onClick={handleFinishDesign}
                   disabled={isFinishing}
                   className="px-6 py-2.5 md:px-10 md:py-3 bg-brand-olive text-white text-[9px] md:text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg md:shadow-[0_8px_25px_rgba(91,91,66,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                 >
                   {isFinishing ? "Saving..." : "Save product"}
                 </button>
               </div>
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE UI */}
      <div className="md:hidden flex flex-col flex-shrink-0 bg-white border-t border-gray-100 z-50 pb-safe relative">
          {/* Mobile Panel Drawer */}
          {mobilePanel && (
            <div className="absolute inset-x-0 bottom-full bg-white z-[60] h-[60vh] shadow-[0_-8px_30px_rgba(0,0,0,0.1)] rounded-t-3xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-full duration-300">
               <div className="flex-1 overflow-y-auto w-full flex flex-col relative bg-white">
                 <SidebarPanel 
                   activeTab={mobilePanel}
                   onClose={() => setMobilePanel(null)}
                   productColor={selectedColor}
                   onProductColorChange={setSelectedColor}
                   selectedQuality={selectedQuality}
                   onQualityChange={setSelectedQuality}
                   onAddText={(text) => canvasRef.current?.addText(text)}
                   onAddImage={(url) => canvasRef.current?.addImage(url)}
                   onAddShape={(type) => canvasRef.current?.addShape(type)}
                   onAddIcon={(iconName) => canvasRef.current?.addIcon(iconName)}
                   onAddSvgGraphic={(svg, name) => canvasRef.current?.addSvgGraphic(svg, name)}
                   onLoadTemplate={(json) => canvasRef.current?.loadJson(json)}
                   onUpdateObject={handleUpdateObjectById}
                   layers={layers}
                   productCategory={product.category || "Apparel"}
                   qualityLevels={product.quality_levels || ['Standard', 'Premium', 'Luxury']}
                   basePrice={product.base_price || 0}
                 />
               </div>
            </div>
          )}

          <div className="flex items-center justify-between px-1 py-2 bg-white relative z-50 overflow-x-auto no-scrollbar">
            {mobileTools.map(tool => (
              <button 
                key={tool.id}
                onClick={() => setMobilePanel(mobilePanel === tool.id ? null : tool.id)}
                className={cn(
                  "flex flex-col items-center gap-1 p-1.5 min-w-[60px] rounded-xl transition-all",
                  mobilePanel === tool.id ? "text-brand-pink bg-pink-50/50 scale-105" : "text-gray-500"
                )}
              >
                {tool.icon}
                <span className="text-[10px] font-bold tracking-tight">{tool.label}</span>
              </button>
            ))}
          </div>
      </div>

      {/* SUCCESS MODAL */}
      {isSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[40px] shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-[#f0f0e8] rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-brand-olive" />
            </div>
            <h2 className="text-2xl font-black text-brand-dark tracking-tighter">Design Saved</h2>
            <p className="text-gray-500 text-sm">Your product is ready in the cart.</p>
          </div>
        </div>
      )}
    </div>
  );
}
