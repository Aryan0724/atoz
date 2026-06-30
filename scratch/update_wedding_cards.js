const { Client } = require('pg');

const connectionString = 'postgres://postgres:kh2DY-bZg_RC%26ir@db.fgtxaeyrsrtktazithwl.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  await client.connect();

  // 1. Fetch current product data
  const res = await client.query(
    "SELECT color_variants, design_config FROM products WHERE slug = 'wedding-card-custom'"
  );
  
  if (res.rows.length === 0) {
    console.error('Product not found!');
    await client.end();
    return;
  }
  
  const product = res.rows[0];
  console.log('Original number of variants:', product.color_variants.length);

  // 2. Define the new color_variants list (40 items in total)
  const newColorVariants = [];

  // Indices 0 to 29 correspond to existing templates 11 to 40 (make them single-sided)
  for (let i = 0; i < 30; i++) {
    const orig = product.color_variants[i];
    const templateNum = String(i + 11).padStart(2, '0');
    newColorVariants.push({
      hex: orig.hex || '#D4AF37',
      name: orig.name || `Elite Design ${templateNum}`,
      wireframe_images: [`/templates/wc/${templateNum}/front.svg`] // Single sided (front only)
    });
  }

  // Indices 30 to 39 correspond to new templates 01 to 10 (single-sided landscape)
  const newNames = [
    "Elite Floral 01",
    "Elite Watercolor 02",
    "Elite Traditional 03",
    "Elite Royal 04",
    "Elite Classic 05",
    "Elite Modern 06",
    "Elite Vintage 07",
    "Elite Peacock 08",
    "Elite Ganesha 09",
    "Elite Mandala 10"
  ];

  for (let i = 0; i < 10; i++) {
    const templateNum = String(i + 1).padStart(2, '0');
    newColorVariants.push({
      hex: '#D4AF37',
      name: newNames[i],
      wireframe_images: [`/templates/wc/${templateNum}/front.svg`] // Single sided (front only)
    });
  }

  // 3. Define the new design_config mappings
  const newMappings = {};

  // Copy existing front mappings (0_0 to 29_0)
  for (let i = 0; i < 30; i++) {
    const key = `${i}_0`;
    if (product.design_config.mappings[key]) {
      newMappings[key] = product.design_config.mappings[key];
    } else {
      // Fallback in case a mapping doesn't exist
      newMappings[key] = {
        title: { x: 50, y: 15, align: "center", fontSize: 32, fontWeight: "normal", color: "#D4AF37" }
      };
    }
  }

  // Define Layout Mappings for 30_0 to 39_0 (01 to 10 landscape templates)
  const layout1 = {
    title: { x: 50, y: 12, align: "center", fontSize: 24, fontWeight: "normal", italic: true, color: "#D4AF37" },
    parents: { x: 50, y: 22, align: "center", fontSize: 18, fontWeight: "normal", color: "#D4AF37" },
    groom: { x: 50, y: 36, align: "center", fontSize: 48, fontWeight: "bold", fontFamily: "serif", color: "#D4AF37" },
    ampersand: { x: 50, y: 46, align: "center", fontSize: 28, fontWeight: "normal", color: "#D4AF37" },
    bride: { x: 50, y: 56, align: "center", fontSize: 48, fontWeight: "bold", fontFamily: "serif", color: "#D4AF37" },
    invite_body: { x: 50, y: 70, align: "center", fontSize: 16, maxWidth: 80, fontWeight: "normal", color: "#D4AF37" },
    venue_header: { x: 50, y: 78, align: "center", fontSize: 18, fontWeight: "bold", color: "#D4AF37" },
    venue: { x: 50, y: 84, align: "center", fontSize: 15, maxWidth: 85, fontWeight: "normal", color: "#D4AF37" },
    date: { x: 50, y: 92, align: "center", fontSize: 20, fontWeight: "bold", color: "#D4AF37" },
    rsvp: { x: 10, y: 92, align: "left", fontSize: 14, fontWeight: "normal", color: "#D4AF37" },
    hashtag: { x: 90, y: 92, align: "right", fontSize: 14, fontWeight: "bold", color: "#D4AF37" }
  };

  const layout2 = {
    title: { x: 50, y: 12, align: "center", fontSize: 24, fontWeight: "normal", italic: true, color: "#D4AF37" },
    parents: { x: 50, y: 22, align: "center", fontSize: 18, fontWeight: "normal", color: "#D4AF37" },
    groom: { x: 35, y: 38, align: "right", fontSize: 44, fontWeight: "bold", fontFamily: "serif", color: "#D4AF37" },
    ampersand: { x: 50, y: 38, align: "center", fontSize: 28, fontWeight: "normal", color: "#D4AF37" },
    bride: { x: 65, y: 38, align: "left", fontSize: 44, fontWeight: "bold", fontFamily: "serif", color: "#D4AF37" },
    invite_body: { x: 50, y: 55, align: "center", fontSize: 16, maxWidth: 80, fontWeight: "normal", color: "#D4AF37" },
    venue_header: { x: 50, y: 65, align: "center", fontSize: 18, fontWeight: "bold", color: "#D4AF37" },
    venue: { x: 50, y: 72, align: "center", fontSize: 15, maxWidth: 85, fontWeight: "normal", color: "#D4AF37" },
    date: { x: 50, y: 82, align: "center", fontSize: 22, fontWeight: "bold", color: "#D4AF37" },
    rsvp: { x: 10, y: 90, align: "left", fontSize: 14, fontWeight: "normal", color: "#D4AF37" },
    hashtag: { x: 90, y: 90, align: "right", fontSize: 14, fontWeight: "bold", color: "#D4AF37" }
  };

  const layout3 = {
    title: { x: 30, y: 15, align: "left", fontSize: 24, fontWeight: "normal", italic: true, color: "#D4AF37" },
    groom: { x: 30, y: 30, align: "left", fontSize: 44, fontWeight: "bold", fontFamily: "serif", color: "#D4AF37" },
    ampersand: { x: 30, y: 40, align: "left", fontSize: 28, fontWeight: "normal", color: "#D4AF37" },
    bride: { x: 30, y: 50, align: "left", fontSize: 44, fontWeight: "bold", fontFamily: "serif", color: "#D4AF37" },
    invite_body: { x: 30, y: 68, align: "left", fontSize: 16, maxWidth: 50, fontWeight: "normal", color: "#D4AF37" },
    parents: { x: 30, y: 80, align: "left", fontSize: 18, fontWeight: "normal", color: "#D4AF37" },
    venue_header: { x: 75, y: 30, align: "center", fontSize: 18, fontWeight: "bold", color: "#D4AF37" },
    venue: { x: 75, y: 38, align: "center", fontSize: 15, maxWidth: 40, fontWeight: "normal", color: "#D4AF37" },
    date: { x: 75, y: 55, align: "center", fontSize: 22, fontWeight: "bold", color: "#D4AF37" },
    time: { x: 75, y: 65, align: "center", fontSize: 16, fontWeight: "normal", color: "#D4AF37" },
    rsvp: { x: 75, y: 80, align: "center", fontSize: 14, fontWeight: "normal", color: "#D4AF37" },
    hashtag: { x: 75, y: 88, align: "center", fontSize: 14, fontWeight: "bold", color: "#D4AF37" }
  };

  const layouts = [layout1, layout2, layout3];

  for (let i = 0; i < 10; i++) {
    const key = `${i + 30}_0`;
    // Distribute layouts
    const layoutIdx = i % 3;
    newMappings[key] = layouts[layoutIdx];
  }

  // 4. Update product row in database
  const updatedConfig = {
    ...product.design_config,
    mappings: newMappings
  };

  console.log('Updating database record...');
  const updateRes = await client.query(
    "UPDATE products SET color_variants = $1, design_config = $2 WHERE slug = 'wedding-card-custom' RETURNING id",
    [JSON.stringify(newColorVariants), JSON.stringify(updatedConfig)]
  );

  console.log('Update completed successfully. Row updated ID:', updateRes.rows[0].id);

  await client.end();
}

run().catch(console.error);
