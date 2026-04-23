import { supabase } from './client';
import { Json } from './types';

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

export async function createOrder(orderData: OrderInput) {
  const isCOD = orderData.payment_method === 'COD';
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        user_id: orderData.user_id,
        product_id: orderData.product_id,
        quantity: orderData.quantity,
        quality_level: orderData.quality_level,
        design_data: orderData.design_data,
        design_preview_url: orderData.design_preview_url,
        customization_details: orderData.customization_details,
        total_price: orderData.total_price,
        shipping_address: orderData.shipping_address,
        payment_method: orderData.payment_method || 'Online',
        status: 'pending',
        payment_status: orderData.payment_status || (isCOD ? 'pending_cod' : 'unpaid'),
        razorpay_order_id: orderData.razorpay_order_id,
        razorpay_payment_id: orderData.razorpay_payment_id,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    throw error;
  }

  return data;
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
