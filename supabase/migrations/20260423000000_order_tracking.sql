-- Migration: 20260423000000_order_tracking.sql
-- Description: Add tracking and payment method fields to orders table

-- Add tracking columns
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS courier_name TEXT,
ADD COLUMN IF NOT EXISTS estimated_delivery TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS tracking_url TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'Online' CHECK (payment_method IN ('Online', 'COD'));

-- Update existing orders to have a default payment method if null
UPDATE public.orders SET payment_method = 'Online' WHERE payment_method IS NULL;
