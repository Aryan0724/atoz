const fs = require('fs');
const path = require('path');

const targetFilePath = path.join(__dirname, '../src/lib/data/mockProducts.ts');

const newProducts = [
  {
    "id": "b1000000-0000-0000-0000-000000000001",
    "name": "Visiting Card Matt (200)",
    "slug": "business-card-matt-200",
    "description": "Premium Visiting Cards with Matte finish (set of 200). Smooth texture, non-reflective surface, and high durability.",
    "category": "Stationery",
    "base_price": 899,
    "moq": 1,
    "delivery_days": "5-7 Days",
    "images": [
      "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1000&auto=format"
    ],
    "template_images": [],
    "quality_levels": [
      "Matte"
    ],
    "customization_fields": [
      "Full Name",
      "Design Details"
    ],
    "packaging_options": [
      "Standard Box"
    ],
    "supported_views": [
      "front",
      "back"
    ],
    "features": [
      "Premium 350GSM Cardstock",
      "Smooth Non-Reflective Finish",
      "Precision Cut Edge"
    ],
    "specifications": {
      "GSM": "350",
      "Size": "3.5x2 inches"
    },
    "stock_quantity": 9999,
    "is_active": true,
    "created_at": "2026-07-21T14:00:00.000Z",
    "wireframe_images": [],
    "design_areas": {
      "front": {
        "h": 320,
        "w": 200,
        "x": 150,
        "y": 120
      }
    },
    "quality_prices": {},
    "color_variants": [],
    "design_mode": "template_form",
    "design_config": {},
    "bulk_discount_rules": []
  },
  {
    "id": "b1000000-0000-0000-0000-000000000002",
    "name": "Visiting Card UV (200)",
    "slug": "business-card-uv-200",
    "description": "Premium Visiting Cards with Spot UV finish (set of 200). Glossy raised details that pop against a matte background.",
    "category": "Stationery",
    "base_price": 1199,
    "moq": 1,
    "delivery_days": "5-7 Days",
    "images": [
      "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1000&auto=format"
    ],
    "template_images": [],
    "quality_levels": [
      "Spot UV"
    ],
    "customization_fields": [
      "Full Name",
      "Design Details"
    ],
    "packaging_options": [
      "Standard Box"
    ],
    "supported_views": [
      "front",
      "back"
    ],
    "features": [
      "Spot UV Raised Gloss",
      "Premium 350GSM Cardstock",
      "Touch of Luxury"
    ],
    "specifications": {
      "GSM": "350",
      "Size": "3.5x2 inches"
    },
    "stock_quantity": 9999,
    "is_active": true,
    "created_at": "2026-07-21T14:00:00.000Z",
    "wireframe_images": [],
    "design_areas": {
      "front": {
        "h": 320,
        "w": 200,
        "x": 150,
        "y": 120
      }
    },
    "quality_prices": {},
    "color_variants": [],
    "design_mode": "template_form",
    "design_config": {},
    "bulk_discount_rules": []
  },
  {
    "id": "b1000000-0000-0000-0000-000000000003",
    "name": "Letterhead (100)",
    "slug": "letter-head-100",
    "description": "Premium Corporate Letterheads (set of 100). High-quality 100GSM executive bond paper with sharp color reproduction.",
    "category": "Stationery",
    "base_price": 1499,
    "moq": 1,
    "delivery_days": "5-7 Days",
    "images": [
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1000&auto=format"
    ],
    "template_images": [],
    "quality_levels": [
      "Premium Bond"
    ],
    "customization_fields": [
      "Company Name",
      "Contact Details"
    ],
    "packaging_options": [
      "Standard Box"
    ],
    "supported_views": [
      "front"
    ],
    "features": [
      "Executive Bond Paper",
      "100GSM Thickness",
      "Laser Printer Friendly"
    ],
    "specifications": {
      "Paper": "100GSM Bond",
      "Size": "A4"
    },
    "stock_quantity": 9999,
    "is_active": true,
    "created_at": "2026-07-21T14:00:00.000Z",
    "wireframe_images": [],
    "design_areas": {
      "front": {
        "h": 320,
        "w": 200,
        "x": 150,
        "y": 120
      }
    },
    "quality_prices": {},
    "color_variants": [],
    "design_mode": "template_form",
    "design_config": {},
    "bulk_discount_rules": []
  },
  {
    "id": "b1000000-0000-0000-0000-000000000004",
    "name": "PVC Sticker (1000)",
    "slug": "pvc-sticker-1000",
    "description": "Waterproof PVC Stickers (set of 1000). Highly durable, tear-resistant, and perfect for outdoor labeling or premium branding.",
    "category": "Packaging",
    "base_price": 5499,
    "moq": 1,
    "delivery_days": "6-8 Days",
    "images": [
      "https://images.unsplash.com/photo-1572375995501-4b0894dbe0d7?q=80&w=1000&auto=format"
    ],
    "template_images": [],
    "quality_levels": [
      "Waterproof PVC"
    ],
    "customization_fields": [
      "Artwork upload"
    ],
    "packaging_options": [
      "Sheet Cut"
    ],
    "supported_views": [
      "front"
    ],
    "features": [
      "100% Waterproof PVC",
      "Weather-Resistant Adhesive",
      "Gloss or Matte finish"
    ],
    "specifications": {
      "Size": "2x2 inches",
      "Thickness": "100 Microns"
    },
    "stock_quantity": 9999,
    "is_active": true,
    "created_at": "2026-07-21T14:00:00.000Z",
    "wireframe_images": [],
    "design_areas": {
      "front": {
        "h": 300,
        "w": 300,
        "x": 100,
        "y": 100
      }
    },
    "quality_prices": {},
    "color_variants": [],
    "design_mode": "standard",
    "design_config": {},
    "bulk_discount_rules": []
  },
  {
    "id": "b1000000-0000-0000-0000-000000000005",
    "name": "Paper Sticker (1000)",
    "slug": "paper-sticker-1000",
    "description": "Premium Glossy Paper Stickers (set of 1000). Perfect for product packaging, seal tags, box labeling, and mailers.",
    "category": "Packaging",
    "base_price": 4299,
    "moq": 1,
    "delivery_days": "5-7 Days",
    "images": [
      "https://images.unsplash.com/photo-1572375995501-4b0894dbe0d7?q=80&w=1000&auto=format"
    ],
    "template_images": [],
    "quality_levels": [
      "Glossy Paper"
    ],
    "customization_fields": [
      "Artwork upload"
    ],
    "packaging_options": [
      "Sheet Cut"
    ],
    "supported_views": [
      "front"
    ],
    "features": [
      "Premium Glossy Finish",
      "Strong Self-Adhesive",
      "Vibrant Color Print"
    ],
    "specifications": {
      "Size": "2x2 inches",
      "Thickness": "80 GSM"
    },
    "stock_quantity": 9999,
    "is_active": true,
    "created_at": "2026-07-21T14:00:00.000Z",
    "wireframe_images": [],
    "design_areas": {
      "front": {
        "h": 300,
        "w": 300,
        "x": 100,
        "y": 100
      }
    },
    "quality_prices": {},
    "color_variants": [],
    "design_mode": "standard",
    "design_config": {},
    "bulk_discount_rules": []
  },
  {
    "id": "b1000000-0000-0000-0000-000000000006",
    "name": "Flyers A4 (1000)",
    "slug": "flyers-a4-1000",
    "description": "A4 Corporate Flyers (set of 1000). Standard 130GSM glossy art paper with double-sided vibrant printing. Ideal for hand-outs and promotions.",
    "category": "Stationery",
    "base_price": 7999,
    "moq": 1,
    "delivery_days": "5-7 Days",
    "images": [
      "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=1000&auto=format"
    ],
    "template_images": [],
    "quality_levels": [
      "130GSM Glossy"
    ],
    "customization_fields": [
      "Artwork upload"
    ],
    "packaging_options": [
      "Standard shrink wrap"
    ],
    "supported_views": [
      "front",
      "back"
    ],
    "features": [
      "A4 Dimension",
      "Vibrant Glossy Art Paper",
      "Double-sided printing included"
    ],
    "specifications": {
      "Paper": "130GSM Art Paper",
      "Size": "A4"
    },
    "stock_quantity": 9999,
    "is_active": true,
    "created_at": "2026-07-21T14:00:00.000Z",
    "wireframe_images": [],
    "design_areas": {
      "front": {
        "h": 400,
        "w": 280,
        "x": 110,
        "y": 50
      }
    },
    "quality_prices": {},
    "color_variants": [],
    "design_mode": "standard",
    "design_config": {},
    "bulk_discount_rules": []
  },
  {
    "id": "b1000000-0000-0000-0000-000000000007",
    "name": "Brochure A4 (200)",
    "slug": "brochure-a4-200",
    "description": "A4 Corporate Brochures (set of 200). Trifold or bifold options on premium 250GSM card stock with soft matte lamination.",
    "category": "Stationery",
    "base_price": 12999,
    "moq": 1,
    "delivery_days": "6-8 Days",
    "images": [
      "https://images.unsplash.com/photo-1562564055-71e051d33c19?q=80&w=1000&auto=format"
    ],
    "template_images": [],
    "quality_levels": [
      "250GSM Matte Laminated"
    ],
    "customization_fields": [
      "Artwork upload"
    ],
    "packaging_options": [
      "Standard Box"
    ],
    "supported_views": [
      "front",
      "back"
    ],
    "features": [
      "Heavyweight 250GSM Card Stock",
      "Elegant Matte Lamination",
      "Bi-Fold / Tri-Fold selection"
    ],
    "specifications": {
      "Thickness": "250GSM",
      "Lamination": "Matte"
    },
    "stock_quantity": 9999,
    "is_active": true,
    "created_at": "2026-07-21T14:00:00.000Z",
    "wireframe_images": [],
    "design_areas": {
      "front": {
        "h": 400,
        "w": 280,
        "x": 110,
        "y": 50
      }
    },
    "quality_prices": {},
    "color_variants": [],
    "design_mode": "standard",
    "design_config": {},
    "bulk_discount_rules": []
  },
  {
    "id": "b1000000-0000-0000-0000-000000000008",
    "name": "Diary (50)",
    "slug": "diary-with-logo-50",
    "description": "Executive Leatherette Diaries (set of 50). Custom logo engraving or UV printing. Includes pen holder and premium ruled sheets.",
    "category": "Corporate Gifting",
    "base_price": 6999,
    "moq": 1,
    "delivery_days": "7-10 Days",
    "images": [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=1000&auto=format"
    ],
    "template_images": [],
    "quality_levels": [
      "Premium Leatherette"
    ],
    "customization_fields": [
      "Logo",
      "Engraving details"
    ],
    "packaging_options": [
      "Gift Wrap"
    ],
    "supported_views": [
      "front"
    ],
    "features": [
      "Soft-touch leatherette exterior",
      "UV logo print or Laser engraving",
      "Ruled premium paper"
    ],
    "specifications": {
      "Size": "A5",
      "Pages": "160 Ruled"
    },
    "stock_quantity": 9999,
    "is_active": true,
    "created_at": "2026-07-21T14:00:00.000Z",
    "wireframe_images": [],
    "design_areas": {
      "front": {
        "h": 320,
        "w": 200,
        "x": 150,
        "y": 120
      }
    },
    "quality_prices": {},
    "color_variants": [],
    "design_mode": "template_form",
    "design_config": {},
    "bulk_discount_rules": []
  },
  {
    "id": "b1000000-0000-0000-0000-000000000009",
    "name": "T-Shirt (50)",
    "slug": "t-shirt-50",
    "description": "Premium Cotton T-Shirts (set of 50). High-comfort 180GSM combed cotton, double stitched, with custom front/back printing.",
    "category": "Apparel",
    "base_price": 18999,
    "moq": 1,
    "delivery_days": "7-10 Days",
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format"
    ],
    "template_images": [],
    "quality_levels": [
      "Premium Cotton"
    ],
    "customization_fields": [
      "Front design upload",
      "Back design upload"
    ],
    "packaging_options": [
      "Individually Poly-bagged"
    ],
    "supported_views": [
      "front",
      "back"
    ],
    "features": [
      "100% Combed Organic Cotton",
      "180 GSM Bio-Washed Fabric",
      "Vibrant Screen/DTG Print"
    ],
    "specifications": {
      "GSM": "180",
      "Material": "100% Cotton"
    },
    "stock_quantity": 9999,
    "is_active": true,
    "created_at": "2026-07-21T14:00:00.000Z",
    "wireframe_images": [],
    "design_areas": {
      "front": {
        "h": 320,
        "w": 200,
        "x": 150,
        "y": 120
      }
    },
    "quality_prices": {},
    "color_variants": [],
    "design_mode": "standard",
    "design_config": {},
    "bulk_discount_rules": []
  },
  {
    "id": "b1000000-0000-0000-0000-000000000010",
    "name": "Printed Pen (50)",
    "slug": "custom-pen-50",
    "description": "Premium Metal Ballpoint Pens (set of 50). Matte finish barrel, custom logo printing or engraving, with smooth blue/black ink.",
    "category": "Corporate Gifting",
    "base_price": 4999,
    "moq": 1,
    "delivery_days": "5-7 Days",
    "images": [
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1000&auto=format"
    ],
    "template_images": [],
    "quality_levels": [
      "Engraved Metal"
    ],
    "customization_fields": [
      "Logo",
      "Text details"
    ],
    "packaging_options": [
      "Standard sleeve"
    ],
    "supported_views": [
      "front"
    ],
    "features": [
      "Matte Anodized Metal Barrel",
      "Fine laser engraving logo detail",
      "Smooth German-ink ballpoint"
    ],
    "specifications": {
      "Ink": "Blue/Black",
      "Body": "Metal"
    },
    "stock_quantity": 9999,
    "is_active": true,
    "created_at": "2026-07-21T14:00:00.000Z",
    "wireframe_images": [],
    "design_areas": {
      "front": {
        "h": 320,
        "w": 200,
        "x": 150,
        "y": 120
      }
    },
    "quality_prices": {},
    "color_variants": [],
    "design_mode": "template_form",
    "design_config": {},
    "bulk_discount_rules": []
  }
];

try {
  let content = fs.readFileSync(targetFilePath, 'utf8');

  // Let's find the closing of mockProducts array
  // It should be followed by export const mockPricingCategories
  const targetStr = '\n];\nexport const mockPricingCategories = [';
  const targetStrCRLF = '\r\n];\r\nexport const mockPricingCategories = [';

  let index = content.indexOf(targetStr);
  let length = targetStr.length;
  let useCRLF = false;

  if (index === -1) {
    index = content.indexOf(targetStrCRLF);
    length = targetStrCRLF.length;
    useCRLF = true;
  }

  if (index === -1) {
    // If not found, look for "export const mockPricingCategories =" directly
    const directTarget = 'export const mockPricingCategories =';
    index = content.indexOf(directTarget);
    if (index !== -1) {
      // Find the last ]; before it
      const lastBracket = content.lastIndexOf('];', index);
      if (lastBracket !== -1) {
        index = lastBracket;
        length = 2;
      }
    }
  }

  if (index === -1) {
    console.error('Could not find the end of mockProducts array in mockProducts.ts');
    process.exit(1);
  }

  console.log(`Found insertion point at index ${index}.`);

  const indent = '  ';
  const newProductsStr = newProducts.map(p => {
    return JSON.stringify(p, null, 4).split('\n').map(line => indent + line).join('\n');
  }).join(',\n');

  let replacement = '';
  if (useCRLF) {
    replacement = ',\r\n' + newProductsStr + '\r\n];\r\nexport const mockPricingCategories = [';
  } else {
    replacement = ',\n' + newProductsStr + '\n];\nexport const mockPricingCategories = [';
  }

  const newContent = content.substring(0, index) + replacement + content.substring(index + length);
  fs.writeFileSync(targetFilePath, newContent, 'utf8');

  console.log('Successfully appended new products to mockProducts.ts fallback array.');
} catch (err) {
  console.error('Failed to update mockProducts.ts:', err);
  process.exit(1);
}
