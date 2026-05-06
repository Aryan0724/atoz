const fs = require('fs');

const MAPPINGS = [
  // 0: Executive (Centered Header)
  {
    front: {
      logo: { x: 44, y: 5, w: 12, h: 8, type: 'image', align: 'center' },
      company: { x: 50, y: 15, fontSize: 32, fontWeight: 'bold', align: 'center' },
      tagline: { x: 50, y: 20, fontSize: 16, fontWeight: 'normal', align: 'center', opacity: 0.7 },
      phone: { x: 20, y: 95, fontSize: 12, fontWeight: 'normal', align: 'left' },
      email: { x: 50, y: 95, fontSize: 12, fontWeight: 'normal', align: 'center' },
      address: { x: 80, y: 95, fontSize: 12, fontWeight: 'normal', align: 'right' }
    }
  },
  // 1: Sidebar (Left Aligned)
  {
    front: {
      logo: { x: 5, y: 5, w: 10, h: 7, type: 'image', align: 'left' },
      company: { x: 18, y: 8, fontSize: 28, fontWeight: 'bold', align: 'left' },
      tagline: { x: 18, y: 13, fontSize: 14, fontWeight: 'normal', align: 'left' },
      address: { x: 5, y: 93, fontSize: 11, fontWeight: 'normal', align: 'left' },
      phone: { x: 5, y: 96, fontSize: 11, fontWeight: 'normal', align: 'left' },
      email: { x: 30, y: 96, fontSize: 11, fontWeight: 'normal', align: 'left' }
    }
  },
  // 2: Tech (Right Aligned Header)
  {
    front: {
      logo: { x: 80, y: 5, w: 15, h: 10, type: 'image', align: 'right' },
      company: { x: 10, y: 8, fontSize: 30, fontWeight: 'bold', align: 'left' },
      tagline: { x: 10, y: 14, fontSize: 16, fontWeight: 'normal', align: 'left', opacity: 0.6 },
      address: { x: 90, y: 94, fontSize: 12, fontWeight: 'normal', align: 'right' },
      phone: { x: 90, y: 96, fontSize: 12, fontWeight: 'normal', align: 'right' }
    }
  },
  // 3: Artistic (Corner accents)
  {
    front: {
      logo: { x: 8, y: 8, w: 12, h: 8, type: 'image', align: 'left' },
      company: { x: 50, y: 10, fontSize: 34, fontWeight: 'bold', align: 'center' },
      tagline: { x: 50, y: 16, fontSize: 18, fontWeight: 'normal', align: 'center' },
      address: { x: 50, y: 92, fontSize: 14, fontWeight: 'normal', align: 'center' },
      email: { x: 50, y: 96, fontSize: 14, fontWeight: 'normal', align: 'center' }
    }
  },
  // 4: Industrial (Modern Grid)
  {
    front: {
      logo: { x: 8, y: 6, w: 10, h: 6, type: 'image', align: 'left' },
      company: { x: 50, y: 8, fontSize: 26, fontWeight: 'bold', align: 'center' },
      tagline: { x: 90, y: 8, fontSize: 14, fontWeight: 'normal', align: 'right' },
      address: { x: 50, y: 95, fontSize: 12, fontWeight: 'bold', align: 'center' }
    }
  }
];

const lhFields = [
  { id: 'logo', label: 'Company Logo', type: 'image', placeholder: '/placeholder-logo.png' },
  { id: 'company', label: 'Company Name', type: 'text', placeholder: 'A to Z Prints' },
  { id: 'tagline', label: 'Business Tagline', type: 'text', placeholder: 'Your Vision, Our Print' },
  { id: 'phone', label: 'Contact Phone', type: 'text', placeholder: '+91 98765 43210' },
  { id: 'email', label: 'Official Email', type: 'text', placeholder: 'contact@atozprints.com' },
  { id: 'website', label: 'Website', type: 'text', placeholder: 'www.atozprints.com' },
  { id: 'address', label: 'Company Address', type: 'textarea', placeholder: 'B-42, Corporate Park, Sector 62, Noida, UP' },
  { id: 'reg_info', label: 'Registration/Tax ID', type: 'text', placeholder: 'GSTIN: 09AAAAA0000A1Z5' }
];

const STYLES = ['Executive', 'Sidebar', 'Tech', 'Artistic', 'Industrial'];

let sql = `-- Fix Letterhead Templates (V2 Unique Architectural Layouts)\n\n`;
sql += `DO $$\n`;
sql += `DECLARE\n`;
sql += `  v_variants JSONB := '[]'::jsonb;\n`;
sql += `  v_config JSONB;\n`;
sql += `BEGIN\n`;

for (let i = 0; i < 30; i++) {
  const idx = 11 + i;
  const folder = idx.toString().padStart(2, '0');
  const styleName = STYLES[i % STYLES.length];
  const wireframes = `jsonb_build_array('/templates/lh/${folder}/front.svg', '/templates/lh/${folder}/back.svg')`;
  sql += `  v_variants := v_variants || jsonb_build_object('name', '${styleName} Elite ${idx}', 'hex', '#F3F4F6', 'wireframe_images', ${wireframes});\n`;
  
  const mapping = MAPPINGS[i % MAPPINGS.length];
  sql += `  v_config := jsonb_set(COALESCE(v_config, '{"mappings": {}}'::jsonb), ARRAY['mappings', ${i}::text || '_0'], '${JSON.stringify(mapping.front)}'::jsonb);\n`;
  sql += `  v_config := jsonb_set(v_config, ARRAY['mappings', ${i}::text || '_1'], '{"back_pattern":{"x":50,"y":50,"fontSize":40,"opacity":0.05,"align":"center"}}'::jsonb);\n`;
}

sql += `  v_config := jsonb_set(v_config, '{fields}', '${JSON.stringify(lhFields)}'::jsonb);\n`;
sql += `  UPDATE products SET color_variants = v_variants, design_config = v_config, design_mode = 'template_form' WHERE slug = 'letter-head-custom';\n`;
sql += `END $$;\n`;

fs.writeFileSync('supabase/migrations/20260506000005_fix_lh_templates.sql', sql);

// Update mock locally
const mockPath = 'src/lib/data/mockProducts.ts';
let mockContent = fs.readFileSync(mockPath, 'utf8');
const regex = /export const mockProducts: Product\[\] = (\[[\s\S]*?\]);/;
let products = JSON.parse(mockContent.match(regex)[1]);
const lhProduct = products.find(p => p.slug === 'letter-head-custom');
if (lhProduct) {
  lhProduct.color_variants = [];
  lhProduct.design_config = { mappings: {}, fields: lhFields };
  lhProduct.design_mode = 'template_form';
  for (let i = 0; i < 30; i++) {
    const idx = 11 + i;
    const folder = idx.toString().padStart(2, '0');
    const styleName = STYLES[i % STYLES.length];
    lhProduct.color_variants.push({
      name: `${styleName} Elite ${idx}`,
      hex: '#F3F4F6',
      wireframe_images: [`/templates/lh/${folder}/front.svg`, `/templates/lh/${folder}/back.svg`]
    });
    lhProduct.design_config.mappings[`${i}_0`] = MAPPINGS[i % MAPPINGS.length].front;
    lhProduct.design_config.mappings[`${i}_1`] = { back_pattern: { x: 50, y: 50, fontSize: 40, opacity: 0.05, align: 'center' } };
  }
}
mockContent = mockContent.replace(regex, `export const mockProducts: Product[] = ${JSON.stringify(products, null, 2)};`);
fs.writeFileSync(mockPath, mockContent);
console.log('Letterhead Fix Applied Locally.');
