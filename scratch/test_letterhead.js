const puppeteer = require('puppeteer');

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('Error') || msg.text().includes('[LOG]')) {
      console.log(`[PAGE] ${msg.type().toUpperCase()}: ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    console.error(`[PAGE ERROR] ${err.toString()}`);
  });

  console.log('Navigating to letter-head-custom customizer...');
  await page.goto('http://localhost:3000/customize/letter-head-custom', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  console.log('Waiting 6s for canvas to render...');
  await new Promise(resolve => setTimeout(resolve, 6000));

  // Screenshot it
  await page.screenshot({ path: 'scratch/lh_test.png', fullPage: false });
  console.log('Screenshot saved to scratch/lh_test.png');

  // Check what elements are on canvas
  const elements = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('#template-preview-container > div > div'));
    return divs.map(d => ({
      text: d.innerText?.trim().substring(0, 60),
      left: d.style.left,
      top: d.style.top,
      width: d.style.width,
      height: d.style.height,
    }));
  });

  console.log('\nCanvas elements found:', elements.length);
  elements.forEach((el, i) => console.log(`  ${i}: "${el.text}" at (${el.left}, ${el.top})`));

  // Check if template preview image exists
  const previewImg = await page.evaluate(() => {
    const img = document.querySelector('#template-preview-container img');
    return img ? { src: img.getAttribute('src')?.substring(0, 100), complete: img.complete } : null;
  });
  console.log('\nPreview image:', previewImg);

  // Check if the template selector buttons exist
  const designSelectors = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const designBtns = buttons.filter(b => b.textContent?.includes('Executive') || b.textContent?.includes('Sidebar') || b.textContent?.includes('Tech') || b.textContent?.includes('Artistic'));
    return designBtns.map(b => b.textContent?.trim().substring(0, 30));
  });
  console.log('\nDesign selector buttons found:', designSelectors);

  // Check for any React error boundaries
  const hasError = await page.evaluate(() => {
    return document.body.innerHTML.includes('Something went wrong') || 
           document.body.innerHTML.includes('Application error') ||
           document.body.innerHTML.includes('Error:');
  });
  console.log('\nHas React error:', hasError);

  await browser.close();
  console.log('\nDone!');
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
