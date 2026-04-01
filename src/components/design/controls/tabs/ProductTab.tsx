import React from 'react';
import { cn } from '@/lib/utils';
import { Palette } from 'lucide-react';

interface ProductTabProps {
  productColor: string;
  onProductColorChange: (color: string) => void;
}

const productColors = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
  { name: 'Navy', hex: '#1e3a8a' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Forest Green', hex: '#14532d' },
  { name: 'Heather Gray', hex: '#94a3b8' },
];

const ProductTab = ({ productColor, onProductColorChange }: ProductTabProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
      <div>
        <h3 className="text-xl font-black text-brand-dark tracking-tight">Product Variant</h3>
        <p className="text-xs text-gray-500 mt-1">Select the base color for your custom print.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {productColors.map((color) => (
          <button
            key={color.name}
            onClick={() => onProductColorChange(color.hex)}
            className={cn(
              "p-4 rounded-2xl border transition-all flex items-center gap-3 text-left",
              productColor === color.hex ? "border-brand-pink bg-pink-50" : "border-gray-100 bg-white hover:border-gray-200"
            )}
          >
            <div 
              className="w-10 h-10 rounded-xl border border-gray-100 shadow-sm shrink-0" 
              style={{ backgroundColor: color.hex }}
            />
            <div className="overflow-hidden">
               <span className="block text-[10px] font-black uppercase tracking-widest text-brand-dark">{color.name}</span>
               <span className="block text-[8px] text-gray-400 font-bold uppercase mt-0.5">{color.hex}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="p-8 border-2 border-dashed border-gray-100 rounded-[32px] flex flex-col items-center justify-center text-center">
         <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
            <Palette className="h-6 w-6 text-gray-300" />
         </div>
         <p className="text-sm font-bold text-gray-400">Custom Colors</p>
         <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2 leading-relaxed">Enterprise customers can request custom Pantone matching.</p>
      </div>
    </div>
  );
};

export default ProductTab;
