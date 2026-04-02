-- Migration for Admin CMS Pages Table

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

-- RLS Settings
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pages are viewable by everyone if published" ON public.pages 
    FOR SELECT USING (is_published = true OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Admin full access to pages" ON public.pages 
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
    ) WITH CHECK (
        auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
    );

-- Trigger for auto-updating timestamps
CREATE TRIGGER update_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
