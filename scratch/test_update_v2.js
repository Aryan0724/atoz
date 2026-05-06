const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fgtxaeyrsrtktazithwl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndHhhZXlyc3J0a3Rheml0aHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTQxMjcsImV4cCI6MjA5MDYzMDEyN30.xCEsuwEuPB3eyoznu-QGku_UFMhLhMBGNdywMtHLEy0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('products')
    .update({ is_active: true })
    .eq('slug', 'id-card-custom')
    .select();
  
  console.log('Error:', error);
  console.log('Data:', data);
}

test();
