const fs = require('fs');
const content = fs.readFileSync('src/app/admin/products/edit/[slug]/page.tsx', 'utf8');
let balance = 0;
for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') balance++;
    if (content[i] === '}') balance--;
}
console.log('Balance:', balance);
