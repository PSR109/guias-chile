// Builder standalone del kit gen-3 ES `valparaiso-vina-3d-es` (WP 10K.5.13, 2026-08-01).
// No toca compile-html.mjs / build-pdf.mjs / kits.config.mjs (compartidos entre agentes):
// copia la carcasa ES de compile-html.mjs VERBATIM (mismas strings => mismo look gen-2)
// y el render PDF + metadata de build-pdf.mjs, con dos ajustes:
//   1) salida a build/valparaiso-vina-3d-es/ (un nivel mas profundo => prefijo de assets
//      ajustado: ../../assets/pdf.css y ../../../img/og/<cover>).
//   2) corre para UN solo kit (el de kit-valparaiso-vina-3d-es.config.mjs).
// Uso: node build-valparaiso-vina-3d-es.mjs

import { writeFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';
import { PDFDocument } from 'pdf-lib';
import { extractGuide, pickSections } from './lib/extract-guide.mjs';
import { topPois } from './lib/panoramas.mjs';
import { chromiumPath } from './lib/chromium.mjs';
import { KIT } from './kit-valparaiso-vina-3d-es.config.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, 'build', KIT.id);
const LANG = 'es';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Carcasa ES copiada verbatim de compile-html.mjs (I18N.es). NO traducir ni retocar:
// los PDFs gen-2 ES ya a la venta usan exactamente estas strings.
const T = {
  locale: 'es-CL',
  free: 'Gratis',
  viatorPath: '/es-CL',
  dayWord: 'Día',
  coverLabel: 'Chile Trip Kits · Itinerario imprimible',
  coverBrand: 'Del equipo detrás de guias.viajesypanoramas.cl y viajesypanoramas.cl · edición 2026',
  tocTitle: (n) => `Tu ruta de ${n} días de un vistazo`,
  tocNote: 'Cada sección está condensada desde nuestras guías completas y gratuitas, ordenada en un plan día a día que puedes seguir. Los enlaces son clicables en la versión digital.',
  routeTitle: 'Mapa de la ruta día a día',
  routeNote: 'Esquema generado desde las paradas del itinerario — úsalo para entender la forma del viaje, no para navegar.',
  routeAria: 'Vista general de la ruta',
  routeCaption: 'Ruta esquemática — distancias no a escala. El norte está arriba.',
  budgetTitle: 'Presupuesto: cuánto cuestan las cosas (2026)',
  budgetNote: 'Precios de referencia en pesos chilenos; confirma siempre los valores vigentes antes de reservar.',
  checklistTitle: 'Checklist pre-viaje',
  poisTitle: 'Bonus: más ideas a lo largo de la ruta',
  poisNote: 'Seleccionados desde nuestro catálogo Panoramas de más de 25.000 lugares en Chile:',
  faqTitle: 'Preguntas frecuentes',
  resourcesTitle: 'Reserva con anticipación y sigue explorando',
  toursBox: 'Tours con cancelación gratis:',
  appsBox: 'Apps gratuitas complementarias:',
  guidesLabel: 'Guías completas (actualizadas):',
  guidesUrl: 'https://guias.viajesypanoramas.cl/',
  guidesText: 'guias.viajesypanoramas.cl',
  nearbyLabel: 'Qué hacer cerca, hoy:',
  affiliateNote: 'Algunos enlaces son de afiliado: reservar a través de ellos apoya este kit sin costo extra para ti. &copy; 2026 viajesypanoramas.cl. Solo para uso personal; no redistribuir este archivo.',
  odblNote: 'Datos de lugares derivados de OpenStreetMap. &copy; colaboradores de OpenStreetMap, disponibles bajo la',
};

const fmtClp = (n) => (n > 0 ? `CLP ${n.toLocaleString(T.locale)}` : T.free);

const AFF = {
  viator: (q) => `https://www.viator.com${T.viatorPath}/searchResults/all?text=${encodeURIComponent(q)}&pid=P00308789&mcid=42383&medium=link`,
  gyg: (q) => `https://www.getyourguide.com/s/?q=${encodeURIComponent(q)}&partner_id=BZYZJT4`,
};

// Mapa esquematico de ruta: SVG inline autogenerado desde kit.route (mismo codigo
// que compile-html.mjs; proyeccion equirectangular simple, cero requests externos).
function routeMapSvg(route) {
  const W = 640, H = 420, PAD = 46;
  const lats = route.map((s) => s.lat);
  const lons = route.map((s) => s.lon);
  const minLat = Math.min(...lats), minLon = Math.min(...lons);
  const spanLat = Math.max(Math.max(...lats) - minLat, 0.2);
  const spanLon = Math.max(Math.max(...lons) - minLon, 0.2);
  const x = (lon) => PAD + ((lon - minLon) / spanLon) * (W - 2 * PAD);
  const y = (lat) => H - PAD - ((lat - minLat) / spanLat) * (H - 2 * PAD);

  const stops = [];
  for (const s of route) {
    const last = stops[stops.length - 1];
    if (last && last.name === s.name) { last.days.push(s.day); continue; }
    stops.push({ name: s.name, lat: s.lat, lon: s.lon, days: [s.day] });
  }
  const pts = stops.map((s) => `${x(s.lon).toFixed(1)},${y(s.lat).toFixed(1)}`).join(' ');
  const nodes = stops
    .map((s, i) => {
      const cx = x(s.lon), cy = y(s.lat);
      const label = s.days.map((d) => `D${d}`).join('·');
      const ty = i % 2 === 0 ? cy - 10 : cy + 19;
      return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="6" fill="#0d6e6e"/>
<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="2.4" fill="#fff"/>
<text x="${cx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" font-family="-apple-system, Segoe UI, Arial, sans-serif" font-size="11" font-weight="700" fill="#c0512f">${label}</text>`;
    })
    .join('\n');
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${T.routeAria}">
<rect width="${W}" height="${H}" fill="#f2f6f8" rx="10"/>
<polyline points="${pts}" fill="none" stroke="#0d6e6e" stroke-width="2.5" stroke-dasharray="7 5" stroke-linejoin="round"/>
${nodes}
<text x="${PAD}" y="${H - 14}" font-family="-apple-system, Segoe UI, Arial, sans-serif" font-size="10" fill="#5b6b7b">${T.routeCaption}</text>
</svg>`;
}

function buildKitHtml(kit) {
  const cache = {};
  const g = (slug) => (cache[slug] ??= extractGuide(LANG, slug));

  const daysHtml = kit.days
    .map((day, i) => {
      const body = day.pulls.map((p) => pickSections(g(p.guide), p.headings)).join('\n');
      return `<section class="day" id="day-${i + 1}">
  <span class="day-num">${T.dayWord.toUpperCase()} ${i + 1}</span>
  <h2>${esc(day.title)}</h2>
  <p class="intro">${esc(day.intro)}</p>
  ${body}
</section>`;
    })
    .join('\n');

  const toc = kit.days
    .map((d, i) => `<li><b>${T.dayWord} ${i + 1}:</b> ${esc(d.title)}</li>`)
    .join('\n');

  const routeLegend = kit.route
    .map((s) => `<li><b>${T.dayWord} ${s.day}:</b> ${esc(s.name)}</li>`)
    .join('\n');

  const budget = kit.budget
    .map((b) => `<h4>${esc(g(b.guide).title)}</h4>\n${pickSections(g(b.guide), [b.heading])}`)
    .join('\n');

  const checklist = kit.checklist.map((c) => `<li>${esc(c)}</li>`).join('\n');

  const pois = topPois({ comunas: kit.poiComunas, limit: kit.poiLimit, lang: LANG, exclude: kit.poiExclude ?? [] })
    .map(
      (p) => `<div class="poi"><b>${esc(p.nombre)}</b>
  <div class="meta">${esc(p.categoria)}${p.horas ? ` · ~${p.horas}h` : ''} · ${fmtClp(p.precioClp)}</div>
  <div>${esc(p.descripcion)}</div></div>`
    )
    .join('\n');

  const poisSection = pois
    ? `<section id="pois" class="block">
  <h2>${T.poisTitle}</h2>
  <p>${T.poisNote}</p>
  ${pois}
</section>`
    : '';

  const faqSeen = new Set();
  const faq = kit.faqFrom
    .flatMap((slug) => g(slug).faq)
    .filter((x) => !faqSeen.has(x.q) && faqSeen.add(x.q))
    .map((x) => `<div class="qa"><p class="q">${esc(x.q)}</p><p class="a">${esc(x.a)}</p></div>`)
    .join('\n');

  const q = kit.affQuery ?? kit.title;
  return `<!doctype html>
<html lang="${LANG}">
<head>
<meta charset="utf-8">
<title>${esc(kit.title)}</title>
<link rel="stylesheet" href="../../assets/pdf.css">
</head>
<body>
<section id="cover">
  <div class="label">${T.coverLabel}</div>
  <h1>${esc(kit.title)}</h1>
  <p class="subtitle">${esc(kit.subtitle)}</p>
  <img src="../../../img/og/${kit.coverImage}" alt="${esc(kit.title)}">
  <p class="brand">${T.coverBrand}</p>
</section>
<section id="toc" class="block">
  <h2>${T.tocTitle(kit.days.length)}</h2>
  <ol>${toc}</ol>
  <p class="footer-note">${T.tocNote}</p>
</section>
<section id="route" class="block">
  <h2>${T.routeTitle}</h2>
  ${routeMapSvg(kit.route)}
  <ol class="route-legend">${routeLegend}</ol>
  <p class="footer-note">${T.routeNote}</p>
</section>
${daysHtml}
<section id="budget" class="block">
  <h2>${T.budgetTitle}</h2>
  ${budget}
  <p class="footer-note">${T.budgetNote}</p>
</section>
<section id="checklist" class="block">
  <h2>${T.checklistTitle}</h2>
  <ul class="checklist">${checklist}</ul>
</section>
${poisSection}
<section id="faq" class="block">
  <h2>${T.faqTitle}</h2>
  ${faq}
</section>
<section id="resources" class="block resources">
  <h2>${T.resourcesTitle}</h2>
  <div class="box"><b>${T.toursBox}</b><br>
    Viator: <a href="${AFF.viator(q)}">${esc(AFF.viator(q))}</a><br>
    GetYourGuide: <a href="${AFF.gyg(q)}">${esc(AFF.gyg(q))}</a>
  </div>
  <div class="box"><b>${T.appsBox}</b><br>
    ${T.guidesLabel} <a href="${T.guidesUrl}">${T.guidesText}</a><br>
    ${T.nearbyLabel} <a href="https://viajesypanoramas.cl/">viajesypanoramas.cl</a>
  </div>
  <p class="footer-note">${T.affiliateNote}</p>
  <p class="footer-note">${T.odblNote} <a href="https://opendatacommons.org/licenses/odbl/">Open Database License (ODbL)</a>.</p>
</section>
</body>
</html>`;
}

// Metadata embebida (mismo criterio que build-pdf.mjs, keywords ES).
async function stampMetadata(pdfPath, kit) {
  const bytes = readFileSync(pdfPath);
  const doc = await PDFDocument.load(bytes);
  doc.setTitle(kit.title);
  doc.setSubject(kit.subtitle);
  doc.setAuthor('Chile Trip Kits — viajesypanoramas.cl');
  doc.setCreator('guias.viajesypanoramas.cl');
  doc.setKeywords([kit.title, 'itinerario Chile', 'guía de viaje imprimible', 'planificador de viaje PDF', kit.subtitle]);
  const out = await doc.save();
  writeFileSync(pdfPath, out);
}

mkdirSync(OUT_DIR, { recursive: true });

const html = buildKitHtml(KIT);
const htmlPath = join(OUT_DIR, `${KIT.id}.html`);
writeFileSync(htmlPath, html);
console.log(`build: ${htmlPath} (${(html.length / 1024).toFixed(0)} KB)`);

const browser = await chromium.launch({ executablePath: chromiumPath() });
const page = await browser.newPage();
const pdfPath = join(OUT_DIR, `${KIT.id}.pdf`);
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });
await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '14mm', bottom: '16mm', left: '14mm', right: '14mm' },
  displayHeaderFooter: true,
  headerTemplate: '<span></span>',
  footerTemplate: `<div style="width:100%;text-align:center;font-size:8px;color:#5b6b7b;font-family:Arial;">
    ${KIT.title} · guias.viajesypanoramas.cl · página <span class="pageNumber"></span>/<span class="totalPages"></span></div>`,
});
await browser.close();
await stampMetadata(pdfPath, KIT);

const bytes = statSync(pdfPath).size;
const doc = await PDFDocument.load(readFileSync(pdfPath));
console.log(`pdf: ${pdfPath} (${(bytes / 1024).toFixed(0)} KB, ${doc.getPageCount()} páginas)`);
if (bytes > 20 * 1024 * 1024) throw new Error(`${pdfPath} supera 20MB (limite Etsy)`);
if (bytes < 100 * 1024) throw new Error(`${pdfPath} sospechosamente chico (<100KB)`);
