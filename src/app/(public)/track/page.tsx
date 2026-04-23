import { Metadata } from 'next';
import TrackClient from './TrackClient';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Track Your Order | AtoZ Prints',
  description: 'Monitor your order progress in real-time. From printing to final quality audit and dispatch.',
};

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white"><Loader2 className="w-12 h-12 animate-spin text-brand-pink" /></div>}>
      <TrackClient />
    </Suspense>
  );
}
