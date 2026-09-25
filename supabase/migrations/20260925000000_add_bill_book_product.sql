-- 20260925000000_add_bill_book_product.sql
-- Seed Bill Book product into public.products

INSERT INTO public.categories (name, slug) 
VALUES ('Stationery', 'stationery')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (
  id, name, slug, description, category,
  moq, base_price, delivery_days,
  quality_levels, customization_fields, packaging_options,
  supported_views, is_active, images, template_images, wireframe_images,
  features, specifications, stock_quantity, quality_prices, bulk_discount_rules, design_mode
)
VALUES (
  'b1000000-0000-0000-0000-000000000011',
  'Bill Book',
  'bill-book',
  'Customized Business Bill Book / Cash Memo / Invoice Book with duplicate/triplicate carbonless copies. High-quality paper, sequential numbering, and clean binding. Price is ₹400 each book.',
  'Stationery',
  1,
  400,
  '5-7 Days',
  ARRAY['Single (100 Sheets)', 'Duplicate Carbonless (50 Sets)', 'Triplicate Carbonless (50 Sets)'],
  ARRAY['Shop / Business Name', 'Logo', 'Address & Phone', 'GSTIN Number', 'Starting Bill Number'],
  ARRAY['Standard Shrink Wrap', 'Box Packaging'],
  ARRAY['front'],
  true,
  ARRAY['/images/products/bill-book.jpg'],
  ARRAY['/images/products/bill-book.jpg'],
  ARRAY['/images/products/bill-book.jpg'],
  ARRAY['Premium Carbonless (NCR) Paper', 'Crisp Red Sequential Numbering', 'Hardboard Backing for Easy Writing', 'Perforated Easy-Tear Sheets'],
  '{"Size": "A5 / 1/8 Demy (5.5 x 8.5 in)", "Pages": "100 Sheets / 50 Sets per Book", "Binding": "Hard Pad Binding with Top Perforation", "Paper": "70 GSM Premium / Carbonless NCR"}'::jsonb,
  9999,
  '{"Single (100 Sheets)": 0, "Duplicate Carbonless (50 Sets)": 50, "Triplicate Carbonless (50 Sets)": 100}'::jsonb,
  '[{"quantity": 5, "discount": 5}, {"quantity": 10, "discount": 10}, {"quantity": 25, "discount": 15}, {"quantity": 50, "discount": 20}]'::jsonb,
  'template_form'
)
ON CONFLICT (slug) DO UPDATE SET
  base_price = 400,
  name = 'Bill Book',
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  is_active = true;
