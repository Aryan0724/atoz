const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fgtxaeyrsrtktazithwl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndHhhZXlyc3J0a3Rheml0aHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTQxMjcsImV4cCI6MjA5MDYzMDEyN30.xCEsuwEuPB3eyoznu-QGku_UFMhLhMBGNdywMtHLEy0';
const supabase = createClient(supabaseUrl, supabaseKey);

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
  for (const p of PRODUCTS) {
    console.log(`Syncing ${p.name}...`);
    
    // Fetch existing
    const { data: current, error: fetchErr } = await supabase
      .from('products')
      .select('color_variants, design_config')
      .eq('slug', p.slug)
      .single();
    
    if (fetchErr) {
      console.warn(`Could not find product ${p.slug}, skipping...`);
      continue;
    }

    let variants = current.color_variants || [];
    let config = current.design_config || { mappings: {}, fields: [] };
    if (!config.mappings) config.mappings = {};

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

    // Update DB
    const { error: updateErr } = await supabase
      .from('products')
      .update({
        color_variants: variants,
        design_config: config,
        design_mode: 'template_form'
      })
      .eq('slug', p.slug);

    if (updateErr) {
      console.error(`Error updating ${p.slug}:`, updateErr);
    } else {
      console.log(`Successfully updated ${p.slug} with ${p.count} new templates.`);
    }
  }
}

sync();
