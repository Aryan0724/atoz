-- 1. Create the 'products' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow ALL (Public) to read from the 'products' bucket
-- (Used for displaying products to customers)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT 
USING (bucket_id = 'products');

-- 3. Allow Authenticated users (Admins) to UPLOAD files
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
CREATE POLICY "Admin Upload" ON storage.objects 
FOR INSERT 
WITH CHECK (
    bucket_id = 'products' 
    AND auth.role() = 'authenticated'
);

-- 4. Allow Authenticated users (Admins) to UPDATE/REPLACE files
DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
CREATE POLICY "Admin Update" ON storage.objects 
FOR UPDATE 
USING (
    bucket_id = 'products' 
    AND auth.role() = 'authenticated'
);

-- 5. Allow Authenticated users (Admins) to DELETE files
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
CREATE POLICY "Admin Delete" ON storage.objects 
FOR DELETE 
USING (
    bucket_id = 'products' 
    AND auth.role() = 'authenticated'
);
