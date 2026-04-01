const { Client } = require('pg');
const fs = require('fs');

const password = 'kh2DY-bZg_RC&ir';
const encodedPassword = encodeURIComponent(password);
const projectRef = 'fgtxaeyrsrtktazithwl';

// Common Supabase Pooler Username Formats
const usernames = [
  `postgres.${projectRef}`,
  `${projectRef}.postgres`,
  `postgres`
];

async function tryConnect() {
  for (const user of usernames) {
    const connString = `postgres://${user}:${encodedPassword}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`;
    console.log(`Trying connection for user [${user}]...`);
    const client = new Client({ 
      connectionString: connString, 
      connectionTimeoutMillis: 5000,
      ssl: { rejectUnauthorized: false }
    });
    try {
      await client.connect();
      console.log(`SUCCESS! Connected with user: ${user}`);
      
      const schemaSql = fs.readFileSync('supabase/migrations/20260401000000_schema_v2.sql', 'utf8');
      console.log('Applying fixed schema...');
      await client.query(schemaSql);
      
      const seedSql = fs.readFileSync('supabase/seed.sql', 'utf8');
      console.log('Applying Premium Hoodie catalog...');
      await client.query(seedSql);
      
      console.log('--- DATABASE COMPLETE ---');
      await client.end();
      process.exit(0);
    } catch (err) {
      console.error(`Failed with [${user}]: ${err.message}`);
    }
  }
  process.exit(1);
}

tryConnect();
