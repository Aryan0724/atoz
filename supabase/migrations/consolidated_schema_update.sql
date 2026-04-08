-- Consolidate Migration Script
-- Covers: Categories, CMS, Design Inquiries, Reviews, Recommendations, Abandoned Carts, and Site Settings.

-- 0. Helper Functions for Timestamps & Permissions
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Product Table Enhancements
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS quality_prices JSONB DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS bulk_pricing JSONB DEFAULT '[]';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS design_areas JSONB DEFAULT '{"front": {"x": 150, "y": 120, "w": 200, "h": 320}}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wireframe_images TEXT[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS supported_views TEXT[] DEFAULT '{front}';

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Categories viewable by everyone') THEN
        CREATE POLICY "Categories viewable by everyone" ON public.categories FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins manage categories') THEN
        CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.is_admin());
    END IF;
END $$;

INSERT INTO public.categories (name, slug) VALUES 
('Packaging', 'packaging'),
('Stationary', 'stationary'),
('Apparel', 'apparel'),
('Merchandise', 'merchandise'),
('Accessories', 'accessories'),
('Corporate', 'corporate')
ON CONFLICT (slug) DO NOTHING;

-- 3. CMS Tables
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

CREATE TABLE IF NOT EXISTS public.pages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_published BOOLEAN DEFAULT false,
    meta_description TEXT,
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    -- cms_content policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cms_content' AND policyname = 'Public view published content') THEN
        CREATE POLICY "Public view published content" ON public.cms_content FOR SELECT USING (status = 'published');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cms_content' AND policyname = 'Admins manage cms_content') THEN
        CREATE POLICY "Admins manage cms_content" ON public.cms_content FOR ALL USING (public.is_admin());
    END IF;

    -- pages policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pages' AND policyname = 'Public view published pages') THEN
        CREATE POLICY "Public view published pages" ON public.pages FOR SELECT USING (is_published = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pages' AND policyname = 'Admins manage pages') THEN
        CREATE POLICY "Admins manage pages" ON public.pages FOR ALL USING (public.is_admin());
    END IF;
END $$;

-- 4. Interaction Tables
CREATE TABLE IF NOT EXISTS public.design_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    product_id UUID REFERENCES public.products(id),
    message TEXT NOT NULL,
    design_state JSONB NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'responded', 'converted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.design_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    -- design_inquiries policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'design_inquiries' AND policyname = 'Anyone can create inquiries') THEN
        CREATE POLICY "Anyone can create inquiries" ON public.design_inquiries FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'design_inquiries' AND policyname = 'Admins manage inquiries') THEN
        CREATE POLICY "Admins manage inquiries" ON public.design_inquiries FOR ALL USING (public.is_admin());
    END IF;

    -- product_reviews policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_reviews' AND policyname = 'Anyone can view reviews') THEN
        CREATE POLICY "Anyone can view reviews" ON public.product_reviews FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_reviews' AND policyname = 'Users can create reviews') THEN
        CREATE POLICY "Users can create reviews" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 5. Tracking & Marketing Tables
CREATE TABLE IF NOT EXISTS public.checkout_attempts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    product_id UUID REFERENCES public.products(id),
    quantity INTEGER,
    quality_level TEXT,
    total_price NUMERIC,
    canvas_state JSONB,
    status TEXT DEFAULT 'pending', -- pending, abandoned, completed
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    recommended_product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, recommended_product_id)
);

ALTER TABLE public.checkout_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_recommendations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    -- checkout_attempts policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'checkout_attempts' AND policyname = 'Public can insert checkout_attempts') THEN
        CREATE POLICY "Public can insert checkout_attempts" ON public.checkout_attempts FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'checkout_attempts' AND policyname = 'Admins manage checkout_attempts') THEN
        CREATE POLICY "Admins manage checkout_attempts" ON public.checkout_attempts FOR ALL USING (public.is_admin());
    END IF;

    -- product_recommendations policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_recommendations' AND policyname = 'Anyone can view recommendations') THEN
        CREATE POLICY "Anyone can view recommendations" ON public.product_recommendations FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_recommendations' AND policyname = 'Admins manage recommendations') THEN
        CREATE POLICY "Admins manage recommendations" ON public.product_recommendations FOR ALL USING (public.is_admin());
    END IF;
END $$;

-- 6. Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Anyone can view settings') THEN
        CREATE POLICY "Anyone can view settings" ON public.site_settings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Admins manage settings') THEN
        CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL USING (public.is_admin());
    END IF;
END $$;

-- Seed default site settings if empty
INSERT INTO public.site_settings (id, config)
SELECT 'global', '{
  "topBanner": { "text": "⚡ FREE SHIPPING ON PREPAID ORDERS OVER ₹999", "isActive": true },
  "hero": {
    "title": "Your Design.\\nOur Impression.",
    "subtitle": "Elevate your brand identity with high-fidelity custom merchandise.",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop"
  }
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE id = 'global');

-- 7. Global Triggers for updated_at
DROP TRIGGER IF EXISTS tr_pages_updated_at ON public.pages;
CREATE TRIGGER tr_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_design_inquiries_updated_at ON public.design_inquiries;
CREATE TRIGGER tr_design_inquiries_updated_at BEFORE UPDATE ON public.design_inquiries FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_checkout_attempts_updated_at ON public.checkout_attempts;
CREATE TRIGGER tr_checkout_attempts_updated_at BEFORE UPDATE ON public.checkout_attempts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

