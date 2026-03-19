"use client";

import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';

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
  addShape: (type: 'circle' | 'rect' | 'triangle') => void;
  updateActiveObject: (properties: Partial<CanvasObjectProperties>) => void;
  updateObjectById: (id: string, properties: Partial<CanvasObjectProperties>) => void;
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
  
  // Safe Zone parameters
  const safeZoneMargin = 60; 

  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!canvasRef.current || canvas) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 625,
      backgroundColor: '#f9fafb',
      preserveObjectStacking: true,
      selectionColor: 'rgba(233, 30, 99, 0.1)',
      selectionBorderColor: '#E91E63',
      selectionLineWidth: 1,
    });

    fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: '#E91E63',
      cornerStrokeColor: '#FFFFFF',
      borderColor: '#E91E63',
      cornerSize: 10,
      padding: 5,
      cornerStyle: 'circle'
    });

    // Draw Print Safe Zone Rectangle
    const safeZone = new fabric.Rect({
      left: safeZoneMargin,
      top: safeZoneMargin,
      width: fabricCanvas.width! - safeZoneMargin * 2,
      height: fabricCanvas.height! - safeZoneMargin * 2,
      fill: 'transparent',
      stroke: 'rgba(233, 30, 99, 0.4)',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      //@ts-ignore
      id: 'safe_zone_indicator'
    });
    fabricCanvas.add(safeZone);
    // Ensure it always stays at the bottom or just below user layers
    safeZone.sendToBack();

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

    fabric.Image.fromURL(productImage, (img) => {
      img.set({
        selectable: false,
        evented: false,
        originX: 'center',
        originY: 'center',
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        crossOrigin: 'anonymous'
      });
      const scale = Math.max(canvas.width! / img.width!, canvas.height! / img.height!);
      img.scale(scale);
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    }, { crossOrigin: 'anonymous' });
  }, [canvas, productImage]);

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
    addShape: (type: 'circle' | 'rect' | 'triangle') => {
      if (!canvas) return;
      let shape;
      const commonProps = {
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        fill: '#E91E63',
        originX: 'center',
        originY: 'center',
        //@ts-ignore
        id: `shape_${Date.now()}`
      };

      if (type === 'circle') shape = new fabric.Circle({ ...commonProps, radius: 40 });
      else if (type === 'rect') shape = new fabric.Rect({ ...commonProps, width: 80, height: 80 });
      else if (type === 'triangle') shape = new fabric.Triangle({ ...commonProps, width: 80, height: 80 });

      if (shape) {
        canvas.add(shape);
        canvas.setActiveObject(shape);
        canvas.renderAll();
        onObjectsUpdated?.();
        onHistoryChange?.();
      }
    },
    updateActiveObject: (properties: Partial<CanvasObjectProperties>) => {
      if (!canvas) return;
      const activeObj = canvas.getActiveObject();
      if (!activeObj) return;

      if (properties.fill !== undefined) activeObj.set('fill', properties.fill);
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
    <div className="relative aspect-[4/5] bg-gray-50 rounded-[30px] overflow-hidden border border-gray-100 shadow-2xl flex items-center justify-center group isolate ring-1 ring-black/5" style={{ touchAction: 'none' }}>
      
      <div className="absolute inset-0 bg-transparent flex items-center justify-center" style={{ pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <canvas ref={canvasRef} className="max-w-full h-auto drop-shadow-sm" />
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute right-6 top-6 flex flex-col gap-2 z-[40]">
        <button onClick={() => ref && 'current' in ref && ref.current?.zoomIn()} className="w-8 h-8 bg-white/80 backdrop-blur-md rounded-full shadow border border-gray-100 flex items-center justify-center text-gray-600 hover:text-brand-pink transition-colors font-bold text-lg leading-none">+</button>
        <button onClick={() => ref && 'current' in ref && ref.current?.zoomOut()} className="w-8 h-8 bg-white/80 backdrop-blur-md rounded-full shadow border border-gray-100 flex items-center justify-center text-gray-600 hover:text-brand-pink transition-colors font-bold text-lg leading-none">-</button>
        {zoomLevel !== 1 && (
          <button onClick={() => ref && 'current' in ref && ref.current?.resetZoom()} className="w-8 h-8 bg-white/80 backdrop-blur-md rounded-full shadow border border-gray-100 flex items-center justify-center text-[10px] text-gray-600 hover:text-brand-pink transition-colors font-bold uppercase tracking-tighter">1x</button>
        )}
      </div>

      <div className="absolute bottom-6 right-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-white/80 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/50 z-[40]">
        Ctrl + Scroll to Zoom
      </div>

    </div>
  );
});

DesignerCanvas.displayName = 'DesignerCanvas';

export default DesignerCanvas;
