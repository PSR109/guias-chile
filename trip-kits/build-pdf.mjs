import { mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { chromiumPath } from './lib/chromium.mjs';
import { KITS } from './kits.config.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const BUILD = join(HERE, 'build');
const DIST = join(HERE, 'dist');
const LANG = process.argv.includes('--lang')
  ? process.argv[process.argv.indexOf('--lang') + 1]
  : 'en';

mkdirSync(DIST, { recursive: true });
const browser = await chromium.launch({ executablePath: chromiumPath() });
const page = await browser.newPage();

for (const kit of KITS) {
  const src = join(BUILD, `${kit.id}-${LANG}.html`);
  const out = join(DIST, `${kit.id}-${LANG}.pdf`);
  await page.goto(pathToFileURL(src).href, { waitUntil: 'networkidle' });
  await page.pdf({
    path: out,
    format: 'A4',
    printBackground: true,
    margin: { top: '14mm', bottom: '16mm', left: '14mm', right: '14mm' },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `<div style="width:100%;text-align:center;font-size:8px;color:#5b6b7b;font-family:Arial;">
      ${kit.title} · guias.viajesypanoramas.cl · page <span class="pageNumber"></span>/<span class="totalPages"></span></div>`,
  });
  const kb = (statSync(out).size / 1024).toFixed(0);
  console.log(`pdf: ${out} (${kb} KB)`);
  if (statSync(out).size > 20 * 1024 * 1024) throw new Error(`${out} supera 20MB (limite Etsy)`);
  if (statSync(out).size < 100 * 1024) throw new Error(`${out} sospechosamente chico (<100KB)`);
}
await browser.close();
console.log('dist:', readdirSync(DIST).join(', '));
