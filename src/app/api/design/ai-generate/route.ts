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
    const { prompt, mode = 'layout', productCategory = 'Apparel', canvasWidth = 500, canvasHeight = 625, productColor = '#FFFFFF' } = body;

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

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;
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
You are designing for product category "${productCategory}" on a canvas of width ${canvasWidth}px and height ${canvasHeight}px.
The center of the canvas is at (X: ${canvasWidth / 2}, Y: ${canvasHeight / 2}).

Background Product Color Constraint:
- The product background color is "${productColor}".
- CRITICAL: You MUST choose colors for text, shapes, and icons that contrast sharply with the background color "${productColor}".
- If the background is dark (e.g. black, charcoal, dark grey, navy), all text, shapes, and icons MUST use bright/light colors (e.g. #FFFFFF, #FFD700 (gold), #E6E6FA (lavender), #00FFFF (cyan)). Never use black (#000000) or dark grey.
- If the background is light (e.g. white, cream, light grey), use dark/deep colors (e.g. #1A1A1A, #0F172A, #8B0000). Never use white or light yellow.

Design and Layout Composition Guidelines:
1. Composition Archetypes:
   - "Badge/Logo": A central icon (width ~50-80px), title text (fontSize: 24-32) placed directly below it, and subtitle text (fontSize: 14-16) below that.
   - "Clean Typography": A main bold headline (fontSize: 36-44) at the top, a thin horizontal line accent (shapeType: 'line', width: 100-150, height: 2), and a sub-headline (fontSize: 16-20) below.
2. Layout Constraints:
   - Keep design coordinates within safe boundaries: margin offset of at least 50px from all edges (X: 50 to ${canvasWidth - 50}, Y: 50 to ${canvasHeight - 50}).
   - No giant blocky shapes. Do NOT create shapes (rects/circles/triangles) that cover more than 20% of the canvas. Keep shapes as small design accents (lines, badges, decorative circles/stars/hearts).
   - Elements must not overlap each other in a messy way. Ensure text is fully readable. If placing text on top of a shape (like a circular badge), the text color must contrast sharply with the shape's fill color.
3. Allowed List Restrictions:
   - Select text fonts ONLY from: ${allowedFonts.join(', ')}.
   - Select icon names ONLY from: ${allowedIcons.join(', ')}.
4. Element Sizing:
   - Text elements: fontSize must be between 12 and 44.
   - Shape elements: width/height/radius must be between 10 and 120.
   - Icon elements: scaleX and scaleY should be between 0.6 and 1.3 (since baseline target size is 60px).`;

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

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

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
