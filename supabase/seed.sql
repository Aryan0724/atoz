-- Seed Script for AtoZ Prints New Project
-- Populate with some sample high-quality products

INSERT INTO public.products (name, slug, description, category, base_price, moq, delivery_days, images, quality_levels, customization_fields, template_images)
VALUES 
(
    'Premium Heavyweight Hoodie', 
    'premium-heavyweight-hoodie', 
    'High-grade 400GSM fleece hoodie with luxury finish and double-stitched seams.', 
    'Apparel', 
    1250, 
    10, 
    '7-10 Days', 
    '{"https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format"}', 
    '{"Standard", "Premium", "Luxury"}', 
    '{"Chest Print", "Back Print", "Sleeve Print"}',
    '{"https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format"}'
),
(
    'Premium Coffee Mug', 
    'premium-coffee-mug', 
    'Sleek 11oz ceramic mug with vibrant color reproduction and microwave safe ceramic.', 
    'Drinkware', 
    180, 
    50, 
    '5-7 Days', 
    '{"https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format"}', 
    '{"Standard", "Premium"}', 
    '{"Wrap Layout", "Double Side"}',
    '{"https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format"}'
),
(
    'Executive Notebook', 
    'executive-notebook', 
    'Premium A5 leather-bound notebook with high-quality 100GSM paper.', 
    'Stationery', 
    350, 
    20, 
    '7 Days', 
    '{"https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=1000&auto=format"}', 
    '{"Standard", "Gold Embossed"}', 
    '{"Front Cover Logo", "Initialing"}',
    '{"https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=1000&auto=format"}'
),
(
    'Custom Premium T-Shirt', 
    'custom-premium-tshirt', 
    '100% Organic cotton t-shirt with premium weight and breathable fabric. Perfect for high-quality custom designs.', 
    'Apparel', 
    599, 
    1, 
    '3-5 Days', 
    '{"https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format"}', 
    '{"Standard", "Premium", "Luxury"}', 
    '{"Front Print", "Back Print", "Pocket Logo"}',
    '{"https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format"}'
)
ON CONFLICT (slug) DO NOTHING;
