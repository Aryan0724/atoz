const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const projectRef = 'fgtxaeyrsrtktazithwl';
const config = {
  host: `db.${projectRef}.supabase.com`,
  port: 5432,
  user: `postgres`,
  password: 'kh2DY-bZg_RC&ir',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
};

const COLORS = [
  '#0F172A', '#1E3A8A', '#111827', '#EC4899', '#0D9488', '#F97316', '#8B5CF6', '#EF4444', '#059669', '#44403C'
];

const PRODUCTS = [
  { slug: 'business-card-custom', type: 'bc', name: 'Elite Business Card', start: 31, count: 30 },
  { slug: 'id-card-custom', type: 'id', name: 'Elite ID Card', start: 11, count: 30 },
  { slug: 'wedding-card-custom', type: 'wc', name: 'Elite Wedding Card', start: 11, count: 30 },
  { slug: 'letter-head-custom', type: 'lh', name: 'Elite Letterhead', start: 11, count: 30 }
];

const MAPPINGS = {
  bc: (idx) => ({
    [`${idx}_0`]: {
      name: { x: 50, y: 45, fontSize: 30, fontWeight: 'bold', align: 'center' },
      title: { x: 50, y: 55, fontSize: 16, fontWeight: 'normal', align: 'center' },
      phone: { x: 50, y: 75, fontSize: 12, fontWeight: 'normal', align: 'center' },
      email: { x: 50, y: 82, fontSize: 12, fontWeight: 'normal', align: 'center' },
      logo: { x: 8, y: 14, w: 4, h: 7 }
    }
  }),
  id: (idx) => ({
    [`${idx}_0`]: {
      name: { x: 50, y: 62, fontSize: 32, fontWeight: 'bold', align: 'center' },
      id_no: { x: 50, y: 70, fontSize: 16, fontWeight: 'normal', align: 'center' },
      designation: { x: 50, y: 76, fontSize: 14, fontWeight: 'bold', align: 'center' },
      logo: { x: 42, y: 6, w: 16, h: 9 }
    }
  }),
  wc: (idx) => ({
    [`${idx}_0`]: {
      groom: { x: 50, y: 35, fontSize: 36, fontWeight: 'bold', align: 'center' },
      bride: { x: 50, y: 48, fontSize: 36, fontWeight: 'bold', align: 'center' },
      date: { x: 50, y: 60, fontSize: 18, fontWeight: 'normal', align: 'center' },
      venue: { x: 50, y: 75, fontSize: 14, fontWeight: 'normal', align: 'center' }
    }
  }),
  lh: (idx) => ({
    [`${idx}_0`]: {
      company: { x: 50, y: 8, fontSize: 32, fontWeight: 'bold', align: 'center' },
      address: { x: 50, y: 96, fontSize: 10, fontWeight: 'normal', align: 'center' },
      phone: { x: 30, y: 96, fontSize: 10, fontWeight: 'normal', align: 'left' },
      email: { x: 70, y: 96, fontSize: 10, fontWeight: 'normal', align: 'right' },
      logo: { x: 10, y: 6, w: 6, h: 6 }
    }
  })
};

async function sync() {
  const client = new Client(config);
  try {
    await client.connect();
    console.log('Connected to database.');

    for (const p of PRODUCTS) {
      console.log(`Syncing ${p.name}...`);
      
      const res = await client.query('SELECT color_variants, design_config FROM products WHERE slug = $1', [p.slug]);
      
      if (res.rows.length === 0) {
        console.warn(`Could not find product ${p.slug}, skipping...`);
        continue;
      }

      const current = res.rows[0];
      let variants = current.color_variants || [];
      let config = current.design_config || { mappings: {}, fields: [] };
      if (!config.mappings) config.mappings = {};
      
      // Ensure fields are defined
      if (!config.fields || config.fields.length === 0) {
        if (p.type === 'id') {
          config.fields = [
            { id: 'name', label: 'Employee Name', type: 'text', icon: 'User', placeholder: 'e.g. Vikram Malhotra' },
            { id: 'id_no', label: 'Employee ID', type: 'text', icon: 'Type', placeholder: 'e.g. AZ-2026-001' },
            { id: 'designation', label: 'Designation', type: 'text', icon: 'Briefcase', placeholder: 'e.g. Senior Developer' }
          ];
        } else if (p.type === 'wc') {
          config.fields = [
            { id: 'groom', label: 'Groom Name', type: 'text', icon: 'User', placeholder: 'e.g. Rahul' },
            { id: 'bride', label: 'Bride Name', type: 'text', icon: 'User', placeholder: 'e.g. Ananya' },
            { id: 'date', label: 'Date', type: 'text', icon: 'Calendar', placeholder: 'e.g. 15th Dec 2026' },
            { id: 'venue', label: 'Venue', type: 'textarea', icon: 'MapPin', placeholder: 'Enter venue address...' }
          ];
        } else if (p.type === 'lh') {
          config.fields = [
            { id: 'company', label: 'Company Name', type: 'text', icon: 'Type', placeholder: 'e.g. A to Z Prints' },
            { id: 'address', label: 'Office Address', type: 'textarea', icon: 'MapPin', placeholder: 'Enter official address...' },
            { id: 'phone', label: 'Phone', type: 'text', icon: 'Phone', placeholder: '+91 XXXXX XXXXX' },
            { id: 'email', label: 'Email', type: 'email', icon: 'Mail', placeholder: 'info@company.com' }
          ];
        }
      }

      // Add new ones
      for (let i = 0; i < p.count; i++) {
        const idx = p.start + i;
        const folderName = idx.toString().padStart(2, '0');
        const vIdx = variants.length;
        
        const newVariant = {
          name: `Elite Design ${idx}`,
          hex: COLORS[i % COLORS.length],
          wireframe_images: [`/templates/${p.type}/${folderName}/front.svg`]
        };
        
        if (p.type === 'bc') {
          newVariant.wireframe_images.push(`/templates/${p.type}/${folderName}/back.svg`);
        }

        variants.push(newVariant);
        
        // Add mappings
        const m = MAPPINGS[p.type](vIdx);
        Object.assign(config.mappings, m);
      }

      await client.query('UPDATE products SET color_variants = $1, design_config = $2, design_mode = $3 WHERE slug = $4', 
        [JSON.stringify(variants), JSON.stringify(config), 'template_form', p.slug]);

      console.log(`Successfully updated ${p.slug} with ${p.count} new templates.`);
    }
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await client.end();
  }
}

sync();
