import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { sendOrderConfirmationEmail } from '@/lib/email/mailer';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Fetch order items with products
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*, product:products(*)')
      .eq('order_id', orderId);

    if (itemsError) {
      console.error('[Send Confirmation] Items fetch error:', itemsError);
    }

    const emailItems = (items || []).map((item: any) => ({
      name: item.product?.name || 'Custom Print Item',
      quantity: item.quantity,
      unit_price: item.unit_price,
      quality_level: item.quality_level,
      design_preview_url: item.design_preview_url,
      product_image: item.product?.images?.[0],
    }));

    const result = await sendOrderConfirmationEmail({
      id: order.id,
      created_at: order.created_at,
      total_price: order.total_price,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      shipping_address: order.shipping_address,
      items: emailItems,
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('[Send Confirmation] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
