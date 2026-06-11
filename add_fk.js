const { Client } = require('pg');
const connectionString = 'postgres://postgres:kh2DY-bZg_RC%26ir@db.fgtxaeyrsrtktazithwl.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    // First let's check the current constraints on orders
    const { rows: constraints } = await client.query(`
      SELECT conname, pg_get_constraintdef(c.oid)
      FROM pg_constraint c
      JOIN pg_namespace n ON n.oid = c.connamespace
      WHERE conrelid = 'public.orders'::regclass AND contype = 'f';
    `);
    console.log("Current FKs:", constraints);

    // Try to add the foreign key to profiles if it's missing
    console.log("Adding FK to profiles...");
    await client.query(`
      ALTER TABLE public.orders 
      ADD CONSTRAINT orders_user_id_fkey_profiles 
      FOREIGN KEY (user_id) REFERENCES public.profiles(id)
      ON DELETE SET NULL;
    `);
    console.log("FK added successfully!");
    
    // Refresh schema cache for Postgrest
    await client.query(`NOTIFY pgrst, 'reload schema';`);
    console.log("Schema cache reloaded.");
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}
run();
