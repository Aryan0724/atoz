import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '', // Fallback for dev without keys
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      // In development mode without actual keys, return a mock order
      console.warn("Razorpay Keys missing. Returning mock order. Please add NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local");
      return NextResponse.json({
        id: "order_mock_" + Date.now(),
        amount: Math.round(amount * 100),
        currency: 'INR',
        mock: true
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: 'order_' + Date.now(),
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Razorpay Error:', error);
    return NextResponse.json(
      { error: 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
