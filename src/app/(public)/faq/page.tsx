import React from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import { HelpCircle, Truck, RefreshCcw, CreditCard } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      q: "What is the Minimum Order Quantity (MOQ)?",
      a: "Our standard MOQ for most products (Calendars, Business Cards, Diaries, etc.) is 50 units. This allows us to maintain premium quality at affordable prices.",
      icon: <HelpCircle className="text-brand-pink" />
    },
    {
      q: "What is the delivery timeline?",
      a: "Standard delivery takes 5–10 working days PAN India. Customized products require a production time of 3-5 days followed by shipping.",
      icon: <Truck className="text-brand-cyan" />
    },
    {
      q: "Can I return a customized product?",
      a: "As products are customized with your brand logo/name, returns are not accepted unless there is a manufacturing defect. In case of defects, we offer a full replacement.",
      icon: <RefreshCcw className="text-brand-pink" />
    },
    {
      q: "Which payment methods do you accept?",
      a: "We accept all major UPI apps, Credit Cards, Debit Cards, and Net Banking through our secure payment partner.",
      icon: <CreditCard className="text-brand-cyan" />
    }
  ];

  return (
    <div className="bg-white min-h-screen py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeading 
          badge="Support"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about our services."
          align="left"
        />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-8 bg-brand-lightGray rounded-[40px] border border-gray-100 space-y-4">
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                {faq.icon}
              </div>
              <h3 className="text-lg font-black text-brand-dark uppercase tracking-tight">{faq.q}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-gray-400 font-medium mb-4">Still have questions?</p>
          <a href="/contact" className="inline-flex items-center gap-2 text-brand-pink font-black uppercase tracking-widest text-sm hover:underline">
            Contact Support Team
          </a>
        </div>
      </div>
    </div>
  );
}
