const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/lib/data/mockProducts.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Remove "bulk_pricing": [], lines
content = content.replace(/^[ \t]*"bulk_pricing": \[\],[ \t]*\r?\n/gm, '');

fs.writeFileSync(filePath, content);
console.log('Cleaned up bulk_pricing from mockProducts.ts');
