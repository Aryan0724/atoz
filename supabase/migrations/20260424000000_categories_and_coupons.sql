-- Migration: 20260424000000_categories_and_coupons.sql
-- Description: Add image and long_description to categories, and create coupons table

-- 1. Update Categories Table
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS long_description TEXT,
ADD COLUMN IF NOT EXISTS is_service BOOLEAN DEFAULT false;

-- 2. Create Coupons Table
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

-- 3. Enable RLS for Coupons
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- 4. Setup Policies for Coupons
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coupons' AND policyname = 'Coupons are viewable by everyone') THEN
        CREATE POLICY "Coupons are viewable by everyone" ON public.coupons FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coupons' AND policyname = 'Admins manage coupons') THEN
        CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL USING (public.is_admin());
    END IF;
END $$;

-- 5. Seed some initial coupons
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order_amount)
VALUES 
('WELCOME10', '10% off on your first order', 'percentage', 10, 0),
('BRANDBOOST', '₹500 off on orders above ₹5000', 'fixed', 500, 5000)
ON CONFLICT (code) DO NOTHING;
