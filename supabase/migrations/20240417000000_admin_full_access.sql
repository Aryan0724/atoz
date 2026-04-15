-- Migration: Ensure admins can fully manage products and recommendations
-- Run this in Supabase SQL Editor if admin product updates are failing

-- 1. Ensure the is_admin() helper exists
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Products table: Allow admins full access
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 3. product_recommendations: Allow admins full access
DROP POLICY IF EXISTS "Admins can manage recommendations" ON public.product_recommendations;
CREATE POLICY "Admins can manage recommendations" ON public.product_recommendations
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. categories: Allow admins full access
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 5. profiles: Allow admins to read all profiles
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin() OR id = auth.uid());

-- Verify the function works
SELECT public.is_admin();
