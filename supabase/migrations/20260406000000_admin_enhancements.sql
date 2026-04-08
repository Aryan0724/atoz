-- Admin Enhancements Migration
-- 1. Dynamic Pricing for Products
ALTER TABLE products ADD COLUMN IF NOT EXISTS quality_prices JSONB DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS bulk_pricing JSONB DEFAULT '[]';

-- 2. Categories Management
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Checkout Attempts for Tracking Abandoned Carts
CREATE TABLE IF NOT EXISTS checkout_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER,
  quality_level TEXT,
  total_price NUMERIC,
  status TEXT DEFAULT 'pending', -- pending, successful
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Design Inquiries / Feedback
CREATE TABLE IF NOT EXISTS design_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES products(id),
  message TEXT NOT NULL,
  design_preview_url TEXT,
  design_data JSONB,
  status TEXT DEFAULT 'unread', -- unread, read, replied
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Seed initial categories
INSERT INTO categories (name, slug) VALUES 
('Packaging', 'packaging'),
('Stationary', 'stationary'),
('Apparel', 'apparel'),
('Merchandise', 'merchandise'),
('Accessories', 'accessories'),
('Corporate', 'corporate')
ON CONFLICT (slug) DO NOTHING;
