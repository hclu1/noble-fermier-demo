import { chromium } from 'playwright-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = 'D:\\Aplli\\Appli Primeurs\\Marketing\\images';

async function main() {
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  // Desktop context
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await desktopContext.newPage();

  console.log('Capturing Desktop Home...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'raw_desktop_home.png') });

  console.log('Capturing Desktop Catalog...');
  await page.goto('http://localhost:5173/catalogue', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'raw_desktop_catalog.png') });

  console.log('Capturing Desktop Product Detail...');
  await page.goto('http://localhost:5173/produit/fraises-gariguette', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'raw_desktop_product.png') });

  console.log('Capturing Desktop Contact...');
  await page.goto('http://localhost:5173/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'raw_desktop_contact.png') });

  // Mobile context
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();

  console.log('Capturing Mobile Home...');
  await mobilePage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, 'raw_mobile_home.png') });

  console.log('Capturing Mobile Catalog...');
  await mobilePage.goto('http://localhost:5173/catalogue', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, 'raw_mobile_catalog.png') });

  console.log('Capturing Mobile Product...');
  await mobilePage.goto('http://localhost:5173/produit/tomates-anciennes', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, 'raw_mobile_product.png') });

  await browser.close();
  console.log('Done capturing screenshots!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
