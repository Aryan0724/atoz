"use client";

import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { DesignerCanvasProps, DesignerCanvasRef } from '@/types/canvas';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Type, 
  Palette,
  Layout, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase,
  Calendar,
  Info,
  Upload,
  Check,
  ChevronLeft,
  ChevronRight,
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { X, Grid, Trash2 } from 'lucide-react';


const TemplateFormDesigner = forwardRef<DesignerCanvasRef, DesignerCanvasProps>((props, ref) => {
  const { product, designConfig, onObjectsUpdated, initialTemplateIndex } = props;


  const [formData, setFormData] = useState<Record<string, { text: string, color?: string }>>({});
  const [selectedDesignIndex, setSelectedDesignIndex] = useState(initialTemplateIndex || 0);
  const [selectedSideIndex, setSelectedSideIndex] = useState(0); // 0=Front, 1=Back
  const [selectedColor, setSelectedColor] = useState('#FFD700');
  const [selectedQuality, setSelectedQuality] = useState('Standard Matte');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const designs = (product as any).color_variants?.length > 0 
    ? (product as any).color_variants 
    : [
        { 
          name: 'Default Design', 
          wireframe_images: designConfig?.templates?.map((t: any) => t.preview) || product.template_images || product.images || []
        }
      ];

  const currentDesign = designs[selectedDesignIndex] || designs[0];

  // --- DRAG & DROP AND CUSTOM ELEMENTS STATE ---
  const [localMappings, setLocalMappings] = useState<Record<string, any>>({});
  const [customFields, setCustomFields] = useState<any[]>([]);
  const [activeField, setActiveField] = useState<string | null>(null);
  
  // Dragging / Resizing Math
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [initialFieldPos, setInitialFieldPos] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const isPreview = props.activeView === '3d';

  const baseFields = (designConfig?.fields && designConfig.fields.length > 0) ? designConfig.fields : [
    { id: 'name', label: 'Full Name', type: 'text', icon: 'User', placeholder: 'e.g. John Doe' },
    { id: 'title', label: 'Job Title', type: 'text', icon: 'Briefcase', placeholder: 'e.g. Creative Director' },
    { id: 'phone', label: 'Phone Number', type: 'text', icon: 'Phone', placeholder: '+91 98765 43210' },
    { id: 'email', label: 'Email Address', type: 'email', icon: 'Mail', placeholder: 'john@example.com' },
    { id: 'address', label: 'Address', type: 'textarea', icon: 'MapPin', placeholder: 'Enter address...' },
  ];

  const allFields = [...baseFields, ...customFields];

  // Initialize mappings when template or side changes
  React.useEffect(() => {
    const key = `${selectedDesignIndex}_${selectedSideIndex}`;
    const initialMappings = designConfig?.mappings?.[key] || designConfig?.mappings?.[selectedSideIndex] || {};
    
    // Merge existing custom mappings if any exist for this view
    setLocalMappings(prev => {
       const merged = { ...initialMappings };
       // Keep custom fields that might have been added
       customFields.forEach(f => {
          if (prev[f.id]) merged[f.id] = prev[f.id];
       });
       return merged;
    });
  }, [selectedDesignIndex, selectedSideIndex, designConfig]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle Dragging & Resizing
  React.useEffect(() => {
      const handleMove = (e: PointerEvent) => {
        if ((!isDragging && !isResizing) || !activeField) return;

        const container = document.getElementById('template-preview-container');
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const canvasSize = { w: rect.width, h: rect.height };

        const clientX = e.clientX;
        const clientY = e.clientY;

        const dx = ((clientX - dragStartPos.x) / canvasSize.w) * 100;
        const dy = ((clientY - dragStartPos.y) / canvasSize.h) * 100;

        setLocalMappings(prev => {
          const field = prev[activeField];
          if (!field) return prev;

          if (isDragging) {
             return {
               ...prev,
               [activeField]: {
                 ...field,
                 x: Math.max(0, Math.min(100 - (field.w || 0), initialFieldPos.x + dx)),
                 y: Math.max(0, Math.min(100 - (field.h || 0), initialFieldPos.y + dy))
               }
             };
          } else if (isResizing) {
             return {
               ...prev,
               [activeField]: {
                 ...field,
                 w: Math.max(10, Math.min(100 - initialFieldPos.x, initialFieldPos.w + dx)),
                 h: Math.max(5, Math.min(100 - initialFieldPos.y, initialFieldPos.h + dy))
               }
             };
          }
          
          return prev;
        });
      };

      const handleEnd = () => {
        setIsDragging(false);
        setIsResizing(false);
      };

      if (isDragging || isResizing) {
        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerup', handleEnd);
        window.addEventListener('pointercancel', handleEnd);
      }

      return () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleEnd);
        window.removeEventListener('pointercancel', handleEnd);
      };
  }, [isDragging, isResizing, dragStartPos, activeField, initialFieldPos]);

  const handleStart = (e: React.PointerEvent, fieldId: string, action: 'move' | 'resize') => {
    if (isPreview) return;
    
    // Crucial for drag-and-drop to work correctly on all browsers
    e.preventDefault(); 
    e.stopPropagation();
    
    setActiveField(fieldId);
    
    if (action === 'resize') setIsResizing(true);
    if (action === 'move') setIsDragging(true);
    
    setDragStartPos({ x: e.clientX, y: e.clientY });
    
    // Ensure we have current values for the drag start
    const currentMapping = localMappings[fieldId] || {};
    setInitialFieldPos({
       x: currentMapping.x || 0,
       y: currentMapping.y || 0,
       w: currentMapping.w || 30,
       h: currentMapping.h || 10
    });

    // Capture pointer to track movement even outside the element
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch (err) {
      console.warn('Pointer capture not supported or failed', err);
    }
  };

  const handleAddCustomField = (type: 'text' | 'image', initialValue?: string) => {
    const newId = `custom_${Date.now()}`;
    const newField = {
      id: newId,
      label: `Custom ${type === 'text' ? 'Text' : 'Image'}`,
      type,
      placeholder: type === 'text' ? 'Enter custom text' : undefined,
      isCustom: true
    };
    
    setCustomFields(prev => [...prev, newField]);
    if (initialValue) {
       setFormData(prev => ({ ...prev, [newId]: { text: initialValue } }));
    }

    setLocalMappings(prev => ({
       ...prev,
       [newId]: {
          x: 10,
          y: 10,
          w: type === 'text' ? 40 : 20,
          h: type === 'text' ? 10 : 20,
          fontSize: 16,
          color: '#FFD700',
          align: 'left'
       }
    }));
    setActiveField(newId);
  };

  const updateFontStyle = (fieldId: string, style: 'bold' | 'italic') => {
    setLocalMappings(prev => {
      const f = prev[fieldId];
      if (!f) return prev;
      if (style === 'bold') {
        return { ...prev, [fieldId]: { ...f, fontWeight: f.fontWeight === 'bold' ? 'normal' : 'bold' } };
      }
      return { ...prev, [fieldId]: { ...f, italic: !f.italic } };
    });
  };

  const updateFontFamily = (fieldId: string, family: string) => {
    setLocalMappings(prev => {
      const f = prev[fieldId];
      if (!f) return prev;
      return { ...prev, [fieldId]: { ...f, fontFamily: family } };
    });
  };

  const updateFontSize = (fieldId: string, delta: number) => {
    setLocalMappings(prev => {
      const f = prev[fieldId];
      if (!f) return prev;
      return {
        ...prev,
        [fieldId]: {
          ...f,
          fontSize: Math.max(6, (f.fontSize || 14) + delta)
        }
      };
    });
  };

  const updateLineHeight = (fieldId: string, delta: number) => {
    setLocalMappings(prev => {
      const f = prev[fieldId];
      if (!f) return prev;
      return {
        ...prev,
        [fieldId]: {
          ...f,
          lineHeight: Math.max(0.8, Math.min(3, (f.lineHeight || 1.2) + delta))
        }
      };
    });
  };

  const updateTextAlign = (fieldId: string, align: 'left' | 'center' | 'right') => {
    setLocalMappings(prev => {
      const f = prev[fieldId];
      if (!f) return prev;
      return { ...prev, [fieldId]: { ...f, align } };
    });
  };

  const removeCustomField = (fieldId: string) => {
    setCustomFields(prev => prev.filter(f => f.id !== fieldId));
    setLocalMappings(prev => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
    if (activeField === fieldId) setActiveField(null);
    setFormData(prev => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  };


  const currentPreview = currentDesign?.wireframe_images?.[selectedSideIndex] || currentDesign?.image_url || currentDesign?.wireframe_images?.[0] || '';

  // Expose methods to maintain compatibility with the DesignerCanvas interface
  useImperativeHandle(ref, () => ({
    addText: () => {},
    addImage: () => {},
    addShape: () => {},
    addIcon: () => {},
    addSvgGraphic: () => {},
    undo: () => {},
    redo: () => {},
    saveHistory: () => {},
    deleteActiveObject: () => {},
    duplicateActiveObject: () => {},
    toggleLock: () => {},
    alignActiveObject: () => {},
    getCanvasDataURL: async () => {
      return currentPreview; 
    },
    downloadDesign: () => {
        alert("High-resolution print file will be generated upon order.");
    },
    zoomIn: () => {},
    zoomOut: () => {},
    resetZoom: () => {},
    setPanning: () => {},
    clearCanvas: () => setFormData({}),
    getObjects: () => [
        { 
            type: 'template_form_data', 
            data: formData,
            templateId: `${selectedDesignIndex}_${selectedSideIndex}`,
            color: selectedColor,
            quality: selectedQuality,
            id: 'template_form_payload'
        } as any
    ],
    addPattern: () => {},
    zoomLevel: 1,
    updateActiveObject: () => {},
    updateObjectById: () => {},
    setTextShadow: () => {},
    setTextOutline: () => {},
    sendToBack: () => {},
    bringToFront: () => {},
    bringForward: () => {},
    sendBackward: () => {},
    groupObjects: () => {},
    ungroupObjects: () => {},
    removeBackground: async () => true,
    getJson: () => ({
        templateIndex: selectedDesignIndex,
        sideIndex: selectedSideIndex,
        formData: formData,
        customMappings: localMappings,
        customFields: customFields,
        color: selectedColor,
        quality: selectedQuality
    }),
    loadJson: (json: any) => {
        if (json?.templateIndex !== undefined) setSelectedDesignIndex(json.templateIndex);
        if (json?.sideIndex !== undefined) setSelectedSideIndex(json.sideIndex);
        if (json?.formData) setFormData(json.formData);
    },
    getLayers: () => [],
    getDesignDataUrl: async () => currentPreview,
  } as any));



  // Fields are now handled by allFields derived from baseFields + customFields

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      User: <User className="h-4 w-4" />,
      Briefcase: <Briefcase className="h-4 w-4" />,
      Phone: <Phone className="h-4 w-4" />,
      Mail: <Mail className="h-4 w-4" />,
      MapPin: <MapPin className="h-4 w-4" />,
      Calendar: <Calendar className="h-4 w-4" />,
      Type: <Type className="h-4 w-4" />,
      Layout: <Layout className="h-4 w-4" />,
      Info: <Info className="h-4 w-4" />,
      Flower: <div className="text-lg">🌸</div>,
      Sparkles: <div className="text-lg">✨</div>,
      Heart: <div className="text-lg">❤️</div>,
      Star: <div className="text-lg">⭐</div>,
      Sun: <div className="text-lg">☀️</div>,
      Om: <div className="text-lg font-bold">ॐ</div>
    };
    return icons[iconName] || <Info className="h-4 w-4" />;
  };

  const handleFieldChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    onObjectsUpdated?.();
  };

  return (
    <div className="w-full h-[calc(100dvh-60px)] md:h-[calc(100vh-60px)] flex flex-col md:flex-row bg-[#fbfbf9] overflow-hidden">
      
      {/* RIGHT PANEL: Live Preview Area (TOP on mobile, RIGHT on desktop) */}
      <div 
        className={cn(
          "w-full md:flex-1 h-[45dvh] md:h-full relative flex flex-col bg-gray-50 no-custom-cursor flex-shrink-0 border-b border-gray-100 md:border-b-0 order-1 md:order-2 transition-all",
          isDragOver && "ring-4 ring-brand-pink ring-inset bg-brand-pink/5"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);

          // Handle Files
          if (e.dataTransfer.files.length) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
               const reader = new FileReader();
               reader.onload = (f) => {
                 if (f.target?.result) {
                    handleAddCustomField('image', f.target.result as string);
                 }
               };
               reader.readAsDataURL(file);
            }
            return;
          }

          // Handle Sidebar Data
          const data = e.dataTransfer.getData('application/atoz-element');
          if (data) {
            try {
              const payload = JSON.parse(data);
              if (payload.type === 'image') handleAddCustomField('image', payload.url);
            } catch (err) {
              console.error('Failed to parse dropped element:', err);
            }
          }
        }}
      >
        
        {/* Side Controls (Front/Back) - BOTTOM on mobile, TOP on desktop */}
        <div className="absolute bottom-4 md:top-6 left-1/2 -translate-x-1/2 z-30 w-[95%] md:w-auto pointer-events-none">
          <div className="flex gap-1 bg-white/80 backdrop-blur-md rounded-xl md:rounded-2xl p-1 md:p-1.5 border border-gray-200 shadow-sm overflow-x-auto no-scrollbar pointer-events-auto">
             {[
               { idx: 0, label: 'Front' },
               { idx: 1, label: 'Back' },
               { idx: 2, label: 'Left' },
               { idx: 3, label: 'Right' }
             ].filter(view => currentDesign?.wireframe_images?.[view.idx]).map((view) => (
                <button 
                   key={view.idx}
                   onClick={() => setSelectedSideIndex(view.idx)}
                   className={cn(
                     "px-3 md:px-6 py-1 md:py-2 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] transition-all relative overflow-hidden shrink-0",
                     selectedSideIndex === view.idx 
                       ? "text-white shadow-md" 
                       : "text-gray-500 hover:text-brand-dark hover:bg-gray-50"
                   )}
                >
                   {selectedSideIndex === view.idx && (
                     <motion.div 
                       layoutId="activeSide"
                       className="absolute inset-0 bg-brand-dark z-0"
                       transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                     />
                   )}
                   <span className="relative z-10 italic">{view.label}</span>
                </button>
             ))}
          </div>
        </div>

        {/* The Actual Preview Canvas */}
        <div className="flex-1 w-full p-2 md:p-12 flex items-center justify-center overflow-hidden">
           <AnimatePresence mode="wait">
             <motion.div 
              key={`${selectedDesignIndex}-${selectedSideIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className={cn(
                "relative bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden",
                // Remove fixed min/max heights, let the flexbox and aspect ratio control it
                "h-full max-h-full max-w-full flex items-center justify-center",
                product.slug?.includes('id-card') ? "aspect-[2/3]" : 
                product.slug?.includes('wedding') ? "aspect-[2/3]" :
                product.slug?.includes('letter-head') ? "aspect-[1/1.41]" : 
                "aspect-[3.5/2]"
              )}
            >
               {currentPreview ? (
                 <div 
                    id="template-preview-container" 
                    className="relative w-full h-full"
                    style={{ containerType: 'inline-size' }}
                 >
                   <img 
                     src={currentPreview} 
                     alt="Preview" 
                     style={{ filter: selectedColor === '#FFFFFF' ? 'none' : `hue-rotate(${selectedDesignIndex * 20}deg) brightness(0.9)` }}
                     className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                   />
                   
                   {/* Background click to deselect */}
                   <div className="absolute inset-0 z-0" onClick={() => setActiveField(null)} />
                   
                   {/* Elements layer - z-index 50 to be above overlays, pointer-events-auto so children can receive events */}
                   <div className="absolute inset-0" style={{ zIndex: 50 }}>
                      {(() => {
                         if (localMappings && Object.keys(localMappings).length > 0) {
                            return allFields.map((field: any) => {
                               const mapping = localMappings[field.id];
                               if (!mapping) return null;
                               
                               const hasWidth = !!mapping.w;
                               const left = `${mapping.x}%`;
                               const top = `${mapping.y}%`;
                               const transform = mapping.align === 'center' 
                                 ? 'translateX(-50%)' 
                                 : mapping.align === 'right' 
                                   ? 'translateX(-100%)' 
                                   : 'none';

                               const autoMaxWidth = mapping.align === 'center'
                                 ? (Math.min(mapping.x, 100 - mapping.x) * 2)
                                 : mapping.align === 'right'
                                   ? mapping.x
                                   : (100 - mapping.x);

                               // CQI SCALING for text
                               // Base width of template assumed ~500px for mappings
                               const baseFontSize = mapping.fontSize || 14;
                               const cqiSize = (baseFontSize / 500) * 100;

                               return (
                                  <div
                                      key={field.id}
                                      onPointerDown={(e) => {
                                        if (!isPreview) {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setActiveField(field.id);
                                          setIsDragging(true);
                                          setDragStartPos({ x: e.clientX, y: e.clientY });
                                          const cur = localMappings[field.id] || {};
                                          setInitialFieldPos({ x: cur.x || 0, y: cur.y || 0, w: cur.w || 30, h: cur.h || 10 });
                                          try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
                                        }
                                      }}
                                      style={{
                                        position: 'absolute',
                                        left,
                                        top,
                                        width: hasWidth ? `${mapping.w}%` : 'auto',
                                        height: mapping.h ? `${mapping.h}%` : 'auto',
                                        transform,
                                        fontSize: `${cqiSize}cqi`,
                                        fontWeight: mapping.fontWeight || 'normal',
                                        fontFamily: mapping.fontFamily || 'inherit',
                                        fontStyle: mapping.italic ? 'italic' : 'normal',
                                        textAlign: mapping.align || 'left',
                                        color: formData[field.id]?.color || mapping.color || '#FFD700',
                                        opacity: mapping.opacity !== undefined ? mapping.opacity : 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: mapping.align === 'center' ? 'center' : mapping.align === 'right' ? 'flex-end' : 'flex-start',
                                        justifyContent: 'center',
                                        lineHeight: mapping.lineHeight || '1.2',
                                        maxWidth: mapping.maxWidth ? `${mapping.maxWidth}%` : `${autoMaxWidth}%`,
                                        zIndex: activeField === field.id ? 100 : 50,
                                        boxSizing: 'border-box',
                                        cursor: isPreview ? 'default' : 'move',
                                        touchAction: 'none',
                                      }}
                                      className={cn(
                                        "transition-all overflow-visible select-none"
                                      )}
                                    >

                                      {/* CONTENT DISPLAY */}
                                      <div className="relative pointer-events-none w-full h-full flex flex-col justify-center select-none">
                                        {field.type === 'image' ? (
                                           formData[field.id]?.text ? (
                                              <img src={formData[field.id].text} alt={field.label} className="w-full h-full object-contain" />
                                           ) : (
                                              <div className={cn("w-full h-full border border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50/50 p-1", isPreview && "opacity-0")}>
                                                 <Upload style={{ width: '3cqi', height: '3cqi' }} className="text-gray-400 mb-0.5" />
                                                 <span style={{ fontSize: '1.5cqi' }} className="font-black uppercase text-gray-400 text-center">Image</span>
                                              </div>
                                           )
                                        ) : (
                                          <span className="whitespace-pre-line leading-tight">
                                            {formData[field.id]?.text || field.placeholder?.replace('e.g. ', '') || field.label}
                                          </span>
                                        )}
                                      </div>

                                      {/* RESIZE HANDLES - directly in element, no pointer-events-none wrapper */}
                                      {!isPreview && activeField === field.id && (
                                         <>
                                            {/* Bottom Right Handle */}
                                            <div 
                                              onPointerDown={(e) => { e.stopPropagation(); handleStart(e, field.id, 'resize'); }}
                                              style={{ position: 'absolute', right: '-14px', bottom: '-14px', width: '28px', height: '28px', zIndex: 200, cursor: 'se-resize', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                               <div style={{ width: '18px', height: '18px', background: '#e91e63', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
                                            </div>
                                            
                                            {/* Top Left Handle */}
                                            <div 
                                              onPointerDown={(e) => { e.stopPropagation(); handleStart(e, field.id, 'resize'); }}
                                              style={{ position: 'absolute', left: '-14px', top: '-14px', width: '28px', height: '28px', zIndex: 200, cursor: 'nw-resize', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                               <div style={{ width: '14px', height: '14px', background: 'white', borderRadius: '50%', border: '2px solid #e91e63', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                                            </div>

                                            {/* Bottom Left Handle */}
                                            <div 
                                              onPointerDown={(e) => { e.stopPropagation(); handleStart(e, field.id, 'resize'); }}
                                              style={{ position: 'absolute', left: '-14px', bottom: '-14px', width: '28px', height: '28px', zIndex: 200, cursor: 'sw-resize', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                               <div style={{ width: '14px', height: '14px', background: 'white', borderRadius: '50%', border: '2px solid #e91e63', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                                            </div>

                                            {/* Top Right Handle */}
                                            <div 
                                              onPointerDown={(e) => { e.stopPropagation(); handleStart(e, field.id, 'resize'); }}
                                              style={{ position: 'absolute', right: '-14px', top: '-14px', width: '28px', height: '28px', zIndex: 200, cursor: 'ne-resize', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                               <div style={{ width: '14px', height: '14px', background: 'white', borderRadius: '50%', border: '2px solid #e91e63', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                                            </div>
                                         </>
                                      )}

                                      {/* Formatting Toolbar */}
                                      {!isPreview && activeField === field.id && (
                                         <div 
                                           onPointerDown={(e) => e.stopPropagation()}
                                           className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 flex items-center gap-1.5 p-1 z-[120] pointer-events-auto cursor-default scale-90 md:scale-100"
                                         >
                                          <div className="flex gap-1 border-r border-gray-100 pr-1.5">
                                            {['#FFD700', '#FFFFFF', '#000000', '#FF1493', '#800000', '#1A4D2E'].map(c => (
                                              <button 
                                                key={c}
                                                onClick={() => setFormData(prev => ({ ...prev, [field.id]: { ...(prev[field.id] || { text: '' }), color: c } }))}
                                                className={cn("w-3 h-3 rounded-full border border-gray-200 hover:scale-110 transition-transform", (formData[field.id]?.color || mapping.color || '#FFD700') === c && "ring-1 ring-brand-pink ring-offset-1")}
                                                style={{ backgroundColor: c }}
                                              />
                                            ))}
                                          </div>
                                          {field.type !== 'image' && (
                                             <>
                                               <div className="flex gap-0.5 border-r border-gray-100 pr-1.5">
                                                 <button onClick={() => updateFontSize(field.id, -1)} className="px-1 py-0.5 hover:bg-gray-100 rounded text-[9px] text-gray-500 font-bold" title="Smaller Font">A-</button>
                                                 <button onClick={() => updateFontSize(field.id, 1)} className="px-1 py-0.5 hover:bg-gray-100 rounded text-[9px] text-gray-500 font-bold" title="Bigger Font">A+</button>
                                               </div>
                                               <div className="flex gap-0.5 border-r border-gray-100 pr-1.5">
                                                 <button onClick={() => updateLineHeight(field.id, -0.1)} className="px-1 py-0.5 hover:bg-gray-100 rounded text-[9px] text-gray-500 font-bold flex flex-col items-center leading-none" title="Decrease Line Height">
                                                   <span className="mb-[-2px] block">⎯</span>
                                                   <span className="block">⎯</span>
                                                 </button>
                                                 <button onClick={() => updateLineHeight(field.id, 0.1)} className="px-1 py-0.5 hover:bg-gray-100 rounded text-[9px] text-gray-500 font-bold flex flex-col items-center leading-none" title="Increase Line Height">
                                                   <span className="mb-[1px] block text-[7px]">↑</span>
                                                   <span className="block text-[7px]">↓</span>
                                                 </button>
                                               </div>
                                               <div className="flex gap-0.5 border-r border-gray-100 pr-1.5">
                                                 <button 
                                                   onClick={() => updateFontStyle(field.id, 'bold')} 
                                                   className={cn("w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center", mapping.fontWeight === 'bold' ? "bg-brand-pink text-white" : "hover:bg-gray-100 text-gray-500")}
                                                   title="Bold"
                                                 >B</button>
                                                 <button 
                                                   onClick={() => updateFontStyle(field.id, 'italic')} 
                                                   className={cn("w-5 h-5 rounded text-[9px] italic flex items-center justify-center", mapping.italic ? "bg-brand-pink text-white" : "hover:bg-gray-100 text-gray-500")}
                                                   title="Italic"
                                                 >I</button>
                                               </div>
                                               <div className="flex gap-0.5 border-r border-gray-100 pr-1.5">
                                                 <select 
                                                   value={mapping.fontFamily || 'Inter'} 
                                                   onChange={(e) => updateFontFamily(field.id, e.target.value)}
                                                   className="text-[8px] bg-gray-50 border-none rounded px-1 py-0.5 outline-none cursor-pointer font-medium"
                                                 >
                                                   <option value="Inter">Inter</option>
                                                   <option value="Roboto">Roboto</option>
                                                   <option value="Playfair Display">Playfair</option>
                                                   <option value="Montserrat">Montserrat</option>
                                                 </select>
                                               </div>
                                               <div className="flex gap-0.5">
                                                 <button onClick={() => updateTextAlign(field.id, 'left')} className={cn("w-5 h-5 rounded text-[9px] font-bold", mapping.align === 'left' ? "bg-gray-100 text-brand-dark" : "hover:bg-gray-100 text-gray-400")}>L</button>
                                                 <button onClick={() => updateTextAlign(field.id, 'center')} className={cn("w-5 h-5 rounded text-[9px] font-bold", mapping.align === 'center' ? "bg-gray-100 text-brand-dark" : "hover:bg-gray-100 text-gray-400")}>C</button>
                                                 <button onClick={() => updateTextAlign(field.id, 'right')} className={cn("w-5 h-5 rounded text-[9px] font-bold", mapping.align === 'right' ? "bg-gray-100 text-brand-dark" : "hover:bg-gray-100 text-gray-400")}>R</button>
                                               </div>
                                             </>
                                          )}
                                         {customFields.some((f: any) => f.id === field.id) && (
                                           <div className="pl-1">
                                             <button onClick={() => removeCustomField(field.id)} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                           </div>
                                         )}
                                      </div>
                                    )}
                                  </div>
                               );
                            });
                         }
                         return null;
                     })()}
                   </div>
               </div>
             ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-300 font-medium">
                  {product.name}
               </div>
             )}
            </motion.div>
           </AnimatePresence>
        </div>
      </div>

      {/* LEFT PANEL: Form and Config (BOTTOM on mobile) */}
      <div className="w-full md:w-[450px] lg:w-[500px] shrink-0 flex-1 md:h-full overflow-y-auto border-r border-gray-100 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 custom-scrollbar order-2 md:order-1">
        <div className="p-4 md:p-8 space-y-6 md:space-y-10">
          
          {/* Template Selection */}
          {designs.length > 1 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                 <h3 className="text-sm font-semibold text-brand-dark">Design Style</h3>
                 <button 
                   onClick={() => setIsGalleryOpen(true)}
                   className="flex items-center gap-1.5 text-[10px] font-black text-brand-pink uppercase tracking-widest hover:opacity-70 transition-opacity"
                 >
                   <LayoutGrid className="w-3 h-3" /> View All
                 </button>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {designs.map((d: any, idx: number) => (
                     <button 
                        key={idx}
                        onClick={() => setSelectedDesignIndex(idx)}
                        className={cn(
                          "px-6 py-3 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                          selectedDesignIndex === idx 
                            ? "bg-brand-dark text-white border-brand-dark shadow-md" 
                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                        )}
                     >
                        {d.name || `Template ${idx + 1}`}
                     </button>
                  ))}
              </div>
            </div>
          )}

          {/* Form Details */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-dark tracking-tight">Customization Details</h2>
              <div className="flex gap-1.5">
                  <button 
                    onClick={() => handleAddCustomField('text')}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-md transition-all text-[10px] font-black uppercase tracking-widest text-brand-pink"
                  >
                    <Type className="w-3 h-3" /> Text
                  </button>
                  <button 
                    onClick={() => handleAddCustomField('image')}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-md transition-all text-[10px] font-black uppercase tracking-widest text-brand-pink"
                  >
                    <Upload className="w-3 h-3" /> Image
                  </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {allFields.map((field: any) => (
                <div key={field.id} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{field.label}</label>
                    {field.type !== 'image' && (
                      <div className="flex gap-1">
                        {['#FFD700', '#FFFFFF', '#000000', '#FF1493', '#800000', '#1A4D2E'].map(c => (
                          <button 
                            key={c}
                            onClick={() => setFormData(prev => ({ ...prev, [field.id]: { ...(prev[field.id] || { text: '' }), color: c } }))}
                            className={cn(
                              "w-3.5 h-3.5 rounded-full border border-gray-200 transition-transform hover:scale-110",
                              (formData[field.id]?.color || '#FFD700') === c ? "ring-2 ring-brand-pink ring-offset-1 border-white" : ""
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {field.type === 'textarea' ? (
                    <textarea 
                       rows={2}
                       value={formData[field.id]?.text || ''}
                       onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: { ...(prev[field.id] || { text: '' }), text: e.target.value } }))}
                       placeholder={field.placeholder}
                       className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/10 transition-all outline-none text-sm resize-none"
                    />
                  ) : field.type === 'image' ? (
                    <label className="flex items-center gap-3 p-2 border border-dashed border-gray-300 bg-white rounded-xl hover:border-brand-pink/50 transition-all cursor-pointer">
                       <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                          {formData[field.id]?.text ? (
                             <img src={formData[field.id].text} alt="Preview" className="w-full h-full object-contain" />
                          ) : (
                             <Upload className="w-4 h-4 text-gray-400" />
                          )}
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-700">{formData[field.id]?.text ? 'Logo Selected' : 'Upload Logo'}</p>
                       </div>
                       <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setFormData(prev => ({ ...prev, [field.id]: { ...(prev[field.id] || { text: '' }), text: reader.result as string } }));
                                reader.readAsDataURL(file);
                             }
                          }} 
                       />
                    </label>
                  ) : (
                    <input 
                       type="text"
                       value={formData[field.id]?.text || ''}
                       onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: { ...(prev[field.id] || { text: '' }), text: e.target.value } }))}
                       placeholder={field.placeholder}
                       className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/10 transition-all outline-none text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. TEMPLATE GALLERY MODAL */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-dark/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-5xl h-[90vh] md:h-[85vh] rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-brand-dark tracking-tighter">Browse <span className="text-brand-pink">Templates</span></h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Select from {designs.length} Professional Designs</p>
                </div>
                <button 
                  onClick={() => setIsGalleryOpen(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-brand-dark transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {designs.map((design: any, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        setSelectedDesignIndex(idx);
                        setIsGalleryOpen(false);
                      }}
                      className={cn(
                        "group relative rounded-2xl overflow-hidden border-2 transition-all duration-300",
                        product.slug === 'id-card' || product.slug === 'id-card-custom' ? "aspect-[2/3.5]" : 
                        product.slug === 'letter-head' || product.slug === 'letter-head-custom' ? "aspect-[1/1.41]" : 
                        "aspect-[3.5/2]",
                        selectedDesignIndex === idx ? "border-brand-pink ring-4 ring-brand-pink/10" : "border-gray-50 hover:border-gray-200"
                      )}
                    >
                      <img 
                        src={design.wireframe_images?.[0] || design.image_url} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        alt={design.name}
                      />
                      <div className={cn(
                        "absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
                        selectedDesignIndex === idx && "opacity-100 bg-brand-pink/20"
                      )}>
                        <div className="px-4 py-2 bg-white rounded-full shadow-xl">
                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">
                            {selectedDesignIndex === idx ? 'Selected' : 'Use Template'}
                          </span>
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 py-2 px-3 bg-white/90 backdrop-blur-sm rounded-xl border border-white/20">
                        <p className="text-[10px] font-black text-brand-dark uppercase truncate">{design.name || `Design ${idx + 1}`}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
});

TemplateFormDesigner.displayName = 'TemplateFormDesigner';
export default TemplateFormDesigner;
