const { Client } = require('pg');

const connectionString = 'postgres://postgres:kh2DY-bZg_RC%26ir@db.fgtxaeyrsrtktazithwl.supabase.co:5432/postgres';

async function checkDb() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query("SELECT id, design_config FROM products WHERE slug = 'id-card-custom'");
    if (res.rows.length === 0) {
      console.error('Product not found.');
      return;
    }
    const product = res.rows[0];
    const mappings = product.design_config?.mappings || {};
    console.log("Keys in mappings:", Object.keys(mappings));
    console.log("Mapping for '0_0':", JSON.stringify(mappings['0_0'], null, 2));
    console.log("Mapping for '0_1':", JSON.stringify(mappings['0_1'], null, 2));
  } catch (err) {
    console.error('Error querying DB:', err);
  } finally {
    await client.end();
  }
}

checkDb();
