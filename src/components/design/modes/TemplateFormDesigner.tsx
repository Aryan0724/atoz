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
import { X, Grid } from 'lucide-react';


const TemplateFormDesigner = forwardRef<DesignerCanvasRef, DesignerCanvasProps>((props, ref) => {
  const { product, designConfig, onObjectsUpdated, initialTemplateIndex } = props;
  const [formData, setFormData] = useState<Record<string, { text: string, color?: string }>>({});
  const [selectedDesignIndex, setSelectedDesignIndex] = useState(initialTemplateIndex || 0);
  const [selectedSideIndex, setSelectedSideIndex] = useState(0); // 0=Front, 1=Back
  const [selectedColor, setSelectedColor] = useState('#FFD700');
  const [selectedQuality, setSelectedQuality] = useState('Standard Matte');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);


  const designs = (product as any).color_variants?.length > 0 
    ? (product as any).color_variants 
    : [
        { 
          name: 'Default Design', 
          wireframe_images: designConfig?.templates?.map((t: any) => t.preview) || product.template_images || product.images || []
        }
      ];

  const currentDesign = designs[selectedDesignIndex] || designs[0];
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



  const fields = (designConfig?.fields && designConfig.fields.length > 0) ? designConfig.fields : [
    { id: 'name', label: 'Full Name', type: 'text', icon: 'User', placeholder: 'e.g. John Doe' },
    { id: 'title', label: 'Job Title', type: 'text', icon: 'Briefcase', placeholder: 'e.g. Creative Director' },
    { id: 'phone', label: 'Phone Number', type: 'text', icon: 'Phone', placeholder: '+91 98765 43210' },
    { id: 'email', label: 'Email Address', type: 'email', icon: 'Mail', placeholder: 'john@example.com' },
    { id: 'address', label: 'Address', type: 'textarea', icon: 'MapPin', placeholder: 'Enter address...' },
  ];

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
    <div className="w-full min-h-screen flex flex-col bg-[#fcfcfc]">
      {/* 1. HERO PREVIEW SECTION - Clean and Minimal */}
      <section className="relative w-full border-b border-gray-100 flex flex-col items-center justify-center py-12 px-4">
        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
           <div className={cn(
             "relative w-full flex items-center justify-center mb-6",
             product.slug?.includes('wedding') || product.slug?.includes('id-card') || product.slug?.includes('letter-head') 
               ? "min-h-[500px]" 
               : "aspect-[21/9]"
           )}>
              <AnimatePresence mode="wait">
                 <motion.div 
                  key={`${selectedDesignIndex}-${selectedSideIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "relative h-full bg-white rounded-xl shadow-lg border border-gray-200 p-1",
                    product.slug?.includes('id-card') ? "aspect-[2/3]" : 
                    product.slug?.includes('wedding') ? "aspect-[2/3]" :
                    product.slug?.includes('letter-head') ? "aspect-[1/1.41]" : 
                    "aspect-[3.5/2]"
                  )}
                >
                   {currentPreview ? (
                     <div className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden relative bg-gray-50 p-4">
                       <div className="relative inline-block max-w-full max-h-full">
                         <img 
                           src={currentPreview} 
                           alt="Preview" 
                           style={{ filter: selectedColor === '#FFFFFF' ? 'none' : `hue-rotate(${selectedDesignIndex * 20}deg) brightness(0.9)` }}
                           className="max-w-full max-h-full object-contain pointer-events-none shadow-sm"
                         />
                         
                          {/* DYNAMIC TEXT OVERLAY */}
                        <div className="absolute inset-0 pointer-events-none z-10">
                            {(() => {
                               const mappings = designConfig?.mappings?.[`${selectedDesignIndex}_${selectedSideIndex}`] || designConfig?.mappings?.[selectedSideIndex];
                               
                               if (mappings && Object.keys(mappings).length > 0) {
                                  // Absolute mapped mode (using native percentages 0-100)
                                  return fields.map((field: any) => {
                                     const mapping = mappings[field.id];
                                     if (!mapping) return null;
                                     
                                     const hasWidth = !!mapping.w;
                                     
                                     // Determine anchor points
                                     const left = `${mapping.x}%`;
                                     const top = `${mapping.y}%`;
                                     
                                     // Transform logic: 
                                     // x-axis: center at x if align=center, right-aligned at x if align=right
                                     // y-axis: always from the top (mapping.y is the top edge)
                                     const transform = mapping.align === 'center' 
                                       ? 'translateX(-50%)' 
                                       : mapping.align === 'right' 
                                         ? 'translateX(-100%)' 
                                         : 'none';

                                     // Smart maxWidth to prevent overflow
                                     const autoMaxWidth = mapping.align === 'center'
                                       ? (Math.min(mapping.x, 100 - mapping.x) * 2)
                                       : mapping.align === 'right'
                                         ? mapping.x
                                         : (100 - mapping.x);

                                     return (
                                        <div
                                          key={field.id}
                                          style={{
                                            position: 'absolute',
                                            left,
                                            top,
                                            width: hasWidth ? `${mapping.w}%` : 'auto',
                                            height: mapping.h ? `${mapping.h}%` : 'auto',
                                            transform,
                                            fontSize: mapping.fontSize ? `${mapping.fontSize}px` : undefined,
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
                                            lineHeight: '1.2',
                                            maxWidth: mapping.maxWidth ? `${mapping.maxWidth}%` : `${autoMaxWidth}%`
                                          }}
                                          className="transition-all duration-300 overflow-visible"
                                        >
                                          {field.type === 'image' ? (
                                             formData[field.id]?.text ? (
                                                <img src={formData[field.id].text} alt={field.label} className="max-w-full max-h-full object-contain" />
                                             ) : (
                                                <div className="w-full h-full border border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50/50">
                                                   <Upload className="w-4 h-4 text-gray-300 mb-1" />
                                                   <span className="text-[8px] font-black uppercase text-gray-300">Logo</span>
                                                </div>
                                             )
                                          ) : (
                                            <span className={cn(
                                              "whitespace-pre-line px-1",
                                              mapping.italic && "italic"
                                            )}>
                                              {formData[field.id]?.text || field.placeholder?.replace('e.g. ', '') || field.label}
                                            </span>
                                          )}
                                        </div>
                                     );
                                  });
                               }

                               return null;
                          })()}
                       </div>
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
           
           <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
               {/* 1. Enhanced Design Template Selector */}
                {designs.length > 1 && (
                  <div className="w-full flex flex-col items-center gap-2">
                    <div className="flex items-center justify-between w-full mb-1 px-4">
                       <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Select Design Style</p>
                       <button 
                         onClick={() => setIsGalleryOpen(true)}
                         className="flex items-center gap-2 text-[10px] font-black text-brand-pink uppercase tracking-widest hover:opacity-70 transition-opacity"
                       >
                         <LayoutGrid className="w-3 h-3" />
                         View All
                       </button>
                    </div>

                    <div className="relative w-full group">
                      <div 
                        id="template-scroller"
                        className="flex gap-3 bg-white/50 backdrop-blur-md rounded-3xl p-2 shadow-sm border border-gray-100 overflow-x-auto no-scrollbar scroll-smooth"
                      >
                          {designs.map((d: any, idx: number) => (
                             <button 
                                key={idx}
                                onClick={() => setSelectedDesignIndex(idx)}
                                className={cn(
                                  "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border-2",
                                  selectedDesignIndex === idx 
                                    ? "bg-brand-dark text-white border-brand-dark shadow-xl shadow-brand-dark/20 scale-[1.02]" 
                                    : "bg-white text-gray-400 border-transparent hover:border-gray-100 hover:text-brand-dark"
                                )}
                             >
                                {d.name || `Template ${idx + 1}`}
                             </button>
                          ))}
                      </div>
                      
                      {/* Navigation Overlays (Desktop Only) */}
                      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#fcfcfc] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#fcfcfc] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <button 
                        onClick={() => {
                          const scroller = document.getElementById('template-scroller');
                          if (scroller) scroller.scrollLeft -= 200;
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-dark opacity-0 group-hover:opacity-100 transition-all z-20"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          const scroller = document.getElementById('template-scroller');
                          if (scroller) scroller.scrollLeft += 200;
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-dark opacity-0 group-hover:opacity-100 transition-all z-20"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
               
               {/* 2. Side View Selector (Front/Back) */}
               <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-2 bg-gray-100/50 backdrop-blur-md rounded-2xl p-1.5 border border-gray-200/50 shadow-inner">
                     {[
                       { idx: 0, label: 'Front Side' },
                       { idx: 1, label: 'Back Side' },
                       { idx: 2, label: 'Left Side' },
                       { idx: 3, label: 'Right Side' }
                     ].filter(view => currentDesign?.wireframe_images?.[view.idx]).map((view) => (
                        <button 
                           key={view.idx}
                           onClick={() => setSelectedSideIndex(view.idx)}
                           className={cn(
                             "px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all relative overflow-hidden",
                             selectedSideIndex === view.idx 
                               ? "text-white shadow-lg" 
                               : "text-gray-400 hover:text-brand-dark"
                           )}
                        >
                           {selectedSideIndex === view.idx && (
                             <motion.div 
                               layoutId="activeSide"
                               className="absolute inset-0 bg-brand-pink z-0"
                               transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                             />
                           )}
                           <span className="relative z-10 italic">{view.label}</span>
                        </button>
                     ))}
                  </div>
               </div>
            </div>
        </div>
      </section>

      {/* 2. MAIN CONFIGURATION INTERFACE - Sleek */}
      <section className="w-full max-w-5xl mx-auto py-12 px-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Left Column: Form Details */}
            <div className="space-y-8">
               <div>
                  <h2 className="text-xl font-bold text-brand-dark tracking-tight mb-1">Customization Details</h2>
                  <p className="text-sm text-gray-500">Fill out your information to generate a live proof.</p>
               <div className="space-y-6">
                  {fields.map((field: any) => (
                    <div key={field.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 shadow-sm transition-all hover:bg-white hover:shadow-md">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{field.label}</label>
                        
                        {/* Compact Color Picker for Each Field */}
                        {field.type !== 'image' && (
                          <div className="flex gap-1.5 p-1 bg-gray-100 rounded-full">
                            {['#FFD700', '#FFFFFF', '#000000', '#FF1493', '#800000', '#1A4D2E'].map(c => (
                              <button 
                                key={c}
                                onClick={() => setFormData(prev => ({ ...prev, [field.id]: { ...(prev[field.id] || { text: '' }), color: c } }))}
                                className={cn(
                                  "w-3.5 h-3.5 rounded-full border border-white shadow-sm transition-transform hover:scale-125",
                                  (formData[field.id]?.color || '#FFD700') === c ? "ring-2 ring-brand-pink ring-offset-1" : ""
                                )}
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {field.type === 'textarea' ? (
                        <textarea 
                           rows={3}
                           value={formData[field.id]?.text || ''}
                           onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: { ...(prev[field.id] || { text: '' }), text: e.target.value } }))}
                           placeholder={field.placeholder}
                           className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/10 transition-all outline-none text-sm text-brand-dark resize-none placeholder:text-gray-300"
                        />
                      ) : field.type === 'image' ? (
                        <label className="flex items-center gap-4 p-3 border border-gray-100 bg-white rounded-xl hover:border-brand-pink/20 transition-all cursor-pointer group">
                           <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                              {formData[field.id]?.text ? (
                                 <img src={formData[field.id].text} alt="Preview" className="w-full h-full object-contain" />
                              ) : (
                                 <Upload className="w-5 h-5 text-gray-300 group-hover:text-brand-pink transition-colors" />
                              )}
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-700">{formData[field.id]?.text ? 'Logo Uploaded' : 'Upload Logo/Image'}</p>
                              <p className="text-[10px] text-gray-400 truncate">Click to browse or drag and drop</p>
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
                           className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/10 transition-all outline-none text-sm text-brand-dark placeholder:text-gray-300"
                        />
                      )}
                    </div>
                  ))}
                </div>
               </div>
            </div>

            {/* Right Column: Material & Options */}
            <div className="space-y-10">
               <div>
                  <h3 className="text-sm font-semibold text-brand-dark mb-4">Paper & Finish</h3>
                  <div className="grid grid-cols-2 gap-3">
                     {['Standard Matte', 'Premium Gloss', 'Silk Finish', 'Velvet Touch'].map(q => (
                        <button 
                           key={q} 
                           onClick={() => setSelectedQuality(q)}
                           className={cn(
                           "px-4 py-3 rounded-lg border transition-all text-xs font-medium text-left flex items-center justify-between",
                           selectedQuality === q 
                              ? "border-brand-dark text-brand-dark bg-gray-50" 
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                           )}
                        >
                           {q}
                           {selectedQuality === q && <Check className="w-3.5 h-3.5" />}
                        </button>
                     ))}
                  </div>
               </div>

            </div>
         </div>
      </section>

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
              className="bg-white w-full max-w-5xl h-[85vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
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

              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
