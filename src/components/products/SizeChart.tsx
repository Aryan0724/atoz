"use client";

import React from 'react';
import { X } from 'lucide-react';

interface SizeChartProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

export default function SizeChart({ isOpen, onClose, category }: SizeChartProps) {
  if (!isOpen) return null;

  const isApparel = category?.toLowerCase() === 'apparel';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/40 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-brand-lightGray/50">
          <div>
            <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tight">
              {category} Size Guide
            </h3>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Measurements in Inches</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-brand-pink hover:border-brand-pink transition-all shadow-sm"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-8">
          {isApparel ? (
            <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-sm font-bold">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-dark text-white">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Size</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Half Chest</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Length</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Sleeve</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-brand-dark">
                  <tr className="border-b border-gray-50 hover:bg-brand-lightGray transition-colors">
                    <td className="px-6 py-4 font-black">S</td>
                    <td className="px-6 py-4">19&quot;</td>
                    <td className="px-6 py-4">27&quot;</td>
                    <td className="px-6 py-4">7.5&quot;</td>
                  </tr>
                  <tr className="border-b border-gray-50 bg-gray-50/30 hover:bg-brand-lightGray transition-colors">
                    <td className="px-6 py-4 font-black">M</td>
                    <td className="px-6 py-4">20&quot;</td>
                    <td className="px-6 py-4">28&quot;</td>
                    <td className="px-6 py-4">8&quot;</td>
                  </tr>
                  <tr className="border-b border-gray-50 hover:bg-brand-lightGray transition-colors">
                    <td className="px-6 py-4 font-black">L</td>
                    <td className="px-6 py-4">21&quot;</td>
                    <td className="px-6 py-4">29&quot;</td>
                    <td className="px-6 py-4">8.5&quot;</td>
                  </tr>
                  <tr className="border-b border-gray-50 bg-gray-50/30 hover:bg-brand-lightGray transition-colors">
                    <td className="px-6 py-4 font-black">XL</td>
                    <td className="px-6 py-4">22&quot;</td>
                    <td className="px-6 py-4">30&quot;</td>
                    <td className="px-6 py-4">9&quot;</td>
                  </tr>
                  <tr className="hover:bg-brand-lightGray transition-colors">
                    <td className="px-6 py-4 font-black">XXL</td>
                    <td className="px-6 py-4">23.5&quot;</td>
                    <td className="px-6 py-4">31&quot;</td>
                    <td className="px-6 py-4">9.5&quot;</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
               <p className="text-gray-400 font-bold uppercase tracking-widest">Standard {category} Dimensions Apply</p>
               <p className="text-sm text-gray-500 mt-2">Contact support for specific technical drawings.</p>
            </div>
          )}

          <div className="mt-8 flex items-start gap-4 p-6 bg-pink-50 rounded-2xl border border-pink-100">
            <div className="w-2 h-2 rounded-full bg-brand-pink mt-1.5 flex-shrink-0"></div>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              * Measurements are for garment dimensions. There might be a +/- 0.5 inch variance as per industry standards. We recommend measuring your favorite t-shirt and comparing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
