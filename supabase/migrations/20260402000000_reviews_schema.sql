-- Migration: Product Reviews & Ratings

CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Everyone can view active reviews
CREATE POLICY "Reviews are viewable by everyone" ON public.product_reviews 
    FOR SELECT USING (true);

-- 2. Authenticated users can insert reviews
CREATE POLICY "Authenticated users can create reviews" ON public.product_reviews 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own reviews
CREATE POLICY "Users can update their own reviews" ON public.product_reviews 
    FOR UPDATE USING (auth.uid() = user_id);

-- 4. Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews" ON public.product_reviews 
    FOR DELETE USING (auth.uid() = user_id);
