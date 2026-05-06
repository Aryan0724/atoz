const fs = require('fs');

const CATEGORIES = {
  bc: { slug: 'business-card-custom', start: 31, count: 30 },
  id: { slug: 'id-card-custom', start: 11, count: 30 },
  wc: { slug: 'wedding-card-custom', start: 11, count: 30 },
  lh: { slug: 'letter-head-custom', start: 11, count: 30 }
};

const mappingsData = JSON.parse(fs.readFileSync('scratch/template_mappings_v2.json', 'utf8'));

let sql = `-- Add 30 Elite Templates Migration V2 (Corrected Syntax)\n\n`;

for (const [type, cat] of Object.entries(CATEGORIES)) {
  sql += `-- Updating ${cat.slug}\n`;
  sql += `DO $$\n`;
  sql += `DECLARE\n`;
  sql += `  v_variants JSONB := '[]'::jsonb;\n`;
  sql += `  v_mappings JSONB := '{}'::jsonb;\n`;
  sql += `  v_config JSONB;\n`;
  sql += `BEGIN\n`;
  
  sql += `  v_config := '{"mappings": {}, "fields": []}'::jsonb;\n`;

  const items = mappingsData[type];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const idx = cat.start + i;
    const folder = idx.toString().padStart(2, '0');
    const vName = `Premium Elite ${idx}`;
    const vHex = '#000000';
    
    let wireframes = `jsonb_build_array('/templates/${type}/${folder}/front.svg')`;
    if (type === 'bc') wireframes = `jsonb_build_array('/templates/${type}/${folder}/front.svg', '/templates/${type}/${folder}/back.svg')`;

    sql += `  v_variants := v_variants || jsonb_build_object('name', '${vName}', 'hex', '${vHex}', 'wireframe_images', ${wireframes});\n`;
    sql += `  v_config := jsonb_set(v_config, ARRAY['mappings', ${i}::text || '_0'], '${JSON.stringify(item.mapping)}'::jsonb);\n`;
  }

  sql += `  -- Preservation logic\n`;
  sql += `  SELECT design_config INTO v_config FROM products WHERE slug = '${cat.slug}';\n`;
  sql += `  IF v_config IS NULL THEN v_config := '{"fields": []}'::jsonb; END IF;\n`;
  sql += `  IF v_config->'fields' IS NULL OR jsonb_array_length(v_config->'fields') = 0 THEN\n`;
  if (type === 'bc') sql += `    v_config := jsonb_set(v_config, '{fields}', '[{"id": "name", "label": "Full Name", "type": "text"}, {"id": "title", "label": "Job Title", "type": "text"}, {"id": "phone", "label": "Phone", "type": "text"}, {"id": "email", "label": "Email", "type": "text"}]'::jsonb);\n`;
  sql += `  END IF;\n`;

  sql += `  UPDATE products SET color_variants = v_variants, design_config = v_config, design_mode = 'template_form' WHERE slug = '${cat.slug}';\n`;
  sql += `END $$;\n\n`;
}

fs.writeFileSync('supabase/migrations/20260506000001_fix_elite_templates.sql', sql);
console.log('Migration V2 Fixed generated.');
