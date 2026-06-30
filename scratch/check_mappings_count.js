const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'template_mappings_v3.json'), 'utf8'));

console.log('Keys in JSON:', Object.keys(data));
if (data.wc) {
  console.log(`wc templates count: ${data.wc.length}`);
  const indices = data.wc.map(item => item.index);
  console.log(`wc indices: ${indices.join(', ')}`);
}

if (data.lh) {
  console.log(`lh templates count: ${data.lh.length}`);
  const indices = data.lh.map(item => item.index);
  console.log(`lh indices: ${indices.join(', ')}`);
}
