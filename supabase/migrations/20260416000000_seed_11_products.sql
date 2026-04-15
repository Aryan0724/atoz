-- 20260416000000_seed_11_products.sql
-- Seed script for 11 precise custom products with inline SVG wireframes.
-- Run this directly in the Supabase SQL Editor.

-- 1. Ensure required Categories exist
INSERT INTO public.categories (name, slug) VALUES 
('Stationary', 'stationary'),
('Corporate', 'corporate'),
('Accessories', 'accessories')
ON CONFLICT (slug) DO NOTHING;

-- 2. Delete existing demo products with the same slugs to avoid conflict
DELETE FROM public.products WHERE slug IN (
  'calendar-custom', 'wedding-card-custom', 'business-card-custom',
  'employee-joining-kit', 'diary-with-logo', 'id-card-custom',
  'letter-head-custom', 'pen-custom', 'bottle-custom',
  'headphone-custom', 'bag-custom'
);

-- 3. Insert the 11 Products
INSERT INTO public.products (
  name, slug, description, category, 
  moq, base_price, delivery_days, 
  quality_levels, customization_fields, packaging_options,
  supported_views, is_active, images, wireframe_images
)
VALUES

-- 1. Calendar
(
  'Calendar', 'calendar-custom', 
  'Fully customized, professional-quality product suitable for branding and promotional use.',
  'stationary', 50, 199.00, '7–10 Working Days',
  ARRAY['Basic', 'Standard', 'Premium', 'Luxury'],
  ARRAY['Logo', 'Name', 'Text', 'Color'],
  ARRAY['Standard', 'Premium'],
  ARRAY['front'], true,
  ARRAY['https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=800&auto=format&fit=crop'],
  ARRAY[
    'data:image/svg+xml;utf8,' || '<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,450 450,450 400,100 100,100" fill="none" stroke="#222" stroke-width="4"/>
      <rect x="70" y="120" width="360" height="300" fill="#ffffff" stroke="#222" stroke-width="4" rx="8"/>
      <rect x="100" y="100" width="20" height="40" fill="none" stroke="#222" stroke-width="4" rx="10"/>
      <rect x="150" y="100" width="20" height="40" fill="none" stroke="#222" stroke-width="4" rx="10"/>
      <rect x="200" y="100" width="20" height="40" fill="none" stroke="#222" stroke-width="4" rx="10"/>
      <rect x="250" y="100" width="20" height="40" fill="none" stroke="#222" stroke-width="4" rx="10"/>
      <rect x="300" y="100" width="20" height="40" fill="none" stroke="#222" stroke-width="4" rx="10"/>
      <rect x="350" y="100" width="20" height="40" fill="none" stroke="#222" stroke-width="4" rx="10"/>
      <line x1="70" y1="200" x2="430" y2="200" stroke="#ccc" stroke-width="3"/>
      <line x1="70" y1="250" x2="430" y2="250" stroke="#ccc" stroke-width="3"/>
      <line x1="70" y1="300" x2="430" y2="300" stroke="#ccc" stroke-width="3"/>
      <line x1="140" y1="200" x2="140" y2="420" stroke="#ccc" stroke-width="3"/>
      <line x1="210" y1="200" x2="210" y2="420" stroke="#ccc" stroke-width="3"/>
      <line x1="280" y1="200" x2="280" y2="420" stroke="#ccc" stroke-width="3"/>
      <line x1="350" y1="200" x2="350" y2="420" stroke="#ccc" stroke-width="3"/>
    </svg>'
  ]
),

-- 2. Wedding Card
(
  'Wedding Card', 'wedding-card-custom', 
  'Fully customized, professional-quality product suitable for branding and promotional use.',
  'stationary', 50, 49.00, '7–10 Working Days',
  ARRAY['Basic', 'Standard', 'Premium', 'Luxury'],
  ARRAY['Logo', 'Name', 'Text', 'Color'],
  ARRAY['Standard', 'Premium'],
  ARRAY['front'], true,
  ARRAY['https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=800&auto=format&fit=crop'],
  ARRAY[
    'data:image/svg+xml;utf8,' || '<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="50" width="200" height="400" fill="#ffffff" stroke="#222" stroke-width="4" rx="10"/>
      <polygon points="250,50 450,100 450,450 250,450" fill="#ffffff" stroke="#222" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="350" cy="250" r="40" fill="none" stroke="#222" stroke-width="3" stroke-dasharray="10 5"/>
      <circle cx="350" cy="250" r="30" fill="none" stroke="#222" stroke-width="2"/>
      <line x1="290" y1="320" x2="410" y2="320" stroke="#ccc" stroke-width="2"/>
      <line x1="310" y1="340" x2="390" y2="340" stroke="#ccc" stroke-width="2"/>
    </svg>'
  ]
),

-- 3. Business Card
(
  'Business Card', 'business-card-custom', 
  'Fully customized, professional-quality product suitable for branding and promotional use.',
  'stationary', 50, 4.99, '7–10 Working Days',
  ARRAY['Basic', 'Standard', 'Premium', 'Luxury'],
  ARRAY['Logo', 'Name', 'Text', 'Color'],
  ARRAY['Standard', 'Premium'],
  ARRAY['front'], true,
  ARRAY['https://images.unsplash.com/photo-1589041127168-9b1915731bda?q=80&w=800&auto=format&fit=crop'],
  ARRAY[
    'data:image/svg+xml;utf8,' || '<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="25" width="440" height="240" fill="#ffffff" stroke="#222" stroke-width="4" rx="12"/>
      <circle cx="100" cy="145" r="40" fill="none" stroke="#222" stroke-width="3"/>
      <rect x="80" y="125" width="40" height="40" fill="none" stroke="#222" stroke-width="2"/>
      <line x1="180" y1="120" x2="380" y2="120" stroke="#222" stroke-width="6"/>
      <line x1="180" y1="150" x2="320" y2="150" stroke="#ccc" stroke-width="4"/>
      <line x1="180" y1="170" x2="300" y2="170" stroke="#ccc" stroke-width="4"/>
    </svg>'
  ]
),

-- 4. Employee Joining Kit
(
  'Employee Joining Kit', 'employee-joining-kit', 
  'Fully customized, professional-quality product suitable for branding and promotional use.',
  'corporate', 50, 1499.00, '7–10 Working Days',
  ARRAY['Basic', 'Standard', 'Premium', 'Luxury'],
  ARRAY['Logo', 'Name', 'Text', 'Color'],
  ARRAY['Standard', 'Premium'],
  ARRAY['front'], true,
  ARRAY['https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=800&auto=format&fit=crop'],
  ARRAY[
    'data:image/svg+xml;utf8,' || '<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="40" width="420" height="420" fill="#ffffff" stroke="#222" stroke-width="6" rx="20"/>
      <rect x="70" y="70" width="180" height="250" fill="#ffffff" stroke="#222" stroke-width="3" rx="10"/>
      <line x1="90" y1="70" x2="90" y2="320" stroke="#222" stroke-width="3"/>
      <rect x="280" y="70" width="30" height="200" fill="#ffffff" stroke="#222" stroke-width="3" rx="15"/>
      <line x1="285" y1="100" x2="305" y2="100" stroke="#222" stroke-width="2"/>
      <circle cx="370" cy="170" r="50" fill="#ffffff" stroke="#222" stroke-width="3"/>
      <circle cx="370" cy="170" r="30" fill="none" stroke="#222" stroke-width="2"/>
      <rect x="70" y="340" width="360" height="80" fill="#ffffff" stroke="#222" stroke-width="3" rx="10"/>
      <path d="M220,340 Q250,370 280,340" fill="none" stroke="#222" stroke-width="3"/>
    </svg>'
  ]
),

-- 5. Diary with Logo
(
  'Diary with Logo', 'diary-with-logo', 
  'Fully customized, professional-quality product suitable for branding and promotional use.',
  'stationary', 50, 249.00, '7–10 Working Days',
  ARRAY['Basic', 'Standard', 'Premium', 'Luxury'],
  ARRAY['Logo', 'Name', 'Text', 'Color'],
  ARRAY['Standard', 'Premium'],
  ARRAY['front'], true,
  ARRAY['https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop'],
  ARRAY[
    'data:image/svg+xml;utf8,' || '<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="30" width="40" height="440" fill="none" stroke="#222" stroke-width="5" rx="5"/>
      <rect x="80" y="30" width="280" height="440" fill="#ffffff" stroke="#222" stroke-width="5" rx="8"/>
      <line x1="100" y1="30" x2="100" y2="470" stroke="#ccc" stroke-width="2"/>
      <path d="M120,470 L120,500 L135,485 L150,500 L150,470 Z" fill="none" stroke="#222" stroke-width="3"/>
      <rect x="330" y="30" width="15" height="440" fill="none" stroke="#222" stroke-width="2"/>
    </svg>'
  ]
),

-- 6. ID Card
(
  'ID Card', 'id-card-custom', 
  'Fully customized, professional-quality product suitable for branding and promotional use.',
  'stationary', 50, 29.00, '7–10 Working Days',
  ARRAY['Basic', 'Standard', 'Premium', 'Luxury'],
  ARRAY['Logo', 'Name', 'Text', 'Color'],
  ARRAY['Standard', 'Premium'],
  ARRAY['front'], true,
  ARRAY['https://plus.unsplash.com/premium_photo-1661605370217-094362dca972?q=80&w=800&auto=format&fit=crop'],
  ARRAY[
    'data:image/svg+xml;utf8,' || '<svg viewBox="0 0 300 500" xmlns="http://www.w3.org/2000/svg">
      <rect x="130" y="10" width="40" height="30" fill="none" stroke="#222" stroke-width="4" rx="10"/>
      <circle cx="150" cy="65" r="15" fill="none" stroke="#222" stroke-width="3"/>
      <rect x="40" y="50" width="220" height="350" fill="#ffffff" stroke="#222" stroke-width="5" rx="15"/>
      <rect x="100" y="130" width="100" height="100" fill="none" stroke="#222" stroke-width="3" rx="10"/>
      <circle cx="150" cy="165" r="20" fill="none" stroke="#222" stroke-width="2"/>
      <path d="M110,230 Q150,190 190,230" fill="none" stroke="#222" stroke-width="2"/>
      <line x1="100" y1="260" x2="200" y2="260" stroke="#222" stroke-width="4"/>
      <line x1="120" y1="280" x2="180" y2="280" stroke="#ccc" stroke-width="3"/>
      <line x1="70" y1="320" x2="230" y2="320" stroke="#ccc" stroke-width="2"/>
      <line x1="70" y1="340" x2="230" y2="340" stroke="#ccc" stroke-width="2"/>
    </svg>'
  ]
),

-- 7. Letter Head
(
  'Letter Head', 'letter-head-custom', 
  'Fully customized, professional-quality product suitable for branding and promotional use.',
  'stationary', 50, 9.00, '7–10 Working Days',
  ARRAY['Basic', 'Standard', 'Premium', 'Luxury'],
  ARRAY['Logo', 'Name', 'Text', 'Color'],
  ARRAY['Standard', 'Premium'],
  ARRAY['front'], true,
  ARRAY['https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800&auto=format&fit=crop'],
  ARRAY[
    'data:image/svg+xml;utf8,' || '<svg viewBox="0 0 400 550" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="20" width="340" height="510" fill="#ffffff" stroke="#222" stroke-width="3"/>
      <rect x="50" y="40" width="60" height="60" fill="none" stroke="#222" stroke-width="2"/>
      <line x1="200" y1="50" x2="350" y2="50" stroke="#222" stroke-width="3"/>
      <line x1="280" y1="70" x2="350" y2="70" stroke="#ccc" stroke-width="2"/>
      <line x1="50" y1="120" x2="350" y2="120" stroke="#222" stroke-width="4"/>
      <line x1="50" y1="160" x2="150" y2="160" stroke="#ccc" stroke-width="2"/>
      <line x1="50" y1="200" x2="350" y2="200" stroke="#ccc" stroke-width="2"/>
      <line x1="50" y1="230" x2="330" y2="230" stroke="#ccc" stroke-width="2"/>
      <line x1="50" y1="260" x2="340" y2="260" stroke="#ccc" stroke-width="2"/>
      <line x1="50" y1="290" x2="200" y2="290" stroke="#ccc" stroke-width="2"/>
      <line x1="50" y1="350" x2="120" y2="350" stroke="#ccc" stroke-width="2"/>
      <line x1="50" y1="480" x2="350" y2="480" stroke="#ccc" stroke-width="2"/>
      <line x1="150" y1="500" x2="250" y2="500" stroke="#ccc" stroke-width="2"/>
    </svg>'
  ]
),

-- 8. Pen
(
  'Pen', 'pen-custom', 
  'Fully customized, professional-quality product suitable for branding and promotional use.',
  'stationary', 50, 39.00, '7–10 Working Days',
  ARRAY['Basic', 'Standard', 'Premium', 'Luxury'],
  ARRAY['Logo', 'Name', 'Text', 'Color'],
  ARRAY['Standard', 'Premium'],
  ARRAY['front'], true,
  ARRAY['https://images.unsplash.com/photo-1585336261022-680e295ce3fe?q=80&w=800&auto=format&fit=crop'],
  ARRAY[
    'data:image/svg+xml;utf8,' || '<svg viewBox="0 0 100 500" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="40" width="30" height="340" fill="#ffffff" stroke="#222" stroke-width="4" rx="5"/>
      <path d="M35,40 Q50,10 65,40 Z" fill="none" stroke="#222" stroke-width="4"/>
      <rect x="65" y="60" width="10" height="120" fill="none" stroke="#222" stroke-width="3" rx="3"/>
      <line x1="70" y1="180" x2="65" y2="170" stroke="#222" stroke-width="3"/>
      <polygon points="35,380 65,380 55,450 45,450" fill="none" stroke="#222" stroke-width="4" stroke-linejoin="round"/>
      <polygon points="45,450 55,450 50,470" fill="#222" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
    </svg>'
  ]
),

-- 9. Bottle
(
  'Bottle', 'bottle-custom', 
  'Fully customized, professional-quality product suitable for branding and promotional use.',
  'corporate', 50, 499.00, '7–10 Working Days',
  ARRAY['Basic', 'Standard', 'Premium', 'Luxury'],
  ARRAY['Logo', 'Name', 'Text', 'Color'],
  ARRAY['Standard', 'Premium'],
  ARRAY['front'], true,
  ARRAY['https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop'],
  ARRAY[
    'data:image/svg+xml;utf8,' || '<svg viewBox="0 0 200 500" xmlns="http://www.w3.org/2000/svg">
      <rect x="65" y="20" width="70" height="50" fill="none" stroke="#222" stroke-width="4" rx="5"/>
      <line x1="65" y1="35" x2="135" y2="35" stroke="#ccc" stroke-width="2"/>
      <line x1="65" y1="50" x2="135" y2="50" stroke="#ccc" stroke-width="2"/>
      <rect x="75" y="70" width="50" height="30" fill="none" stroke="#222" stroke-width="4"/>
      <path d="M75,100 C 40,120 40,150 40,180 L40,460 C 40,480 160,480 160,460 L160,180 C 160,150 125,120 125,100 Z" fill="#ffffff" stroke="#222" stroke-width="5" stroke-linejoin="round"/>
    </svg>'
  ]
),

-- 10. Headphone
(
  'Headphone', 'headphone-custom', 
  'Fully customized, professional-quality product suitable for branding and promotional use.',
  'accessories', 50, 1999.00, '7–10 Working Days',
  ARRAY['Basic', 'Standard', 'Premium', 'Luxury'],
  ARRAY['Logo', 'Name', 'Text', 'Color'],
  ARRAY['Standard', 'Premium'],
  ARRAY['front'], true,
  ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop'],
  ARRAY[
    'data:image/svg+xml;utf8,' || '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <path d="M100,200 C 100,50 300,50 300,200" fill="none" stroke="#222" stroke-width="30" stroke-linecap="round"/>
      <path d="M100,200 C 100,50 300,50 300,200" fill="none" stroke="#ffffff" stroke-width="24" stroke-linecap="round"/>
      <rect x="50" y="160" width="50" height="120" fill="none" stroke="#222" stroke-width="5" rx="20"/>
      <rect x="40" y="170" width="20" height="100" fill="#ffffff" stroke="#222" stroke-width="4" rx="10"/>
      <rect x="100" y="170" width="20" height="100" fill="#ffffff" stroke="#222" stroke-width="3" rx="5"/>
      <rect x="300" y="160" width="50" height="120" fill="none" stroke="#222" stroke-width="5" rx="20"/>
      <rect x="340" y="170" width="20" height="100" fill="#ffffff" stroke="#222" stroke-width="4" rx="10"/>
      <rect x="280" y="170" width="20" height="100" fill="#ffffff" stroke="#222" stroke-width="3" rx="5"/>
    </svg>'
  ]
),

-- 11. Bag
(
  'Bag', 'bag-custom', 
  'Fully customized, professional-quality product suitable for branding and promotional use.',
  'accessories', 50, 499.00, '7–10 Working Days',
  ARRAY['Basic', 'Standard', 'Premium', 'Luxury'],
  ARRAY['Logo', 'Name', 'Text', 'Color'],
  ARRAY['Standard', 'Premium'],
  ARRAY['front'], true,
  ARRAY['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop'],
  ARRAY[
    'data:image/svg+xml;utf8,' || '<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <path d="M140,150 C 140,20 260,20 260,150" fill="none" stroke="#222" stroke-width="15"/>
      <path d="M140,150 C 140,20 260,20 260,150" fill="none" stroke="#ffffff" stroke-width="5"/>
      <path d="M70,140 L330,140 L310,450 C 310,470 90,470 90,450 Z" fill="#ffffff" stroke="#222" stroke-width="6" stroke-linejoin="round"/>
      <path d="M120,150 C 120,40 280,40 280,150 L280,180" fill="none" stroke="#222" stroke-width="15" stroke-linecap="round"/>
      <path d="M120,150 C 120,40 280,40 280,150 L280,180" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
      <rect x="150" y="250" width="100" height="120" fill="none" stroke="#ccc" stroke-width="3" rx="5"/>
    </svg>'
  ]
);
