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

async function renderSlide(browser, width, height, htmlContent, outputPath) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await page.screenshot({ path: outputPath, type: 'png' });
  await page.close();
}

async function main() {
  const rawHome = getBase64('raw_desktop_home.png');
  const rawCatalog = getBase64('raw_desktop_catalog.png');
  const rawProduct = getBase64('raw_desktop_product.png');
  const rawCart = getBase64('raw_cart_page.png');
  const rawAdmin = getBase64('raw_admin_orders.png');
  const rawMobile = getBase64('raw_mobile_home.png');

  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true,
  });

  const commonCss = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #fff;
      overflow: hidden;
      width: 100%;
      height: 100%;
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
    .voiceover {
      background: rgba(0, 0, 0, 0.55);
      border-left: 4px solid #4ade80;
      padding: 14px 20px;
      border-radius: 0 10px 10px 0;
      font-size: 18px;
      color: #cbd5e1;
      font-style: italic;
      margin-top: 24px;
      line-height: 1.4;
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
  `;

  // ─────────────────────────────────────────────
  // 16:9 SLIDES (1920x1080)
  // ─────────────────────────────────────────────
  const slides16x9 = [
    // Slide 1
    `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      ${commonCss}
      .slide {
        width: 1920px; height: 1080px; display: flex; align-items: center; padding: 80px 100px;
        background: radial-gradient(circle at 70% 30%, #1c4b22 0%, #09170b 100%);
      }
      .left { flex: 1; max-width: 760px; }
      .right { flex: 1.2; display: flex; justify-content: center; align-items: center; }
      .headline { font-size: 60px; font-weight: 800; line-height: 1.15; margin-bottom: 20px; }
      .headline span { color: #4ade80; }
      .desc { font-size: 24px; color: #d1fae5; line-height: 1.5; }
    </style></head><body>
      <div class="slide">
        <div class="left">
          <div class="badge">🌱 Boutique Primeur Clé en Main</div>
          <h1 class="headline">Vos fruits & légumes frais <span>en Click & Collect</span></h1>
          <p class="desc">Offrez à vos clients la fraîcheur de vos étals en direct grâce à une boutique en ligne moderne et élégante.</p>
          <div class="voiceover">« Voix off : Offrez la fraîcheur de vos étals en direct à vos clients grâce à votre propre boutique en ligne. »</div>
        </div>
        <div class="right">
          <div class="mockup-window">
            <div class="mockup-header"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div><span class="window-url">noble-fermier.fr</span></div>
            <img src="${rawHome}" style="width: 100%; height: 100%; object-fit: cover; object-position: top;">
          </div>
        </div>
      </div>
    </body></html>`,

    // Slide 2
    `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      ${commonCss}
      .slide {
        width: 1920px; height: 1080px; display: flex; align-items: center; padding: 80px 100px;
        background: radial-gradient(circle at 75% 35%, #18421c 0%, #071409 100%);
      }
      .left { flex: 1; max-width: 760px; }
      .right { flex: 1.2; display: flex; justify-content: center; align-items: center; }
      .headline { font-size: 60px; font-weight: 800; line-height: 1.15; margin-bottom: 20px; }
      .headline span { color: #4ade80; }
      .desc { font-size: 24px; color: #d1fae5; line-height: 1.5; }
    </style></head><body>
      <div class="slide">
        <div class="left">
          <div class="badge">🍎 Rayons Maraîchers Intuitifs</div>
          <h1 class="headline">Catalogue pensé pour les <span>produits frais</span></h1>
          <p class="desc">Vente au kilo, à la botte ou en paniers composés. Gestion en temps réel des stocks et des promotions.</p>
          <div class="voiceover">« Voix off : Un catalogue sur mesure pensé pour les produits frais, au kilo, à la botte ou en panier composé. »</div>
        </div>
        <div class="right">
          <div class="mockup-window">
            <div class="mockup-header"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div><span class="window-url">noble-fermier.fr/catalogue</span></div>
            <img src="${rawCatalog}" style="width: 100%; height: 100%; object-fit: cover; object-position: top;">
          </div>
        </div>
      </div>
    </body></html>`,

    // Slide 3
    `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      ${commonCss}
      .slide {
        width: 1920px; height: 1080px; display: flex; align-items: center; padding: 80px 100px;
        background: radial-gradient(circle at 75% 35%, #1e4a24 0%, #09170b 100%);
      }
      .left { flex: 1; max-width: 760px; }
      .right { flex: 1.2; display: flex; justify-content: center; align-items: center; }
      .headline { font-size: 60px; font-weight: 800; line-height: 1.15; margin-bottom: 20px; }
      .headline span { color: #fb923c; }
      .desc { font-size: 24px; color: #fed7aa; line-height: 1.5; }
    </style></head><body>
      <div class="slide">
        <div class="left">
          <div class="badge" style="color: #fed7aa; border-color: rgba(251,146,60,0.4);">🧺 Panier & Commande Immédiate</div>
          <h1 class="headline">Une expérience d'achat <span>simple & rapide</span></h1>
          <p class="desc">Panier interactif avec calcul direct, retrait magasin en click and collect et fidélisation client.</p>
          <div class="voiceover">« Voix off : Vos clients préparent leur panier 24h sur 24 pour un retrait sans attente en magasin. »</div>
        </div>
        <div class="right">
          <div class="mockup-window">
            <div class="mockup-header"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div><span class="window-url">noble-fermier.fr/panier</span></div>
            <img src="${rawCart}" style="width: 100%; height: 100%; object-fit: cover; object-position: top;">
          </div>
        </div>
      </div>
    </body></html>`,

    // Slide 4
    `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      ${commonCss}
      .slide {
        width: 1920px; height: 1080px; display: flex; align-items: center; padding: 80px 100px;
        background: radial-gradient(circle at 70% 30%, #153c19 0%, #061208 100%);
      }
      .left { flex: 1.2; max-width: 780px; }
      .right { flex: 1; display: flex; justify-content: center; align-items: center; }
      .headline { font-size: 60px; font-weight: 800; line-height: 1.15; margin-bottom: 20px; }
      .headline span { color: #4ade80; }
      .desc { font-size: 24px; color: #d1fae5; line-height: 1.5; }
      .phone-box {
        width: 310px; height: 630px; border-radius: 44px; overflow: hidden;
        box-shadow: 0 30px 60px rgba(0,0,0,0.8), 0 0 0 10px #334155;
      }
    </style></head><body>
      <div class="slide">
        <div class="left">
          <div class="badge">📱 Expérience Mobile First</div>
          <h1 class="headline">Fluidité absolue sur <span>smartphones & tablettes</span></h1>
          <p class="desc">Conçue pour les acheteurs nomades. Temps de chargement instantanés et ergonomie ultra-naturelle.</p>
          <div class="voiceover">« Voix off : Une application ultra-rapide pensée pour faciliter la vie de vos clients sur mobile. »</div>
        </div>
        <div class="right">
          <div class="phone-box">
            <img src="${rawMobile}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        </div>
      </div>
    </body></html>`,

    // Slide 5
    `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      ${commonCss}
      .slide {
        width: 1920px; height: 1080px; display: flex; align-items: center; padding: 80px 100px;
        background: radial-gradient(circle at 75% 35%, #18421c 0%, #071409 100%);
      }
      .left { flex: 1; max-width: 760px; }
      .right { flex: 1.2; display: flex; justify-content: center; align-items: center; }
      .headline { font-size: 60px; font-weight: 800; line-height: 1.15; margin-bottom: 20px; }
      .headline span { color: #4ade80; }
      .desc { font-size: 24px; color: #d1fae5; line-height: 1.5; }
    </style></head><body>
      <div class="slide">
        <div class="left">
          <div class="badge">⚙️ Back-Office Artisan</div>
          <h1 class="headline">Pilotez vos arrivages <span>en toute sérénité</span></h1>
          <p class="desc">Ajustement des prix au jour le jour, alertes ruptures de stock et suivi des commandes étape par étape.</p>
          <div class="voiceover">« Voix off : Pilotez vos stocks, mettez à jour vos prix du jour et traitez vos commandes en 2 clics. »</div>
        </div>
        <div class="right">
          <div class="mockup-window">
            <div class="mockup-header"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div><span class="window-url">noble-fermier.fr/admin</span></div>
            <img src="${rawAdmin}" style="width: 100%; height: 100%; object-fit: cover; object-position: top;">
          </div>
        </div>
      </div>
    </body></html>`,

    // Slide 6 (CTA)
    `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      ${commonCss}
      .slide {
        width: 1920px; height: 1080px; display: flex; flex-direction: column; justify-content: center; align-items: center;
        background: radial-gradient(circle at 50% 50%, #1a4d22 0%, #08170a 100%); text-align: center; padding: 80px;
      }
      .cta-card {
        background: rgba(255,255,255,0.06); border: 2px solid rgba(74, 222, 128, 0.4); border-radius: 28px;
        padding: 60px 90px; box-shadow: 0 30px 60px rgba(0,0,0,0.6); max-width: 1100px;
      }
      .headline { font-size: 64px; font-weight: 800; line-height: 1.2; margin-bottom: 20px; }
      .desc { font-size: 26px; color: #d1fae5; margin-bottom: 40px; }
      .cta-button {
        display: inline-block; background: linear-gradient(135deg, #4ade80, #22c55e); color: #071c0b;
        font-size: 34px; font-weight: 800; padding: 22px 56px; border-radius: 999px;
        box-shadow: 0 15px 35px rgba(74, 222, 128, 0.4); text-decoration: none;
      }
    </style></head><body>
      <div class="slide">
        <div class="cta-card">
          <div class="badge" style="font-size: 18px; padding: 10px 24px;">🚀 Disponible Immédiatement</div>
          <h1 class="headline">Application « Primeurs »</h1>
          <p class="desc">Code source complet • Option clé en main personnalisée • Zéro commission intermédiaire</p>
          <div class="cta-button">Découvrez-la sur appalacarte.fr</div>
          <div class="voiceover" style="margin-top: 36px; display: inline-block;">« Voix off : Passez au click-and-collect dès aujourd'hui. Rendez-vous sur appalacarte.fr ! »</div>
        </div>
      </div>
    </body></html>`,
  ];

  // ─────────────────────────────────────────────
  // 9:16 SLIDES (1080x1920)
  // ─────────────────────────────────────────────
  const slides9x16 = [
    // Slide 1
    `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      ${commonCss}
      .slide {
        width: 1080px; height: 1920px; display: flex; flex-direction: column; align-items: center; justify-content: space-between;
        background: radial-gradient(circle at 50% 20%, #1e5225 0%, #08160a 100%); padding: 100px 70px 80px; text-align: center;
      }
      .headline { font-size: 52px; font-weight: 800; line-height: 1.22; }
      .headline span { color: #4ade80; }
      .phone-mockup { width: 480px; height: 960px; border-radius: 54px; overflow: hidden; box-shadow: 0 35px 70px rgba(0,0,0,0.8), 0 0 0 12px #334155; }
    </style></head><body>
      <div class="slide">
        <div>
          <div class="badge">🌱 Boutique Primeur</div>
          <h1 class="headline">Vos fruits & légumes frais<br><span>en Click & Collect</span></h1>
        </div>
        <div class="phone-mockup">
          <img src="${rawMobile}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="voiceover" style="max-width: 800px;">« Voix off : Offrez la fraîcheur de vos étals en direct à vos clients. »</div>
      </div>
    </body></html>`,

    // Slide 2
    `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      ${commonCss}
      .slide {
        width: 1080px; height: 1920px; display: flex; flex-direction: column; align-items: center; justify-content: space-between;
        background: radial-gradient(circle at 50% 20%, #18441c 0%, #071509 100%); padding: 100px 70px 80px; text-align: center;
      }
      .headline { font-size: 52px; font-weight: 800; line-height: 1.22; }
      .headline span { color: #4ade80; }
      .desk-box { width: 880px; height: 560px; border-radius: 16px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.8); }
    </style></head><body>
      <div class="slide">
        <div>
          <div class="badge">🍎 Rayons Maraîchers</div>
          <h1 class="headline">Catalogue de saison &<br><span>paniers composés</span></h1>
        </div>
        <div class="desk-box">
          <img src="${rawCatalog}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="voiceover" style="max-width: 800px;">« Voix off : Vente au kilo, à la botte ou en panier composé. »</div>
      </div>
    </body></html>`,

    // Slide 3
    `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      ${commonCss}
      .slide {
        width: 1080px; height: 1920px; display: flex; flex-direction: column; align-items: center; justify-content: space-between;
        background: radial-gradient(circle at 50% 20%, #1d4d23 0%, #09170b 100%); padding: 100px 70px 80px; text-align: center;
      }
      .headline { font-size: 52px; font-weight: 800; line-height: 1.22; }
      .headline span { color: #fb923c; }
      .desk-box { width: 880px; height: 560px; border-radius: 16px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.8); }
    </style></head><body>
      <div class="slide">
        <div>
          <div class="badge" style="color: #fed7aa; border-color: rgba(251,146,60,0.4);">🧺 Panier Interactif</div>
          <h1 class="headline">Commande 24h/24 &<br><span>retrait sans attente</span></h1>
        </div>
        <div class="desk-box">
          <img src="${rawCart}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="voiceover" style="max-width: 800px;">« Voix off : Vos clients préparent leur commande en toute fluidité. »</div>
      </div>
    </body></html>`,

    // Slide 4
    `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      ${commonCss}
      .slide {
        width: 1080px; height: 1920px; display: flex; flex-direction: column; align-items: center; justify-content: space-between;
        background: radial-gradient(circle at 50% 20%, #153e1a 0%, #071509 100%); padding: 100px 70px 80px; text-align: center;
      }
      .headline { font-size: 52px; font-weight: 800; line-height: 1.22; }
      .headline span { color: #4ade80; }
      .phone-mockup { width: 480px; height: 960px; border-radius: 54px; overflow: hidden; box-shadow: 0 35px 70px rgba(0,0,0,0.8), 0 0 0 12px #334155; }
    </style></head><body>
      <div class="slide">
        <div>
          <div class="badge">📱 Mobile First</div>
          <h1 class="headline">Ultra-rapide et<br><span>optimisée smartphone</span></h1>
        </div>
        <div class="phone-mockup">
          <img src="${rawMobile}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="voiceover" style="max-width: 800px;">« Voix off : Une expérience pensée pour les clients mobiles. »</div>
      </div>
    </body></html>`,

    // Slide 5
    `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      ${commonCss}
      .slide {
        width: 1080px; height: 1920px; display: flex; flex-direction: column; align-items: center; justify-content: space-between;
        background: radial-gradient(circle at 50% 20%, #1a4920 0%, #071509 100%); padding: 100px 70px 80px; text-align: center;
      }
      .headline { font-size: 52px; font-weight: 800; line-height: 1.22; }
      .headline span { color: #4ade80; }
      .desk-box { width: 880px; height: 560px; border-radius: 16px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.8); }
    </style></head><body>
      <div class="slide">
        <div>
          <div class="badge">⚙️ Back-Office Artisan</div>
          <h1 class="headline">Mise à jour des stocks &<br><span>prix en direct</span></h1>
        </div>
        <div class="desk-box">
          <img src="${rawAdmin}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="voiceover" style="max-width: 800px;">« Voix off : Modifiez vos prix et suivez vos commandes en un clin d'œil. »</div>
      </div>
    </body></html>`,

    // Slide 6 (CTA)
    `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      ${commonCss}
      .slide {
        width: 1080px; height: 1920px; display: flex; flex-direction: column; align-items: center; justify-content: center;
        background: radial-gradient(circle at 50% 30%, #1e5426 0%, #08160a 100%); padding: 100px 70px; text-align: center;
      }
      .badge { font-size: 22px; padding: 12px 28px; }
      .headline { font-size: 62px; font-weight: 800; margin: 30px 0 20px; }
      .desc { font-size: 28px; color: #d1fae5; max-width: 800px; line-height: 1.5; margin-bottom: 50px; }
      .cta-button {
        background: #4ade80; color: #0b1a0d; font-size: 32px; font-weight: 800; padding: 24px 54px;
        border-radius: 999px; display: inline-block; box-shadow: 0 15px 35px rgba(74, 222, 128, 0.4);
      }
    </style></head><body>
      <div class="slide">
        <div class="badge">🚀 Prête à Vendre</div>
        <h1 class="headline">Application « Primeurs »</h1>
        <p class="desc">Boutique en ligne, click & collect et gestion des stocks pour maraîchers et commerçants de quartier.</p>
        <div class="cta-button">Découvrez-la sur appalacarte.fr</div>
        <div class="voiceover" style="margin-top: 50px; max-width: 800px;">« Voix off : Rendez-vous sur appalacarte.fr ! »</div>
      </div>
    </body></html>`,
  ];

  // Render individual slide PNGs
  const slide16Paths = [];
  console.log('Rendering 16:9 slides...');
  for (let i = 0; i < slides16x9.length; i++) {
    const sPath = path.join(VIDEO_DIR, `slide16_${i + 1}.png`);
    await renderSlide(browser, 1920, 1080, slides16x9[i], sPath);
    slide16Paths.push(sPath);
  }

  const slide9Paths = [];
  console.log('Rendering 9:16 slides...');
  for (let i = 0; i < slides9x16.length; i++) {
    const sPath = path.join(VIDEO_DIR, `slide9_${i + 1}.png`);
    await renderSlide(browser, 1080, 1920, slides9x16[i], sPath);
    slide9Paths.push(sPath);
  }

  await browser.close();

  // Assemble 16:9 MP4 with ffmpeg (6 slides * 6s = 36s, crossfade duration 1s, final video 31s)
  console.log('Assembling presentation_16x9.mp4...');
  const out16 = path.join(VIDEO_DIR, 'presentation_16x9.mp4');
  const cmd16 = `ffmpeg -y ` +
    slide16Paths.map(p => `-loop 1 -t 6 -i "${p}"`).join(' ') +
    ` -f lavfi -t 31 -i anullsrc=channel_layout=stereo:sample_rate=44100 ` +
    ` -filter_complex "[0][1]xfade=transition=fade:duration=1:offset=5[v1];` +
    `[v1][2]xfade=transition=fade:duration=1:offset=10[v2];` +
    `[v2][3]xfade=transition=fade:duration=1:offset=15[v3];` +
    `[v3][4]xfade=transition=fade:duration=1:offset=20[v4];` +
    `[v4][5]xfade=transition=fade:duration=1:offset=25[v5]" ` +
    ` -map "[v5]" -map 6:a -c:v libx264 -pix_fmt yuv420p -r 30 -b:v 3M -c:a aac -shortest "${out16}"`;

  execSync(cmd16, { stdio: 'inherit' });

  // Assemble 9:16 MP4 with ffmpeg
  console.log('Assembling presentation_9x16.mp4...');
  const out9 = path.join(VIDEO_DIR, 'presentation_9x16.mp4');
  const cmd9 = `ffmpeg -y ` +
    slide9Paths.map(p => `-loop 1 -t 6 -i "${p}"`).join(' ') +
    ` -f lavfi -t 31 -i anullsrc=channel_layout=stereo:sample_rate=44100 ` +
    ` -filter_complex "[0][1]xfade=transition=fade:duration=1:offset=5[v1];` +
    `[v1][2]xfade=transition=fade:duration=1:offset=10[v2];` +
    `[v2][3]xfade=transition=fade:duration=1:offset=15[v3];` +
    `[v3][4]xfade=transition=fade:duration=1:offset=20[v4];` +
    `[v4][5]xfade=transition=fade:duration=1:offset=25[v5]" ` +
    ` -map "[v5]" -map 6:a -c:v libx264 -pix_fmt yuv420p -r 30 -b:v 3M -c:a aac -shortest "${out9}"`;

  execSync(cmd9, { stdio: 'inherit' });

  console.log('Videos built successfully in D:\\Aplli\\Appli Primeurs\\Marketing\\video\\ !');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
