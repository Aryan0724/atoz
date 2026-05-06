const { Client } = require('pg');

const configs = [
  { host: 'aws-0-ap-south-1.pooler.supabase.com', port: 6543, user: `postgres.fgtxaeyrsrtktazithwl`, password: 'kh2DY-bZg_RC&ir' },
  { host: 'aws-0-ap-south-1.pooler.supabase.com', port: 6543, user: `postgres.nveqclpylvofpgyajlrt`, password: 'Mv4v7m@4z7R-n#f' },
  { host: 'aws-0-ap-south-1.pooler.supabase.com', port: 5432, user: `postgres.fgtxaeyrsrtktazithwl`, password: 'kh2DY-bZg_RC&ir' },
  { host: 'aws-0-ap-south-1.pooler.supabase.com', port: 5432, user: `postgres.nveqclpylvofpgyajlrt`, password: 'Mv4v7m@4z7R-n#f' },
];

async function findWorkingConfig() {
  for (const cfg of configs) {
    const client = new Client({
      ...cfg,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000
    });

    try {
      console.log(`Trying ${cfg.user}@${cfg.host}:${cfg.port}...`);
      await client.connect();
      console.log('SUCCESS!');
      await client.end();
      return cfg;
    } catch (err) {
      console.log(`Failed: ${err.message}`);
    }
  }
  return null;
}

findWorkingConfig().then(cfg => {
  if (cfg) {
    console.log('Working Config:', JSON.stringify(cfg, null, 2));
  } else {
    console.log('No working config found.');
  }
});
