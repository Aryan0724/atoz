const { Client } = require('pg');

const connectionString = 'postgres://postgres:kh2DY-bZg_RC%26ir@db.fgtxaeyrsrtktazithwl.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to database.');

    // Fetch existing template products to clone design settings
    const { rows: products } = await client.query(
      `SELECT slug, images, template_images, wireframe_images, quality_levels, customization_fields, packaging_options, supported_views, features, specifications, design_areas, quality_prices, color_variants, design_mode, design_config 
       FROM public.products 
       WHERE slug IN ('business-card-custom', 'letter-head-custom', 'diary-with-logo', 'pen-custom', 'custom-premium-tshirt')`
    );

    const findProduct = (slug) => products.find(p => p.slug === slug) || {};

    const bc = findProduct('business-card-custom');
    const lh = findProduct('letter-head-custom');
    const diary = findProduct('diary-with-logo');
    const pen = findProduct('pen-custom');
    const tshirt = findProduct('custom-premium-tshirt');

    // Define the new bundle products
    const bundles = [
      {
        name: 'Visiting Card Matt (200)',
        slug: 'business-card-matt-200',
        description: 'Premium Visiting Cards with Matte finish (set of 200). Smooth texture, non-reflective surface, and high durability.',
        category: 'Stationery',
        base_price: 899,
        moq: 1,
        delivery_days: '5-7 Days',
        images: bc.images || ['https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1000&auto=format'],
        template_images: bc.template_images || [],
        wireframe_images: bc.wireframe_images || [],
        quality_levels: ['Matte'],
        customization_fields: bc.customization_fields || ['Card Details', 'Design upload'],
        packaging_options: bc.packaging_options || ['Standard Box'],
        supported_views: bc.supported_views || ['front', 'back'],
        features: ['Premium 350GSM Cardstock', 'Smooth Non-Reflective Finish', 'Precision Cut Edge'],
        specifications: bc.specifications || {},
        design_areas: bc.design_areas || {},
        quality_prices: {},
        color_variants: bc.color_variants || [],
        design_mode: 'template_form',
        design_config: bc.design_config || {}
      },
      {
        name: 'Visiting Card UV (200)',
        slug: 'business-card-uv-200',
        description: 'Premium Visiting Cards with Spot UV finish (set of 200). Glossy raised details that pop against a matte background.',
        category: 'Stationery',
        base_price: 1199,
        moq: 1,
        delivery_days: '5-7 Days',
        images: bc.images || ['https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1000&auto=format'],
        template_images: bc.template_images || [],
        wireframe_images: bc.wireframe_images || [],
        quality_levels: ['Spot UV'],
        customization_fields: bc.customization_fields || ['Card Details', 'Design upload'],
        packaging_options: bc.packaging_options || ['Standard Box'],
        supported_views: bc.supported_views || ['front', 'back'],
        features: ['Spot UV Raised Gloss', 'Premium 350GSM Cardstock', 'Touch of Luxury'],
        specifications: bc.specifications || {},
        design_areas: bc.design_areas || {},
        quality_prices: {},
        color_variants: bc.color_variants || [],
        design_mode: 'template_form',
        design_config: bc.design_config || {}
      },
      {
        name: 'Letterhead (100)',
        slug: 'letter-head-100',
        description: 'Premium Corporate Letterheads (set of 100). High-quality 100GSM executive bond paper with sharp color reproduction.',
        category: 'Stationery',
        base_price: 1499,
        moq: 1,
        delivery_days: '5-7 Days',
        images: lh.images || ['https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1000&auto=format'],
        template_images: lh.template_images || [],
        wireframe_images: lh.wireframe_images || [],
        quality_levels: ['Premium Bond'],
        customization_fields: lh.customization_fields || ['Company Details', 'Header Design'],
        packaging_options: lh.packaging_options || ['Standard Box'],
        supported_views: lh.supported_views || ['front'],
        features: ['Executive Bond Paper', '100GSM Thickness', 'Laser Printer Friendly'],
        specifications: lh.specifications || {},
        design_areas: lh.design_areas || {},
        quality_prices: {},
        color_variants: lh.color_variants || [],
        design_mode: 'template_form',
        design_config: lh.design_config || {}
      },
      {
        name: 'PVC Sticker (1000)',
        slug: 'pvc-sticker-1000',
        description: 'Waterproof PVC Stickers (set of 1000). Highly durable, tear-resistant, and perfect for outdoor labeling or premium branding.',
        category: 'Packaging',
        base_price: 5499,
        moq: 1,
        delivery_days: '6-8 Days',
        images: ['https://images.unsplash.com/photo-1572375995501-4b0894dbe0d7?q=80&w=1000&auto=format'],
        template_images: [],
        wireframe_images: [],
        quality_levels: ['Waterproof PVC'],
        customization_fields: ['Sticker Artwork', 'Shape Choice'],
        packaging_options: ['Roll Packing', 'Sheet Cut'],
        supported_views: ['front'],
        features: ['100% Waterproof PVC', 'Weather-Resistant Adhesive', 'Gloss or Matte finish'],
        specifications: { size: '2x2 inches', thickness: '100 Microns' },
        design_areas: { front: { h: 300, w: 300, x: 100, y: 100 } },
        quality_prices: {},
        color_variants: [],
        design_mode: 'standard',
        design_config: {}
      },
      {
        name: 'Paper Sticker (1000)',
        slug: 'paper-sticker-1000',
        description: 'Premium Glossy Paper Stickers (set of 1000). Perfect for product packaging, seal tags, box labeling, and mailers.',
        category: 'Packaging',
        base_price: 4299,
        moq: 1,
        delivery_days: '5-7 Days',
        images: ['https://images.unsplash.com/photo-1572375995501-4b0894dbe0d7?q=80&w=1000&auto=format'],
        template_images: [],
        wireframe_images: [],
        quality_levels: ['Glossy Paper'],
        customization_fields: ['Sticker Artwork', 'Shape Choice'],
        packaging_options: ['Roll Packing', 'Sheet Cut'],
        supported_views: ['front'],
        features: ['Premium Glossy Finish', 'Strong Self-Adhesive', 'Vibrant Color Print'],
        specifications: { size: '2x2 inches', thickness: '80 GSM' },
        design_areas: { front: { h: 300, w: 300, x: 100, y: 100 } },
        quality_prices: {},
        color_variants: [],
        design_mode: 'standard',
        design_config: {}
      },
      {
        name: 'Flyers A4 (1000)',
        slug: 'flyers-a4-1000',
        description: 'A4 Corporate Flyers (set of 1000). Standard 130GSM glossy art paper with double-sided vibrant printing. Ideal for hand-outs and promotions.',
        category: 'Stationery',
        base_price: 7999,
        moq: 1,
        delivery_days: '5-7 Days',
        images: ['https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=1000&auto=format'],
        template_images: [],
        wireframe_images: [],
        quality_levels: ['130GSM Glossy'],
        customization_fields: ['Flyer Front Design', 'Flyer Back Design'],
        packaging_options: ['Standard Shrink Wrap'],
        supported_views: ['front', 'back'],
        features: ['A4 Dimension', 'Vibrant Glossy Art Paper', 'Double-sided printing included'],
        specifications: { paper: '130GSM Art Paper', dimensions: 'A4 size' },
        design_areas: { front: { h: 400, w: 280, x: 110, y: 50 }, back: { h: 400, w: 280, x: 110, y: 50 } },
        quality_prices: {},
        color_variants: [],
        design_mode: 'standard',
        design_config: {}
      },
      {
        name: 'Brochure A4 (200)',
        slug: 'brochure-a4-200',
        description: 'A4 Corporate Brochures (set of 200). Trifold or bifold options on premium 250GSM card stock with soft matte lamination.',
        category: 'Stationery',
        base_price: 12999,
        moq: 1,
        delivery_days: '6-8 Days',
        images: ['https://images.unsplash.com/photo-1562564055-71e051d33c19?q=80&w=1000&auto=format'],
        template_images: [],
        wireframe_images: [],
        quality_levels: ['250GSM Matte Laminated'],
        customization_fields: ['Brochure Artwork', 'Folding Type'],
        packaging_options: ['Standard Box'],
        supported_views: ['front', 'back'],
        features: ['Heavyweight 250GSM Card Stock', 'Elegant Matte Lamination', 'Bi-Fold / Tri-Fold selection'],
        specifications: { thickness: '250 GSM', lamination: 'Matte' },
        design_areas: { front: { h: 400, w: 280, x: 110, y: 50 }, back: { h: 400, w: 280, x: 110, y: 50 } },
        quality_prices: {},
        color_variants: [],
        design_mode: 'standard',
        design_config: {}
      },
      {
        name: 'Diary (50)',
        slug: 'diary-with-logo-50',
        description: 'Executive Leatherette Diaries (set of 50). Custom logo engraving or UV printing. Includes pen holder and premium ruled sheets.',
        category: 'Corporate Gifting',
        base_price: 6999,
        moq: 1,
        delivery_days: '7-10 Days',
        images: diary.images || ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=1000&auto=format'],
        template_images: diary.template_images || [],
        wireframe_images: diary.wireframe_images || [],
        quality_levels: ['Premium Leatherette'],
        customization_fields: diary.customization_fields || ['Corporate Logo', 'Engraving Text'],
        packaging_options: diary.packaging_options || ['Gift Wrap'],
        supported_views: diary.supported_views || ['front'],
        features: ['Soft-touch leatherette exterior', 'UV logo print or Laser engraving', 'Ruled premium paper'],
        specifications: diary.specifications || {},
        design_areas: diary.design_areas || {},
        quality_prices: {},
        color_variants: diary.color_variants || [],
        design_mode: 'template_form',
        design_config: diary.design_config || {}
      },
      {
        name: 'T-Shirt (50)',
        slug: 't-shirt-50',
        description: 'Premium Cotton T-Shirts (set of 50). High-comfort 180GSM combed cotton, double stitched, with custom front/back printing.',
        category: 'Apparel',
        base_price: 18999,
        moq: 1,
        delivery_days: '7-10 Days',
        images: tshirt.images || ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format'],
        template_images: tshirt.template_images || [],
        wireframe_images: tshirt.wireframe_images || [],
        quality_levels: ['Premium Cotton (180GSM)'],
        customization_fields: tshirt.customization_fields || ['Front Print', 'Back Print'],
        packaging_options: tshirt.packaging_options || ['Individually Poly-bagged'],
        supported_views: tshirt.supported_views || ['front', 'back'],
        features: ['100% Combed Organic Cotton', '180 GSM Bio-Washed Fabric', 'Vibrant Screen/DTG Print'],
        specifications: tshirt.specifications || {},
        design_areas: tshirt.design_areas || {},
        quality_prices: {},
        color_variants: tshirt.color_variants || [],
        design_mode: 'standard',
        design_config: tshirt.design_config || {}
      },
      {
        name: 'Printed Pen (50)',
        slug: 'custom-pen-50',
        description: 'Premium Metal Ballpoint Pens (set of 50). Matte finish barrel, custom logo printing or engraving, with smooth blue/black ink.',
        category: 'Corporate Gifting',
        base_price: 4999,
        moq: 1,
        delivery_days: '5-7 Days',
        images: pen.images || ['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1000&auto=format'],
        template_images: pen.template_images || [],
        wireframe_images: pen.wireframe_images || [],
        quality_levels: ['Engraved Metal'],
        customization_fields: pen.customization_fields || ['Corporate Logo', 'Engraving Text'],
        packaging_options: pen.packaging_options || ['Standard Sleeve'],
        supported_views: pen.supported_views || ['front'],
        features: ['Matte Anodized Metal Barrel', 'Fine laser engraving logo detail', 'Smooth German-ink ballpoint'],
        specifications: pen.specifications || {},
        design_areas: pen.design_areas || {},
        quality_prices: {},
        color_variants: pen.color_variants || [],
        design_mode: 'template_form',
        design_config: pen.design_config || {}
      }
    ];

    console.log(`Inserting/Upserting ${bundles.length} bundle products...`);

    for (const b of bundles) {
      const q = `
        INSERT INTO public.products (
          name, slug, description, category, base_price, moq, delivery_days, images, 
          template_images, wireframe_images, quality_levels, customization_fields, 
          packaging_options, supported_views, features, specifications, design_areas, 
          quality_prices, color_variants, design_mode, design_config
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        ON CONFLICT (slug) 
        DO UPDATE SET 
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          base_price = EXCLUDED.base_price,
          moq = EXCLUDED.moq,
          delivery_days = EXCLUDED.delivery_days,
          images = EXCLUDED.images,
          template_images = EXCLUDED.template_images,
          wireframe_images = EXCLUDED.wireframe_images,
          quality_levels = EXCLUDED.quality_levels,
          customization_fields = EXCLUDED.customization_fields,
          packaging_options = EXCLUDED.packaging_options,
          supported_views = EXCLUDED.supported_views,
          features = EXCLUDED.features,
          specifications = EXCLUDED.specifications,
          design_areas = EXCLUDED.design_areas,
          quality_prices = EXCLUDED.quality_prices,
          color_variants = EXCLUDED.color_variants,
          design_mode = EXCLUDED.design_mode,
          design_config = EXCLUDED.design_config
        RETURNING slug;
      `;

      const values = [
        b.name,
        b.slug,
        b.description,
        b.category,
        b.base_price,
        b.moq,
        b.delivery_days,
        b.images,
        b.template_images,
        b.wireframe_images,
        b.quality_levels,
        b.customization_fields,
        b.packaging_options,
        b.supported_views,
        b.features,
        JSON.stringify(b.specifications),
        JSON.stringify(b.design_areas),
        JSON.stringify(b.quality_prices),
        JSON.stringify(b.color_variants),
        b.design_mode,
        JSON.stringify(b.design_config)
      ];

      const res = await client.query(q, values);
      console.log(` - Upserted product: ${res.rows[0].slug}`);
    }

    console.log('All product bundles upserted successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

run();
