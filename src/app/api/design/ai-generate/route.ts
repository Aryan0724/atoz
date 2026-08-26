import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'GEMINI_API_KEY is not configured in your environment variables. Please add it to .env.local to enable the AI Designer feature.' 
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { prompt, mode = 'layout', productCategory = 'Apparel', canvasWidth = 500, canvasHeight = 625 } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required.' },
        { status: 400 }
      );
    }

    if (mode === 'image-prompt') {
      const geminiRequestBody = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are an expert prompt engineer for text-to-image AI generators.
Rewrite the following user description into a highly detailed, professional, and descriptive prompt for generating a beautiful design graphic for a "${productCategory}".
The prompt should focus on style (e.g. vector graphic, digital painting, watercolor, vintage, neon, sticker, pop art), crisp details, specific color schemes, clean lighting, and solid compositions. Keep it as a single paragraph. Do not include introductory text like "Here is the prompt:". Return ONLY the raw rewritten prompt text.

User Description: "${prompt}"`
              }
            ]
          }
        ]
      };

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(geminiRequestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { error: `Gemini API responded with status ${response.status}: ${errorText}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      const generatedPrompt = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!generatedPrompt) {
        return NextResponse.json(
          { error: 'Gemini did not return any prompt.' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, prompt: generatedPrompt });
    }

    // List of allowed fonts from src/lib/fontUtils.ts
    const allowedFonts = [
      'Inter', 'Montserrat', 'Bebas Neue', 'Oswald',
      'Playfair Display', 'Merriweather', 'Lora',
      'Pacifico', 'Dancing Script', 'Caveat', 'Satisfy',
      'Righteous', 'Lobster', 'Abhaya Libre', 'Luckiest Guy'
    ];

    // List of allowed icons from src/lib/data/icons.ts
    const allowedIcons = [
      // Shapes
      'circle', 'square', 'triangle', 'star', 'heart', 'diamond', 'hexagon', 'octagon',
      // Business
      'briefcase', 'chart', 'target', 'check-badge', 'shield-lock', 'user-badge', 'globe-network', 'layers-clean',
      // Symbols
      'sparkle', 'zap-bold', 'anchor', 'infinite', 'crown-simple', 'sun', 'moon', 'flame',
      // Social
      'facebook-outline', 'instagram-outline', 'twitter-outline', 'linkedin-outline', 'whatsapp-outline', 'mail-outline'
    ];

    const systemInstruction = `You are an expert graphic designer. Your job is to create visual design layouts by producing structured canvas elements in JSON format.
You are designing a "${productCategory}" on a canvas of width ${canvasWidth}px and height ${canvasHeight}px.
The center of the canvas is at (X: ${canvasWidth / 2}, Y: ${canvasHeight / 2}).

Based on the user prompt, compose a beautiful, cohesive, and modern design. You can use text elements, basic geometric shapes, and icons. Ensure the alignment, layout hierarchy, margins, colors, and sizing are professional.

Constraints:
1. All elements must stay within the canvas boundaries. Give safe margin offsets of at least 40px from the edges.
2. Select text fonts ONLY from the following allowed list: ${allowedFonts.join(', ')}.
3. Select icon names ONLY from the following allowed list: ${allowedIcons.join(', ')}.
4. Cohesive styling: pick a clear, limited color palette (3-4 colors max) that fits the user's description.
5. All coordinates must be absolute numbers (e.g. left: 250, top: 150) centered on each element's origin.

Allowed element types:
- "text": For text copy (headlines, subheadings, details). Can specify text, fontFamily, fontSize, fill, fontWeight, fontStyle, left, top, textAlign, angle.
- "shape": For background accents, boxes, lines. Can specify shapeType (circle, rect, triangle, line, star, heart), fill, left, top, scaleX, scaleY, width, height, radius, angle.
- "icon": For vector illustrations or logos. Can specify iconName, fill, left, top, scaleX, scaleY, angle.`;

    const geminiRequestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Generate a canvas design for a ${productCategory} (canvas size ${canvasWidth}x${canvasHeight}) matching this request: "${prompt}"`
            }
          ]
        }
      ],
      systemInstruction: {
        parts: [
          {
            text: systemInstruction
          }
        ]
      },
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            backgroundColor: { 
              type: 'STRING', 
              description: 'Cohesive background hex color or tint suggestion for the canvas or product base.' 
            },
            elements: {
              type: 'ARRAY',
              description: 'An array of styled layers to add to the designer canvas, sorted from back to front.',
              items: {
                type: 'OBJECT',
                properties: {
                  type: { 
                    type: 'STRING', 
                    enum: ['text', 'shape', 'icon'] 
                  },
                  // Text properties
                  text: { type: 'STRING' },
                  fontFamily: { type: 'STRING' },
                  fontSize: { type: 'INTEGER' },
                  fill: { type: 'STRING', description: 'Hex code color (e.g. #FF0000)' },
                  fontWeight: { type: 'STRING', enum: ['normal', 'bold'] },
                  fontStyle: { type: 'STRING', enum: ['normal', 'italic'] },
                  textAlign: { type: 'STRING', enum: ['left', 'center', 'right'] },
                  // Shape properties
                  shapeType: { type: 'STRING', enum: ['circle', 'rect', 'triangle', 'star', 'heart', 'line'] },
                  width: { type: 'INTEGER', description: 'Width for rect or triangle (default 80)' },
                  height: { type: 'INTEGER', description: 'Height for rect, triangle, or line (default 80)' },
                  radius: { type: 'INTEGER', description: 'Radius for circle (default 40)' },
                  // Icon properties
                  iconName: { type: 'STRING' },
                  // Common transform properties
                  left: { type: 'INTEGER', description: 'Horizontal center position (0 to canvas width)' },
                  top: { type: 'INTEGER', description: 'Vertical center position (0 to canvas height)' },
                  scaleX: { type: 'NUMBER', description: 'Scaling scale factor (default 1.0)' },
                  scaleY: { type: 'NUMBER', description: 'Scaling scale factor (default 1.0)' },
                  angle: { type: 'INTEGER', description: 'Angle of rotation in degrees (0 to 360)' }
                },
                required: ['type']
              }
            }
          },
          required: ['elements']
        }
      }
    };

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(geminiRequestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Gemini API Error Response]:', errorText);
      return NextResponse.json(
        { error: `Gemini API responded with status ${response.status}: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json(
        { error: 'Gemini did not return any content.' },
        { status: 500 }
      );
    }

    const parsedDesign = JSON.parse(generatedText.trim());
    return NextResponse.json({ success: true, design: parsedDesign });

  } catch (error: any) {
    console.error('[AI Generate API Route Error]:', error);
    return NextResponse.json({ error: error.message || 'An error occurred during generation' }, { status: 500 });
  }
}
