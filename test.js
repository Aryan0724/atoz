const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  await page.goto('http://localhost:3000/products');
  await page.waitForSelector('a[href^="/products/"]');
  await page.click('a[href^="/products/"]');
  
  await page.waitForFunction(() => {
    return Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('Add to Cart'));
  });
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const addToCart = btns.find(b => b.textContent.includes('Add to Cart'));
    if(addToCart) addToCart.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  await page.goto('http://localhost:3000/checkout');
  await new Promise(r => setTimeout(r, 2000));
  
  await page.type('input[name="fullName"]', 'Test User');
  await page.type('input[name="email"]', 'test@test.com');
  await page.type('input[name="phone"]', '9999999999');
  await page.type('textarea[name="address"]', 'Test Address');
  await page.type('input[name="city"]', 'Test City');
  await page.type('input[name="state"]', 'Test State');
  await page.type('input[name="pincode"]', '123456');
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const reviewBtn = btns.find(b => b.textContent.includes('Step Two: Review'));
    if(reviewBtn) reviewBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const paymentBtn = btns.find(b => b.textContent.includes('Step Three: Payment'));
    if(paymentBtn) paymentBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const codBtn = btns.find(b => b.textContent.includes('Cash on Delivery') && !b.textContent.includes('Confirm'));
    if(codBtn) codBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const confirmBtn = btns.find(b => b.textContent.includes('Confirm COD Order'));
    if(confirmBtn) confirmBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();
