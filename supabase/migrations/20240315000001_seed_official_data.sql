-- Seed Official Products for AtoZ Print
INSERT INTO products (name, description, category, base_price, images, slug, features, specifications, stock_quantity)
VALUES
(
  'Premium Desk Calendar',
  'Fully customized, professional-quality desk calendar suitable for branding and promotional use. Available in multiple quality levels.',
  'Stationery',
  150.00,
  ARRAY['https://images.unsplash.com/photo-1586075010923-2dd4570fb1dc?auto=format&fit=crop&q=80&w=800'],
  'premium-desk-calendar',
  ARRAY['Logo Customization', 'Name & Text Personalization', 'Color Customization', 'High-quality Paper'],
  '{ "MOQ": "50 Units", "Quality Levels": "Basic / Standard / Premium / Luxury", "Timeline": "7-10 Working Days" }'::jsonb,
  5000
),
(
  'Luxury Wedding Card',
  'Fully customized, professional-quality wedding cards suitable for your special day. Premium packaging options available.',
  'Lifestyle',
  80.00,
  ARRAY['https://images.unsplash.com/photo-1622328761002-3ac84f88e146?auto=format&fit=crop&q=80&w=800'],
  'luxury-wedding-card',
  ARRAY['Premium Foil Print', 'Custom Color Themes', 'Unique Packaging', 'Full Text Control'],
  '{ "MOQ": "50 Units", "Quality Levels": "Basic / Standard / Premium / Luxury", "Timeline": "7-10 Working Days" }'::jsonb,
  10000
),
(
  'Corporate Business Card',
  'Fully customized, professional-quality business cards. Make a lasting first impression with premium finishes.',
  'Stationery',
  5.00,
  ARRAY['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'],
  'corporate-business-card',
  ARRAY['Matte/Gloss Finish', 'Logo Embossing', 'Standard & Luxury Paper', 'Edge Painting'],
  '{ "MOQ": "100 Units", "Quality Levels": "Basic / Standard / Premium / Luxury", "Timeline": "7-10 Working Days" }'::jsonb,
  50000
),
(
  'Employee Joining Kit',
  'A complete welcome package for new employees. Includes diary, pen, mug, and bag, all customized with your brand logo.',
  'Apparel',
  1200.00,
  ARRAY['https://images.unsplash.com/photo-1622675363311-3e1904dc1885?auto=format&fit=crop&q=80&w=800'],
  'employee-joining-kit',
  ARRAY['Multi-product branding', 'Premium Packaging', 'Custom Welcome Note', 'Bulk Pricing'],
  '{ "MOQ": "20 Units", "Quality Levels": "Standard / Premium / Luxury", "Timeline": "10-14 Working Days" }'::jsonb,
  1000
),
(
  'Premium Diary with Logo',
  'Fully customized hard-cover or leather diaries. Professional-quality suitable for corporate branding and gifts.',
  'Stationery',
  250.00,
  ARRAY['https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800'],
  'premium-diary-logo',
  ARRAY['Leather/Hardcover', 'Blind Embossing', 'Logo Printing', 'Personalized Pages'],
  '{ "MOQ": "50 Units", "Quality Levels": "Basic / Standard / Premium / Luxury", "Timeline": "7-10 Working Days" }'::jsonb,
  5000
),
(
  'Custom PVC ID Card',
  'High-quality PVC ID cards with lanyards. Suitable for corporates, schools, and events.',
  'Stationery',
  40.00,
  ARRAY['https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?auto=format&fit=crop&q=80&w=800'],
  'custom-pvc-id-card',
  ARRAY['Sublimation Print', 'Custom Lanyard Logo', 'Durable PVC', 'Edge-to-edge Print'],
  '{ "MOQ": "20 Units", "Quality Levels": "Basic / Standard / Premium", "Timeline": "3-5 Working Days" }'::jsonb,
  20000
),
(
  'Official Letter Head',
  'Professional corporate letterheads on executive bond paper. Consistent branding for all your official communication.',
  'Stationery',
  12.00,
  ARRAY['https://images.unsplash.com/photo-1598425237654-4fc758e50a93?auto=format&fit=crop&q=80&w=800'],
  'official-letter-head',
  ARRAY['100 GSM Bond Paper', 'Logo Customization', 'Edge-to-edge Design', 'Bulk Discounts'],
  '{ "MOQ": "100 Units", "Quality Levels": "Standard / Premium", "Timeline": "7-10 Working Days" }'::jsonb,
  100000
),
(
  'Branded Metal Pen',
  'Laser engraved metal pens with your company logo. A sophisticated gifting choice for clients and employees.',
  'Drinkware',
  45.00,
  ARRAY['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800'],
  'branded-metal-pen',
  ARRAY['Laser Engraving', 'Name Personalization', 'Gift Box Packing', 'Reliable Ink'],
  '{ "MOQ": "100 Units", "Quality Levels": "Standard / Premium / Luxury", "Timeline": "5-7 Working Days" }'::jsonb,
  15000
),
(
  'Insulated Water Bottle',
  'Fully customized stainless steel water bottles. Keeps drinks hot or cold for hours.',
  'Drinkware',
  350.00,
  ARRAY['https://images.unsplash.com/photo-1602143399827-72110bd59a11?auto=format&fit=crop&q=80&w=800'],
  'insulated-water-bottle',
  ARRAY['Laser Engraved Logo', 'Doublewall Insulation', 'Matte/Gloss Finish', 'BPA Free'],
  '{ "MOQ": "50 Units", "Quality Levels": "Standard / Premium / Luxury", "Timeline": "7-10 Working Days" }'::jsonb,
  3000
),
(
  'Premium Headphone',
  'Branded wireless headphones with high-quality audio. Perfect for corporate gifting or event winners.',
  'Lifestyle',
  1800.00,
  ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'],
  'premium-headphone',
  ARRAY['Logo Branding', 'Custom Pouch', 'Superior Bass', 'Bulk Warranty'],
  '{ "MOQ": "10 Units", "Quality Levels": "Standard / Premium / Luxury", "Timeline": "7-12 Working Days" }'::jsonb,
  500
),
(
  'Custom Laptop Bag',
  'Durable and stylish laptop bags with personalized logo branding. Large capacity and professional look.',
  'Lifestyle',
  850.00,
  ARRAY['https://images.unsplash.com/photo-1553062407-98eeb94c6a62?auto=format&fit=crop&q=80&w=800'],
  'custom-laptop-bag',
  ARRAY['Embroidery/Print Logo', 'Padded Compartment', 'Water Resistant', 'Quality Zippers'],
  '{ "MOQ": "30 Units", "Quality Levels": "Standard / Premium", "Timeline": "10-15 Working Days" }'::jsonb,
  1200
)
ON CONFLICT (slug) DO UPDATE
SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  base_price = EXCLUDED.base_price,
  images = EXCLUDED.images,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  stock_quantity = EXCLUDED.stock_quantity;
