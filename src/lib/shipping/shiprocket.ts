const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

export async function getShiprocketToken(): Promise<string> {
  // Return cached token if valid (Shiprocket tokens typically valid for 10 days)
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const rawEmail = process.env.SHIPROCKET_EMAIL || 'Printatoz954@gmail.com';
  let rawPassword = process.env.SHIPROCKET_PASSWORD || '6p6RZp$Y9xiE%NgsDaKr!FQtAPguo3SM';

  const email = rawEmail.trim();
  // Strip enclosing quotes if present in env
  let password = rawPassword.trim();
  if ((password.startsWith('"') && password.endsWith('"')) || (password.startsWith("'") && password.endsWith("'"))) {
    password = password.slice(1, -1);
  }
  // Replace escaped \$ if present from shell
  password = password.replace(/\\\$/g, '$');

  try {
    const response = await fetch(`${SHIPROCKET_API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok || !data.token) {
      const errorMsg = data.message || (typeof data.errors === 'string' ? data.errors : JSON.stringify(data.errors || data));
      throw new Error(`Shiprocket Auth Failed (${response.status}): ${errorMsg}. Please verify your Shiprocket API User credentials.`);
    }

    const token: string = data.token;
    cachedToken = token;
    // Cache for 24 hours
    tokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    return token;
  } catch (err: any) {
    cachedToken = null;
    tokenExpiresAt = 0;
    console.error('[Shiprocket Auth Error]:', err.message);
    throw err;
  }
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
    console.error('[Shiprocket Order Creation Error]:', data);
    const errorMsg = data.message || (typeof data.errors === 'string' ? data.errors : JSON.stringify(data.errors || data));
    throw new Error(`Shiprocket Order Error: ${errorMsg}`);
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
    throw new Error(data.message || 'Failed to fetch tracking information from Shiprocket');
  }

  return data;
}
