-- Update existing products with premium Unsplash images for a better homepage experience
UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=2000&auto=format&fit=crop']
WHERE name ILIKE '%Business Card%';

UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=2000&auto=format&fit=crop']
WHERE name ILIKE '%Diary%' OR name ILIKE '%Notebook%';

UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop']
WHERE name ILIKE '%Kit%' OR name ILIKE '%Gift Box%';

UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=2000&auto=format&fit=crop']
WHERE name ILIKE '%Packaging%' OR name ILIKE '%Box%';

UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2000&auto=format&fit=crop']
WHERE name ILIKE '%Letterhead%' OR name ILIKE '%Branding%';

UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1598301257982-0cf014dcc523?q=80&w=2000&auto=format&fit=crop']
WHERE name ILIKE '%ID Card%' OR name ILIKE '%Lanyard%';

UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2000&auto=format&fit=crop']
WHERE name ILIKE '%Mug%' OR name ILIKE '%Bottle%';

UPDATE products 
SET images = ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2000&auto=format&fit=crop']
WHERE name ILIKE '%T-shirt%' OR name ILIKE '%Hoodie%' OR name ILIKE '%Apparel%';
