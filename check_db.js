const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fgtxaeyrsrtktazithwl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndHhhZXlyc3J0a3Rheml0aHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTQxMjcsImV4cCI6MjA5MDYzMDEyN30.xCEsuwEuPB3eyoznu-QGku_UFMhLhMBGNdywMtHLEy0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  console.log('--- Database Diagnostic (Hardcoded) ---');
  
  const { data, error } = await supabase.from('products').select('name, base_price, slug');
  
  if (error) {
    console.error('ERROR:', error.message);
    return;
  }
  
  console.log(`Found ${data.length} products:`);
  data.forEach(p => console.log(` - [${p.slug}] ${p.name}: ₹${p.base_price}`));
  console.log('---------------------------');
}

checkProducts();
