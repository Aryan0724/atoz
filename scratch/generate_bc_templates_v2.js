const fs = require('fs');
const path = require('path');

const PALETTES = [
  { main: '#1A1A1A', accent: '#D4AF37', secondary: '#333333', text: '#FFFFFF' }, // Luxury Dark Gold
  { main: '#F3F4F6', accent: '#2563EB', secondary: '#DBEAFE', text: '#111827' }, // Professional Blue/White
  { main: '#0F172A', accent: '#10B981', secondary: '#1E293B', text: '#FFFFFF' }, // Tech Night Green
  { main: '#FFFFFF', accent: '#EC4899', secondary: '#FDF2F8', text: '#111827' }, // Creative Pink
  { main: '#1E3A8A', accent: '#F97316', secondary: '#2563EB', text: '#FFFFFF' }, // Industrial Orange/Blue
];

function generateSVG(index, styleType, side) {
  const p = PALETTES[index % PALETTES.length];
  const w = 1050; // 3.5 * 300
  const h = 600;  // 2 * 300

  let svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${w}" height="${h}" fill="${p.main}"/>`;

  if (side === 'front') {
    if (styleType === 'luxury') {
       svg += `<rect x="50" y="50" width="${w-100}" height="${h-100}" stroke="${p.accent}" stroke-width="2"/>`;
       svg += `<circle cx="${w/2}" cy="${h/2 - 50}" r="60" fill="${p.accent}" opacity="0.2"/>`; // Logo spot
    } else if (styleType === 'split') {
       svg += `<rect width="${w/3}" height="${h}" fill="${p.accent}" opacity="0.1"/>`;
       svg += `<rect x="50" y="${h/2-50}" width="100" height="100" rx="10" fill="${p.accent}"/>`; // Logo spot
    } else if (styleType === 'tech') {
       svg += `<path d="M0 0 L${w/2} 0 L0 ${h/2} Z" fill="${p.accent}" opacity="0.1"/>`;
       svg += `<path d="M${w} ${h} L${w/2} ${h} L${w} ${h/2} Z" fill="${p.accent}" opacity="0.1"/>`;
       svg += `<rect x="${w-200}" y="50" width="150" height="150" rx="4" fill="${p.accent}" opacity="0.2"/>`; // Logo spot
    } else if (styleType === 'creative') {
       svg += `<circle cx="0" cy="${h}" r="300" fill="${p.accent}" opacity="0.1"/>`;
       svg += `<rect x="100" y="100" width="120" height="120" rx="60" fill="${p.accent}"/>`; // Logo spot
    } else {
       svg += `<path d="M0 0 H${w} V100 L0 250 Z" fill="${p.accent}" opacity="0.2"/>`;
       svg += `<rect x="${w/2-60}" y="150" width="120" height="120" fill="${p.accent}" opacity="0.3"/>`; // Logo spot
    }
  } else {
    // Back side decoration
    svg += `<rect x="${w-300}" y="0" width="300" height="${h}" fill="${p.accent}" opacity="0.05"/>`;
    svg += `<circle cx="50" cy="50" r="100" fill="${p.accent}" opacity="0.1"/>`;
  }

  svg += `</svg>`;
  return svg;
}

const STYLES = ['luxury', 'split', 'tech', 'creative', 'industrial'];

async function generate() {
  const bcDir = 'public/templates/bc';
  if (!fs.existsSync(bcDir)) fs.mkdirSync(bcDir, { recursive: true });

  for (let i = 0; i < 30; i++) {
    const idx = 11 + i;
    const folder = path.join(bcDir, idx.toString().padStart(2, '0'));
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);

    const style = STYLES[i % STYLES.length];
    fs.writeFileSync(path.join(folder, 'front.svg'), generateSVG(i, style, 'front'));
    fs.writeFileSync(path.join(folder, 'back.svg'), generateSVG(i, style, 'back'));
  }
}

generate();
console.log('Business Card Templates V2 Generated.');
