const { Client } = require('pg');
const fs = require('fs');

const password = 'kh2DY-bZg_RC&ir';
const encodedPassword = encodeURIComponent(password);
const projectRef = 'fgtxaeyrsrtktazithwl';

const configs = [
  { host: `db.${projectRef}.supabase.co`, user: `postgres.${projectRef}`, port: 5432 },
  { host: `db.${projectRef}.supabase.co`, user: `postgres.${projectRef}`, port: 6543 },
  { host: `aws-0-ap-south-1.pooler.supabase.com`, user: `postgres.${projectRef}`, port: 5432 },
  { host: `aws-0-ap-south-1.pooler.supabase.com`, user: `postgres.${projectRef}`, port: 6543 }
];

async function run() {
  for (const config of configs) {
    const connString = `postgres://${config.user}:${encodedPassword}@${config.host}:${config.port}/postgres`;
    console.log(`Trying to connect to ${config.host} with user ${config.user} on port ${config.port}...`);
    
    const client = new Client({ 
      connectionString: connString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000
    });

    try {
      await client.connect();
      console.log('SUCCESS! CONNECTED TO DATABASE');

      const schemaSql = fs.readFileSync('supabase/migrations/20260401000000_schema_v2.sql', 'utf8');
      console.log('Applying fixed migration (v2)...');
      await client.query(schemaSql);

      const seedSql = fs.readFileSync('supabase/seed.sql', 'utf8');
      console.log('Applying product seed data...');
      await client.query(seedSql);

      console.log('--- DATABASE SYNC COMPLETE ---');
      await client.end();
      process.exit(0);
    } catch (err) {
      console.error(`FAILED with ${config.host}:${config.port} - ${err.message}`);
    }
  }
  process.exit(1);
}

run();
