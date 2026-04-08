-- Standardized Abandoned Cart Tracking
CREATE TABLE IF NOT EXISTS public.checkout_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email TEXT,
    product_id UUID REFERENCES public.products(id),
    canvas_state JSONB,
    cart_total NUMERIC,
    status TEXT DEFAULT 'pending', -- pending, abandoned, completed
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_checkout_attempts_status ON public.checkout_attempts(status);
CREATE INDEX IF NOT EXISTS idx_checkout_attempts_created_at ON public.checkout_attempts(created_at);

-- RLS
ALTER TABLE public.checkout_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert checkout attempts" 
ON public.checkout_attempts FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow admin managed checkout attempts" 
ON public.checkout_attempts FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users));
