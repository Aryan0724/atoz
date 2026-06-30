const { Client } = require('pg');
const connectionString = 'postgres://postgres:kh2DY-bZg_RC%26ir@db.fgtxaeyrsrtktazithwl.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  await client.connect();
  const res = await client.query("SELECT id, name, slug FROM products ORDER BY name");
  console.log('Products in database:');
  res.rows.forEach(r => {
    console.log(`- Name: "${r.name}", Slug: "${r.slug}", ID: ${r.id}`);
  });
  await client.end();
}
run().catch(console.error);
