import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }

    const API_KEY = process.env.REMOVE_BG_API_KEY;

    if (!API_KEY) {
      console.warn("REMOVE_BG_API_KEY is missing. Please add it to .env.local");
      return NextResponse.json(
        { error: 'REMOVE_BG_API_KEY is not configured on the server.' },
        { status: 500 }
      );
    }

    // Convert base64 back to a buffer to send as FormData or just send base64 to remove.bg
    // remove.bg API accepts 'image_file_b64' parameter
    
    // The base64 string from canvas usually has a prefix like "data:image/png;base64,"
    // remove.bg can handle it if we strip it, or just send it as-is in some cases.
    // Documentation says to strip the data URI prefix if sending image_file_b64
    const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_file_b64: base64Data,
        size: 'auto',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("remove.bg API error:", errorText);
      return NextResponse.json({ error: 'Failed to process image through background removal API.' }, { status: 502 });
    }

    // remove.bg returns raw binary image data
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const transparentBase64 = `data:image/png;base64,${buffer.toString('base64')}`;

    return NextResponse.json({ resultBase64: transparentBase64 });
  } catch (error) {
    console.error('BG Removal Error:', error);
    return NextResponse.json(
      { error: 'Failed to process background removal request' },
      { status: 500 }
    );
  }
}
