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

  console.log('Navigating to ID Card customizer with template 2 (which has a Photo element)...');
  await page.goto('http://localhost:3000/customize/id-card-custom?template=2', {
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

  console.log('Found elements on ID Card canvas:', JSON.stringify(elements, null, 2));

  // Find the 'IMAGE' element (Photo placeholder or logo)
  const nameElementSelector = '#template-preview-container > div > div';
  let targetIdx = elements.findIndex(e => e.text && e.text.includes('IMAGE'));

  if (targetIdx === -1 && elements.length > 0) {
    // If no text says 'IMAGE', fallback to checking innerHTML for img tag or dashed border
    targetIdx = await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll('#template-preview-container > div > div'));
      return divs.findIndex(d => d.querySelector('img') || d.querySelector('svg') || d.innerHTML.includes('Upload'));
    });
  }

  if (targetIdx === -1) {
    console.error('Could not find any image elements to drag on ID Card canvas!');
    await browser.close();
    return;
  }

  console.log(`Targeting element index ${targetIdx} ("${elements[targetIdx].text || 'IMG/Icon'}")`);
  
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
  console.log(`Dragging from (${startX}, ${startY}) to (${startX + 50}, ${startY + 80})`);

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 50, startY + 80, { steps: 10 });
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
    console.log('SUCCESS: ID Card image element moved successfully!');
  }
  
  await browser.close();
}

run().catch(err => {
  console.error('Testing failed with error:', err);
  process.exit(1);
});
