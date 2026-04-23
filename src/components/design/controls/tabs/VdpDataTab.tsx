"use client";

import React, { useState } from 'react';
import { Upload, FileText, Check, AlertCircle, ChevronLeft, ChevronRight, Table, Trash2, Loader2 } from 'lucide-react';
import { parseCSV } from '@/lib/utils/csvParser';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface VdpDataTabProps {
  onDataLoaded: (headers: string[], rows: any[]) => void;
  onRowChange: (index: number) => void;
  onClear: () => void;
  currentData: { headers: string[], rows: any[] } | null;
  currentRowIndex: number;
}

const VdpDataTab: React.FC<VdpDataTabProps> = ({ 
  onDataLoaded, 
  onRowChange, 
  onClear,
  currentData,
  currentRowIndex
}) => {
  const [isParsing, setIsParsing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a valid .csv file');
      return;
    }

    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const { headers, rows } = parseCSV(text);
        if (headers.length === 0 || rows.length === 0) {
          throw new Error('CSV file is empty or invalid');
        }
        onDataLoaded(headers, rows);
        toast.success(`Loaded ${rows.length} records!`);
      } catch (err) {
        toast.error('Failed to parse CSV');
        console.error(err);
      } finally {
        setIsParsing(false);
      }
    };
    reader.readAsText(file);
  };

  if (!currentData) {
    return (
      <div className="p-5 space-y-6">
        <label className="w-full py-16 border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-brand-dark/5 hover:border-brand-dark/20 transition-all group bg-white relative overflow-hidden">
          {isParsing && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <Loader2 className="h-8 w-8 text-brand-pink animate-spin mb-2" />
              <p className="text-[10px] font-black text-brand-pink uppercase tracking-[0.2em]">Processing CSV...</p>
            </div>
          )}
          <div className="h-16 w-16 bg-brand-dark/5 rounded-[24px] flex items-center justify-center group-hover:scale-110 transition-transform">
             <Upload className="h-8 w-8 text-brand-dark" />
          </div>
          <div className="text-center">
            <p className="text-sm font-black text-brand-dark uppercase tracking-widest italic">Upload Data Source</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Accepts .CSV (Excel/Sheets)</p>
          </div>
          <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
        </label>

        <div className="p-6 bg-amber-50/50 border border-amber-100 rounded-3xl flex gap-4">
           <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
           <p className="text-[10px] font-medium text-amber-900 leading-relaxed">
             <span className="font-black uppercase tracking-tighter">Pro Tip:</span> Use column headers in the first row. You can map these to text fields like <code className="bg-amber-100 px-1 rounded text-amber-900">{"{{Name}}"}</code>.
           </p>
        </div>
      </div>
    );
  }

  const currentRow = currentData.rows[currentRowIndex];

  return (
    <div className="p-5 space-y-6">
      <header className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-dark text-white rounded-2xl shadow-lg shadow-brand-dark/10">
               <FileText className="h-4 w-4" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark italic">Connected Source</p>
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{currentData.rows.length} Records Loaded</p>
            </div>
         </div>
         <button 
           onClick={onClear}
           className="p-2.5 bg-gray-50 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-100"
           title="Disconnect Data"
         >
            <Trash2 className="h-4 w-4" />
         </button>
      </header>

      {/* Preview Card */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-brand-dark/5 p-6 space-y-5 relative isolate overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-brand-dark/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
         
         <div className="flex items-center justify-between relative z-10">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 flex items-center gap-2">
              <Table className="h-3 w-3" />
              Live Record Preview
            </span>
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
               <button 
                 disabled={currentRowIndex === 0}
                 onClick={() => onRowChange(currentRowIndex - 1)}
                 className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg disabled:opacity-30 transition-all"
               >
                  <ChevronLeft className="h-4 w-4" />
               </button>
               <span className="text-[11px] font-black text-brand-dark px-2">{currentRowIndex + 1} <span className="text-gray-300">/</span> {currentData.rows.length}</span>
               <button 
                 disabled={currentRowIndex === currentData.rows.length - 1}
                 onClick={() => onRowChange(currentRowIndex + 1)}
                 className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg disabled:opacity-30 transition-all"
               >
                  <ChevronRight className="h-4 w-4" />
               </button>
            </div>
         </div>

         <div className="space-y-1 relative z-10 pt-2 max-h-[280px] overflow-y-auto custom-scrollbar pr-2">
            {currentData.headers.map(header => (
               <div key={header} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 group">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-brand-dark transition-colors">{header}</span>
                  <span className="text-[11px] font-black text-brand-dark truncate max-w-[150px] bg-gray-50 px-3 py-1 rounded-lg border border-transparent group-hover:border-brand-dark/10 group-hover:bg-white transition-all">{currentRow[header] || '-'}</span>
               </div>
            ))}
         </div>
      </div>

      <div className="bg-brand-olive/5 p-7 rounded-[32px] border border-brand-olive/10 space-y-4 relative overflow-hidden group">
         <div className="absolute -top-4 -right-4 w-12 h-12 bg-brand-olive/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
         <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-olive text-white rounded-xl shadow-sm">
              <Check className="h-4 w-4" />
            </div>
            <p className="text-[11px] font-black text-brand-olive uppercase tracking-widest italic">Smart Mapping Enabled</p>
         </div>
         <p className="text-[10px] font-medium text-gray-600/80 leading-relaxed">
            Placeholder detection is active. Add any text element with <code className="bg-white/80 backdrop-blur-sm px-2 py-0.5 border border-brand-olive/10 rounded-md text-brand-olive font-black italic">{"{{ColumnName}}"}</code> to link it with this data source.
         </p>
      </div>
    </div>
  );
};

export default VdpDataTab;
