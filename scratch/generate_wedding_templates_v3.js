const fs = require('fs');
const path = require('path');

const CATEGORIES = {
  bc: { name: 'Business Card', width: 1050, height: 600, count: 30, start: 31 },
  id: { name: 'ID Card', width: 600, height: 950, count: 30, start: 11 },
  wc: { name: 'Wedding Card', width: 850, height: 1200, count: 30, start: 11 }, // Portrait focus
  lh: { name: 'Letterhead', width: 850, height: 1100, count: 30, start: 11 }
};

const WEDDING_PALETTES = [
  { main: '#FFFBF5', accent: '#D4AF37', secondary: '#F5E8DD', text: '#5D4037' }, // Gold & Cream
  { main: '#FDFCF0', accent: '#E19898', secondary: '#F2D7D9', text: '#7C3E66' }, // Rose Pink
  { main: '#F8F9F9', accent: '#7FB3D5', secondary: '#D4E6F1', text: '#1B4F72' }, // Dusty Blue
  { main: '#FDFAFE', accent: '#A569BD', secondary: '#EBDEF0', text: '#4A235A' }, // Lavender
];

function generateWeddingSVG(index, side) {
  const palette = WEDDING_PALETTES[index % WEDDING_PALETTES.length];
  const w = 850;
  const h = 1200;

  let svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${w}" height="${h}" fill="${palette.main}"/>`;

  if (side === 'front') {
    // Elegant Border
    svg += `<rect x="40" y="40" width="${w - 80}" height="${h - 80}" stroke="${palette.accent}" stroke-width="2" fill="none"/>`;
    svg += `<rect x="50" y="50" width="${w - 100}" height="${h - 100}" stroke="${palette.accent}" stroke-width="0.5" fill="none"/>`;

    // Ornate Corners
    svg += `<path d="M40 150L40 40L150 40" stroke="${palette.accent}" stroke-width="8" fill="none"/>`;
    svg += `<path d="M${w-150} 40L${w-40} 40L${w-40} 150" stroke="${palette.accent}" stroke-width="8" fill="none"/>`;
    svg += `<path d="M40 ${h-150}L40 ${h-40}L150 ${h-40}" stroke="${palette.accent}" stroke-width="8" fill="none"/>`;
    svg += `<path d="M${w-150} ${h-40}L${w-40} ${h-40}L${w-40} ${h-150}" stroke="${palette.accent}" stroke-width="8" fill="none"/>`;

    // Center Wreath Placeholder (Stylized Circle)
    svg += `<circle cx="${w/2}" cy="${h/2 - 100}" r="220" stroke="${palette.accent}" stroke-width="1" stroke-dasharray="10 5" fill="none" opacity="0.3"/>`;
    svg += `<circle cx="${w/2}" cy="${h/2 - 100}" r="210" stroke="${palette.accent}" stroke-width="0.5" fill="none" opacity="0.5"/>`;

    // Subtle Leaf Patterns (Paths)
    svg += `<path d="M50 50C150 100 200 300 100 400" stroke="${palette.accent}" stroke-opacity="0.1" fill="none"/>`;
    svg += `<path d="M${w-50} 50C${w-150} 100 ${w-200} 300 ${w-100} 400" stroke="${palette.accent}" stroke-opacity="0.1" fill="none"/>`;
  } else {
    // Back side: Simple and matching
    svg += `<rect x="100" y="100" width="${w-200}" height="${h-200}" fill="${palette.secondary}" fill-opacity="0.2"/>`;
    svg += `<path d="M${w/2 - 100} ${h/2}L${w/2 + 100} ${h/2}" stroke="${palette.accent}" stroke-width="1" opacity="0.5"/>`;
  }

  svg += `</svg>`;
  return svg;
}

const WEDDING_MAPPINGS = {
  front: {
    title: { x: 50, y: 15, fontSize: 32, fontWeight: 'normal', align: 'center', color: '#D4AF37' }, // Save the Date
    subtitle: { x: 50, y: 22, fontSize: 24, fontWeight: 'normal', align: 'center', italic: true }, // The Wedding Of
    groom: { x: 50, y: 38, fontSize: 56, fontWeight: 'bold', align: 'center', fontFamily: 'serif' },
    ampersand: { x: 50, y: 46, fontSize: 32, fontWeight: 'normal', align: 'center' },
    bride: { x: 50, y: 54, fontSize: 56, fontWeight: 'bold', align: 'center', fontFamily: 'serif' },
    invite_text: { x: 50, y: 68, fontSize: 18, fontWeight: 'normal', align: 'center' },
    date: { x: 50, y: 78, fontSize: 32, fontWeight: 'bold', align: 'center' },
    time: { x: 50, y: 84, fontSize: 18, fontWeight: 'normal', align: 'center' },
    venue: { x: 50, y: 92, fontSize: 16, fontWeight: 'normal', align: 'center' }
  },
  back: {
    thank_you: { x: 50, y: 50, fontSize: 24, fontWeight: 'normal', align: 'center' }
  }
};

async function generate() {
  console.log('Generating ultra-premium Wedding Templates...');
  
  const mappings = JSON.parse(fs.readFileSync('scratch/template_mappings_v2.json', 'utf8'));

  // Overwrite Wedding Card entries in the mapping and filesystem
  const wcDir = 'public/templates/wc';
  if (!fs.existsSync(wcDir)) fs.mkdirSync(wcDir, { recursive: true });

  mappings.wc = [];
  for (let i = 0; i < CATEGORIES.wc.count; i++) {
    const idx = CATEGORIES.wc.start + i;
    const folder = path.join(wcDir, idx.toString().padStart(2, '0'));
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);

    fs.writeFileSync(path.join(folder, 'front.svg'), generateWeddingSVG(i, 'front'));
    fs.writeFileSync(path.join(folder, 'back.svg'), generateWeddingSVG(i, 'back'));

    mappings.wc.push({
      index: i,
      layout: 'floral_elegant',
      mapping: WEDDING_MAPPINGS.front,
      back_mapping: WEDDING_MAPPINGS.back
    });
  }

  fs.writeFileSync('scratch/template_mappings_v3.json', JSON.stringify(mappings, null, 2));
  console.log('Done generating Wedding V3 assets.');
}

generate();
