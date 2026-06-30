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
  LayoutGrid,
  Globe,
  Zap,
  Smile,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  X,
  Grid,
  Trash2,
  Heart,
  Star,
  Image as ImageIcon,
  Undo,
  Redo
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';


const TemplateFormDesigner = forwardRef<DesignerCanvasRef, DesignerCanvasProps>((props, ref) => {
  const { product, designConfig, onObjectsUpdated, initialTemplateIndex } = props;


  const [formData, setFormData] = useState<Record<string, { text: string, color?: string }>>({});
  const [selectedDesignIndex, setSelectedDesignIndex] = useState(initialTemplateIndex || 0);
  React.useEffect(() => {
    if (initialTemplateIndex !== undefined) {
      setSelectedDesignIndex(initialTemplateIndex);
    }
  }, [initialTemplateIndex]);
  const [selectedSideIndex, setSelectedSideIndex] = useState(0); // 0=Front, 1=Back
  const [selectedColor, setSelectedColor] = useState('#FFD700');
  const [selectedQuality, setSelectedQuality] = useState('Standard Matte');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // --- DRAG & DROP AND CUSTOM ELEMENTS STATE ---
  const [localMappings, setLocalMappings] = useState<Record<string, any>>({});
  const [customFields, setCustomFields] = useState<any[]>([]);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  
  // Dragging / Resizing Math
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [initialFieldPos, setInitialFieldPos] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const isPreview = props.activeView === '3d';
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dragStartPosRef = React.useRef({ x: 0, y: 0 });

  // --- HISTORY STATE & CONTROLS ---
  const historyRef = React.useRef<{
    formData: any;
    localMappings: any;
    customFields: any[];
  }[]>([]);
  const historyIndexRef = React.useRef<number>(-1);
  const isRestoringHistoryRef = React.useRef(false);

  const localMappingsRef = React.useRef(localMappings);
  React.useEffect(() => {
    localMappingsRef.current = localMappings;
  }, [localMappings]);

  const formDataRef = React.useRef(formData);
  React.useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const customFieldsRef = React.useRef(customFields);
  React.useEffect(() => {
    customFieldsRef.current = customFields;
  }, [customFields]);

  const commitHistory = React.useCallback((nextMappings?: any, nextFormData?: any, nextCustomFields?: any[]) => {
    if (isRestoringHistoryRef.current) return;

    const fData = nextFormData ?? formDataRef.current;
    const lMaps = nextMappings ?? localMappingsRef.current;
    const cFields = nextCustomFields ?? customFieldsRef.current;

    const entry = {
      formData: JSON.parse(JSON.stringify(fData)),
      localMappings: JSON.parse(JSON.stringify(lMaps)),
      customFields: JSON.parse(JSON.stringify(cFields)),
    };

    if (historyIndexRef.current >= 0) {
      const currentEntry = historyRef.current[historyIndexRef.current];
      if (JSON.stringify(currentEntry) === JSON.stringify(entry)) {
        return;
      }
    }

    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(entry);
    historyIndexRef.current = historyRef.current.length - 1;
  }, []);

  const undo = React.useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const entry = historyRef.current[historyIndexRef.current];
      isRestoringHistoryRef.current = true;
      setFormData(entry.formData);
      setLocalMappings(entry.localMappings);
      setCustomFields(entry.customFields);
      setTimeout(() => {
        isRestoringHistoryRef.current = false;
      }, 50);
    }
  }, []);

  const redo = React.useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const entry = historyRef.current[historyIndexRef.current];
      isRestoringHistoryRef.current = true;
      setFormData(entry.formData);
      setLocalMappings(entry.localMappings);
      setCustomFields(entry.customFields);
      setTimeout(() => {
        isRestoringHistoryRef.current = false;
      }, 50);
    }
  }, []);

  // Initialize history when mappings load
  React.useEffect(() => {
    if (Object.keys(localMappings).length > 0 && historyRef.current.length === 0) {
      historyRef.current = [{
        formData: JSON.parse(JSON.stringify(formData)),
        localMappings: JSON.parse(JSON.stringify(localMappings)),
        customFields: JSON.parse(JSON.stringify(customFields))
      }];
      historyIndexRef.current = 0;
    }
  }, [localMappings]);

  // Reset history stack on template/side switch
  React.useEffect(() => {
    historyRef.current = [];
    historyIndexRef.current = -1;
  }, [selectedDesignIndex, selectedSideIndex]);

  // 1. STATE & CALCULATIONS
  const designs = React.useMemo(() => {
    return (product as any).color_variants?.length > 0 
      ? (product as any).color_variants 
      : [
          { 
            name: 'Default Design', 
            wireframe_images: designConfig?.templates?.map((t: any) => t.preview) || product.template_images || product.images || []
          }
        ];
  }, [product, designConfig]);

  const currentDesign = designs[selectedDesignIndex] || designs[0];
  
  const allFields = React.useMemo(() => {
    const templateFields = designConfig?.templates?.[selectedDesignIndex]?.fields || product.template_fields;
    const globalFields = (designConfig?.fields && designConfig.fields.length > 0) ? designConfig.fields : null;

    let baseFields = templateFields || globalFields || [
      { id: 'name', label: 'Full Name', type: 'text', icon: 'User', placeholder: 'e.g. John Doe' },
      { id: 'title', label: 'Job Title', type: 'text', icon: 'Briefcase', placeholder: 'e.g. Creative Director' },
      { id: 'phone', label: 'Phone Number', type: 'text', icon: 'Phone', placeholder: '+91 98765 43210' },
      { id: 'email', label: 'Email Address', type: 'email', icon: 'Mail', placeholder: 'john@example.com' },
      { id: 'address', label: 'Address', type: 'textarea', icon: 'MapPin', placeholder: 'Enter address...' },
    ];

    return [...baseFields, ...customFields];
  }, [designConfig, selectedDesignIndex, product.template_fields, customFields]);

  const sidebarFields = React.useMemo(() => {
    const activeFieldIds = new Set<string>();
    const keys = Object.keys(designConfig?.mappings || {});
    keys.forEach(k => {
      if (k.startsWith(`${selectedDesignIndex}_`)) {
        const m = designConfig.mappings[k] || {};
        Object.keys(m).forEach(id => activeFieldIds.add(id));
      }
    });

    return allFields.filter((field: any) => {
      if (field.isCustom) return true;
      return activeFieldIds.has(field.id);
    });
  }, [allFields, designConfig, selectedDesignIndex]);

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
  }, [selectedDesignIndex, selectedSideIndex, designConfig, customFields]);

  // Handle Dragging & Resizing
  React.useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (!w || !h) return;

      const dx = ((e.clientX - dragStartPos.x) / w) * 100;
      const dy = ((e.clientY - dragStartPos.y) / h) * 100;

      setLocalMappings(prev => {
        const field = prev[activeField!];
        if (!field) return prev;

        if (isDragging) {
          return {
            ...prev,
            [activeField!]: {
              ...field,
              x: initialFieldPos.x + dx,
              y: initialFieldPos.y + dy
            }
          };
        } else if (isResizing) {
          return {
            ...prev,
            [activeField!]: {
              ...field,
              w: Math.max(5, initialFieldPos.w + dx),
              h: Math.max(2, initialFieldPos.h + dy)
            }
          };
        }
        return prev;
      });
    };

    const handleEnd = () => {
      if (isDragging || isResizing) {
        setIsDragging(false);
        setIsResizing(false);
        onObjectsUpdated?.();
        commitHistory();
      } else {
        setIsDragging(false);
        setIsResizing(false);
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('mouseleave', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('mouseleave', handleEnd);
    };
  }, [isDragging, isResizing, dragStartPos, activeField, initialFieldPos, onObjectsUpdated, commitHistory]);

  const handleStart = (e: React.MouseEvent, fieldId: string, action: 'move' | 'resize') => {
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
       x: Number(currentMapping.x) || 0,
       y: Number(currentMapping.y) || 0,
       w: Number(currentMapping.w) || 30,
       h: Number(currentMapping.h) || 10
    });
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
    
    const nextFields = [...customFields, newField];
    const nextFormData = initialValue ? { ...formData, [newId]: { text: initialValue } } : { ...formData };
    const nextMappings = {
       ...localMappings,
       [newId]: {
          x: 10,
          y: 10,
          w: type === 'text' ? 40 : 20,
          h: type === 'text' ? 10 : 20,
          fontSize: 16,
          color: '#FFD700',
          align: 'left'
       }
    };

    setCustomFields(nextFields);
    setFormData(nextFormData);
    setLocalMappings(nextMappings);
    setActiveField(newId);

    commitHistory(nextMappings, nextFormData, nextFields);
  };

  const handleAddIcon = (iconName: string) => {
    const newId = `icon_${Date.now()}`;
    const newField = {
      id: newId,
      label: `${iconName} Icon`,
      type: 'icon',
      defaultValue: iconName,
      isCustom: true
    };
    
    const nextFields = [...customFields, newField];
    const nextFormData = { ...formData, [newId]: { text: iconName } };
    const nextMappings = {
       ...localMappings,
       [newId]: {
          x: 40,
          y: 40,
          w: 5,
          h: 5,
          color: '#000000',
       }
    };

    setCustomFields(nextFields);
    setFormData(nextFormData);
    setLocalMappings(nextMappings);
    setActiveField(newId);
    setIsIconPickerOpen(false);

    commitHistory(nextMappings, nextFormData, nextFields);
  };

  const updateFontStyle = (fieldId: string, style: 'bold' | 'italic') => {
    setLocalMappings(prev => {
      const f = prev[fieldId];
      if (!f) return prev;
      const next = { ...prev };
      if (style === 'bold') {
        next[fieldId] = { ...f, fontWeight: f.fontWeight === 'bold' ? 'normal' : 'bold' };
      } else {
        next[fieldId] = { ...f, italic: !f.italic };
      }
      commitHistory(next);
      return next;
    });
  };

  const updateFontFamily = (fieldId: string, family: string) => {
    setLocalMappings(prev => {
      const f = prev[fieldId];
      if (!f) return prev;
      const next = { ...prev, [fieldId]: { ...f, fontFamily: family } };
      commitHistory(next);
      return next;
    });
  };

  const updateFontSize = (fieldId: string, delta: number) => {
    setLocalMappings(prev => {
      const f = prev[fieldId];
      if (!f) return prev;
      const next = {
        ...prev,
        [fieldId]: {
          ...f,
          fontSize: Math.max(6, (f.fontSize || 14) + delta)
        }
      };
      commitHistory(next);
      return next;
    });
  };

  const updateLineHeight = (fieldId: string, delta: number) => {
    setLocalMappings(prev => {
      const f = prev[fieldId];
      if (!f) return prev;
      const next = {
        ...prev,
        [fieldId]: {
          ...f,
          lineHeight: Math.max(0.8, Math.min(3, (f.lineHeight || 1.2) + delta))
        }
      };
      commitHistory(next);
      return next;
    });
  };

  const removeCustomField = (fieldId: string) => {
    const nextFields = customFields.filter(f => f.id !== fieldId);
    const nextMappings = { ...localMappings };
    delete nextMappings[fieldId];
    const nextFormData = { ...formData };
    delete nextFormData[fieldId];

    setCustomFields(nextFields);
    setLocalMappings(nextMappings);
    setFormData(nextFormData);
    if (activeField === fieldId) setActiveField(null);

    commitHistory(nextMappings, nextFormData, nextFields);
  };


  const currentPreview = currentDesign?.wireframe_images?.[selectedSideIndex] || currentDesign?.image_url || currentDesign?.wireframe_images?.[0] || '';

  // Expose methods to maintain compatibility with the DesignerCanvas interface
  useImperativeHandle(ref, () => ({
    addText: () => handleAddCustomField('text', 'Custom Text'),
    addImage: () => handleAddCustomField('image'),
    addShape: () => {},
    addIcon: () => setIsIconPickerOpen(true),
    addSvgGraphic: () => {},
    undo: () => undo(),
    redo: () => redo(),
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
    getDesignDataUrl: async () => {
      // Create a hidden canvas to render the design
      const canvas = document.createElement('canvas');
      const container = document.getElementById('template-preview-container');
      if (!container) return currentPreview;

      const rect = container.getBoundingClientRect();
      canvas.width = 1200; // High res for preview
      canvas.height = (rect.height / rect.width) * 1200;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return currentPreview;

      // Draw base image
      const baseImg = new window.Image();
      baseImg.crossOrigin = "anonymous";
      baseImg.src = currentPreview;
      
      await new Promise((resolve) => {
        baseImg.onload = resolve;
        baseImg.onerror = resolve;
      });
      
      ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

      // Draw elements
      for (const field of allFields) {
        const mapping = localMappings[field.id];
        if (!mapping) continue;

        const value = formData[field.id];
        if (!value) continue;

        const x = (mapping.x / 100) * canvas.width;
        const y = (mapping.y / 100) * canvas.height;

        if (field.type === 'image' && typeof value === 'string') {
           const itemImg = new window.Image();
           itemImg.crossOrigin = "anonymous";
           itemImg.src = value;
           await new Promise((res) => { itemImg.onload = res; itemImg.onerror = res; });
           const imgW = (mapping.w || 20) / 100 * canvas.width;
           const imgH = itemImg.height / itemImg.width * imgW;
           ctx.drawImage(itemImg, x, y, imgW, imgH);
        } else if (field.type !== 'image' && (typeof value === 'string' || typeof value === 'object')) {
           const textContent = typeof value === 'string' ? value : (value as any).text || '';
           if (!textContent) continue;

            const fontSize = (mapping.fontSize || 14) / 500 * canvas.width;
            ctx.font = `${mapping.italic ? 'italic ' : ''}${mapping.fontWeight || 'normal'} ${fontSize}px ${mapping.fontFamily || 'Inter'}`;
            ctx.fillStyle = typeof value === 'object' ? (value as any).color || mapping.color || '#FFD700' : mapping.color || '#FFD700';
            ctx.textAlign = mapping.align || 'center';
            ctx.textBaseline = 'top';
            
            const lines = String(textContent).split('\n');
            const lineHeight = (mapping.lineHeight || 1.2) * fontSize;
            lines.forEach((line, i) => {
              let drawX = x;
              const boxWidth = (mapping.w || 20) / 100 * canvas.width;
              if (mapping.align === 'center' || !mapping.align) {
                drawX = x + boxWidth / 2;
              } else if (mapping.align === 'right') {
                drawX = x + boxWidth;
              }
              ctx.fillText(line, drawX, y + (i * lineHeight));
            });
        }
      }

      return canvas.toDataURL('image/png');
    },
  } as any));



  // Fields are now handled by allFields derived from baseFields + customFields

  const getIcon = (iconName: string, props: any = {}) => {
    const icons: Record<string, any> = {
      User: User,
      Briefcase: Briefcase,
      Phone: Phone,
      Mail: Mail,
      MapPin: MapPin,
      Calendar: Calendar,
      Type: Type,
      Layout: Layout,
      Info: Info,
      Globe: Globe,
      Zap: Zap,
      Heart: Heart,
      Star: Star,
      Smile: Smile,
      Instagram: Instagram,
      Facebook: Facebook,
      Twitter: Twitter,
      Linkedin: Linkedin,
      MessageCircle: MessageCircle,
    };
    
    const IconComponent = icons[iconName];
    if (IconComponent) return <IconComponent {...props} />;
    
    // Fallback for special characters
    const emojis: Record<string, string> = {
      Flower: "🌸",
      Sparkles: "✨",
      Heart: "❤️",
      Star: "⭐",
      Sun: "☀️",
      Om: "ॐ"
    };
    
    if (emojis[iconName]) return <div className={cn("flex items-center justify-center", props.className)} style={props.style}>{emojis[iconName]}</div>;
    
    return <Info {...props} />;
  };

  const handleFieldChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onObjectsUpdated?.();
    }, 1000); // Debounce preview generation
    return () => clearTimeout(timer);
  }, [onObjectsUpdated, formData]);

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
                 product.slug?.includes('wedding') ? (
                   (currentPreview && (
                     currentPreview.includes('/wc/01/') ||
                     currentPreview.includes('/wc/02/') ||
                     currentPreview.includes('/wc/03/') ||
                     currentPreview.includes('/wc/04/') ||
                     currentPreview.includes('/wc/05/') ||
                     currentPreview.includes('/wc/06/') ||
                     currentPreview.includes('/wc/07/') ||
                     currentPreview.includes('/wc/08/') ||
                     currentPreview.includes('/wc/09/') ||
                     currentPreview.includes('/wc/10/')
                   )) ? "aspect-[7/4]" : "aspect-[2/3]"
                 ) :
                 product.slug?.includes('letter-head') ? "aspect-[1/1.41]" : 
                 "aspect-[3.5/2]"
               )}
            >
               {currentPreview ? (
                 <div 
                    id="template-preview-container" 
                    ref={containerRef}
                    className="relative w-full h-full"
                    style={{ containerType: 'inline-size' }}
                 >
                   <img 
                     src={currentPreview} 
                     alt="Preview" 
                     style={{ filter: selectedColor === '#FFFFFF' ? 'none' : `hue-rotate(${selectedDesignIndex * 20}deg) brightness(0.9)` }}
                     className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                   />
                   
                   {/* Elements layer - z-index 50 to be above overlays, handles background clicks for deselection */}
                   <div 
                      className="absolute inset-0" 
                      style={{ zIndex: 50 }}
                      onMouseDown={(e) => {
                        // Click on parent empty space deselects the active field
                        setActiveField(null);
                      }}
                    >
                      {(() => {
                         if (localMappings && Object.keys(localMappings).length > 0) {
                            return allFields.map((field: any) => {
                               const mapping = localMappings[field.id];
                               if (!mapping) return null;
                               
                               const hasWidth = !!mapping.w;
                               const left = `${mapping.x}%`;
                               const top = `${mapping.y}%`;
                               const transform = 'none';

                               const autoMaxWidth = (100 - mapping.x);

                               // CQI SCALING for text
                               // Base width of template assumed ~500px for mappings
                               const baseFontSize = mapping.fontSize || 14;
                               const cqiSize = (baseFontSize / 500) * 100;

                               return (
                                  <div
                                      key={field.id}
                                       onMouseDown={(e) => {
                                         if (!isPreview) {
                                           e.stopPropagation();
                                          setActiveField(field.id);
                                          setIsDragging(true);
                                          dragStartPosRef.current = { x: e.clientX, y: e.clientY };
                                          setDragStartPos({ x: e.clientX, y: e.clientY });
                                          const cur = localMappings[field.id] || {};
                                          setInitialFieldPos({ 
                                            x: Number(cur.x) || 0, 
                                            y: Number(cur.y) || 0, 
                                            w: Number(cur.w) || 30, 
                                            h: Number(cur.h) || 10 
                                          });
                                          
                                        }
                                      }}
                                      onMouseUp={(e) => {
                                        if (!isPreview) {
                                          const dx = e.clientX - dragStartPosRef.current.x;
                                          const dy = e.clientY - dragStartPosRef.current.y;
                                          const distance = Math.sqrt(dx * dx + dy * dy);
                                          
                                          if (distance < 5 && field.type === 'image') {
                                            const fileInput = document.getElementById(`file-input-${field.id}`);
                                            if (fileInput) {
                                              (fileInput as HTMLInputElement).click();
                                            }
                                          }
                                          
                                        }
                                      }}
                                      style={{
                                        position: 'absolute',
                                        left,
                                        top,
                                        width: hasWidth ? `${mapping.w}%` : 'auto',
                                        height: mapping.h ? `${mapping.h}%` : 'auto',
                                        minWidth: '1px',
                                        minHeight: '1px',
                                        transform,
                                        fontSize: `${cqiSize}cqi`,
                                        fontWeight: mapping.fontWeight || 'normal',
                                        fontFamily: mapping.fontFamily || 'inherit',
                                        fontStyle: mapping.italic ? 'italic' : 'normal',
                                        textAlign: mapping.align || 'center',
                                        color: formData[field.id]?.color || mapping.color || '#FFD700',
                                        opacity: mapping.opacity !== undefined ? mapping.opacity : 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: (mapping.align === 'left') ? 'flex-start' : (mapping.align === 'right') ? 'flex-end' : 'center',
                                        justifyContent: 'center',
                                        lineHeight: mapping.lineHeight || '1.2',
                                        maxWidth: mapping.maxWidth ? `${mapping.maxWidth}%` : `${autoMaxWidth}%`,
                                        zIndex: activeField === field.id ? 100 : 50,
                                        boxSizing: 'border-box',
                                        cursor: isPreview ? 'default' : 'move',
                                        touchAction: 'none',
                                      }}
                                      className={cn(
                                        "overflow-visible select-none",
                                        !isDragging && !isResizing && "transition-all duration-300 ease-out"
                                      )}
                                    >

                                      {/* CLICK CATCHER OVERLAY - Ensures the entire bounding box is draggable even without a background */}
                                      {!isPreview && <div className="absolute inset-0 cursor-move" />}

                                      {/* CONTENT DISPLAY */}
                                      <div className={cn(
                                        "relative w-full h-full flex flex-col justify-center select-none",
                                        (mapping.align === 'left') ? "items-start text-left" : (mapping.align === 'right') ? "items-end text-right" : "items-center text-center"
                                      )}>
                                        {field.type === 'image' ? (
                                           formData[field.id]?.text ? (
                                              <img src={formData[field.id].text} alt={field.label} className="w-full h-full object-contain" />
                                           ) : (
                                              <div className={cn("w-full h-full border border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50/50 p-1", isPreview && "opacity-0")}>
                                                 <Upload style={{ width: '3cqi', height: '3cqi' }} className="text-gray-400 mb-0.5" />
                                                 <span style={{ fontSize: '1.5cqi' }} className="font-black uppercase text-gray-400 text-center">Image</span>
                                              </div>
                                           )
                                        ) : field.type === 'icon' ? (
                                           <div className="w-full h-full flex items-center justify-center">
                                              {getIcon(formData[field.id]?.text || field.defaultValue || 'Phone', { 
                                                 className: "w-full h-full",
                                                 style: { color: formData[field.id]?.color || mapping.color || '#000000' }
                                              })}
                                           </div>
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
                                              onMouseDown={(e) => { e.stopPropagation(); handleStart(e, field.id, 'resize'); }}
                                              style={{ position: 'absolute', right: '-14px', bottom: '-14px', width: '28px', height: '28px', zIndex: 200, cursor: 'se-resize', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                               <div style={{ width: '18px', height: '18px', background: '#e91e63', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
                                            </div>
                                            
                                            {/* Top Left Handle */}
                                            <div 
                                              onMouseDown={(e) => { e.stopPropagation(); handleStart(e, field.id, 'resize'); }}
                                              style={{ position: 'absolute', left: '-14px', top: '-14px', width: '28px', height: '28px', zIndex: 200, cursor: 'nw-resize', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                               <div style={{ width: '14px', height: '14px', background: 'white', borderRadius: '50%', border: '2px solid #e91e63', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                                            </div>

                                            {/* Bottom Left Handle */}
                                            <div 
                                              onMouseDown={(e) => { e.stopPropagation(); handleStart(e, field.id, 'resize'); }}
                                              style={{ position: 'absolute', left: '-14px', bottom: '-14px', width: '28px', height: '28px', zIndex: 200, cursor: 'sw-resize', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                               <div style={{ width: '14px', height: '14px', background: 'white', borderRadius: '50%', border: '2px solid #e91e63', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                                            </div>

                                            {/* Top Right Handle */}
                                            <div 
                                              onMouseDown={(e) => { e.stopPropagation(); handleStart(e, field.id, 'resize'); }}
                                              style={{ position: 'absolute', right: '-14px', top: '-14px', width: '28px', height: '28px', zIndex: 200, cursor: 'ne-resize', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                               <div style={{ width: '14px', height: '14px', background: 'white', borderRadius: '50%', border: '2px solid #e91e63', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                                            </div>
                                         </>
                                      )}

                                      {/* Formatting Toolbar */}
                                      {!isPreview && activeField === field.id && (
                                         <div 
                                           onMouseDown={(e) => e.stopPropagation()}
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
                                                  <button 
                                                    onClick={() => {
                                                      setLocalMappings(prev => {
                                                        const f = prev[field.id];
                                                        return f ? { ...prev, [field.id]: { ...f, align: 'left' } } : prev;
                                                      });
                                                    }} 
                                                    className={cn("w-5 h-5 rounded text-[9px] flex items-center justify-center font-black", mapping.align === 'left' ? "bg-brand-pink text-white" : "hover:bg-gray-100 text-gray-500")}
                                                    title="Align Left"
                                                  >L</button>
                                                  <button 
                                                    onClick={() => {
                                                      setLocalMappings(prev => {
                                                        const f = prev[field.id];
                                                        return f ? { ...prev, [field.id]: { ...f, align: 'center' } } : prev;
                                                      });
                                                    }} 
                                                    className={cn("w-5 h-5 rounded text-[9px] flex items-center justify-center font-black", (!mapping.align || mapping.align === 'center') ? "bg-brand-pink text-white" : "hover:bg-gray-100 text-gray-500")}
                                                    title="Align Center"
                                                  >C</button>
                                                  <button 
                                                    onClick={() => {
                                                      setLocalMappings(prev => {
                                                        const f = prev[field.id];
                                                        return f ? { ...prev, [field.id]: { ...f, align: 'right' } } : prev;
                                                      });
                                                    }} 
                                                    className={cn("w-5 h-5 rounded text-[9px] flex items-center justify-center font-black", mapping.align === 'right' ? "bg-brand-pink text-white" : "hover:bg-gray-100 text-gray-500")}
                                                    title="Align Right"
                                                  >R</button>
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
                                                 <button onClick={() => removeCustomField(field.id)} className="w-5 h-5 rounded text-[9px] hover:bg-red-50 text-red-500 flex items-center justify-center" title="Delete Element"><Trash2 className="w-3 h-3" /></button>
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

           {/* FLOATING UNDO/REDO CONTROLS */}
           <div className="absolute bottom-6 right-6 flex gap-2 z-50 pointer-events-auto">
              <button 
                 onClick={undo}
                 disabled={historyIndexRef.current <= 0}
                 className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-lg flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                 title="Undo"
              >
                 <Undo className="w-4 h-4" />
              </button>
              <button 
                 onClick={redo}
                 disabled={historyIndexRef.current >= historyRef.current.length - 1}
                 className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-lg flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                 title="Redo"
              >
                 <Redo className="w-4 h-4" />
              </button>
           </div>
        </div>

        {/* Side Controls (Front/Back) - BOTTOM on mobile, TOP on desktop */}
        <div className="absolute bottom-4 md:top-6 md:bottom-auto left-1/2 -translate-x-1/2 z-50 w-max max-w-[95%] pointer-events-auto">
          <div className="flex items-center justify-center gap-2 bg-white/90 backdrop-blur-md rounded-full p-1 border border-gray-200 shadow-md overflow-x-auto no-scrollbar">
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
                     "px-5 md:px-6 py-1.5 md:py-2 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] transition-all relative overflow-hidden shrink-0",
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
              <h2 className="text-lg font-bold text-brand-dark tracking-tight">add custom details</h2>
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
                  <button 
                    onClick={() => setIsIconPickerOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-md transition-all text-[10px] font-black uppercase tracking-widest text-brand-pink"
                  >
                    <Smile className="w-3 h-3" /> Icon
                  </button>
              </div>
            </div>
            
            {/* Icon Picker Overlay */}
            <AnimatePresence>
               {isIconPickerOpen && (
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="p-4 bg-white border border-gray-100 rounded-2xl shadow-xl space-y-4"
                  >
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Icon</span>
                        <button onClick={() => setIsIconPickerOpen(false)} className="text-gray-400 hover:text-brand-dark"><X className="w-4 h-4" /></button>
                     </div>
                     <div className="grid grid-cols-5 gap-2">
                        {['Phone', 'Mail', 'MapPin', 'Briefcase', 'Globe', 'Zap', 'Heart', 'Star', 'Smile', 'Instagram', 'Facebook', 'Twitter', 'Linkedin', 'MessageCircle'].map(iconName => (
                           <button 
                              key={iconName}
                              onClick={() => handleAddIcon(iconName)}
                              className="aspect-square flex items-center justify-center bg-gray-50 hover:bg-brand-pink/10 hover:text-brand-pink rounded-lg transition-all"
                              title={iconName}
                           >
                              {getIcon(iconName, { className: "w-5 h-5" })}
                           </button>
                        ))}
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
            
            <div className="space-y-4">
              {sidebarFields.map((field: any) => (
                <div key={field.id} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{field.label}</label>
                    {field.type !== 'image' && (
                      <div className="flex gap-1">
                        {['#FFD700', '#FFFFFF', '#000000', '#FF1493', '#800000', '#1A4D2E'].map(c => (
                          <button 
                            key={c}
                            onClick={() => {
                              setFormData(prev => {
                                const next = { ...prev, [field.id]: { ...(prev[field.id] || { text: '' }), color: c } };
                                commitHistory(null, next);
                                return next;
                              });
                            }}
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
                       onBlur={() => commitHistory()}
                       placeholder={field.placeholder}
                       className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/10 transition-all outline-none text-sm resize-none"
                    />
                  ) : field.type === 'icon' ? (
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center shrink-0">
                          {getIcon(formData[field.id]?.text || field.defaultValue || 'Phone', { className: "w-5 h-5" })}
                       </div>
                       <div className="flex-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Position on canvas to display</p>
                          <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
                             {['Phone', 'Mail', 'MapPin', 'Briefcase', 'Globe', 'Zap', 'Heart', 'Star'].map(i => (
                                <button 
                                   key={i}
                                   onClick={() => setFormData(prev => ({ ...prev, [field.id]: { ...(prev[field.id] || { text: '' }), text: i } }))}
                                   className={cn(
                                      "px-2 py-1 rounded-md text-[9px] font-bold transition-all shrink-0",
                                      (formData[field.id]?.text || field.defaultValue) === i ? "bg-brand-pink text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                   )}
                                >
                                   {i}
                                </button>
                             ))}
                          </div>
                       </div>
                    </div>
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
                          id={`file-input-${field.id}`}
                          type="file" 
                          className="hidden" 
                          onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                   setFormData(prev => {
                                      const next = { ...prev, [field.id]: { ...(prev[field.id] || { text: '' }), text: reader.result as string } };
                                      commitHistory(null, next);
                                      return next;
                                   });
                                };
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
                       onBlur={() => commitHistory()}
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
