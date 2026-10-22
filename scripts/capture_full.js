import { chromium } from 'playwright-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = 'D:\\Aplli\\Appli Primeurs\\Marketing\\images';

async function main() {
  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // 1. Login
  console.log('Logging in as demo admin...');
  await page.goto('http://localhost:5173/connexion', { waitUntil: 'networkidle' });
  await page.fill('#email', 'marie.dupont@exemple.fr');
  await page.fill('#password', 'demo1234');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);

  // 2. Admin Products
  console.log('Capturing Admin Products...');
  await page.goto('http://localhost:5173/admin/produits', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'raw_admin_products.png') });

  // 3. Admin Orders
  console.log('Capturing Admin Orders...');
  await page.goto('http://localhost:5173/admin/commandes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'raw_admin_orders.png') });

  // 4. Add items to cart & capture Cart
  console.log('Adding product to cart...');
  await page.goto('http://localhost:5173/produit/fraises-gariguette', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  // Click add to cart button
  const addBtn = await page.$('button:has-text("Ajouter au panier")');
  if (addBtn) await addBtn.click();
  await page.waitForTimeout(500);

  await page.goto('http://localhost:5173/panier', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'raw_cart_page.png') });

  // 5. Checkout
  console.log('Capturing Checkout...');
  await page.goto('http://localhost:5173/commande', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'raw_checkout_page.png') });

  // 6. Admin Perso (customization panel)
  console.log('Capturing Admin Perso...');
  // set localStorage auth for admin-perso
  await page.evaluate(() => {
    localStorage.setItem('admin_perso_logged_in', 'true');
  });
  await page.goto('http://localhost:5173/admin-perso', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'raw_admin_perso.png') });

  await browser.close();
  console.log('Done capturing full suite!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
