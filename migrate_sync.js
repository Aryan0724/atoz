const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const password = 'kh2DY-bZg_RC&ir';
const encodedPassword = encodeURIComponent(password);
const projectRef = 'fgtxaeyrsrtktazithwl';

const configs = [
  { host: `db.${projectRef}.supabase.co`, user: `postgres.${projectRef}`, port: 5432 },
  { host: `aws-0-ap-south-1.pooler.supabase.com`, user: `postgres.${projectRef}`, port: 5432 }
];

async function run() {
  const migrationsDir = 'supabase/migrations';
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const config of configs) {
    const connString = `postgres://${config.user}:${encodedPassword}@${config.host}:${config.port}/postgres`;
    console.log(`Connecting to ${config.host}...`);
    
    const client = new Client({ 
      connectionString: connString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000
    });

    try {
      await client.connect();
      console.log('SUCCESS! Connected.');

      for (const file of files) {
        console.log(`Applying ${file}...`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await client.query(sql);
      }

      console.log('--- ALL MIGRATIONS SYNCED ---');
      await client.end();
      process.exit(0);
    } catch (err) {
      console.error(`FAILED with ${config.host} - ${err.message}`);
      try { await client.end(); } catch(e) {}
    }
  }
  process.exit(1);
}

run();
