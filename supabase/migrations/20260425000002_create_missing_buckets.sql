-- Migration: 20260425000002_create_missing_buckets.sql
-- Description: Create missing storage buckets for categories and CMS

-- 1. Create 'public' bucket if not exists (used by CMS and general uploads)
INSERT INTO storage.buckets (id, name, public)
VALUES ('public', 'public', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create 'categories' bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up Storage Policies for 'public' bucket
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public access to public bucket') THEN
        CREATE POLICY "Public access to public bucket" ON storage.objects FOR SELECT USING (bucket_id = 'public');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Admins manage public bucket') THEN
        CREATE POLICY "Admins manage public bucket" ON storage.objects FOR ALL USING (bucket_id = 'public' AND public.is_admin());
    END IF;
END $$;

-- 4. Set up Storage Policies for 'categories' bucket
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public access to categories bucket') THEN
        CREATE POLICY "Public access to categories bucket" ON storage.objects FOR SELECT USING (bucket_id = 'categories');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Admins manage categories bucket') THEN
        CREATE POLICY "Admins manage categories bucket" ON storage.objects FOR ALL USING (bucket_id = 'categories' AND public.is_admin());
    END IF;
END $$;
