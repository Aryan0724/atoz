import { createClient } from '@/lib/supabase/server';
import OffersClient from './OffersClient';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Offers & Deals | AtoZ Prints',
  description: 'Unlock exclusive savings on custom printing and corporate gifting. Explore our active coupons and limited-time incentives.',
};

async function getOffers() {
  const supabase = createClient();
  const { data: coupons } = await supabase
    .from('coupons')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
    
  return coupons || [];
}

export default async function OffersPage() {
  const coupons = await getOffers();

  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white"><Loader2 className="w-12 h-12 animate-spin text-brand-pink" /></div>}>
      <OffersClient initialCoupons={coupons} />
    </Suspense>
  );
}
