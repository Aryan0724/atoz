import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { sendOrderConfirmationEmail } from '@/lib/email/mailer';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderData, items } = body;

    if (!orderData || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid order payload. Order data and items are required.' },
        { status: 400 }
      );
    }

    const orderId = orderData.id || uuidv4();

    // 1. Insert Order Header
    const { data: createdOrder, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          id: orderId,
          user_id: orderData.user_id || null,
          total_price: orderData.total_price,
          shipping_address: orderData.shipping_address,
          payment_method: orderData.payment_method || 'Online',
          payment_status: orderData.payment_status || 'unpaid',
          razorpay_order_id: orderData.razorpay_order_id || null,
          razorpay_payment_id: orderData.razorpay_payment_id || null,
          status: orderData.status || 'pending',
          estimated_delivery: orderData.estimated_delivery || null,
        }
      ])
      .select()
      .single();

    if (orderError) {
      console.error('[Order API] Order header insert error:', orderError);
      return NextResponse.json(
        { error: orderError.message || 'Failed to insert order' },
        { status: 500 }
      );
    }

    // 2. Insert Order Items
    const orderItemsToInsert = items.map(item => ({
      id: uuidv4(),
      order_id: orderId,
      product_id: item.product_id || item.product?.id || null,
      quantity: item.quantity || 1,
      unit_price: item.unit_price ?? item.unitPrice ?? 0,
      quality_level: item.quality_level || 'Standard',
      design_data: item.design_data || null,
      design_preview_url: item.design_preview_url || null,
    }));

    const { data: createdItems, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert)
      .select();

    if (itemsError) {
      console.error('[Order API] Order items insert error:', itemsError);
      return NextResponse.json(
        { error: itemsError.message || 'Failed to insert order items' },
        { status: 500 }
      );
    }

    // 3. Prepare items data with product names/images for confirmation email
    const emailItems = items.map(item => ({
      name: item.product?.name || item.name || 'Custom Print Item',
      quantity: item.quantity || 1,
      unit_price: item.unit_price ?? item.unitPrice ?? 0,
      quality_level: item.quality_level,
      design_preview_url: item.design_preview_url,
      product_image: item.product?.images?.[0],
    }));

    // Trigger confirmation email asynchronously (does not block order response)
    sendOrderConfirmationEmail({
      id: orderId,
      created_at: createdOrder.created_at || new Date().toISOString(),
      total_price: createdOrder.total_price,
      payment_method: createdOrder.payment_method,
      payment_status: createdOrder.payment_status,
      shipping_address: createdOrder.shipping_address,
      items: emailItems,
    }).catch(emailErr => {
      console.error('[Order API] Confirmation email trigger error:', emailErr);
    });

    return NextResponse.json({
      success: true,
      order: createdOrder,
      items: createdItems,
    });
  } catch (error: any) {
    console.error('[Order API] Unhandled exception:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while processing order' },
      { status: 500 }
    );
  }
}
