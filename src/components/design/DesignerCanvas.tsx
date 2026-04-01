"use client";

import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { fabric } from 'fabric';
import { useCanvasHistory } from '@/hooks/design/useCanvasHistory';
import { useCanvasGestures } from '@/hooks/design/useCanvasGestures';
import { useCanvasActions } from '@/hooks/design/useCanvasActions';
import { loadGoogleFont } from '@/lib/fontUtils';
import { DesignerCanvasProps, DesignerCanvasRef, getObjectProperties, CanvasObjectProperties } from '@/types/canvas';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  const { saveHistory, undo, redo } = useCanvasHistory(canvas);
  const { zoomLevel, handleZoom, resetZoom, setZoomLevel } = useCanvasGestures(canvas, containerRef);
  const { addText, addImage, addShape, addIcon, addSvgGraphic } = useCanvasActions(canvas, onObjectsUpdated, onHistoryChange);

  const productColorRef = useRef(productColor);
  useEffect(() => {
    productColorRef.current = productColor;
  }, [productColor]);

  // INITIALIZATION
  useEffect(() => {
    if (!canvasRef.current || canvas) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 625,
      preserveObjectStacking: true,
      selectionColor: 'rgba(24, 144, 255, 0.05)',
      selectionBorderColor: '#1890ff',
      selectionLineWidth: 1,
      allowTouchScrolling: false,
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

    // Event bridges for hooks
    fabricCanvas.on('object:added', (e: any) => {
      if (e.target?.id === 'safe_zone_indicator') return;
      saveHistory();
      onObjectsUpdated?.();
    });
    fabricCanvas.on('object:modified', () => {
      saveHistory();
      onHistoryChange?.();
    });
    fabricCanvas.on('object:removed', (e: any) => {
      if (e.target?.id === 'safe_zone_indicator') return;
      saveHistory();
      onObjectsUpdated?.();
    });

    // Always-on-top Safe Zone (Prints at the end of rendering)
    fabricCanvas.on('after:render', function() {
      const ctx = fabricCanvas.getContext();
      ctx.save();
      const vpt = fabricCanvas.viewportTransform;
      if (vpt) {
        ctx.transform(vpt[0], vpt[1], vpt[2], vpt[3], vpt[4], vpt[5]);
      }
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(150, 120, 200, 320);
      ctx.restore();
    });

    // PANNING
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
    fabricCanvas.on('mouse:up', function() {
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

  // Sync Canvas with Container Resize
  useEffect(() => {
    if (!canvas || !containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries?.[0]) return;
      const { width } = entries[0].contentRect;
      if (width === 0) return;
      const scale = width / 500;
      canvas.setWidth(width);
      canvas.setHeight(625 * scale);
      canvas.setZoom(scale * zoomLevel);
      canvas.calcOffset();
      canvas.renderAll();
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [canvas, zoomLevel]);

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

  // Sync Product Image and Color
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
         console.warn("DesignerCanvas: Recolor SVG failed", e);
       }
    }

    fabric.Image.fromURL(modifiedUrl, (img) => {
      if (!img) return;
      img.set({
        selectable: false, evented: false, originX: 'center', originY: 'center',
        left: 250, top: 312.5, crossOrigin: 'anonymous', 
        //@ts-ignore
        id: 'product_base_image'
      });
      
      const padding = 40;
      const scale = Math.min((500 - padding * 2) / img.width!, (625 - padding * 2) / img.height!);
      img.scale(scale);
      img.set({ shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.05)', blur: 15, offsetX: 0, offsetY: 8 }) });

      const existingBase = canvas.getObjects().find(obj => (obj as any).id === 'product_base_image');
      if (existingBase) canvas.remove(existingBase);
      const existingFill = canvas.getObjects().find(obj => (obj as any).id === 'product_color_fill');
      if (existingFill) canvas.remove(existingFill);

      if (!isSvgMock && productColor && productColor.toUpperCase() !== '#FFFFFF') {
         const fillRect = new fabric.Rect({
           left: 250, top: 312.5, originX: 'center', originY: 'center',
           width: img.getScaledWidth() * 0.98, height: img.getScaledHeight() * 0.98,
           fill: productColor, selectable: false, evented: false,
           //@ts-ignore
           id: 'product_color_fill'
         });
         canvas.insertAt(fillRect, 0, false);
         canvas.insertAt(img, 1, false);
      } else {
         canvas.insertAt(img, 0, false);
      }
      canvas.renderAll();
    }, { crossOrigin: 'anonymous' });
  }, [canvas, productImage, productColor]);

  // Guidelines and Interaction Events
  useEffect(() => {
    if (!canvas) return;
    
    let vLine: fabric.Line | null = null;
    let hLine: fabric.Line | null = null;
    const SNAP_THRESHOLD = 5;

    const emitSelection = () => {
      const activeObj = canvas.getActiveObject();
      if (activeObj && (activeObj as any).id !== 'safe_zone_indicator') {
        onObjectSelected?.(getObjectProperties(activeObj));
      } else {
        onSelectionCleared?.();
      }
    };

    const handleObjectMoving = (e: any) => {
      const obj = e.target;
      if (!obj || ['product_base_image', 'product_color_fill', 'guide-v', 'guide-h'].includes(obj.id)) return;

      const centerX = obj.getCenterPoint().x;
      const centerY = obj.getCenterPoint().y;

      if (vLine) canvas.remove(vLine);
      if (hLine) canvas.remove(hLine);

      if (Math.abs(centerX - 250) < SNAP_THRESHOLD) {
        if (obj.originX === 'center') obj.set({ left: 250 }).setCoords();
        vLine = new fabric.Line([250, 0, 250, 625], { stroke: '#4F46E5', strokeWidth: 1, selectable: false, evented: false, opacity: 0.5 });
        canvas.add(vLine);
      }
      if (Math.abs(centerY - 312.5) < SNAP_THRESHOLD) {
        if (obj.originY === 'center') obj.set({ top: 312.5 }).setCoords();
        hLine = new fabric.Line([0, 312.5, 500, 312.5], { stroke: '#4F46E5', strokeWidth: 1, selectable: false, evented: false, opacity: 0.5 });
        canvas.add(hLine);
      }
      canvas.renderAll();
    };

    const handleMouseUp = () => {
      if (vLine) canvas.remove(vLine);
      if (hLine) canvas.remove(hLine);
      vLine = hLine = null;
      canvas.renderAll();
    };

    canvas.on('selection:created', emitSelection);
    canvas.on('selection:updated', emitSelection);
    canvas.on('selection:cleared', emitSelection);
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.off('selection:created', emitSelection);
      canvas.off('selection:updated', emitSelection);
      canvas.off('selection:cleared', emitSelection);
      canvas.off('object:moving', handleObjectMoving);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, onObjectSelected, onSelectionCleared]);

  // Imperative Methods (exposed to parent via ref)
  useImperativeHandle(ref, () => ({
    addText,
    addImage,
    addShape,
    addIcon,
    addSvgGraphic,
    updateActiveObject: async (properties) => {
      if (!canvas) return;
      const activeObj = canvas.getActiveObject();
      if (!activeObj) return;

      if (properties.fill !== undefined) {
        activeObj.set('fill', properties.fill);
        if (activeObj.type === 'group') {
          (activeObj as fabric.Group).getObjects().forEach(child => child.set('fill', properties.fill));
        }
      }
      if (properties.opacity !== undefined) activeObj.set('opacity', properties.opacity);
      if (properties.angle !== undefined) activeObj.set('angle', properties.angle);
      
      if (activeObj.type === 'i-text' || activeObj.type === 'text') {
        const textObj = activeObj as fabric.IText;
        if (properties.text !== undefined) textObj.set('text', properties.text);
        
        if (properties.fontFamily !== undefined) {
          // Dynamic font loading
          const loaded = await loadGoogleFont(properties.fontFamily);
          if (loaded) {
            textObj.set('fontFamily', properties.fontFamily);
            canvas.renderAll();
          }
        }

        if (properties.fontSize !== undefined) textObj.set('fontSize', properties.fontSize);
        if (properties.charSpacing !== undefined) textObj.set('charSpacing', properties.charSpacing);
        if (properties.lineHeight !== undefined) textObj.set('lineHeight', properties.lineHeight);
        if (properties.textAlign !== undefined) textObj.set('textAlign', properties.textAlign);
        if (properties.stroke !== undefined) textObj.set({ stroke: properties.stroke || '', strokeUniform: true });
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
             textObj.set('path', new fabric.Path(`M 0 0 Q ${w/2} ${h} ${w} 0`, { fill: '', stroke: '', visible: false }));
          }
        }
        if (properties.shadow !== undefined) textObj.set('shadow', new fabric.Shadow(properties.shadow));
      }

      if (activeObj.type === 'image') {
        const imgObj = activeObj as any;
        if (properties._isGrayscale !== undefined) imgObj._isGrayscale = properties._isGrayscale;
        if (properties._brightness !== undefined) imgObj._brightness = properties._brightness;
        if (properties._contrast !== undefined) imgObj._contrast = properties._contrast;

        const filters = [];
        if (imgObj._isGrayscale) filters.push(new fabric.Image.filters.Grayscale());
        if (imgObj._brightness !== 0) filters.push(new fabric.Image.filters.Brightness({ brightness: (imgObj._brightness || 0) / 100 }));
        if (imgObj._contrast !== 0) filters.push(new fabric.Image.filters.Contrast({ contrast: (imgObj._contrast || 0) / 100 }));
        imgObj.filters = filters;
        imgObj.applyFilters();
      }

      canvas.renderAll();
      onObjectModified?.(getObjectProperties(activeObj));
      onHistoryChange?.();
    },
    updateObjectById: (id, properties) => {
      if (!canvas) return;
      const targetObj = canvas.getObjects().find((obj: any) => obj.id === id);
      if (!targetObj) return;

      if (properties.visible !== undefined) targetObj.set('visible', properties.visible);
      if (properties.locked !== undefined) {
        targetObj.set({
          lockMovementX: properties.locked, lockMovementY: properties.locked,
          lockRotation: properties.locked, lockScalingX: properties.locked,
          lockScalingY: properties.locked, hasControls: !properties.locked,
          hoverCursor: properties.locked ? 'default' : 'move'
        });
      }
      canvas.renderAll();
      onObjectsUpdated?.();
      onHistoryChange?.();
    },
    setTextShadow: (options) => {
      if (!canvas) return;
      const activeObj = canvas.getActiveObject();
      if (!activeObj || activeObj.type !== 'i-text') return;
      activeObj.set('shadow', options ? new fabric.Shadow(options) : undefined);
      canvas.requestRenderAll();
      onHistoryChange?.();
    },
    setTextOutline: (options) => {
      if (!canvas) return;
      const activeObj = canvas.getActiveObject();
      if (!activeObj || activeObj.type !== 'i-text') return;
      activeObj.set({ stroke: options ? options.color : undefined, strokeWidth: options ? options.width : 0 });
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
        const safeZone = canvas.getObjects().find((o: any) => o.id === 'safe_zone_indicator');
        if (safeZone) safeZone.sendToBack();
        onObjectsUpdated?.();
        onHistoryChange?.();
      }
    },
    getJson: () => {
      if (!canvas) return null;
      const objects = canvas.getObjects().filter(obj => !['product_base_image', 'product_color_fill', 'guide-v', 'guide-h', 'safe_zone_indicator'].includes((obj as any).id));
      return { objects: objects.map(obj => obj.toObject(['id', 'selectable', 'evented', 'name'])) };
    },
    loadJson: (json: any) => {
      if (!canvas || !json) return;
      const bgObjects = canvas.getObjects().filter(obj => ['product_base_image', 'product_color_fill', 'guide-v', 'guide-h', 'safe_zone_indicator'].includes((obj as any).id));
      canvas.loadFromJSON(json, () => {
        canvas.getObjects().filter(obj => ['product_base_image', 'product_color_fill', 'guide-v', 'guide-h', 'safe_zone_indicator'].includes((obj as any).id)).forEach(obj => canvas.remove(obj));
        bgObjects.reverse().forEach(obj => canvas.insertAt(obj, 0, false));
        canvas.renderAll();
        onObjectsUpdated?.();
      });
    },
    getLayers: () => {
      if (!canvas) return [];
      return canvas.getObjects()
        .filter(obj => !['product_base_image', 'product_color_fill', 'guide-v', 'guide-h', 'safe_zone_indicator'].includes((obj as any).id))
        .map(obj => ({
          id: (obj as any).id || `obj_${Math.random()}`,
          type: obj.type,
          //@ts-ignore
          name: obj.name || (obj.type === 'i-text' ? obj.text : obj.type),
          visible: obj.visible,
          locked: obj.lockMovementX
        })).reverse();
    },
    downloadDesign: () => {
      if (!canvas) return;
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      const dataURL = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
      const link = document.createElement('a');
      link.download = `atoz-print-design-${Date.now()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    zoomIn: () => handleZoom(canvas?.getZoom() || 1 * 1.1),
    zoomOut: () => handleZoom(canvas?.getZoom() || 1 / 1.1),
    resetZoom,
    duplicateActiveObject: () => {
      if (!canvas) return;
      const active = canvas.getActiveObject();
      if (!active || (active as any).id === 'product_base_image') return;
      active.clone((cloned: any) => {
        canvas.discardActiveObject();
        cloned.set({ left: active.left! + 20, top: active.top! + 20, evented: true, id: `clone_${Date.now()}` });
        if (cloned.type === 'activeSelection') {
          cloned.canvas = canvas;
          cloned.forEachObject((obj: any) => canvas.add(obj));
          cloned.setCoords();
        } else {
          canvas.add(cloned);
        }
        canvas.setActiveObject(cloned);
        canvas.renderAll();
        onObjectsUpdated?.();
      });
    },
    toggleLock: () => {
      if (!canvas) return;
      const active = canvas.getActiveObject();
      if (!active) return;
      const isLocked = !active.lockMovementX;
      active.set({ lockMovementX: isLocked, lockMovementY: isLocked, lockScalingX: isLocked, lockScalingY: isLocked, lockRotation: isLocked, hasControls: !isLocked });
      canvas.renderAll();
      onObjectModified?.(getObjectProperties(active));
    },
    removeImageBackground: async () => {
      if (!canvas) return false;
      const active = canvas.getActiveObject();
      if (!active || active.type !== 'image') return false;
      
      const imageUrl = (active as fabric.Image).getSrc();
      if (!imageUrl) return false;

      try {
        const response = await fetch('/api/remove-bg', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to remove background');
        }

        const blob = await response.blob();
        const reader = new FileReader();

        return new Promise<boolean>((resolve) => {
          reader.onload = (e) => {
            if (e.target?.result) {
               fabric.Image.fromURL(e.target.result as string, (newImg) => {
                  newImg.set({ 
                    left: active.left, 
                    top: active.top, 
                    scaleX: active.scaleX, 
                    scaleY: active.scaleY, 
                    angle: active.angle, 
                    originX: active.originX, 
                    originY: active.originY, 
                    //@ts-ignore
                    id: (active as any).id 
                  });
                  canvas.remove(active); 
                  canvas.add(newImg); 
                  canvas.setActiveObject(newImg); 
                  canvas.renderAll(); 
                  onObjectsUpdated?.(); 
                  resolve(true);
               });
            } else resolve(false);
          };
          reader.readAsDataURL(blob);
        });
      } catch (err: any) {
        console.error("Background removal failed:", err);
        alert(err.message || "Failed to remove background. Ensure the API key is configured.");
        return false;
      }
    },
    undo,
    redo,
    setPanning: (enabled) => {
      if (!canvas) return;
      (canvas as any).isPanning = enabled;
      canvas.selection = !enabled;
      canvas.defaultCursor = enabled ? 'grab' : 'default';
      canvas.renderAll();
    },
    getDesignDataUrl: () => {
      if (!canvas) return '';
      const bgObjects = canvas.getObjects().filter(obj => ['product_base_image', 'product_color_fill', 'guide-v', 'guide-h', 'safe_zone_indicator'].includes((obj as any).id));
      bgObjects.forEach(obj => obj.set('visible', false));
      canvas.renderAll();
      const dataUrl = canvas.toDataURL({ format: 'png', quality: 0.8 });
      bgObjects.forEach(obj => obj.set('visible', true));
      canvas.renderAll();
      return dataUrl;
    }
  }), [canvas, addText, addImage, addShape, addIcon, addSvgGraphic, undo, redo, resetZoom, handleZoom, onObjectsUpdated, onHistoryChange, onObjectModified]);

  return (
    <div ref={containerRef} className="relative w-full max-w-[500px] aspect-[4/5] bg-gray-50 rounded-[30px] overflow-hidden border border-gray-100 shadow-2xl flex items-center justify-center group isolate ring-1 ring-black/5" style={{ touchAction: 'none' }}>
      <canvas ref={canvasRef} className="max-w-full h-auto drop-shadow-sm" />
    </div>
  );
});

DesignerCanvas.displayName = 'DesignerCanvas';

export default DesignerCanvas;
