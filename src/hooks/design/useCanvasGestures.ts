import { useState, useCallback, useRef, useEffect } from 'react';
import { fabric } from 'fabric';

export const useCanvasGestures = (
  canvas: fabric.Canvas | null, 
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const touchStartDist = useRef<number>(0);
  const touchStartScale = useRef<number>(1);
  const isDragging = useRef<boolean>(false);
  const lastPosX = useRef<number>(0);
  const lastPosY = useRef<number>(0);

  const handleZoom = useCallback((newZoom: number, point?: { x: number; y: number }) => {
    if (!canvas) return;
    
    let zoom = Math.max(0.5, Math.min(5, newZoom));
    
    if (point) {
      canvas.zoomToPoint(point, zoom);
    } else {
      canvas.setZoom(zoom);
    }
    
    setZoomLevel(zoom);
    canvas.renderAll();
  }, [canvas]);

  const resetZoom = useCallback(() => {
    if (!canvas) return;
    canvas.setZoom(1);
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    setZoomLevel(1);
    canvas.renderAll();
  }, [canvas]);

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
        touchStartScale.current = canvas.getZoom();
        e.preventDefault();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchStartDist.current > 0) {
        const dist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        const scale = (dist / touchStartDist.current) * touchStartScale.current;
        
        const rect = el.getBoundingClientRect();
        const midX = (e.touches[0].pageX + e.touches[1].pageX) / 2 - rect.left;
        const midY = (e.touches[0].pageY + e.touches[1].pageY) / 2 - rect.top;
        
        handleZoom(scale, { x: midX, y: midY });
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
