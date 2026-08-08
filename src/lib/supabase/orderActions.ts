import { supabase } from './client';
import { Json } from './types';
import { v4 as uuidv4 } from 'uuid';

export interface OrderInput {
  user_id?: string | null;
  product_id?: string;
  quantity?: number;
  quality_level?: string;
  design_data?: Json;
  design_preview_url?: string;
  customization_details?: Json;
  total_price: number;
  shipping_address: Json;
  payment_method?: 'Online' | 'COD';
  payment_status?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  status?: string;
  estimated_delivery?: string | null;
}

export async function createOrder(orderData: any) {
  return createCompleteOrder(orderData, [
    {
      product_id: orderData.product_id,
      quantity: orderData.quantity || 1,
      unit_price: orderData.unit_price || (orderData.total_price / (orderData.quantity || 1)),
      quality_level: orderData.quality_level || 'Standard',
      design_data: orderData.design_data,
      design_preview_url: orderData.design_preview_url,
    }
  ]);
}

/**
 * Creates a complete order with multiple items in a single logical flow.
 * Uses server endpoint for reliability, payment tracking, and automated confirmation emails.
 */
export async function createCompleteOrder(orderData: any, items: any[]) {
  try {
    const res = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderData, items }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.order) {
        return data.order;
      }
    }
  } catch (apiErr) {
    console.warn('[OrderActions] Server order API call failed, falling back to direct client insert:', apiErr);
  }

  // Fallback: Direct Supabase Client Insertion
  const orderId = orderData.id || uuidv4();

  const { data: order, error: orderError } = await supabase
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

  if (orderError) throw orderError;

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(
      items.map(item => ({
        id: uuidv4(),
        order_id: orderId,
        product_id: item.product_id || item.product?.id || null,
        quantity: item.quantity || 1,
        unit_price: item.unit_price ?? item.unitPrice ?? 0,
        quality_level: item.quality_level || 'Standard',
        design_data: item.design_data || null,
        design_preview_url: item.design_preview_url || null,
      }))
    );

  if (itemsError) throw itemsError;

  return order || { id: orderId, ...orderData };
}

export async function getUserOrders(userId: string) {
  const { data: orders, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (orderError) throw orderError;
  if (!orders || orders.length === 0) return [];

  // Fetch all order_items for these orders
  const orderIds = orders.map(o => o.id);
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*, product:products(*)')
    .in('order_id', orderIds);

  if (itemsError) {
    console.error('[getUserOrders] Error fetching order items:', itemsError);
    return orders;
  }

  // Map items to their respective orders
  const itemsByOrderId: Record<string, any[]> = {};
  (items || []).forEach((item: any) => {
    if (!itemsByOrderId[item.order_id]) {
      itemsByOrderId[item.order_id] = [];
    }
    itemsByOrderId[item.order_id].push(item);
  });

  return orders.map(o => ({
    ...o,
    order_items: itemsByOrderId[o.id] || [],
    // Provide top-level design preview and product for backwards compatibility
    design_preview_url: itemsByOrderId[o.id]?.[0]?.design_preview_url || null,
    products: itemsByOrderId[o.id]?.[0]?.product || null,
  }));
}
