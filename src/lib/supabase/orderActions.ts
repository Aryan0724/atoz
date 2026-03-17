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
}

export async function createOrder(orderData: OrderInput) {
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
        status: 'pending',
        payment_status: 'unpaid'
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
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      products (
        name,
        images
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }

  return data;
}
