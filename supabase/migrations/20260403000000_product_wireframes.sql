-- Add design_areas JSONB column to products table
ALTER TABLE public.products
ADD COLUMN design_areas JSONB DEFAULT '{"front": {"x": 150, "y": 120, "w": 200, "h": 320}}';

-- Update existing products with a default front design area
UPDATE public.products 
SET design_areas = '{"front": {"x": 150, "y": 120, "w": 200, "h": 320}}'
WHERE design_areas IS NULL;

-- Also ensure wireframe_images array exists (it should, but just in case)
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS wireframe_images TEXT[] DEFAULT '{}';

-- Support for 4 views (front, back, sleeve_l, sleeve_r)
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS supported_views TEXT[] DEFAULT '{front}';
