const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fgtxaeyrsrtktazithwl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndHhhZXlyc3J0a3Rheml0aHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTQxMjcsImV4cCI6MjA5MDYzMDEyN30.xCEsuwEuPB3eyoznu-QGku_UFMhLhMBGNdywMtHLEy0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function dump() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug');
  
  if (error) {
    console.error(error);
  } else {
    fs.writeFileSync('scratch/slug_dump.json', JSON.stringify(data, null, 2));
    console.log('Dumped slugs to scratch/slug_dump.json');
  }
}

dump();
