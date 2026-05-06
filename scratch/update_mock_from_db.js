const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fgtxaeyrsrtktazithwl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndHhhZXlyc3J0a3Rheml0aHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTQxMjcsImV4cCI6MjA5MDYzMDEyN30.xCEsuwEuPB3eyoznu-QGku_UFMhLhMBGNdywMtHLEy0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateMock() {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) {
    console.error(error);
    return;
  }

  const content = `import { Product } from '../supabase/types';

// ── Helper to encode SVG into a data URI ────────────────────────────────
const svgUri = (svg: string) =>
  \`data:image/svg+xml;utf8,\${encodeURIComponent(svg)}\`;

export const mockProducts: Product[] = ${JSON.stringify(data, null, 2)};
`;

  fs.writeFileSync('src/lib/data/mockProducts.ts', content);
  console.log('Updated src/lib/data/mockProducts.ts with latest DB data.');
}

updateMock();
