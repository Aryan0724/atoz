import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { createShiprocketOrder } from '@/lib/shipping/shiprocket';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // 1. Fetch order details from Supabase
    // Note: We use the anon client here, so RLS must allow this or we need service role
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Supabase fetch error:', orderError);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. Prepare Shiprocket order payload
    const shippingAddress = order.shipping_address as any;
    const items = order.order_items || [];

    const shiprocketPayload = {
      order_id: order.id,
      order_date: new Date(order.created_at).toISOString().split('T')[0],
      pickup_location: "Primary", // Should be configurable
      billing_customer_name: shippingAddress.fullName?.split(' ')[0] || 'Customer',
      billing_last_name: shippingAddress.fullName?.split(' ').slice(1).join(' ') || '',
      billing_address: shippingAddress.address,
      billing_city: shippingAddress.city,
      billing_pincode: shippingAddress.pincode,
      billing_state: shippingAddress.state,
      billing_country: "India",
      billing_email: shippingAddress.email || "customer@example.com",
      billing_phone: shippingAddress.phone,
      shipping_is_billing: true,
      order_items: items.map((item: any) => ({
        name: item.product?.name || 'Custom Print Item',
        sku: item.product?.slug || item.product_id,
        units: item.quantity,
        selling_price: item.unit_price,
        discount: 0,
        tax: 0,
        hsn: ""
      })),
      payment_method: order.payment_method === 'COD' ? 'COD' : 'Prepaid',
      sub_total: order.total_price,
      length: 10, // Default cm
      width: 10,  // Default cm
      height: 10, // Default cm
      weight: 0.5 // Default kg
    };

    // 3. Create order in Shiprocket
    const shiprocketResponse = await createShiprocketOrder(shiprocketPayload);

    // 4. Update order in Supabase with Shiprocket details
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'shipped', // or 'processing' based on workflow
        tracking_number: shiprocketResponse.shipment_id?.toString(), // This is actually shipment_id, tracking comes later
        courier_name: 'Shiprocket',
        tracking_url: `https://shiprocket.co/tracking/${shiprocketResponse.shipment_id}`
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Supabase update error:', updateError);
    }

    return NextResponse.json({
      success: true,
      shiprocket_order_id: shiprocketResponse.order_id,
      shipment_id: shiprocketResponse.shipment_id
    });

  } catch (error: any) {
    console.error('Shiprocket API Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
