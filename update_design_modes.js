const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fgtxaeyrsrtktazithwl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndHhhZXlyc3J0a3Rheml0aHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTQxMjcsImV4cCI6MjA5MDYzMDEyN30.xCEsuwEuPB3eyoznu-QGku_UFMhLhMBGNdywMtHLEy0';

const supabase = createClient(supabaseUrl, supabaseKey);

const updates = [
  {
    slug: 'wedding-card-custom',
    design_mode: 'template_form',
    design_config: {
      fields: [
        { id: 'groom', label: "Groom's Name", type: 'text', icon: 'User', placeholder: 'e.g. Rahul' },
        { id: 'bride', label: "Bride's Name", type: 'text', icon: 'User', placeholder: 'e.g. Anjali' },
        { id: 'date', label: 'Wedding Date', type: 'text', icon: 'Calendar', placeholder: 'e.g. 12th Dec 2026' },
        { id: 'venue', label: 'Venue Address', type: 'textarea', icon: 'MapPin', placeholder: 'Enter full venue details...' },
        { id: 'rsvp', label: 'RSVP Contact', type: 'text', icon: 'Phone', placeholder: 'Name & Number' }
      ]
    }
  },
  {
    slug: 'business-card-custom',
    design_mode: 'template_form',
    design_config: {
      fields: [
        { id: 'name', label: 'Full Name', type: 'text', icon: 'User', placeholder: 'e.g. Aryan Sharma' },
        { id: 'title', label: 'Job Title', type: 'text', icon: 'Briefcase', placeholder: 'e.g. Marketing Manager' },
        { id: 'phone', label: 'Phone Number', type: 'text', icon: 'Phone', placeholder: '+91 XXXXX XXXXX' },
        { id: 'email', label: 'Email Address', type: 'email', icon: 'Mail', placeholder: 'name@company.com' },
        { id: 'website', label: 'Website', type: 'text', icon: 'Layout', placeholder: 'www.company.com' },
        { id: 'address', label: 'Office Address', type: 'textarea', icon: 'MapPin', placeholder: 'Enter full office address...' }
      ]
    }
  },
  {
    slug: 'id-card-custom',
    design_mode: 'template_form',
    design_config: {
      fields: [
        { id: 'name', label: 'Employee Name', type: 'text', icon: 'User', placeholder: 'e.g. Vikram Malhotra' },
        { id: 'id_no', label: 'Employee ID', type: 'text', icon: 'Type', placeholder: 'e.g. AZ-2026-001' },
        { id: 'designation', label: 'Designation', type: 'text', icon: 'Briefcase', placeholder: 'e.g. Senior Developer' },
        { id: 'blood_group', label: 'Blood Group', type: 'text', icon: 'Info', placeholder: 'e.g. O+ve' },
        { id: 'phone', label: 'Emergency Contact', type: 'text', icon: 'Phone', placeholder: '+91 XXXXX XXXXX' }
      ]
    }
  },
  {
    slug: 'letter-head-custom',
    design_mode: 'template_form',
    design_config: {
      fields: [
        { id: 'company', label: 'Company Name', type: 'text', icon: 'Layout', placeholder: 'e.g. AtoZ Solutions' },
        { id: 'tagline', label: 'Company Tagline', type: 'text', icon: 'Type', placeholder: 'e.g. Quality Prints, Every Time' },
        { id: 'address', label: 'Office Address', type: 'textarea', icon: 'MapPin', placeholder: 'Enter official address...' },
        { id: 'phone', label: 'Contact Number', type: 'text', icon: 'Phone', placeholder: '+91 XXXXX XXXXX' },
        { id: 'email', label: 'Official Email', type: 'email', icon: 'Mail', placeholder: 'info@company.com' }
      ]
    }
  }
];

async function updateProducts() {
  console.log('Updating design modes in Supabase...');
  
  for (const update of updates) {
    const { error } = await supabase
      .from('products')
      .update({ 
        design_mode: update.design_mode,
        design_config: update.design_config
      })
      .eq('slug', update.slug);
    
    if (error) {
      console.error(`Failed to update ${update.slug}:`, error.message);
    } else {
      console.log(`Successfully updated ${update.slug}`);
    }
  }
  
  console.log('Done.');
}

updateProducts();
