const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const password = 'kh2DY-bZg_RC&ir';
const encodedPassword = encodeURIComponent(password);
const projectRef = 'fgtxaeyrsrtktazithwl';

const configs = [
  { host: `aws-0-ap-south-1.pooler.supabase.com`, user: `postgres.${projectRef}`, port: 6543 }
];

async function run() {
  const file = 'supabase/migrations/20260506000000_add_30_elite_templates.sql';

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

      console.log(`Applying ${file}...`);
      const sql = fs.readFileSync(file, 'utf8');
      await client.query(sql);

      console.log('--- MIGRATION APPLIED ---');
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
