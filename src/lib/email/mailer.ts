import nodemailer from 'nodemailer';
import { generateOrderConfirmationHtml, OrderEmailData } from './templates/orderConfirmation';

export function getEmailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendOrderConfirmationEmail(orderData: OrderEmailData) {
  const recipientEmail = orderData.shipping_address?.email;

  if (!recipientEmail) {
    console.warn('[Mailer] No recipient email specified in orderData:', orderData.id);
    return { success: false, reason: 'No recipient email provided' };
  }

  const transporter = getEmailTransporter();
  const htmlContent = generateOrderConfirmationHtml(orderData);
  const subject = `Order Confirmed: #${orderData.id.slice(0, 8).toUpperCase()} - A to Z Prints`;
  const from = process.env.SMTP_FROM || `"A to Z Prints" <${process.env.SMTP_USER || 'orders@atozprints.com'}>`;

  if (!transporter) {
    console.log('[Mailer Demo/Unconfigured] SMTP credentials not set in .env.local.');
    console.log(`[Mailer Mock Delivery] To: ${recipientEmail} | Subject: ${subject}`);
    return { 
      success: true, 
      simulated: true, 
      message: 'SMTP credentials not configured. Email logged to server console.' 
    };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to: recipientEmail,
      subject,
      html: htmlContent,
    });

    console.log('[Mailer Success] Order confirmation sent:', info.messageId, 'to:', recipientEmail);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[Mailer Error] Failed to send email:', error.message);
    return { success: false, error: error.message };
  }
}
