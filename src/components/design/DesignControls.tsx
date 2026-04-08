"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CanvasObjectProperties } from '@/types/canvas';
import { 
  PlusSquare, Settings2, Layers, Palette, LayoutTemplate
} from 'lucide-react';

// Tab Components
import TemplatesTab from './controls/tabs/TemplatesTab';
import AddTab from './controls/tabs/AddTab';
import EditTab from './controls/tabs/EditTab';
import LayersTab from './controls/tabs/LayersTab';
import ProductTab from './controls/tabs/ProductTab';

interface DesignControlsProps {
  productColor: string;
  onProductColorChange: (color: string) => void;
  activeObject: CanvasObjectProperties | null;
  onUpdateActiveObject: (properties: Partial<CanvasObjectProperties>) => void;
  onUpdateObjectById?: (id: string, properties: Partial<CanvasObjectProperties>) => void;
  onAddText: (text: string) => void;
  onAddImage: (url: string) => void;
  onAddShape: (type: 'circle' | 'rect' | 'triangle') => void;
  onDeleteActiveObject: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onDownload: () => void;
  onRemoveBackground: () => Promise<boolean>;
  onLoadTemplate?: (json: any) => void;
  layers: any[];
}

type TabType = 'templates' | 'add' | 'edit' | 'layers' | 'product';

const DesignControls = ({
  productColor,
  onProductColorChange,
  activeObject,
  onUpdateActiveObject,
  onUpdateObjectById,
  onAddText,
  onAddImage,
  onAddShape,
  onDeleteActiveObject,
  onBringForward,
  onSendBackward,
  onRemoveBackground,
  onLoadTemplate,
  layers
}: DesignControlsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('add');

  // Auto-switch to edit tab when an object is selected
  useEffect(() => {
    if (activeObject) {
      setActiveTab('edit');
    } else if (activeTab === 'edit') {
      setActiveTab('add');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeObject]);

  const tabs: { id: TabType; icon: React.ReactNode; label: string }[] = [
    { id: 'templates', icon: <LayoutTemplate className="h-5 w-5 md:h-6 md:w-6" />, label: 'Templates' },
    { id: 'add', icon: <PlusSquare className="h-5 w-5 md:h-6 md:w-6" />, label: 'Add' },
    { id: 'edit', icon: <Settings2 className="h-5 w-5 md:h-6 md:w-6" />, label: 'Edit' },
    { id: 'layers', icon: <Layers className="h-5 w-5 md:h-6 md:w-6" />, label: 'Layers' },
    { id: 'product', icon: <Palette className="h-5 w-5 md:h-6 md:w-6" />, label: 'Product' },
  ];

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Dynamic Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar relative z-10 shrink-0 bg-white">
        {tabs.map((tab) => {
          const disabled = tab.id === 'edit' && !activeObject;
          return (
            <button 
              key={tab.id}
              disabled={disabled}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 min-w-[80px] md:min-w-[70px] flex flex-col items-center py-4 md:py-5 transition-all relative",
                activeTab === tab.id ? "text-brand-pink" : "text-gray-400 hover:text-brand-dark",
                disabled && "opacity-30 cursor-not-allowed"
              )}
            >
              {tab.icon}
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest mt-2">{tab.label}</span>
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-brand-pink rounded-t-full shadow-[0_-2px_10px_rgba(233,30,99,0.5)]"></span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-24">
        {activeTab === 'templates' && (
          <TemplatesTab onLoadTemplate={onLoadTemplate} onTabChange={setActiveTab} />
        )}

        {activeTab === 'add' && (
          <AddTab onAddText={onAddText} onAddImage={onAddImage} onAddShape={onAddShape} onTabChange={setActiveTab} />
        )}

        {activeTab === 'edit' && activeObject && (
          <EditTab 
            activeObject={activeObject}
            onUpdateActiveObject={onUpdateActiveObject}
            onDeleteActiveObject={onDeleteActiveObject}
            onBringForward={onBringForward}
            onSendBackward={onSendBackward}
            onRemoveBackground={onRemoveBackground}
          />
        )}

        {activeTab === 'layers' && (
          <LayersTab 
            layers={layers}
            activeObject={activeObject}
            onUpdateObjectById={onUpdateObjectById}
            onDeleteActiveObject={onDeleteActiveObject}
            onBringForward={onBringForward}
            onSendBackward={onSendBackward}
          />
        )}

        {activeTab === 'product' && (
          <ProductTab productColor={productColor} onProductColorChange={onProductColorChange} />
        )}
      </div>
    </div>
  );
};

export default DesignControls;
