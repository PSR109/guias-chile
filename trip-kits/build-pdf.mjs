import { mkdirSync, readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { PDFDocument } from 'pdf-lib';
import { chromiumPath } from './lib/chromium.mjs';
import { KITS } from './kits.config.mjs';

// Metadata embebida en el PDF (distinta del <title> HTML que ya fija Chromium):
// mejora discoverability cuando el PDF se comparte/cruzea fuera de Etsy/Gumroad
// (Document Properties del lector, crawlers que indexan el PDF directo) — cero
// dependencia de la cuenta Gumroad, es contenido propio del archivo.
async function stampMetadata(pdfPath, kit, lang = 'en') {
  const bytes = readFileSync(pdfPath);
  const doc = await PDFDocument.load(bytes);
  doc.setTitle(kit.title);
  doc.setSubject(kit.subtitle);
  doc.setAuthor('Chile Trip Kits — viajesypanoramas.cl');
  doc.setCreator('guias.viajesypanoramas.cl');
  doc.setKeywords(
    lang === 'es'
      ? [kit.title, 'itinerario Chile', 'guía de viaje imprimible', 'planificador de viaje PDF', kit.subtitle]
      : [kit.title, 'Chile itinerary', 'printable travel guide', 'PDF trip planner', kit.subtitle]
  );
  // Producer: pdf-lib siempre pisa este campo con su propia firma al hacer save()
  // (no hay flag que lo evite en 1.17.x) — inofensivo, es un campo tecnico estandar,
  // no afecta discoverability. Title/Author/Subject/Keywords/Creator si quedan fijos.
  const out = await doc.save();
  writeFileSync(pdfPath, out);
}

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
  const kitLang = kit.lang ?? LANG;
  const src = join(BUILD, `${kit.id}-${kitLang}.html`);
  const out = join(DIST, `${kit.id}-${kitLang}.pdf`);
  await page.goto(pathToFileURL(src).href, { waitUntil: 'networkidle' });
  await page.pdf({
    path: out,
    format: 'A4',
    printBackground: true,
    margin: { top: '14mm', bottom: '16mm', left: '14mm', right: '14mm' },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `<div style="width:100%;text-align:center;font-size:8px;color:#5b6b7b;font-family:Arial;">
      ${kit.title} · guias.viajesypanoramas.cl · ${kitLang === 'es' ? 'página' : 'page'} <span class="pageNumber"></span>/<span class="totalPages"></span></div>`,
  });
  await stampMetadata(out, kit, kitLang);
  const kb = (statSync(out).size / 1024).toFixed(0);
  console.log(`pdf: ${out} (${kb} KB)`);
  if (statSync(out).size > 20 * 1024 * 1024) throw new Error(`${out} supera 20MB (limite Etsy)`);
  if (statSync(out).size < 100 * 1024) throw new Error(`${out} sospechosamente chico (<100KB)`);
}
await browser.close();
console.log('dist:', readdirSync(DIST).join(', '));
