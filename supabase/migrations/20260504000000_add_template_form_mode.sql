-- Add 'template_form' to the design_mode CHECK constraint in products table

-- 1. Drop the existing constraint
ALTER TABLE products 
DROP CONSTRAINT IF EXISTS products_design_mode_check;

-- 2. Add the updated constraint including 'template_form'
ALTER TABLE products 
ADD CONSTRAINT products_design_mode_check 
CHECK (design_mode IN ('standard', 'vdp', 'multipage', 'intake_form', 'template_form'));

-- 3. Update the column comment
COMMENT ON COLUMN products.design_mode IS 'The design engine mode: standard, vdp, multipage, intake_form, or template_form.';
