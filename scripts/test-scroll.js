const puppeteer = require('puppeteer');
const path = require('path');

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2000));

    // Scroll to #main-feed
    await page.evaluate(() => {
      const el = document.getElementById('main-feed');
      if (el) el.scrollIntoView();
    });

    await new Promise((r) => setTimeout(r, 1000));
    const outPath = path.resolve(__dirname, '..', 'feed_viewport.png');
    await page.screenshot({ path: outPath });
    console.log(`Saved feed screenshot to: ${outPath}`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
}

main();
