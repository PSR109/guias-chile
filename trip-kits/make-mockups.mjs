import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { chromiumPath } from './lib/chromium.mjs';
import { KITS } from './kits.config.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'mockups-out');
mkdirSync(OUT, { recursive: true });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// Chromium bloquea `file://` referenciado desde un documento cargado via
// page.setContent() ("Not allowed to load local resource"), asi que la
// portada se embebe como data URI en vez de un <img src="file://...">.
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const dataUri = (absPath) => {
  const mime = MIME[extname(absPath).toLowerCase()] ?? 'image/jpeg';
  return `data:${mime};base64,${readFileSync(absPath).toString('base64')}`;
};

// Textos del mockup por idioma del kit (EN identico al gen-1).
const MOCK_I18N = {
  en: { tag: 'Printable PDF · Instant Download', days: (n) => `${n}-day plan`, budget: 'Budget tables', edition: '2026 edition' },
  es: { tag: 'PDF imprimible · Descarga instantánea', days: (n) => `Plan de ${n} días`, budget: 'Presupuesto 2026', edition: 'edición 2026' },
};

// Imagen principal del listing: 1000x1000 @2x = 2000x2000
const mainHtml = (kit) => `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin:0; box-sizing:border-box; }
  body { width:1000px; height:1000px; font-family:-apple-system,'Segoe UI',Arial,sans-serif;
    background: linear-gradient(160deg,#0d3b3b 0%,#0d6e6e 60%,#12503f 100%);
    color:#fff; display:flex; flex-direction:column; align-items:center;
    justify-content:center; text-align:center; padding:60px; }
  .tag { letter-spacing:5px; font-size:16px; text-transform:uppercase; color:#ffd9a0; font-weight:600; }
  h1 { font-size:64px; line-height:1.1; margin:24px 0 10px; max-width:850px; }
  .sub { font-size:26px; color:#cfe8e8; max-width:800px; }
  img { width:560px; height:373px; object-fit:cover; border-radius:18px;
    margin:36px 0; box-shadow:0 18px 50px rgba(0,0,0,.45); }
  .badges { display:flex; gap:14px; }
  .badge { background:rgba(255,255,255,.14); border:1px solid rgba(255,255,255,.35);
    border-radius:999px; padding:10px 22px; font-size:19px; }
  .price { position:absolute; top:52px; right:52px; background:#c0512f; color:#fff;
    border-radius:50%; width:150px; height:150px; display:flex; align-items:center;
    justify-content:center; font-size:34px; font-weight:700; transform:rotate(10deg);
    box-shadow:0 10px 26px rgba(0,0,0,.35); }
</style></head><body>
  <div class="price">$${kit.priceUsd}</div>
  <div class="tag">${MOCK_I18N[kit.lang ?? 'en'].tag}</div>
  <h1>${esc(kit.title)}</h1>
  <div class="sub">${esc(kit.subtitle)}</div>
  <img src="${dataUri(join(HERE, '..', 'img', 'og', kit.coverImage))}">
  <div class="badges">
    <span class="badge">${MOCK_I18N[kit.lang ?? 'en'].days(kit.days.length)}</span>
    <span class="badge">${MOCK_I18N[kit.lang ?? 'en'].budget}</span>
    <span class="badge">Checklist</span>
    <span class="badge">A4 · ${MOCK_I18N[kit.lang ?? 'en'].edition}</span>
  </div>
</body></html>`;

const browser = await chromium.launch({ executablePath: chromiumPath() });

// 1) Imagen principal por SKU
const main = await browser.newPage({ viewport: { width: 1000, height: 1000 }, deviceScaleFactor: 2 });
for (const kit of KITS) {
  await main.setContent(mainHtml(kit), { waitUntil: 'networkidle' });
  await main.screenshot({ path: join(OUT, `${kit.id}-main.png`) });
  console.log(`mockup: ${kit.id}-main.png (2000x2000)`);
}

// 2) Previews: portada, primer dia, presupuesto (paginas reales del kit)
const prev = await browser.newPage({ viewport: { width: 900, height: 1165 }, deviceScaleFactor: 2 });
for (const kit of KITS) {
  await prev.goto(pathToFileURL(join(HERE, 'build', `${kit.id}-${kit.lang ?? 'en'}.html`)).href, { waitUntil: 'networkidle' });
  const targets = ['#cover', '#day-1', '#budget'];
  for (let i = 0; i < targets.length; i++) {
    const el = prev.locator(targets[i]);
    await el.scrollIntoViewIfNeeded();
    await el.screenshot({ path: join(OUT, `${kit.id}-preview-${i + 1}.png`) });
  }
  console.log(`mockup: ${kit.id}-preview-1..3.png`);
}
await browser.close();
console.log('total PNGs:', readdirSync(OUT).length);
