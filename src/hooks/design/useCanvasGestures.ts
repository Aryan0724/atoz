import { useState, useCallback, useRef, useEffect } from 'react';
import { fabric } from 'fabric';

export const useCanvasGestures = (
  canvas: fabric.Canvas | null, 
  containerRef: React.RefObject<HTMLDivElement>,
  baseWidth: number = 500,
  onZoomChange?: (zoom: number) => void
) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const touchStartDist = useRef<number>(0);
  const touchStartScale = useRef<number>(1);
  const zoomLevelRef = useRef(zoomLevel);

  useEffect(() => {
    zoomLevelRef.current = zoomLevel;
  }, [zoomLevel]);

  const getScale = useCallback(() => {
    if (!containerRef.current) return 1;
    const width = containerRef.current.getBoundingClientRect().width;
    return width ? (width / baseWidth) : 1;
  }, [containerRef, baseWidth]);

  const handleZoom = useCallback((newRelativeZoom: number, point?: { x: number; y: number }) => {
    if (!canvas) return;
    
    let relZoom = Math.max(0.5, Math.min(5, newRelativeZoom));
    const scale = getScale();
    const absoluteZoom = scale * relZoom;
    
    if (point) {
      canvas.zoomToPoint(point, absoluteZoom);
    } else {
      // Zoom relative to the center of the canvas
      canvas.zoomToPoint(new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2), absoluteZoom);
    }
    
    setZoomLevel(relZoom);
    onZoomChange?.(relZoom);
    canvas.renderAll();
  }, [canvas, getScale, onZoomChange]);

  const resetZoom = useCallback(() => {
    if (!canvas) return;
    const scale = getScale();
    canvas.setZoom(scale);
    canvas.setViewportTransform([scale, 0, 0, scale, 0, 0]);
    setZoomLevel(1);
    onZoomChange?.(1);
    canvas.renderAll();
  }, [canvas, getScale, onZoomChange]);

  useEffect(() => {
    if (!canvas || !containerRef.current) return;

    const el = containerRef.current;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        touchStartDist.current = dist;
        touchStartScale.current = zoomLevelRef.current;
        e.preventDefault();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchStartDist.current > 0) {
        const dist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        const relZoom = (dist / touchStartDist.current) * touchStartScale.current;
        
        const rect = el.getBoundingClientRect();
        const midX = (e.touches[0].pageX + e.touches[1].pageX) / 2 - rect.left;
        const midY = (e.touches[0].pageY + e.touches[1].pageY) / 2 - rect.top;
        
        handleZoom(relZoom, { x: midX, y: midY });
        e.preventDefault();
      }
    };

    const onTouchEnd = () => {
      touchStartDist.current = 0;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [canvas, containerRef, handleZoom]);

  return {
    zoomLevel,
    handleZoom,
    resetZoom,
    setZoomLevel
  };
};
