-- Add physical logistics metadata to products table for Shiprocket integration
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS weight NUMERIC DEFAULT 0.5, -- in kg
ADD COLUMN IF NOT EXISTS length NUMERIC DEFAULT 10,  -- in cm
ADD COLUMN IF NOT EXISTS width NUMERIC DEFAULT 10,   -- in cm
ADD COLUMN IF NOT EXISTS height NUMERIC DEFAULT 5;   -- in cm

COMMENT ON COLUMN public.products.weight IS 'Product weight in kilograms (required for Shiprocket)';
COMMENT ON COLUMN public.products.length IS 'Package length in centimeters (required for Shiprocket)';
COMMENT ON COLUMN public.products.width IS 'Package width in centimeters (required for Shiprocket)';
COMMENT ON COLUMN public.products.height IS 'Package height in centimeters (required for Shiprocket)';
