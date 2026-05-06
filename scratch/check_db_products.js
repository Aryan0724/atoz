const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fgtxaeyrsrtktazithwl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndHhhZXlyc3J0a3Rheml0aHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTQxMjcsImV4cCI6MjA5MDYzMDEyN30.xCEsuwEuPB3eyoznu-QGku_UFMhLhMBGNdywMtHLEy0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, color_variants, design_mode, design_config');
  
  if (error) {
    console.error(error);
    return;
  }

  data.forEach(p => {
    console.log(`Product: ${p.name} (${p.slug})`);
    console.log(`- Design Mode: ${p.design_mode}`);
    console.log(`- Variants Count: ${p.color_variants?.length || 0}`);
    if (p.color_variants?.length > 0) {
      console.log(`- First Variant Name: ${p.color_variants[0].name}`);
    }
    console.log('---');
  });
}

checkProducts();
