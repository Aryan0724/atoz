"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { useCart } from '@/lib/store/useCart';
import DesignerCanvas, { CanvasObjectProperties, DesignerCanvasRef } from '@/components/design/DesignerCanvas';
import SidebarRail, { SidebarTab } from '@/components/design/layout/SidebarRail';
import SidebarPanel from '@/components/design/layout/SidebarPanel';
import TopToolbar from '@/components/design/layout/TopToolbar';
import ThreeDPreview from '@/components/design/ThreeDPreview';
import { ArrowLeft, Check, Loader2, ChevronLeft, ChevronRight, Save, Share2, ShoppingCart, HelpCircle, Info, Upload, X, Layers, Palette, Type, Image as ImageIcon, Shapes, LayoutGrid, ZoomIn, ZoomOut, Maximize, MousePointer2, Hand, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/lib/supabase/types';
import { mockProducts } from '@/lib/data/mockProducts';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

// Mobile bottom tool items
const mobileTools: { id: SidebarTab; icon: React.ReactNode; label: string }[] = [
  { id: 'templates', icon: <LayoutGrid className="h-5 w-5" />, label: 'Templates' },
  { id: 'text', icon: <Type className="h-5 w-5" />, label: 'Text' },
  { id: 'uploads', icon: <Upload className="h-5 w-5" />, label: 'Upload' },
  { id: 'graphics', icon: <Shapes className="h-5 w-5" />, label: 'Graphics' },
  { id: 'ai', icon: <Sparkles className="h-5 w-5" />, label: 'AI' },
];

function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}

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

  const [activeView, setActiveView] = useState<'front' | 'back' | 'side' | '3d'>('front');
  const [isPanning, setIsPanning] = useState(false);
  const [viewData, setViewData] = useState<{ front: any, back: any, side: any }>({ front: null, back: null, side: null });
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [activeTab, setActiveTab] = useState<SidebarTab | null>('graphics');
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
    const hasFrontDesign = (activeView === 'front' && layers.length > 0) || (activeView !== 'front' && viewData.front?.objects?.length > 0);
    const hasBackDesign = (activeView === 'back' && layers.length > 0) || (activeView !== 'back' && viewData.back?.objects?.length > 0);
    if (hasFrontDesign) base += 5;
    if (hasBackDesign) base += 5;
    setTotalPrice(base);
  }, [layers, viewData, activeView, product]);

  const handleUpdateObjectById = (id: string, props: Partial<CanvasObjectProperties>) => {
    canvasRef.current?.updateObjectById(id, props);
    handleObjectsUpdated();
  };

  const handleObjectsUpdated = () => {
    const freshLayers = canvasRef.current?.getLayers() || [];
    setLayers([...freshLayers]);
  };

  const handleViewChange = (newView: 'front' | 'back' | 'side' | '3d') => {
    if (newView === activeView) return;
    
    // Save current view data if it's a 2D view
    if (activeView !== '3d') {
      const currentJson = canvasRef.current?.getJson();
      setViewData(prev => ({ ...prev, [activeView]: currentJson }));
    }
    
    setActiveView(newView);
    
    // Load new view data if it's a 2D view
    if (newView !== '3d') {
      setTimeout(() => {
         canvasRef.current?.loadJson(viewData[newView as keyof typeof viewData] || { objects: [], background: "" });
         setActiveObject(null);
         handleObjectsUpdated();
      }, 50);
    }
  };

  const handleFinishDesign = () => {
    setIsFinishing(true);
    const finalDesignJson = canvasRef.current?.getJson();
    const finalViewData = { ...viewData, [activeView === '3d' ? 'front' : activeView]: finalDesignJson };
    
    setTimeout(() => {
      addItem({
        id: `${product!.id}-custom-${Date.now()}`,
        product: product!,
        quantity: product!.moq,
        quality_level: 'Premium',
        design_data: { color: selectedColor, canvasState: finalViewData },
        design_preview_url: product!.images?.[0]
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
    <div className="h-[100dvh] flex flex-col bg-[#f7f7f2] overflow-hidden">
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
            <button className="px-6 py-1.5 bg-brand-olive text-white text-[11px] font-black rounded-lg shadow-sm tracking-tight uppercase">Edit</button>
            <button className="px-6 py-1.5 text-gray-500 text-[11px] font-black tracking-tight uppercase">Preview</button>
          </div>
          <button className="p-2 text-gray-400 hover:text-brand-dark transition-colors"><LayoutGrid className="h-5 w-5" /></button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDE RAIL */}
        <SidebarRail activeTab={activeTab} onTabChange={(tab) => activeTab === tab ? setActiveTab(null) : setActiveTab(tab)} />

        {/* SIDEBAR PANEL */}
        <SidebarPanel 
          activeTab={activeTab}
          onClose={() => setActiveTab(null)}
          productColor={selectedColor}
          onProductColorChange={setSelectedColor}
          onAddText={(text) => canvasRef.current?.addText(text)}
          onAddImage={(url) => canvasRef.current?.addImage(url)}
          onAddShape={(type) => canvasRef.current?.addShape(type)}
          onAddIcon={(iconName) => canvasRef.current?.addIcon(iconName)}
          onLoadTemplate={(json) => canvasRef.current?.loadJson(json)}
          onUpdateObject={handleUpdateObjectById}
          layers={layers}
        />

        {/* MAIN DESIGN AREA */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {/* CONTEXTUAL TOOLBAR */}
          <div className="absolute top-0 left-0 right-0 z-20 flex justify-center p-4">
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

          {/* CANVAS STAGE */}
          <div className="flex-1 flex items-center justify-center p-8 relative">
            {isOutOfBounds && (
              <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 bg-orange-500 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl animate-bounce">
                Outside Print Area
              </div>
            )}

            {activeView === '3d' ? (
              <div className="w-full max-w-2xl aspect-square relative">
                <ThreeDPreview
                  productImage={product.images?.[2] || product.images?.[0] || ''}
                  productName={product.name}
                />
              </div>
            ) : (
              <div className="w-full max-w-2xl aspect-[4/5] flex items-center justify-center transition-all duration-700 ease-out">
                <DesignerCanvas 
                  ref={canvasRef}
                  productImage={activeView === 'front' ? (product.images?.[0] || '') : (activeView === 'back' ? (product.images?.[1] || product.images?.[0] || '') : (product.images?.[2] || product.images?.[0] || ''))}
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
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40">
               {[
                 { id: 'front', label: 'Front side' },
                 { id: 'back', label: 'Back side' },
                 { id: 'sleeve_l', label: 'Sleeve left' },
                 { id: 'sleeve_r', label: 'Sleeve right' },
                 { id: 'neck', label: 'Neck label inner' },
               ].map((v) => (
                 <button
                   key={v.id}
                   onClick={() => setActiveView(v.id as any)}
                   className={cn(
                     "px-5 py-2 rounded-full text-[11px] font-black tracking-tight leading-none transition-all",
                     activeView === v.id 
                       ? "bg-brand-olive text-white shadow-[0_4px_12px_rgba(91,91,66,0.2)]" 
                       : "bg-white text-gray-500 hover:bg-gray-50 shadow-soft border border-gray-100"
                   )}
                 >
                   {v.label}
                 </button>
               ))}
            </div>

            {/* SAVE PRODUCT BUTTON - Bottom Right */}
            <div className="absolute bottom-8 right-8 z-40">
               <button 
                 onClick={handleFinishDesign}
                 className="px-10 py-3 bg-brand-lime hover:opacity-90 text-brand-dark text-[11px] font-black uppercase tracking-widest rounded-xl shadow-[0_8px_25px_rgba(163,255,102,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
               >
                 Save product
               </button>
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE UI HANDLED SIMILARLY WITHOUT RAIL */}
      <div className="md:hidden flex-shrink-0 bg-white border-t border-gray-100 p-2 safe-area-bottom">
          <div className="flex items-center justify-around">
            {mobileTools.map(tool => (
              <button 
                key={tool.id}
                onClick={() => setMobilePanel(tool.id)}
                className="flex flex-col items-center gap-1 p-2"
              >
                {tool.icon}
                <span className="text-[10px] font-bold text-gray-500">{tool.label}</span>
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
