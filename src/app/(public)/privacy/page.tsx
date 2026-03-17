import React from 'react';
import SectionHeading from '@/components/common/SectionHeading';

export default function PrivacyPage() {
  const points = [
    {
      title: "Information Collection",
      content: "We collect information such as your name, corporate email, phone number, and delivery address to process your custom printing orders and maintain your account dashboard."
    },
    {
      title: "Usage of Data",
      content: "Your data is used strictly for order fulfillment, communication regarding your designs, and improving our brand services. We do not sell your personal or corporate data to third parties."
    },
    {
      title: "Design Security",
      content: "As we handle sensitive corporate logos and brand assets, we maintain strict internal confidentiality protocols. Your designs are only accessed by the production team necessary for your order."
    },
    {
      title: "Cookies & Analytics",
      content: "We use essential cookies to manage your login session and cart. Anonymous analytics help us understand how users interact with our catalog to provide a better shopping experience."
    }
  ];

  return (
    <div className="bg-white min-h-screen py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeading 
          badge="Policy"
          title="Privacy Policy"
          subtitle="Your trust and data security are our top priorities."
          align="left"
        />
        
        <div className="mt-16 space-y-12">
          {points.map((point, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight">{point.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{point.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-400 font-medium">
            For more details on our data practices, reach out to our privacy officer at privacy@atozprint.in.
          </p>
        </div>
      </div>
    </div>
  );
}
