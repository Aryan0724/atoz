const { Client } = require('pg');
const fs = require('fs');

const connectionString = 'postgres://postgres:kh2DY-bZg_RC%26ir@db.fgtxaeyrsrtktazithwl.supabase.co:5432/postgres';

async function uploadData() {
  const client = new Client({ connectionString });
  await client.connect();
  
  const raw = fs.readFileSync('./scratch/import_data_id.json', 'utf-8');
  const data = JSON.parse(raw);

  // Fetch existing product
  const res = await client.query("SELECT id, design_config FROM products WHERE slug = 'id-card-custom'");
  if (res.rows.length === 0) {
    console.error('Product id-card-custom not found!');
    await client.end();
    return;
  }
  
  const product = res.rows[0];
  const existingConfig = product.design_config || {};
  
  // Build updated design_config
  const newConfig = {
    ...existingConfig,
    variants: data.variants,
    mappings: data.mappings
  };

  // Upload
  await client.query(
    'UPDATE products SET design_config = $1 WHERE id = $2',
    [JSON.stringify(newConfig), product.id]
  );

  console.log('Uploaded successfully!');
  console.log('  Variants:', data.variants.length);
  console.log('  Mappings keys:', Object.keys(data.mappings).length);
  
  await client.end();
}

uploadData().catch(err => {
  console.error('Upload failed:', err);
  process.exit(1);
});
