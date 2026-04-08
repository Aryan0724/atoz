import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, Info, FileText, Scale } from 'lucide-react';
import SectionHeading from '@/components/common/SectionHeading';

export const metadata: Metadata = {
  title: 'Legal | A to Z Prints',
  description: 'Terms of Service, Privacy Policy, and legal compliance for AtoZ Prints.',
};

export default function LegalPage() {
  return (
    <div className="bg-[#F9F9F7] min-h-screen pt-32 pb-24 text-brand-dark selection:bg-brand-pink/10 selection:text-brand-pink">
      <div className="max-w-4xl mx-auto px-8 relative z-10">
        <SectionHeading 
          badge="Compliance & Strategy"
          title="Legal Framework"
          subtitle="Transparent terms of engagement for our corporate partners and individual creators."
          align="left"
          className="mb-20"
        />

        <div className="space-y-24">
          {/* Privacy Policy */}
          <section id="privacy" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-brand-pink">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Privacy Foundation</h2>
            </div>
            
            <div className="prose prose-pink max-w-none text-gray-500 font-medium leading-relaxed space-y-6">
              <p className="text-sm uppercase tracking-widest font-black text-brand-dark opacity-40 italic">Last Updated: April 6, 2026</p>
              
              <div className="space-y-4">
                 <h3 className="text-lg font-black text-brand-dark uppercase tracking-tight">1. Data Architecture</h3>
                 <p>At AtoZ Prints, we treat data as a critical strategic asset. All customer information, including design assets and private identifiers, is encrypted at rest and in transit. We collect only what is necessary to fulfill your customized product lifecycle.</p>
              </div>

              <div className="space-y-4">
                 <h3 className="text-lg font-black text-brand-dark uppercase tracking-tight">2. Information Deployment</h3>
                 <p>Your data is used exclusively for order fulfillment, design synchronization, and logistics dispatch. We do not engage in third-party data brokerage or unauthorized information leasing.</p>
              </div>

              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm mt-12">
                 <div className="flex items-start gap-6">
                    <Info className="w-8 h-8 text-brand-pink shrink-0" />
                    <p className="text-[11px] font-black uppercase tracking-widest leading-loose">
                       AtoZ Prints complies with global data sovereignty standards, ensuring that your branding assets and design logic remain your intellectual property throughout the manufacturing process.
                    </p>
                 </div>
              </div>
            </div>
          </section>

          {/* Terms of Service */}
          <section id="terms" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-brand-dark">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Manufacturing Terms</h2>
            </div>

            <div className="prose prose-pink max-w-none text-gray-500 font-medium leading-relaxed space-y-6">
               <div className="space-y-4">
                  <h3 className="text-lg font-black text-brand-dark uppercase tracking-tight">3. Design Integrity</h3>
                  <p>By deploying assets to the AtoZ Designer Studio, you certify that you own or have licensed all necessary intellectual property. We act as a manufacturing execution layer; the legal responsibility for content remains with the strategic initiator.</p>
               </div>

               <div className="space-y-4">
                  <h3 className="text-lg font-black text-brand-dark uppercase tracking-tight">4. Production SLA</h3>
                  <p>Standard fulfillment windows are 7-12 business days depending on volume escalation. Bulk orders for corporate partners are subject to specific manufacturing timelines agreed upon during the quote phase.</p>
               </div>

               <div className="bg-brand-dark p-10 rounded-[48px] text-white overflow-hidden relative group mt-12">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Scale className="w-24 h-24" /></div>
                  <h4 className="text-sm font-black italic uppercase tracking-widest text-brand-pink mb-4">Refund Strategy</h4>
                  <p className="text-xs font-bold text-gray-300 uppercase leading-relaxed tracking-tight">
                     Due to the irreversible nature of custom manufacturing, refunds are only issued for production defects or logic errors that deviate from the approved design on canvas.
                  </p>
               </div>
            </div>
          </section>

          {/* Logistics & Shipping */}
          <section id="shipping" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-brand-dark">
                  <ShieldCheck className="w-6 h-6 text-brand-pink" />
               </div>
               <h2 className="text-3xl font-black italic uppercase tracking-tighter">Strategic Logistics</h2>
            </div>
            <div className="prose prose-pink max-w-none text-gray-500 font-medium leading-relaxed space-y-6">
               <p>Our fulfillment infrastructure is optimized for PAN-India distribution. We partner with Tier-1 logistics providers to ensure your branding assets remain intact and are delivered within the specified business SLAs.</p>
               <ul className="list-none space-y-4 p-0">
                  <li className="flex gap-4">
                     <span className="text-brand-pink font-black italic">Dispatch:</span>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/60">Standard 48-72h for catalog items.</span>
                  </li>
                  <li className="flex gap-4">
                     <span className="text-brand-pink font-black italic">Tracking:</span>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/60">Real-time GPS synchronization on all bulk cargo.</span>
                  </li>
               </ul>
            </div>
          </section>

          {/* Corporate Conduct */}
          <section id="conduct" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-brand-dark">
                  <Scale className="w-6 h-6" />
               </div>
               <h2 className="text-3xl font-black italic uppercase tracking-tighter">Business Conduct</h2>
            </div>
            <p className="text-sm font-medium text-gray-500 leading-relaxed">
               AtoZ Prints operates under a strict code of ethics, ensuring fair labor practices and environmental mindfulness in our printing infrastructure. For specific corporate audit requests, please contact our strategic operations lead.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
