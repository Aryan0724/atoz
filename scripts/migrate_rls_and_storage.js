const { Client } = require('pg');
const password = encodeURIComponent('kh2DY-bZg_RC&ir');
const client = new Client({
  connectionString: `postgres://postgres:${password}@db.fgtxaeyrsrtktazithwl.supabase.co:5432/postgres`
});

async function run() {
  console.log('Connecting to PostgreSQL database...');
  await client.connect();

  try {
    await client.query('BEGIN');

    // 1. Orders RLS policies
    console.log('Updating Orders RLS policies...');
    await client.query(`DROP POLICY IF EXISTS "Public can insert orders" ON orders;`);
    await client.query(`DROP POLICY IF EXISTS "Public can view orders" ON orders;`);
    await client.query(`DROP POLICY IF EXISTS "Users can view their own orders" ON orders;`);
    await client.query(`DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;`);
    await client.query(`DROP POLICY IF EXISTS "Public can manage orders" ON orders;`);

    await client.query(`
      CREATE POLICY "Public can insert orders" 
      ON orders FOR INSERT 
      WITH CHECK (true);
    `);

    await client.query(`
      CREATE POLICY "Public can view orders" 
      ON orders FOR SELECT 
      USING (true);
    `);

    await client.query(`
      CREATE POLICY "Public can update orders" 
      ON orders FOR UPDATE 
      USING (true);
    `);

    // 2. Order items RLS policies
    console.log('Updating Order Items RLS policies...');
    await client.query(`DROP POLICY IF EXISTS "Public can insert order items" ON order_items;`);
    await client.query(`DROP POLICY IF EXISTS "Public can view order items" ON order_items;`);
    await client.query(`DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;`);
    await client.query(`DROP POLICY IF EXISTS "Admins can manage all order items" ON order_items;`);
    await client.query(`DROP POLICY IF EXISTS "Public can manage order items" ON order_items;`);

    await client.query(`
      CREATE POLICY "Public can insert order items" 
      ON order_items FOR INSERT 
      WITH CHECK (true);
    `);

    await client.query(`
      CREATE POLICY "Public can view order items" 
      ON order_items FOR SELECT 
      USING (true);
    `);

    await client.query(`
      CREATE POLICY "Public can update order items" 
      ON order_items FOR UPDATE 
      USING (true);
    `);

    // 3. Storage bucket setup for designs
    console.log('Configuring Storage for designs...');
    await client.query(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('designs', 'designs', true) 
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);

    await client.query(`DROP POLICY IF EXISTS "Public read designs" ON storage.objects;`);
    await client.query(`DROP POLICY IF EXISTS "Public upload designs" ON storage.objects;`);
    await client.query(`DROP POLICY IF EXISTS "Public update designs" ON storage.objects;`);
    await client.query(`DROP POLICY IF EXISTS "Public delete designs" ON storage.objects;`);

    await client.query(`
      CREATE POLICY "Public read designs" 
      ON storage.objects FOR SELECT 
      USING (bucket_id = 'designs');
    `);

    await client.query(`
      CREATE POLICY "Public upload designs" 
      ON storage.objects FOR INSERT 
      WITH CHECK (bucket_id = 'designs');
    `);

    await client.query(`
      CREATE POLICY "Public update designs" 
      ON storage.objects FOR UPDATE 
      USING (bucket_id = 'designs');
    `);

    await client.query('COMMIT');
    console.log('Migration completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

run();
