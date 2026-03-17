import React from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import { Building2, Gift, Users, Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      title: "Corporate Gifting",
      desc: "End-to-end gifting solutions for employees and clients. From joined kits to luxury desk accessories.",
      icon: <Building2 className="h-8 w-8 text-brand-pink" />,
      features: ["Custom Branding", "Bulk Discounts", "Individual Name Engraving", "Premium Packaging"]
    },
    {
      title: "Event Merchandising",
      desc: "Make your events memorable with customized lanyards, menus, standees, and participant giveaways.",
      icon: <Gift className="h-8 w-8 text-brand-cyan" />,
      features: ["Fast Turnaround", "Design Support", "Pan-India Logistics", "Event-Specific Bundles"]
    },
    {
      title: "Promotional Gear",
      desc: "High-visibility branding for startups and SMEs. T-shirts, hoodies, and tech gear that carry your logo with pride.",
      icon: <Users className="h-8 w-8 text-brand-pink" />,
      features: ["Quality Fabric", "Vibrant Printing", "Low MOQs", "Size Variety"]
    }
  ];

  return (
    <div className="bg-white min-h-screen py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          badge="Our Expertise"
          title="Print & Gifting Services"
          subtitle="Tailored solutions for every business scale and event type."
          align="center"
        />

        <div className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {services.map((service, idx) => (
            <div key={idx} className="p-12 rounded-[64px] bg-brand-lightGray border border-gray-100 hover:shadow-2xl hover:shadow-gray-100 transition-all flex flex-col group">
              <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-2xl font-black text-brand-dark mb-4">{service.title}</h3>
              <p className="text-gray-500 font-medium mb-8 leading-relaxed">{service.desc}</p>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {service.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-500">
                    <CheckCircle2 className="h-4 w-4 text-brand-cyan" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center py-4 px-8 bg-brand-dark text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-brand-pink transition-colors"
              >
                Inquire Now
              </Link>
            </div>
          ))}
        </div>

        {/* Custom Service CTA */}
        <div className="mt-32 p-12 md:p-24 bg-brand-dark rounded-[64px] relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <Zap className="h-12 w-12 text-brand-pink mx-auto mb-8 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">Need a Custom <span className="text-brand-pink italic">Enterprise Solution?</span></h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            From portal integrations to dedicated account managers, we provide specialized services for organizations with over 1000+ monthly prints.
          </p>
          <Link href="/contact" className="inline-flex py-5 px-12 bg-white text-brand-dark rounded-full font-black text-lg hover:scale-105 transition-all">
            Talk to Our Specialists
          </Link>
        </div>
      </div>
    </div>
  );
}
