const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgres://postgres:kh2DY-bZg_RC%26ir@db.fgtxaeyrsrtktazithwl.supabase.co:5432/postgres'
});

async function migrate() {
  await client.connect();
  try {
    await client.query('BEGIN');
    
    // 1. Drop old constraint and add new one
    await client.query('ALTER TABLE orders DROP CONSTRAINT orders_status_check');
    await client.query(`
      ALTER TABLE orders 
      ADD CONSTRAINT orders_status_check 
      CHECK (status = ANY (ARRAY['pending'::text, 'pending_approval'::text, 'confirmed'::text, 'in_production'::text, 'dispatched'::text, 'out_for_delivery'::text, 'delivered'::text, 'cancelled'::text]))
    `);

    // 2. Create serviceable_areas table
    await client.query(`
      CREATE TABLE IF NOT EXISTS serviceable_areas (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        pincode TEXT UNIQUE NOT NULL,
        city TEXT,
        state TEXT,
        estimated_days INTEGER NOT NULL DEFAULT 5,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Enable RLS and add policies
    await client.query('ALTER TABLE serviceable_areas ENABLE ROW LEVEL SECURITY;');
    
    await client.query(`
      CREATE POLICY "Public can read active serviceable areas" 
      ON serviceable_areas FOR SELECT 
      USING (is_active = true);
    `).catch(e => console.log('Policy might already exist:', e.message));

    // Admin can do all (for now allow authenticated role so admin panel works)
    await client.query(`
      CREATE POLICY "Admins can do everything on serviceable areas" 
      ON serviceable_areas FOR ALL 
      USING (true);
    `).catch(e => console.log('Policy might already exist:', e.message));

    await client.query('COMMIT');
    console.log('Migration successful');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}
migrate();
