export interface OrderStatusEmailData {
  id: string;
  created_at: string;
  total_price: number;
  payment_method?: string;
  payment_status?: string;
  status: string;
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
  estimated_delivery?: string | null;
  tracking_number?: string | null;
  courier_name?: string | null;
  tracking_url?: string | null;
}

export function generateOrderStatusUpdateHtml(order: OrderStatusEmailData): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://atozprints.com';
  const trackingLink = order.tracking_url || `${siteUrl}/orders/${order.id}/track`;
  
  const formattedDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const formattedEstDelivery = order.estimated_delivery
    ? new Date(order.estimated_delivery).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : null;

  // Status human-readable mapping & details
  const statusDetails: Record<string, { label: string; desc: string; color: string; bg: string }> = {
    pending: {
      label: 'Pending Verification',
      desc: 'Your order is currently awaiting verification and validation.',
      color: '#d97706',
      bg: '#fef3c7'
    },
    pending_approval: {
      label: 'Pending Approval',
      desc: 'Your order is awaiting approval from our logistics team.',
      color: '#ea580c',
      bg: '#ffedd5'
    },
    confirmed: {
      label: 'Order Confirmed',
      desc: 'Your order has been confirmed! Our design specialists are preparing it for print.',
      color: '#0284c7',
      bg: '#e0f2fe'
    },
    in_production: {
      label: 'In Production',
      desc: 'Great news! Your custom items are currently on the printing press.',
      color: '#2563eb',
      bg: '#dbeafe'
    },
    dispatched: {
      label: 'Order Dispatched',
      desc: 'Your order has left our facility and is on its way to you.',
      color: '#7c3aed',
      bg: '#ede9fe'
    },
    out_for_delivery: {
      label: 'Out for Delivery',
      desc: 'Your shipment is in your local area and out for delivery today!',
      color: '#db2777',
      bg: '#fce7f3'
    },
    delivered: {
      label: 'Delivered',
      desc: 'Your order has been successfully delivered! We hope you love your prints.',
      color: '#16a34a',
      bg: '#dcfce7'
    },
    cancelled: {
      label: 'Cancelled',
      desc: 'Your order has been cancelled. If you have any questions, please contact support.',
      color: '#dc2626',
      bg: '#fee2e2'
    }
  };

  const currentStatus = statusDetails[order.status.toLowerCase()] || {
    label: order.status.toUpperCase(),
    desc: 'Your order status has been updated.',
    color: '#0f172a',
    bg: '#f1f5f9'
  };

  // Build items list HTML
  const itemsHtml = (order.items || []).map(item => {
    const itemImg = item.design_preview_url || item.product_image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400';
    const itemTotal = (item.unit_price * item.quantity).toLocaleString('en-IN');
    return `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="50" valign="top" style="padding-right: 12px;">
                <img src="${itemImg}" alt="${item.name || 'Custom Print'}" width="44" height="44" style="border-radius: 8px; object-fit: cover; background-color: #f7f7f7; display: block; border: 1px solid #eaeaea;" />
              </td>
              <td valign="top">
                <div style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 2px;">
                  ${item.name || 'Customized Print Product'}
                </div>
                <div style="font-size: 11px; color: #64748b;">Qty: ${item.quantity} × ₹${item.unit_price?.toLocaleString('en-IN')}</div>
              </td>
              <td width="80" align="right" valign="top">
                <div style="font-size: 14px; font-weight: 800; color: #0f172a;">₹${itemTotal}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }).join('');

  // Status timeline steps highlight logic
  const steps = ['confirmed', 'in_production', 'dispatched', 'delivered'];
  const statusIndex = steps.indexOf(order.status.toLowerCase());
  
  const stepIndicatorsHtml = steps.map((step, idx) => {
    const isCompleted = idx <= statusIndex;
    const color = isCompleted ? '#e81cff' : '#cbd5e1';
    const textColor = isCompleted ? '#0f172a' : '#94a3b8';
    const label = step.replace('_', ' ').toUpperCase();
    
    return `
      <td align="center" style="width: 25%; font-size: 10px; font-weight: 800; color: ${textColor}; padding-top: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${color}; margin-bottom: 6px; display: inline-block;"></div>
        <br/>${label}
      </td>
    `;
  }).join('');

  const addr = order.shipping_address || {};
  const fullAddress = [addr.address, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ');

  // Tracking section (only show if tracking info is present)
  const showTracking = order.tracking_number || order.courier_name;
  const trackingHtml = showTracking ? `
    <tr>
      <td style="padding: 0 32px 24px 32px;">
        <div style="background-color: #f8fafc; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0;">
          <h4 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; margin: 0 0 12px 0;">
            Logistics & Tracking
          </h4>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px; line-height: 1.5; color: #475569;">
            ${order.courier_name ? `
            <tr>
              <td style="padding-bottom: 6px; font-weight: 600; color: #94a3b8; text-transform: uppercase; font-size: 10px; tracking-wider: 1px;">Courier Partner</td>
              <td style="padding-bottom: 6px; font-weight: 700; color: #0f172a; text-align: right;">${order.courier_name}</td>
            </tr>` : ''}
            ${order.tracking_number ? `
            <tr>
              <td style="padding-bottom: 6px; font-weight: 600; color: #94a3b8; text-transform: uppercase; font-size: 10px; tracking-wider: 1px;">Tracking ID</td>
              <td style="padding-bottom: 6px; font-weight: 700; color: #0f172a; font-family: monospace; text-align: right;">${order.tracking_number}</td>
            </tr>` : ''}
            ${formattedEstDelivery ? `
            <tr>
              <td style="font-weight: 600; color: #94a3b8; text-transform: uppercase; font-size: 10px; tracking-wider: 1px;">Estimated Delivery</td>
              <td style="font-weight: 700; color: #e81cff; text-align: right;">${formattedEstDelivery}</td>
            </tr>` : ''}
          </table>
        </div>
      </td>
    </tr>
  ` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Status Update - A to Z Prints</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8f9fa; color: #111827;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #f0f0f0;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase;">
                A to Z <span style="color: #e81cff;">Prints</span>
              </h1>
              <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                Order Tracker
              </p>
            </td>
          </tr>

          <!-- Main Status Notification -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center;">
              <div style="display: inline-block; background-color: ${currentStatus.bg}; color: ${currentStatus.color}; font-size: 12px; font-weight: 800; padding: 8px 18px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">
                ${currentStatus.label}
              </div>
              <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0; letter-spacing: -0.5px;">
                Your order status has been updated.
              </h2>
              <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin: 0; max-w: 480px; display: inline-block;">
                ${currentStatus.desc}
              </p>
            </td>
          </tr>

          <!-- Visual Progress Step Bar (only for standard lifecycle statuses) -->
          ${statusIndex !== -1 ? `
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 16px 0;">
                <tr>
                  ${stepIndicatorsHtml}
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- Order Summary Card -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <div style="background-color: #f8fafc; border-radius: 16px; padding: 18px; border: 1px solid #e2e8f0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px;">
                  <tr>
                    <td style="padding-bottom: 6px;">
                      <span style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Order ID</span>
                      <div style="font-size: 14px; font-weight: 800; color: #0f172a; font-family: monospace;">#${order.id}</div>
                    </td>
                    <td align="right" style="padding-bottom: 6px;">
                      <span style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Last Updated</span>
                      <div style="font-size: 13px; font-weight: 700; color: #0f172a;">${formattedDate}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 6px; border-top: 1px solid #e2e8f0;">
                      <span style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Recipient</span>
                      <div style="font-size: 13px; font-weight: 700; color: #0f172a;">${addr.fullName || 'Customer'}</div>
                    </td>
                    <td align="right" style="padding-top: 6px; border-top: 1px solid #e2e8f0;">
                      <span style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Total Amount</span>
                      <div style="font-size: 15px; font-weight: 900; color: #e81cff;">₹${order.total_price?.toLocaleString('en-IN')}</div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Tracking Section -->
          ${trackingHtml}

          <!-- Items list -->
          ${itemsHtml ? `
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <h3 style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a; margin: 0 0 10px 0;">
                Order Contents
              </h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${itemsHtml}
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- Track CTA Button -->
          <tr>
            <td style="padding: 8px 32px 40px 32px; text-align: center;">
              <a href="${trackingLink}" target="_blank" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 13px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                View Full Tracking Status →
              </a>
              <p style="font-size: 11px; color: #94a3b8; margin: 12px 0 0 0;">
                Need help or have design changes? Contact our print desk immediately.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #f1f5f9; padding: 20px 32px; text-align: center;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                © ${new Date().getFullYear()} A to Z Prints. Custom B2B & B2C Print Solutions.
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
