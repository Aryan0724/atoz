-- Add color_variants jsonb column to store explicit images for color choices
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS color_variants JSONB DEFAULT '[]'::jsonb;
