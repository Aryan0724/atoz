import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const orderId = uuidv4();
  console.log('Testing insert with anon key for order:', orderId);
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      id: orderId,
      user_id: null,
      total_price: 100,
      shipping_address: {},
      payment_method: 'COD',
      payment_status: 'pending_cod',
      status: 'pending'
    }])
    .select();
  
  if (error) {
    console.error('Insert failed:', error);
  } else {
    console.log('Insert succeeded:', data);
  }
}

test();
