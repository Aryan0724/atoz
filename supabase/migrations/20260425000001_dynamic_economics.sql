-- Migration: 20260425000001_dynamic_economics.sql
-- Description: Add dynamic bulk discount rules to products and product-specific restrictions to coupons

-- 1. Update Products Table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS bulk_discount_rules JSONB DEFAULT '[]'::jsonb;

-- 2. Update Coupons Table
ALTER TABLE public.coupons 
ADD COLUMN IF NOT EXISTS applicable_product_ids UUID[] DEFAULT NULL;
