import { supabase } from './client';
import { Json } from './types';
import { v4 as uuidv4 } from 'uuid';

export interface OrderInput {
  user_id?: string | null;
  product_id: string;
  quantity: number;
  quality_level: string;
  design_data: Json;
  design_preview_url?: string;
  customization_details?: Json;
  total_price: number;
  shipping_address: Json;
  payment_method?: 'Online' | 'COD';
  payment_status?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
}

export async function createOrder(orderData: any) {
  // 1. Create the order header
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        user_id: orderData.user_id,
        total_price: orderData.total_price,
        shipping_address: orderData.shipping_address,
        payment_method: orderData.payment_method || 'Online',
        payment_status: orderData.payment_status || 'unpaid',
        razorpay_order_id: orderData.razorpay_order_id,
        razorpay_payment_id: orderData.razorpay_payment_id,
        status: 'pending'
      }
    ])
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order header:', orderError);
    throw orderError;
  }

  // 2. Create the order item (single item fallback for existing logic)
  const { error: itemError } = await supabase
    .from('order_items')
    .insert([
      {
        order_id: order.id,
        product_id: orderData.product_id,
        quantity: orderData.quantity,
        unit_price: orderData.unit_price || (orderData.total_price / orderData.quantity),
        quality_level: orderData.quality_level,
        design_data: orderData.design_data,
        design_preview_url: orderData.design_preview_url
      }
    ]);

  if (itemError) {
    console.error('Error creating order item:', itemError);
    throw itemError;
  }

  return order;
}

/**
 * Creates a complete order with multiple items in a single logical flow.
 */
export async function createCompleteOrder(orderData: any, items: any[]) {
  const orderId = uuidv4();

  // 1. Create the order header
  const { error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        id: orderId,
        user_id: orderData.user_id,
        total_price: orderData.total_price,
        shipping_address: orderData.shipping_address,
        payment_method: orderData.payment_method || 'Online',
        payment_status: orderData.payment_status || 'unpaid',
        razorpay_order_id: orderData.razorpay_order_id,
        razorpay_payment_id: orderData.razorpay_payment_id,
        status: orderData.status || 'pending',
        estimated_delivery: orderData.estimated_delivery || null
      }
    ]);

  if (orderError) throw orderError;

  // 2. Create all items
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(
      items.map(item => ({
        id: uuidv4(),
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price ?? item.unitPrice ?? 0,
        quality_level: item.quality_level,
        design_data: item.design_data,
        design_preview_url: item.design_preview_url
      }))
    );

  if (itemsError) throw itemsError;

  return { id: orderId, ...orderData };
}

export async function getUserOrders(userId: string) {
  // Manual Join Approach: Bypasses Supabase relationship configuration issues (PGRST200)
  const { data: orders, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (orderError) throw orderError;
  if (!orders || orders.length === 0) return [];

  // Fetch products for these orders
  const productIds = Array.from(new Set(orders.map(o => o.product_id).filter(Boolean)));
  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from('products')
      .select('id, name, images')
      .in('id', productIds);

    const productMap = (products || []).reduce((acc: any, p) => {
      acc[p.id] = p;
      return acc;
    }, {});

    return orders.map(o => ({
      ...o,
      product: productMap[o.product_id]
    }));
  }

  return orders;
}
