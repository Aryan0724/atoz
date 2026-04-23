-- Migration: 20260426000000_order_verification.sql
-- Description: Add dual-verification lifecycle columns to the orders table

-- 1. Extend 'status' CHECK to include new logistics stages
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'confirmed', 'in_production', 'dispatched', 'out_for_delivery', 'delivered', 'cancelled'));

-- 2. Extend 'payment_status' CHECK to include COD states  
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN ('unpaid', 'paid', 'failed', 'refunded', 'pending_cod', 'cod_collected', 'cod_remitted'));

-- 3. Set default payment_status for COD orders
UPDATE public.orders
  SET payment_status = 'pending_cod'
  WHERE payment_method = 'COD' AND payment_status = 'unpaid';

-- 4. Add new verification & reconciliation columns
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS delivery_confirmed_by_customer BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS delivery_confirmed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS delivery_disputed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS delivery_dispute_note TEXT,
  ADD COLUMN IF NOT EXISTS cod_collection_status TEXT DEFAULT 'not_applicable'
    CHECK (cod_collection_status IN ('not_applicable', 'pending', 'collected', 'failed')),
  ADD COLUMN IF NOT EXISTS cod_collected_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS cod_remitted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- 5. Set cod_collection_status for existing COD orders
UPDATE public.orders
  SET cod_collection_status = 'pending'
  WHERE payment_method = 'COD' AND cod_collection_status = 'not_applicable';

-- 6. Allow customers to update their own delivery_confirmed fields (via RLS)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can confirm delivery of their own orders') THEN
    CREATE POLICY "Users can confirm delivery of their own orders"
      ON public.orders
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
