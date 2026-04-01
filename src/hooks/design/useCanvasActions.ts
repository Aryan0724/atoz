import { useCallback } from 'react';
import { fabric } from 'fabric';
import { iconLibrary } from '@/lib/data/icons';
import { CanvasObjectProperties } from '@/types/canvas';

export const useCanvasActions = (
  canvas: fabric.Canvas | null,
  onObjectsUpdated?: () => void,
  onHistoryChange?: () => void
) => {
  const addText = useCallback((text: string) => {
    if (!canvas) return;
    const t = new fabric.IText(text, {
      left: 250,
      top: 312.5,
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
  }, [canvas, onObjectsUpdated, onHistoryChange]);

  const addImage = useCallback((url: string) => {
    if (!canvas) return;
    fabric.Image.fromURL(url, (img) => {
      img.set({
        left: 250,
        top: 312.5,
        originX: 'center',
        originY: 'center',
        crossOrigin: 'anonymous',
        //@ts-ignore
        id: `img_${Date.now()}`,
        _isGrayscale: false,
        _brightness: 0,
        _contrast: 0,
        _naturalWidth: img.width,
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
  }, [canvas, onObjectsUpdated, onHistoryChange]);

  const addShape = useCallback((type: 'circle' | 'rect' | 'triangle' | 'star' | 'heart' | 'line') => {
    if (!canvas) return;
    let shape: fabric.Object | undefined;
    const commonProps = {
      left: 250,
      top: 312.5,
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
  }, [canvas, onObjectsUpdated, onHistoryChange]);

  const addIcon = useCallback((iconName: string) => {
    const pathData = iconLibrary[iconName];
    if (!pathData || !canvas) return;
    
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${pathData}"/></svg>`;
    
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
      
      const targetSize = 120;
      const scale = targetSize / Math.max(obj.width || 1, obj.height || 1);
      obj.scale(scale);
      
      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.renderAll();
      onObjectsUpdated?.();
      onHistoryChange?.();
    });
  }, [canvas, onObjectsUpdated, onHistoryChange]);

  const addSvgGraphic = useCallback((svgString: string, name: string) => {
    if (!canvas) return;
    fabric.loadSVGFromString(svgString, (objects, options) => {
      const obj = fabric.util.groupSVGElements(objects, options);
      obj.set({
        left: 250,
        top: 312.5,
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
      const targetSize = 160;
      const scale = targetSize / Math.max(obj.width || 1, obj.height || 1);
      obj.scale(scale);
      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.renderAll();
      onObjectsUpdated?.();
      onHistoryChange?.();
    });
  }, [canvas, onObjectsUpdated, onHistoryChange]);

  return {
    addText,
    addImage,
    addShape,
    addIcon,
    addSvgGraphic,
  };
};
