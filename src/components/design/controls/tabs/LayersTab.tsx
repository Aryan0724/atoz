import React from 'react';
import { Eye, EyeOff, Lock, Unlock, MoveUp, MoveDown, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CanvasObjectProperties } from '@/types/canvas';

interface LayersTabProps {
  layers: any[];
  activeObject: CanvasObjectProperties | null;
  onUpdateObjectById?: (id: string, properties: Partial<CanvasObjectProperties>) => void;
  onDeleteActiveObject: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
}

const LayersTab = ({ layers, activeObject, onUpdateObjectById, onDeleteActiveObject, onBringForward, onSendBackward }: LayersTabProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
      <div>
        <h3 className="text-xl font-black text-brand-dark tracking-tight">Design Layers</h3>
        <p className="text-xs text-gray-500 mt-1">Manage element stack and visibility.</p>
      </div>

      <div className="space-y-3">
        {layers.length === 0 ? (
          <div className="p-12 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                <MoveUp className="h-6 w-6 text-gray-300" />
             </div>
             <p className="text-sm font-bold text-gray-400">No layers yet</p>
             <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2">Add some elements to begin</p>
          </div>
        ) : (
          layers.map((layer) => (
            <div 
              key={layer.id}
              className={cn(
                "group p-4 rounded-2xl border transition-all flex items-center justify-between",
                activeObject?.id === layer.id ? "border-brand-pink bg-pink-50/50 shadow-sm" : "border-gray-50 bg-white hover:border-gray-200"
              )}
            >
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 border border-gray-200 uppercase shrink-0">
                  {layer.type.substring(0, 3)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-brand-dark truncate">{layer.name || layer.type}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{layer.type}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onUpdateObjectById?.(layer.id, { visible: !layer.visible })}
                  className={cn("p-2 rounded-lg transition-colors", layer.visible ? "text-gray-400 hover:bg-gray-100" : "text-brand-pink bg-pink-50")}
                >
                  {layer.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button 
                  onClick={() => onUpdateObjectById?.(layer.id, { locked: !layer.locked })}
                  className={cn("p-2 rounded-lg transition-colors", layer.locked ? "text-brand-pink bg-pink-50" : "text-gray-400 hover:bg-gray-100")}
                >
                  {layer.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {layers.length > 0 && (
         <div className="pt-8 border-t border-gray-100 grid grid-cols-2 gap-3">
            <button 
              onClick={onBringForward}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 hover:bg-white border border-gray-100 hover:border-brand-dark rounded-xl text-xs font-bold text-gray-600 transition-all"
            >
              <MoveUp className="h-4 w-4" />
              Bring to Front
            </button>
            <button 
              onClick={onSendBackward}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 hover:bg-white border border-gray-100 hover:border-brand-dark rounded-xl text-xs font-bold text-gray-600 transition-all"
            >
              <MoveDown className="h-4 w-4" />
              Send to Back
            </button>
         </div>
      )}
    </div>
  );
};

export default LayersTab;
