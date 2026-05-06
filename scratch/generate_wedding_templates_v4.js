const fs = require('fs');
const path = require('path');

const CATEGORIES = {
  wc: { name: 'Wedding Card', width: 1200, height: 1800, count: 30, start: 11 } // Grand scale
};

const TRADITIONAL_PALETTES = [
  { main: '#991B1B', accent: '#D4AF37', secondary: '#7F1D1D', text: '#FFFFFF' }, // Royal Red & Gold
  { main: '#7E22CE', accent: '#FDE047', secondary: '#581C87', text: '#FFFFFF' }, // Purple & Gold
  { main: '#FDFCF0', accent: '#991B1B', secondary: '#F2D7D9', text: '#991B1B' }, // Cream & Red
  { main: '#166534', accent: '#FACC15', secondary: '#14532D', text: '#FFFFFF' }, // Emerald & Gold
];

function generateIndianWeddingSVG(index, side) {
  const palette = TRADITIONAL_PALETTES[index % TRADITIONAL_PALETTES.length];
  const w = 1200;
  const h = 1800;

  let svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${w}" height="${h}" fill="${palette.main}"/>`;

  // Lord Ganesha Stylized Icon (Path)
  const ganeshaPath = "M600 120C580 120 565 135 565 155C565 175 580 190 600 190C620 190 635 175 635 155C635 135 620 120 600 120ZM600 200C550 200 510 240 510 290C510 310 520 330 530 345C515 365 500 390 500 420C500 475 545 520 600 520C655 520 700 475 700 420C700 390 685 365 670 345C680 330 690 310 690 290C690 240 650 200 600 200ZM600 500C555 500 520 465 520 420C520 400 530 380 545 365L600 430L655 365C670 380 680 400 680 420C680 465 645 500 600 500Z";
  
  if (side === 'front') {
    // 1. Mandala Background (Radial)
    svg += `<circle cx="${w/2}" cy="${h/2}" r="600" stroke="${palette.accent}" stroke-width="1" stroke-dasharray="20 10" opacity="0.1"/>`;
    svg += `<circle cx="${w/2}" cy="${h/2}" r="450" stroke="${palette.accent}" stroke-width="0.5" stroke-dasharray="10 5" opacity="0.15"/>`;

    // 2. Heavy Traditional Border
    svg += `<rect x="60" y="60" width="${w - 120}" height="${h - 120}" stroke="${palette.accent}" stroke-width="12" fill="none"/>`;
    svg += `<rect x="85" y="85" width="${w - 170}" height="${h - 170}" stroke="${palette.accent}" stroke-width="2" fill="none"/>`;

    // 3. Lotus Corners
    const lotus = (x, y, rot) => `<g transform="translate(${x},${y}) rotate(${rot}) scale(1.5)"><path d="M0 -20C5 -10 15 0 0 10C-15 0 -5 -10 0 -20Z" fill="${palette.accent}"/><path d="M-10 -15C-5 -5 5 5 -15 10C-25 5 -15 -5 -10 -15Z" fill="${palette.accent}" opacity="0.7"/><path d="M10 -15C5 -5 -5 5 15 10C25 5 15 -5 10 -15Z" fill="${palette.accent}" opacity="0.7"/></g>`;
    svg += lotus(120, 120, 45);
    svg += lotus(w-120, 120, 135);
    svg += lotus(120, h-120, -45);
    svg += lotus(w-120, h-120, -135);

    // 4. Ganesha Icon at top center
    svg += `<path d="${ganeshaPath}" fill="${palette.accent}" opacity="0.9"/>`;
    
    // 5. Decorative Lines
    svg += `<line x1="${w*0.3}" y1="580" x2="${w*0.7}" y2="580" stroke="${palette.accent}" stroke-width="2"/>`;
    svg += `<line x1="${w*0.3}" y1="1300" x2="${w*0.7}" y2="1300" stroke="${palette.accent}" stroke-width="2"/>`;

  } else {
    // Back Side: Kalash or similar
    svg += `<rect x="150" y="150" width="${w-300}" height="${h-300}" fill="${palette.secondary}" fill-opacity="0.3"/>`;
    svg += `<circle cx="${w/2}" cy="${h/2}" r="100" stroke="${palette.accent}" stroke-width="4" fill="none"/>`;
  }

  svg += `</svg>`;
  return svg;
}

const INDIAN_WEDDING_MAPPINGS = {
  front: {
    symbol_text: { x: 50, y: 15, fontSize: 48, fontWeight: 'bold', align: 'center', color: '#FDE047' }, // e.g. "|| Shubh Vivah ||"
    groom: { x: 50, y: 45, fontSize: 100, fontWeight: 'bold', align: 'center', fontFamily: 'serif' },
    ampersand: { x: 50, y: 52, fontSize: 48, fontWeight: 'normal', align: 'center' },
    bride: { x: 50, y: 60, fontSize: 100, fontWeight: 'bold', align: 'center', fontFamily: 'serif' },
    invite_text: { x: 50, y: 72, fontSize: 28, fontWeight: 'normal', align: 'center' },
    date: { x: 50, y: 82, fontSize: 64, fontWeight: 'bold', align: 'center' },
    venue: { x: 50, y: 92, fontSize: 32, fontWeight: 'normal', align: 'center' }
  },
  back: {
    details: { x: 50, y: 50, fontSize: 40, fontWeight: 'normal', align: 'center' }
  }
};

async function generate() {
  console.log('Generating Grand Indian Wedding Templates...');
  const mappings = { wc: [] };
  const wcDir = 'public/templates/wc';
  if (!fs.existsSync(wcDir)) fs.mkdirSync(wcDir, { recursive: true });

  for (let i = 0; i < CATEGORIES.wc.count; i++) {
    const idx = CATEGORIES.wc.start + i;
    const folder = path.join(wcDir, idx.toString().padStart(2, '0'));
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);

    fs.writeFileSync(path.join(folder, 'front.svg'), generateIndianWeddingSVG(i, 'front'));
    fs.writeFileSync(path.join(folder, 'back.svg'), generateIndianWeddingSVG(i, 'back'));

    mappings.wc.push({
      index: i,
      layout: 'traditional_indian',
      mapping: INDIAN_WEDDING_MAPPINGS.front,
      back_mapping: INDIAN_WEDDING_MAPPINGS.back
    });
  }

  fs.writeFileSync('scratch/template_mappings_v4.json', JSON.stringify(mappings, null, 2));
  console.log('Done generating Indian Wedding V4 assets.');
}

generate();
