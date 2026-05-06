const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

async function seed() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const url = env.split('\n').find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL=')).split('=')[1].trim();
  const key = env.split('\n').find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')).split('=')[1].trim();

  const supabase = createClient(url, key);

  const config = {
    hero: {
      title: "Architects of <span class='italic text-brand-gold font-medium'>Legacy.</span>",
      subtitle: "We don't just put ink on paper. We translate corporate identity into tangible assets that carry weight, texture, and authority."
    },
    philosophy: [
      { title: "Obsessive Precision", desc: "In our world, a millimeter is a mile. We obsess over the grain direction, the ink density, and the foil alignment." },
      { title: "Tangible Authority", desc: "Digital is fleeting. Print is permanent. We create assets that sit on desks, stay in pockets, and remain in minds." },
      { title: "Future Heritage", desc: "We combine old-world letterpress soul with new-world digital speed. Creating artifacts today that will define your corporate history tomorrow." }
    ],
    timeline: [
      { year: '2015', title: 'Inception', desc: 'Started as a boutique design studio in New Delhi with a single vintage Heidelberg and a vision for uncompromised quality.', img: 'https://images.unsplash.com/photo-1560416313-414b33c856a9?q=80&w=1974&auto=format&fit=crop' },
      { year: '2018', title: 'Expansion', desc: 'Integrated end-to-end logistics. Began serving pan-India corporate giants with seamless kitting solutions.', img: 'https://images.unsplash.com/photo-1598301257982-0cf014dcc523?q=80&w=2070&auto=format&fit=crop' },
      { year: '2022', title: 'Eco-Luxe', desc: 'Launched our sustainable line. Zero-plastic packaging and recycled materials became a core offering.', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b09?q=80&w=2074&auto=format&fit=crop' },
      { year: '2026', title: 'The Future', desc: 'Integrating AI-driven design personalization and expanding our global footprint to 15 countries.', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop' }
    ],
    team: [
      { name: 'Richa Jain', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop' },
      { name: 'Aman Verma', role: 'Operations Head', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop' },
      { name: 'Sneha Kapoor', role: 'Design Lead', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop' },
      { name: 'Rahul Mehta', role: 'Marketing', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop' }
    ],
    quote: {
      text: "We don't build for the transaction. We build for the legacy. Every print that leaves our press is a testament to permanence in a temporary world.",
      author: "Richa Jain",
      role: "Founder, ATOZPRINTS"
    }
  };

  const { data, error } = await supabase
    .from('site_settings')
    .upsert({ id: 'cms_pages', config });

  if (error) {
    console.error('Error seeding CMS:', error);
  } else {
    console.log('CMS seeded successfully!');
  }
}

seed();
