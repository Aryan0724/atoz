-- Migration: Extend cms_content for SEO-optimized blogs
-- Description: Adds SEO fields and reading time to the cms_content table.

ALTER TABLE public.cms_content 
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS reading_time INTEGER DEFAULT 5;

-- Update the handle_updated_at function to support cms_content if needed
-- Actually, let's just add a trigger for last_modified
CREATE OR REPLACE FUNCTION public.handle_last_modified()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_cms_content_last_modified ON public.cms_content;
CREATE TRIGGER tr_cms_content_last_modified 
BEFORE UPDATE ON public.cms_content 
FOR EACH ROW EXECUTE FUNCTION public.handle_last_modified();
