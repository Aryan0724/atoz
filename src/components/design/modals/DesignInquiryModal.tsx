"use client";

import React, { useState } from 'react';
import { X, Send, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DesignInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  canvasData: any;
}

export default function DesignInquiryModal({ isOpen, onClose, productId, productName, canvasData }: DesignInquiryModalProps) {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('design_inquiries').insert({
        user_id: user?.id || null,
        product_id: productId,
        message: message,
        design_state: canvasData,
        status: 'new'
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Inquiry sent to our design team!");
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setMessage('');
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-dark/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden relative border border-white/20 animate-in zoom-in-95 duration-300">
        
        <header className="p-8 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-olive/10 rounded-2xl flex items-center justify-center text-brand-olive">
                 <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                 <h2 className="text-xl font-black text-brand-dark tracking-tighter italic">Design <span className="text-brand-pink">Inquiry</span></h2>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{productName}</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="h-5 w-5 text-gray-400" />
           </button>
        </header>

        <div className="p-8">
           {isSuccess ? (
             <div className="py-12 flex flex-col items-center text-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-2">
                   <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-black text-brand-dark tracking-tight">Message Received!</h3>
                <p className="text-sm text-gray-500 max-w-[280px]">Our specialized design team will review your vision and get back to you shortly.</p>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Vision / Custom Requirements</label>
                   <textarea
                     required
                     className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 text-sm h-40 focus:ring-2 focus:ring-brand-pink outline-none transition-all placeholder:text-gray-300 resize-none shadow-inner"
                     placeholder="Tell us about special placements, colors, or bulk requirements..."
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                   />
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                   <div className="mt-0.5"><div className="w-1.5 h-1.5 bg-brand-pink rounded-full animate-pulse" /></div>
                   <p className="text-[9px] text-gray-400 font-bold uppercase leading-relaxed tracking-tight">
                      A snapshot of your current canvas will be sent with this message so our designers can see exactly what you&apos;ve started.
                   </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-brand-dark text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-brand-dark/10 hover:bg-brand-pink hover:shadow-brand-pink/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 disabled:opacity-50 italic"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Transmitting...</>
                  ) : (
                    <><Send className="h-4 w-4" /> Send to Design Team</>
                  )}
                </button>
             </form>
           )}
        </div>

        {/* Decorative corner */}
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}
