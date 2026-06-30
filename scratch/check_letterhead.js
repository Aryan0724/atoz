const { Client } = require('pg');
const connectionString = 'postgres://postgres:kh2DY-bZg_RC%26ir@db.fgtxaeyrsrtktazithwl.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  await client.connect();

  // Get letter head product
  const product = await client.query(
    "SELECT * FROM products WHERE slug = 'letter-head-custom'"
  );
  console.log('Product:');
  console.log(JSON.stringify(product.rows[0], null, 2));

  // Get design configs
  const configs = await client.query(
    "SELECT * FROM product_design_configs WHERE product_id = $1",
    [product.rows[0]?.id]
  );
  console.log('\nDesign Configs (' + configs.rows.length + '):');
  configs.rows.forEach(c => {
    console.log('- Config ID:', c.id, '| Name:', c.name, '| Mode:', c.design_mode);
    console.log('  wireframe_images:', JSON.stringify(c.wireframe_images)?.substring(0, 200));
    console.log('  fields:', JSON.stringify(c.fields)?.substring(0, 500));
    console.log('  field_mappings:', JSON.stringify(c.field_mappings)?.substring(0, 500));
  });

  await client.end();
}
run().catch(console.error);
