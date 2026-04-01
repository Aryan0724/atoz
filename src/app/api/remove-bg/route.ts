import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();
    const apiKey = process.env.REMOVE_BG_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Background removal API key not configured. Please add REMOVE_BG_API_KEY to .env.local' }, { status: 500 });
    }

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Call remove.bg API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        size: 'auto',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.errors?.[0]?.title || 'Failed to remove background' }, { status: response.status });
    }

    const blob = await response.blob();
    return new NextResponse(blob, {
        headers: {
            'Content-Type': 'image/png'
        }
    });

  } catch (error: any) {
    console.error('Remove BG Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
