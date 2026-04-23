-- ====================================================================
-- AtoZ Prints - Final Consolidation Migration
-- This script combines all database changes for Categories, Coupons, 
-- and Order Tracking enhancements.
-- ====================================================================

-- 1. ENHANCE CATEGORIES TABLE
-- Adding image, description and service flag for landing pages
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS long_description TEXT,
ADD COLUMN IF NOT EXISTS is_service BOOLEAN DEFAULT false;

-- 2. CREATE COUPONS SYSTEM
-- Table for managing active promotional codes
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC NOT NULL,
    min_order_amount NUMERIC DEFAULT 0,
    max_discount_amount NUMERIC,
    expiry_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and setup access policies
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coupons' AND policyname = 'Coupons are viewable by everyone') THEN
        CREATE POLICY "Coupons are viewable by everyone" ON public.coupons FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coupons' AND policyname = 'Admins manage coupons') THEN
        CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL USING (public.is_admin());
    END IF;
END $$;

-- Seed initial promotional data
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order_amount)
VALUES 
('WELCOME10', '10% off on your first order', 'percentage', 10, 0),
('BRANDBOOST', '₹500 off on orders above ₹5000', 'fixed', 500, 5000)
ON CONFLICT (code) DO NOTHING;

-- 3. ENHANCE ORDERS TABLE
-- Adding logistics tracking and payment method fields
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS courier_name TEXT,
ADD COLUMN IF NOT EXISTS estimated_delivery TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS tracking_url TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'Online' CHECK (payment_method IN ('Online', 'COD'));

-- Standardize payment method for existing records
UPDATE public.orders SET payment_method = 'Online' WHERE payment_method IS NULL;

-- 4. ENHANCE CMS_CONTENT TABLE FOR BLOGS
ALTER TABLE public.cms_content 
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS reading_time INTEGER DEFAULT 5;

-- Ensure handle_last_modified exists for CMS updates
CREATE OR REPLACE FUNCTION public.handle_last_modified()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for cms_content last_modified
DROP TRIGGER IF EXISTS tr_cms_content_last_modified ON public.cms_content;
CREATE TRIGGER tr_cms_content_last_modified 
BEFORE UPDATE ON public.cms_content 
FOR EACH ROW EXECUTE FUNCTION public.handle_last_modified();
