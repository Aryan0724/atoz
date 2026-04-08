-- Create product_recommendations table for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.product_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    recommended_product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(product_id, recommended_product_id)
);

-- Enable RLS
ALTER TABLE public.product_recommendations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view recommendations" ON public.product_recommendations
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage recommendations" ON public.product_recommendations
    FOR ALL USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users));

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_recommendations_product_id ON public.product_recommendations(product_id);
