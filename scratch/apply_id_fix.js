const fs = require('fs');

const MAPPINGS = [
  // 0: Minimalist (Left Sidebar 25%) - Align text to the Right Pane (Center: 62.5%)
  {
    front: {
      logo: { x: 50, y: 8, w: 12, h: 8, type: 'image', align: 'center' },
      company_name: { x: 28, y: 8, fontSize: 24, fontWeight: 'bold', align: 'left' },
      photo: { x: 42.5, y: 21, w: 40, h: 28, type: 'image', align: 'center' }, // Centered in right pane
      name: { x: 62.5, y: 58, fontSize: 36, fontWeight: 'bold', align: 'center' },
      designation: { x: 62.5, y: 66, fontSize: 20, fontWeight: 'normal', align: 'center' },
      id_no: { x: 62.5, y: 76, fontSize: 18, fontWeight: 'bold', align: 'center' }
    }
  },
  // 1: Tech (Circular centered at 50%)
  {
    front: {
      logo: { x: 42, y: 6, w: 16, h: 8, type: 'image', align: 'center' },
      company_name: { x: 50, y: 16, fontSize: 22, fontWeight: 'bold', align: 'center' },
      photo: { x: 30, y: 20, w: 40, h: 28, type: 'image', align: 'center' },
      name: { x: 50, y: 62, fontSize: 34, fontWeight: 'bold', align: 'center' },
      designation: { x: 50, y: 70, fontSize: 18, fontWeight: 'normal', align: 'center' },
      id_no: { x: 50, y: 82, fontSize: 20, fontWeight: 'bold', align: 'center', color: '#F59E0B' }
    }
  },
  // 2: Creative (Photo at 6.25%)
  {
    front: {
      logo: { x: 5, y: 5, w: 12, h: 8, type: 'image', align: 'left' },
      company_name: { x: 20, y: 9, fontSize: 26, fontWeight: 'bold', align: 'left', color: '#FFFFFF' },
      photo: { x: 6.25, y: 29.5, w: 43.75, h: 29.5, type: 'image', align: 'center' },
      name: { x: 55, y: 42, fontSize: 38, fontWeight: 'bold', align: 'left' },
      designation: { x: 55, y: 50, fontSize: 20, fontWeight: 'normal', align: 'left' },
      id_no: { x: 55, y: 60, fontSize: 18, fontWeight: 'bold', align: 'left' }
    }
  },
  // 3: Corporate (Classic Center)
  {
    front: {
      logo: { x: 40, y: 8, w: 20, h: 10, type: 'image', align: 'center' },
      company_name: { x: 50, y: 20, fontSize: 24, fontWeight: 'bold', align: 'center' },
      photo: { x: 31, y: 23, w: 38, h: 28, type: 'image', align: 'center' },
      name: { x: 50, y: 60, fontSize: 34, fontWeight: 'bold', align: 'center' },
      designation: { x: 50, y: 68, fontSize: 18, fontWeight: 'normal', align: 'center' },
      id_no: { x: 50, y: 78, fontSize: 18, fontWeight: 'bold', align: 'center' }
    }
  },
  // 4: Abstract (Centered Fluid)
  {
    front: {
      logo: { x: 10, y: 6, w: 12, h: 8, type: 'image', align: 'left' },
      company_name: { x: 50, y: 15, fontSize: 24, fontWeight: 'bold', align: 'center' },
      photo: { x: 22, y: 25, w: 56, h: 33, type: 'image', align: 'center' },
      name: { x: 50, y: 66, fontSize: 38, fontWeight: 'bold', align: 'center' },
      designation: { x: 50, y: 74, fontSize: 20, fontWeight: 'normal', align: 'center' },
      id_no: { x: 50, y: 84, fontSize: 18, fontWeight: 'bold', align: 'center' }
    }
  }
];

const BACK_MAPPING = {
  phone: { x: 50, y: 15, fontSize: 16, fontWeight: 'normal', align: 'center' },
  email: { x: 50, y: 22, fontSize: 16, fontWeight: 'normal', align: 'center' },
  blood_group: { x: 50, y: 35, fontSize: 18, fontWeight: 'bold', align: 'center' },
  emergency: { x: 50, y: 45, fontSize: 16, fontWeight: 'normal', align: 'center' },
  address: { x: 50, y: 62, fontSize: 14, fontWeight: 'normal', align: 'center', maxWidth: 85 },
  qr_code: { x: 34, y: 75, w: 32, h: 20, type: 'image', align: 'center' }
};

const idFields = [
  { id: 'logo', label: 'Company Logo', type: 'image', placeholder: '/placeholder-logo.png' },
  { id: 'company_name', label: 'Company Name', type: 'text', placeholder: 'TECH SOLUTIONS INC.' },
  { id: 'photo', label: 'Employee Photo', type: 'image', placeholder: '/placeholder-photo.png' },
  { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Johnathan Doe' },
  { id: 'designation', label: 'Designation', type: 'text', placeholder: 'Senior Software Engineer' },
  { id: 'id_no', label: 'Employee ID', type: 'text', placeholder: 'EMP-2024-001' },
  { id: 'phone', label: 'Mobile No.', type: 'text', placeholder: '+91 98765 43210' },
  { id: 'email', label: 'Email ID', type: 'text', placeholder: 'john.doe@company.com' },
  { id: 'blood_group', label: 'Blood Group', type: 'text', placeholder: 'B+ Positive' },
  { id: 'emergency', label: 'Emergency Contact', type: 'text', placeholder: 'Mrs. Jane Doe: +91 99999 88888' },
  { id: 'address', label: 'Full Address', type: 'textarea', placeholder: 'B-42, Corporate Park, Sector 62, Noida, UP' },
  { id: 'qr_code', label: 'QR Code/Signature', type: 'image', placeholder: '/placeholder-qr.png' }
];

const STYLES = ['Minimalist', 'Tech', 'Creative', 'Corporate', 'Abstract'];

let sql = `-- Fix ID Card Templates (V4 Strict Pixel-Perfect Alignment)\n\n`;
sql += `DO $$\n`;
sql += `DECLARE\n`;
sql += `  v_variants JSONB := '[]'::jsonb;\n`;
sql += `  v_config JSONB;\n`;
sql += `BEGIN\n`;

for (let i = 0; i < 30; i++) {
  const idx = 11 + i;
  const folder = idx.toString().padStart(2, '0');
  const styleName = STYLES[i % STYLES.length];
  const wireframes = `jsonb_build_array('/templates/id/${folder}/front.svg', '/templates/id/${folder}/back.svg')`;
  sql += `  v_variants := v_variants || jsonb_build_object('name', '${styleName} Elite ${idx}', 'hex', '#1E3A8A', 'wireframe_images', ${wireframes});\n`;
  
  const mapping = MAPPINGS[i % MAPPINGS.length];
  sql += `  v_config := jsonb_set(COALESCE(v_config, '{"mappings": {}}'::jsonb), ARRAY['mappings', ${i}::text || '_0'], '${JSON.stringify(mapping.front)}'::jsonb);\n`;
  sql += `  v_config := jsonb_set(v_config, ARRAY['mappings', ${i}::text || '_1'], '${JSON.stringify(BACK_MAPPING)}'::jsonb);\n`;
}

sql += `  v_config := jsonb_set(v_config, '{fields}', '${JSON.stringify(idFields)}'::jsonb);\n`;
sql += `  UPDATE products SET color_variants = v_variants, design_config = v_config, design_mode = 'template_form' WHERE slug = 'id-card-custom';\n`;
sql += `END $$;\n`;

fs.writeFileSync('supabase/migrations/20260506000003_fix_id_templates.sql', sql);

// Update mock locally
const mockPath = 'src/lib/data/mockProducts.ts';
let mockContent = fs.readFileSync(mockPath, 'utf8');
const regex = /export const mockProducts: Product\[\] = (\[[\s\S]*?\]);/;
let products = JSON.parse(mockContent.match(regex)[1]);
const idProduct = products.find(p => p.slug === 'id-card-custom');
if (idProduct) {
  idProduct.color_variants = [];
  idProduct.design_config = { mappings: {}, fields: idFields };
  idProduct.design_mode = 'template_form';
  for (let i = 0; i < 30; i++) {
    const idx = 11 + i;
    const folder = idx.toString().padStart(2, '0');
    const styleName = STYLES[i % STYLES.length];
    idProduct.color_variants.push({
      name: `${styleName} Elite ${idx}`,
      hex: '#1E3A8A',
      wireframe_images: [`/templates/id/${folder}/front.svg`, `/templates/id/${folder}/back.svg`]
    });
    idProduct.design_config.mappings[`${i}_0`] = MAPPINGS[i % MAPPINGS.length].front;
    idProduct.design_config.mappings[`${i}_1`] = BACK_MAPPING;
  }
}
mockContent = mockContent.replace(regex, `export const mockProducts: Product[] = ${JSON.stringify(products, null, 2)};`);
fs.writeFileSync(mockPath, mockContent);
console.log('ID Card Fix V4 Strict Alignment Applied.');
