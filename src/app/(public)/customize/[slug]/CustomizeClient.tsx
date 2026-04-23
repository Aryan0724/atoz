"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/store/useCart';
import { supabase } from '@/lib/supabase/client';
import DesignerFactory from '@/components/design/DesignerFactory';
import { CanvasObjectProperties, DesignerCanvasRef } from '@/types/canvas';
import SidebarRail, { SidebarTab } from '@/components/design/layout/SidebarRail';
import SidebarPanel from '@/components/design/layout/SidebarPanel';
import TopToolbar from '@/components/design/layout/TopToolbar';
import FloatingToolbar from '@/components/design/layout/FloatingToolbar';
import ThreeDPreview from '@/components/design/ThreeDPreview';
import { canvasTemplates } from '@/lib/data/canvasTemplates';
import {
  ArrowLeft, Check, Loader2, Plus, RotateCcw, LayoutGrid, ZoomOut, ZoomIn, Hand, Info, Palette, Type, Square, Upload, Sparkles, Download, Shuffle, Minus
} from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/lib/supabase/types';
import { cn, dataURLToBlob } from '@/lib/utils';
import { uploadFile } from '@/lib/supabase/storage';
import { toast } from 'sonner';



interface CustomizeClientProps {
  product: Product;
}

const mobileTools: { id: SidebarTab; icon: React.ReactNode; label: string }[] = [
  { id: 'product', icon: <Palette className="h-5 w-5" />, label: 'Product' },
  { id: 'text', icon: <Type className="h-5 w-5" />, label: 'Text' },
  { id: 'graphics', icon: <Square className="h-5 w-5" />, label: 'Elements' },
  { id: 'iconify', icon: <Sparkles className="h-5 w-5" />, label: 'Icons' },
  { id: 'uploads', icon: <Upload className="h-5 w-5" />, label: 'Upload' },
];

export default function CustomizeClient({ product }: CustomizeClientProps) {
  const router = useRouter();
  const setOpen = useCart((state) => state.setOpen);
  
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const canvasRef = useRef<DesignerCanvasRef>(null);
  const [activeObject, setActiveObject] = useState<CanvasObjectProperties | null>(null);
  const [layers, setLayers] = useState<any[]>([]);
  const [isOutOfBounds, setIsOutOfBounds] = useState(false);
  const [isLowQuality, setIsLowQuality] = useState(false);

  const [isFinishing, setIsFinishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [activeView, setActiveView] = useState<'front' | 'back' | 'left' | 'right' | '3d'>('front');
  const [isPanning, setIsPanning] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [viewData, setViewData] = useState<{ front: any, back: any, left: any, right: any }>({ front: null, back: null, left: null, right: null });
  const [totalPrice, setTotalPrice] = useState<number>(product.base_price || 0);
  const [unitPrice, setUnitPrice] = useState<number>(product.base_price || 0);
  const [quantity, setQuantity] = useState<number>(product.moq || 1);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [selectedQuality, setSelectedQuality] = useState<string>('Standard');
  const [qualityPrices, setQualityPrices] = useState<Record<string, number>>({});
  
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [designPreviews, setDesignPreviews] = useState<{ front: string; back: string }>({ front: '', back: '' });

  const [activeTab, setActiveTab] = useState<SidebarTab | null>('product');
  const [mobilePanel, setMobilePanel] = useState<SidebarTab | null>(null);
  
  // VDP (Variable Data Printing) State
  const [vdpData, setVdpData] = useState<{ headers: string[], rows: any[] } | null>(null);
  const [vdpRowIndex, setVdpRowIndex] = useState(0);

  // Multipage State
  const [pageData, setPageData] = useState<any[]>(Array(12).fill(null));
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const { addItem } = useCart();

  useEffect(() => {
    let base = product.base_price || 0;
    
    // Quality adjustments
    const qualityLevels = product.quality_levels || ['Standard', 'Premium', 'Luxury'];
    const qualityIndex = qualityLevels.indexOf(selectedQuality);
    const multipliers = [1, 1.2, 1.5, 2];
    const multiplier = multipliers[Math.max(0, qualityIndex)] || 1;
    
    base = Math.round(base * multiplier);

    // Calculate quality price bonuses for UI display
    const qPrices: Record<string, number> = {};
    const baseAmount = product.base_price || 0;
    
    qualityLevels.forEach((q, idx) => {
       // Sync with catalog by checking product.quality_prices first
       const dbBonus = (product as any).quality_prices?.[q];
       if (dbBonus !== undefined) {
         qPrices[q] = dbBonus;
       } else {
         const multipliers = [1, 1.2, 1.5, 2];
         const m = multipliers[idx] || 1;
         qPrices[q] = Math.round(baseAmount * m) - baseAmount;
       }
    });
    setQualityPrices(qPrices);

    // Design adjustments
    const hasFrontDesign = activeView === 'front' ? layers.length > 0 : (viewData.front?.objects?.length > 0);
    const hasBackDesign = activeView === 'back' ? layers.length > 0 : (viewData.back?.objects?.length > 0);
    
    if (hasFrontDesign) base += 50;
    if (hasBackDesign) base += 50;

    // 1. Calculate Bulk Discount (Dynamic)
    let bulkDiscount = 0;
    if (product.bulk_discount_rules && Array.isArray(product.bulk_discount_rules)) {
      const sortedRules = [...product.bulk_discount_rules].sort((a, b) => b.quantity - a.quantity);
      for (const rule of sortedRules) {
        if (quantity >= rule.quantity) {
          bulkDiscount = rule.discount;
          break;
        }
      }
    }
    
    // Calculate total if only bulk discount is applied
    const totalWithBulk = Math.round(base * (1 - bulkDiscount / 100)) * quantity;

    // 2. Calculate Promo Code Discount
    let totalWithCoupon = base * quantity;
    if (appliedCoupon) {
      if (appliedCoupon.discount_type === 'percentage') {
        totalWithCoupon = Math.round(base * (1 - appliedCoupon.discount_value / 100)) * quantity;
      } else {
        totalWithCoupon = Math.max(0, (base * quantity) - appliedCoupon.discount_value);
      }
      
      // Enforce Minimum Order Value for Coupon based on Base Total (before discounts)
      if ((base * quantity) < appliedCoupon.min_order_amount) {
        totalWithCoupon = Infinity; // Invalidates coupon for this calculation
      }
    } else {
      totalWithCoupon = Infinity;
    }

    // 3. Highest Wins Logic
    if (appliedCoupon && totalWithCoupon < totalWithBulk) {
       setTotalPrice(totalWithCoupon);
       setUnitPrice(Math.round(totalWithCoupon / quantity));
       if (appliedCoupon.discount_type === 'percentage') {
          setDiscountPercent(appliedCoupon.discount_value);
          setDiscountValue(0);
       } else {
          setDiscountPercent(0);
          setDiscountValue(appliedCoupon.discount_value);
       }
    } else {
       setTotalPrice(totalWithBulk);
       setUnitPrice(Math.round(totalWithBulk / quantity));
       setDiscountPercent(bulkDiscount);
       setDiscountValue(0);
    }
  }, [layers, viewData, activeView, product, selectedQuality, quantity, appliedCoupon]);

  // Deep link support for "Import & Edit"
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autoOpen') === 'uploads') {
      setActiveTab('uploads');
      setMobilePanel('uploads');
    }
  }, []);

  const validateCoupon = async () => {
    if (!promoCodeInput.trim()) return;
    setValidatingCoupon(true);
    setCouponMessage(null);
    setAppliedCoupon(null);

    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', promoCodeInput.toUpperCase().trim())
        .single();

      if (error || !data) {
        setCouponMessage({ type: 'error', text: 'Invalid promo code' });
        return;
      }

      if (!data.is_active) {
        setCouponMessage({ type: 'error', text: 'Promo code is inactive' });
        return;
      }

      if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
        setCouponMessage({ type: 'error', text: 'Promo code expired' });
        return;
      }

      if (totalPrice < data.min_order_amount) {
        setCouponMessage({ type: 'error', text: `Min order is ₹${data.min_order_amount}` });
        return;
      }

      if (data.applicable_product_ids && data.applicable_product_ids.length > 0) {
        if (!data.applicable_product_ids.includes(product.id)) {
          setCouponMessage({ type: 'error', text: 'Not applicable to this product' });
          return;
        }
      }

      setAppliedCoupon(data);
      setCouponMessage({ type: 'success', text: 'Applied!' });
    } catch (err) {
      setCouponMessage({ type: 'error', text: 'Validation failed' });
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleUpdateObjectById = (id: string, props: Partial<CanvasObjectProperties>) => {
    canvasRef.current?.updateObjectById(id, props);
    handleObjectsUpdated();
  };

  const handleObjectsUpdated = () => {
    const freshLayers = canvasRef.current?.getLayers() || [];
    setLayers([...freshLayers]);
  };

  const handleViewChange = (newView: 'front' | 'back' | 'left' | 'right' | '3d') => {
    if (newView === activeView) return;
    
    if (activeView !== '3d') {
      const currentJson = canvasRef.current?.getJson();
      setViewData(prev => ({ ...prev, [activeView]: currentJson }));
      
      const currentDesign = canvasRef.current?.getDesignDataUrl() || '';
      if (activeView === 'front' || activeView === 'back') {
        setDesignPreviews(prev => ({ ...prev, [activeView]: currentDesign }));
      }
    }
    
    setActiveView(newView);
    setIsPreviewMode(newView === '3d');
    
    if (newView !== '3d') {
      setTimeout(() => {
         canvasRef.current?.loadJson(viewData[newView as keyof typeof viewData] || { objects: [], background: "" });
         setActiveObject(null);
         handleObjectsUpdated();
      }, 50);
    } else {
      const currentDesign = canvasRef.current?.getDesignDataUrl() || '';
      if (activeView === 'front' || activeView === 'back') {
        setDesignPreviews(prev => ({ ...prev, [activeView]: currentDesign }));
      }
    }
  };

  const handleFinishDesign = async () => {
    const currentJson = canvasRef.current?.getJson();
    const hasAnyDesign = (currentJson?.objects?.length || 0) > 0 || Object.values(viewData).some((v: any) => v?.objects?.length > 0);

    if (!hasAnyDesign) {
      toast.error("Please add a design element before saving!");
      return;
    }

    // --- OPTIMISTIC UI TRANSITION ---
    // Start the heavy work in the background but show success immediately
    setIsFinishing(true);
    
    try {
      const finalDesignJson = canvasRef.current?.getJson();
      const finalViewData = { ...viewData, [activeView === '3d' ? 'front' : activeView]: finalDesignJson };
      const dataUrl = canvasRef.current?.getDesignDataUrl() || '';
      
      // OPTIMISTIC ADD: Add to cart with dataUrl placeholder first
      const tempId = `${product.id}-custom-${Date.now()}`;
      addItem({
        id: tempId,
        product: product,
        quantity: quantity,
        quality_level: selectedQuality,
        design_data: { 
          color: selectedColor, 
          canvasState: finalViewData, 
          vdpData: vdpData,
          pageData: (product as any).design_mode === 'multipage' ? pageData : undefined 
        },
        design_preview_url: dataUrl, // Instant placeholder
        unitPrice: unitPrice
      });

      // Show success instantly
      setIsFinishing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setOpen(true);
      }, 800);

      // BACKGROUND UPLOAD: Sync the high-res image to Supabase without blocking the UI
      if (dataUrl) {
         const syncHighRes = async () => {
           try {
              const blob = dataURLToBlob(dataUrl);
              const { data: { user } } = await supabase.auth.getUser();
              const userId = user?.id || 'guest';
              const fileName = `${userId}/${product.slug}-${Date.now()}.png`;
              
              const publicUrl = await uploadFile('designs', fileName, new File([blob], fileName, { type: 'image/png' }));
              
              // We could potentially update the cart item here if needed, 
              // but the placeholder works for the checkout preview perfectly.
              console.log("High-res design synced to cloud:", publicUrl);
           } catch (err) {
              console.error("Background sync failed:", err);
           }
         };
         syncHighRes();
      }
    } catch (err) {
      console.error("Failed to finish design:", err);
      toast.error("Process interrupted. Please try again.");
      setIsFinishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#f7f7f2] overflow-hidden">
      <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-50 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/products" className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-brand-dark transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="h-6 w-px bg-gray-100 mx-1" />
          <button className="p-2 text-gray-400 hover:text-brand-dark transition-colors"><Info className="h-5 w-5" /></button>
          <button onClick={() => canvasRef.current?.undo?.()} className="p-2 text-gray-400 hover:text-brand-dark transition-colors"><RotateCcw className="h-5 w-5 -scale-x-100" /></button>
          <button onClick={() => canvasRef.current?.redo?.()} className="p-2 text-gray-400 hover:text-brand-dark transition-colors"><RotateCcw className="h-5 w-5" /></button>
          <div className="h-6 w-px bg-gray-100 mx-1" />
          <button 
            onClick={() => {
              const random = canvasTemplates[Math.floor(Math.random() * canvasTemplates.length)];
              canvasRef.current?.loadJson(random.json);
              import('sonner').then(({ toast }) => toast.success(`✨ "${random.name}" applied!`));
            }}
            className="flex items-center gap-2 px-4 py-1.5 bg-brand-pink/10 hover:bg-brand-pink text-brand-pink hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic"
          >
            <Shuffle className="h-3.5 w-3.5" />
            Surprise Me
          </button>
          <div className="h-6 w-px bg-gray-100 mx-1" />
          <button 
            onClick={() => canvasRef.current?.downloadDesign()}
            className="flex items-center gap-2 px-4 py-1.5 bg-gray-50 hover:bg-brand-pink hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic"
          >
            <Download className="h-3.5 w-3.5" />
            Download PNG
          </button>
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
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="hidden md:flex shrink-0">
          <SidebarRail 
            activeTab={activeTab} 
            onTabChange={(tab) => activeTab === tab ? setActiveTab(null) : setActiveTab(tab)} 
            designMode={(product as any).design_mode}
          />
        </div>

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
            activeObject={activeObject}
            onSelectionCleared={() => setActiveObject(null)}
            layers={layers}
            productCategory={product.category || "Apparel"}
            qualityLevels={product.quality_levels || ['Standard', 'Premium', 'Luxury']}
            basePrice={product.base_price || 0}
            productId={product.id}
            onLockAllObjects={(lock) => canvasRef.current?.lockAllObjects(lock)}
            qualityPrices={qualityPrices}
            colorVariants={(product as any).color_variants || []}
            designMode={(product as any).design_mode}
            vdpData={vdpData}
            vdpRowIndex={vdpRowIndex}
            onVdpDataLoaded={(headers, rows) => setVdpData({ headers, rows })}
            onVdpRowChange={setVdpRowIndex}
            onVdpClear={() => { setVdpData(null); setVdpRowIndex(0); }}
            pageData={pageData}
            currentPageIndex={currentPageIndex}
            onPageChange={(newIndex) => {
              if (canvasRef.current) {
                 const currentJson = canvasRef.current.getJson();
                 const newPages = [...pageData];
                 newPages[currentPageIndex] = currentJson;
                 setPageData(newPages);
                 canvasRef.current.loadJson(newPages[newIndex] || { objects: [], background: "" });
              }
              setCurrentPageIndex(newIndex);
            }}
          />
        </div>

        <main className="flex-1 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 z-20 flex flex-wrap justify-center p-2 md:p-4 pointer-events-none">
            <div className="pointer-events-auto">
              <TopToolbar 
                activeObject={activeObject}
                onUpdateActiveObject={(props) => canvasRef.current?.updateActiveObject(props)}
                onDeleteActiveObject={() => canvasRef.current?.deleteActiveObject()}
                onBringForward={() => canvasRef.current?.bringForward()}
                onSendBackward={() => canvasRef.current?.sendBackward()}
                onDuplicate={() => canvasRef.current?.duplicateActiveObject()}
                onLockToggle={() => canvasRef.current?.toggleLock()}
                onSetTextShadow={(options) => canvasRef.current?.setTextShadow(options)}
                onSetTextOutline={(options) => canvasRef.current?.setTextOutline(options)}
                onAlign={(pos) => canvasRef.current?.alignActiveObject(pos)}
              />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center pt-16 md:pt-16 pb-16 md:pb-28 px-4 md:px-8 relative overflow-hidden">
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
              <div className="w-full max-w-2xl flex items-center justify-center transition-all duration-700 ease-out">
                <DesignerFactory 
                  ref={canvasRef}
                  productImage={(() => {
                    const variants = (product as any).color_variants || [];
                    const exactMatch = variants.find((v: any) => v.hex.toLowerCase() === selectedColor.toLowerCase());
                    
                    let bgImages: string[] = [];
                    // Ensure the wireframe array actually has strings inside it
                    if (exactMatch?.wireframe_images && exactMatch.wireframe_images.some((img: string) => img)) {
                      bgImages = exactMatch.wireframe_images;
                    } else if (exactMatch?.image_url) {
                      // Legacy schema fallback
                      bgImages = [exactMatch.image_url, exactMatch.image_url, exactMatch.image_url, exactMatch.image_url];
                    } else {
                      const wireframes = (product as any).wireframe_images || [];
                      bgImages = wireframes.some((img: string) => img)
                        ? wireframes
                        : ((product as any).template_images?.length > 0 ? (product as any).template_images : product.images || []);
                    }
                    
                    if (activeView === 'front' && bgImages?.[0]) return bgImages[0];
                    if (activeView === 'back' && (bgImages?.[1] || bgImages?.[0])) return bgImages[1] || bgImages[0];
                    if (activeView === 'left' && (bgImages?.[2] || bgImages?.[0])) return bgImages[2] || bgImages[0];
                    if (activeView === 'right' && (bgImages?.[3] || bgImages?.[0])) return bgImages[3] || bgImages[0];
                    return bgImages?.[0] || '';
                  })()}
                  disableTinting={((product as any).color_variants?.length > 0 && (product as any).color_variants.some((v: any) => v.hex.toLowerCase() === selectedColor.toLowerCase()))}
                  productColor={selectedColor}
                  onObjectSelected={setActiveObject}
                  onSelectionCleared={() => setActiveObject(null)}
                  onObjectModified={setActiveObject}
                  onObjectsUpdated={handleObjectsUpdated}
                  onOutOfBoundsWarning={setIsOutOfBounds}
                  onLowQualityWarning={setIsLowQuality}
                  designArea={(product as any).design_areas?.[activeView]}
                  designMode={(product as any).design_mode}
                  designConfig={(product as any).design_config}
                  vdpData={vdpData}
                  vdpRowIndex={vdpRowIndex}
                />
              </div>
            )}

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

            <div className="absolute bottom-16 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40 overflow-x-auto w-full md:w-auto px-4 justify-start md:justify-center no-scrollbar pb-2">
               {[
                 { id: 'front', label: 'Front side' },
                 { id: 'back', label: 'Back side' },
                 { id: 'left', label: 'Left side' },
                 { id: 'right', label: 'Right side' },
               ].filter(v => {
                  // Smart Filtering: Only show view if an image exists for it in the current color
                  const variants = (product as any).color_variants || [];
                  const exactMatch = variants.find((ev: any) => ev.hex.toLowerCase() === selectedColor.toLowerCase());
                  
                  let bgImages: string[] = [];
                  if (exactMatch?.wireframe_images && exactMatch.wireframe_images.some((img: string) => img)) {
                    bgImages = exactMatch.wireframe_images;
                  } else if (exactMatch?.image_url) {
                    bgImages = [exactMatch.image_url, exactMatch.image_url, exactMatch.image_url, exactMatch.image_url];
                  } else {
                    const wireframes = (product as any).wireframe_images || [];
                    bgImages = wireframes.some((img: string) => img)
                      ? wireframes
                      : ((product as any).template_images?.length > 0 ? (product as any).template_images : product.images || []);
                  }

                  const viewIdx = v.id === 'front' ? 0 : v.id === 'back' ? 1 : v.id === 'left' ? 2 : 3;
                  return !!bgImages[viewIdx];
                }).map((v) => (
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

            <div className="absolute bottom-2 right-4 md:bottom-8 md:right-8 z-40 scale-75 md:scale-100 origin-bottom-right">
               <div className="flex flex-col items-end gap-1.5 md:gap-2">
                 <div className="bg-white/95 backdrop-blur-2xl px-6 py-5 rounded-[32px] border border-white/40 shadow-2xl shadow-brand-dark/5 ring-1 ring-black/5 w-80">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity</span>
                       <div className="flex items-center gap-3 bg-[#f7f7f2] rounded-full p-1 border border-gray-100">
                         <button 
                           onClick={() => setQuantity(q => Math.max((product.moq || 1), q - 1))}
                           className="w-6 h-6 rounded-full flex items-center justify-center bg-white text-gray-500 hover:text-brand-dark hover:shadow-sm transition-all"
                         >
                           <Minus className="w-3 h-3" />
                         </button>
                          <input 
                            type="number"
                            value={quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setQuantity(isNaN(val) ? 0 : Math.max(0, val));
                            }}
                            onBlur={() => setQuantity(q => Math.max((product.moq || 1), q))}
                            className="w-12 bg-transparent text-xs font-black text-brand-dark text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                         <button 
                           onClick={() => setQuantity(q => q + 1)}
                           className="w-6 h-6 rounded-full flex items-center justify-center bg-white text-gray-500 hover:text-brand-dark hover:shadow-sm transition-all"
                         >
                           <Plus className="w-3 h-3" />
                         </button>
                       </div>
                    </div>

                    <div className="border-b border-gray-100 pb-3 mb-3">
                       <div className="flex gap-2">
                         <input
                           type="text"
                           placeholder="Promo Code"
                           value={promoCodeInput}
                           onChange={(e) => setPromoCodeInput(e.target.value)}
                           className="flex-1 bg-gray-50 rounded-xl px-3 py-2 text-xs font-bold text-brand-dark uppercase placeholder:normal-case outline-none focus:bg-white focus:border focus:border-brand-pink/20 transition-all border border-transparent"
                         />
                         <button
                           onClick={validateCoupon}
                           disabled={validatingCoupon || !promoCodeInput}
                           className="bg-brand-dark text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-pink transition-all disabled:opacity-50"
                         >
                           {validatingCoupon ? '...' : 'Apply'}
                         </button>
                       </div>
                       {couponMessage && (
                         <div className={cn("text-[9px] font-bold tracking-widest uppercase mt-2 pl-1", couponMessage.type === 'success' ? 'text-brand-cyan' : 'text-red-500')}>
                           {couponMessage.text}
                         </div>
                       )}
                    </div>

                    <div className="flex items-end justify-between">
                       <div className="flex flex-col">
                         <span className="text-[9px] font-black text-brand-pink/50 uppercase tracking-[0.25em] mb-0.5">
                           {selectedQuality} • {discountPercent > 0 ? `${discountPercent}% OFF` : (discountValue > 0 ? `₹${discountValue} OFF` : 'Base')}
                         </span>
                         <div className="flex items-baseline gap-1">
                            <span className="text-sm font-black text-brand-dark italic mb-1">₹</span>
                            <span className="text-3xl font-black text-brand-dark tracking-tighter italic leading-none">{totalPrice.toLocaleString()}</span>
                         </div>
                       </div>
                       <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">
                         <div>₹{unitPrice}</div>
                         <div>per unit</div>
                       </div>
                    </div>
                 </div>
                 <button 
                   onClick={handleFinishDesign}
                   disabled={isFinishing}
                   className="px-10 py-5 bg-brand-dark text-white text-[11px] font-black uppercase tracking-[0.25em] rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:shadow-brand-pink/20 hover:bg-brand-pink transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 italic group"
                 >
                   {isFinishing ? "Processing..." : "Add to Project"}
                 </button>
               </div>
            </div>
          </div>
        </main>
      </div>

      <div className="md:hidden flex flex-col flex-shrink-0 bg-white border-t border-gray-100 z-50 pb-safe relative">
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
                   productId={product.id}
                   onLockAllObjects={(lock) => canvasRef.current?.lockAllObjects(lock)}
                   onClearDesign={() => canvasRef.current?.clearDesign()}
                   onAddPattern={(url) => canvasRef.current?.addPattern(url)}
                   qualityPrices={qualityPrices}
                   colorVariants={(product as any).color_variants || []}
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
