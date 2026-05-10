import { supabase } from '../supabase/client';

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';

export async function getShiprocketToken() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error('Shiprocket credentials not configured');
  }

  const response = await fetch(`${SHIPROCKET_API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to authenticate with Shiprocket');
  }

  return data.token;
}

export async function createShiprocketOrder(orderDetails: any) {
  const token = await getShiprocketToken();

  const response = await fetch(`${SHIPROCKET_API_BASE}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(orderDetails),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error('Shiprocket Order Creation Error:', data);
    throw new Error(data.message || 'Failed to create Shiprocket order');
  }

  return data;
}

export async function getShiprocketTracking(shipmentId: string) {
  const token = await getShiprocketToken();

  const response = await fetch(`${SHIPROCKET_API_BASE}/courier/track/shipment/${shipmentId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch tracking info');
  }

  return data;
}
