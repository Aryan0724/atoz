const { Client } = require('pg');

const connectionString = 'postgres://postgres:kh2DY-bZg_RC%26ir@db.fgtxaeyrsrtktazithwl.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to database.');

    // 1. Update global config hero image
    const newHeroImage = 'https://images.unsplash.com/photo-1616628188506-4bd8d62c908d?q=80&w=2070&auto=format&fit=crop';
    
    // Fetch current global config
    const { rows: globalRows } = await client.query(
      `SELECT config FROM public.site_settings WHERE id = 'global'`
    );
    
    if (globalRows.length > 0) {
      const config = globalRows[0].config;
      if (config.hero) {
        config.hero.image = [newHeroImage];
        await client.query(
          `UPDATE public.site_settings SET config = $1 WHERE id = 'global'`,
          [JSON.stringify(config)]
        );
        console.log('Updated global config hero image in DB.');
      }
    }

    // 2. Update T-shirt products images in database
    const newTshirtImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=2000&auto=format&fit=crop';
    
    // Update custom-premium-tshirt
    await client.query(
      `UPDATE public.products SET images = $1 WHERE slug = 'custom-premium-tshirt'`,
      [[newTshirtImage]]
    );
    console.log('Updated custom-premium-tshirt images in DB.');

    // Update t-shirt-50
    await client.query(
      `UPDATE public.products SET images = $1 WHERE slug = 't-shirt-50'`,
      [[newTshirtImage]]
    );
    console.log('Updated t-shirt-50 images in DB.');

    console.log('Database image updates completed successfully.');
  } catch (err) {
    console.error('Failed to update images:', err);
  } finally {
    await client.end();
  }
}

run();
