import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import TrackOrderClient from './TrackOrderClient';

interface TrackOrderPageProps {
  params: {
    id: string;
  };
}

export default async function TrackOrderPage({ params }: TrackOrderPageProps) {
  const supabase = createClient();
  
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, products(*)')
    .eq('id', params.id)
    .single();

  if (error || !order) {
    // We can't really notFound() if it's a demo, but for production it's correct
    // Let's at least check if it's a valid UUID format to avoid errors
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(params.id)) {
      notFound();
    }
  }

  return <TrackOrderClient order={order} />;
}
