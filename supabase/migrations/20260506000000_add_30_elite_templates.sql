-- Add 30 Elite Templates Migration

-- Updating Elite Business Card
DO $$
DECLARE
  v_variants JSONB;
  v_config JSONB;
  v_new_variants JSONB := '[]'::jsonb;
  v_mappings JSONB := '{}'::jsonb;
BEGIN
  SELECT color_variants, design_config INTO v_variants, v_config FROM products WHERE slug = 'business-card-custom';
  IF v_variants IS NULL THEN v_variants := '[]'::jsonb; END IF;
  IF v_config IS NULL THEN v_config := '{"mappings": {}, "fields": []}'::jsonb; END IF;
  IF v_config->'mappings' IS NULL THEN v_config := jsonb_set(v_config, '{mappings}', '{}'::jsonb); END IF;
  FOR i IN 0..29 LOOP
    DECLARE
      v_idx INT := jsonb_array_length(v_variants);
      v_folder TEXT := LPAD((31 + i)::text, 2, '0');
      v_name TEXT := 'Elite Design ' || (31 + i)::text;
      v_hex TEXT := CASE (i % 10) 
        WHEN 0 THEN '#0F172A'
        WHEN 1 THEN '#1E3A8A'
        WHEN 2 THEN '#111827'
        WHEN 3 THEN '#EC4899'
        WHEN 4 THEN '#0D9488'
        WHEN 5 THEN '#F97316'
        WHEN 6 THEN '#8B5CF6'
        WHEN 7 THEN '#EF4444'
        WHEN 8 THEN '#059669'
        WHEN 9 THEN '#44403C'
      END;
      v_wireframes JSONB;
    BEGIN
      v_wireframes := jsonb_build_array('/templates/bc/' || v_folder || '/front.svg', '/templates/bc/' || v_folder || '/back.svg');
      v_variants := v_variants || jsonb_build_object('name', v_name, 'hex', v_hex, 'wireframe_images', v_wireframes);
      v_config := jsonb_set(v_config, ARRAY['mappings', v_idx::text || '_0'], '{"name": {"x": 50, "y": 45, "fontSize": 30, "fontWeight": "bold", "align": "center"}, "title": {"x": 50, "y": 55, "fontSize": 16, "fontWeight": "normal", "align": "center"}, "phone": {"x": 50, "y": 75, "fontSize": 12, "fontWeight": "normal", "align": "center"}, "email": {"x": 50, "y": 82, "fontSize": 12, "fontWeight": "normal", "align": "center"}, "logo": {"x": 8, "y": 14, "w": 4, "h": 7}}'::jsonb);
    END;
  END LOOP;
  UPDATE products SET color_variants = v_variants, design_config = v_config, design_mode = 'template_form' WHERE slug = 'business-card-custom';
END $$;

-- Updating Elite ID Card
DO $$
DECLARE
  v_variants JSONB;
  v_config JSONB;
  v_new_variants JSONB := '[]'::jsonb;
  v_mappings JSONB := '{}'::jsonb;
BEGIN
  SELECT color_variants, design_config INTO v_variants, v_config FROM products WHERE slug = 'id-card-custom';
  IF v_variants IS NULL THEN v_variants := '[]'::jsonb; END IF;
  IF v_config IS NULL THEN v_config := '{"mappings": {}, "fields": []}'::jsonb; END IF;
  IF v_config->'mappings' IS NULL THEN v_config := jsonb_set(v_config, '{mappings}', '{}'::jsonb); END IF;
  IF v_config->'fields' IS NULL OR jsonb_array_length(v_config->'fields') = 0 THEN
    v_config := jsonb_set(v_config, '{fields}', '[{"id":"name","label":"Employee Name","type":"text","icon":"User","placeholder":"e.g. Vikram Malhotra"},{"id":"id_no","label":"Employee ID","type":"text","icon":"Type","placeholder":"e.g. AZ-2026-001"},{"id":"designation","label":"Designation","type":"text","icon":"Briefcase","placeholder":"e.g. Senior Developer"}]'::jsonb);
  END IF;
  FOR i IN 0..29 LOOP
    DECLARE
      v_idx INT := jsonb_array_length(v_variants);
      v_folder TEXT := LPAD((11 + i)::text, 2, '0');
      v_name TEXT := 'Elite Design ' || (11 + i)::text;
      v_hex TEXT := CASE (i % 10) 
        WHEN 0 THEN '#0F172A'
        WHEN 1 THEN '#1E3A8A'
        WHEN 2 THEN '#111827'
        WHEN 3 THEN '#EC4899'
        WHEN 4 THEN '#0D9488'
        WHEN 5 THEN '#F97316'
        WHEN 6 THEN '#8B5CF6'
        WHEN 7 THEN '#EF4444'
        WHEN 8 THEN '#059669'
        WHEN 9 THEN '#44403C'
      END;
      v_wireframes JSONB;
    BEGIN
      v_wireframes := jsonb_build_array('/templates/id/' || v_folder || '/front.svg');
      v_variants := v_variants || jsonb_build_object('name', v_name, 'hex', v_hex, 'wireframe_images', v_wireframes);
      v_config := jsonb_set(v_config, ARRAY['mappings', v_idx::text || '_0'], '{"name": {"x": 50, "y": 62, "fontSize": 32, "fontWeight": "bold", "align": "center"}, "id_no": {"x": 50, "y": 70, "fontSize": 16, "fontWeight": "normal", "align": "center"}, "designation": {"x": 50, "y": 76, "fontSize": 14, "fontWeight": "bold", "align": "center"}, "logo": {"x": 42, "y": 6, "w": 16, "h": 9}}'::jsonb);
    END;
  END LOOP;
  UPDATE products SET color_variants = v_variants, design_config = v_config, design_mode = 'template_form' WHERE slug = 'id-card-custom';
END $$;

-- Updating Elite Wedding Card
DO $$
DECLARE
  v_variants JSONB;
  v_config JSONB;
  v_new_variants JSONB := '[]'::jsonb;
  v_mappings JSONB := '{}'::jsonb;
BEGIN
  SELECT color_variants, design_config INTO v_variants, v_config FROM products WHERE slug = 'wedding-card-custom';
  IF v_variants IS NULL THEN v_variants := '[]'::jsonb; END IF;
  IF v_config IS NULL THEN v_config := '{"mappings": {}, "fields": []}'::jsonb; END IF;
  IF v_config->'mappings' IS NULL THEN v_config := jsonb_set(v_config, '{mappings}', '{}'::jsonb); END IF;
  IF v_config->'fields' IS NULL OR jsonb_array_length(v_config->'fields') = 0 THEN
    v_config := jsonb_set(v_config, '{fields}', '[{"id":"groom","label":"Groom Name","type":"text","icon":"User","placeholder":"e.g. Rahul"},{"id":"bride","label":"Bride Name","type":"text","icon":"User","placeholder":"e.g. Ananya"},{"id":"date","label":"Date","type":"text","icon":"Calendar","placeholder":"e.g. 15th Dec 2026"},{"id":"venue","label":"Venue","type":"textarea","icon":"MapPin","placeholder":"Enter venue address..."}]'::jsonb);
  END IF;
  FOR i IN 0..29 LOOP
    DECLARE
      v_idx INT := jsonb_array_length(v_variants);
      v_folder TEXT := LPAD((11 + i)::text, 2, '0');
      v_name TEXT := 'Elite Design ' || (11 + i)::text;
      v_hex TEXT := CASE (i % 10) 
        WHEN 0 THEN '#0F172A'
        WHEN 1 THEN '#1E3A8A'
        WHEN 2 THEN '#111827'
        WHEN 3 THEN '#EC4899'
        WHEN 4 THEN '#0D9488'
        WHEN 5 THEN '#F97316'
        WHEN 6 THEN '#8B5CF6'
        WHEN 7 THEN '#EF4444'
        WHEN 8 THEN '#059669'
        WHEN 9 THEN '#44403C'
      END;
      v_wireframes JSONB;
    BEGIN
      v_wireframes := jsonb_build_array('/templates/wc/' || v_folder || '/front.svg');
      v_variants := v_variants || jsonb_build_object('name', v_name, 'hex', v_hex, 'wireframe_images', v_wireframes);
      v_config := jsonb_set(v_config, ARRAY['mappings', v_idx::text || '_0'], '{"groom": {"x": 50, "y": 35, "fontSize": 36, "fontWeight": "bold", "align": "center"}, "bride": {"x": 50, "y": 48, "fontSize": 36, "fontWeight": "bold", "align": "center"}, "date": {"x": 50, "y": 60, "fontSize": 18, "fontWeight": "normal", "align": "center"}, "venue": {"x": 50, "y": 75, "fontSize": 14, "fontWeight": "normal", "align": "center"}}'::jsonb);
    END;
  END LOOP;
  UPDATE products SET color_variants = v_variants, design_config = v_config, design_mode = 'template_form' WHERE slug = 'wedding-card-custom';
END $$;

-- Updating Elite Letterhead
DO $$
DECLARE
  v_variants JSONB;
  v_config JSONB;
  v_new_variants JSONB := '[]'::jsonb;
  v_mappings JSONB := '{}'::jsonb;
BEGIN
  SELECT color_variants, design_config INTO v_variants, v_config FROM products WHERE slug = 'letter-head-custom';
  IF v_variants IS NULL THEN v_variants := '[]'::jsonb; END IF;
  IF v_config IS NULL THEN v_config := '{"mappings": {}, "fields": []}'::jsonb; END IF;
  IF v_config->'mappings' IS NULL THEN v_config := jsonb_set(v_config, '{mappings}', '{}'::jsonb); END IF;
  IF v_config->'fields' IS NULL OR jsonb_array_length(v_config->'fields') = 0 THEN
    v_config := jsonb_set(v_config, '{fields}', '[{"id":"company","label":"Company Name","type":"text","icon":"Type","placeholder":"e.g. A to Z Prints"},{"id":"address","label":"Office Address","type":"textarea","icon":"MapPin","placeholder":"Enter official address..."},{"id":"phone","label":"Phone","type":"text","icon":"Phone","placeholder":"+91 XXXXX XXXXX"},{"id":"email","label":"Email","type":"email","icon":"Mail","placeholder":"info@company.com"}]'::jsonb);
  END IF;
  FOR i IN 0..29 LOOP
    DECLARE
      v_idx INT := jsonb_array_length(v_variants);
      v_folder TEXT := LPAD((11 + i)::text, 2, '0');
      v_name TEXT := 'Elite Design ' || (11 + i)::text;
      v_hex TEXT := CASE (i % 10) 
        WHEN 0 THEN '#0F172A'
        WHEN 1 THEN '#1E3A8A'
        WHEN 2 THEN '#111827'
        WHEN 3 THEN '#EC4899'
        WHEN 4 THEN '#0D9488'
        WHEN 5 THEN '#F97316'
        WHEN 6 THEN '#8B5CF6'
        WHEN 7 THEN '#EF4444'
        WHEN 8 THEN '#059669'
        WHEN 9 THEN '#44403C'
      END;
      v_wireframes JSONB;
    BEGIN
      v_wireframes := jsonb_build_array('/templates/lh/' || v_folder || '/front.svg');
      v_variants := v_variants || jsonb_build_object('name', v_name, 'hex', v_hex, 'wireframe_images', v_wireframes);
      v_config := jsonb_set(v_config, ARRAY['mappings', v_idx::text || '_0'], '{"company": {"x": 50, "y": 8, "fontSize": 32, "fontWeight": "bold", "align": "center"}, "address": {"x": 50, "y": 96, "fontSize": 10, "fontWeight": "normal", "align": "center"}, "phone": {"x": 30, "y": 96, "fontSize": 10, "fontWeight": "normal", "align": "left"}, "email": {"x": 70, "y": 96, "fontSize": 10, "fontWeight": "normal", "align": "right"}, "logo": {"x": 10, "y": 6, "w": 6, "h": 6}}'::jsonb);
    END;
  END LOOP;
  UPDATE products SET color_variants = v_variants, design_config = v_config, design_mode = 'template_form' WHERE slug = 'letter-head-custom';
END $$;

