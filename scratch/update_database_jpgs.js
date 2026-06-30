const { Client } = require('pg');
const connectionString = 'postgres://postgres:kh2DY-bZg_RC%26ir@db.fgtxaeyrsrtktazithwl.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  await client.connect();

  // 1. UPDATE WEDDING CARDS (wedding-card-custom)
  console.log('Updating Wedding Cards...');
  const wcRes = await client.query(
    "SELECT color_variants, design_config FROM products WHERE slug = 'wedding-card-custom'"
  );
  if (wcRes.rows.length > 0) {
    const wcProduct = wcRes.rows[0];
    const newWcVariants = [];
    const newWcMappings = {};

    const wcNames = [
      "Elite Floral 01", "Elite Watercolor 02", "Elite Traditional 03", "Elite Royal 04", "Elite Classic 05",
      "Elite Modern 06", "Elite Vintage 07", "Elite Peacock 08", "Elite Ganesha 09", "Elite Mandala 10",
      "Elite Doli 11", "Elite Ganesha 12", "Elite Kalash 13", "Elite Peacock 14", "Elite Mandala 15",
      "Elite Doli 16", "Elite Ganesha 17", "Elite Kalash 18", "Elite Peacock 19", "Elite Mandala 20",
      "Elite Doli 21", "Elite Ganesha 22", "Elite Kalash 23", "Elite Peacock 24", "Elite Mandala 25",
      "Elite Doli 26", "Elite Ganesha 27", "Elite Kalash 28", "Elite Peacock 29", "Elite Mandala 30"
    ];

    for (let i = 0; i < 30; i++) {
      const templateNum = String(i + 1).padStart(2, '0');
      newWcVariants.push({
        hex: '#D4AF37',
        name: wcNames[i] || `Elite Design ${templateNum}`,
        wireframe_images: [`/templates/wc/${templateNum}/front.jpg`]
      });

      // Keep mappings (we map to 0_0 ... 29_0)
      const key = `${i}_0`;
      // Use existing mappings if present
      if (wcProduct.design_config.mappings[key]) {
        newWcMappings[key] = wcProduct.design_config.mappings[key];
      } else {
        newWcMappings[key] = {
          title: { x: 50, y: 15, align: "center", fontSize: 32, fontWeight: "normal", color: "#D4AF37" }
        };
      }
    }

    const wcConfig = {
      ...wcProduct.design_config,
      mappings: newWcMappings
    };

    await client.query(
      "UPDATE products SET color_variants = $1, design_config = $2 WHERE slug = 'wedding-card-custom'",
      [JSON.stringify(newWcVariants), JSON.stringify(wcConfig)]
    );
    console.log('Wedding Cards updated to 30 JPEG templates.');
  }

  // 2. UPDATE LETTERHEADS (letter-head-custom)
  console.log('\nUpdating Letterheads...');
  const lhRes = await client.query(
    "SELECT color_variants, design_config FROM products WHERE slug = 'letter-head-custom'"
  );
  if (lhRes.rows.length > 0) {
    const lhProduct = lhRes.rows[0];
    const newLhVariants = [];
    const newLhMappings = {};

    const lhNames = [
      "Executive Elite 01", "Sidebar Elite 02", "Tech Elite 03", "Artistic Elite 04", "Industrial Elite 05",
      "Executive Elite 06", "Sidebar Elite 07", "Tech Elite 08", "Artistic Elite 09", "Industrial Elite 10",
      "Executive Elite 11", "Sidebar Elite 12", "Tech Elite 13", "Artistic Elite 14", "Industrial Elite 15",
      "Executive Elite 16", "Sidebar Elite 17", "Tech Elite 18", "Artistic Elite 19", "Industrial Elite 20",
      "Executive Elite 21", "Sidebar Elite 22", "Tech Elite 23", "Artistic Elite 24", "Industrial Elite 25",
      "Executive Elite 26", "Sidebar Elite 27", "Tech Elite 28", "Artistic Elite 29", "Industrial Elite 30"
    ];

    for (let i = 0; i < 30; i++) {
      const templateNum = String(i + 1).padStart(2, '0');
      newLhVariants.push({
        hex: '#FFFFFF',
        name: lhNames[i] || `Executive Elite ${templateNum}`,
        wireframe_images: [`/templates/lh/${templateNum}/front.jpg`]
      });

      // Keep mappings (we map to 0_0 ... 29_0)
      const key = `${i}_0`;
      if (lhProduct.design_config.mappings[key]) {
        newLhMappings[key] = lhProduct.design_config.mappings[key];
      } else {
        newLhMappings[key] = {
          company: { x: 50, y: 10, align: "center", fontSize: 34, fontWeight: "bold" }
        };
      }
    }

    const lhConfig = {
      ...lhProduct.design_config,
      mappings: newLhMappings
    };

    await client.query(
      "UPDATE products SET color_variants = $1, design_config = $2 WHERE slug = 'letter-head-custom'",
      [JSON.stringify(newLhVariants), JSON.stringify(lhConfig)]
    );
    console.log('Letterheads updated to 30 JPEG templates.');
  }

  await client.end();
  console.log('\nAll done!');
}

run().catch(console.error);
