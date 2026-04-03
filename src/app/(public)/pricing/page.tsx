import { createClient } from '@/lib/supabase/server';
import PricingClient from './PricingClient';

const defaultCategories = [
  {
    id: 'diaries',
    name: "Diaries",
    icon: "📖",
    items: [
      { name: "Premium Leather Diary", tiers: [550, 525, 490, 450], unit: "Units" },
      { name: "Hard Cover Diary", tiers: [600, 580, 550, 520], unit: "Units" },
      { name: "A5 Soft Cover Wiro Diary", tiers: [250, 220, 190, 160], unit: "Units" },
      { name: "A5 Hard Cover Wiro Diary", tiers: [400, 380, 350, 320], unit: "Units" },
    ],
    headers: ["10+", "20+", "50+", "100+"]
  },
  {
    id: 'bill-books',
    name: "Bill Books",
    icon: "📝",
    items: [
      { name: "A5 Bill Book", tiers: [450, 420, 400], "unit": "Sets" },
      { name: "A5 Receipt Book", tiers: [450, 420, 400], "unit": "Sets" },
      { name: "A5 Voucher Book", tiers: [450, 420, 400], "unit": "Sets" },
      { name: "A4 GST Bill Book", tiers: [900, 840, 800], "unit": "Sets" },
    ],
    headers: ["5", "10", "20"]
  },
  {
    id: 'stationary',
    name: "Stationary",
    icon: "✉️",
    items: [
      { name: "Letterheads (A4)", tiers: [600, 1000, 1800, 3500, 6000], "unit": "Units" },
    ],
    headers: ["50", "100", "200", "500", "1000"]
  },
  {
    id: 'apparel',
    name: "Apparel",
    icon: "👕",
    items: [
      { name: "Premium Cotton T-Shirt", tiers: [650, 620, 600], "unit": "Units" },
    ],
    headers: ["1-10", "11-20", "21-50"]
  }
];

export const revalidate = 60; // Revalidate every minute

export default async function PricingPage() {
  const supabase = createClient();
  let categories = defaultCategories;

  try {
    const { data } = await supabase.from('site_settings').select('config').eq('id', 'global').single();
    if ((data as any)?.config?.pricing?.categories) {
      categories = (data as any).config.pricing.categories;
    }
  } catch (err) {
    console.warn("Pricing CMS error (fallback applied):", err);
  }

  return <PricingClient initialCategories={categories} />;
}
