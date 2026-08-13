import { NextResponse } from 'next/server';
import { sendCorporateInquiryEmail } from '@/lib/email/mailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyName, email, scale, requirements } = body;

    if (!companyName || !email || !scale || !requirements) {
      return NextResponse.json(
        { error: 'Company Name, email, project scale, and requirements are required.' },
        { status: 400 }
      );
    }

    const emailResult = await sendCorporateInquiryEmail({
      companyName,
      email,
      scale,
      requirements,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.error || 'Failed to dispatch corporate inquiry email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Corporate inquiry submitted successfully!' });
  } catch (error: any) {
    console.error('[Corporate Inquiry API Route Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
