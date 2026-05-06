const fs = require('fs');

const CATEGORIES = {
  bc: { slug: 'business-card-custom', start: 31, count: 30 },
  id: { slug: 'id-card-custom', start: 11, count: 30 },
  wc: { slug: 'wedding-card-custom', start: 11, count: 30 },
  lh: { slug: 'letter-head-custom', start: 11, count: 30 }
};

const mappingsData = JSON.parse(fs.readFileSync('scratch/template_mappings_v2.json', 'utf8'));

async function update() {
  const filePath = 'src/lib/data/mockProducts.ts';
  const content = fs.readFileSync(filePath, 'utf8');
  
  const regex = /export const mockProducts: Product\[\] = (\[[\s\S]*?\]);/;
  const match = content.match(regex);
  if (!match) return;

  let products = JSON.parse(match[1]);

  for (const [type, cat] of Object.entries(CATEGORIES)) {
    const product = products.find(prod => prod.slug === cat.slug);
    if (!product) continue;

    product.color_variants = [];
    product.design_config = { mappings: {}, fields: product.design_config?.fields || [] };
    product.design_mode = 'template_form';

    const items = mappingsData[type];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const idx = cat.start + i;
      const folder = idx.toString().padStart(2, '0');
      
      const newVariant = {
        name: `Premium Elite ${idx}`,
        hex: '#000000',
        wireframe_images: [`/templates/${type}/${folder}/front.svg`]
      };
      
      if (type === 'bc') {
        newVariant.wireframe_images.push(`/templates/${type}/${folder}/back.svg`);
      }

      product.color_variants.push(newVariant);
      product.design_config.mappings[`${i}_0`] = item.mapping;
    }
  }

  const newContent = content.replace(regex, `export const mockProducts: Product[] = ${JSON.stringify(products, null, 2)};`);
  fs.writeFileSync(filePath, newContent);
  console.log('Locally updated mockProducts.ts with V2 mappings');
}

update();
