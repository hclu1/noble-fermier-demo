import { chromium } from 'playwright-core';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const IMAGES_DIR = 'D:\\Aplli\\Appli Primeurs\\Marketing\\images';

function getBase64(filename) {
  const filePath = path.join(IMAGES_DIR, filename);
  const data = fs.readFileSync(filePath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

async function renderVisual(browser, width, height, htmlContent, outputName) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });

  await page.setContent(htmlContent, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const pngPath = path.join(IMAGES_DIR, `${outputName}.png`);
  const webpPath = path.join(IMAGES_DIR, `${outputName}.webp`);

  await page.screenshot({ path: pngPath, type: 'png' });
  await page.close();

  // Convert to WebP using ffmpeg
  try {
    execSync(`ffmpeg -y -i "${pngPath}" -quality 90 "${webpPath}"`, { stdio: 'ignore' });
    console.log(`Generated: ${outputName}.png and ${outputName}.webp`);
  } catch (err) {
    console.error(`Error converting ${outputName} to webp:`, err);
  }
}

async function main() {
  const rawHome = getBase64('raw_desktop_home.png');
  const rawCatalog = getBase64('raw_desktop_catalog.png');
  const rawProduct = getBase64('raw_desktop_product.png');
  const rawMobileHome = getBase64('raw_mobile_home.png');
  const rawMobileCat = getBase64('raw_mobile_catalog.png');
  const rawAdminProd = getBase64('raw_admin_products.png');
  const rawCart = getBase64('raw_cart_page.png');

  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  // Common CSS styles
  const commonStyles = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #143017;
      color: #fff;
      overflow: hidden;
      width: 100%;
      height: 100%;
      position: relative;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 999px;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: #bbf7d0;
      text-transform: uppercase;
    }
    .mockup-desktop {
      background: #1e293b;
      border-radius: 12px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .mockup-desktop-header {
      background: #0f172a;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .mockup-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #eab308; }
    .dot-green { background: #22c55e; }
    .mockup-phone {
      background: #090d16;
      border-radius: 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 8px #1e293b, 0 0 0 10px rgba(255,255,255,0.15);
      overflow: hidden;
      position: relative;
    }
  `;

  // 1. HERO BANNER 1 (1920x1080)
  const hero1Html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        ${commonStyles}
        .hero-container {
          width: 1920px;
          height: 1080px;
          display: flex;
          align-items: center;
          padding: 80px 100px;
          background: radial-gradient(circle at 80% 30%, #1f5024 0%, #0d210f 100%);
          position: relative;
        }
        .left-col {
          flex: 1;
          max-width: 720px;
          z-index: 2;
        }
        .title {
          font-size: 62px;
          line-height: 1.15;
          font-weight: 800;
          color: #ffffff;
          margin: 24px 0;
        }
        .title span {
          color: #4ade80;
          background: linear-gradient(135deg, #4ade80, #a3e635);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtitle {
          font-size: 22px;
          line-height: 1.6;
          color: #d1fae5;
          margin-bottom: 36px;
        }
        .features-list {
          display: flex;
          gap: 20px;
          margin-bottom: 40px;
        }
        .feat-item {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 12px 18px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          color: #f0fdf4;
        }
        .footer-note {
          font-size: 16px;
          color: #86efac;
          font-weight: 600;
        }
        .right-col {
          flex: 1.2;
          position: relative;
          height: 800px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .desktop-preview {
          width: 820px;
          height: 520px;
          transform: perspective(1000px) rotateY(-8deg) rotateX(4deg);
          position: absolute;
          right: 80px;
          top: 100px;
        }
        .phone-preview {
          width: 270px;
          height: 550px;
          position: absolute;
          right: 20px;
          bottom: 40px;
          z-index: 10;
          transform: perspective(1000px) rotateY(-5deg) rotateX(2deg);
        }
      </style>
    </head>
    <body>
      <div class="hero-container">
        <div class="left-col">
          <div class="badge">🍓 Solution E-Commerce Prête à Vendre</div>
          <h1 class="title">L'application e-commerce dédiée aux <span>Primeurs & Maraîchers</span></h1>
          <p class="subtitle">Catalogue de saison, gestion des stocks, click-and-collect et retrait magasin. Offrez à vos clients la fraîcheur de vos étals en quelques clics.</p>
          <div class="features-list">
            <div class="feat-item">🥕 Vente au kg & à la pièce</div>
            <div class="feat-item">📦 Click & Collect direct</div>
            <div class="feat-item">⚙️ 100% Personnalisable</div>
          </div>
          <div class="footer-note">Disponible immédiatement sur appalacarte.fr</div>
        </div>
        <div class="right-col">
          <div class="mockup-desktop desktop-preview">
            <div class="mockup-desktop-header">
              <div class="mockup-dot dot-red"></div>
              <div class="mockup-dot dot-yellow"></div>
              <div class="mockup-dot dot-green"></div>
              <span style="font-size: 12px; color: #94a3b8; margin-left: 10px;">boutique-primeur.fr</span>
            </div>
            <img src="${rawHome}" style="width: 100%; height: 100%; object-fit: cover; object-position: top;">
          </div>
          <div class="mockup-phone phone-preview">
            <img src="${rawMobileHome}" style="width: 100%; height: 100%; object-fit: cover; object-position: top;">
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  await renderVisual(browser, 1920, 1080, hero1Html, 'hero_banner_1');

  // 2. HERO BANNER 2 (1920x1080) - Focus Admin & Fonctionnalités
  const hero2Html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        ${commonStyles}
        .hero-container {
          width: 1920px;
          height: 1080px;
          display: flex;
          align-items: center;
          padding: 80px 100px;
          background: radial-gradient(circle at 20% 40%, #173b1b 0%, #08160a 100%);
          position: relative;
        }
        .left-col {
          flex: 1.3;
          position: relative;
          height: 800px;
          display: flex;
          align-items: center;
        }
        .admin-preview {
          width: 780px;
          height: 520px;
          transform: perspective(1000px) rotateY(8deg) rotateX(3deg);
          position: absolute;
          left: 0;
          top: 110px;
          z-index: 2;
        }
        .cart-preview {
          width: 320px;
          height: 480px;
          position: absolute;
          left: 560px;
          bottom: 60px;
          z-index: 10;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
          overflow: hidden;
        }
        .right-col {
          flex: 1;
          max-width: 680px;
          padding-left: 60px;
          z-index: 2;
        }
        .title {
          font-size: 56px;
          line-height: 1.2;
          font-weight: 800;
          color: #ffffff;
          margin: 24px 0;
        }
        .title span {
          color: #fb923c;
          background: linear-gradient(135deg, #fb923c, #facc15);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtitle {
          font-size: 21px;
          line-height: 1.6;
          color: #e2e8f0;
          margin-bottom: 32px;
        }
        .grid-points {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 36px;
        }
        .point-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 16px;
          border-radius: 12px;
        }
        .point-card h4 {
          font-size: 16px;
          color: #4ade80;
          margin-bottom: 6px;
        }
        .point-card p {
          font-size: 14px;
          color: #cbd5e1;
          line-height: 1.4;
        }
      </style>
    </head>
    <body>
      <div class="hero-container">
        <div class="left-col">
          <div class="mockup-desktop admin-preview">
            <div class="mockup-desktop-header">
              <div class="mockup-dot dot-red"></div>
              <div class="mockup-dot dot-yellow"></div>
              <div class="mockup-dot dot-green"></div>
              <span style="font-size: 12px; color: #94a3b8; margin-left: 10px;">Espace Administrateur — Gestion des Produits</span>
            </div>
            <img src="${rawAdminProd}" style="width: 100%; height: 100%; object-fit: cover; object-position: top;">
          </div>
          <div class="cart-preview">
            <img src="${rawCart}" style="width: 100%; height: 100%; object-fit: cover; object-position: top;">
          </div>
        </div>
        <div class="right-col">
          <div class="badge">⚡ Prise en main en 3 minutes</div>
          <h1 class="title">Pilotez votre boutique sans <span>effort technique</span></h1>
          <p class="subtitle">Un tableau de bord intuitif pour mettre à jour vos arrivages du jour, vos promotions éphémères et suivre les commandes de vos clients en direct.</p>
          <div class="grid-points">
            <div class="point-card">
              <h4>📦 Produits & Prix</h4>
              <p>Changez un tarif au kg ou signalez une rupture d'un simple clic.</p>
            </div>
            <div class="point-card">
              <h4>🏷️ Promotions</h4>
              <p>Créez des remises de saison pour écouler les surplus rapidement.</p>
            </div>
            <div class="point-card">
              <h4>📋 Suivi Commandes</h4>
              <p>Statuts clairs : en préparation, prêt à retirer, livré.</p>
            </div>
            <div class="point-card">
              <h4>🎨 Charte Visuelle</h4>
              <p>Personnalisez logo, couleurs et bannières en temps réel.</p>
            </div>
          </div>
          <p style="font-size: 16px; color: #fb923c; font-weight: 700;">Code source propre • Sans abonnement imposé • appalacarte.fr</p>
        </div>
      </div>
    </body>
    </html>
  `;
  await renderVisual(browser, 1920, 1080, hero2Html, 'hero_banner_2');

  // 3. CARRE SOCIAL 1 (1080x1080)
  const carre1Html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        ${commonStyles}
        .container {
          width: 1080px;
          height: 1080px;
          padding: 70px 70px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background: radial-gradient(circle at 50% 20%, #1d4d23 0%, #0b1a0d 100%);
          position: relative;
        }
        .title {
          font-size: 46px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.25;
          margin: 20px 0 16px;
        }
        .title span {
          color: #4ade80;
        }
        .subtitle {
          font-size: 20px;
          color: #bbf7d0;
          max-width: 800px;
          line-height: 1.5;
          margin-bottom: 30px;
        }
        .mockups-wrap {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 24px;
          margin-top: 10px;
          height: 520px;
        }
        .phone {
          width: 250px;
          height: 500px;
        }
        .desktop-mini {
          width: 540px;
          height: 380px;
          margin-bottom: 10px;
        }
        .footer-cta {
          position: absolute;
          bottom: 30px;
          font-size: 17px;
          font-weight: 700;
          color: #ffffff;
          background: rgba(255,255,255,0.1);
          padding: 8px 24px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.2);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="badge">🍃 L'appli des commerçants de quartier</div>
        <h1 class="title">Digitalisez votre primeur avec un <span>Click & Collect sur mesure</span></h1>
        <p class="subtitle">Permettez à vos clients de commander fruits, légumes et paniers frais 24h/24 depuis leur smartphone.</p>
        <div class="mockups-wrap">
          <div class="mockup-phone phone">
            <img src="${rawMobileHome}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="mockup-desktop desktop-mini">
            <div class="mockup-desktop-header">
              <div class="mockup-dot dot-red"></div>
              <div class="mockup-dot dot-yellow"></div>
              <div class="mockup-dot dot-green"></div>
              <span style="font-size: 11px; color: #94a3b8; margin-left: 6px;">Rayon Fraîcheur & Paniers</span>
            </div>
            <img src="${rawCatalog}" style="width: 100%; height: 100%; object-fit: cover; object-position: top;">
          </div>
        </div>
        <div class="footer-cta">✨ Prête à l'emploi sur appalacarte.fr</div>
      </div>
    </body>
    </html>
  `;
  await renderVisual(browser, 1080, 1080, carre1Html, 'carre_social_1');

  // 4. CARRE SOCIAL 2 (1080x1080) - Focus Métier & Rentabilité
  const carre2Html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        ${commonStyles}
        .container {
          width: 1080px;
          height: 1080px;
          padding: 70px 70px;
          display: flex;
          flex-direction: column;
          background: linear-gradient(145deg, #122814 0%, #071309 100%);
          position: relative;
        }
        .header {
          text-align: left;
        }
        .title {
          font-size: 44px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.25;
          margin: 18px 0 12px;
        }
        .title span {
          color: #fb923c;
        }
        .desc {
          font-size: 19px;
          color: #cbd5e1;
          margin-bottom: 28px;
        }
        .cards-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 18px;
          text-align: left;
        }
        .stat-num {
          font-size: 30px;
          font-weight: 800;
          color: #4ade80;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 14px;
          color: #e2e8f0;
          font-weight: 600;
        }
        .mockup-wrap {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .admin-desk {
          width: 880px;
          height: 440px;
        }
        .bottom-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="badge">🚀 Booster les ventes locales</div>
          <h1 class="title">Une boutique en ligne <span>pensée pour le circuit court</span></h1>
          <p class="desc">Pas de commission prélevée sur vos ventes, code source complet, personnalisable à 100%.</p>
        </div>
        <div class="cards-row">
          <div class="stat-card">
            <div class="stat-num">0 %</div>
            <div class="stat-label">Commission intermédiaire</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">24h/24</div>
            <div class="stat-label">Prise de commandes client</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">100 %</div>
            <div class="stat-label">Propriétaire de vos données</div>
          </div>
        </div>
        <div class="mockup-wrap">
          <div class="mockup-desktop admin-desk">
            <div class="mockup-desktop-header">
              <div class="mockup-dot dot-red"></div>
              <div class="mockup-dot dot-yellow"></div>
              <div class="mockup-dot dot-green"></div>
              <span style="font-size: 12px; color: #94a3b8; margin-left: 8px;">Gestion des produits & stocks</span>
            </div>
            <img src="${rawAdminProd}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        </div>
        <div class="bottom-bar">
          <span style="color: #94a3b8; font-size: 15px;">Pour commerçants indépendants & agences web</span>
          <span style="color: #4ade80; font-weight: 700; font-size: 16px;">Découvrez-la sur appalacarte.fr</span>
        </div>
      </div>
    </body>
    </html>
  `;
  await renderVisual(browser, 1080, 1080, carre2Html, 'carre_social_2');

  // 5. STORY VERTICAL (1080x1920)
  const storyHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        ${commonStyles}
        .container {
          width: 1080px;
          height: 1920px;
          padding: 100px 70px 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background: radial-gradient(circle at 50% 15%, #235c2b 0%, #0b1a0d 100%);
          position: relative;
        }
        .title {
          font-size: 64px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          margin: 30px 0 20px;
        }
        .title span {
          color: #4ade80;
        }
        .subtitle {
          font-size: 26px;
          color: #bbf7d0;
          line-height: 1.5;
          margin-bottom: 50px;
          max-width: 900px;
        }
        .phone-mockup {
          width: 500px;
          height: 980px;
          border-radius: 54px;
          box-shadow: 0 35px 70px rgba(0,0,0,0.8), 0 0 0 12px #1e293b;
          overflow: hidden;
          margin-bottom: 50px;
        }
        .badges-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
          margin-bottom: 50px;
        }
        .feat-pill {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 999px;
          padding: 12px 24px;
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
        }
        .cta-box {
          background: #4ade80;
          color: #0b1a0d;
          font-size: 26px;
          font-weight: 800;
          padding: 22px 50px;
          border-radius: 20px;
          box-shadow: 0 15px 30px rgba(74, 222, 128, 0.4);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="badge" style="font-size: 18px; padding: 10px 22px;">🍎 Primeurs • Maraîchers • Bio</div>
        <h1 class="title">Vos récoltes en ligne,<br><span>vos clients ravis.</span></h1>
        <p class="subtitle">L'application e-commerce moderne et mobile pour vendre vos fruits & légumes frais en Click & Collect.</p>

        <div class="phone-mockup">
          <img src="${rawMobileCat}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>

        <div class="badges-list">
          <div class="feat-pill">🛒 Panier interactif</div>
          <div class="feat-pill">📍 Retrait magasin</div>
          <div class="feat-pill">⚡ Sans abonnement forcé</div>
        </div>

        <div class="cta-box">
          👉 À découvrir sur appalacarte.fr
        </div>
      </div>
    </body>
    </html>
  `;
  await renderVisual(browser, 1080, 1920, storyHtml, 'story_vertical');

  // 6. VIGNETTE VITRINE APPALACARTE (1200x800)
  const vignetteHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        ${commonStyles}
        .container {
          width: 1200px;
          height: 800px;
          padding: 60px 70px;
          display: flex;
          background: radial-gradient(circle at 75% 35%, #1d4d23 0%, #0a170b 100%);
          position: relative;
        }
        .left {
          flex: 1.1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          z-index: 2;
        }
        .title {
          font-size: 48px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          margin: 18px 0;
        }
        .title span {
          color: #4ade80;
        }
        .tagline {
          font-size: 18px;
          color: #d1fae5;
          line-height: 1.5;
          margin-bottom: 28px;
        }
        .tags {
          display: flex;
          gap: 12px;
          margin-bottom: 30px;
        }
        .tag {
          font-size: 13px;
          font-weight: 700;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 6px 14px;
          border-radius: 8px;
          color: #86efac;
        }
        .price-badge {
          font-size: 15px;
          color: #facc15;
          font-weight: 700;
        }
        .right {
          flex: 1.2;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .desk-card {
          width: 580px;
          height: 390px;
          transform: perspective(900px) rotateY(-8deg) rotateX(4deg);
        }
        .phone-card {
          width: 180px;
          height: 380px;
          position: absolute;
          right: 0;
          bottom: 40px;
          z-index: 5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="left">
          <div class="badge">🥦 Application Clé en Main</div>
          <h1 class="title">Boutique Primeurs & <span>Paniers Bio</span></h1>
          <p class="tagline">La fraîcheur du marché en direct chez vos clients. Solution complète avec boutique en ligne, panier, click & collect et gestion des stocks.</p>
          <div class="tags">
            <div class="tag">React + TypeScript</div>
            <div class="tag">Supabase Ready</div>
            <div class="tag">Mobile First</div>
          </div>
          <div class="price-badge">⭐ Disponible en Code source ou Clé en main sur appalacarte.fr</div>
        </div>
        <div class="right">
          <div class="mockup-desktop desk-card">
            <div class="mockup-desktop-header">
              <div class="mockup-dot dot-red"></div>
              <div class="mockup-dot dot-yellow"></div>
              <div class="mockup-dot dot-green"></div>
              <span style="font-size: 11px; color: #94a3b8; margin-left: 6px;">Boutique Primeur</span>
            </div>
            <img src="${rawHome}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="mockup-phone phone-card">
            <img src="${rawMobileCat}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  await renderVisual(browser, 1200, 800, vignetteHtml, 'vignette_vitrine');

  await browser.close();
  console.log('All promotional visual assets generated successfully in PNG and WebP!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
