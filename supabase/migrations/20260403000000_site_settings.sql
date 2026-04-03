-- Migration: 20260403000000_site_settings.sql
-- Description: Create site settings global config JSON store

CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Everyone can view site settings') THEN
        CREATE POLICY "Everyone can view site settings" ON site_settings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update site settings') THEN
        CREATE POLICY "Admins can update site settings" ON site_settings FOR UPDATE USING (public.is_admin());
        CREATE POLICY "Admins can insert site settings" ON site_settings FOR INSERT WITH CHECK (public.is_admin());
    END IF;
END $$;

-- Insert default seed if not exists
INSERT INTO public.site_settings (id, config)
VALUES ('global', '{
  "topBanner": {
    "text": "⚡ FREE SHIPPING ON PREPAID ORDERS OVER ₹999",
    "isActive": true
  },
  "hero": {
    "title": "Your Design.\\nOur Impression.",
    "subtitle": "Elevate your brand identity with high-fidelity custom merchandise. From boutique startups to Fortune 500s, we deliver retail-ready excellence.",
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop"
  },
  "pricing": {
    "categories": [
      {
        "id": "diaries",
        "name": "Diaries",
        "icon": "📖",
        "items": [
          { "name": "Premium Leather Diary", "tiers": [550, 525, 490, 450], "unit": "Units" },
          { "name": "Hard Cover Diary", "tiers": [600, 580, 550, 520], "unit": "Units" },
          { "name": "A5 Soft Cover Wiro Diary", "tiers": [250, 220, 190, 160], "unit": "Units" },
          { "name": "A5 Hard Cover Wiro Diary", "tiers": [400, 380, 350, 320], "unit": "Units" }
        ],
        "headers": ["10+", "20+", "50+", "100+"]
      },
      {
        "id": "bill-books",
        "name": "Bill Books",
        "icon": "📝",
        "items": [
          { "name": "A5 Bill Book", "tiers": [450, 420, 400], "unit": "Sets" },
          { "name": "A5 Receipt Book", "tiers": [450, 420, 400], "unit": "Sets" },
          { "name": "A5 Voucher Book", "tiers": [450, 420, 400], "unit": "Sets" },
          { "name": "A4 GST Bill Book", "tiers": [900, 840, 800], "unit": "Sets" }
        ],
        "headers": ["5", "10", "20"]
      },
      {
        "id": "stationary",
        "name": "Stationary",
        "icon": "✉️",
        "items": [
          { "name": "Letterheads (A4)", "tiers": [600, 1000, 1800, 3500, 6000], "unit": "Units" }
        ],
        "headers": ["50", "100", "200", "500", "1000"]
      },
      {
        "id": "apparel",
        "name": "Apparel",
        "icon": "👕",
        "items": [
          { "name": "Premium Cotton T-Shirt", "tiers": [650, 620, 600], "unit": "Units" }
        ],
        "headers": ["1-10", "11-20", "21-50"]
      }
    ]
  }
}'::jsonb)
ON CONFLICT (id) DO NOTHING;
