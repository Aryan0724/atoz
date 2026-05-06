const fs = require('fs');

const MAPPINGS = [
  // 0: Luxury (Centered)
  {
    front: {
      logo: { x: 44, y: 20, w: 12, h: 20, type: 'image', align: 'center' },
      company: { x: 50, y: 45, fontSize: 28, fontWeight: 'bold', align: 'center', color: '#D4AF37' },
      name: { x: 50, y: 65, fontSize: 36, fontWeight: 'bold', align: 'center' },
      title: { x: 50, y: 75, fontSize: 18, fontWeight: 'normal', align: 'center', opacity: 0.8 }
    },
    back: {
      phone: { x: 10, y: 30, fontSize: 16, fontWeight: 'normal', align: 'left' },
      email: { x: 10, y: 40, fontSize: 16, fontWeight: 'normal', align: 'left' },
      website: { x: 10, y: 50, fontSize: 16, fontWeight: 'normal', align: 'left' },
      address: { x: 10, y: 70, fontSize: 14, fontWeight: 'normal', align: 'left', maxWidth: 60 }
    }
  },
  // 1: Split (Sidebar Logo)
  {
    front: {
      logo: { x: 8, y: 40, w: 15, h: 25, type: 'image', align: 'center' },
      company: { x: 40, y: 30, fontSize: 24, fontWeight: 'bold', align: 'left' },
      name: { x: 40, y: 55, fontSize: 42, fontWeight: 'bold', align: 'left' },
      title: { x: 40, y: 68, fontSize: 20, fontWeight: 'normal', align: 'left' }
    },
    back: {
      phone: { x: 50, y: 40, fontSize: 18, fontWeight: 'normal', align: 'center' },
      email: { x: 50, y: 50, fontSize: 18, fontWeight: 'normal', align: 'center' },
      address: { x: 50, y: 75, fontSize: 16, fontWeight: 'normal', align: 'center' }
    }
  },
  // 2: Tech (Right Aligned Logo)
  {
    front: {
      logo: { x: 80, y: 15, w: 12, h: 20, type: 'image', align: 'center' },
      company: { x: 10, y: 15, fontSize: 22, fontWeight: 'bold', align: 'left', color: '#10B981' },
      name: { x: 10, y: 55, fontSize: 40, fontWeight: 'bold', align: 'left' },
      title: { x: 10, y: 68, fontSize: 20, fontWeight: 'normal', align: 'left' }
    },
    back: {
      phone: { x: 90, y: 30, fontSize: 16, fontWeight: 'normal', align: 'right' },
      email: { x: 90, y: 40, fontSize: 16, fontWeight: 'normal', align: 'right' },
      address: { x: 90, y: 65, fontSize: 14, fontWeight: 'normal', align: 'right', maxWidth: 50 }
    }
  },
  // 3: Creative (Circle Style)
  {
    front: {
      logo: { x: 11, y: 20, w: 10, h: 18, type: 'image', align: 'center' },
      company: { x: 10, y: 45, fontSize: 24, fontWeight: 'bold', align: 'left' },
      name: { x: 50, y: 40, fontSize: 44, fontWeight: 'bold', align: 'center' },
      title: { x: 50, y: 55, fontSize: 22, fontWeight: 'normal', align: 'center' }
    },
    back: {
      phone: { x: 50, y: 30, fontSize: 18, fontWeight: 'normal', align: 'center' },
      email: { x: 50, y: 45, fontSize: 18, fontWeight: 'normal', align: 'center' },
      address: { x: 50, y: 70, fontSize: 16, fontWeight: 'normal', align: 'center' }
    }
  },
  // 4: Industrial (Modern Angular)
  {
    front: {
      logo: { x: 44, y: 35, w: 12, h: 20, type: 'image', align: 'center' },
      company: { x: 50, y: 12, fontSize: 26, fontWeight: 'bold', align: 'center', color: '#FFFFFF' },
      name: { x: 50, y: 68, fontSize: 38, fontWeight: 'bold', align: 'center' },
      title: { x: 50, y: 78, fontSize: 18, fontWeight: 'normal', align: 'center' }
    },
    back: {
      phone: { x: 10, y: 75, fontSize: 16, fontWeight: 'normal', align: 'left' },
      email: { x: 10, y: 85, fontSize: 16, fontWeight: 'normal', align: 'left' },
      address: { x: 90, y: 80, fontSize: 14, fontWeight: 'normal', align: 'right', maxWidth: 40 }
    }
  }
];

const bcFields = [
  { id: 'logo', label: 'Business Logo', type: 'image', placeholder: '/placeholder-logo.png' },
  { id: 'company', label: 'Company Name', type: 'text', placeholder: 'A to Z Prints' },
  { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Aryan Sharma' },
  { id: 'title', label: 'Job Title', type: 'text', placeholder: 'Founder & CEO' },
  { id: 'phone', label: 'Phone Number', type: 'text', placeholder: '+91 98765 43210' },
  { id: 'email', label: 'Email Address', type: 'text', placeholder: 'aryan@atozprints.com' },
  { id: 'website', label: 'Website URL', type: 'text', placeholder: 'www.atozprints.com' },
  { id: 'address', label: 'Office Address', type: 'textarea', placeholder: '123, Print Street, Delhi, India' }
];

const STYLES = ['Luxury', 'Split', 'Tech', 'Creative', 'Industrial'];

let sql = `-- Fix Business Card Templates (V2 Unique Architectural Layouts)\n\n`;
sql += `DO $$\n`;
sql += `DECLARE\n`;
sql += `  v_variants JSONB := '[]'::jsonb;\n`;
sql += `  v_config JSONB;\n`;
sql += `BEGIN\n`;

for (let i = 0; i < 30; i++) {
  const idx = 11 + i;
  const folder = idx.toString().padStart(2, '0');
  const styleName = STYLES[i % STYLES.length];
  const wireframes = `jsonb_build_array('/templates/bc/${folder}/front.svg', '/templates/bc/${folder}/back.svg')`;
  sql += `  v_variants := v_variants || jsonb_build_object('name', '${styleName} Elite ${idx}', 'hex', '#1A1A1A', 'wireframe_images', ${wireframes});\n`;
  
  const mapping = MAPPINGS[i % MAPPINGS.length];
  sql += `  v_config := jsonb_set(COALESCE(v_config, '{"mappings": {}}'::jsonb), ARRAY['mappings', ${i}::text || '_0'], '${JSON.stringify(mapping.front)}'::jsonb);\n`;
  sql += `  v_config := jsonb_set(v_config, ARRAY['mappings', ${i}::text || '_1'], '${JSON.stringify(mapping.back)}'::jsonb);\n`;
}

sql += `  v_config := jsonb_set(v_config, '{fields}', '${JSON.stringify(bcFields)}'::jsonb);\n`;
sql += `  UPDATE products SET color_variants = v_variants, design_config = v_config, design_mode = 'template_form' WHERE slug = 'business-card-custom';\n`;
sql += `END $$;\n`;

fs.writeFileSync('supabase/migrations/20260506000004_fix_bc_templates.sql', sql);

// Update mock locally
const mockPath = 'src/lib/data/mockProducts.ts';
let mockContent = fs.readFileSync(mockPath, 'utf8');
const regex = /export const mockProducts: Product\[\] = (\[[\s\S]*?\]);/;
let products = JSON.parse(mockContent.match(regex)[1]);
const bcProduct = products.find(p => p.slug === 'business-card-custom');
if (bcProduct) {
  bcProduct.color_variants = [];
  bcProduct.design_config = { mappings: {}, fields: bcFields };
  bcProduct.design_mode = 'template_form';
  for (let i = 0; i < 30; i++) {
    const idx = 11 + i;
    const folder = idx.toString().padStart(2, '0');
    const styleName = STYLES[i % STYLES.length];
    bcProduct.color_variants.push({
      name: `${styleName} Elite ${idx}`,
      hex: '#1A1A1A',
      wireframe_images: [`/templates/bc/${folder}/front.svg`, `/templates/bc/${folder}/back.svg`]
    });
    bcProduct.design_config.mappings[`${i}_0`] = MAPPINGS[i % MAPPINGS.length].front;
    bcProduct.design_config.mappings[`${i}_1`] = MAPPINGS[i % MAPPINGS.length].back;
  }
}
mockContent = mockContent.replace(regex, `export const mockProducts: Product[] = ${JSON.stringify(products, null, 2)};`);
fs.writeFileSync(mockPath, mockContent);
console.log('Business Card Fix Applied Locally.');
