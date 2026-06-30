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

  console.log('Navigating to letterhead customizer page...');
  await page.goto('http://localhost:3000/customize/letter-head-custom', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  console.log('Waiting 5 seconds for canvas to fully render...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Find all elements
  const elements = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('#template-preview-container > div > div'));
    return divs.map(d => ({
      text: d.innerText?.trim(),
      left: d.style.left,
      top: d.style.top,
      width: d.style.width,
      height: d.style.height
    }));
  });

  console.log('Found elements on Letterhead canvas:', JSON.stringify(elements, null, 2));

  // Target 'A to Z Prints'
  const nameElementSelector = '#template-preview-container > div > div';
  const targetIdx = elements.findIndex(e => e.text && e.text.includes('A to Z Prints'));

  if (targetIdx === -1) {
    console.error('Could not find A to Z Prints on canvas!');
    await browser.close();
    return;
  }

  console.log(`Targeting element index ${targetIdx} ("A to Z Prints")`);
  
  // Get element bounding box
  const divs = await page.$$(nameElementSelector);
  const targetElement = divs[targetIdx];
  const box = await targetElement.boundingBox();
  
  if (!box) {
    console.error('Could not get bounding box of target element!');
    await browser.close();
    return;
  }

  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  // Check what element is at this coordinate
  const elementAtPoint = await page.evaluate((x, y) => {
    const el = document.elementFromPoint(x, y);
    if (!el) return 'null';
    return {
      tagName: el.tagName,
      id: el.id,
      className: el.className
    };
  }, startX, startY);

  console.log('Element exactly at point:', elementAtPoint);

  // Click down
  console.log(`Dragging from (${startX}, ${startY}) to (${startX + 100}, ${startY + 100})`);

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 100, startY + 100, { steps: 10 });
  await page.mouse.up();

  console.log('Drag completed. Waiting 2 seconds...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Get final position
  const finalStyle = await page.evaluate((idx) => {
    const divs = Array.from(document.querySelectorAll('#template-preview-container > div > div'));
    const d = divs[idx];
    return {
      left: d ? d.style.left : null,
      top: d ? d.style.top : null
    };
  }, targetIdx);

  console.log('Final style coords:', finalStyle.left, finalStyle.top);
  
  if (finalStyle.left === elements[targetIdx].left && finalStyle.top === elements[targetIdx].top) {
    console.error('FAIL: Position did not change!');
  } else {
    console.log('SUCCESS: Letterhead element moved successfully!');
  }
  
  await browser.close();
}

run().catch(err => {
  console.error('Testing failed with error:', err);
  process.exit(1);
});
