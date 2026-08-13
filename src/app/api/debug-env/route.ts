import { NextResponse } from 'next/server';

export async function GET() {
  // Return only status flags (true/false) for SMTP variables to avoid exposing raw passwords in public responses.
  return NextResponse.json({
    SMTP_HOST_DEFINED: typeof process.env.SMTP_HOST !== 'undefined' && process.env.SMTP_HOST !== '',
    SMTP_USER_DEFINED: typeof process.env.SMTP_USER !== 'undefined' && process.env.SMTP_USER !== '',
    SMTP_PASS_DEFINED: typeof process.env.SMTP_PASS !== 'undefined' && process.env.SMTP_PASS !== '',
    SMTP_PORT_DEFINED: typeof process.env.SMTP_PORT !== 'undefined' && process.env.SMTP_PORT !== '',
    SMTP_SECURE_DEFINED: typeof process.env.SMTP_SECURE !== 'undefined' && process.env.SMTP_SECURE !== '',
    SMTP_FROM_DEFINED: typeof process.env.SMTP_FROM !== 'undefined' && process.env.SMTP_FROM !== '',
    SMTP_KEYS_FOUND: Object.keys(process.env).filter(key => key.startsWith('SMTP_'))
  });
}
