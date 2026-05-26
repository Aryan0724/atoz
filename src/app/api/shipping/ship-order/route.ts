import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createShiprocketOrder } from '@/lib/shipping/shiprocket';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // 1. Fetch order details from Supabase using Server Client (respects Admin Auth/Cookies)
    const supabase = createClient();
    const { data: order, error: orderError } = await (supabase
      .from('orders') as any)
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

    // 2. Calculate dynamic parcel dimensions and weight from products in order_items
    const shippingAddress = (order as any).shipping_address as any;
    const items = (order as any).order_items || [];

    let totalWeight = 0;
    let maxLength = 10;
    let maxWidth = 10;
    let totalHeight = 0;

    items.forEach((item: any) => {
      const p = item.product || {};
      totalWeight += (Number(p.weight) || 0.5) * item.quantity;
      maxLength = Math.max(maxLength, Number(p.length) || 10);
      maxWidth = Math.max(maxWidth, Number(p.width) || 10);
      totalHeight += (Number(p.height) || 5) * item.quantity;
    });

    if (totalHeight === 0) totalHeight = 10;

    const shiprocketPayload = {
      order_id: (order as any).id,
      order_date: new Date((order as any).created_at).toISOString().split('T')[0],
      pickup_location: "Primary", // Should be configurable
      billing_customer_name: shippingAddress.fullName?.split(' ')[0] || 'Customer',
      billing_last_name: shippingAddress.fullName?.split(' ').slice(1).join(' ') || '',
      billing_address: shippingAddress.address || shippingAddress.line1 || 'Address N/A',
      billing_city: shippingAddress.city || 'City N/A',
      billing_pincode: shippingAddress.pincode || shippingAddress.postal_code || '400001',
      billing_state: shippingAddress.state || 'State N/A',
      billing_country: "India",
      billing_email: shippingAddress.email || "customer@example.com",
      billing_phone: shippingAddress.phone || '9999999999',
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
      payment_method: (order as any).payment_method === 'COD' ? 'COD' : 'Prepaid',
      sub_total: (order as any).total_price,
      length: Math.round(maxLength),
      width: Math.round(maxWidth),
      height: Math.round(totalHeight),
      weight: Number(totalWeight.toFixed(2))
    };

    // 3. Create order in Shiprocket
    const shiprocketResponse = await createShiprocketOrder(shiprocketPayload);

    // 4. Update order in Supabase with Shiprocket details
    // Note: We set status to 'dispatched' to satisfy the strict orders_status_check database constraint
    const { error: updateError } = await (supabase
      .from('orders') as any)
      .update({
        status: 'dispatched',
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
