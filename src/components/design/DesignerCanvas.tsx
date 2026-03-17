"use client";

import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';

interface DesignerCanvasProps {
  productImage: string;
  selectedColor: string;
  customText: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  textPosition: { x: number; y: number };
  textRotation: number;
  onTextUpdate?: (update: { x?: number; y?: number; rotation?: number }) => void;
  logoUrl: string | null;
  logoPosition: { x: number; y: number };
  logoScale: number;
  logoRotation: number;
  onLogoUpdate?: (update: { x?: number; y?: number; scale?: number; rotation?: number }) => void;
  // Advanced Typography (V2.1)
  charSpacing?: number;
  lineHeight?: number;
  textShadow?: { color: string; blur: number; offsetX: number; offsetY: number };
  // Image Filters (V2.1)
  brightness?: number;
  contrast?: number;
  isGrayscale?: boolean;
  // Canvas Modes
  isDrawingMode?: boolean;
  // New V2 Props
  objects?: any[];
  onObjectUpdate?: (id: string, update: any) => void;
}

const DesignerCanvas = React.forwardRef<any, DesignerCanvasProps>(({
  productImage,
  selectedColor,
  customText,
  textColor,
  fontFamily,
  fontSize,
  textPosition,
  textRotation,
  onTextUpdate,
  charSpacing = 0,
  lineHeight = 1.16,
  textShadow = { color: 'rgba(0,0,0,0)', blur: 0, offsetX: 0, offsetY: 0 },
  logoUrl,
  logoPosition,
  logoScale,
  logoRotation,
  onLogoUpdate,
  brightness = 0,
  contrast = 0,
  isGrayscale = false,
  isDrawingMode = false,
  objects = [],
  onObjectUpdate
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const textObjectRef = useRef<fabric.Text | null>(null);
  const logoObjectRef = useRef<fabric.Image | null>(null);
  const objectsMapRef = useRef<Map<string, fabric.Object>>(new Map());

  React.useImperativeHandle(ref, () => ({
    downloadDesign: () => {
      if (!canvas) return;
      
      // Deselect all
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2, // HQ Export
      });
      
      const link = document.createElement('a');
      link.download = `atoz-print-design-${Date.now()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }));

  // Initialize Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 625,
      backgroundColor: '#f9fafb',
      preserveObjectStacking: true,
      isDrawingMode: isDrawingMode,
    });

    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = textColor;
      fabricCanvas.freeDrawingBrush.width = 5;
    }

    setCanvas(fabricCanvas);

    // Sync object changes back to parent
    fabricCanvas.on('object:modified', (e) => {
      const obj = e.target;
      if (!obj) return;

      if (obj === textObjectRef.current) {
        onTextUpdate?.({
          x: (obj.left! / fabricCanvas.width!) * 100,
          y: (obj.top! / fabricCanvas.height!) * 100,
          rotation: obj.angle,
        });
      } else if (obj === logoObjectRef.current) {
        onLogoUpdate?.({
          x: (obj.left! / fabricCanvas.width!) * 100,
          y: (obj.top! / fabricCanvas.height!) * 100,
          scale: (obj.scaleX! * 4) / 1,
          rotation: obj.angle,
        });
      } else {
        // Find custom object in map
        Array.from(objectsMapRef.current.entries()).forEach(([id, fObj]) => {
          if (fObj === obj) {
            onObjectUpdate?.(id, {
              x: (obj.left! / fabricCanvas.width!) * 100,
              y: (obj.top! / fabricCanvas.height!) * 100,
              scale: obj.scaleX,
              rotation: obj.angle,
            });
          }
        });
      }
    });

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // ... (Handle Product Image stays same)
  useEffect(() => {
    if (!canvas) return;

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
      
      const scale = Math.max(
        canvas.width! / img.width!,
        canvas.height! / img.height!
      );
      img.scale(scale);

      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    }, { crossOrigin: 'anonymous' });
  }, [canvas, productImage]);

  // Handle Dynamic Text
  useEffect(() => {
    if (!canvas) return;

    if (!customText) {
      if (textObjectRef.current) {
        canvas.remove(textObjectRef.current);
        textObjectRef.current = null;
      }
      return;
    }

    if (!textObjectRef.current) {
      const text = new fabric.Text(customText, {
        left: (textPosition.x * canvas.width!) / 100,
        top: (textPosition.y * canvas.height!) / 100,
        angle: textRotation,
        fontSize: fontSize,
        fill: textColor,
        fontFamily: fontFamily,
        charSpacing: charSpacing,
        lineHeight: lineHeight,
        shadow: new fabric.Shadow(textShadow),
        originX: 'center',
        originY: 'center',
        cornerColor: '#E91E63',
        cornerStrokeColor: '#FFF',
        transparentCorners: false,
        cornerSize: 8,
      });
      textObjectRef.current = text;
      canvas.add(text);
    } else {
      textObjectRef.current.set({
        text: customText,
        fill: textColor,
        fontFamily: fontFamily,
        fontSize: fontSize,
        charSpacing: charSpacing,
        lineHeight: lineHeight,
        shadow: new fabric.Shadow(textShadow),
        left: (textPosition.x * canvas.width!) / 100,
        top: (textPosition.y * canvas.height!) / 100,
        angle: textRotation,
      });
    }
    canvas.renderAll();
  }, [canvas, customText, textColor, fontFamily, fontSize, textPosition, textRotation, charSpacing, lineHeight, textShadow]);

  // Handle Logo
  useEffect(() => {
    if (!canvas) return;

    if (!logoUrl) {
      if (logoObjectRef.current) {
        canvas.remove(logoObjectRef.current);
        logoObjectRef.current = null;
      }
      return;
    }

    fabric.Image.fromURL(logoUrl, (img) => {
      if (logoObjectRef.current) {
        canvas.remove(logoObjectRef.current);
      }
      
      img.set({
        left: (logoPosition.x * canvas.width!) / 100,
        top: (logoPosition.y * canvas.height!) / 100,
        angle: logoRotation,
        originX: 'center',
        originY: 'center',
        cornerColor: '#E91E63',
        transparentCorners: false,
        cornerSize: 8,
        crossOrigin: 'anonymous'
      });
      
      const filters = [];
      if (isGrayscale) filters.push(new fabric.Image.filters.Grayscale());
      if (brightness !== 0) filters.push(new fabric.Image.filters.Brightness({ brightness: brightness / 100 }));
      if (contrast !== 0) filters.push(new fabric.Image.filters.Contrast({ contrast: contrast / 100 }));
      
      img.filters = filters;
      img.applyFilters();
      
      img.scale(logoScale / 4);
      
      logoObjectRef.current = img;
      canvas.add(img);
      canvas.renderAll();
    }, { crossOrigin: 'anonymous' });
  }, [canvas, logoUrl, logoPosition, logoScale, logoRotation, brightness, contrast, isGrayscale]);

  // Handle Drawing Mode
  useEffect(() => {
    if (!canvas) return;
    canvas.isDrawingMode = isDrawingMode;
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = textColor;
    }
    canvas.renderAll();
  }, [canvas, isDrawingMode, textColor]);

  // Handle Custom Objects (Graphics & Patterns)
  useEffect(() => {
    if (!canvas) return;

    // Remove objects that are no longer in state
    const currentIds = new Set(objects.map(obj => obj.id));
    Array.from(objectsMapRef.current.entries()).forEach(([id, fObj]) => {
      if (!currentIds.has(id)) {
        canvas.remove(fObj);
        objectsMapRef.current.delete(id);
      }
    });

    // Add or update objects
    objects.forEach(obj => {
      const existing = objectsMapRef.current.get(obj.id);
      
      if (!existing) {
        if (obj.type === 'image' && obj.url) {
          fabric.Image.fromURL(obj.url, (img) => {
            img.set({
              left: (obj.x * canvas.width!) / 100,
              top: (obj.y * canvas.height!) / 100,
              angle: obj.rotation,
              originX: 'center',
              originY: 'center',
              cornerColor: '#E91E63',
              transparentCorners: false,
              cornerSize: 8,
              opacity: 0.8,
              crossOrigin: 'anonymous'
            });

            // Apply global filters to custom graphics too (V2.1)
            const filters = [];
            if (isGrayscale) filters.push(new fabric.Image.filters.Grayscale());
            if (brightness !== 0) filters.push(new fabric.Image.filters.Brightness({ brightness: brightness / 100 }));
            if (contrast !== 0) filters.push(new fabric.Image.filters.Contrast({ contrast: contrast / 100 }));
            img.filters = filters;
            img.applyFilters();

            img.scale(0.5); 
            canvas.add(img);
            objectsMapRef.current.set(obj.id, img);
            canvas.renderAll();
          }, { crossOrigin: 'anonymous' });
        } else if (obj.type === 'circle') {
          const circle = new fabric.Circle({
            radius: 30,
            fill: '#E91E63',
            left: (obj.x * canvas.width!) / 100,
            top: (obj.y * canvas.height!) / 100,
            originX: 'center',
            originY: 'center',
            cornerColor: '#E91E63',
            transparentCorners: false,
            cornerSize: 8,
          });
          canvas.add(circle);
          objectsMapRef.current.set(obj.id, circle);
        } else if (obj.type === 'rect') {
          const rect = new fabric.Rect({
            width: 60,
            height: 60,
            fill: '#E91E63',
            left: (obj.x * canvas.width!) / 100,
            top: (obj.y * canvas.height!) / 100,
            originX: 'center',
            originY: 'center',
            cornerColor: '#E91E63',
            transparentCorners: false,
            cornerSize: 8,
          });
          canvas.add(rect);
          objectsMapRef.current.set(obj.id, rect);
        } else if (obj.type === 'triangle') {
          const tri = new fabric.Triangle({
            width: 60,
            height: 60,
            fill: '#E91E63',
            left: (obj.x * canvas.width!) / 100,
            top: (obj.y * canvas.height!) / 100,
            originX: 'center',
            originY: 'center',
            cornerColor: '#E91E63',
            transparentCorners: false,
            cornerSize: 8,
          });
          canvas.add(tri);
          objectsMapRef.current.set(obj.id, tri);
        }
      } else {
        existing.set({
          left: (obj.x * canvas.width!) / 100,
          top: (obj.y * canvas.height!) / 100,
          angle: obj.rotation,
        });
      }
    });

    canvas.renderAll();
  }, [canvas, objects, brightness, contrast, isGrayscale]);

  return (
    <div className="relative aspect-[4/5] bg-gray-50 rounded-[40px] overflow-hidden border border-gray-100 shadow-2xl flex items-center justify-center group">
      <canvas ref={canvasRef} className="max-w-full h-auto" />
      
      {/* Visual Overlays for Studio Feel */}
      <div className="absolute top-6 left-6 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-brand-pink z-[30] shadow-sm border border-white/50 flex items-center gap-2">
        <div className="h-2 w-2 bg-brand-pink rounded-full animate-pulse"></div>
        Interactive Studio
      </div>

      <div className="absolute bottom-6 right-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-white/50 px-3 py-1 rounded-lg backdrop-blur-sm">
        Direct Manipulation Active
      </div>
    </div>
  );
});

DesignerCanvas.displayName = 'DesignerCanvas';

export default DesignerCanvas;
