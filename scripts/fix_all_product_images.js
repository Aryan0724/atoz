const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgres://postgres:kh2DY-bZg_RC%26ir@db.fgtxaeyrsrtktazithwl.supabase.co:5432/postgres';
const targetFilePath = path.join(__dirname, '../src/lib/data/mockProducts.ts');

const imageUpdates = {
  'business-card-matt-200': [
    '/images/products/business-card-front.png',
    '/images/products/business-card-back.jpeg',
    '/images/products/business-card-showcase.jpeg'
  ],
  'business-card-uv-200': [
    '/images/products/business-card-front.png',
    '/images/products/business-card-back.jpeg',
    '/images/products/business-card-showcase.jpeg'
  ],
  'letter-head-100': [
    '/images/products/letterhead.png'
  ],
  'pvc-sticker-1000': [
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1000&auto=format'
  ],
  'paper-sticker-1000': [
    'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=1000&auto=format'
  ],
  'flyers-a4-1000': [
    'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=1000&auto=format'
  ],
  'brochure-a4-200': [
    'https://images.unsplash.com/photo-1562564055-71e051d33c19?q=80&w=1000&auto=format'
  ],
  'diary-with-logo-50': [
    '/images/products/notebook.png'
  ],
  't-shirt-50': [
    'https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776262582550-Gemini_Generated_Image_q63cfzq63cfzq63c__1_-removebg-preview.png',
    'https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776262603579-Gemini_Generated_Image_q63cfzq63cfzq63c%20(1).png'
  ],
  'custom-premium-tshirt': [
    'https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776262582550-Gemini_Generated_Image_q63cfzq63cfzq63c__1_-removebg-preview.png',
    'https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776262603579-Gemini_Generated_Image_q63cfzq63cfzq63c%20(1).png'
  ],
  'custom-pen-50': [
    'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1000&auto=format'
  ]
};

async function updateDatabase() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to database.');

    for (const [slug, images] of Object.entries(imageUpdates)) {
      await client.query(
        `UPDATE public.products SET images = $1 WHERE slug = $2`,
        [images, slug]
      );
      console.log(` - Updated DB product images for: ${slug}`);
    }
    console.log('Database product image updates completed successfully.');
  } catch (err) {
    console.error('Failed to update database images:', err);
  } finally {
    await client.end();
  }
}

function updateMockFile() {
  try {
    let fileContent = fs.readFileSync(targetFilePath, 'utf8');
    
    // Parse the file content to locate and modify each slug's images block.
    // Since mockProducts is a giant JSON-like array, we can find:
    // "slug": "<slug>",
    // and then find the closest "images": [ ... ] block around it.
    
    for (const [slug, images] of Object.entries(imageUpdates)) {
      const slugKey = `"slug": "${slug}",`;
      const idx = fileContent.indexOf(slugKey);
      
      if (idx !== -1) {
        // Find the "images": [ block
        const imagesStartIdx = fileContent.indexOf('"images": [', idx - 1500); // look backward first
        const imagesStartIdxForward = fileContent.indexOf('"images": [', idx); // or forward
        
        let targetIdx = -1;
        // Select the one closest to the slug position
        if (imagesStartIdx !== -1 && imagesStartIdxForward !== -1) {
          if (Math.abs(imagesStartIdx - idx) < Math.abs(imagesStartIdxForward - idx)) {
            targetIdx = imagesStartIdx;
          } else {
            targetIdx = imagesStartIdxForward;
          }
        } else if (imagesStartIdx !== -1) {
          targetIdx = imagesStartIdx;
        } else if (imagesStartIdxForward !== -1) {
          targetIdx = imagesStartIdxForward;
        }
        
        if (targetIdx !== -1 && Math.abs(targetIdx - idx) < 1500) {
          const closeBracketIdx = fileContent.indexOf(']', targetIdx);
          if (closeBracketIdx !== -1) {
            const originalBlock = fileContent.substring(targetIdx, closeBracketIdx + 1);
            const replacementBlock = `"images": ${JSON.stringify(images, null, 6).split('\n').join('\n    ')}`;
            fileContent = fileContent.replace(originalBlock, replacementBlock);
            console.log(` - Updated mockProducts.ts images for: ${slug}`);
          }
        }
      } else {
        console.warn(` - Could not find slug ${slug} in mockProducts.ts`);
      }
    }
    
    fs.writeFileSync(targetFilePath, fileContent, 'utf8');
    console.log('mockProducts.ts local file updated successfully.');
  } catch (err) {
    console.error('Failed to update mockProducts.ts:', err);
  }
}

async function main() {
  await updateDatabase();
  updateMockFile();
}

main();
