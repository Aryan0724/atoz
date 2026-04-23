"use client";

import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { DesignerCanvasProps, DesignerCanvasRef } from '@/types/canvas';
import { motion } from 'framer-motion';
import { Upload, MessageSquare, Palette, Layout, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const IntakeFormDesigner = forwardRef<DesignerCanvasRef, DesignerCanvasProps>((props, ref) => {
  const { designConfig, onObjectsUpdated } = props;
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  // Expose minimal methods to maintain compatibility with the DesignerCanvas interface
  useImperativeHandle(ref, () => ({
    addText: () => {},
    addImage: () => {},
    addShape: () => {},
    addIcon: () => {},
    addSvgGraphic: () => {},
    undo: () => {},
    redo: () => {},
    saveHistory: () => {},
    deleteActiveObject: () => {},
    duplicateActiveObject: () => {},
    toggleLock: () => {},
    alignActiveObject: () => {},
    getCanvasDataURL: async () => {
      // In intake mode, we don't return a visual canvas, 
      // but we could return a "Requirement Summary" image in the future.
      return ""; 
    },
    downloadDesign: () => {
        alert("Design summary will be generated upon order.");
    },
    zoomIn: () => {},
    zoomOut: () => {},
    resetZoom: () => {},
    setPanning: () => {},
    clearCanvas: () => setFormData({}),
    getObjects: () => [
        // We return a pseudo-object representing the form state for the cart payload
        { 
            type: 'intake_data', 
            data: formData,
            id: 'intake_form_payload'
        } as any
    ],
    addPattern: () => {},
    zoomLevel: 1,
    updateActiveObject: () => {},
    updateObjectById: () => {},
    setTextShadow: () => {},
    setTextOutline: () => {},
    sendToBack: () => {},
    bringToFront: () => {},
    bringForward: () => {},
    sendBackward: () => {},
    groupObjects: () => {},
    ungroupObjects: () => {},
    removeBackground: async () => true,
    getJson: () => ({}),
    loadJson: () => {},
    getLayers: () => [],
    getDesignDataUrl: async () => "",
  } as any));

  // Default fields if none provided in config
  const fields = designConfig?.fields || [
    { id: 'logo', label: 'Upload your Logo/Reference', type: 'file', icon: <Upload className="h-3 w-3" /> },
    { id: 'instructions', label: 'Design Instructions', type: 'textarea', icon: <MessageSquare className="h-3 w-3" /> },
    { id: 'colors', label: 'Preferred Color Palette', type: 'color_multi', icon: <Palette className="h-3 w-3" /> }
  ];

  return (
    <div className="w-full h-full min-h-[600px] bg-white rounded-[40px] p-10 border border-gray-100 shadow-2xl overflow-y-auto custom-scrollbar">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto space-y-10 py-4"
      >
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-pink/10 rounded-2xl mb-2">
            <Layout className="h-6 w-6 text-brand-pink" />
          </div>
          <h2 className="text-3xl font-black text-brand-dark tracking-tighter italic">Design <span className="text-brand-pink">Intake</span></h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Submit your requirements for professional design</p>
        </header>

        <div className="space-y-8">
          {fields.map((field: any) => (
            <div key={field.id} className="space-y-4">
              <label className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-brand-dark/60 ml-1">
                <span className="p-2 bg-gray-50 rounded-lg text-brand-pink shadow-sm">{field.icon}</span>
                {field.label}
              </label>
              
              {field.type === 'file' && (
                <div className="aspect-[16/6] rounded-3xl border-2 border-dashed border-gray-100 hover:border-brand-pink/30 hover:bg-brand-pink/5 transition-all flex flex-col items-center justify-center cursor-pointer group bg-gray-50/30">
                  <div className="p-3 bg-white rounded-2xl shadow-sm mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="h-5 w-5 text-brand-pink" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">Click to upload reference image or logo</span>
                </div>
              )}

              {field.type === 'textarea' && (
                <textarea 
                  rows={5}
                  className="w-full px-6 py-5 rounded-[24px] bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 transition-all outline-none font-medium text-gray-600 text-sm shadow-inner resize-none"
                  placeholder="Describe your design vision, text to include, and style preferences..."
                  value={formData[field.id] || ''}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, [field.id]: e.target.value }));
                    onObjectsUpdated?.();
                  }}
                />
              )}

              {field.type === 'color_multi' && (
                <div className="grid grid-cols-6 gap-3">
                  {['#FF0000', '#000000', '#FFFFFF', '#4F46E5', '#10B981', '#F59E0B'].map(c => (
                    <button 
                      key={c}
                      className={cn(
                        "aspect-square rounded-2xl border-4 transition-all hover:scale-110",
                        formData[field.id] === c ? "border-brand-pink shadow-lg shadow-brand-pink/20" : "border-white shadow-sm"
                      )}
                      style={{ backgroundColor: c }}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, [field.id]: c }));
                        onObjectsUpdated?.();
                      }}
                    />
                  ))}
                  <button className="aspect-square rounded-2xl border-4 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-brand-pink hover:text-brand-pink transition-all">
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <footer className="pt-10 border-t border-gray-100">
           <div className="bg-brand-dark text-white p-8 rounded-[32px] flex items-center gap-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-pink/20 blur-3xl rounded-full" />
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                <CheckCircle2 className="h-7 w-7 text-brand-cyan" />
              </div>
              <div className="relative z-10">
                <p className="text-xs font-black uppercase tracking-widest text-brand-cyan mb-1 italic">Professional Briefing</p>
                <p className="text-[11px] font-medium text-gray-400 leading-relaxed">Our design studio will review your requirements and share a mockup within 24-48 hours after order placement.</p>
              </div>
           </div>
        </footer>
      </motion.div>
    </div>
  );
});

import { Plus } from 'lucide-react';

IntakeFormDesigner.displayName = 'IntakeFormDesigner';
export default IntakeFormDesigner;
