const fs = require('fs');
const path = require('path');

const PALETTES = [
  { main: '#1E3A8A', accent: '#3B82F6', secondary: '#DBEAFE', text: '#FFFFFF' }, 
  { main: '#111827', accent: '#F59E0B', secondary: '#374151', text: '#FFFFFF' }, 
  { main: '#064E3B', accent: '#10B981', secondary: '#D1FAE5', text: '#FFFFFF' }, 
  { main: '#4C1D95', accent: '#8B5CF6', secondary: '#EDE9FE', text: '#FFFFFF' }, 
  { main: '#FFFFFF', accent: '#EF4444', secondary: '#F3F4F6', text: '#111827' }, 
];

function generateSVG(index, styleType, side) {
  const p = PALETTES[index % PALETTES.length];
  const w = 800;
  const h = 1200;

  let svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${w}" height="${h}" fill="${p.main === '#FFFFFF' ? '#F9FAFB' : p.main}"/>`;

  if (side === 'front') {
    if (styleType === 'minimalist') {
       // Bold Left Sidebar
       svg += `<rect width="200" height="${h}" fill="${p.accent}" opacity="0.2"/>`;
       svg += `<rect x="50" y="50" width="100" height="100" rx="10" fill="${p.accent}"/>`; // Logo
       svg += `<rect x="100" y="250" width="400" height="400" rx="20" stroke="${p.accent}" stroke-width="8" fill="white"/>`; // Photo
    } else if (styleType === 'tech') {
       // Hexagonal patterns
       svg += `<path d="M0 0 L400 0 L0 400 Z" fill="${p.accent}" opacity="0.1"/>`;
       svg += `<path d="M${w} ${h} L${w-400} ${h} L${w} ${h-400} Z" fill="${p.accent}" opacity="0.1"/>`;
       svg += `<circle cx="400" cy="400" r="220" stroke="${p.accent}" stroke-width="15" stroke-dasharray="20 10"/>`; // Photo ring
    } else if (styleType === 'creative') {
       // Angular split
       svg += `<path d="M0 0 H${w} V300 L0 500 Z" fill="${p.accent}"/>`;
       svg += `<rect x="50" y="350" width="350" height="350" rx="175" fill="white" stroke="${p.accent}" stroke-width="10"/>`; // Photo circle
    } else if (styleType === 'corporate') {
       // Classic clean
       svg += `<rect y="0" width="${w}" height="400" fill="${p.accent}" opacity="0.05"/>`;
       svg += `<rect x="250" y="250" width="300" height="350" rx="8" stroke="${p.accent}" stroke-width="2" fill="white"/>`; // Photo
       svg += `<rect x="50" y="50" width="700" height="10" fill="${p.accent}"/>`; // Top line
    } else {
       // Abstract fluid
       svg += `<circle cx="0" cy="0" r="500" fill="${p.accent}" opacity="0.1"/>`;
       svg += `<circle cx="${w}" cy="${h}" r="400" fill="${p.accent}" opacity="0.1"/>`;
       svg += `<rect x="150" y="300" width="500" height="400" rx="100" stroke="${p.accent}" stroke-width="5" stroke-dasharray="5 5"/>`; // Photo
    }
  } else {
    // Back side always clean with QR zone
    svg += `<rect x="50" y="50" width="${w-100}" height="10" fill="${p.accent}" opacity="0.3"/>`;
    svg += `<rect x="250" y="850" width="300" height="300" rx="20" fill="${p.secondary}" opacity="0.5"/>`;
  }

  svg += `</svg>`;
  return svg;
}

const STYLES = ['minimalist', 'tech', 'creative', 'corporate', 'abstract'];

async function generate() {
  const idDir = 'public/templates/id';
  if (!fs.existsSync(idDir)) fs.mkdirSync(idDir, { recursive: true });

  for (let i = 0; i < 30; i++) {
    const idx = 11 + i;
    const folder = path.join(idDir, idx.toString().padStart(2, '0'));
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);

    const style = STYLES[i % STYLES.length];
    fs.writeFileSync(path.join(folder, 'front.svg'), generateSVG(i, style, 'front'));
    fs.writeFileSync(path.join(folder, 'back.svg'), generateSVG(i, style, 'back'));
  }
}

generate();
console.log('V3 Unique ID Templates Generated.');
