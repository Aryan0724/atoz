-- Migration: 20260401000001_cms_schema.sql
-- Description: Create CMS content table for pages, blogs, and campaigns.

CREATE TABLE IF NOT EXISTS public.cms_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Page', 'Blog', 'Campaign')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    content TEXT,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT,
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'CMS content is viewable by everyone when published') THEN
        CREATE POLICY "CMS content is viewable by everyone when published" ON cms_content FOR SELECT USING (status = 'published');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage all CMS content') THEN
        CREATE POLICY "Admins can manage all CMS content" ON cms_content FOR ALL USING (public.is_admin());
    END IF;
END $$;
