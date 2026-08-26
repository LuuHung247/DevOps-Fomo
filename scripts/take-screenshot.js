const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function main() {
  const url = process.argv[2] || 'https://dev-ops-fomo.vercel.app';
  const outName = process.argv[3] || 'latest_preview.png';
  const outPath = path.resolve(__dirname, '..', outName);

  console.log(`Launching headless browser for: ${url}`);
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('Navigating...');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait 2.5s for initial splash intro to dissolve and data to load
    await new Promise((r) => setTimeout(r, 2500));

    console.log('Capturing viewport screenshot...');
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Saved screenshot to: ${outPath}`);
  } catch (err) {
    console.error('Screenshot error:', err);
  } finally {
    await browser.close();
  }
}

main();
