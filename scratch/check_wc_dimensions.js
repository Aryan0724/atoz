const fs = require('fs');
const path = require('path');

const wcDir = path.join(__dirname, '../public/templates/wc');
for (let i = 1; i <= 10; i++) {
  const folder = String(i).padStart(2, '0');
  const file = path.join(wcDir, folder, 'front.svg');
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const svgTag = content.match(/<svg[^>]+>/);
    console.log(`wc/${folder}: ${svgTag ? svgTag[0] : 'No SVG tag found'}`);
  } else {
    console.log(`wc/${folder}: front.svg not found`);
  }
}
