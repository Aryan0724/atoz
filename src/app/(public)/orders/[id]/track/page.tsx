import React from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import TrackOrderClient from './TrackOrderClient';

interface TrackOrderPageProps {
  params: {
    id: string;
  };
}

export default async function TrackOrderPage({ params }: TrackOrderPageProps) {
  // Fetch order from database
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', params.id)
    .single();

  let order = orderData;

  if (order) {
    // Fetch order items with products
    const { data: items } = await supabase
      .from('order_items')
      .select('*, product:products(*)')
      .eq('order_id', params.id);

    order = {
      ...order,
      order_items: items || [],
      // For backwards compatibility with single product view
      products: items?.[0]?.product || null,
      design_preview_url: items?.[0]?.design_preview_url || null,
    };
  }

  if (!order) {
    // Check if it's a valid UUID format before 404
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(params.id)) {
      notFound();
    }
  }

  return <TrackOrderClient order={order} />;
}
