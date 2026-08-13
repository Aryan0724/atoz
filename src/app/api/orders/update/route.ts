import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { sendOrderStatusEmail } from '@/lib/email/mailer';

export async function POST(req: Request) {
  try {
    const { orderId, fields } = await req.json();

    if (!orderId || !fields) {
      return NextResponse.json({ error: 'Order ID and fields are required' }, { status: 400 });
    }

    // 1. Fetch current order state to compare status
    const { data: currentOrder, error: fetchErr } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .single();

    if (fetchErr || !currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. Perform database update
    const { data: updatedOrderData, error: updateErr } = await supabase
      .from('orders')
      .update(fields)
      .eq('id', orderId)
      .select()
      .single();

    if (updateErr) {
      console.error('[Order Update API] Database update error:', updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // 3. If status or tracking information changed, send a status update email
    const statusChanged = fields.status && fields.status !== currentOrder.status;
    const trackingChanged = fields.tracking_number || fields.courier_name;

    if (statusChanged || trackingChanged) {
      try {
        // Fetch order items with products for the email body
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('*, product:products(*)')
          .eq('order_id', orderId);

        if (itemsError) {
          console.error('[Order Update API] Items fetch error:', itemsError);
        }

        const emailItems = (items || []).map((item: any) => ({
          name: item.product?.name || 'Custom Print Item',
          quantity: item.quantity,
          unit_price: item.unit_price,
          quality_level: item.quality_level,
          design_preview_url: item.design_preview_url,
          product_image: item.product?.images?.[0],
        }));

        // Send status email (asynchronously)
        sendOrderStatusEmail({
          id: updatedOrderData.id,
          created_at: updatedOrderData.created_at,
          total_price: updatedOrderData.total_price,
          payment_method: updatedOrderData.payment_method,
          payment_status: updatedOrderData.payment_status,
          status: updatedOrderData.status,
          shipping_address: updatedOrderData.shipping_address,
          estimated_delivery: updatedOrderData.estimated_delivery,
          tracking_number: updatedOrderData.tracking_number,
          courier_name: updatedOrderData.courier_name,
          tracking_url: updatedOrderData.tracking_url,
          items: emailItems,
        }).catch(emailErr => {
          console.error('[Order Update API] Email notification failed:', emailErr);
        });
      } catch (emailFetchErr) {
        console.error('[Order Update API] Failed to fetch email details:', emailFetchErr);
      }
    }

    return NextResponse.json({ success: true, order: updatedOrderData });
  } catch (error: any) {
    console.error('[Order Update API] Exception:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
