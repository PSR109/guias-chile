// Build standalone del kit gen-3 ES `carretera-austral-norte-7d-es` (WP 10K.5.14, 2026-08-01).
// NO toca kits.config.mjs ni compile-html.mjs/build-pdf.mjs (archivos compartidos): este
// script es autocontenido y replica la carcasa ES de compile-html.mjs + el paso PDF de
// build-pdf.mjs, con el contenido del kit inline.
//
// Salida:
//   build/carretera-austral-norte-7d-es/kit.html          (contenido)
//   build/carretera-austral-norte-7d-es/carretera-austral-norte-7d-es.pdf
//   dist/carretera-austral-norte-7d-es.pdf                (copia — la referencia bundle-sur-de-chile)
//
// Fuentes de contenido (regla anti-alucinacion: solo guias del repo + catalogo Panoramas):
//   - carretera-austral.html (ES, raiz) — secciones, presupuesto, FAQ
//   - puerto-montt.html (ES, raiz) — llegada El Tepual, Angelmó, presupuesto, FAQ
//   - catalogo Panoramas (descripcion_es) — 10 POIs bonus editoriales de Coyhaique/Aysén
//
// Uso: node build-austral-norte.mjs   (desde trip-kits/)

import { writeFileSync, mkdirSync, copyFileSync, statSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { PDFDocument } from 'pdf-lib';
import { extractGuide, pickSections } from './lib/extract-guide.mjs';
import { topPois } from './lib/panoramas.mjs';
import { chromiumPath } from './lib/chromium.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, 'build', 'carretera-austral-norte-7d-es');
const DIST = join(HERE, 'dist');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Carcasa ES: strings IDENTICAS a I18N.es de compile-html.mjs (gen-2, 2026-08-01).
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

// Mapa esquematico de ruta: identico al de compile-html.mjs (SVG inline, cero requests).
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

// ---------- Definicion del kit ----------

const D = (title, intro, pulls) => ({ title, intro, pulls });
const R = (day, name, lat, lon) => ({ day, name, lat, lon });

const KIT = {
  id: 'carretera-austral-norte-7d-es',
  lang: 'es',
  title: 'Carretera Austral Norte en 7 días: de Puerto Montt a Coyhaique',
  subtitle: 'Ferries entre fiordos, ripio y glaciares: la mitad norte de la Ruta 7 con toda la logística de bencina y ferris resuelta, presupuesto 2026 y checklist imprimible',
  priceUsd: 14.9,
  gumroadPermalink: 'carretera-austral-norte-7d-es',
  affQuery: 'Carretera Austral',
  coverImage: 'carretera-austral.jpg',
  days: [
    D('Llegada a Puerto Montt: auto, provisiones y Angelmó',
      'Aterriza en El Tepual (PMC), retira el auto arrendado —avisa con anticipación que harás la Carretera Austral, porque varias agencias restringen o cobran extra por ripio y ferry— y haz la compra grande de provisiones: al sur todo es más caro y hay menos oferta. Cierra la tarde en el mercado de Angelmó, el muelle desde donde zarpan los ferris de largo recorrido a Chaitén.',
      [
        { guide: 'puerto-montt', headings: ['4. El aeropuerto El Tepual, puerta de entrada al sur', '1. Angelmó', '5. Rumbo a Chiloé o a la Carretera Austral'] },
      ]),
    D('Puerto Montt a Hornopirén: el inicio de la Ruta 7',
      'Los primeros 110 km son los más fáciles de toda la ruta, mayormente pavimentados. Es el día para entrar en ritmo: llena el estanque antes de salir de Puerto Montt y llega con luz a Hornopirén, porque el ferry a Caleta Gonzalo sale temprano y con cupo limitado de vehículos.',
      [
        { guide: 'carretera-austral', headings: ['1. Qué es la Carretera Austral', '2. Puerto Montt–Hornopirén y el cruce a Pumalín'] },
      ]),
    D('Ferry a Caleta Gonzalo y Parque Pumalín',
      'El cruce Hornopirén–Leptepu–Fiordo Largo–Caleta Gonzalo combina dos navegaciones con un puente terrestre corto y te deja dentro del Parque Pumalín: bosque valdiviano de alerces milenarios, senderos cortos a saltos de agua y miradores del volcán Chaitén. Noche en Chaitén: primera parada seria de bencina al sur de Puerto Montt.',
      [
        { guide: 'carretera-austral', headings: ['Ferries: cuáles son obligatorios'] },
      ]),
    D('Desvío a Futaleufú: el río turquesa',
      'Desde Villa Santa Lucía son unos 75 km de desvío hasta uno de los ríos con mejor rafting del mundo: aguas turquesa de deshielo glaciar y rápidos de clase III a V. ¿No haces rafting? El valle justifica igual el desvío, con cabalgatas y pesca con mosca como alternativas tranquilas.',
      [
        { guide: 'carretera-austral', headings: ['3. Futaleufú: rafting de clase mundial'] },
      ]),
    D('Día largo al sur: La Junta y Puyuhuapi hasta Coyhaique',
      'El día de más conducción del viaje, por La Junta y Puyuhuapi (termas si te sobra tiempo). Coyhaique es la única ciudad real de la ruta: reabastece TODO —estanque lleno, despensa y efectivo— porque al sur de aquí las distancias entre bencineras se estiran y la señal de celular desaparece por horas.',
      [
        { guide: 'carretera-austral', headings: ['Cómo llegar y cuándo ir'] },
      ]),
    D('Cerro Castillo: las agujas de roca y su laguna glaciar',
      'Antes de seguir al sur, el Parque Nacional Cerro Castillo guarda uno de los treks más espectaculares de la Patagonia: la laguna glaciar bajo las agujas de roca que dan nombre al cerro. Base en Villa Cerro Castillo, a orillas de la Ruta 7.',
      [
        { guide: 'carretera-austral', headings: ['5. Cerro Castillo y Villa O\'Higgins: el fin de la ruta'] },
      ]),
    D('Capillas de Mármol y cierre en Balmaceda',
      'Mañana en bote o kayak a las Capillas de Mármol sobre el lago General Carrera —sal temprano, la luz de la mañana es la mejor para las vetas azules— y después regreso al norte por la misma Ruta 7 hasta el aeropuerto de Balmaceda, junto a Coyhaique, para devolver el auto y volar.',
      [
        { guide: 'carretera-austral', headings: ['4. Puerto Río Tranquilo y las Capillas de Mármol'] },
      ]),
  ],
  route: [
    R(1, 'Puerto Montt', -41.47, -72.94),
    R(2, 'Hornopirén', -41.94, -72.43),
    R(3, 'Chaitén / Pumalín', -42.92, -72.71),
    R(4, 'Futaleufú', -43.19, -71.87),
    R(5, 'Coyhaique', -45.57, -72.07),
    R(6, 'Villa Cerro Castillo', -46.12, -72.16),
    R(7, 'Puerto Río Tranquilo', -46.62, -72.68),
  ],
  checklist: [
    'Auto arrendado habilitado POR ESCRITO para ripio y ferry — avisa a la agencia que harás la Carretera Austral',
    'Ferry Hornopirén–Caleta Gonzalo reservado apenas tengas fechas (los cupos de vehículo se agotan con semanas de anticipación en enero-febrero)',
    'Disciplina de bencina: llena el estanque en CADA estación — Puerto Montt, Chaitén, La Junta y Coyhaique son tus puntos clave; al sur de Coyhaique los tramos sin bencineras superan los 200 km',
    'Efectivo en CLP: ferry, venta informal de bencina en bidones y pueblos chicos no siempre aceptan tarjeta',
    'Mapas descargados offline y playlist lista: hay tramos de horas sin señal, sobre todo al sur de Cochrane',
    'Neumático de repuesto revisado + kit básico — el ripio es duro con las ruedas',
    'Tour a las Capillas de Mármol reservado para la mañana (mejor luz y lago más calmo)',
    'Capas de abrigo e impermeable incluso en enero: en la Patagonia llueve en cualquier época',
    'Alojamiento reservado en Chaitén y Futaleufú si viajas en temporada alta',
    'Itinerario avisado a un contacto: hay tramos sin cobertura donde nadie puede localizarte',
  ],
  budget: [
    { guide: 'carretera-austral', heading: 'Precios orientativos (2026)' },
    { guide: 'puerto-montt', heading: 'Precios orientativos (2026)' },
  ],
  faqFrom: ['carretera-austral', 'puerto-montt'],
  poiComunas: ['Coyhaique', 'Cochrane', 'Puerto Río Tranquilo'],
  // Dedup editorial verificado 2026-08-01: fuera 'Parque Patagonia - Valle Chacabuco'
  // (tipografia corrupta en el catalogo: "praguanas") y 'Bien Nacional Protegido Cerro
  // San Lorenzo' (ficha de stats autogenerada: "19400 hectareas... geomorfologica").
  // El boilerplate restante ("Mirador en Aysén, Chile.", stubs de 47 chars) queda fuera
  // por el corte de limit tras el orden por score. Los 10 que quedan son editoriales
  // reales y NO repiten contenido de los dias 1-7.
  poiExclude: ['Parque Patagonia - Valle Chacabuco', 'Bien Nacional Protegido Cerro San Lorenzo'],
  poiLimit: 10,
};

// ---------- HTML (misma estructura que compile-html.mjs; rutas ajustadas a la subcarpeta) ----------

function buildKitHtml(kit) {
  const cache = {};
  const g = (slug) => (cache[slug] ??= extractGuide('es', slug));

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

  const pois = topPois({ comunas: kit.poiComunas, limit: kit.poiLimit, lang: 'es', exclude: kit.poiExclude })
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
  // El HTML vive en build/carretera-austral-norte-7d-es/ (un nivel mas profundo que
  // los kits del pipeline): el CSS esta dos niveles arriba y la portada tres.
  return `<!doctype html>
<html lang="es">
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

// ---------- PDF (mismo paso que build-pdf.mjs: Chromium + metadata pdf-lib ES) ----------

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

if (KIT.route.length !== KIT.days.length) throw new Error('route.length !== days.length');

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(DIST, { recursive: true });

const html = buildKitHtml(KIT);
const htmlPath = join(OUT_DIR, 'kit.html');
writeFileSync(htmlPath, html);
console.log(`build: ${htmlPath} (${(html.length / 1024).toFixed(0)} KB)`);

const pdfPath = join(OUT_DIR, `${KIT.id}.pdf`);
const browser = await chromium.launch({ executablePath: chromiumPath() });
const page = await browser.newPage();
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

const size = statSync(pdfPath).size;
if (size > 20 * 1024 * 1024) throw new Error(`${pdfPath} supera 20MB (limite Etsy)`);
if (size < 100 * 1024) throw new Error(`${pdfPath} sospechosamente chico (<100KB)`);

const distPath = join(DIST, `${KIT.id}.pdf`);
copyFileSync(pdfPath, distPath);
console.log(`pdf: ${pdfPath} (${(size / 1024).toFixed(0)} KB)`);
console.log(`pdf: ${distPath} (copia para el bundle Sur de Chile)`);
