const fs = require('fs');

const STYLES = ['doli', 'ganesha', 'kalash', 'peacock', 'mandala'];

// FRONT SIDE: Center Aligned, Golden, Clean
const FRONT_MAPPING = {
  mantra: { x: 50, y: 12, fontSize: 24, fontWeight: 'normal', align: 'center', color: '#FFD700', italic: true },
  title: { x: 50, y: 22, fontSize: 48, fontWeight: 'bold', align: 'center', color: '#FFD700' },
  subtitle: { x: 50, y: 32, fontSize: 22, fontWeight: 'normal', align: 'center', color: '#FFD700' },
  groom: { x: 50, y: 48, fontSize: 80, fontWeight: 'bold', align: 'center', color: '#FFD700', fontFamily: 'serif' },
  ampersand: { x: 50, y: 58, fontSize: 40, fontWeight: 'normal', align: 'center', color: '#FFD700' },
  bride: { x: 50, y: 68, fontSize: 80, fontWeight: 'bold', align: 'center', color: '#FFD700', fontFamily: 'serif' },
  date: { x: 50, y: 88, fontSize: 40, fontWeight: 'bold', align: 'center', color: '#FFD700' }
};

// BACK SIDE: Detailed, Informative, Golden
const BACK_MAPPING = {
  invite_body: { x: 50, y: 25, fontSize: 22, fontWeight: 'normal', align: 'center', color: '#FFD700', maxWidth: 80 },
  parents: { x: 50, y: 45, fontSize: 20, fontWeight: 'normal', align: 'center', color: '#FFD700', maxWidth: 85 },
  venue_header: { x: 50, y: 65, fontSize: 24, fontWeight: 'bold', align: 'center', color: '#FFD700' },
  venue: { x: 50, y: 72, fontSize: 20, fontWeight: 'normal', align: 'center', color: '#FFD700', maxWidth: 90 },
  time: { x: 50, y: 85, fontSize: 24, fontWeight: 'bold', align: 'center', color: '#FFD700' },
  rsvp: { x: 15, y: 94, fontSize: 16, fontWeight: 'normal', align: 'left', color: '#FFD700' },
  hashtag: { x: 85, y: 94, fontSize: 16, fontWeight: 'bold', align: 'right', color: '#FFD700' }
};

const wcFields = [
  { id: 'mantra', label: 'Sacred Mantra (Front)', type: 'text', placeholder: '|| Shri Ganeshaya Namah ||' },
  { id: 'title', label: 'Main Title (Front)', type: 'text', placeholder: 'SAVE THE DATE' },
  { id: 'subtitle', label: 'Subtitle (Front)', type: 'text', placeholder: 'THE WEDDING OF' },
  { id: 'groom', label: 'Groom Name (Front)', type: 'text', placeholder: 'Prashant Sharma' },
  { id: 'bride', label: 'Bride Name (Front)', type: 'text', placeholder: 'Anjali Verma' },
  { id: 'date', label: 'Wedding Date (Front)', type: 'text', placeholder: 'SUNDAY, 15TH OCTOBER 2024' },
  { id: 'invite_body', label: 'Invitation Text (Back)', type: 'textarea', placeholder: 'Together with their families, we request the honor of your presence.' },
  { id: 'parents', label: 'Family Details (Back)', type: 'textarea', placeholder: 'Son of Mr. & Mrs. Sharma \n Daughter of Mr. & Mrs. Verma' },
  { id: 'venue_header', label: 'Venue Header (Back)', type: 'text', placeholder: 'LOCATION' },
  { id: 'venue', label: 'Full Address (Back)', type: 'textarea', placeholder: 'The Grand Regency, MG Road, New Delhi' },
  { id: 'time', label: 'Event Time (Back)', type: 'text', placeholder: 'AT 8:00 PM ONWARDS' },
  { id: 'rsvp', label: 'RSVP Info (Back)', type: 'text', placeholder: 'RSVP: +91 9876543210' },
  { id: 'hashtag', label: 'Hashtag (Back)', type: 'text', placeholder: '#PrashantWedsAnjali' }
];

let sql = `-- Fix Wedding Card Templates (V9 Perfect Alignment & Color)\n\n`;
sql += `DO $$\n`;
sql += `DECLARE\n`;
sql += `  v_variants JSONB := '[]'::jsonb;\n`;
sql += `  v_config JSONB;\n`;
sql += `BEGIN\n`;

for (let i = 0; i < 30; i++) {
  const idx = 11 + i;
  const folder = idx.toString().padStart(2, '0');
  const style = STYLES[i % STYLES.length];
  const wireframes = `jsonb_build_array('/templates/wc/${folder}/front.svg', '/templates/wc/${folder}/back.svg')`;
  sql += `  v_variants := v_variants || jsonb_build_object('name', 'Elite ${style.charAt(0).toUpperCase() + style.slice(1)} ${idx}', 'hex', '#D4AF37', 'wireframe_images', ${wireframes});\n`;
  sql += `  v_config := jsonb_set(COALESCE(v_config, '{"mappings": {}}'::jsonb), ARRAY['mappings', ${i}::text || '_0'], '${JSON.stringify(FRONT_MAPPING)}'::jsonb);\n`;
  sql += `  v_config := jsonb_set(v_config, ARRAY['mappings', ${i}::text || '_1'], '${JSON.stringify(BACK_MAPPING)}'::jsonb);\n`;
}

sql += `  v_config := jsonb_set(v_config, '{fields}', '${JSON.stringify(wcFields)}'::jsonb);\n`;
sql += `  UPDATE products SET color_variants = v_variants, design_config = v_config, design_mode = 'template_form' WHERE slug = 'wedding-card-custom';\n`;
sql += `END $$;\n`;

fs.writeFileSync('supabase/migrations/20260506000002_fix_wedding_templates.sql', sql);

// Update mock locally
const mockPath = 'src/lib/data/mockProducts.ts';
let mockContent = fs.readFileSync(mockPath, 'utf8');
const regex = /export const mockProducts: Product\[\] = (\[[\s\S]*?\]);/;
let products = JSON.parse(mockContent.match(regex)[1]);
const wcProduct = products.find(p => p.slug === 'wedding-card-custom');
if (wcProduct) {
  wcProduct.color_variants = [];
  wcProduct.design_config = { mappings: {}, fields: wcFields };
  for (let i = 0; i < 30; i++) {
    const idx = 11 + i;
    const folder = idx.toString().padStart(2, '0');
    const style = STYLES[i % STYLES.length];
    wcProduct.color_variants.push({
      name: `Elite ${style.charAt(0).toUpperCase() + style.slice(1)} ${idx}`,
      hex: '#D4AF37',
      wireframe_images: [`/templates/wc/${folder}/front.svg`, `/templates/wc/${folder}/back.svg`]
    });
    wcProduct.design_config.mappings[`${i}_0`] = FRONT_MAPPING;
    wcProduct.design_config.mappings[`${i}_1`] = BACK_MAPPING;
  }
}
mockContent = mockContent.replace(regex, `export const mockProducts: Product[] = ${JSON.stringify(products, null, 2)};`);
fs.writeFileSync(mockPath, mockContent);
console.log('V9 Fixed Alignment Applied.');
