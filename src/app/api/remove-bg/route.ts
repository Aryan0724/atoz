import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

    // Call remove.bg API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
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
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json({ error: errorData.errors?.[0]?.title || 'Failed to remove background' }, { status: response.status });
      }

      const blob = await response.blob();
      
      // UPLOAD TO SUPABASE
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const fileName = `generated/${crypto.randomUUID()}.png`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('products')
        .upload(fileName, blob, { contentType: 'image/png' });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return NextResponse.json({ error: 'Failed to save processed image' }, { status: 500 });
      }

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('products')
        .getPublicUrl(fileName);

      return NextResponse.json({ imageUrl: publicUrl });

    } catch (apiErr: any) {
      clearTimeout(timeoutId);
      console.error('External API Error:', apiErr);
      return NextResponse.json({ error: apiErr.name === 'AbortError' ? 'External service timed out' : 'Failed to reach external service' }, { status: 504 });
    }

  } catch (error: any) {
    console.error('Remove BG Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
