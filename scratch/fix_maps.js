const fs = require('fs');
const path = 'src/app/admin/products/edit/[slug]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Fix the maps that were broken by )) -> ))
content = content.replace(/            \)\)\s+\n/g, '            ))}\n'); // Line 327 (approx)
content = content.replace(/                             \)\)\s+\n/g, '                             ))}\n'); // Line 517 & 544 (approx)

fs.writeFileSync(path, content);
console.log('Fixed potential broken maps');
