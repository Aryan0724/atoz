const { Client } = require('pg');
const fs = require('fs');

const password = 'kh2DY-bZg_RC&ir';
const encodedPassword = encodeURIComponent(password);
const projectRef = 'fgtxaeyrsrtktazithwl';
// IPv6 address from nslookup
const host = '[2406:da1a:6b0:f61a:246c:752d:c203:3634]'; 

async function run() {
  const connString = `postgres://postgres.${projectRef}:${encodedPassword}@${host}:5432/postgres`;
  console.log(`Connecting to IPv6 host ${host}...`);
  
  const client = new Client({ 
    connectionString: connString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
  });

  try {
    await client.connect();
    console.log('SUCCESS! CONNECTED TO DATABASE via IPv6');

    // 1. Fix the Recursion (Apply schema_v2.sql)
    const schemaSql = fs.readFileSync('supabase/migrations/20260401000000_schema_v2.sql', 'utf8');
    console.log('Applying fixed schema (v2)...');
    await client.query(schemaSql);

    // 2. Insert the missing product (Apply seed.sql)
    const seedSql = fs.readFileSync('supabase/seed.sql', 'utf8');
    console.log('Applying product seed data...');
    await client.query(seedSql);

    // 3. Promote the specific user to Admin
    const email = 'aryantiwari0724@gmail.com';
    console.log(`Promoting ${email} to admin...`);
    const promoSql = `
      UPDATE public.profiles 
      SET role = 'admin' 
      WHERE email = $1;
    `;
    await client.query(promoSql, [email]);

    console.log('--- DATABASE RESCUE COMPLETE ---');
  } catch (err) {
    console.error('DATABASE ERROR:', err.message);
  } finally {
    await client.end();
  }
}

run();
