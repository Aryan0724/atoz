import { NextResponse } from 'next/server';
import { sendContactFormEmail } from '@/lib/email/mailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, phone, message, interests } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Name, email, phone, and message are required fields.' },
        { status: 400 }
      );
    }

    const emailResult = await sendContactFormEmail({
      name,
      email,
      company,
      phone,
      message,
      interests,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.error || 'Failed to dispatch email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });
  } catch (error: any) {
    console.error('[Contact API Route Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
