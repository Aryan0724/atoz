const { Client } = require('pg');
const connectionString = 'postgres://postgres:kh2DY-bZg_RC%26ir@db.fgtxaeyrsrtktazithwl.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  await client.connect();

  const product = await client.query(
    "SELECT name, color_variants, design_config FROM products WHERE slug = 'letter-head-custom'"
  );
  const row = product.rows[0];
  console.log(`Product Name: ${row.name}`);
  console.log(`Number of color variants: ${row.color_variants ? row.color_variants.length : 0}`);
  
  if (row.color_variants) {
    row.color_variants.forEach((v, idx) => {
      console.log(`Variant [${idx}]: "${v.name}" - Hex: ${v.hex} - Images: ${JSON.stringify(v.wireframe_images)}`);
    });
  }

  const mappingsKeys = Object.keys(row.design_config?.mappings || {});
  console.log(`\nNumber of mappings in design_config: ${mappingsKeys.length}`);
  console.log(`Mapped indices:`);
  const mappedIndices = new Set();
  mappingsKeys.forEach(k => {
    mappedIndices.add(k.split('_')[0]);
  });
  console.log(Array.from(mappedIndices).sort((a,b) => parseInt(a) - parseInt(b)).join(', '));

  await client.end();
}
run().catch(console.error);
