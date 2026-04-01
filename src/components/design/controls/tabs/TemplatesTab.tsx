import React from 'react';
import { canvasTemplates } from '@/lib/data/canvasTemplates';
import { toast } from 'sonner';

interface TemplatesTabProps {
  onLoadTemplate?: (json: any) => void;
  onTabChange: (tab: any) => void;
}

const TemplatesTab = ({ onLoadTemplate, onTabChange }: TemplatesTabProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
      <div>
        <h3 className="text-xl font-black text-brand-dark tracking-tight">Quick Start</h3>
        <p className="text-xs text-gray-500 mt-1">Start your design with a pre-configured template.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {canvasTemplates.map((t) => (
          <button
            key={t.id}
            onClick={() => {
               onLoadTemplate?.(t.json);
               onTabChange('layers');
               toast.success('Template loaded!');
            }}
            className="bg-gray-50 hover:bg-pink-50 hover:border-brand-pink/30 border border-transparent rounded-2xl p-6 flex flex-col items-center justify-center transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{t.preview}</div>
            <span className="font-bold text-[10px] uppercase tracking-widest text-brand-dark text-center">{t.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplatesTab;
