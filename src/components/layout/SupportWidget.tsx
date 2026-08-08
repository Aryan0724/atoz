"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [contactData, setContactData] = useState<any>(null);

  useEffect(() => {
    async function fetchContact() {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('config')
          .eq('id', 'cms_pages')
          .single();
        if (data?.config?.contact) {
          setContactData(data.config.contact);
        }
      } catch (err) {
        console.error('Error fetching support widget contact info:', err);
      }
    }
    fetchContact();
  }, []);

  if (pathname.startsWith('/customize')) {
    return null;
  }

  const whatsapp = contactData?.info?.whatsapp || "918279427956";
  const email = contactData?.info?.email || "support@atozprints.com";

  const getWhatsappLink = (num: string) => {
    const cleanNum = num.replace(/[^0-9]/g, '');
    if (cleanNum.length === 10) {
      return `https://wa.me/91${cleanNum}`;
    }
    return `https://wa.me/${cleanNum}`;
  };

  return (
    <div className="fixed bottom-8 left-8 z-[100]">
      {isOpen && (
        <div className="mb-4 w-72 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-brand-dark p-6 text-white text-center">
             <h4 className="font-bold text-lg">AtoZ Support</h4>
             <p className="text-xs opacity-70">We&apos;re online and ready to help!</p>
          </div>
          <div className="p-6 space-y-3">
            <a 
              href={getWhatsappLink(whatsapp)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-gray-50 text-brand-dark rounded-2xl hover:bg-gray-100 transition-colors group"
            >
              <div className="h-10 w-10 bg-green-500 text-white rounded-xl flex items-center justify-center">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">WhatsApp Us</p>
                <p className="text-[10px] opacity-70">Instant response</p>
              </div>
            </a>
            <a 
              href={`mailto:${email}`}
              className="flex items-center gap-4 p-4 bg-gray-50 text-brand-dark rounded-2xl hover:bg-gray-100 transition-colors"
            >
              <div className="h-10 w-10 bg-brand-pink text-white rounded-xl flex items-center justify-center">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Email Support</p>
                <p className="text-[10px] opacity-70">24h turnaround</p>
              </div>
            </a>
          </div>
          <div className="p-4 bg-gray-50/50 text-center border-t border-gray-100">
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">AtoZ Prints Studio</p>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 bg-brand-dark text-white rounded-full shadow-lg flex items-center justify-center hover:bg-brand-pink transition-all group"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </button>
    </div>
  );
}
