import React from 'react';
import SectionHeading from '@/components/common/SectionHeading';

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using atozprint.in, you agree to bound by these Terms and Conditions. Our services are provided to businesses, corporates, and individuals across India subject to the following terms."
    },
    {
      title: "2. Customization & Orders",
      content: "AtoZ Print specializes in customized products. By placing an order, you confirm that all details (logo, text, color) provided are accurate. We are not responsible for errors in user-provided content once approved for printing."
    },
    {
      title: "3. Minimum Order Quantity (MOQ)",
      content: "Unless specified otherwise, our standard MOQ is 50 units per product. Orders below this quantity may be subject to additional setup charges or cancellation at our discretion."
    },
    {
      title: "4. Pricing & Payments",
      content: "All prices are subject to change. Bulk pricing discounts apply based on the quantity tiers selected. Payments must be completed via our secure gateway (UPI, Cards, Net Banking) before production begins."
    },
    {
      title: "5. Delivery Timelines",
      content: "Our standard delivery timeline is 5–10 working days PAN India. While we strive for speed, AtoZ Print is not liable for delays caused by logistics partners or unforeseen circumstances."
    }
  ];

  return (
    <div className="bg-white min-h-screen py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeading 
          badge="Legal"
          title="Terms of Service"
          subtitle="Last updated: March 2026"
          align="left"
        />
        
        <div className="mt-16 space-y-12">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight">{section.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 bg-brand-lightGray rounded-3xl border border-gray-100">
          <p className="text-sm text-gray-400 font-medium italic">
            Questions about the Terms of Service should be sent to us at support@atozprint.in.
          </p>
        </div>
      </div>
    </div>
  );
}
