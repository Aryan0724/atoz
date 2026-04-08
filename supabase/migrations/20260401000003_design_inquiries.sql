-- Create design_inquiries table
CREATE TABLE IF NOT EXISTS public.design_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    product_id UUID REFERENCES public.products(id),
    message TEXT NOT NULL,
    design_state JSONB NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'responded', 'converted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.design_inquiries ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create inquiries" ON public.design_inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view and update inquiries" ON public.design_inquiries
    FOR ALL USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users));

-- Trigger for updated_at
CREATE TRIGGER update_design_inquiries_updated_at
    BEFORE UPDATE ON public.design_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
