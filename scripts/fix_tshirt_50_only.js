const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/lib/data/mockProducts.ts');

try {
  let content = fs.readFileSync(file, 'utf8');
  const search = `"slug": "t-shirt-50",\n      "description": "Premium Cotton T-Shirts (set of 50). High-comfort 180GSM combed cotton, double stitched, with custom front/back printing.",\n      "category": "Apparel",\n      "base_price": 18999,\n      "moq": 1,\n      "delivery_days": "7-10 Days",\n      "images": [\n      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=2000&auto=format&fit=crop"\n    ]`;
  const searchCRLF = `"slug": "t-shirt-50",\r\n      "description": "Premium Cotton T-Shirts (set of 50). High-comfort 180GSM combed cotton, double stitched, with custom front/back printing.",\r\n      "category": "Apparel",\r\n      "base_price": 18999,\r\n      "moq": 1,\r\n      "delivery_days": "7-10 Days",\r\n      "images": [\r\n      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=2000&auto=format&fit=crop"\r\n    ]`;

  const replacement = `"slug": "t-shirt-50",\n      "description": "Premium Cotton T-Shirts (set of 50). High-comfort 180GSM combed cotton, double stitched, with custom front/back printing.",\n      "category": "Apparel",\n      "base_price": 18999,\n      "moq": 1,\n      "delivery_days": "7-10 Days",\n      "images": [\n            "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776262582550-Gemini_Generated_Image_q63cfzq63cfzq63c__1_-removebg-preview.png",\n            "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776262603579-Gemini_Generated_Image_q63cfzq63cfzq63c%20(1).png"\n      ]`;

  if (content.includes(search)) {
    content = content.replace(search, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed t-shirt-50 with LF');
  } else if (content.includes(searchCRLF)) {
    content = content.replace(searchCRLF, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed t-shirt-50 with CRLF');
  } else {
    console.log('Could not find exact block, using loose matching.');
    const looseKey = '"slug": "t-shirt-50",';
    const idx = content.indexOf(looseKey);
    if (idx !== -1) {
      const imagesIdx = content.indexOf('"images": [', idx);
      const closeBracketIdx = content.indexOf(']', imagesIdx);
      const originalBlock = content.substring(imagesIdx, closeBracketIdx + 1);
      const replacementBlock = `"images": [
            "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776262582550-Gemini_Generated_Image_q63cfzq63cfzq63c__1_-removebg-preview.png",
            "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776262603579-Gemini_Generated_Image_q63cfzq63cfzq63c%20(1).png"
      ]`;
      content = content.replace(originalBlock, replacementBlock);
      fs.writeFileSync(file, content, 'utf8');
      console.log('Fixed t-shirt-50 with loose match.');
    }
  }
} catch (e) {
  console.error('Error fixing t-shirt-50:', e);
}
