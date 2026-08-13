import nodemailer from 'nodemailer';
import { generateOrderConfirmationHtml, OrderEmailData } from './templates/orderConfirmation';
import { generateOrderStatusUpdateHtml, OrderStatusEmailData } from './templates/orderStatusUpdate';

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
  const recipientEmail = orderData.profiles?.email || orderData.shipping_address?.email;

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

export async function sendOrderStatusEmail(orderData: OrderStatusEmailData) {
  const recipientEmail = orderData.profiles?.email || orderData.shipping_address?.email;

  if (!recipientEmail) {
    console.warn('[Mailer] No recipient email specified in orderData:', orderData.id);
    return { success: false, reason: 'No recipient email provided' };
  }

  const transporter = getEmailTransporter();
  const htmlContent = generateOrderStatusUpdateHtml(orderData);
  
  // Format status for subject line
  const formattedStatus = orderData.status.replace(/_/g, ' ').toUpperCase();
  const subject = `Order Update: #${orderData.id.slice(0, 8).toUpperCase()} is now ${formattedStatus} - A to Z Prints`;
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

    console.log('[Mailer Success] Status update sent:', info.messageId, 'to:', recipientEmail, 'Status:', orderData.status);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[Mailer Error] Failed to send status update email:', error.message);
    return { success: false, error: error.message };
  }
}

export async function sendContactFormEmail(contactData: { 
  name: string; 
  email: string; 
  company?: string; 
  phone: string; 
  message: string; 
  interests?: string[] 
}) {
  const adminEmail = process.env.SMTP_USER || 'atozprints547@gmail.com';
  const transporter = getEmailTransporter();
  const subject = `New Contact Form Submission from ${contactData.name}`;
  const from = process.env.SMTP_FROM || `"A to Z Prints Support" <${adminEmail}>`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
      <h2 style="color: #0f172a; border-bottom: 2px solid #e81cff; padding-bottom: 10px;">New Website Contact Inquiry</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #64748b; width: 150px;">Name:</td>
          <td style="padding: 8px 0; color: #0f172a;">${contactData.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Email:</td>
          <td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${contactData.email}">${contactData.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Phone:</td>
          <td style="padding: 8px 0; color: #0f172a;"><a href="tel:${contactData.phone}">${contactData.phone}</a></td>
        </tr>
        ${contactData.company ? `
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Company:</td>
          <td style="padding: 8px 0; color: #0f172a;">${contactData.company}</td>
        </tr>` : ''}
        ${contactData.interests && contactData.interests.length > 0 ? `
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Interests:</td>
          <td style="padding: 8px 0; color: #0f172a;">${contactData.interests.join(', ')}</td>
        </tr>` : ''}
      </table>
      <div style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border-radius: 6px; border-left: 4px solid #0f172a;">
        <h4 style="margin: 0 0 8px 0; color: #0f172a;">Message:</h4>
        <p style="margin: 0; color: #334155; line-height: 1.5; white-space: pre-wrap;">${contactData.message}</p>
      </div>
      <p style="font-size: 11px; color: #94a3b8; margin-top: 30px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 15px;">
        Sent from A to Z Prints contact form pipeline.
      </p>
    </div>
  `;

  if (!transporter) {
    console.log('[Mailer Demo/Unconfigured] SMTP credentials not set in .env.local.');
    console.log(`[Mailer Mock Delivery] To Admin: ${adminEmail} | Subject: ${subject}`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to: adminEmail,
      subject,
      html: htmlContent,
    });
    console.log('[Mailer Success] Contact email sent to admin:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[Mailer Error] Failed to send contact email:', error.message);
    return { success: false, error: error.message };
  }
}

export async function sendCorporateInquiryEmail(inquiryData: { 
  companyName: string; 
  email: string; 
  scale: string; 
  requirements: string;
}) {
  const adminEmail = process.env.SMTP_USER || 'atozprints547@gmail.com';
  const transporter = getEmailTransporter();
  const subject = `🚀 Enterprise Inquiry: ${inquiryData.companyName}`;
  const from = process.env.SMTP_FROM || `"A to Z Prints Enterprise" <${adminEmail}>`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
      <h2 style="color: #0f172a; border-bottom: 2px solid #e81cff; padding-bottom: 10px; display: flex; align-items: center; gap: 8px;">
        🚀 Enterprise Inquiry Protocol
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #64748b; width: 150px;">Company Entity:</td>
          <td style="padding: 8px 0; color: #0f172a; font-weight: bold;">${inquiryData.companyName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Work Email:</td>
          <td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${inquiryData.email}">${inquiryData.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Project Scale:</td>
          <td style="padding: 8px 0; color: #e81cff; font-weight: bold;">${inquiryData.scale}</td>
        </tr>
      </table>
      <div style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border-radius: 6px; border-left: 4px solid #e81cff;">
        <h4 style="margin: 0 0 8px 0; color: #0f172a;">Mission Requirements:</h4>
        <p style="margin: 0; color: #334155; line-height: 1.5; white-space: pre-wrap;">${inquiryData.requirements}</p>
      </div>
      <p style="font-size: 11px; color: #94a3b8; margin-top: 30px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 15px;">
        Sent from A to Z Prints Corporate Briefing portal.
      </p>
    </div>
  `;

  if (!transporter) {
    console.log('[Mailer Demo/Unconfigured] SMTP credentials not set in .env.local.');
    console.log(`[Mailer Mock Delivery] To Admin: ${adminEmail} | Subject: ${subject}`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to: adminEmail,
      subject,
      html: htmlContent,
    });
    console.log('[Mailer Success] Corporate inquiry sent to admin:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[Mailer Error] Failed to send corporate inquiry email:', error.message);
    return { success: false, error: error.message };
  }
}
