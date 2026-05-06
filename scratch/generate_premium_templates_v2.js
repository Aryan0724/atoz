const fs = require('fs');
const path = require('path');

const CATEGORIES = {
  bc: { name: 'Business Card', width: 1050, height: 600, count: 30, start: 31 },
  id: { name: 'ID Card', width: 600, height: 950, count: 30, start: 11 },
  wc: { name: 'Wedding Card', width: 800, height: 1200, count: 30, start: 11 },
  lh: { name: 'Letterhead', width: 850, height: 1100, count: 30, start: 11 }
};

const PALETTES = [
  { main: '#0F172A', accent: '#38BDF8', secondary: '#1E293B', text: '#FFFFFF' }, // Midnight Blue
  { main: '#F8FAFC', accent: '#6366F1', secondary: '#E2E8F0', text: '#1E293B' }, // Clean Indigo
  { main: '#111827', accent: '#F43F5E', secondary: '#1F2937', text: '#FFFFFF' }, // Dark Rose
  { main: '#064E3B', accent: '#10B981', secondary: '#065F46', text: '#FFFFFF' }, // Emerald Corporate
  { main: '#FFFFFF', accent: '#000000', secondary: '#F1F5F9', text: '#000000' }, // Stark Minimalist
  { main: '#431407', accent: '#F97316', secondary: '#78350F', text: '#FFFFFF' }, // Earthy Orange
  { main: '#1E1B4B', accent: '#A855F7', secondary: '#312E81', text: '#FFFFFF' }, // Royal Purple
  { main: '#FDF2F8', accent: '#DB2777', secondary: '#FCE7F3', text: '#9D174D' }, // Soft Pink
];

function generateSVG(type, index, layoutType) {
  const cat = CATEGORIES[type];
  const palette = PALETTES[index % PALETTES.length];
  const w = cat.width;
  const h = cat.height;

  let svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">`;
  
  // Background
  svg += `<rect width="${w}" height="${h}" fill="${palette.main}"/>`;

  // Abstract Decoration based on index
  if (index % 3 === 0) {
    // Geometric Shapes
    svg += `<circle cx="${w}" cy="0" r="${w * 0.6}" fill="${palette.accent}" fill-opacity="0.07"/>`;
    svg += `<path d="M0 ${h}L${w * 0.3} ${h}L0 ${h * 0.7}Z" fill="${palette.accent}" fill-opacity="0.1"/>`;
    svg += `<rect x="${w * 0.7}" y="${h * 0.6}" width="${w * 0.4}" height="${h * 0.5}" rx="${w * 0.05}" transform="rotate(-15 ${w * 0.7} ${h * 0.6})" fill="${palette.secondary}" fill-opacity="0.2"/>`;
  } else if (index % 3 === 1) {
    // Accent Lines
    svg += `<rect x="0" y="${h * 0.1}" width="${w}" height="${h * 0.005}" fill="${palette.accent}" fill-opacity="0.3"/>`;
    svg += `<rect x="${w * 0.1}" y="0" width="${w * 0.005}" height="${h}" fill="${palette.accent}" fill-opacity="0.3"/>`;
    svg += `<circle cx="${w * 0.9}" cy="${h * 0.9}" r="${w * 0.15}" stroke="${palette.accent}" stroke-width="2" stroke-opacity="0.2"/>`;
    svg += `<circle cx="${w * 0.9}" cy="${h * 0.9}" r="${w * 0.1}" stroke="${palette.accent}" stroke-width="1" stroke-opacity="0.1"/>`;
  } else {
    // Modern Mesh/Gradient
    svg += `<defs>
      <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.1" />
        <stop offset="100%" stop-color="${palette.secondary}" stop-opacity="0" />
      </linearGradient>
    </defs>`;
    svg += `<rect width="${w}" height="${h}" fill="url(#grad${index})"/>`;
    svg += `<path d="M${w} ${h * 0.2}C${w * 0.8} ${h * 0.4} ${w * 0.9} ${h * 0.7} ${w * 0.5} ${h}" stroke="${palette.accent}" stroke-width="2" stroke-opacity="0.15" fill="none"/>`;
  }

  // Layout-specific visual cues (subtle placeholders/guidelines)
  if (layoutType === 'centered') {
     svg += `<rect x="${w * 0.45}" y="${h * 0.4}" width="${w * 0.1}" height="2" fill="${palette.accent}" fill-opacity="0.2"/>`;
  } else if (layoutType === 'left') {
     svg += `<rect x="${w * 0.08}" y="${h * 0.35}" width="30" height="4" fill="${palette.accent}" fill-opacity="0.4"/>`;
  } else if (layoutType === 'split') {
     svg += `<rect width="${w * 0.3}" height="${h}" fill="${palette.secondary}" fill-opacity="0.1"/>`;
  }

  svg += `</svg>`;
  return svg;
}

// Layout styles and their mappings
const LAYOUT_STYLES = ['centered', 'left', 'split', 'minimal', 'bold'];

const MAPPINGS = {
  bc: {
    centered: {
      name: { x: 50, y: 48, fontSize: 32, fontWeight: 'bold', align: 'center' },
      title: { x: 50, y: 58, fontSize: 16, fontWeight: 'normal', align: 'center' },
      phone: { x: 50, y: 75, fontSize: 12, fontWeight: 'normal', align: 'center' },
      email: { x: 50, y: 82, fontSize: 12, fontWeight: 'normal', align: 'center' },
      logo: { x: 45, y: 20, w: 10, h: 10 }
    },
    left: {
      name: { x: 10, y: 45, fontSize: 36, fontWeight: 'bold', align: 'left' },
      title: { x: 10, y: 55, fontSize: 18, fontWeight: 'normal', align: 'left' },
      phone: { x: 10, y: 78, fontSize: 12, fontWeight: 'normal', align: 'left' },
      email: { x: 10, y: 85, fontSize: 12, fontWeight: 'normal', align: 'left' },
      logo: { x: 80, y: 15, w: 12, h: 12 }
    },
    split: {
      name: { x: 40, y: 45, fontSize: 32, fontWeight: 'bold', align: 'left' },
      title: { x: 40, y: 55, fontSize: 16, fontWeight: 'normal', align: 'left' },
      phone: { x: 40, y: 75, fontSize: 12, fontWeight: 'normal', align: 'left' },
      email: { x: 40, y: 82, fontSize: 12, fontWeight: 'normal', align: 'left' },
      logo: { x: 5, y: 40, w: 20, h: 20 }
    }
  },
  id: {
    centered: {
      name: { x: 50, y: 65, fontSize: 28, fontWeight: 'bold', align: 'center' },
      id_no: { x: 50, y: 72, fontSize: 14, fontWeight: 'normal', align: 'center' },
      designation: { x: 50, y: 78, fontSize: 14, fontWeight: 'bold', align: 'center' },
      logo: { x: 40, y: 10, w: 20, h: 10 }
    }
  },
  wc: {
    centered: {
      groom: { x: 50, y: 35, fontSize: 48, fontWeight: 'bold', align: 'center' },
      bride: { x: 50, y: 50, fontSize: 48, fontWeight: 'bold', align: 'center' },
      date: { x: 50, y: 65, fontSize: 20, fontWeight: 'normal', align: 'center' },
      venue: { x: 50, y: 80, fontSize: 16, fontWeight: 'normal', align: 'center' }
    }
  },
  lh: {
    top: {
      company: { x: 50, y: 10, fontSize: 24, fontWeight: 'bold', align: 'center' },
      address: { x: 50, y: 92, fontSize: 10, fontWeight: 'normal', align: 'center' },
      phone: { x: 20, y: 92, fontSize: 10, fontWeight: 'normal', align: 'left' },
      email: { x: 80, y: 92, fontSize: 10, fontWeight: 'normal', align: 'right' },
      logo: { x: 10, y: 8, w: 10, h: 8 }
    }
  }
};

async function generate() {
  console.log('Generating high-quality premium templates...');
  
  const allMappings = {};

  for (const [type, cat] of Object.entries(CATEGORIES)) {
    allMappings[type] = [];
    const dir = path.join('public', 'templates', type);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    for (let i = 0; i < cat.count; i++) {
      const idx = cat.start + i;
      const folder = path.join(dir, idx.toString().padStart(2, '0'));
      if (!fs.existsSync(folder)) fs.mkdirSync(folder);

      const layoutIdx = i % LAYOUT_STYLES.length;
      const layoutStyle = LAYOUT_STYLES[layoutIdx];
      const mappingKey = MAPPINGS[type][layoutStyle] ? layoutStyle : Object.keys(MAPPINGS[type])[0];

      const frontSvg = generateSVG(type, i, layoutStyle);
      fs.writeFileSync(path.join(folder, 'front.svg'), frontSvg);

      if (type === 'bc') {
        const backSvg = generateSVG(type, i + 100, 'centered'); // Different pattern for back
        fs.writeFileSync(path.join(folder, 'back.svg'), backSvg);
      }

      allMappings[type].push({
        index: i,
        layout: layoutStyle,
        mapping: MAPPINGS[type][mappingKey]
      });
    }
  }

  fs.writeFileSync('scratch/template_mappings_v2.json', JSON.stringify(allMappings, null, 2));
  console.log('Done generating assets and mappings.');
}

generate();
