import { Metadata } from 'next';
import CorporateClient from './CorporateClient';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Corporate & Bulk Intelligence | AtoZ Prints',
  description: 'Enterprise-grade custom merchandise solutions. Corporate gifting, events, and bulk fulfillment with industrial precision.',
};

export default function CorporatePage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white"><Loader2 className="w-12 h-12 animate-spin text-brand-pink" /></div>}>
      <CorporateClient />
    </Suspense>
  );
}
