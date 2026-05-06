"use client";

import React from 'react';
import { Plus, Trash2, GripVertical, Type, User, Briefcase, Phone, Mail, MapPin, Calendar, Info, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Field {
  id: string;
  label: string;
  type: string;
  icon: string;
  placeholder: string;
}

interface TemplateFieldBuilderProps {
  fields: Field[];
  onChange: (fields: Field[]) => void;
}

const ICON_OPTIONS = [
  { name: 'User', icon: <User className="w-4 h-4" /> },
  { name: 'Type', icon: <Type className="w-4 h-4" /> },
  { name: 'Briefcase', icon: <Briefcase className="w-4 h-4" /> },
  { name: 'Phone', icon: <Phone className="w-4 h-4" /> },
  { name: 'Mail', icon: <Mail className="w-4 h-4" /> },
  { name: 'MapPin', icon: <MapPin className="w-4 h-4" /> },
  { name: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
  { name: 'Info', icon: <Info className="w-4 h-4" /> },
  { name: 'Image', icon: <ImageIcon className="w-4 h-4" /> },
];

const TYPE_OPTIONS = [
  { value: 'text', label: 'Short Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone' },
  { value: 'number', label: 'Number' },
  { value: 'image', label: 'Logo/Image' },
];

const PRESETS = [
  { label: 'Logo', type: 'image', icon: 'Image', placeholder: 'Upload logo' },
  { label: 'Full Name', type: 'text', icon: 'User', placeholder: 'e.g. John Doe' },
  { label: 'Job Title', type: 'text', icon: 'Briefcase', placeholder: 'e.g. Director' },
  { label: 'Phone', type: 'tel', icon: 'Phone', placeholder: '+91 XXXXX XXXXX' },
  { label: 'Email', type: 'email', icon: 'Mail', placeholder: 'info@company.com' },
];

export default function TemplateFieldBuilder({ fields = [], onChange }: TemplateFieldBuilderProps) {
  const addField = (preset?: typeof PRESETS[0]) => {
    const newField: Field = preset ? {
      ...preset,
      id: `${preset.label.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`
    } : {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      icon: 'Type',
      placeholder: 'Enter details...'
    };
    onChange([...fields, newField]);
  };

  const removeField = (id: string) => {
    onChange(fields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<Field>) => {
    onChange(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-black text-brand-dark uppercase tracking-widest">Dynamic Form Builder</h3>
          <button 
            type="button"
            onClick={() => addField()}
            className="flex items-center gap-2 px-4 py-2 bg-brand-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
          >
            <Plus className="w-3 h-3" />
            Custom Field
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
           <span className="text-[9px] font-bold text-gray-400 uppercase mr-1 mt-1.5">Quick Add:</span>
           {PRESETS.map(p => (
              <button
                key={p.label}
                type="button"
                onClick={() => addField(p)}
                className="px-3 py-1.5 bg-white border border-gray-100 rounded-full text-[9px] font-black text-gray-500 uppercase tracking-widest hover:border-brand-pink/30 hover:text-brand-pink hover:bg-brand-pink/5 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-2.5 h-2.5" />
                {p.label}
              </button>
           ))}
        </div>
      </div>

      <div className="space-y-3">
        {fields.length === 0 ? (
          <div className="p-12 border-2 border-dashed border-gray-100 rounded-[32px] text-center bg-gray-50/30">
             <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">No fields defined yet. Click &quot;Quick Add&quot; to start building your form.</p>
          </div>
        ) : (
          fields.map((field, index) => (
            <div key={field.id} className="bg-white border border-gray-100 p-5 rounded-[24px] shadow-sm hover:border-brand-pink/20 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gray-100 group-hover:bg-brand-pink/30 transition-colors"></div>
              <div className="flex items-center gap-4">
                <div className="text-gray-200 cursor-grab active:cursor-grabbing hover:text-gray-400 transition-colors">
                  <GripVertical className="w-4 h-4" />
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                   <div className="md:col-span-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase mb-1 block tracking-widest">Label</label>
                      <input 
                        type="text" 
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 text-xs font-black text-brand-dark outline-none border border-transparent focus:border-brand-pink/20 focus:bg-white transition-all shadow-inner"
                        placeholder="e.g. Full Name"
                      />
                   </div>
                   
                   <div>
                      <label className="text-[8px] font-black text-gray-400 uppercase mb-1 block tracking-widest">Type</label>
                      <div className="relative">
                        <select 
                          value={field.type}
                          onChange={(e) => updateField(field.id, { type: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-gray-50 text-xs font-bold text-brand-dark outline-none border border-transparent focus:border-brand-pink/20 focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                          {TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                           <Info className="w-3 h-3" />
                        </div>
                      </div>
                   </div>

                   <div>
                      <label className="text-[8px] font-black text-gray-400 uppercase mb-1 block tracking-widest">Icon</label>
                      <div className="relative">
                        <select 
                          value={field.icon}
                          onChange={(e) => updateField(field.id, { icon: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-gray-50 text-xs font-bold text-brand-dark outline-none border border-transparent focus:border-brand-pink/20 focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                          {ICON_OPTIONS.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
                        </select>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-pink/40">
                           {ICON_OPTIONS.find(o => o.name === field.icon)?.icon}
                        </div>
                        <style jsx>{`
                          select { padding-left: 2.5rem; }
                        `}</style>
                      </div>
                   </div>

                   <div>
                      <label className="text-[8px] font-black text-gray-400 uppercase mb-1 block tracking-widest">Placeholder</label>
                      <input 
                        type="text" 
                        value={field.placeholder}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 text-xs font-medium text-gray-500 outline-none border border-transparent focus:border-brand-pink/20 focus:bg-white transition-all italic shadow-inner"
                        placeholder="e.g. John Doe"
                      />
                   </div>
                </div>

                <button 
                  type="button"
                  onClick={() => removeField(field.id)}
                  className="p-3 text-gray-200 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
