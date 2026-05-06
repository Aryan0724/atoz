const COLORS = [
  '#0F172A', '#1E3A8A', '#111827', '#EC4899', '#0D9488', '#F97316', '#8B5CF6', '#EF4444', '#059669', '#44403C'
];

const PRODUCTS = [
  { slug: 'business-card-custom', type: 'bc', name: 'Elite Business Card', start: 31, count: 30 },
  { slug: 'id-card-custom', type: 'id', name: 'Elite ID Card', start: 11, count: 30 },
  { slug: 'wedding-card-custom', type: 'wc', name: 'Elite Wedding Card', start: 11, count: 30 },
  { slug: 'letter-head-custom', type: 'lh', name: 'Elite Letterhead', start: 11, count: 30 }
];

const MAPPINGS = {
  bc: (idx) => ({
    [`${idx}_0`]: {
      name: { x: 50, y: 45, fontSize: 30, fontWeight: 'bold', align: 'center' },
      title: { x: 50, y: 55, fontSize: 16, fontWeight: 'normal', align: 'center' },
      phone: { x: 50, y: 75, fontSize: 12, fontWeight: 'normal', align: 'center' },
      email: { x: 50, y: 82, fontSize: 12, fontWeight: 'normal', align: 'center' },
      logo: { x: 8, y: 14, w: 4, h: 7 }
    }
  }),
  id: (idx) => ({
    [`${idx}_0`]: {
      name: { x: 50, y: 62, fontSize: 32, fontWeight: 'bold', align: 'center' },
      id_no: { x: 50, y: 70, fontSize: 16, fontWeight: 'normal', align: 'center' },
      designation: { x: 50, y: 76, fontSize: 14, fontWeight: 'bold', align: 'center' },
      logo: { x: 42, y: 6, w: 16, h: 9 }
    }
  }),
  wc: (idx) => ({
    [`${idx}_0`]: {
      groom: { x: 50, y: 35, fontSize: 36, fontWeight: 'bold', align: 'center' },
      bride: { x: 50, y: 48, fontSize: 36, fontWeight: 'bold', align: 'center' },
      date: { x: 50, y: 60, fontSize: 18, fontWeight: 'normal', align: 'center' },
      venue: { x: 50, y: 75, fontSize: 14, fontWeight: 'normal', align: 'center' }
    }
  }),
  lh: (idx) => ({
    [`${idx}_0`]: {
      company: { x: 50, y: 8, fontSize: 32, fontWeight: 'bold', align: 'center' },
      address: { x: 50, y: 96, fontSize: 10, fontWeight: 'normal', align: 'center' },
      phone: { x: 30, y: 96, fontSize: 10, fontWeight: 'normal', align: 'left' },
      email: { x: 70, y: 96, fontSize: 10, fontWeight: 'normal', align: 'right' },
      logo: { x: 10, y: 6, w: 6, h: 6 }
    }
  })
};

const FIELDS = {
  id: [
    { id: 'name', label: 'Employee Name', type: 'text', icon: 'User', placeholder: 'e.g. Vikram Malhotra' },
    { id: 'id_no', label: 'Employee ID', type: 'text', icon: 'Type', placeholder: 'e.g. AZ-2026-001' },
    { id: 'designation', label: 'Designation', type: 'text', icon: 'Briefcase', placeholder: 'e.g. Senior Developer' }
  ],
  wc: [
    { id: 'groom', label: 'Groom Name', type: 'text', icon: 'User', placeholder: 'e.g. Rahul' },
    { id: 'bride', label: 'Bride Name', type: 'text', icon: 'User', placeholder: 'e.g. Ananya' },
    { id: 'date', label: 'Date', type: 'text', icon: 'Calendar', placeholder: 'e.g. 15th Dec 2026' },
    { id: 'venue', label: 'Venue', type: 'textarea', icon: 'MapPin', placeholder: 'Enter venue address...' }
  ],
  lh: [
    { id: 'company', label: 'Company Name', type: 'text', icon: 'Type', placeholder: 'e.g. A to Z Prints' },
    { id: 'address', label: 'Office Address', type: 'textarea', icon: 'MapPin', placeholder: 'Enter official address...' },
    { id: 'phone', label: 'Phone', type: 'text', icon: 'Phone', placeholder: '+91 XXXXX XXXXX' },
    { id: 'email', label: 'Email', type: 'email', icon: 'Mail', placeholder: 'info@company.com' }
  ]
};

let sql = `-- Add 30 Elite Templates Migration\n\n`;

for (const p of PRODUCTS) {
  sql += `-- Updating ${p.name}\n`;
  sql += `DO $$\n`;
  sql += `DECLARE\n`;
  sql += `  v_variants JSONB;\n`;
  sql += `  v_config JSONB;\n`;
  sql += `  v_new_variants JSONB := '[]'::jsonb;\n`;
  sql += `  v_mappings JSONB := '{}'::jsonb;\n`;
  sql += `BEGIN\n`;
  sql += `  SELECT color_variants, design_config INTO v_variants, v_config FROM products WHERE slug = '${p.slug}';\n`;
  sql += `  IF v_variants IS NULL THEN v_variants := '[]'::jsonb; END IF;\n`;
  sql += `  IF v_config IS NULL THEN v_config := '{"mappings": {}, "fields": []}'::jsonb; END IF;\n`;
  sql += `  IF v_config->'mappings' IS NULL THEN v_config := jsonb_set(v_config, '{mappings}', '{}'::jsonb); END IF;\n`;
  
  // Add fields if missing
  if (FIELDS[p.type]) {
    sql += `  IF v_config->'fields' IS NULL OR jsonb_array_length(v_config->'fields') = 0 THEN\n`;
    sql += `    v_config := jsonb_set(v_config, '{fields}', '${JSON.stringify(FIELDS[p.type])}'::jsonb);\n`;
    sql += `  END IF;\n`;
  }

  // Generate new variants and mappings in JS to make it easier
  const newVariants = [];
  const newMappings = {};
  
  for (let i = 0; i < p.count; i++) {
    const idx = p.start + i;
    const folderName = idx.toString().padStart(2, '0');
    // We don't know the exact starting index in v_variants, so we'll do it in SQL
  }

  // Actually, it's easier to just do the whole thing in SQL loop
  sql += `  FOR i IN 0..${p.count - 1} LOOP\n`;
  sql += `    DECLARE\n`;
  sql += `      v_idx INT := jsonb_array_length(v_variants);\n`;
  sql += `      v_folder TEXT := LPAD((${p.start} + i)::text, 2, '0');\n`;
  sql += `      v_name TEXT := 'Elite Design ' || (${p.start} + i)::text;\n`;
  sql += `      v_hex TEXT := CASE (i % 10) \n`;
  COLORS.forEach((c, idx) => { sql += `        WHEN ${idx} THEN '${c}'\n`; });
  sql += `      END;\n`;
  sql += `      v_wireframes JSONB;\n`;
  sql += `    BEGIN\n`;
  if (p.type === 'bc') {
    sql += `      v_wireframes := jsonb_build_array('/templates/${p.type}/' || v_folder || '/front.svg', '/templates/${p.type}/' || v_folder || '/back.svg');\n`;
  } else {
    sql += `      v_wireframes := jsonb_build_array('/templates/${p.type}/' || v_folder || '/front.svg');\n`;
  }
  sql += `      v_variants := v_variants || jsonb_build_object('name', v_name, 'hex', v_hex, 'wireframe_images', v_wireframes);\n`;
  
  // Mappings for each category
  if (p.type === 'bc') {
    sql += `      v_config := jsonb_set(v_config, ARRAY['mappings', v_idx::text || '_0'], '{"name": {"x": 50, "y": 45, "fontSize": 30, "fontWeight": "bold", "align": "center"}, "title": {"x": 50, "y": 55, "fontSize": 16, "fontWeight": "normal", "align": "center"}, "phone": {"x": 50, "y": 75, "fontSize": 12, "fontWeight": "normal", "align": "center"}, "email": {"x": 50, "y": 82, "fontSize": 12, "fontWeight": "normal", "align": "center"}, "logo": {"x": 8, "y": 14, "w": 4, "h": 7}}'::jsonb);\n`;
  } else if (p.type === 'id') {
    sql += `      v_config := jsonb_set(v_config, ARRAY['mappings', v_idx::text || '_0'], '{"name": {"x": 50, "y": 62, "fontSize": 32, "fontWeight": "bold", "align": "center"}, "id_no": {"x": 50, "y": 70, "fontSize": 16, "fontWeight": "normal", "align": "center"}, "designation": {"x": 50, "y": 76, "fontSize": 14, "fontWeight": "bold", "align": "center"}, "logo": {"x": 42, "y": 6, "w": 16, "h": 9}}'::jsonb);\n`;
  } else if (p.type === 'wc') {
    sql += `      v_config := jsonb_set(v_config, ARRAY['mappings', v_idx::text || '_0'], '{"groom": {"x": 50, "y": 35, "fontSize": 36, "fontWeight": "bold", "align": "center"}, "bride": {"x": 50, "y": 48, "fontSize": 36, "fontWeight": "bold", "align": "center"}, "date": {"x": 50, "y": 60, "fontSize": 18, "fontWeight": "normal", "align": "center"}, "venue": {"x": 50, "y": 75, "fontSize": 14, "fontWeight": "normal", "align": "center"}}'::jsonb);\n`;
  } else if (p.type === 'lh') {
    sql += `      v_config := jsonb_set(v_config, ARRAY['mappings', v_idx::text || '_0'], '{"company": {"x": 50, "y": 8, "fontSize": 32, "fontWeight": "bold", "align": "center"}, "address": {"x": 50, "y": 96, "fontSize": 10, "fontWeight": "normal", "align": "center"}, "phone": {"x": 30, "y": 96, "fontSize": 10, "fontWeight": "normal", "align": "left"}, "email": {"x": 70, "y": 96, "fontSize": 10, "fontWeight": "normal", "align": "right"}, "logo": {"x": 10, "y": 6, "w": 6, "h": 6}}'::jsonb);\n`;
  }
  
  sql += `    END;\n`;
  sql += `  END LOOP;\n`;

  sql += `  UPDATE products SET color_variants = v_variants, design_config = v_config, design_mode = 'template_form' WHERE slug = '${p.slug}';\n`;
  sql += `END $$;\n\n`;
}

require('fs').writeFileSync('supabase/migrations/20260506000000_add_30_elite_templates.sql', sql);
console.log('Migration generated.');
