import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { createShiprocketOrder } from '@/lib/shipping/shiprocket';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // 1. Fetch order details from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('[Shiprocket API] Order fetch error:', orderError);
      return NextResponse.json({ error: 'Order not found in database' }, { status: 404 });
    }

    // Fetch order items with products
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*, product:products(*)')
      .eq('order_id', orderId);

    if (itemsError) {
      console.error('[Shiprocket API] Items fetch error:', itemsError);
    }

    const orderItems = items || [];

    // 2. Calculate parcel dimensions and weight
    const shippingAddress = order.shipping_address as any || {};

    let totalWeight = 0;
    let maxLength = 10;
    let maxWidth = 10;
    let totalHeight = 0;

    orderItems.forEach((item: any) => {
      const p = item.product || {};
      totalWeight += (Number(p.weight) || 0.5) * (item.quantity || 1);
      maxLength = Math.max(maxLength, Number(p.length) || 10);
      maxWidth = Math.max(maxWidth, Number(p.width) || 10);
      totalHeight += (Number(p.height) || 5) * (item.quantity || 1);
    });

    if (totalHeight === 0) totalHeight = 10;
    if (totalWeight === 0) totalWeight = 0.5;

    const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || "Primary";

    const shiprocketPayload = {
      order_id: order.id,
      order_date: new Date(order.created_at || Date.now()).toISOString().split('T')[0],
      pickup_location: pickupLocation,
      billing_customer_name: shippingAddress.fullName?.split(' ')[0] || 'Customer',
      billing_last_name: shippingAddress.fullName?.split(' ').slice(1).join(' ') || '',
      billing_address: shippingAddress.address || shippingAddress.line1 || 'Address N/A',
      billing_city: shippingAddress.city || 'City',
      billing_pincode: shippingAddress.pincode || shippingAddress.postal_code || '400001',
      billing_state: shippingAddress.state || 'State',
      billing_country: "India",
      billing_email: shippingAddress.email || "customer@example.com",
      billing_phone: shippingAddress.phone || '9999999999',
      shipping_is_billing: true,
      order_items: orderItems.length > 0 ? orderItems.map((item: any) => ({
        name: item.product?.name || 'Custom Print Item',
        sku: item.product?.slug || item.product_id || item.id,
        units: item.quantity || 1,
        selling_price: item.unit_price || 0,
        discount: 0,
        tax: 0,
        hsn: ""
      })) : [{
        name: 'Custom Print Order',
        sku: order.id.slice(0, 8),
        units: 1,
        selling_price: order.total_price || 0,
        discount: 0,
        tax: 0,
        hsn: ""
      }],
      payment_method: order.payment_method === 'COD' ? 'COD' : 'Prepaid',
      sub_total: order.total_price,
      length: Math.round(maxLength),
      width: Math.round(maxWidth),
      height: Math.round(totalHeight),
      weight: Number(totalWeight.toFixed(2))
    };

    // 3. Create order in Shiprocket
    const shiprocketResponse = await createShiprocketOrder(shiprocketPayload);

    // 4. Update order in Supabase with tracking details
    const shipmentId = shiprocketResponse.shipment_id;
    const trackingUrl = shipmentId ? `https://shiprocket.co/tracking/${shipmentId}` : null;

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'dispatched',
        tracking_number: shipmentId ? shipmentId.toString() : null,
        courier_name: 'Shiprocket',
        tracking_url: trackingUrl
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('[Shiprocket API] Supabase update error:', updateError);
    }

    return NextResponse.json({
      success: true,
      shiprocket_order_id: shiprocketResponse.order_id,
      shipment_id: shiprocketResponse.shipment_id,
      tracking_url: trackingUrl
    });

  } catch (error: any) {
    console.error('[Shiprocket API Route Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to process shipment' }, { status: 500 });
  }
}
