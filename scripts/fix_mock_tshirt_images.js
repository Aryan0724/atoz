const fs = require('fs');
const path = require('path');

const targetFilePath = path.join(__dirname, '../src/lib/data/mockProducts.ts');

try {
  let content = fs.readFileSync(targetFilePath, 'utf8');

  // Let's replace the hoodie image with the premium cotton t-shirt image for custom-premium-tshirt and t-shirt-50
  // First, let's look for:
  // "slug": "custom-premium-tshirt",
  // followed by images array. But wait, in JS we can use simple string replacement or regex.
  // Let's inspect the target code:
  //   {
  //     "id": "7a08ff4a-91dd-4be4-8531-c8d8f324000d",
  //     "name": "Custom Premium T-Shirt",
  //     "slug": "custom-premium-tshirt",
  //     ...
  //     "images": [
  //       "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776262711210-1000015361792-Beige-BEIGE-1000015361792_01-2100.jpg"
  //     ],

  // Wait! In mockProducts.ts:
  // Line 9531-9533:
  //     "images": [
  //       "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776262711210-1000015361792-Beige-BEIGE-1000015361792_01-2100.jpg"
  //     ],
  // Wait, let's look at what we found in lines 9531-9533. Yes! It was that.
  // Let's replace this images block for custom-premium-tshirt with the premium t-shirt image.
  
  const searchStr1 = `"slug": "custom-premium-tshirt",\n    "description": "100% Organic cotton t-shirt with premium weight and breathable fabric.",\n    "category": "Apparel",\n    "base_price": 599,\n    "moq": 1,\n    "delivery_days": "3-5 Days",\n    "images": [\n      "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776262711210-1000015361792-Beige-BEIGE-1000015361792_01-2100.jpg"\n    ]`;
  const searchStr1CRLF = `"slug": "custom-premium-tshirt",\r\n    "description": "100% Organic cotton t-shirt with premium weight and breathable fabric.",\r\n    "category": "Apparel",\r\n    "base_price": 599,\r\n    "moq": 1,\r\n    "delivery_days": "3-5 Days",\r\n    "images": [\r\n      "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776262711210-1000015361792-Beige-BEIGE-1000015361792_01-2100.jpg"\r\n    ]`;

  const newTshirtImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=2000&auto=format&fit=crop';

  const replaceStr1 = `"slug": "custom-premium-tshirt",\n    "description": "100% Organic cotton t-shirt with premium weight and breathable fabric.",\n    "category": "Apparel",\n    "base_price": 599,\n    "moq": 1,\n    "delivery_days": "3-5 Days",\n    "images": [\n      "${newTshirtImage}"\n    ]`;
  const replaceStr1CRLF = `"slug": "custom-premium-tshirt",\r\n    "description": "100% Organic cotton t-shirt with premium weight and breathable fabric.",\r\n    "category": "Apparel",\r\n    "base_price": 599,\r\n    "moq": 1,\r\n    "delivery_days": "3-5 Days",\r\n    "images": [\r\n      "${newTshirtImage}"\r\n    ]`;

  let updated = false;

  if (content.includes(searchStr1)) {
    content = content.replace(searchStr1, replaceStr1);
    updated = true;
  } else if (content.includes(searchStr1CRLF)) {
    content = content.replace(searchStr1CRLF, replaceStr1CRLF);
    updated = true;
  } else {
    // Try a looser match
    const looseMatch = `"slug": "custom-premium-tshirt",`;
    const idx = content.indexOf(looseMatch);
    if (idx !== -1) {
      console.log('Found loose match for custom-premium-tshirt.');
      // Find "images": [ ... ]
      const imagesIdx = content.indexOf('"images": [', idx);
      if (imagesIdx !== -1 && imagesIdx - idx < 300) {
        const closeBracketIdx = content.indexOf(']', imagesIdx);
        if (closeBracketIdx !== -1) {
          const originalBlock = content.substring(imagesIdx, closeBracketIdx + 1);
          const replacementBlock = `"images": [\n      "${newTshirtImage}"\n    ]`;
          content = content.replace(originalBlock, replacementBlock);
          updated = true;
          console.log('Successfully updated custom-premium-tshirt images via loose matching.');
        }
      }
    }
  }

  // Also replace tshirt-50 images (which we appended earlier, they contain the hoodie image)
  // Let's search for "slug": "t-shirt-50"
  const looseMatch2 = `"slug": "t-shirt-50",`;
  const idx2 = content.indexOf(looseMatch2);
  if (idx2 !== -1) {
    console.log('Found loose match for t-shirt-50.');
    const imagesIdx = content.indexOf('"images": [', idx2);
    if (imagesIdx !== -1 && imagesIdx - idx2 < 300) {
      const closeBracketIdx = content.indexOf(']', imagesIdx);
      if (closeBracketIdx !== -1) {
        const originalBlock = content.substring(imagesIdx, closeBracketIdx + 1);
        const replacementBlock = `"images": [\n      "${newTshirtImage}"\n    ]`;
        content = content.replace(originalBlock, replacementBlock);
        updated = true;
        console.log('Successfully updated t-shirt-50 images via loose matching.');
      }
    }
  }

  if (updated) {
    fs.writeFileSync(targetFilePath, content, 'utf8');
    console.log('mockProducts.ts file updated successfully.');
  } else {
    console.error('No matching records found in mockProducts.ts');
    process.exit(1);
  }
} catch (err) {
  console.error('Error modifying mockProducts.ts:', err);
  process.exit(1);
}
