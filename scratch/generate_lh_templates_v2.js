const fs = require('fs');
const path = require('path');

const PALETTES = [
  { main: '#FFFFFF', accent: '#1E40AF', secondary: '#F3F4F6', text: '#111827' }, // Classic Blue
  { main: '#FFFFFF', accent: '#064E3B', secondary: '#ECFDF5', text: '#111827' }, // Forest Green
  { main: '#FFFFFF', accent: '#4338CA', secondary: '#EEF2FF', text: '#111827' }, // Modern Indigo
  { main: '#FFFFFF', accent: '#B91C1C', secondary: '#FEF2F2', text: '#111827' }, // Corporate Red
  { main: '#FFFFFF', accent: '#D97706', secondary: '#FFFBEB', text: '#111827' }, // Warm Amber
];

function generateSVG(index, styleType, side) {
  const p = PALETTES[index % PALETTES.length];
  const w = 842;  // A4 proportional
  const h = 1191; // A4 proportional

  let svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${w}" height="${h}" fill="${p.main}"/>`;

  if (side === 'front') {
    if (styleType === 'executive') {
       svg += `<rect width="${w}" height="10" fill="${p.accent}"/>`; // Top Line
       svg += `<rect y="${h-80}" width="${w}" height="80" fill="${p.secondary}"/>`; // Footer
       svg += `<circle cx="${w/2}" cy="${h/2}" r="200" stroke="${p.accent}" stroke-width="1" opacity="0.05"/>`; // Watermark
    } else if (styleType === 'sidebar') {
       svg += `<rect width="8" height="${h}" fill="${p.accent}"/>`; // Sidebar line
       svg += `<path d="M0 0 H250 V200 L0 300 Z" fill="${p.accent}" opacity="0.05"/>`; // Corner accent
    } else if (styleType === 'tech') {
       svg += `<rect x="${w-300}" y="0" width="300" height="150" fill="${p.accent}" opacity="0.1"/>`;
       svg += `<rect x="50" y="${h-100}" width="${w-100}" height="2" fill="${p.accent}"/>`; // Bottom Line
    } else if (styleType === 'artistic') {
       svg += `<circle cx="0" cy="0" r="300" fill="${p.accent}" opacity="0.1"/>`;
       svg += `<circle cx="${w}" cy="${h}" r="200" fill="${p.accent}" opacity="0.1"/>`;
    } else {
       svg += `<rect x="40" y="40" width="${w-80}" height="${h-80}" stroke="${p.accent}" stroke-width="1" opacity="0.2"/>`; // Border
       svg += `<rect x="40" y="40" width="200" height="60" fill="${p.accent}" opacity="0.1"/>`; // Logo area
    }
  } else {
    // Letterheads usually don't have a back, but we can add a subtle pattern
    svg += `<rect width="${w}" height="${h}" fill="${p.secondary}" opacity="0.3"/>`;
  }

  svg += `</svg>`;
  return svg;
}

const STYLES = ['executive', 'sidebar', 'tech', 'artistic', 'industrial'];

async function generate() {
  const lhDir = 'public/templates/lh';
  if (!fs.existsSync(lhDir)) fs.mkdirSync(lhDir, { recursive: true });

  for (let i = 0; i < 30; i++) {
    const idx = 11 + i;
    const folder = path.join(lhDir, idx.toString().padStart(2, '0'));
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);

    const style = STYLES[i % STYLES.length];
    fs.writeFileSync(path.join(folder, 'front.svg'), generateSVG(i, style, 'front'));
    fs.writeFileSync(path.join(folder, 'back.svg'), generateSVG(i, style, 'back'));
  }
}

generate();
console.log('Letterhead Templates V2 Generated.');
