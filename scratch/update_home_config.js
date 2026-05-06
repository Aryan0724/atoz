const { Client } = require('pg');

const password = 'kh2DY-bZg_RC&ir';
const encodedPassword = encodeURIComponent(password);
const projectRef = 'fgtxaeyrsrtktazithwl';
const host = `db.${projectRef}.supabase.co`;

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

    config.hero = {
      title: "All Your <span class='italic text-brand-gold'>Printing</span> Needs in One Place",
      subtitle: "Delivered Anywhere in India. India’s trusted online printing partner offering high-quality T-shirts, mugs, business cards & more.",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=2070&auto=format&fit=crop",
      badges: [
        { icon: "Zap", text: "Flat 20% OFF on First Order" },
        { icon: "Truck", text: "Free Shipping Above ₹999" },
        { icon: "Target", text: "Bulk Discounts Available" }
      ]
    };

    config.features = {
      title: "Unmatched <span class='italic text-brand-gold'>Excellence.</span>",
      subtitle: "Why Choose Us",
      items: [
        { icon: "Award", title: "High Quality", description: "We use industry-leading technology and premium materials to ensure stunning results for every print." },
        { icon: "Zap", title: "Fast Delivery", description: "Our optimized logistics network ensures your custom products reach you quickly, wherever you are in India." },
        { icon: "ShieldCheck", title: "Affordable Pricing", description: "Premium quality doesn't have to mean premium prices; we offer competitive rates for every budget." },
        { icon: "Truck", title: "Pan India Service", description: "From metropolitan cities to the remotest corners, our delivery footprint covers the entire nation." }
      ]
    };

    config.home_services = {
      title: "Our <span class='italic text-brand-gold'>Services.</span>"
    };

    config.home_faq = {
      title: "Curiosity <br /> <span class='italic text-brand-gold'>Answered.</span>",
      items: [
        { q: "What is the minimum turnaround time?", a: "Standard turnaround is 5-7 business days, though express options are available for selected products." },
        { q: "Do you offer PAN India delivery?", a: "Yes, we have a robust logistics network that delivers to over 19,000 pin codes across India." },
        { q: "Can I request a physical sample?", a: "Certainly. We provide samples for bulk orders to ensure material and print quality meets your expectations." },
        { q: "Do you provide design assistance?", a: "Our in-house studio provides expert guidance on structural design and print-ready artwork optimization." }
      ]
    };

    config.home_cta = {
      title: "Ready to <span class='italic text-brand-gold'>Transform</span> Your Brand?",
      description: "Join 10,000+ businesses delivering excellence with AtoZ Prints. Get started with your custom project today."
    };

    await client.query("UPDATE site_settings SET config = $1 WHERE id = 'global'", [JSON.stringify(config)]);
    console.log('--- HOME PAGE CONFIG UPDATED ---');
  } catch (err) {
    console.error(`Error: ${err.message}`);
  } finally {
    await client.end();
  }
}

update();
