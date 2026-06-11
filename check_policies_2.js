const { Client } = require('pg');
const password = encodeURIComponent('kh2DY-bZg_RC&ir');
const client = new Client({
  connectionString: `postgres://postgres:${password}@db.fgtxaeyrsrtktazithwl.supabase.co:5432/postgres`
});

client.connect()
  .then(() => client.query(`SELECT policyname, roles FROM pg_policies WHERE tablename IN ('orders', 'order_items') AND cmd = 'INSERT'`))
  .then(res => {
    console.log(JSON.stringify(res.rows, null, 2));
    client.end();
  })
  .catch(err => {
    console.error(err);
    client.end();
  });
