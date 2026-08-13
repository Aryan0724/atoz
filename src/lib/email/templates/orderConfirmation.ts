export interface OrderEmailData {
  id: string;
  created_at: string;
  total_price: number;
  payment_method?: string;
  payment_status?: string;
  shipping_address: {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    [key: string]: any;
  };
  items: Array<{
    name?: string;
    quantity: number;
    unit_price: number;
    quality_level?: string;
    design_preview_url?: string;
    product_image?: string;
  }>;
  trackingUrl?: string;
  profiles?: {
    email?: string;
    full_name?: string;
    [key: string]: any;
  } | null;
}

export function generateOrderConfirmationHtml(order: OrderEmailData): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://atozprints.com';
  const trackingLink = order.trackingUrl || `${siteUrl}/orders/${order.id}/track`;
  const formattedDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const customerName = order.profiles?.full_name || order.shipping_address?.fullName || 'Valued Customer';

  const itemsHtml = (order.items || []).map(item => {
    const itemImg = item.design_preview_url || item.product_image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400';
    const itemTotal = (item.unit_price * item.quantity).toLocaleString('en-IN');
    return `
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid #f0f0f0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="72" valign="top" style="padding-right: 16px;">
                <img src="${itemImg}" alt="${item.name || 'Custom Print'}" width="64" height="64" style="border-radius: 12px; object-fit: cover; background-color: #f7f7f7; display: block; border: 1px solid #eaeaea;" />
              </td>
              <td valign="top">
                <div style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 4px;">
                  ${item.name || 'Customized Print Product'}
                </div>
                ${item.quality_level ? `<div style="font-size: 12px; font-weight: 600; color: #e81cff; text-transform: uppercase; margin-bottom: 2px;">Quality: ${item.quality_level}</div>` : ''}
                <div style="font-size: 13px; color: #6b7280;">Qty: ${item.quantity} × ₹${item.unit_price?.toLocaleString('en-IN')}</div>
              </td>
              <td width="100" align="right" valign="top">
                <div style="font-size: 15px; font-weight: 800; color: #111827;">₹${itemTotal}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }).join('');

  const addr = order.shipping_address || {};
  const fullAddress = [addr.address, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - A to Z Prints</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8f9fa; color: #111827;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #f0f0f0;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 36px 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase;">
                A to Z <span style="color: #e81cff;">Prints</span>
              </h1>
              <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                Order Confirmation
              </p>
            </td>
          </tr>

          <!-- Success Alert -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; text-align: center;">
              <div style="display: inline-block; background-color: #fdf2f8; border: 1px solid #fce7f3; color: #db2777; font-size: 13px; font-weight: 800; padding: 8px 18px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">
                ✓ Order Successfully Received
              </div>
              <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">
                Thank you for your order, ${customerName}!
              </h2>
              <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin: 0;">
                We have received your custom print order and our production team is preparing your designs for high-precision printing.
              </p>
            </td>
          </tr>

          <!-- Order Summary Card -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <div style="background-color: #f8fafc; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding-bottom: 8px;">
                      <span style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Order ID</span>
                      <div style="font-size: 15px; font-weight: 800; color: #0f172a; font-family: monospace;">#${order.id}</div>
                    </td>
                    <td align="right" style="padding-bottom: 8px;">
                      <span style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Order Date</span>
                      <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${formattedDate}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 8px; border-top: 1px solid #e2e8f0;">
                      <span style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Payment Method</span>
                      <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${order.payment_method || 'Online'} (${order.payment_status === 'paid' ? 'Paid' : 'Pending'})</div>
                    </td>
                    <td align="right" style="padding-top: 8px; border-top: 1px solid #e2e8f0;">
                      <span style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Total Amount</span>
                      <div style="font-size: 18px; font-weight: 900; color: #e81cff;">₹${order.total_price?.toLocaleString('en-IN')}</div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Items Ordered -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <h3 style="font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; margin: 0 0 12px 0;">
                Items Ordered
              </h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <div style="background-color: #ffffff; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0;">
                <h4 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; margin: 0 0 8px 0;">
                  Delivery Address
                </h4>
                <div style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 4px;">
                  ${addr.fullName || 'Recipient'} ${addr.phone ? `(${addr.phone})` : ''}
                </div>
                <div style="font-size: 13px; color: #64748b; line-height: 1.4;">
                  ${fullAddress || 'Address on file'}
                </div>
              </div>
            </td>
          </tr>

          <!-- Track CTA Button -->
          <tr>
            <td style="padding: 0 32px 40px 32px; text-align: center;">
              <a href="${trackingLink}" target="_blank" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: 800; text-decoration: none; padding: 16px 36px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
                Track Your Order Live →
              </a>
              <p style="font-size: 12px; color: #94a3b8; margin: 12px 0 0 0;">
                Need assistance? Reply directly to this email or contact support.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #f1f5f9; padding: 24px 32px; text-align: center;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                © ${new Date().getFullYear()} A to Z Prints. All rights reserved. Premium Custom Printing.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
