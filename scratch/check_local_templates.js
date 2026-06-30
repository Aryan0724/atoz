const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function run() {
  const connectionString = 'postgres://postgres:kh2DY-bZg_RC%26ir@db.fgtxaeyrsrtktazithwl.supabase.co:5432/postgres';
  const client = new Client({ connectionString });
  await client.connect();

  // 1. Scan Local Directories for Wedding Cards (wc)
  const wcDir = path.join(__dirname, '../public/templates/wc');
  const wcFolders = fs.readdirSync(wcDir).filter(f => fs.statSync(path.join(wcDir, f)).isDirectory());
  console.log(`Local Wedding Card (wc) folders count: ${wcFolders.length} (${wcFolders.sort().join(', ')})`);

  // Check SVG files for wc
  wcFolders.forEach(f => {
    const frontExists = fs.existsSync(path.join(wcDir, f, 'front.svg'));
    const backExists = fs.existsSync(path.join(wcDir, f, 'back.svg'));
    if (!frontExists || !backExists) {
      console.log(`  Folder ${f} missing SVGs: front.svg=${frontExists}, back.svg=${backExists}`);
    }
  });

  // 2. Scan Local Directories for Letterheads (lh)
  const lhDir = path.join(__dirname, '../public/templates/lh');
  const lhFolders = fs.readdirSync(lhDir).filter(f => fs.statSync(path.join(lhDir, f)).isDirectory());
  console.log(`Local Letterhead (lh) folders count: ${lhFolders.length} (${lhFolders.sort().join(', ')})`);

  // Check SVG files for lh
  lhFolders.forEach(f => {
    const frontExists = fs.existsSync(path.join(lhDir, f, 'front.svg'));
    const backExists = fs.existsSync(path.join(lhDir, f, 'back.svg'));
    if (!frontExists || !backExists) {
      console.log(`  Folder ${f} missing SVGs: front.svg=${frontExists}, back.svg=${backExists}`);
    }
  });

  // 3. Query DB
  const res = await client.query(
    "SELECT slug, name, color_variants, design_config FROM products WHERE slug IN ('wedding-card-custom', 'letter-head-custom')"
  );

  res.rows.forEach(row => {
    console.log(`\nDB Product: "${row.name}" (${row.slug})`);
    console.log(`  DB Variants count: ${row.color_variants ? row.color_variants.length : 0}`);
    if (row.color_variants && row.color_variants.length > 0) {
      const first = row.color_variants[0];
      const last = row.color_variants[row.color_variants.length - 1];
      console.log(`  DB First Variant: "${first.name}" (Images: ${JSON.stringify(first.wireframe_images)})`);
      console.log(`  DB Last Variant: "${last.name}" (Images: ${JSON.stringify(last.wireframe_images)})`);
    }
  });

  await client.end();
}

run().catch(console.error);
