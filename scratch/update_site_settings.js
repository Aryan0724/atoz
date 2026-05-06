const { Client } = require('pg');

const password = 'kh2DY-bZg_RC&ir';
const encodedPassword = encodeURIComponent(password);
const projectRef = 'fgtxaeyrsrtktazithwl';
const host = '[2406:da1a:6b0:f61a:246c:752d:c203:3634]'; // IPv6 host from previous check

async function update() {
  const connString = `postgres://postgres.${projectRef}:${encodedPassword}@${host}:5432/postgres`;
  const client = new Client({ 
    connectionString: connString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log(`Connected to database`);

    const res = await client.query("SELECT config FROM site_settings WHERE id = 'global'");
    let config = res.rows[0]?.config || {};

    config.about = {
      title: "AtoZ Prints",
      description: "AtoZ Prints is a fast-growing online printing platform in India delivering high-quality customized products. We bridge the gap between creative vision and physical reality with unparalleled precision.",
      founderStory: {
        title: "The Visionary Behind AtoZ",
        content: "Richa Jain started AtoZ Prints with a vision to make printing affordable and accessible across India. Her passion for design and technology led to the creation of a platform that empowers businesses and individuals to bring their ideas to life.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
      },
      team: [
        { name: "Aman Verma", role: "Operations", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop" },
        { name: "Sneha Kapoor", role: "Designer", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop" },
        { name: "Rahul Mehta", role: "Marketing", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" },
        { name: "Pooja Singh", role: "Support", image: "https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?q=80&w=1000&auto=format&fit=crop" }
      ]
    };

    await client.query("UPDATE site_settings SET config = $1 WHERE id = 'global'", [JSON.stringify(config)]);
    console.log('--- SITE SETTINGS UPDATED ---');
  } catch (err) {
    console.error(`Error: ${err.message}`);
  } finally {
    await client.end();
  }
}

update();
