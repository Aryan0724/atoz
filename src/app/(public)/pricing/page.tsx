import React from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import { CheckCircle2, Info } from 'lucide-react';

export default function PricingPage() {
  const categories = [
    {
      name: "Diaries",
      items: [
        { name: "Premium Leather Diary", tiers: [550, 525, 490, 450] },
        { name: "Hard Cover Diary", tiers: [600, 580, 550, 520] },
        { name: "A5 Soft Cover Wiro Diary", tiers: [250, 220, 190, 160] },
        { name: "A5 Hard Cover Wiro Diary", tiers: [400, 380, 350, 320] },
      ],
      headers: ["10+ Units", "20+ Units", "50+ Units", "100+ Units"]
    },
    {
      name: "Bill Books (Sets)",
      items: [
        { name: "A5 Bill Book", tiers: [450, 420, 400] },
        { name: "A5 Receipt Book", tiers: [450, 420, 400] },
        { name: "A5 Voucher Book", tiers: [450, 420, 400] },
        { name: "A4 GST Bill Book", tiers: [900, 840, 800] },
      ],
      headers: ["5 Sets", "10 Sets", "20 Sets"]
    },
    {
      name: "Business Stationary",
      items: [
        { name: "Letterheads (A4)", tiers: [600, 1000, 1800, 3500, 6000] },
      ],
      headers: ["50 Units", "100 Units", "200 Units", "500 Units", "1000 Units"]
    },
    {
      name: "Apparel (T-Shirts)",
      items: [
        { name: "Premium Cotton T-Shirt", tiers: [650, 620, 600] },
      ],
      headers: ["1-10 Units", "11-20 Units", "21-50 Units"]
    }
  ];

  return (
    <div className="bg-white min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading 
          badge="Transparency"
          title="Official Bulk Pricing"
          subtitle="Get premium quality at scale. Transparent pricing for every order size."
          align="center"
        />

        <div className="mt-20 space-y-32">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-2 bg-brand-pink rounded-full"></div>
                <h2 className="text-3xl font-black text-brand-dark uppercase tracking-tight">{cat.name}</h2>
              </div>
              
              <div className="overflow-x-auto rounded-[40px] border border-gray-100 shadow-xl shadow-gray-50 bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-dark text-white">
                      <th className="px-8 py-6 text-sm font-black uppercase tracking-widest">Product Type</th>
                      {cat.headers.map((h, i) => (
                        <th key={i} className="px-8 py-6 text-sm font-black uppercase tracking-widest text-center">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cat.items.map((item, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-brand-lightGray transition-colors group">
                        <td className="px-8 py-6 font-bold text-brand-dark group-hover:text-brand-pink transition-colors">{item.name}</td>
                        {item.tiers.map((price, pi) => (
                          <td key={pi} className="px-8 py-6 text-center font-black text-brand-dark">
                            ₹{price}
                            <span className="block text-[10px] text-gray-400 font-medium">per unit</span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* GST Note */}
        <div className="mt-20 p-12 bg-pink-50 rounded-[48px] border border-pink-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-brand-pink rounded-xl flex items-center justify-center text-white flex-shrink-0">
               <Info className="h-6 w-6" />
            </div>
            <div>
               <h3 className="text-xl font-black text-brand-dark mb-2">Important Price Information</h3>
               <p className="text-sm text-gray-500 font-medium max-w-xl">
                 All prices listed are excluding 18% GST. Designing charges may apply extra based on complexity. Minimum Order Quantity (MOQ) applies as per the table.
               </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
             <div className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                <CheckCircle2 className="h-4 w-4 text-brand-cyan" />
                PAN India Delivery
             </div>
             <div className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                <CheckCircle2 className="h-4 w-4 text-brand-cyan" />
                7-10 Days Turnaround
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
