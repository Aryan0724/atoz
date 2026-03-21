import React from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import { Truck, MapPin, Clock, ShieldCheck } from 'lucide-react';

export default function ShippingPage() {
  const steps = [
    {
      title: "Logistics",
      days: "5-10 Days",
      desc: "Real-time tracked delivery to your doorstep PAN India.",
      icon: <Truck className="text-brand-pink" />
    },
  ];

  return (
    <div className="bg-white min-h-screen py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          badge="Logistics"
          title="Shipping & Delivery"
          subtitle="PAN India delivery with real-time tracking and premium protection. Standard delivery in 5-10 working days."
          align="left"
        />

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="p-8 bg-brand-lightGray rounded-[48px] border border-gray-50 space-y-4">
              <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                {step.icon}
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight">{step.title}</h3>
                <span className="text-[10px] font-black bg-brand-dark text-white px-3 py-1 rounded-full uppercase">{step.days}</span>
              </div>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-32 space-y-12 max-w-4xl">
           <div className="space-y-4">
              <h2 className="text-3xl font-black text-brand-dark">Shipping Reach</h2>
              <p className="text-lg text-gray-500 leading-relaxed font-medium">
                We currently deliver to over 19,000+ pin codes across India. For remote locations in North-East India or J&K, an additional 2-3 days may be required.
              </p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="p-8 border border-gray-100 rounded-[40px] space-y-4">
                 <h4 className="font-black text-brand-dark uppercase tracking-widest text-sm">Bulk Shipping</h4>
                 <p className="text-sm text-gray-400 font-medium italic">
                    For orders above 500 units, we can arrange dedicated freight services to minimize transit costs and ensure maximum safety of the shipment.
                 </p>
              </div>
              <div className="p-8 border border-gray-100 rounded-[40px] space-y-4">
                 <h4 className="font-black text-brand-dark uppercase tracking-widest text-sm">Individual Dispatch</h4>
                 <p className="text-sm text-gray-400 font-medium italic">
                    Doing a reward campaign? We can ship individual items directly to your employees&apos; homes across the country.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
