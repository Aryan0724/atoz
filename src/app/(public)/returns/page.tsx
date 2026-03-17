import React from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import { RefreshCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="bg-white min-h-screen py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeading 
          badge="Policy"
          title="Returns & Refunds"
          subtitle="Our commitment to quality ensures your brand is always represented perfectly."
          align="left"
        />

        <div className="mt-20 space-y-16">
           <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="h-16 w-16 bg-brand-pink/10 rounded-3xl flex items-center justify-center flex-shrink-0">
                 <RefreshCcw className="h-8 w-8 text-brand-pink" />
              </div>
              <div className="space-y-4">
                 <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Our Quality Guarantee</h2>
                 <p className="text-lg text-gray-500 leading-relaxed font-medium">
                    Since every product at AtoZ Print is custom-made with your logo/design, we cannot accept general returns. However, we guarantee a FREE REPLACEMENT if:
                 </p>
                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      "Manufacturing Defect",
                      "Wrong Product Delivered",
                      "Transit Damage",
                      "Significant Print Variation"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm font-bold text-gray-400 p-4 bg-brand-lightGray rounded-2xl">
                         <CheckCircle2 className="h-4 w-4 text-brand-cyan" />
                         {item}
                      </li>
                    ))}
                 </ul>
              </div>
           </div>

           <div className="p-12 bg-orange-50 rounded-[48px] border border-orange-100 flex gap-8 items-start">
              <AlertTriangle className="h-10 w-10 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                 <h3 className="text-xl font-black text-brand-dark mb-2">Design Warning</h3>
                 <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    AtoZ Print is not responsible for low-quality prints if the provided logo/image resolution was below 300 DPI or if there were typos in your approved text. We strongly recommend using high-res SVG or PNG files.
                 </p>
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight">How to Claim?</h3>
              <p className="text-gray-500 font-medium">
                To report an issue, please email <span className="text-brand-pink font-bold">support@atozprint.in</span> within 48 hours of delivery with a clear photo or video showing the defect and your order ID.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
