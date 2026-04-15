-- consolidation-migration: 20240416000000_fix_rls_policies.sql
-- Description: Consolidate admin RLS policies to use the standard is_admin() function.

-- 1. Ensure the is_admin() helper exists and is robust
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Fix product_recommendations
DROP POLICY IF EXISTS "Admins can manage recommendations" ON public.product_recommendations;
CREATE POLICY "Admins can manage recommendations" ON public.product_recommendations
    FOR ALL USING (public.is_admin());

-- 3. Fix design_inquiries
DROP POLICY IF EXISTS "Admins can view and update inquiries" ON public.design_inquiries;
CREATE POLICY "Admins can view and update inquiries" ON public.design_inquiries
    FOR ALL USING (public.is_admin());

-- 4. Fix abandoned_carts (Checking if table exists first)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'abandoned_carts') THEN
        DROP POLICY IF EXISTS "Admins can manage abandoned carts" ON public.abandoned_carts;
        EXECUTE 'CREATE POLICY "Admins can manage abandoned carts" ON public.abandoned_carts FOR ALL USING (public.is_admin())';
    END IF;
END $$;
