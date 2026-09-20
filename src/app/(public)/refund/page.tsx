import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Clock, 
  RefreshCw, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Mail, 
  Phone, 
  MessageCircle, 
  HelpCircle,
  Truck,
  Building2,
  AlertTriangle
} from 'lucide-react';
import RefundAccordion from './RefundAccordion';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy | AtoZ Prints',
  description: 'Understand our cancellation terms, replacement guarantee, and refund procedures for custom printed products and corporate orders.',
};

export default function RefundPage() {
  return (
    <div className="bg-brand-base min-h-screen text-brand-darkBlue selection:bg-brand-gold/20 selection:text-brand-darkBlue">
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-brand-darkBlue text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div 
            className="absolute inset-0" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 2px 2px, #C5A059 1px, transparent 0)', 
              backgroundSize: '40px 40px' 
            }} 
          />
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/10 blur-[160px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-blue/15 blur-[140px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
          {/* Breadcrumbs */}
          <nav className="flex items-center justify-center gap-2 text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-white/50 mb-8">
            <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
            <span className="text-white/20">/</span>
            <span className="text-brand-gold">Refund & Cancellation Policy</span>
          </nav>

          <div className="inline-flex items-center gap-2.5 py-1.5 px-4 bg-white/10 backdrop-blur-md text-brand-gold font-sans font-bold text-[10px] tracking-[0.3em] uppercase rounded-full mb-8 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
            Customer Assurance Guarantee
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.05]">
            Cancellation & <span className="italic text-brand-gold">Refund Policy</span>
          </h1>

          <p className="text-base sm:text-xl text-white/70 max-w-3xl mx-auto font-sans font-normal leading-relaxed">
            Transparent, customer-first terms for custom print manufacturing, corporate identity merchandise, and bulk orders.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 text-xs font-sans font-semibold text-white/40 tracking-wider">
            <span>Last Updated: March 2026</span>
            <span>•</span>
            <span>Razorpay & Indian Merchant Guidelines Compliant</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-20 lg:py-28">
        {/* 4 Pillars Grid */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-8 border border-brand-darkBlue/5 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-brand-gold block mb-2">Claim Window</span>
              <h3 className="font-serif text-2xl font-bold text-brand-darkBlue mb-3">48 Hours Notice</h3>
              <p className="text-sm text-gray-500 font-sans leading-relaxed">
                Report any transit damage, misprint, or manufacturing defect within 48 hours of parcel delivery for expedited processing.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-8 border border-brand-darkBlue/5 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-brand-pink/10 flex items-center justify-center text-brand-pink mb-6 group-hover:scale-110 transition-transform">
                <RefreshCw className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-brand-pink block mb-2">Quality Guarantee</span>
              <h3 className="font-serif text-2xl font-bold text-brand-darkBlue mb-3">100% Replacement</h3>
              <p className="text-sm text-gray-500 font-sans leading-relaxed">
                Verified printing discrepancies or defective merchandise are reprinted and dispatched immediately at zero additional expense.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl p-8 border border-brand-darkBlue/5 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <CreditCard className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-emerald-600 block mb-2">Settlement SLA</span>
              <h3 className="font-serif text-2xl font-bold text-brand-darkBlue mb-3">5–7 Business Days</h3>
              <p className="text-sm text-gray-500 font-sans leading-relaxed">
                Approved refunds are credited directly back to your original payment method (Cards, Net Banking, or UPI) via Razorpay.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-3xl p-8 border border-brand-darkBlue/5 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-blue-600 block mb-2">Pre-Production</span>
              <h3 className="font-serif text-2xl font-bold text-brand-darkBlue mb-3">Easy Cancellation</h3>
              <p className="text-sm text-gray-500 font-sans leading-relaxed">
                Cancel your order with a 100% refund within 2 hours of placement, or anytime prior to prepress plate creation & print sign-off.
              </p>
            </div>
          </div>
        </section>

        {/* Overview Notice on Custom Goods */}
        <section className="mb-24 bg-white rounded-3xl p-8 md:p-12 border border-brand-darkBlue/10 relative overflow-hidden shadow-sm">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0 mt-1">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-4">
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-amber-600 block">
                Custom Manufacturing Disclosure
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-darkBlue">
                Understanding Made-to-Order Custom Printing
              </h2>
              <p className="text-gray-600 font-sans text-base leading-relaxed">
                At AtoZ Prints, every unit—from custom business stationery to corporate promotional merchandise—is manufactured on-demand with bespoke artwork, logos, and specifications. Unlike generic off-the-shelf retail products, custom printed items have no resale value once fabricated.
              </p>
              <p className="text-gray-600 font-sans text-base leading-relaxed">
                Therefore, returns or refunds due to customer-initiated change of mind after production has started cannot be accepted. However, we assume <strong>100% accountability</strong> for manufacturing flaws, transit damage, or deviation from your approved design.
              </p>
            </div>
          </div>
        </section>

        {/* Eligibility Comparison Section */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-gold text-[10px] font-sans font-bold uppercase tracking-[0.3em] block mb-3">Clear Boundaries</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-darkBlue">
              Eligibility & Guidelines
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Eligible Column */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-emerald-500/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100px] pointer-events-none" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-emerald-900">Eligible for 100% Refund or Replacement</h3>
              </div>
              <ul className="space-y-4">
                {[
                  {
                    title: "Manufacturing & Print Defects",
                    desc: "Smudged prints, streaking, color bleed, miscut edges, or binding defects originating from our printing process."
                  },
                  {
                    title: "Wrong Specification or SKU Delivered",
                    desc: "Received product differs in size, paper GSM, material, or color profile from what you ordered."
                  },
                  {
                    title: "Transit Damage / Package Tampering",
                    desc: "Items crushed, torn, soaked, or broken upon courier arrival (photo/unboxing video required)."
                  },
                  {
                    title: "Lost In Transit / Non-Delivery",
                    desc: "Courier tracking permanently stalls or confirms parcel loss without resolution within SLA."
                  },
                  {
                    title: "Cancellation Prior to Production",
                    desc: "Order cancelled within 2 hours of payment or before artwork has been sent to the press."
                  }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/60">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-sm font-bold text-brand-darkBlue">{item.title}</strong>
                      <span className="text-xs text-gray-600 font-medium leading-relaxed">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Non-Eligible Column */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-red-500/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-[100px] pointer-events-none" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600">
                  <XCircle className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-red-900">Not Eligible for Refund</h3>
              </div>
              <ul className="space-y-4">
                {[
                  {
                    title: "Customer Artwork Errors & Typos",
                    desc: "Grammar, contact detail typos, or layout errors present in customer-uploaded or approved proofs."
                  },
                  {
                    title: "Low-Resolution Source Files (< 300 DPI)",
                    desc: "Pixelation resulting from low-resolution raster images supplied by the customer despite system warnings."
                  },
                  {
                    title: "Change of Mind After Press Run",
                    desc: "Cancellation requested after plates have been exposed, cutting initiated, or printing started."
                  },
                  {
                    title: "Minor Color Screen-to-Print Variance",
                    desc: "Standard 5–10% variance between RGB computer screens and CMYK physical printing pigments."
                  },
                  {
                    title: "Incorrect Delivery Address Provided",
                    desc: "Failed delivery or return-to-origin caused by invalid address or recipient unavailability."
                  }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-red-50/50 border border-red-100/60">
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-sm font-bold text-brand-darkBlue">{item.title}</strong>
                      <span className="text-xs text-gray-600 font-medium leading-relaxed">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Step-by-Step Claim Workflow */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-gold text-[10px] font-sans font-bold uppercase tracking-[0.3em] block mb-3">Resolution Flow</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-darkBlue">
              How to File a Claim in 4 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Capture Evidence",
                desc: "Take clear photos or a short video showing the outer shipping box, shipping label, and the specific defect or damaged items.",
                icon: <FileText className="w-6 h-6 text-brand-gold" />
              },
              {
                step: "02",
                title: "Reach Support Desk",
                desc: "Email printsatoz2@gmail.com or WhatsApp +91 8279427956 with your Order ID, registered phone number, and media within 48 hours.",
                icon: <Mail className="w-6 h-6 text-brand-pink" />
              },
              {
                step: "03",
                title: "Fast-Track QA Review",
                desc: "Our quality assurance team reviews the proof against prepress digital archives within 24 business hours.",
                icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />
              },
              {
                step: "04",
                title: "Speedy Resolution",
                desc: "Upon verification, choose between an instant priority reprint dispatched via express courier or a 100% refund to your original payment method.",
                icon: <CreditCard className="w-6 h-6 text-blue-600" />
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-brand-darkBlue/5 relative group hover:border-brand-gold/30 transition-all duration-300">
                <span className="font-serif text-5xl font-black text-brand-darkBlue/10 group-hover:text-brand-gold/20 transition-colors block mb-4">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-brand-base flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-darkBlue mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 font-sans leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Articles & Legal Terms */}
        <section className="mb-24 space-y-12 max-w-4xl mx-auto">
          <div className="border-b border-brand-darkBlue/10 pb-8">
            <h2 className="font-serif text-3xl font-bold text-brand-darkBlue mb-4">
              Comprehensive Policy Terms
            </h2>
            <p className="text-gray-500 font-sans text-sm">
              Please read these standard operating procedures regarding order cancellations, payment reversals, and return logistics.
            </p>
          </div>

          {/* Article 1 */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-brand-darkBlue flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-gold/15 text-brand-gold text-sm font-bold flex items-center justify-center font-sans">1</span>
              Order Cancellation Guidelines
            </h3>
            <div className="text-gray-600 font-sans text-base leading-relaxed space-y-3 pl-11">
              <p>
                <strong>Pre-Production Window:</strong> Customers may cancel an order free of charge within <strong>2 hours</strong> of placement or before our prepress technicians initiate printing plates and fabric/paper cut runs. In such cases, 100% of the paid value will be refunded immediately without any cancellation fee.
              </p>
              <p>
                <strong>In-Production Orders:</strong> Once an order status transitions to <em>&apos;In Production&apos;</em> or <em>&apos;Printing&apos;</em>, raw materials, inks, and customized plates are dedicated to your specific graphics. Cancellations at this stage are not possible.
              </p>
            </div>
          </div>

          {/* Article 2 */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-brand-darkBlue flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-gold/15 text-brand-gold text-sm font-bold flex items-center justify-center font-sans">2</span>
              Refund Method & Banking Settlement SLA
            </h3>
            <div className="text-gray-600 font-sans text-base leading-relaxed space-y-3 pl-11">
              <p>
                All refunds are routed exclusively through our official payment gateway partner, <strong>Razorpay</strong>, ensuring encrypted and compliant reversal to the source account.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                <li><strong>UPI Payments (Google Pay, PhonePe, Paytm):</strong> Reflected within 24 to 48 business hours.</li>
                <li><strong>Net Banking / Debit Cards:</strong> Typically settled within 3 to 5 business days.</li>
                <li><strong>Credit Cards:</strong> Credited within 5 to 7 business days, appearing on your subsequent billing statement according to your card issuer&apos;s cycle.</li>
              </ul>
              <p className="text-xs text-gray-400 italic">
                Note: In case of bank holidays, national festivals, or secondary banking delays, please allow up to 10 working days before escalating with your issuing bank.
              </p>
            </div>
          </div>

          {/* Article 3 */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-brand-darkBlue flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-gold/15 text-brand-gold text-sm font-bold flex items-center justify-center font-sans">3</span>
              Reverse Logistics & Return Shipping
            </h3>
            <div className="text-gray-600 font-sans text-base leading-relaxed space-y-3 pl-11">
              <p>
                If our technical quality team requires the physical return of a defective batch for forensic lab inspection, AtoZ Prints will schedule a reverse pickup via our logistics partners at <strong>our sole expense</strong>.
              </p>
              <p>
                Customers are never required to pay out-of-pocket courier fees for legitimate quality or shipping errors caused by AtoZ Prints.
              </p>
            </div>
          </div>

          {/* Article 4 */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-brand-darkBlue flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-brand-gold/15 text-brand-gold text-sm font-bold flex items-center justify-center font-sans">4</span>
              Bulk Corporate Orders & Partial Allocations
            </h3>
            <div className="text-gray-600 font-sans text-base leading-relaxed space-y-3 pl-11">
              <p>
                For volume orders (50+ to 5,000+ units), if an isolated carton or fraction of the shipment experiences transit crushing or printing defects while the remaining batch is flawless, AtoZ Prints offers:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                <li>A pro-rata partial refund matching the exact count of defective units, OR</li>
                <li>An immediate rush reprint of the defective count dispatched at zero charge.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Action / Support Desk Card */}
        <section className="mb-24 bg-brand-darkBlue text-white rounded-3xl p-8 md:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <span className="text-brand-gold text-xs font-sans font-bold uppercase tracking-[0.3em] block mb-4">
              Direct Resolution Assistance
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Need Help With an Order?
            </h2>
            <p className="text-white/70 font-sans text-base sm:text-lg mb-10 leading-relaxed">
              Have your Order ID ready? Contact our dedicated dispute resolution team directly via WhatsApp or Email. We usually reply within 2 to 4 business hours.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <a 
                href="mailto:printsatoz2@gmail.com?subject=Refund%20or%20Replacement%20Claim%20-%20Order%20ID%20%5BInsert%20Order%20%23%5D&body=Hello%20AtoZ%20Support%20Team%2C%0A%0AI%20would%20like%20to%20request%20assistance%20regarding%20my%20recent%20order.%0A%0A-%20Order%20ID%3A%20%0A-%20Registered%20Phone%20Number%3A%20%0A-%20Reason%20for%20Claim%20(Defect%20%2F%20Damage%20%2F%20Wrong%20Item)%3A%20%0A-%20Details%20of%20Issue%3A%20%0A%0A(I%20have%20attached%20photos%2Fvideo%20demonstrating%20the%20concern)%0A%0AThank%20you."
                className="inline-flex items-center gap-3 px-8 py-4 bg-brand-gold text-brand-darkBlue rounded-full font-sans font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Mail className="w-4 h-4" />
                Email Resolution Desk
              </a>

              <a 
                href="https://wa.me/918279427956?text=Hi%20AtoZ%20Prints%2C%20I%20need%20assistance%20regarding%20a%20cancellation%2C%20refund%20or%20replacement%20for%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-full font-sans font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Helpdesk
              </a>

              <Link 
                href="/track-order"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 text-white rounded-full font-sans font-bold text-xs uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
              >
                <Truck className="w-4 h-4" />
                Track Order Status
              </Link>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="mb-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-brand-gold text-[10px] font-sans font-bold uppercase tracking-[0.3em] block mb-3">FAQ</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-darkBlue">
              Frequently Asked Questions
            </h2>
          </div>

          <RefundAccordion />
        </section>

        {/* Registered Corporate Entity & Compliance Disclosure */}
        <section className="border-t border-brand-darkBlue/10 pt-16">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-brand-darkBlue/5 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-brand-gold" />
              <h3 className="font-serif text-xl font-bold text-brand-darkBlue uppercase tracking-wider">
                Official Business & Grievance Contact
              </h3>
            </div>
            <p className="text-xs text-gray-500 mb-8 font-sans leading-relaxed">
              In adherence to the Consumer Protection (E-Commerce) Rules, 2020 and payment gateway compliance mandates, the registered business details and grievance redressal officer information are published below:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm font-sans">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Legal Entity Name</span>
                <p className="font-bold text-brand-darkBlue">AtoZ Prints</p>
                <p className="text-xs text-gray-500 mt-1">Enterprise Printing Solutions</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Registered Address</span>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  501 Spectrum Square Appartment, Judge Colony, Malakpet, Hyderabad, Telangana 500036
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Contact Channels</span>
                <p className="text-xs text-gray-700">
                  Email: <a href="mailto:printsatoz2@gmail.com" className="text-brand-pink font-bold hover:underline">printsatoz2@gmail.com</a>
                </p>
                <p className="text-xs text-gray-700 mt-1">
                  Phone: <a href="tel:8279427956" className="text-brand-darkBlue font-bold hover:underline">+91 8279427956</a>
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Operating Hours</span>
                <p className="text-xs text-gray-700 font-medium">Monday to Saturday</p>
                <p className="text-xs text-gray-500">09:30 AM to 07:30 PM IST</p>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">Avg Response: &lt; 4 Hours</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
