'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Can I cancel my order after placing it?",
    answer: "Yes, you can cancel your order within 2 hours of placement or before our prepress team approves the artwork and starts printing plates. Once custom production or cutting has begun, cancellations cannot be accepted as materials are personalized."
  },
  {
    question: "How long does it take for a refund to reflect in my bank account?",
    answer: "Once our QA team reviews and approves your refund request, the refund is initiated immediately via Razorpay. It typically reflects in your original payment method (Bank Account, UPI, Credit/Debit Card) within 5 to 7 business days, depending on your bank's processing cycles."
  },
  {
    question: "What if my goods arrive damaged or defective?",
    answer: "If your parcel or printed goods arrive damaged or with a manufacturing defect, please photograph or record an unboxing video and email printsatoz2@gmail.com or WhatsApp us at +91 8279427956 within 48 hours of delivery. We will arrange a free expedited replacement or a 100% refund."
  },
  {
    question: "Do I have to pay for return shipping of defective items?",
    answer: "No. For verified manufacturing defects or wrong items delivered, AtoZ Prints arranges reverse pickup at our own expense. Customers incur zero out-of-pocket return shipping costs."
  },
  {
    question: "Can I get a partial refund or replacement for bulk orders?",
    answer: "Yes. If a specific batch or percentage of your bulk corporate order has defects while the rest is in perfect condition, we can issue a proportional refund or immediately reprint and dispatch the affected units."
  },
  {
    question: "Are design errors or typos eligible for a refund?",
    answer: "As clearly outlined in our design guidelines, customers are responsible for reviewing proofs, grammar, and image resolution (minimum 300 DPI recommended). Errors present in the customer-approved artwork cannot be refunded; however, our team offers discounted reprint rates to help you rectify them."
  }
];

export default function RefundAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-brand-darkBlue/10 bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-sans font-bold text-brand-darkBlue hover:text-brand-gold transition-colors"
              aria-expanded={isOpen}
            >
              <span className="text-base md:text-lg">{faq.question}</span>
              <div
                className={cn(
                  "w-8 h-8 rounded-full bg-brand-base flex items-center justify-center shrink-0 transition-transform duration-300",
                  isOpen && "rotate-180 bg-brand-gold/10 text-brand-gold"
                )}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>
            {isOpen && (
              <div className="px-6 pb-6 text-sm md:text-base text-gray-600 leading-relaxed font-sans font-medium border-t border-gray-100 pt-4 animate-fadeIn">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
