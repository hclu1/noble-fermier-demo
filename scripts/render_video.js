import { chromium } from 'playwright-core';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const IMAGES_DIR = 'D:\\Aplli\\Appli Primeurs\\Marketing\\images';
const VIDEO_DIR = 'D:\\Aplli\\Appli Primeurs\\Marketing\\video';

function getBase64(filename) {
  const filePath = path.join(IMAGES_DIR, filename);
  const data = fs.readFileSync(filePath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

async function recordHtmlVideo(htmlContent, width, height, durationMs, outputMp4Name) {
  const tempHtmlPath = path.join(VIDEO_DIR, `temp_${outputMp4Name}.html`);
  fs.writeFileSync(tempHtmlPath, htmlContent);

  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--enable-gpu-rasterization', '--disable-features=IsolateOrigins,site-per-process'],
  });

  const recordDir = path.join(VIDEO_DIR, `record_${outputMp4Name}`);
  if (!fs.existsSync(recordDir)) fs.mkdirSync(recordDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: recordDir,
      size: { width, height },
    },
  });

  const page = await context.newPage();
  console.log(`Starting playback of ${outputMp4Name} (${durationMs / 1000}s)...`);
  await page.goto(`file://${tempHtmlPath}`);
  await page.waitForTimeout(durationMs);

  await page.close();
  await context.close();
  await browser.close();

  // Find recorded video in recordDir
  const files = fs.readdirSync(recordDir);
  const recordedVideo = files.find(f => f.endsWith('.webm') || f.endsWith('.mp4'));
  if (!recordedVideo) {
    throw new Error(`No video recorded in ${recordDir}`);
  }

  const rawVideoPath = path.join(recordDir, recordedVideo);
  const targetMp4Path = path.join(VIDEO_DIR, `${outputMp4Name}.mp4`);

  console.log(`Transcoding with ffmpeg to ${outputMp4Name}.mp4...`);
  // ffmpeg transcode to standard H.264 MP4 with yuv420p for universal compatibility
  execSync(`ffmpeg -y -i "${rawVideoPath}" -c:v libx264 -pix_fmt yuv420p -r 30 -b:v 4M "${targetMp4Path}"`, { stdio: 'inherit' });

  // Clean up temp
  fs.unlinkSync(tempHtmlPath);
  fs.rmSync(recordDir, { recursive: true, force: true });
  console.log(`Success: ${targetMp4Path}`);
}

async function main() {
  const rawHome = getBase64('raw_desktop_home.png');
  const rawCatalog = getBase64('raw_desktop_catalog.png');
  const rawProduct = getBase64('raw_desktop_product.png');
  const rawCart = getBase64('raw_cart_page.png');
  const rawAdmin = getBase64('raw_admin_orders.png');
  const rawMobile = getBase64('raw_mobile_home.png');

  // Total duration: 36s (6 plans * 6s)
  // 16:9 Landscape Video HTML (1920x1080)
  const video16x9Html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 1920px;
          height: 1080px;
          background: #0d210f;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #fff;
          overflow: hidden;
          position: relative;
        }
        .slide {
          position: absolute;
          inset: 0;
          display: flex;
          opacity: 0;
          animation: slideAnimation 36s ease-in-out infinite;
          padding: 70px 90px;
          background: radial-gradient(circle at 70% 30%, #1c4b22 0%, #09170b 100%);
        }
        @keyframes slideAnimation {
          0% { opacity: 0; transform: scale(1.02); }
          1%, 15% { opacity: 1; transform: scale(1); }
          16.6% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 0; }
        }
        #slide1 { animation-delay: 0s; }
        #slide2 { animation-delay: 6s; }
        #slide3 { animation-delay: 12s; }
        #slide4 { animation-delay: 18s; }
        #slide5 { animation-delay: 24s; }
        #slide6 { animation-delay: 30s; }

        .left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 760px;
          z-index: 5;
        }
        .right {
          flex: 1.2;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(74, 222, 128, 0.15);
          border: 1px solid rgba(74, 222, 128, 0.4);
          color: #86efac;
          font-size: 16px;
          font-weight: 700;
          padding: 8px 18px;
          border-radius: 999px;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .headline {
          font-size: 58px;
          font-weight: 800;
          line-height: 1.18;
          margin-bottom: 24px;
          color: #ffffff;
        }
        .headline span {
          color: #4ade80;
          background: linear-gradient(135deg, #4ade80, #a3e635);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .desc {
          font-size: 24px;
          color: #d1fae5;
          line-height: 1.5;
          margin-bottom: 30px;
        }
        .voiceover-bar {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          border-left: 4px solid #4ade80;
          padding: 14px 20px;
          border-radius: 0 10px 10px 0;
          font-size: 17px;
          color: #cbd5e1;
          font-style: italic;
        }
        .mockup-window {
          background: #1e293b;
          border-radius: 14px;
          box-shadow: 0 30px 60px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.15);
          overflow: hidden;
          width: 860px;
          height: 560px;
        }
        .mockup-header {
          background: #0f172a;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot-red { background: #ef4444; }
        .dot-yellow { background: #eab308; }
        .dot-green { background: #22c55e; }
        .window-url { font-size: 12px; color: #94a3b8; margin-left: 12px; }

        .phone-mockup {
          width: 320px;
          height: 640px;
          background: #000;
          border-radius: 44px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.8), 0 0 0 10px #334155;
          overflow: hidden;
        }
        .cta-final-box {
          text-align: center;
          background: rgba(255,255,255,0.06);
          border: 2px solid rgba(74, 222, 128, 0.4);
          border-radius: 24px;
          padding: 60px 80px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
        }
        .cta-btn {
          display: inline-block;
          margin-top: 36px;
          background: linear-gradient(135deg, #4ade80, #22c55e);
          color: #06200a;
          font-size: 32px;
          font-weight: 800;
          padding: 20px 50px;
          border-radius: 999px;
          box-shadow: 0 15px 35px rgba(74, 222, 128, 0.4);
        }
      </style>
    </head>
    <body>
      <!-- PLAN 1 : ACCROCHE -->
      <div class="slide" id="slide1">
        <div class="left">
          <div class="badge">🌱 Boutique Primeur Clé en Main</div>
          <h1 class="headline">Vos fruits & légumes frais <span>en Click & Collect</span></h1>
          <p class="desc">Offrez à vos clients la fraîcheur de vos étals en direct grâce à une boutique en ligne moderne et sur mesure.</p>
          <div class="voiceover-bar">« Offrez la fraîcheur de vos étals en direct à vos clients grâce à votre boutique en ligne. »</div>
        </div>
        <div class="right">
          <div class="mockup-window">
            <div class="mockup-header">
              <div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div>
              <span class="window-url">noble-fermier.fr</span>
            </div>
            <img src="${rawHome}" style="width: 100%; height: 100%; object-fit: cover; object-position: top;">
          </div>
        </div>
      </div>

      <!-- PLAN 2 : CATALOGUE -->
      <div class="slide" id="slide2">
        <div class="left">
          <div class="badge">🍎 Rayons Maraîchers Intuitifs</div>
          <h1 class="headline">Catalogue pensé pour les <span>produits frais</span></h1>
          <p class="desc">Vente au kilo, à la pièce ou en paniers composés. Gestion instantanée des promotions et des stocks.</p>
          <div class="voiceover-bar">« Un catalogue sur mesure pensé pour les produits frais, au kilo, à la botte ou en panier. »</div>
        </div>
        <div class="right">
          <div class="mockup-window">
            <div class="mockup-header">
              <div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div>
              <span class="window-url">noble-fermier.fr/catalogue</span>
            </div>
            <img src="${rawCatalog}" style="width: 100%; height: 100%; object-fit: cover; object-position: top;">
          </div>
        </div>
      </div>

      <!-- PLAN 3 : PANIER & COMMANDE -->
      <div class="slide" id="slide3">
        <div class="left">
          <div class="badge">🧺 Panier & Commande Rapide</div>
          <h1 class="headline">Une expérience d'achat <span>fluide & sans friction</span></h1>
          <p class="desc">Panier interactif, sélection du créneau de retrait et paiement sur place ou en ligne.</p>
          <div class="voiceover-bar">« Vos clients préparent leur commande 24h sur 24 pour un retrait rapide en boutique. »</div>
        </div>
        <div class="right">
          <div class="mockup-window">
            <div class="mockup-header">
              <div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div>
              <span class="window-url">noble-fermier.fr/panier</span>
            </div>
            <img src="${rawCart}" style="width: 100%; height: 100%; object-fit: cover; object-position: top;">
          </div>
        </div>
      </div>

      <!-- PLAN 4 : MOBILE FIRST -->
      <div class="slide" id="slide4">
        <div class="left">
          <div class="badge">📱 100% Responsive Mobile</div>
          <h1 class="headline">Accessible partout, <span>sur tous les écrans</span></h1>
          <p class="desc">Plus de 80% des clients commandent depuis leur smartphone. L'application est ultra-rapide et responsive.</p>
          <div class="voiceover-bar">« Une expérience fluide et moderne, optimisée pour tous les smartphones. »</div>
        </div>
        <div class="right">
          <div class="phone-mockup">
            <img src="${rawMobile}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        </div>
      </div>

      <!-- PLAN 5 : BACK-OFFICE ADMIN -->
      <div class="slide" id="slide5">
        <div class="left">
          <div class="badge">⚙️ Administration Simple</div>
          <h1 class="headline">Pilotez votre commerce <span>en toute autonomie</span></h1>
          <p class="desc">Gérez vos arrivages en 2 minutes : modification des prix, gestion des ruptures, suivi des commandes.</p>
          <div class="voiceover-bar">« Pilotez vos stocks, modifiez vos prix du jour et suivez vos commandes en toute simplicité. »</div>
        </div>
        <div class="right">
          <div class="mockup-window">
            <div class="mockup-header">
              <div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div>
              <span class="window-url">noble-fermier.fr/admin/commandes</span>
            </div>
            <img src="${rawAdmin}" style="width: 100%; height: 100%; object-fit: cover; object-position: top;">
          </div>
        </div>
      </div>

      <!-- PLAN 6 : CONCLUSION & CTA -->
      <div class="slide" id="slide6" style="justify-content: center; align-items: center;">
        <div class="cta-final-box">
          <div class="badge" style="font-size: 20px; padding: 10px 24px;">🚀 Prête à Vendre ou à Déployer</div>
          <h1 class="headline" style="font-size: 64px; margin-top: 16px;">Application « Primeurs »</h1>
          <p class="desc" style="max-width: 900px; margin: 0 auto;">Code source complet • Option clé en main personnalisée • Zéro commission intermédiaire</p>
          <div class="cta-btn">Découvrez-la sur appalacarte.fr</div>
          <div class="voiceover-bar" style="margin-top: 30px; display: inline-block;">« Passez au click-and-collect dès aujourd'hui. Rendez-vous sur appalacarte.fr ! »</div>
        </div>
      </div>
    </body>
    </html>
  `;

  // 9:16 Vertical Video HTML (1080x1920)
  const video9x16Html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 1080px;
          height: 1920px;
          background: #0d210f;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #fff;
          overflow: hidden;
          position: relative;
        }
        .slide {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          opacity: 0;
          animation: slideAnimation 36s ease-in-out infinite;
          padding: 100px 70px 80px;
          background: radial-gradient(circle at 50% 20%, #1e5225 0%, #08160a 100%);
          text-align: center;
        }
        @keyframes slideAnimation {
          0% { opacity: 0; transform: scale(1.02); }
          1%, 15% { opacity: 1; transform: scale(1); }
          16.6% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 0; }
        }
        #slide1 { animation-delay: 0s; }
        #slide2 { animation-delay: 6s; }
        #slide3 { animation-delay: 12s; }
        #slide4 { animation-delay: 18s; }
        #slide5 { animation-delay: 24s; }
        #slide6 { animation-delay: 30s; }

        .top-content {
          max-width: 900px;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(74, 222, 128, 0.15);
          border: 1px solid rgba(74, 222, 128, 0.4);
          color: #86efac;
          font-size: 18px;
          font-weight: 700;
          padding: 10px 22px;
          border-radius: 999px;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .headline {
          font-size: 52px;
          font-weight: 800;
          line-height: 1.22;
          color: #ffffff;
        }
        .headline span {
          color: #4ade80;
        }
        .middle-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          margin: 30px 0;
        }
        .phone-mockup {
          width: 480px;
          height: 960px;
          background: #000;
          border-radius: 54px;
          box-shadow: 0 35px 70px rgba(0,0,0,0.8), 0 0 0 12px #334155;
          overflow: hidden;
        }
        .desk-mockup {
          width: 880px;
          height: 560px;
          background: #1e293b;
          border-radius: 16px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.8);
          overflow: hidden;
        }
        .bottom-content {
          max-width: 900px;
          width: 100%;
        }
        .voiceover-pill {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 18px 28px;
          border-radius: 16px;
          font-size: 20px;
          color: #e2e8f0;
          font-style: italic;
        }
        .cta-btn {
          margin-top: 24px;
          background: #4ade80;
          color: #0b1a0d;
          font-size: 26px;
          font-weight: 800;
          padding: 20px 48px;
          border-radius: 999px;
          display: inline-block;
          box-shadow: 0 15px 35px rgba(74, 222, 128, 0.4);
        }
      </style>
    </head>
    <body>
      <!-- PLAN 1 -->
      <div class="slide" id="slide1">
        <div class="top-content">
          <div class="badge">🌱 Boutique Primeur</div>
          <h1 class="headline">Vos fruits & légumes frais<br><span>en Click & Collect</span></h1>
        </div>
        <div class="middle-content">
          <div class="phone-mockup">
            <img src="${rawMobile}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        </div>
        <div class="bottom-content">
          <div class="voiceover-pill">« Offrez la fraîcheur de vos étals en direct à vos clients. »</div>
        </div>
      </div>

      <!-- PLAN 2 -->
      <div class="slide" id="slide2">
        <div class="top-content">
          <div class="badge">🍎 Rayons Maraîchers</div>
          <h1 class="headline">Catalogue de saison &<br><span>paniers composés</span></h1>
        </div>
        <div class="middle-content">
          <div class="desk-mockup">
            <img src="${rawCatalog}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        </div>
        <div class="bottom-content">
          <div class="voiceover-pill">« Vente au kilo, à la botte ou en panier composé. »</div>
        </div>
      </div>

      <!-- PLAN 3 -->
      <div class="slide" id="slide3">
        <div class="top-content">
          <div class="badge">🧺 Panier Dynamique</div>
          <h1 class="headline">Commande 24h/24 &<br><span>retrait sans attente</span></h1>
        </div>
        <div class="middle-content">
          <div class="desk-mockup">
            <img src="${rawCart}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        </div>
        <div class="bottom-content">
          <div class="voiceover-pill">« Vos clients préparent leur commande en toute fluidité. »</div>
        </div>
      </div>

      <!-- PLAN 4 -->
      <div class="slide" id="slide4">
        <div class="top-content">
          <div class="badge">📱 Mobile First</div>
          <h1 class="headline">Ultra-rapide et<br><span>optimisée smartphone</span></h1>
        </div>
        <div class="middle-content">
          <div class="phone-mockup">
            <img src="${rawMobile}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        </div>
        <div class="bottom-content">
          <div class="voiceover-pill">« Une expérience fluide pensée pour les clients mobiles. »</div>
        </div>
      </div>

      <!-- PLAN 5 -->
      <div class="slide" id="slide5">
        <div class="top-content">
          <div class="badge">⚙️ Back-Office Artisan</div>
          <h1 class="headline">Mise à jour des stocks &<br><span>prix en direct</span></h1>
        </div>
        <div class="middle-content">
          <div class="desk-mockup">
            <img src="${rawAdmin}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        </div>
        <div class="bottom-content">
          <div class="voiceover-pill">« Modifiez vos prix et suivez vos commandes en un clin d'œil. »</div>
        </div>
      </div>

      <!-- PLAN 6 -->
      <div class="slide" id="slide6" style="justify-content: center;">
        <div class="badge" style="font-size: 22px; padding: 12px 28px;">🚀 Prête à Vendre</div>
        <h1 class="headline" style="font-size: 60px; margin: 24px 0;">Application « Primeurs »</h1>
        <p style="font-size: 26px; color: #cbd5e1; max-width: 800px; line-height: 1.5; margin-bottom: 40px;">Boutique en ligne, click & collect et gestion des stocks pour maraîchers et commerçants de quartier.</p>
        <div class="cta-btn">Découvrez-la sur appalacarte.fr</div>
        <div class="voiceover-pill" style="margin-top: 40px;">« Rendez-vous sur appalacarte.fr ! »</div>
      </div>
    </body>
    </html>
  `;

  // 1. Record 16:9
  await recordHtmlVideo(video16x9Html, 1920, 1080, 36000, 'presentation_16x9');

  // 2. Record 9:16
  await recordHtmlVideo(video9x16Html, 1080, 1920, 36000, 'presentation_9x16');

  console.log('Finished producing both 16:9 and 9:16 promotional presentation videos!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
