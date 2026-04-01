import { useCallback, useRef } from 'react';
import { fabric } from 'fabric';

export const useCanvasHistory = (canvas: fabric.Canvas | null) => {
  const history = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);
  const isApplyingHistory = useRef<boolean>(false);

  const saveHistory = useCallback(() => {
    if (!canvas || isApplyingHistory.current) return;
    try {
      const json = JSON.stringify(canvas.toObject(['id', 'selectable', 'evented', 'name']));
      
      if (historyIndex.current < history.current.length - 1) {
        history.current.splice(historyIndex.current + 1);
      }
      
      history.current.push(json);
      if (history.current.length > 50) {
        history.current.shift();
      } else {
        historyIndex.current++;
      }
    } catch (err) {
      console.warn('useCanvasHistory: Could not save history state:', err);
    }
  }, [canvas]);

  const undo = useCallback((onComplete?: () => void) => {
    if (!canvas || historyIndex.current <= 0) return;
    
    isApplyingHistory.current = true;
    historyIndex.current--;
    
    canvas.loadFromJSON(history.current[historyIndex.current], () => {
      canvas.renderAll();
      isApplyingHistory.current = false;
      onComplete?.();
    });
  }, [canvas]);

  const redo = useCallback((onComplete?: () => void) => {
    if (!canvas || historyIndex.current >= history.current.length - 1) return;
    
    isApplyingHistory.current = true;
    historyIndex.current++;
    
    canvas.loadFromJSON(history.current[historyIndex.current], () => {
      canvas.renderAll();
      isApplyingHistory.current = false;
      onComplete?.();
    });
  }, [canvas]);

  const clearHistory = useCallback(() => {
    history.current = [];
    historyIndex.current = -1;
  }, []);

  return {
    saveHistory,
    undo,
    redo,
    clearHistory,
    canUndo: historyIndex.current > 0,
    canRedo: historyIndex.current < history.current.length - 1
  };
};
