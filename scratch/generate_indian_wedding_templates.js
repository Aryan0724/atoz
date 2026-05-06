const fs = require('fs');
const path = require('path');

const PALETTES = [
  { main: '#740909', gold: '#FFD700', secondary: '#4A0505', accent: '#FFC800' },
  { main: '#0E3414', gold: '#F3E5AB', secondary: '#051A0A', accent: '#EEDC82' },
  { main: '#FFFFFF', gold: '#D4AF37', secondary: '#F9F6EE', accent: '#C5A028' },
  { main: '#4A235A', gold: '#FAD7A0', secondary: '#2E1537', accent: '#F8C471' },
];

function generateSVG(index, style) {
  const p = PALETTES[index % PALETTES.length];
  const w = 1200;
  const h = 1800;

  let svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<defs>
    <linearGradient id="goldGrad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.gold}" /><stop offset="50%" stop-color="${p.accent}" /><stop offset="100%" stop-color="${p.gold}" />
    </linearGradient>
  </defs>`;

  svg += `<rect width="${w}" height="${h}" fill="${p.main}"/>`;
  
  // High-End Ornate Border (Kept at edges)
  svg += `<rect x="40" y="40" width="${w-80}" height="${h-80}" stroke="url(#goldGrad${index})" stroke-width="12" fill="none"/>`;
  svg += `<rect x="65" y="65" width="${w-130}" height="${h-130}" stroke="url(#goldGrad${index})" stroke-width="2" fill="none" opacity="0.6"/>`;

  // Place motifs in corners or top/bottom ONLY to keep center 10%-90% clear for text
  if (style === 'doli') {
    // Doli at bottom center but very low
    svg += `<path d="M450 1740 L750 1740 L750 1680 L700 1680 L700 1650 L500 1650 L500 1680 L450 1680 Z" fill="url(#goldGrad${index})" opacity="0.8"/>`;
  } else if (style === 'ganesha') {
    // Ganesha at top center but very high
    svg += `<path d="M600 60 Q630 60 650 90 Q670 120 640 150 Q610 180 600 210 Q590 180 560 150 Q530 120 550 90 Q570 60 600 60" fill="url(#goldGrad${index})"/>`;
  } else if (style === 'kalash') {
    // Kalash in top corners
    const drawK = (x, y) => `<path d="M${x-30} ${y} Q${x} ${y-60} ${x+30} ${y} Q${x+40} ${y+50} ${x} ${y+70} Q${x-40} ${y+50} ${x-30} ${y}" fill="url(#goldGrad${index})"/>`;
    svg += drawK(150, 150);
    svg += drawK(1050, 150);
  } else if (style === 'peacock') {
    // Peacock feathers in corners
    svg += `<circle cx="100" cy="100" r="80" fill="url(#goldGrad${index})" opacity="0.2"/>`;
    svg += `<circle cx="1100" cy="100" r="80" fill="url(#goldGrad${index})" opacity="0.2"/>`;
  } else {
    // Mandalas in corners
    const drawM = (x,y) => `<circle cx="${x}" cy="${y}" r="150" stroke="url(#goldGrad${index})" stroke-width="1" opacity="0.2" stroke-dasharray="10 5"/>`;
    svg += drawM(0,0); svg += drawM(w,0); svg += drawM(0,h); svg += drawM(w,h);
  }

  svg += `</svg>`;
  return svg;
}

const STYLES = ['doli', 'ganesha', 'kalash', 'peacock', 'mandala'];

async function generate() {
  const wcDir = 'public/templates/wc';
  if (!fs.existsSync(wcDir)) fs.mkdirSync(wcDir, { recursive: true });
  for (let i = 0; i < 30; i++) {
    const idx = 11 + i;
    const folder = path.join(wcDir, idx.toString().padStart(2, '0'));
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);
    fs.writeFileSync(path.join(folder, 'front.svg'), generateSVG(i, STYLES[i % STYLES.length]));
    fs.writeFileSync(path.join(folder, 'back.svg'), generateSVG(i + 100, 'mandala'));
  }
}
generate();
console.log('V9 Clear Center Assets Generated.');
