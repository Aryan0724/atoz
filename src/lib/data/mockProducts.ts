import { Product } from '../supabase/types';

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Custom Premium T-Shirt',
    slug: 'custom-premium-tshirt',
    description: 'High-quality 100% bio-washed cotton t-shirts for brand promotion and corporate events.',
    category: 'Apparel',
    quality_levels: ['Basic', 'Standard', 'Premium'],
    customization_fields: ['Logo', 'Front Text', 'Back Text'],
    moq: 50,
    base_price: 299,
    delivery_days: '7-10 Working Days',
    packaging_options: ['Standard', 'Luxury Box'],
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'p2',
    name: 'Branded Ceramic Mug',
    slug: 'branded-ceramic-mug',
    description: 'Perfect for office desks and corporate gifting. Microwave and dishwasher safe.',
    category: 'Drinkware',
    quality_levels: ['Standard', 'Premium'],
    customization_fields: ['Logo', 'Wraparound Design'],
    moq: 100,
    base_price: 149,
    delivery_days: '5-7 Working Days',
    packaging_options: ['Safe-ship Box', 'Gift Wrap'],
    images: ['https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'p3',
    name: 'Corporate Notebook',
    slug: 'corporate-notebook',
    description: 'Hardbound premium notebooks with customized covers and individual name engraving.',
    category: 'Stationery',
    quality_levels: ['Standard', 'Premium', 'Luxury'],
    customization_fields: ['Cover Logo', 'Name Engraving'],
    moq: 50,
    base_price: 199,
    delivery_days: '7-9 Working Days',
    packaging_options: ['Standard', 'Executive Sleeve'],
    images: ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'p4',
    name: 'Tech Accessories Pouch',
    slug: 'tech-accessories-pouch',
    description: 'Keep your charging cables and gear organized with this high-quality branded pouch.',
    category: 'Lifestyle',
    quality_levels: ['Standard', 'Premium'],
    customization_fields: ['Embroidered Logo', 'Printed Name'],
    moq: 50,
    base_price: 349,
    delivery_days: '10-12 Working Days',
    packaging_options: ['Standard', 'Branded Box'],
    images: ['https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80'],
    is_active: true,
    created_at: new Date().toISOString()
  }
];
