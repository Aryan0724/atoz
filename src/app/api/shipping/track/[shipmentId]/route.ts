import { NextResponse } from 'next/server';
import { getShiprocketTracking } from '@/lib/shipping/shiprocket';

export async function GET(
  req: Request,
  { params }: { params: { shipmentId: string } }
) {
  try {
    const { shipmentId } = params;

    if (!shipmentId) {
      return NextResponse.json({ error: 'Shipment ID is required' }, { status: 400 });
    }

    const trackingData = await getShiprocketTracking(shipmentId);

    return NextResponse.json(trackingData);
  } catch (error: any) {
    console.error('Tracking API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
