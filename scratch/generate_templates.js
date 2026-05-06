const fs = require('fs');
const path = require('path');

const CATEGORIES = {
  bc: { name: 'Business Card', prefix: 'BC', count: 30, start: 31, w: 1050, h: 600 },
  id: { name: 'ID Card', prefix: 'ID', count: 30, start: 11, w: 600, h: 1050 },
  wc: { name: 'Wedding Card', prefix: 'WC', count: 30, start: 11, w: 600, h: 1050 },
  lh: { name: 'Letterhead', prefix: 'LH', count: 30, start: 11, w: 800, h: 1131 }
};

const COLORS = [
  ['#0F172A', '#1E293B', '#FACC15'], // Slate/Yellow
  ['#1E3A8A', '#2563EB', '#3B82F6'], // Blue
  ['#111827', '#1F2937', '#10B981'], // Dark/Emerald
  ['#FDF2F8', '#FBCFE8', '#EC4899'], // Pink
  ['#F0FDFA', '#CCFBF1', '#0D9488'], // Teal
  ['#FFF7ED', '#FFEDD5', '#F97316'], // Orange
  ['#F5F3FF', '#EDE9FE', '#8B5CF6'], // Violet
  ['#FEF2F2', '#FEE2E2', '#EF4444'], // Red
  ['#ECFDF5', '#D1FAE5', '#059669'], // Green
  ['#FAFAF9', '#F5F5F4', '#44403C'], // Stone
];

function generateSVG(type, index, colors) {
  const { w, h } = CATEGORIES[type];
  const [bg, accent1, accent2] = colors;
  
  let svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${w}" height="${h}" fill="${bg}"/>`;

  // Random geometric patterns based on index
  const patternType = index % 5;
  if (patternType === 0) {
    // Diagonal splits
    svg += `<path d="M0 0L${w} ${h/3}V${h/3 + 50}L0 50V0Z" fill="${accent2}" opacity="0.1"/>`;
    svg += `<path d="M${w} ${h}L0 ${h - h/3}V${h - h/3 - 50}L${w} ${h-50}V${h}Z" fill="${accent2}" opacity="0.1"/>`;
  } else if (patternType === 1) {
    // Circles
    svg += `<circle cx="${w}" cy="0" r="${w/2}" fill="${accent1}" opacity="0.05"/>`;
    svg += `<circle cx="0" cy="${h}" r="${h/3}" fill="${accent2}" opacity="0.05"/>`;
  } else if (patternType === 2) {
    // Rectangles/Stripes
    svg += `<rect x="${w * 0.8}" width="${w * 0.2}" height="${h}" fill="${accent1}" opacity="0.1"/>`;
    svg += `<rect x="${w * 0.78}" width="${w * 0.01}" height="${h}" fill="${accent2}"/>`;
  } else if (patternType === 3) {
    // Corner triangles
    svg += `<path d="M0 0H${w/4}L0 ${h/4}V0Z" fill="${accent1}" opacity="0.2"/>`;
    svg += `<path d="M${w} ${h}H${w - w/4}L${w} ${h - h/4}V${h}Z" fill="${accent2}" opacity="0.2"/>`;
  } else {
    // Wave/Curve
    svg += `<path d="M0 ${h * 0.8}C${w/4} ${h * 0.7} ${w * 0.75} ${h * 0.9} ${w} ${h * 0.8}V${h}H0V${h * 0.8}Z" fill="${accent1}" opacity="0.1"/>`;
  }

  // category specific elements
  if (type === 'id') {
     svg += `<rect x="${w/2 - 100}" y="150" width="200" height="240" rx="12" fill="white" stroke="${accent1}" stroke-width="2" opacity="0.5"/>`;
  } else if (type === 'lh') {
     svg += `<rect x="50" y="40" width="100" height="100" rx="12" fill="${accent1}" opacity="0.1"/>`;
     svg += `<rect x="50" y="1050" width="${w-100}" height="40" rx="8" fill="${accent1}" opacity="0.05"/>`;
  }

  svg += `</svg>`;
  return svg;
}

async function run() {
  for (const [type, cfg] of Object.entries(CATEGORIES)) {
    const baseDir = path.join(process.cwd(), 'public', 'templates', type);
    if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

    for (let i = 0; i < cfg.count; i++) {
      const idx = cfg.start + i;
      const folderName = idx.toString().padStart(2, '0');
      const folderPath = path.join(baseDir, folderName);
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

      const colors = COLORS[i % COLORS.length];
      const svg = generateSVG(type, idx, colors);
      fs.writeFileSync(path.join(folderPath, 'front.svg'), svg);
      
      // Also generate back for BC
      if (type === 'bc') {
        const backSvg = generateSVG(type, idx + 100, colors);
        fs.writeFileSync(path.join(folderPath, 'back.svg'), backSvg);
      }
    }
    console.log(`Generated ${cfg.count} designs for ${cfg.name}`);
  }
}

run();
