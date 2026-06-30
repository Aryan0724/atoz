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
    console.log(`[PAGE CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[PAGE ERROR] ${err.toString()}`);
  });

  // 1. Check Wedding Cards
  console.log('Navigating to wedding card customizer...');
  await page.goto('http://localhost:3000/customize/wedding-card-custom', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  const wcImg = await page.evaluate(() => {
    const img = document.querySelector('#template-preview-container img');
    return img ? img.getAttribute('src') : null;
  });
  console.log('Wedding Card template background src:', wcImg);

  // 2. Check Letterheads
  console.log('\nNavigating to letterhead customizer...');
  await page.goto('http://localhost:3000/customize/letter-head-custom', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  const lhImg = await page.evaluate(() => {
    const img = document.querySelector('#template-preview-container img');
    return img ? img.getAttribute('src') : null;
  });
  console.log('Letterhead template background src:', lhImg);

  await browser.close();
  console.log('\nDone!');
}

run().catch(console.error);
