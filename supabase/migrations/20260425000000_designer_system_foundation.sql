-- Phase 1: Foundation for Product-Aware Designer System

-- 1. Add designer mode and config to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS design_mode TEXT DEFAULT 'standard' CHECK (design_mode IN ('standard', 'vdp', 'multipage', 'intake_form')),
ADD COLUMN IF NOT EXISTS design_config JSONB DEFAULT '{}';

-- 2. Add sample configurations for existing categories (optional but helpful)
-- Apparel (Standard)
UPDATE products 
SET design_config = '{
  "canvas_width": 500,
  "canvas_height": 625,
  "aspect_ratio": "4:5",
  "safe_zones": {
    "front": { "x": 150, "y": 120, "w": 200, "h": 320 },
    "back":  { "x": 150, "y": 120, "w": 200, "h": 320 }
  }
}'
WHERE category ILIKE '%Apparel%' OR category ILIKE '%T-Shirt%' OR category ILIKE '%Hoodie%';

-- ID Cards (VDP) - If any exist
UPDATE products 
SET design_mode = 'vdp',
    design_config = '{
  "canvas_width": 856,
  "canvas_height": 540,
  "aspect_ratio": "CR80",
  "safe_zones": {
    "front": { "x": 20, "y": 20, "w": 816, "h": 500 }
  },
  "variable_fields": [
    { "key": "NAME", "label": "Full Name", "type": "text", "required": true },
    { "key": "PHOTO", "label": "Employee Photo", "type": "image", "required": true },
    { "key": "EMP_ID", "label": "Employee ID", "type": "text" }
  ]
}'
WHERE category ILIKE '%ID Card%';

-- Calendars (Multipage) - If any exist
UPDATE products 
SET design_mode = 'multipage',
    design_config = '{
  "canvas_width": 1200,
  "canvas_height": 900,
  "aspect_ratio": "4:3",
  "page_type": "monthly",
  "page_count": 12
}'
WHERE category ILIKE '%Calendar%';

-- Add comment for documentation
COMMENT ON COLUMN products.design_mode IS 'The design engine mode: standard (apparel), vdp (ID cards), multipage (calendars), or intake_form (complex items).';
COMMENT ON COLUMN products.design_config IS 'Configuration object containing canvas dimensions, safe zones, and mode-specific settings.';
