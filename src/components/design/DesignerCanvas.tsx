"use client";

import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { iconLibrary } from '@/lib/data/icons';

export interface CanvasObjectProperties {
  type: string;
  id?: string;
  fill?: string;
  opacity?: number;
  angle?: number;
  left?: number;
  top?: number;
  scaleX?: number;
  scaleY?: number;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  charSpacing?: number;
  lineHeight?: number;
  textAlign?: string;
  shadow?: { color: string; blur: number; offsetX: number; offsetY: number };
  _isGrayscale?: boolean;
  _brightness?: number;
  _contrast?: number;
  _naturalWidth?: number; // Added for DPI check
  _naturalHeight?: number; // Added for DPI check
  stroke?: string;
  strokeWidth?: number;
  _curve?: number;
  locked?: boolean;
  visible?: boolean;
}

interface DesignerCanvasProps {
  productImage: string;
  productColor?: string;
  isDrawingMode?: boolean;
  drawingColor?: string;
  drawingWidth?: number;
  onSelectionCleared?: () => void;
  onObjectSelected?: (properties: CanvasObjectProperties) => void;
  onObjectModified?: (properties: CanvasObjectProperties) => void;
  onObjectsUpdated?: () => void;
  onHistoryChange?: () => void;
  onOutOfBoundsWarning?: (isOut: boolean) => void; 
  onLowQualityWarning?: (isLowQuality: boolean) => void;
}

export interface DesignerCanvasRef {
  addText: (text: string) => void;
  addImage: (url: string) => void;
  addShape: (type: 'circle' | 'rect' | 'triangle' | 'star' | 'heart' | 'line') => void;
  addIcon: (iconName: string) => void;
  addSvgGraphic: (svgString: string, name: string) => void;
  updateActiveObject: (properties: Partial<CanvasObjectProperties>) => void;
  updateObjectById: (id: string, properties: Partial<CanvasObjectProperties>) => void;
  setTextShadow: (options: { color: string; blur: number; offsetX: number; offsetY: number } | null) => void;
  setTextOutline: (options: { color: string; width: number } | null) => void;
  deleteActiveObject: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  downloadDesign: () => void;
  getJson: () => any;
  loadJson: (json: any) => void;
  getLayers: () => any[];
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  duplicateActiveObject: () => void;
  toggleLock: () => void;
  removeImageBackground: () => Promise<boolean>;
  undo: () => void;
  redo: () => void;
  setPanning: (enabled: boolean) => void;
}

const getObjectProperties = (obj: any): CanvasObjectProperties => {
  const props: CanvasObjectProperties = {
    type: obj.type,
    id: obj.id,
    fill: obj.fill,
    opacity: obj.opacity,
    angle: obj.angle,
    left: obj.left,
    top: obj.top,
    scaleX: obj.scaleX,
    scaleY: obj.scaleY,
    locked: obj.lockMovementX || false,
    visible: obj.visible !== false,
  };

  if (obj.type === 'i-text' || obj.type === 'text') {
    props.text = obj.text;
    props.fontFamily = obj.fontFamily;
    props.fontSize = obj.fontSize;
    props.charSpacing = obj.charSpacing;
    props.lineHeight = obj.lineHeight;
    props.textAlign = obj.textAlign;
    props.stroke = obj.stroke;
    props.strokeWidth = obj.strokeWidth;
    props._curve = obj._curve;
    if (obj.shadow) {
      props.shadow = {
        color: obj.shadow.color || 'rgba(0,0,0,0)',
        blur: obj.shadow.blur || 0,
        offsetX: obj.shadow.offsetX || 0,
        offsetY: obj.shadow.offsetY || 0,
      };
    }
  }

  if (obj.type === 'image') {
    props._isGrayscale = obj._isGrayscale || false;
    props._brightness = obj._brightness || 0;
    props._contrast = obj._contrast || 0;
    props._naturalWidth = obj._naturalWidth;
    props._naturalHeight = obj._naturalHeight;
  }

  return props;
};

const DesignerCanvas = React.forwardRef<DesignerCanvasRef, DesignerCanvasProps>(({
  productImage,
  productColor,
  isDrawingMode = false,
  drawingColor = '#E91E63',
  drawingWidth = 5,
  onSelectionCleared,
  onObjectSelected,
  onObjectModified,
  onObjectsUpdated,
  onHistoryChange,
  onOutOfBoundsWarning,
  onLowQualityWarning
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const productColorRef = useRef(productColor);
  
  useEffect(() => {
    productColorRef.current = productColor;
  }, [productColor]);

  // Safe Zone parameters
  const safeZoneMargin = 60; 

  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!canvasRef.current || canvas) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 625,
      // backgroundColor transparent so the standard mock image shines through
      preserveObjectStacking: true,
      selectionColor: 'rgba(24, 144, 255, 0.05)',
      selectionBorderColor: '#1890ff',
      selectionLineWidth: 1,
    });

    fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: '#FFFFFF',
      cornerStrokeColor: '#1890ff',
      borderColor: '#1890ff',
      cornerSize: 8,
      padding: 4,
      cornerStyle: 'circle',
      borderDashArray: [4, 4],
      borderScaleFactor: 1.2,
    });

    // UNDO/REDO HISTORY LOGIC
    const history: string[] = [];
    let historyIndex = -1;
    let isApplyingHistory = false;

    const saveHistory = () => {
      if (isApplyingHistory) return;
      try {
        const json = JSON.stringify(fabricCanvas.toObject(['id', 'selectable', 'evented', 'name']));
        
        if (historyIndex < history.length - 1) {
          history.splice(historyIndex + 1);
        }
        
        history.push(json);
        if (history.length > 50) history.shift();
        else historyIndex++;
      } catch (err) {
        // Silently ignore serialization errors (e.g. partially-initialized SVG groups)
        console.warn('DesignerCanvas: Could not save history state:', err);
      }
    };

    // Events that trigger history saving
    fabricCanvas.on('object:added', (e) => {
      if ((e.target as any)?.id === 'safe_zone_indicator') return;
      // Defer to next frame so complex objects (SVG groups, etc.) are fully initialized
      requestAnimationFrame(() => saveHistory());
    });
    fabricCanvas.on('object:modified', saveHistory);
    fabricCanvas.on('object:removed', (e) => {
      if ((e.target as any)?.id === 'safe_zone_indicator') return;
      saveHistory();
    });

    // Initial state
    saveHistory();

    // Attach internal methods to the canvas instance
    (fabricCanvas as any).undo = () => {
      if (historyIndex > 0) {
        isApplyingHistory = true;
        historyIndex--;
        fabricCanvas.loadFromJSON(history[historyIndex], () => {
          fabricCanvas.renderAll();
          isApplyingHistory = false;
        });
      }
    };

    (fabricCanvas as any).redo = () => {
      if (historyIndex < history.length - 1) {
        isApplyingHistory = true;
        historyIndex++;
        fabricCanvas.loadFromJSON(history[historyIndex], () => {
          fabricCanvas.renderAll();
          isApplyingHistory = false;
        });
      }
    };

    // ALWAYS-ON-TOP SAFE ZONE GUIDE (Matches Printify/Printful UX)
    fabricCanvas.on('after:render', function() {
      const ctx = fabricCanvas.getContext();
      ctx.save();
      
      // Transform with viewport so the safe-zone moves when user pans/zooms
      const vpt = fabricCanvas.viewportTransform;
      if (vpt) {
        ctx.transform(vpt[0], vpt[1], vpt[2], vpt[3], vpt[4], vpt[5]);
      }

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)'; // Darker dashed border for visibility
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      // Position the safe zone precisely on the chest of the template
      const boxW = 200;
      const boxH = 320;
      const boxX = 150; // (500-200)/2
      const boxY = 120; // Chest placement
      
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      ctx.restore();
    });

    // PANNING LOGIC
    fabricCanvas.on('mouse:down', function(opt) {
      const evt = opt.e;
      if ((fabricCanvas as any).isPanning) {
        (fabricCanvas as any).isDragging = true;
        fabricCanvas.selection = false;
        (fabricCanvas as any).lastPosX = evt.clientX;
        (fabricCanvas as any).lastPosY = evt.clientY;
      }
    });

    fabricCanvas.on('mouse:move', function(opt) {
      if ((fabricCanvas as any).isDragging) {
        const e = opt.e;
        const vpt = fabricCanvas.viewportTransform;
        vpt![4] += e.clientX - (fabricCanvas as any).lastPosX;
        vpt![5] += e.clientY - (fabricCanvas as any).lastPosY;
        fabricCanvas.requestRenderAll();
        (fabricCanvas as any).lastPosX = e.clientX;
        (fabricCanvas as any).lastPosY = e.clientY;
      }
    });

    fabricCanvas.on('mouse:up', function(opt) {
      // on mouse up we want to recalculate new interaction
      // for all objects, so we call setViewportTransform
      fabricCanvas.setViewportTransform(fabricCanvas.viewportTransform!);
      (fabricCanvas as any).isDragging = false;
      fabricCanvas.selection = true;
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
      setCanvas(null);
    };
  }, []);

  // Sync isDrawingMode
  useEffect(() => {
    if (!canvas) return;
    canvas.isDrawingMode = isDrawingMode;
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = drawingColor;
      canvas.freeDrawingBrush.width = drawingWidth;
    }
    canvas.renderAll();
  }, [canvas, isDrawingMode, drawingColor, drawingWidth]);

  // Handle Product Background
  useEffect(() => {
    if (!canvas || !productImage) return;

    let modifiedUrl = productImage;
    const isSvgMock = productImage.startsWith('data:image/svg+xml');
    
    if (isSvgMock && productColor && productColor.toUpperCase() !== '#FFFFFF') {
       try {
         const decoded = decodeURIComponent(productImage.substring(productImage.indexOf(',') + 1));
         const recolored = decoded.replace(/fill="#fff"/g, `fill="${productColor}"`);
         modifiedUrl = `data:image/svg+xml;utf8,${encodeURIComponent(recolored)}`;
       } catch(e) {
         console.warn("Could not modify SVG fill", e);
       }
    }

    fabric.Image.fromURL(modifiedUrl, (img) => {
      if (!img) {
        console.error(`DesignerCanvas: Failed to load image object for ${productImage}`);
        return;
      }

      console.log(`DesignerCanvas: Image loaded. Natural dimensions: ${img.width}x${img.height}`);

      img.set({
        selectable: false,
        evented: false,
        originX: 'center',
        originY: 'center',
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        crossOrigin: 'anonymous',
        //@ts-ignore
        id: 'product_base_image'
      });
      
      const canvasAspect = canvas.width! / canvas.height!;
      const imgAspect = img.width! / img.height!;
      
      // Calculate scale to fit within canvas (contain) preserving aspect ratio
      const padding = 40; // 40px padding around the image
      const availableWidth = canvas.width! - padding * 2;
      const availableHeight = canvas.height! - padding * 2;
      
      const widthScale = availableWidth / img.width!;
      const heightScale = availableHeight / img.height!;
      const scale = Math.min(widthScale, heightScale);
      
      console.log(`DesignerCanvas: Applying scale ${scale} at center (${canvas.width!/2}, ${canvas.height!/2})`);
      
      img.scale(scale);
      
      // Add shadow for depth
      img.set({
        shadow: new fabric.Shadow({
          color: 'rgba(0,0,0,0.05)',
          blur: 15,
          offsetX: 0,
          offsetY: 8,
        })
      });

      const existingBase = canvas.getObjects().find(obj => (obj as any).id === 'product_base_image');
      if (existingBase) canvas.remove(existingBase);
      const existingFill = canvas.getObjects().find(obj => (obj as any).id === 'product_color_fill');
      if (existingFill) canvas.remove(existingFill);

      if (!isSvgMock && productColor && productColor.toUpperCase() !== '#FFFFFF') {
         const fillRect = new fabric.Rect({
           left: canvas.width! / 2,
           top: canvas.height! / 2,
           originX: 'center', originY: 'center',
           width: img.getScaledWidth() * 0.98,
           height: img.getScaledHeight() * 0.98,
           fill: productColor,
           selectable: false, evented: false,
           //@ts-ignore
           id: 'product_color_fill'
         });
         canvas.insertAt(fillRect, 0, false);
         canvas.insertAt(img, 1, false);
      } else {
         canvas.insertAt(img, 0, false);
      }
      
      canvas.renderAll();

      // Implement DPI Checker & Alignment Guides
      const GUIDELINE_COLOR = '#4F46E5';
      const GUIDELINE_WIDTH = 1;
      const SNAP_THRESHOLD = 5;

      let vLine: fabric.Line | null = null;
      let hLine: fabric.Line | null = null;

      const checkQuality = () => {
        const objects = canvas.getObjects();
        let lowResFound = false;
        const INCHES = 14; 
        const ppiOnCanvas = canvas.width! / INCHES;

        objects.forEach((obj: any) => {
          if (obj.type === 'image' && obj._element) {
            const currentWidth = obj.getScaledWidth();
            const physicalWidth = currentWidth / ppiOnCanvas;
            const dpi = obj._element.naturalWidth / physicalWidth;
            if (dpi < 150) lowResFound = true;
          }
        });
        if (onLowQualityWarning) onLowQualityWarning(lowResFound);
      };

      canvas.on('object:modified', checkQuality);
      canvas.on('object:added', checkQuality);
      canvas.on('object:removed', checkQuality);

      canvas.on('object:moving', (e) => {
        const obj = e.target;
        if (!obj) return;

        const centerX = obj.getCenterPoint().x;
        const centerY = obj.getCenterPoint().y;
        const canvasCenter = canvas.getCenter();

        // Remove old lines
        if (vLine) canvas.remove(vLine);
        if (hLine) canvas.remove(hLine);

        // Vertical Center Alignment
        if (Math.abs(centerX - canvasCenter.left) < SNAP_THRESHOLD) {
          obj.set({ left: canvasCenter.left - (obj.width! * obj.scaleX! / 2) + (obj.originX === 'center' ? (obj.width! * obj.scaleX! / 2) : 0) }).setCoords();
          // Simplified snap for now
          if (obj.originX === 'center') obj.set({ left: canvasCenter.left });
          
          vLine = new fabric.Line([canvasCenter.left, 0, canvasCenter.left, canvas.height!], {
            stroke: GUIDELINE_COLOR,
            strokeWidth: GUIDELINE_WIDTH,
            selectable: false,
            evented: false,
            opacity: 0.5,
            //@ts-ignore
            id: 'guide-v'
          });
          canvas.add(vLine);
        }

        // Horizontal Center Alignment
        if (Math.abs(centerY - canvasCenter.top) < SNAP_THRESHOLD) {
          if (obj.originY === 'center') obj.set({ top: canvasCenter.top });

          hLine = new fabric.Line([0, canvasCenter.top, canvas.width!, canvasCenter.top], {
            stroke: GUIDELINE_COLOR,
            strokeWidth: GUIDELINE_WIDTH,
            selectable: false,
            evented: false,
            opacity: 0.5,
            //@ts-ignore
            id: 'guide-h'
          });
          canvas.add(hLine);
        }

        canvas.renderAll();
      });

      canvas.on('mouse:up', () => {
        const objects = canvas.getObjects();
        objects.forEach(obj => {
          if ((obj as any).id === 'guide-v' || (obj as any).id === 'guide-h') {
            canvas.remove(obj);
          }
        });
        vLine = null;
        hLine = null;
        canvas.renderAll();
      });

      console.log("DesignerCanvas: Product base image successfully rendered with contrast shadow");
    }, { crossOrigin: 'anonymous' });
  }, [canvas, productImage, productColor]);

  // Guidelines and Object Checking Logic
  useEffect(() => {
    if (!canvas) return;

    let vLine: fabric.Line | null = null;
    let hLine: fabric.Line | null = null;

    const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
      return new fabric.Line([x1, y1, x2, y2], {
        stroke: '#00e5ff', // Cyan smart guide
        strokeWidth: 1,
        selectable: false,
        evented: false,
        opacity: 0.8
      });
    };

    const checkBoundsAndQuality = (activeObject: fabric.Object) => {
      // 1. Check out of bounds
      activeObject.setCoords();
      const br = activeObject.getBoundingRect();
      
      // The safe zone area is [margin, margin] to [width-margin, height-margin]
      const isOut = (
        br.left < safeZoneMargin ||
        br.top < safeZoneMargin ||
        br.left + br.width > canvas.width! - safeZoneMargin ||
        br.top + br.height > canvas.height! - safeZoneMargin
      );
      
      onOutOfBoundsWarning?.(isOut);

      // 2. Check Image DPI / Quality
      if (activeObject.type === 'image') {
        const img = activeObject as fabric.Image;
        const currentWidth = img.getScaledWidth();
        // @ts-ignore custom prop
        const nWidth = img._naturalWidth || img.width;
        
        // If scaled to be > 1.5x its natural 1:1 pixels, flag low quality (simplified dpi logic)
        if (nWidth && currentWidth > nWidth * 1.5) {
          onLowQualityWarning?.(true);
        } else {
          onLowQualityWarning?.(false);
        }
      }
    };

    const handleObjectMoving = (e: fabric.IEvent) => {
      const obj = e.target;
      if (!obj) return;

      // Smart Snapping to Center
      const snapOffset = 15;
      const centerX = canvas.width! / 2;
      const centerY = canvas.height! / 2;

      // Current object center
      const objCx = obj.left! + (obj.originX === 'center' ? 0 : obj.getScaledWidth() / 2);
      const objCy = obj.top! + (obj.originY === 'center' ? 0 : obj.getScaledHeight() / 2);

      // Snap X
      if (Math.abs(objCx - centerX) < snapOffset) {
        obj.set('left', obj.originX === 'center' ? centerX : centerX - obj.getScaledWidth() / 2);
        if (!vLine) {
          vLine = drawLine(centerX, 0, centerX, canvas.height!);
          canvas.add(vLine);
        }
      } else {
        if (vLine) { canvas.remove(vLine); vLine = null; }
      }

      // Snap Y
      if (Math.abs(objCy - centerY) < snapOffset) {
        obj.set('top', obj.originY === 'center' ? centerY : centerY - obj.getScaledHeight() / 2);
        if (!hLine) {
          hLine = drawLine(0, centerY, canvas.width!, centerY);
          canvas.add(hLine);
        }
      } else {
        if (hLine) { canvas.remove(hLine); hLine = null; }
      }

      checkBoundsAndQuality(obj);
    };

    const handleObjectScaling = (e: fabric.IEvent) => {
      if (e.target) checkBoundsAndQuality(e.target);
    };

    const cleanupLines = () => {
      if (vLine) { canvas.remove(vLine); vLine = null; }
      if (hLine) { canvas.remove(hLine); hLine = null; }
    };

    // Zoom Handling (Wheel)
    const handleWheel = (opt: any) => {
      const evt = opt.e;
      // Require Ctrl key for zooming to prevent accidental scrolling zooms
      if (evt.ctrlKey) {
          let zoom = canvas.getZoom();
          zoom *= 0.999 ** evt.deltaY;
          if (zoom > 5) zoom = 5;
          if (zoom < 0.5) zoom = 0.5;
          
          canvas.zoomToPoint({ x: evt.offsetX, y: evt.offsetY }, zoom);
          opt.e.preventDefault();
          opt.e.stopPropagation();
          setZoomLevel(zoom);
      }
    };

    canvas.on('object:moving', handleObjectMoving);
    canvas.on('object:scaling', handleObjectScaling);
    canvas.on('before:render', cleanupLines);
    canvas.on('mouse:wheel', handleWheel);

    return () => {
      canvas.off('object:moving', handleObjectMoving);
      canvas.off('object:scaling', handleObjectScaling);
      canvas.off('before:render', cleanupLines);
      canvas.off('mouse:wheel', handleWheel);
    };
  }, [canvas, onOutOfBoundsWarning, onLowQualityWarning]);

  // Main Events
  useEffect(() => {
    if (!canvas) return;

    const emitSelection = () => {
      const activeObj = canvas.getActiveObject();
      if (activeObj && (activeObj as any).id !== 'safe_zone_indicator') {
        onObjectSelected?.(getObjectProperties(activeObj));
        // Reset quality warning initially
        onLowQualityWarning?.(false);
      } else {
        onSelectionCleared?.();
        onOutOfBoundsWarning?.(false);
        onLowQualityWarning?.(false);
      }
    };

    const emitModification = () => {
      const activeObj = canvas.getActiveObject();
      if (activeObj) {
        onObjectModified?.(getObjectProperties(activeObj));
      }
      onHistoryChange?.();
    };

    const handleObjectAddedRemoved = (e: any) => {
      // Ignore safe zone from triggering layers
      if (e.target && (e.target as any).id === 'safe_zone_indicator') return;
      onObjectsUpdated?.();
      onHistoryChange?.();
    };

    canvas.on('selection:created', emitSelection);
    canvas.on('selection:updated', emitSelection);
    canvas.on('selection:cleared', emitSelection);
    canvas.on('object:modified', emitModification);
    canvas.on('path:created', handleObjectAddedRemoved); 

    return () => {
      canvas.off('selection:created', emitSelection);
      canvas.off('selection:updated', emitSelection);
      canvas.off('selection:cleared', emitSelection);
      canvas.off('object:modified', emitModification);
      canvas.off('path:created', handleObjectAddedRemoved);
    };
  }, [canvas, onObjectSelected, onSelectionCleared, onObjectModified, onHistoryChange, onObjectsUpdated, onOutOfBoundsWarning, onLowQualityWarning]);

  const applyImageFilters = (img: any, props: { grayscale?: boolean; brightness?: number; contrast?: number }) => {
    const filters = [];
    if (props.grayscale) filters.push(new fabric.Image.filters.Grayscale());
    if (props.brightness !== undefined && props.brightness !== 0) {
      filters.push(new fabric.Image.filters.Brightness({ brightness: props.brightness / 100 }));
    }
    if (props.contrast !== undefined && props.contrast !== 0) {
      filters.push(new fabric.Image.filters.Contrast({ contrast: props.contrast / 100 }));
    }
    img.filters = filters;
    img.applyFilters();
  };

  React.useImperativeHandle(ref, () => ({
    addText: (text: string) => {
      if (!canvas) return;
      const t = new fabric.IText(text, {
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        fontFamily: 'Inter',
        fontSize: 32,
        fill: '#000000',
        originX: 'center',
        originY: 'center',
        //@ts-ignore
        id: `text_${Date.now()}`
      });
      canvas.add(t);
      canvas.setActiveObject(t);
      canvas.renderAll();
      onObjectsUpdated?.();
      onHistoryChange?.();
    },
    addImage: (url: string) => {
      if (!canvas) return;
      fabric.Image.fromURL(url, (img) => {
        img.set({
          left: canvas.width! / 2,
          top: canvas.height! / 2,
          originX: 'center',
          originY: 'center',
          crossOrigin: 'anonymous',
          //@ts-ignore
          id: `img_${Date.now()}`,
          _isGrayscale: false,
          _brightness: 0,
          _contrast: 0,
          _naturalWidth: img.width, // store natural size for DPI check
          _naturalHeight: img.height
        });
        
        if (img.width! > canvas.width! * 0.8) {
          img.scaleToWidth(canvas.width! * 0.8);
        }

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        onObjectsUpdated?.();
        onHistoryChange?.();
      }, { crossOrigin: 'anonymous' });
    },
    addShape: (type: 'circle' | 'rect' | 'triangle' | 'star' | 'heart' | 'line') => {
      if (!canvas) return;
      let shape: fabric.Object | undefined;
      const commonProps = {
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        fill: '#5b5b42',
        originX: 'center',
        originY: 'center',
        //@ts-ignore
        id: `shape_${Date.now()}`
      };

      if (type === 'circle') shape = new fabric.Circle({ ...commonProps, radius: 40 });
      else if (type === 'rect') shape = new fabric.Rect({ ...commonProps, width: 80, height: 80 });
      else if (type === 'triangle') shape = new fabric.Triangle({ ...commonProps, width: 80, height: 80 });
      else if (type === 'line') shape = new fabric.Rect({ ...commonProps, width: 100, height: 2 });
      else if (type === 'heart') {
         shape = new fabric.Path('M 272.701 51.272 C 246.408 25.592 212.714 10.897 170.141 10.897 C 116.533 10.897 73.018 54.412 73.018 108.021 C 73.018 135.021 84.018 160.021 102.018 178.021 L 272.701 348.704 L 443.384 178.021 C 461.384 160.021 472.384 135.021 472.384 108.021 C 472.384 54.412 428.869 10.897 375.261 10.897 C 332.688 10.897 298.994 25.592 272.701 51.272 Z', { ...commonProps, scaleX: 0.1, scaleY: 0.1 });
      } else if (type === 'star') {
         shape = new fabric.Path('M 128 0 L 168 80 L 256 93 L 192 155 L 207 243 L 128 201 L 49 243 L 64 155 L 0 93 L 88 80 Z', { ...commonProps, scaleX: 0.3, scaleY: 0.3 });
      }

      if (shape) {
        canvas.add(shape);
        canvas.setActiveObject(shape);
        canvas.renderAll();
        onObjectsUpdated?.();
        onHistoryChange?.();
      }
    },
    addIcon: (iconName: string) => {
      const pathData = iconLibrary[iconName];
      if (!pathData || !canvas) return;
      
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${iconName.toLowerCase()}"><path d="${pathData}"/></svg>`;
      
      fabric.loadSVGFromString(svgString, (objects, options) => {
        const obj = fabric.util.groupSVGElements(objects, options);
        obj.set({
          left: canvas.width! / 2,
          top: canvas.height! / 2,
          originX: 'center',
          originY: 'center',
          cornerStyle: 'circle',
          cornerColor: '#E91E63',
          cornerStrokeColor: '#FFFFFF',
          transparentCorners: false,
          borderColor: '#E91E63',
          padding: 10,
          //@ts-ignore
          id: `icon-${Date.now()}`
        });
        
        // Scale to a reasonable size
        const targetSize = 120;
        const scale = targetSize / Math.max(obj.width || 1, obj.height || 1);
        obj.scale(scale);
        
        canvas.add(obj);
        canvas.setActiveObject(obj);
        canvas.renderAll();
        onObjectsUpdated?.();
        onHistoryChange?.();
      });
    },
    addSvgGraphic: (svgString: string, name: string) => {
      if (!canvas) return;
      fabric.loadSVGFromString(svgString, (objects, options) => {
        const obj = fabric.util.groupSVGElements(objects, options);
        obj.set({
          left: canvas.width! / 2,
          top: canvas.height! / 2,
          originX: 'center',
          originY: 'center',
          cornerStyle: 'circle',
          cornerColor: '#E91E63',
          borderColor: '#E91E63',
          padding: 10,
          //@ts-ignore
          id: `graphic_${Date.now()}`,
          //@ts-ignore
          name: name,
        });
        // Scale to a reasonable print size (160px)
        const targetSize = 160;
        const scale = targetSize / Math.max(obj.width || 1, obj.height || 1);
        obj.scale(scale);
        canvas.add(obj);
        canvas.setActiveObject(obj);
        canvas.renderAll();
        onObjectsUpdated?.();
        onHistoryChange?.();
      });
    },
    updateActiveObject: (properties: Partial<CanvasObjectProperties>) => {
      if (!canvas) return;
      const activeObj = canvas.getActiveObject();
      if (!activeObj) return;

      if (properties.fill !== undefined) {
        activeObj.set('fill', properties.fill);
        if (activeObj.type === 'group') {
          (activeObj as fabric.Group).getObjects().forEach(child => {
            child.set('fill', properties.fill);
          });
        }
      }
      if (properties.opacity !== undefined) activeObj.set('opacity', properties.opacity);
      if (properties.angle !== undefined) activeObj.set('angle', properties.angle);
      
      if (activeObj.type === 'i-text' || activeObj.type === 'text') {
        const textObj = activeObj as fabric.IText;
        if (properties.text !== undefined) textObj.set('text', properties.text);
        if (properties.fontFamily !== undefined) textObj.set('fontFamily', properties.fontFamily);
        if (properties.fontSize !== undefined) textObj.set('fontSize', properties.fontSize);
        if (properties.charSpacing !== undefined) textObj.set('charSpacing', properties.charSpacing);
        if (properties.lineHeight !== undefined) textObj.set('lineHeight', properties.lineHeight);
        if (properties.textAlign !== undefined) textObj.set('textAlign', properties.textAlign);
        if (properties.stroke !== undefined) {
           textObj.set('stroke', properties.stroke || '');
           // @ts-ignore
           textObj.set('strokeUniform', true);
        }
        if (properties.strokeWidth !== undefined) textObj.set('strokeWidth', properties.strokeWidth);
        
        if (properties._curve !== undefined) {
          (textObj as any)._curve = properties._curve;
          if (properties._curve === 0) {
            // @ts-ignore
            textObj.set('path', null);
          } else {
             const w = textObj.width || 200;
             const h = properties._curve * (w / 100); 
             // @ts-ignore
             const path = new fabric.Path(`M 0 0 Q ${w/2} ${h} ${w} 0`, { fill: '', stroke: '', visible: false });
             // @ts-ignore
             textObj.set('path', path);
          }
        }

        if (properties.shadow !== undefined) {
          textObj.set('shadow', new fabric.Shadow(properties.shadow));
        }
      }

      if (activeObj.type === 'image') {
        const imgObj = activeObj as any;
        const needsFilterUpdate = properties._isGrayscale !== undefined || properties._brightness !== undefined || properties._contrast !== undefined;
        
        if (properties._isGrayscale !== undefined) imgObj._isGrayscale = properties._isGrayscale;
        if (properties._brightness !== undefined) imgObj._brightness = properties._brightness;
        if (properties._contrast !== undefined) imgObj._contrast = properties._contrast;

        if (needsFilterUpdate) {
          applyImageFilters(imgObj, {
            grayscale: imgObj._isGrayscale,
            brightness: imgObj._brightness,
            contrast: imgObj._contrast
          });
        }
      }

      canvas.renderAll();
      onObjectModified?.(getObjectProperties(activeObj));
      onHistoryChange?.();
    },
    updateObjectById: (id: string, properties: Partial<CanvasObjectProperties>) => {
      if (!canvas) return;
      const targetObj = canvas.getObjects().find((obj: any) => obj.id === id);
      if (!targetObj) return;

      if (properties.visible !== undefined) targetObj.set('visible', properties.visible);
      if (properties.locked !== undefined) {
        targetObj.set({
          lockMovementX: properties.locked,
          lockMovementY: properties.locked,
          lockRotation: properties.locked,
          lockScalingX: properties.locked,
          lockScalingY: properties.locked,
          hasControls: !properties.locked, // Hide the transform borders
          hoverCursor: properties.locked ? 'default' : 'move'
        });
      }

      canvas.renderAll();
      onObjectsUpdated?.(); // Update layers panel
      onHistoryChange?.();
    },
    setTextShadow: (options) => {
      if (!canvas) return;
      const activeObj = canvas.getActiveObject();
      if (!activeObj || activeObj.type !== 'i-text') return;

      if (!options) {
        activeObj.set('shadow', undefined);
      } else {
        activeObj.set('shadow', new fabric.Shadow({
          color: options.color,
          blur: options.blur,
          offsetX: options.offsetX,
          offsetY: options.offsetY
        }));
      }

      canvas.requestRenderAll();
      onHistoryChange?.();
    },
    setTextOutline: (options) => {
      if (!canvas) return;
      const activeObj = canvas.getActiveObject();
      if (!activeObj || activeObj.type !== 'i-text') return;

      if (!options) {
        activeObj.set({
          stroke: undefined,
          strokeWidth: 0
        });
      } else {
        activeObj.set({
          stroke: options.color,
          strokeWidth: options.width
        });
      }

      canvas.requestRenderAll();
      onHistoryChange?.();
    },
    deleteActiveObject: () => {
      if (!canvas) return;
      const activeObjects = canvas.getActiveObjects();
      if (activeObjects.length > 0) {
        canvas.discardActiveObject();
        activeObjects.forEach((obj) => canvas.remove(obj));
        onObjectsUpdated?.();
        onHistoryChange?.();
      }
    },
    bringForward: () => {
      if (!canvas) return;
      const activeObj = canvas.getActiveObject();
      if (activeObj) {
        canvas.bringForward(activeObj);
        onObjectsUpdated?.();
        onHistoryChange?.();
      }
    },
    sendBackward: () => {
      if (!canvas) return;
      const activeObj = canvas.getActiveObject();
      if (activeObj) {
        canvas.sendBackwards(activeObj);
        // Ensure safe zone stays in back
        const safeZone = canvas.getObjects().find((o: any) => o.id === 'safe_zone_indicator');
        if (safeZone) safeZone.sendToBack();

        onObjectsUpdated?.();
        onHistoryChange?.();
      }
    },
    getJson: () => {
      if (!canvas) return null;
      return canvas.toJSON(['id', '_isGrayscale', '_brightness', '_contrast', '_naturalWidth', '_naturalHeight', 'selectable', 'evented', 'lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY', 'hasControls', 'hoverCursor', 'visible']); 
    },
    loadJson: (json: any) => {
      if (!canvas) return;
      canvas.loadFromJSON(json, () => {
        canvas.getObjects().forEach((obj: any) => {
          if (obj.type === 'image' && (obj._isGrayscale || obj._brightness !== 0 || obj._contrast !== 0)) {
            applyImageFilters(obj, {
              grayscale: obj._isGrayscale,
              brightness: obj._brightness,
              contrast: obj._contrast
            });
          }
          if ((obj as any).id === 'safe_zone_indicator') {
            obj.sendToBack();
          }
        });
        canvas.renderAll();
        onObjectsUpdated?.();
      });
    },
    getLayers: () => {
      if (!canvas) return [];
      return canvas.getObjects()
        .filter((obj: any) => obj.id !== 'safe_zone_indicator' && obj.type !== 'image') // filter out bg if needed, or safe zone
        .map(obj => getObjectProperties(obj))
        .reverse(); 
    },
    downloadDesign: () => {
      if (!canvas) return;
      canvas.discardActiveObject();
      
      // Temporarily hide safe zone for export
      const safeZone = canvas.getObjects().find((o: any) => o.id === 'safe_zone_indicator');
      if (safeZone) safeZone.set('opacity', 0);
      
      canvas.requestRenderAll();
      
      const dataURL = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
      
      if (safeZone) safeZone.set('opacity', 1);
      canvas.requestRenderAll();
      
      const link = document.createElement('a');
      link.download = `atoz-print-design-${Date.now()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    zoomIn: () => {
      if (!canvas) return;
      let zoom = canvas.getZoom() * 1.1;
      if (zoom > 5) zoom = 5;
      canvas.zoomToPoint({ x: canvas.width! / 2, y: canvas.height! / 2 }, zoom);
      setZoomLevel(zoom);
    },
    zoomOut: () => {
       if (!canvas) return;
       let zoom = canvas.getZoom() / 1.1;
       if (zoom < 0.5) zoom = 0.5;
       canvas.zoomToPoint({ x: canvas.width! / 2, y: canvas.height! / 2 }, zoom);
       setZoomLevel(zoom);
    },
    resetZoom: () => {
      if (!canvas) return;
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      setZoomLevel(1);
    },
    duplicateActiveObject: () => {
      const activeObject = canvas?.getActiveObject();
      if (!activeObject || (activeObject as any).id === 'safe_zone_indicator') return;

      activeObject.clone((cloned: any) => {
        canvas?.discardActiveObject();
        cloned.set({
          left: (cloned.left || 0) + 20,
          top: (cloned.top || 0) + 20,
          id: `${cloned.type}_${Date.now()}`,
          evented: true,
        });

        if (cloned.type === 'activeSelection') {
          cloned.canvas = canvas;
          cloned.forEachObject((obj: any) => {
            canvas?.add(obj);
          });
          cloned.setCoords();
        } else {
          canvas?.add(cloned);
        }

        canvas?.setActiveObject(cloned);
        canvas?.requestRenderAll();
        onObjectsUpdated?.();
        onHistoryChange?.();
      });
    },
    toggleLock: () => {
      const activeObject = canvas?.getActiveObject();
      if (!activeObject || (activeObject as any).id === 'safe_zone_indicator') return;

      const isLocked = !(activeObject.selectable);
      activeObject.set({
        selectable: !activeObject.selectable,
        evented: !activeObject.evented,
        hasControls: !activeObject.hasControls,
        lockMovementX: !activeObject.lockMovementX,
        lockMovementY: !activeObject.lockMovementY,
        lockRotation: !activeObject.lockRotation,
        lockScalingX: !activeObject.lockScalingX,
        lockScalingY: !activeObject.lockScalingY,
      } as any);

      canvas?.discardActiveObject();
      canvas?.requestRenderAll();
      onObjectsUpdated?.();
      onHistoryChange?.();
    },
    removeImageBackground: async () => {
      if (!canvas) return false;
      const activeObj = canvas.getActiveObject() as fabric.Image;
      if (!activeObj || activeObj.type !== 'image') return false;

      try {
        const base64 = activeObj.toDataURL({ format: 'png', quality: 1, multiplier: 1 });
        const res = await fetch(base64);
        const blob = await res.blob();
        
        // Dynamically import to prevent Next.js SSR Webpack build crashes
        const { removeBackground } = await import('@imgly/background-removal');
        
        // Process image entirely within the browser! (Free, unlimited)
        const transparentBlob = await removeBackground(blob);
        const transparentUrl = URL.createObjectURL(transparentBlob);

        return new Promise<boolean>((resolve) => {
          fabric.Image.fromURL(transparentUrl, (newImg) => {
            // Copy exact properties to new transparent image
            newImg.set({
              left: activeObj.left, top: activeObj.top,
              originX: activeObj.originX, originY: activeObj.originY,
              scaleX: activeObj.scaleX, scaleY: activeObj.scaleY,
              angle: activeObj.angle, opacity: activeObj.opacity,
              crossOrigin: 'anonymous',
              //@ts-ignore
              id: activeObj.id || `img_${Date.now()}`,
              _isGrayscale: (activeObj as any)._isGrayscale,
              _brightness: (activeObj as any)._brightness,
              _contrast: (activeObj as any)._contrast,
              _naturalWidth: newImg.width, _naturalHeight: newImg.height
            });

            if (activeObj.filters && activeObj.filters.length > 0) {
              newImg.filters = activeObj.filters;
              newImg.applyFilters();
            }

            const index = canvas.getObjects().indexOf(activeObj);
            canvas.remove(activeObj);
            canvas.insertAt(newImg, index, false);
            canvas.setActiveObject(newImg);
            canvas.renderAll();
            
            onObjectsUpdated?.();
            onHistoryChange?.();
            resolve(true);
          }, { crossOrigin: 'anonymous' });
        });
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    undo: () => {
      (canvas as any)?.undo?.();
    },
    redo: () => {
      (canvas as any)?.redo?.();
    },
    setPanning: (enabled: boolean) => {
      if (!canvas) return;
      (canvas as any).isPanning = enabled;
      canvas.selection = !enabled;
      canvas.defaultCursor = enabled ? 'grab' : 'default';
      canvas.getObjects().forEach(obj => {
        if (obj.name !== 'safeZone') {
          obj.selectable = !enabled;
          obj.evented = !enabled;
        }
      });
      canvas.renderAll();
    }
  }));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        if (canvas) {
          const active = canvas.getActiveObject();
          if (active && active.type === 'i-text' && (active as fabric.IText).isEditing) return;
          if (active && (active as any).id !== 'safe_zone_indicator') {
             e.preventDefault();
             canvas.discardActiveObject();
             canvas.remove(active);
             canvas.renderAll();
             onObjectsUpdated?.();
             onHistoryChange?.();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvas, onHistoryChange, onObjectsUpdated]);

  return (
    <div className="relative w-full max-w-[500px] aspect-[4/5] bg-gray-50 rounded-[30px] overflow-hidden border border-gray-100 shadow-2xl flex items-center justify-center group isolate ring-1 ring-black/5" style={{ touchAction: 'none' }}>
      
      <div className="absolute inset-0 bg-transparent flex items-center justify-center" style={{ pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <canvas ref={canvasRef} className="max-w-full h-auto drop-shadow-sm" />
        </div>
      </div>

    </div>
  );
});

DesignerCanvas.displayName = 'DesignerCanvas';

export default DesignerCanvas;
